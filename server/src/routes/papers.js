import express from "express";
import multer from "multer";
import supabase from "../services/supabase.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store in memory for direct upload

// Get all papers
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Upload paper (metadata + file)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, course_id, year, uploaded_by } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    
    // Validate course_id is a valid integer
    const courseIdInt = parseInt(course_id);
    if (isNaN(courseIdInt)) {
      return res.status(400).json({ 
        error: `Invalid course ID: "${course_id}". Please select a valid course.` 
      });
    }
    
    // Check if course exists
    const { data: courseExists, error: courseError } = await supabase
      .from("courses")
      .select("id, code, name")
      .eq("id", courseIdInt)
      .single();
    
    if (courseError || !courseExists) {
      const { data: allCourses } = await supabase
        .from("courses")
        .select("code")
        .order("code");
      
      const availableCourses = allCourses?.map(c => c.code).join(", ") || "No courses available";
      
      return res.status(400).json({ 
        error: `Course ID ${courseIdInt} does not exist. Available courses: ${availableCourses}` 
      });
    }

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("papers")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) throw storageError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("papers")
      .getPublicUrl(fileName);

    // Insert metadata into 'papers' table
    const { data, error } = await supabase
      .from("papers")
      .insert([{ title, course_id: courseIdInt, year, file_url: urlData.publicUrl, uploaded_by }])
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Upload error:", err);
    
    // Handle specific database errors
    if (err.code === '23503') {
      return res.status(400).json({ 
        error: "Invalid course selected. Please choose from the available courses." 
      });
    }
    
    if (err.code === '23505') {
      return res.status(400).json({ 
        error: "A paper with this information already exists." 
      });
    }
    
    res.status(500).json({ 
      error: err.message || "An unexpected error occurred during upload." 
    });
  }
});

export default router;
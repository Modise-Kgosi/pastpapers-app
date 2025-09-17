import express from "express";
import multer from "multer";
import supabase from "../services/supabase.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store in memory for direct upload

// Upload paper (metadata + file)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, course_id, year, uploaded_by } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

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
    const { publicUrl, error: urlError } = supabase.storage
      .from("papers")
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    // Insert metadata into 'papers' table
    const { data, error } = await supabase
      .from("papers")
      .insert([{ title, course_id, year, file_url: publicUrl, uploaded_by }]);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
import express from "express";
import supabase from "../services/supabase.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("code", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new course
router.post("/", async (req, res) => {
  try {
    const { code, name, faculty } = req.body;

    const { data, error } = await supabase
      .from("courses")
      .insert([{ code, name, faculty }])
      .select();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
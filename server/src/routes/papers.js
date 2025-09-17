import express from "express";
import supabase from "../services/supabase.js";

const router = express.Router();

// Example: fetch list of papers
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("papers")
    .select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Example: upload paper metadata
router.post("/", async (req, res) => {
  const { title, course, year } = req.body;
  const { data, error } = await supabase
    .from("papers")
    .insert([{ title, course, year }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
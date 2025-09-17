import { useState } from "react";
import api from "../utils/api";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/papers", { title, course, year });
      console.log(res.data);
      alert("Paper uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md mx-auto mt-6">
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="p-2 border rounded"/>
      <input type="text" placeholder="Course Code" value={course} onChange={e => setCourse(e.target.value)} className="p-2 border rounded"/>
      <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} className="p-2 border rounded"/>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Upload Paper</button>
    </form>
  );
}
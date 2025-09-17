import { useState } from "react";
import api from "../utils/api";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("course_id", course);
    formData.append("year", year);
    formData.append("uploaded_by", "UUID_STUDENT"); // replace with real user UUID after auth
    formData.append("file", file);

    try {
      const res = await api.post("/papers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      alert("Paper uploaded successfully!");
      setTitle("");
      setCourse("");
      setYear("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md mx-auto mt-6">
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="p-2 border rounded"/>
      <input type="number" placeholder="Course ID" value={course} onChange={e => setCourse(e.target.value)} className="p-2 border rounded"/>
      <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} className="p-2 border rounded"/>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} className="p-2 border rounded"/>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2">Upload Paper</button>
    </form>
  );
}
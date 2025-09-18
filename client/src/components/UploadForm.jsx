import { useState, useEffect } from "react";
import api from "../utils/api";
import supabase from "../utils/supabaseClient";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");
    if (!user) return alert("You must be logged in to upload");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("course_id", course);
    formData.append("year", year);
    formData.append("uploaded_by", user.id);
    formData.append("file", file);

    try {
      const res = await api.post("/papers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload success:", res.data);
      alert("Paper uploaded successfully!");
      setTitle("");
      setCourse("");
      setYear("");
      setFile(null);
      // Reset file input
      document.getElementById("file-upload").value = "";
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      let errorMessage = "Upload failed";
      if (err.response?.data?.error) {
        errorMessage = `Upload failed: ${err.response.data.error}`;
      } else if (err.message) {
        errorMessage = `Upload failed: ${err.message}`;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paper Title</label>
          <input 
            type="text" 
            placeholder="Enter paper title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
          <input 
            type="text" 
            placeholder="Enter course name or code" 
            value={course} 
            onChange={e => setCourse(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <input 
            type="number" 
            placeholder="2024" 
            value={year} 
            onChange={e => setYear(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={e => setFile(e.target.files[0])} 
              className="hidden" 
              id="file-upload"
              required
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-gray-400 text-4xl mb-2">📄</div>
              <p className="text-gray-600">Click to select PDF file</p>
              {file && <p className="text-green-600 mt-2">Selected: {file.name}</p>}
            </label>
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg"
        >
          Upload Paper
        </button>
      </form>
    </div>
  );
}
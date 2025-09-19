import { useState, useEffect } from "react";
import api from "../utils/api";
import supabase from "../utils/supabaseClient";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [courseInput, setCourseInput] = useState(""); // For typing
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses from API...");
        const response = await api.get("/courses");
        console.log("Courses fetched:", response.data);
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses based on input
  const handleCourseInputChange = (value) => {
    setCourseInput(value);
    
    if (value.length > 0) {
      const filtered = courses.filter(course => 
        course.code.toLowerCase().includes(value.toLowerCase()) ||
        course.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCourses([]);
      setShowSuggestions(false);
      setCourse(""); // Clear selected course
    }
  };

  // Select a course from suggestions
  const selectCourse = (selectedCourse) => {
    setCourse(selectedCourse.id);
    setCourseInput(`${selectedCourse.code} - ${selectedCourse.name}`);
    setShowSuggestions(false);
  };

  // Validate if the entered course exists
  const validateCourse = () => {
    if (!courseInput.trim()) return false;
    
    const foundCourse = courses.find(course => 
      course.code.toLowerCase() === courseInput.toLowerCase() ||
      `${course.code} - ${course.name}`.toLowerCase() === courseInput.toLowerCase()
    );
    
    if (foundCourse) {
      setCourse(foundCourse.id);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");
    if (!user) return alert("You must be logged in to upload");
    
    // Validate course
    if (!course || !validateCourse()) {
      return alert("Please select a valid course from the suggestions. Available courses: " + 
        courses.map(c => c.code).join(", "));
    }

    console.log("Form submission data:", {
      title,
      course_id: course,
      year,
      uploaded_by: user.id,
      file: file.name
    });

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
      setCourseInput("");
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
      
      // Add specific error for course issues
      if (err.response?.data?.error?.includes("invalid input syntax for type integer")) {
        errorMessage = "Invalid course selected. Please choose from: " + 
          courses.map(c => c.code).join(", ");
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
          {loading ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              Loading courses...
            </div>
          ) : (
            <div className="relative">
              <input 
                type="text"
                value={courseInput}
                onChange={(e) => handleCourseInputChange(e.target.value)}
                placeholder="Type course code or name (e.g., NSE, BIDA, ACC101)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                autoComplete="off"
              />
              {showSuggestions && filteredCourses.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {filteredCourses.map(courseItem => (
                    <div 
                      key={courseItem.id}
                      onClick={() => selectCourse(courseItem)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{courseItem.code}</div>
                      <div className="text-sm text-gray-600">{courseItem.name}</div>
                      <div className="text-xs text-gray-500">{courseItem.faculty}</div>
                    </div>
                  ))}
                </div>
              )}
              {courseInput && filteredCourses.length === 0 && showSuggestions && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-4">
                  <div className="text-gray-500 text-sm">
                    No courses found. Available courses: {courses.map(c => c.code).join(", ")}
                  </div>
                </div>
              )}
            </div>
          )}
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
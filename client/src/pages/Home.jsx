import React, { useEffect, useState } from "react";
import api from "../utils/api";
import supabase from "../utils/supabaseClient";
import "./Home.css";

export default function Home() {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [yearRange, setYearRange] = useState({ min: "", max: "" });
  
  // Upload form states
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Get unique courses and years for filters
  const uniqueCourses = [...new Set(papers.map(paper => paper.course))].filter(Boolean).sort();
  const uniqueYears = [...new Set(papers.map(paper => paper.year))].filter(Boolean).sort((a, b) => b - a);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await api.get("/papers");
        setPapers(res.data);
        setFilteredPapers(res.data);
      } catch (err) {
        console.error("Error fetching papers:", err);
      } finally {
        setLoading(false);
      }
    };
    
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    
    fetchPapers();
    getUser();
  }, []);

  // Filter papers based on search and filter criteria
  useEffect(() => {
    let filtered = papers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter
    if (selectedCourse) {
      filtered = filtered.filter(paper => paper.course === selectedCourse);
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(paper => paper.year.toString() === selectedYear);
    }

    // Year range filter
    if (yearRange.min) {
      filtered = filtered.filter(paper => paper.year >= parseInt(yearRange.min));
    }
    if (yearRange.max) {
      filtered = filtered.filter(paper => paper.year <= parseInt(yearRange.max));
    }

    setFilteredPapers(filtered);
  }, [papers, searchTerm, selectedCourse, selectedYear, yearRange]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("");
    setSelectedYear("");
    setYearRange({ min: "", max: "" });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");
    if (!user) return alert("You must be logged in to upload");

    setUploading(true);
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
      
      // Reset form
      setTitle("");
      setCourse("");
      setYear("");
      setFile(null);
      setShowUploadModal(false);
      
      // Refresh papers list
      const refreshRes = await api.get("/papers");
      setPapers(refreshRes.data);
      setFilteredPapers(refreshRes.data);
      
    } catch (err) {
      console.error("Upload error:", err);
      let errorMessage = "Upload failed";
      if (err.response?.data?.error) {
        errorMessage = `Upload failed: ${err.response.data.error}`;
      } else if (err.message) {
        errorMessage = `Upload failed: ${err.message}`;
      }
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setTitle("");
    setCourse("");
    setYear("");
    setFile(null);
  };

    return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-title">
          <h1>PAST PAPERS HUB</h1>
        </div>        {/* Search & Filter Hub */}
        <div className={`search-filter-hub ${searchExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="search-section">
            <div className="main-search">
              <input 
                type="text" 
                placeholder="Search papers by title or course..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setSearchExpanded(true)}
                className="main-search-input"
              />
              <div className="search-icon">�</div>
            </div>
          </div>
          
          <div className={`filters-section ${searchExpanded ? 'show' : 'hide'}`}>
            <div className="filter-group">
              <label>Course</label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="filter-select"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Year</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="filter-select"
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group year-range">
              <label>Year Range</label>
              <div className="year-range-inputs">
                <input 
                  type="number" 
                  placeholder="From"
                  value={yearRange.min}
                  onChange={(e) => setYearRange(prev => ({ ...prev, min: e.target.value }))}
                  className="year-input"
                />
                <span className="range-separator">-</span>
                <input 
                  type="number" 
                  placeholder="To"
                  value={yearRange.max}
                  onChange={(e) => setYearRange(prev => ({ ...prev, max: e.target.value }))}
                  className="year-input"
                />
              </div>
            </div>
            
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
            
            <button 
              onClick={() => setSearchExpanded(false)} 
              className="collapse-btn"
              title="Collapse filters"
            >
              ↑
            </button>
          </div>
          
          <div className={`results-summary ${searchExpanded ? 'show' : 'hide'}`}>
            <span className="results-count">
              {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Standalone Upload Button */}
        <button 
          className="upload-plus-btn standalone" 
          onClick={() => setShowUploadModal(true)}
          title="Upload new paper"
        >
          +
        </button>

        {/* Browse Papers Section */}
        <div className="papers-section">
          <div className="papers-header">
            <h2>Papers</h2>
          </div>
          
          <div className="papers-grid">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading papers...</p>
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <p>{papers.length === 0 ? "No papers found." : "No papers match your search criteria."}</p>
                <span>{papers.length === 0 ? "Upload your first paper to get started" : "Try adjusting your filters"}</span>
              </div>
            ) : (
              filteredPapers.map(paper => (
                <div key={paper.id} className="paper-card">
                  <div className="paper-content">
                    <h3 className="paper-title">{paper.title}</h3>
                    <div className="paper-tags">
                      <span className="tag course-tag">{paper.course}</span>
                      <span className="tag year-tag">{paper.year}</span>
                    </div>
                  </div>
                  <div className="paper-actions">
                    <span className="file-type">PDF Document</span>
                    <a 
                      href={paper.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="download-btn"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Past Paper</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="upload-form">
              <div className="form-group">
                <label>Paper Title</label>
                <input 
                  type="text" 
                  placeholder="Enter paper title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Course</label>
                <input 
                  type="text" 
                  placeholder="Enter course name or code" 
                  value={course} 
                  onChange={e => setCourse(e.target.value)} 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Year</label>
                <input 
                  type="number" 
                  placeholder="2024" 
                  value={year} 
                  onChange={e => setYear(e.target.value)} 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>PDF File</label>
                <div className="file-upload-area">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={e => setFile(e.target.files[0])} 
                    className="file-input" 
                    id="file-upload-modal"
                    required
                  />
                  <label htmlFor="file-upload-modal" className="file-upload-label">
                    <div className="file-icon">📄</div>
                    <p>Click to select PDF file</p>
                    {file && <p className="file-selected">Selected: {file.name}</p>}
                  </label>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="upload-submit-btn"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Paper"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

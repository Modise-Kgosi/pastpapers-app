import { useEffect, useState } from "react";
import api from "../utils/api";
import PaperList from "../components/PaperList";

export default function Browse() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await api.get("/papers");
        setPapers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPapers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">Browse Past Papers</h1>
          <p className="text-gray-600 text-lg">Find and download past examination papers</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Search papers..." 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <PaperList papers={papers} />
        </div>
      </div>
    </div>
  );
}
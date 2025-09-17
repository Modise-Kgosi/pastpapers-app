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
    <div>
      <h1 className="text-2xl font-bold text-center mt-6">Browse Past Papers</h1>
      <PaperList papers={papers} />
    </div>
  );
}
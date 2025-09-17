export default function PaperList({ papers }) {
  return (
    <div className="mt-6 max-w-2xl mx-auto">
      {papers.length === 0 ? (
        <p>No papers found.</p>
      ) : (
        papers.map(paper => (
          <div key={paper.id} className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="font-bold">{paper.title}</h2>
              <p>{paper.course} | {paper.year}</p>
            </div>
            <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">Download</a>
          </div>
        ))
      )}
    </div>
  );
}
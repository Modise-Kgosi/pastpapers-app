export default function PaperList({ papers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {papers.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <p className="text-gray-500 text-lg">No papers found.</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      ) : (
        papers.map(paper => (
          <div key={paper.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{paper.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{paper.course}</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">{paper.year}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">PDF Document</span>
              <a 
                href={paper.file_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
              >
                Download
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
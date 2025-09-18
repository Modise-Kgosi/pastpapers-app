export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Welcome to PaperHub</h1>
        <p className="mb-8 text-gray-700 text-lg">Your central hub for past papers at BAC. Search, upload, and access resources easily.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/browse" className="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Browse Papers</a>
          <a href="/upload" className="px-6 py-3 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition">Upload Paper</a>
        </div>
      </div>
    </div>
  );
}

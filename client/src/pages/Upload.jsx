import UploadForm from "../components/UploadForm";

export default function Upload() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Upload Past Paper</h1>
          <p className="text-gray-600 text-lg">Share your past papers with fellow students</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
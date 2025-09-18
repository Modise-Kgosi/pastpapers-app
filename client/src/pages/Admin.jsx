export default function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage courses, papers, and users</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Manage Courses</h3>
            <p className="text-gray-600 mb-4">Add, edit, or remove courses</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Manage Courses</button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Manage Papers</h3>
            <p className="text-gray-600 mb-4">Review and moderate uploaded papers</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Manage Papers</button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Manage Users</h3>
            <p className="text-gray-600 mb-4">View and manage user accounts</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Manage Users</button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">PaperHub</h1>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}
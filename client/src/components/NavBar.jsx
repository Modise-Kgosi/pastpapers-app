import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-extrabold text-2xl text-blue-700 tracking-tight">PaperHub</span>
      </div>
      <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-0">
        {/* Show main navigation only if NOT on auth pages */}
        {!isAuthPage && (
          <>
            <Link to="/" className="px-3 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium transition">Home</Link>
            <Link to="/browse" className="px-3 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium transition">Browse</Link>
            <Link to="/upload" className="px-3 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium transition">Upload</Link>
            <Link to="/admin" className="px-3 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium transition">Admin</Link>
          </>
        )}
        
        {/* Auth buttons */}
        {!user && !isAuthPage && <Link to="/login" className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Login</Link>}
        {!user && !isAuthPage && <Link to="/register" className="px-3 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition">Register</Link>}
        
        {/* Show login/register links on auth pages */}
        {isAuthPage && location.pathname === '/login' && (
          <Link to="/register" className="px-3 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition">Register</Link>
        )}
        {isAuthPage && location.pathname === '/register' && (
          <Link to="/login" className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Login</Link>
        )}
        
        {user && <button onClick={handleLogout} className="px-3 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition">Logout</button>}
      </div>
    </nav>
  );
}
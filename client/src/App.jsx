import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Upload from "./pages/Upload";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import supabase from "./utils/supabaseClient";


function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (user === undefined) return null; // loading
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    // Prevent flash by setting a small delay for initial load
    const timer = setTimeout(() => setIsInitialLoad(false), 50);
    return () => clearTimeout(timer);
  }, []);

  // If it's an auth page and still initial loading, show nothing
  if (isAuthPage && isInitialLoad) {
    return null;
  }

  return (
    <div className={isAuthPage ? 'auth-page' : ''}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    // Update path on route changes
    setCurrentPath(window.location.pathname);
  }, []);

  // If on auth pages, render them directly without router wrapper
  if (currentPath === '/login') {
    return <Login isStandalone={true} />;
  }
  
  if (currentPath === '/register') {
    return <Register isStandalone={true} />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

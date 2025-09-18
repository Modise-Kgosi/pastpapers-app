import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    if (!error && data?.session) {
      navigate("/");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider) => {
    setError("");
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => handleOAuth("google")}
            className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleOAuth("azure")}
            className="w-full bg-blue-800 text-white py-2 rounded font-semibold hover:bg-blue-900 transition"
          >
            Sign in with Microsoft
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Login;

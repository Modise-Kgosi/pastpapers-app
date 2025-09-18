import React, { useState } from "react";
import "./Login.css";
import supabase from "../utils/supabaseClient";

const Login = ({ isStandalone = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path) => {
    if (isStandalone) {
      window.location.href = path;
    } else {
      window.history.pushState({}, '', path);
      window.location.reload();
    }
  };

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
      handleNavigation("/");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider) => {
    setError("");
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-animated"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-animated"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="oauth-buttons">
          <button
            onClick={() => handleOAuth("google")}
            className="btn-google"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleOAuth("azure")}
            className="btn-microsoft"
          >
            Sign in with Microsoft
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="signup-link">
          <p>New? <a href="/register" className="link">Sign Up here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

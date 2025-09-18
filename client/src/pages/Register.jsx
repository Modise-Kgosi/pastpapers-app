import React, { useState } from "react";
import "./Register.css";
import supabase from "../utils/supabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleOAuth = async (provider) => {
    setError("");
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <form onSubmit={handleRegister} className="register-form">
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="oauth-buttons">
          <button
            onClick={() => handleOAuth("google")}
            className="btn-google"
          >
            Sign up with Google
          </button>
          <button
            onClick={() => handleOAuth("azure")}
            className="btn-microsoft"
          >
            Sign up with Microsoft
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="signup-link">
          <p>Already have an account? <a href="/login" className="link">Sign In here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;

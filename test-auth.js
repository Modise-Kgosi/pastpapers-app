import { createClient } from "@supabase/supabase-js";

// Test both keys to see which one works for auth
const supabaseUrl = "https://sxcftgaxbgoixjmgtqlb.supabase.co";

// Current client key (anon)
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Z0Z2F4YmdvaXhqbWd0cWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDEwODMsImV4cCI6MjA3MzcxNzA4M30.XDhp9O7i1SPCwOpO_UEiKPGYDLBh3L0MsHzaXd8E1KQ";

async function testSupabaseAuth() {
  try {
    console.log("Testing Supabase authentication...");
    
    const supabase = createClient(supabaseUrl, anonKey);
    
    // Test basic connection
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("❌ Auth test failed:", error.message);
      
      if (error.message.includes("Invalid API key")) {
        console.log("🔑 API Key issue detected!");
        console.log("Current key role: anon");
        console.log("Make sure you're using the correct anon/public key from your Supabase dashboard");
      }
      return;
    }
    
    console.log("✅ Supabase authentication working");
    console.log("Current user:", user ? "Logged in" : "Not logged in");
    
    // Test sign up with a dummy user to verify the key works
    const { error: signUpError } = await supabase.auth.signUp({
      email: "test@test.com",
      password: "test123456"
    });
    
    if (signUpError && !signUpError.message.includes("already registered")) {
      console.error("❌ Sign up test failed:", signUpError.message);
    } else {
      console.log("✅ Sign up functionality working (or user already exists)");
    }
    
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

testSupabaseAuth();
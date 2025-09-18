import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sxcftgaxbgoixjmgtqlb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Z0Z2F4YmdvaXhqbWd0cWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0MTA4MywiZXhwIjoyMDczNzE3MDgzfQ.ZihfvnX502Nu2P2Vf3Zy5kqmzq-Nj3hj7BQhkUrQUKM";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseSchema() {
  try {
    console.log("Checking database schema...");
    
    // Check current user
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current user ID:", user?.id || "Not logged in");
    
    // Try to get papers table structure
    const { data: papers, error: papersError } = await supabase
      .from("papers")
      .select("*")
      .limit(1);
    
    if (papersError) {
      console.error("Papers table error:", papersError);
    } else {
      console.log("✅ Papers table accessible");
    }
    
    // Check if we can insert a test record (this will show the FK constraint issue)
    const testUserId = "00000000-0000-0000-0000-000000000000"; // UUID format but fake
    const { error: insertError } = await supabase
      .from("papers")
      .insert({
        title: "Test Paper",
        course_id: "TEST101",
        year: 2024,
        file_url: "https://example.com/test.pdf",
        uploaded_by: testUserId
      });
    
    if (insertError) {
      console.error("❌ Insert test failed:", insertError.message);
      
      if (insertError.message.includes("foreign key constraint")) {
        console.log("\n🔧 SOLUTION NEEDED:");
        console.log("The papers table has a foreign key constraint on 'uploaded_by' field.");
        console.log("We need to either:");
        console.log("1. Remove the foreign key constraint, OR");
        console.log("2. Create a users table that matches auth.users");
      }
    } else {
      console.log("✅ Insert test passed");
      // Clean up test record
      await supabase.from("papers").delete().eq("title", "Test Paper");
    }
    
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

checkDatabaseSchema();
import supabase from "./src/services/supabase.js";

async function testDatabase() {
  try {
    console.log("Testing papers table...");
    
    // Try to select from papers table
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .limit(1);
    
    if (error) {
      console.error("❌ Papers table error:", error);
      
      if (error.code === "42P01") {
        console.log("\n🛠️ SOLUTION: You need to create the papers table in Supabase:");
        console.log(`
CREATE TABLE papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  course_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`);
      }
      return;
    }
    
    console.log("✅ Papers table exists and is accessible");
    console.log("Current papers count:", data?.length || 0);
    
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testDatabase();
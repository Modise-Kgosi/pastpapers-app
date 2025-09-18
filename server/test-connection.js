import supabase from "./src/services/supabase.js";

async function testConnection() {
  try {
    console.log("Testing Supabase connection...");
    
    // Test basic connection
    const { data, error } = await supabase
      .from("papers")
      .select("count", { count: "exact", head: true });
    
    if (error) {
      console.error("Database error:", error);
      return;
    }
    
    console.log("✅ Database connection successful");
    console.log("Papers count:", data);
    
    // Test storage bucket
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error("Storage error:", bucketError);
      return;
    }
    
    console.log("✅ Storage connection successful");
    console.log("Available buckets:", buckets.map(b => b.name));
    
    const papersBucket = buckets.find(b => b.name === "papers");
    if (!papersBucket) {
      console.error("❌ 'papers' bucket not found! Please create it in Supabase dashboard.");
    } else {
      console.log("✅ 'papers' bucket exists");
    }
    
  } catch (err) {
    console.error("Connection test failed:", err);
  }
}

testConnection();
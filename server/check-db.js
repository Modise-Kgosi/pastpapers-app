import supabase from './src/services/supabase.js';

async function checkSchema() {
  console.log('Checking courses table...');
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .limit(5);
  
  if (coursesError) {
    console.log('Courses table error:', coursesError);
  } else {
    console.log('Courses table data:', courses);
  }
  
  console.log('\nChecking papers table structure...');
  const { data: papers, error: papersError } = await supabase
    .from('papers')
    .select('*')
    .limit(1);
  
  if (papersError) {
    console.log('Papers table error:', papersError);
  } else {
    console.log('Papers table structure:', papers);
  }
  
  process.exit(0);
}

checkSchema();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzfjujnscwwoiwfnaaxt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Zmp1am5zY3d3b2l3Zm5hYXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDU0NzIsImV4cCI6MjA1NjEyMTQ3Mn0.UgSAUofwhJqME21U86tyAsA7_t-aOKj32eDtxZ3nUJE';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

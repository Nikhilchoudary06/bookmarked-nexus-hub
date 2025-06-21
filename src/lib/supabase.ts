
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rhuiesesyvvyukyvlqwx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodWllc2VzeXZ2eXVreXZscXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTczMTIsImV4cCI6MjA2NjA5MzMxMn0.Frv1X9aYkLZNsDNKyLVucqTTSV3NiTlTmmeKW9iwJ7A"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Bookmark = {
  id: string
  title: string
  url: string
  description?: string
  user_id: string
  created_at: string
}

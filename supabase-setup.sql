-- Run this in your Supabase SQL Editor

-- Create the user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  problem_id TEXT NOT NULL,
  status TEXT,
  notes TEXT,
  favorite BOOLEAN DEFAULT false,
  confidence INTEGER,
  revisit_later BOOLEAN DEFAULT false,
  last_reviewed BIGINT,
  mistakes TEXT,
  last_updated BIGINT,
  UNIQUE(user_id, problem_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- 1. Users can only read their own progress
CREATE POLICY "Users can view their own progress" 
ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can insert their own progress
CREATE POLICY "Users can insert their own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own progress
CREATE POLICY "Users can update their own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own progress
CREATE POLICY "Users can delete their own progress" 
ON user_progress FOR DELETE 
USING (auth.uid() = user_id);

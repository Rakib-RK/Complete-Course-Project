/*
  # Add RLS policy for topics table

  1. Changes
    - Add policy to allow authenticated users to insert topics
    - Add policy to allow everyone to view topics

  2. Security
    - Enable RLS on topics table (if not already enabled)
    - Add policies for read and insert operations
*/

-- Ensure RLS is enabled
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Allow all users to view topics
CREATE POLICY "Topics are viewable by everyone"
  ON topics
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert topics
CREATE POLICY "Authenticated users can insert topics"
  ON topics
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
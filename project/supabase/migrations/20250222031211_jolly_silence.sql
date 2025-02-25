/*
  # Fix topics table RLS policies

  1. Changes
    - Drop existing RLS policies for topics table
    - Create new policies that allow:
      - Everyone to view topics
      - Everyone to insert topics (needed for initial setup)
      - Only authenticated users to update/delete topics
  
  2. Security
    - Maintains data integrity while allowing necessary operations
    - Prevents unauthorized modifications
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON topics;
DROP POLICY IF EXISTS "Authenticated users can insert topics" ON topics;

-- Create new policies
CREATE POLICY "Anyone can view topics"
  ON topics
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert topics"
  ON topics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update topics"
  ON topics
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete topics"
  ON topics
  FOR DELETE
  USING (auth.role() = 'authenticated');
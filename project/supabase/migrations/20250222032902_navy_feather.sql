/*
  # Update RLS policies for tags

  1. Changes
    - Update tags policies to allow public access
    - Remove existing policies and create new ones

  2. Security
    - Enables public access to tags table
    - Removes user-based restrictions
*/

-- Update tags policies
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
DROP POLICY IF EXISTS "Users can create tags" ON tags;
DROP POLICY IF EXISTS "Anyone can manage tags" ON tags;

CREATE POLICY "Anyone can manage tags"
  ON tags
  FOR ALL
  USING (true);
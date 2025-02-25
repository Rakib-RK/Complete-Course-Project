/*
  # Update template policies to allow public access

  1. Changes
    - Drop existing template policies
    - Create new policies allowing public template creation and management
    - Maintain basic security while allowing anonymous access

  2. Security
    - Allow public template creation
    - Allow viewing of public templates
    - Allow template management without authentication
*/

-- Drop existing template policies
DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON templates;
DROP POLICY IF EXISTS "Users can create templates" ON templates;
DROP POLICY IF EXISTS "Users can update own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON templates;

-- Create new policies for public access
CREATE POLICY "Templates are viewable by everyone"
  ON templates
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create templates"
  ON templates
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update templates"
  ON templates
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete templates"
  ON templates
  FOR DELETE
  USING (true);

-- Update questions policies to match template access
DROP POLICY IF EXISTS "Questions are viewable with template" ON questions;
DROP POLICY IF EXISTS "Template owners can manage questions" ON questions;

CREATE POLICY "Questions are viewable by everyone"
  ON questions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage questions"
  ON questions
  FOR ALL
  USING (true);

-- Update template_tags policies
DROP POLICY IF EXISTS "Template tags are viewable by everyone" ON template_tags;

CREATE POLICY "Anyone can manage template tags"
  ON template_tags
  FOR ALL
  USING (true);
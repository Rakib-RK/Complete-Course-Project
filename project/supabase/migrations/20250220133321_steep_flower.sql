/*
  # Initial Schema Setup for Forms Application

  1. New Tables
    - `users`
      - Extended user profile data
    - `templates`
      - Form templates with settings and metadata
    - `questions`
      - Questions belonging to templates
    - `forms`
      - Filled out forms based on templates
    - `answers`
      - Individual answers for form questions
    - `comments`
      - Comments on templates
    - `likes`
      - Template likes
    - `tags`
      - Template tags
    - `template_tags`
      - Many-to-many relationship between templates and tags
    - `topics`
      - Predefined list of template topics
    - `template_access`
      - Access control for restricted templates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE question_type AS ENUM ('single_line', 'multi_line', 'integer', 'checkbox');

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Insert default topics
INSERT INTO topics (name) VALUES 
  ('Education'),
  ('Quiz'),
  ('Survey'),
  ('Feedback'),
  ('Other');

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  topic_id uuid REFERENCES topics(id),
  image_url text,
  is_public boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create template_tags junction table
CREATE TABLE IF NOT EXISTS template_tags (
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, tag_id)
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  question_type question_type NOT NULL,
  order_index integer NOT NULL,
  show_in_table boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create forms table (filled out templates)
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  value text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(form_id, question_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (template_id, user_id)
);

-- Create template_access table for restricted templates
CREATE TABLE IF NOT EXISTS template_access (
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (template_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Templates policies
CREATE POLICY "Public templates are viewable by everyone"
  ON templates
  FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create templates"
  ON templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Questions are viewable with template"
  ON questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM templates 
      WHERE templates.id = template_id 
      AND (templates.is_public = true OR templates.user_id = auth.uid())
    )
  );

CREATE POLICY "Template owners can manage questions"
  ON questions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM templates 
      WHERE templates.id = template_id 
      AND templates.user_id = auth.uid()
    )
  );

-- Forms policies
CREATE POLICY "Forms are viewable by creator and template owner"
  ON forms
  FOR SELECT
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM templates 
      WHERE templates.id = template_id 
      AND templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create forms"
  ON forms
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own forms"
  ON forms
  FOR ALL
  USING (user_id = auth.uid());

-- Create functions for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION search_templates(search_query text)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  score float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.description,
    similarity(t.title || ' ' || COALESCE(t.description, ''), search_query) as score
  FROM templates t
  WHERE 
    t.is_public = true AND
    (
      t.title ILIKE '%' || search_query || '%' OR
      t.description ILIKE '%' || search_query || '%'
    )
  ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_topic_id ON templates(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_template_id ON questions(template_id);
CREATE INDEX IF NOT EXISTS idx_forms_template_id ON forms(template_id);
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_form_id ON answers(form_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_comments_template_id ON comments(template_id);
CREATE INDEX IF NOT EXISTS idx_template_tags_template_id ON template_tags(template_id);
CREATE INDEX IF NOT EXISTS idx_template_tags_tag_id ON template_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_template_access_template_id ON template_access(template_id);
CREATE INDEX IF NOT EXISTS idx_template_access_user_id ON template_access(user_id);
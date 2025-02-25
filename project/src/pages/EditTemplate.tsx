import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, GripVertical, X, Image as ImageIcon, Save } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

type QuestionType = 'single_line' | 'multi_line' | 'integer' | 'checkbox';

interface Question {
  id: string;
  title: string;
  description: string;
  questionType: QuestionType;
  showInTable: boolean;
  orderIndex: number;
}

interface Topic {
  id: string;
  name: string;
}

interface SortableQuestionProps {
  question: Question;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  removeQuestion: (id: string) => void;
}

function SortableQuestion({ question, updateQuestion, removeQuestion }: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
    >
      <div className="flex items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="mt-2 cursor-move"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={question.title}
                onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Question title"
              />
            </div>
            <button
              type="button"
              onClick={() => removeQuestion(question.id)}
              className="ml-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <textarea
            value={question.description}
            onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Question description (optional)"
            rows={2}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id={`showInTable-${question.id}`}
              checked={question.showInTable}
              onChange={(e) => updateQuestion(question.id, { showInTable: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor={`showInTable-${question.id}`}
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Show in results table
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditTemplate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<{ id: string; name: string; }[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadTemplate();
    loadTopics();
  }, [id]);

  const loadTemplate = async () => {
    try {
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*, questions(*), template_tags(tags(name))')
        .eq('id', id)
        .single();

      if (templateError) throw templateError;

      setTitle(template.title);
      setDescription(template.description || '');
      setImageUrl(template.image_url || '');
      setIsPublic(template.is_public);
      setSelectedTopic(template.topic_id);
      
      // Transform questions data
      const transformedQuestions = template.questions.map((q: any) => ({
        id: q.id,
        title: q.title,
        description: q.description || '',
        questionType: q.question_type,
        showInTable: q.show_in_table,
        orderIndex: q.order_index
      }));
      setQuestions(transformedQuestions);

      // Extract tags
      const templateTags = template.template_tags.map((tt: any) => tt.tags.name);
      setTags(templateTags);

    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
      navigate('/my-templates');
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    try {
      const { data: existingTopics, error: fetchError } = await supabase
        .from('topics')
        .select('id, name')
        .order('name');

      if (fetchError) throw fetchError;
      setTopics(existingTopics || []);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error('Failed to load topics');
    }
  };

  const handleTagSearch = async (input: string) => {
    if (!input.trim()) {
      setSuggestedTags([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .ilike('name', `${input}%`)
        .limit(5);

      if (error) throw error;
      setSuggestedTags(data || []);
    } catch (error) {
      console.error('Error searching tags:', error);
    }
  };

  const addTag = (tagName: string) => {
    if (tags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
      return;
    }
    
    if (!tags.includes(tagName)) {
      setTags([...tags, tagName]);
    }
    setTagInput('');
    setSuggestedTags([]);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      questionType: type,
      showInTable: false,
      orderIndex: questions.length
    };

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex).map(
          (item, index) => ({
            ...item,
            orderIndex: index,
          })
        );
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!selectedTopic) {
      toast.error('Please select a topic');
      return;
    }

    try {
      // Update template
      const { error: templateError } = await supabase
        .from('templates')
        .update({
          title,
          description,
          topic_id: selectedTopic,
          image_url: imageUrl,
          is_public: isPublic
        })
        .eq('id', id);

      if (templateError) throw templateError;

      // Delete existing questions
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('template_id', id);

      if (deleteError) throw deleteError;

      // Insert updated questions
      if (questions.length > 0) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(
            questions.map(q => ({
              template_id: id,
              title: q.title,
              description: q.description,
              question_type: q.questionType,
              order_index: q.orderIndex,
              show_in_table: q.showInTable
            }))
          );

        if (questionsError) throw questionsError;
      }

      // Delete existing template tags
      const { error: deleteTagsError } = await supabase
        .from('template_tags')
        .delete()
        .eq('template_id', id);

      if (deleteTagsError) throw deleteTagsError;

      // Handle tags
      for (const tagName of tags) {
        // Try to find existing tag
        const { data: existingTags } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName);

        let tagId;
        
        // If tag doesn't exist, create it
        if (!existingTags || existingTags.length === 0) {
          const { data: newTag, error: createTagError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select()
            .single();

          if (createTagError) throw createTagError;
          tagId = newTag.id;
        } else {
          tagId = existingTags[0].id;
        }

        // Link tag to template
        const { error: linkError } = await supabase
          .from('template_tags')
          .insert({
            template_id: id,
            tag_id: tagId
          });

        if (linkError) throw linkError;
      }

      toast.success('Template updated successfully!');
      navigate('/my-templates');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Template</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (Markdown supported)
              </label>
              {previewMode ? (
                <div className="mt-1 p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              )}
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Topic *
              </label>
              <select
                id="topic"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image URL
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 block w-full rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={() => window.open(imageUrl, '_blank')}
                  disabled={!imageUrl}
                  className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:text-gray-700"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Template preview"
                    className="max-h-48 rounded-lg object-cover"
                    onError={() => toast.error('Failed to load image')}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 inline-flex items-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative mt-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    handleTagSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (tagInput.trim()) {
                        addTag(tagInput.trim());
                      }
                    }
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Add tags..."
                />
                {suggestedTags.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => addTag(tag.name)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Make this template public
              </label>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Questions</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addQuestion('single_line')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Single Line
              </button>
              <button
                type="button"
                onClick={() => addQuestion('multi_line')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Multi Line
              </button>
              <button
                type="button"
                onClick={() => addQuestion('integer')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Integer
              </button>
              <button
                type="button"
                onClick={() => addQuestion('checkbox')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Checkbox
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map(q => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {questions.map((question) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      updateQuestion={updateQuestion}
                      removeQuestion={removeQuestion}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </form>
    </div>
  );
}
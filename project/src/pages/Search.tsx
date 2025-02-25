import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Tag, Calendar, User, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  user: {
    email: string;
  } | null;
  tags: {
    name: string;
  }[];
  _score: number;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('name')
        .order('name');

      if (error) throw error;

      setAvailableTags(data.map(tag => tag.name));
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim() && selectedTags.length === 0) {
      return;
    }

    setLoading(true);

    try {
      let searchQuery = supabase
        .rpc('search_templates', { search_query: query })
        .select(`
          id,
          title,
          description,
          image_url,
          created_at,
          user:user_id(email),
          tags:template_tags(tags(name))
        `);

      if (selectedTags.length > 0) {
        searchQuery = searchQuery.contains('tags.tags.name', selectedTags);
      }

      const { data, error } = await searchQuery;

      if (error) throw error;

      setResults(data || []);
    } catch (error) {
      console.error('Error searching templates:', error);
      toast.error('Failed to search templates');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Search Templates
        </h1>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search templates..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Search'
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Tag className="h-4 w-4 mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Link
              key={result.id}
              to={`/templates/${result.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {result.image_url && (
                <img
                  src={result.image_url}
                  alt={result.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {result.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {result.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags.map(({ name }) => (
                    <span
                      key={name}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {result.user?.email.split('@')[0]}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(result.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : query || selectedTags.length > 0 ? (
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : null}
    </div>
  );
}
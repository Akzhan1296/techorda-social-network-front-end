import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import type { Blog, PaginationResponse } from '../types';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  Users, 
  BookOpen,
  Globe
} from 'lucide-react';

const BlogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response: PaginationResponse<Blog> = await blogAPI.getAllBlogs({
        pageSize: 50,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      setBlogs(response.items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить блоги');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlogClick = (blogId: string) => {
    navigate(`/blogs/${blogId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Ошибка загрузки</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchBlogs}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Globe className="h-8 w-8 text-blue-600" />
            <span>Публичные блоги</span>
          </h1>
          <p className="text-gray-600 mt-2">Исследуйте блоги и посты других пользователей</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Поиск блогов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего блогов</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Найдено</p>
              <p className="text-2xl font-bold text-gray-900">{filteredBlogs.length}</p>
            </div>
            <Search className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Авторов</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(blogs.map(b => b.id)).size}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <div 
            key={blog.id} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer group"
            onClick={() => handleBlogClick(blog.id)}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {blog.name}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                {blog.websiteUrl && (
                  <a
                    href={blog.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Сайт</span>
                  </a>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Публичный
                </span>
                <span className="text-sm text-gray-500">Перейти к постам →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Блоги не найдены' : 'Пока нет доступных блогов'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Блоги появятся здесь, как только пользователи их создадут'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;

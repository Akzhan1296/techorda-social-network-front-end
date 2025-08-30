import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Blog } from '../types';
import { Search, Plus, Calendar, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import CreateBlog from '../components/blogs/CreateBlog';

const MyBlogsPage: React.FC = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyBlogs();
  }, [user]);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAllBlogs();
      const myBlogs = response.items.filter((blog: Blog) => blog.userId === user?.userId);
      setBlogs(myBlogs);
    } catch (error) {
      console.error('Failed to fetch my blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogCreated = (newBlog: Blog) => {
    setBlogs(prev => [newBlog, ...prev]);
    setShowCreateModal(false);
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот блог?')) {
      return;
    }

    try {
      setDeletingBlogId(blogId);
      await blogAPI.deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Не удалось удалить блог');
    } finally {
      setDeletingBlogId(null);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мои блоги</h1>
          <p className="text-gray-600 mt-2">Управляйте своими блогами и постами</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Создать блог</span>
        </button>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{blog.name}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    disabled={deletingBlogId === blog.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Удалить блог"
                  >
                    {deletingBlogId === blog.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
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
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Сайт</span>
                  </a>
                )}
              </div>
              
              <Link
                to={`/my-blogs/${blog.id}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Управлять постами
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Блоги не найдены' : 'У вас пока нет блогов'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Создайте свой первый блог для публикации постов'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Создать первый блог
            </button>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateBlog
          onClose={() => setShowCreateModal(false)}
          onBlogCreated={handleBlogCreated}
        />
      )}
    </div>
  );
};

export default MyBlogsPage;

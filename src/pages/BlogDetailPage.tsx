import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import type { Blog, Post, PaginationResponse } from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  ExternalLink, 
  Globe,
  Users,
  BookOpen
} from 'lucide-react';
import PostComponent from '../components/posts/Post';

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
      fetchPosts();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    if (!blogId) return;
    
    try {
      setIsLoadingBlog(true);
      const blogData = await blogAPI.getBlogById(blogId);
      setBlog(blogData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить блог');
      console.error('Failed to fetch blog:', err);
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const fetchPosts = async () => {
    if (!blogId) return;
    
    try {
      setIsLoadingPosts(true);
      const response: PaginationResponse<Post> = await blogAPI.getBlogPosts(blogId, {
        pageSize: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      setPosts(response.items);
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoadingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Блог не найден
            </h3>
            <p className="text-gray-600 mb-6">
              {error || 'Запрашиваемый блог не существует'}
            </p>
            <button
              onClick={() => navigate('/blogs')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Вернуться к блогам
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Назад к блогам</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{blog.name}</h1>
                  {blog.isMembership && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Premium блог
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-6">
                {blog.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Создан {formatDate(blog.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{posts.length} постов</span>
                </div>
                
                {blog.websiteUrl && (
                  <a
                    href={blog.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Веб-сайт</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isLoadingPosts ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                В этом блоге пока нет постов
              </h3>
              <p className="text-gray-600">
                Посты появятся здесь, когда автор их создаст
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
                readonly={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import type { Blog, Post } from '../types';
import { ArrowLeft, Plus, Search, Calendar, Edit } from 'lucide-react';
import CreatePost from '../components/posts/CreatePost';
import PostComponent from '../components/posts/Post';
import EditBlog from '../components/blogs/EditBlog';

const MyBlogDetailPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlogAndPosts();
    }
  }, [blogId]);

  const fetchBlogAndPosts = async () => {
    if (!blogId) return;

    try {
      setLoading(true);
      const [blogResponse, postsResponse] = await Promise.all([
        blogAPI.getBlogById(blogId),
        blogAPI.getBlogPosts(blogId)
      ]);
      
      setBlog(blogResponse);
      setPosts(postsResponse.items);
    } catch (error) {
      console.error('Failed to fetch blog and posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handleBlogUpdated = (updatedBlog: Blog) => {
    setBlog(updatedBlog);
    setIsEditingBlog(false);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Блог не найден</h1>
          <Link to="/my-blogs" className="text-blue-600 hover:text-blue-800">
            ← Вернуться к моим блогам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <Link
          to="/my-blogs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к моим блогам
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.name}</h1>
            <p className="text-gray-600 mb-4">{blog.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Создан {formatDate(blog.createdAt)}</span>
              </div>
              {blog.websiteUrl && (
                <a
                  href={blog.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Перейти на сайт
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditingBlog(true)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Редактировать</span>
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Создать пост</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Поиск постов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <PostComponent
            key={post.id}
            post={post}
            onPostDeleted={handlePostDeleted}
            onPostUpdated={handlePostUpdated}
            readonly={false}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Посты не найдены' : 'В этом блоге пока нет постов'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Создайте первый пост в вашем блоге'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Создать первый пост
            </button>
          )}
        </div>
      )}

      {isEditingBlog && blog && (
        <EditBlog
          blog={blog}
          onUpdate={handleBlogUpdated}
          onCancel={() => setIsEditingBlog(false)}
          isModal={true}
        />
      )}

      {showCreatePost && blogId && (
        <CreatePost
          blogId={blogId}
          onPostCreated={handlePostCreated}
          isModal={true}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </div>
  );
};

export default MyBlogDetailPage;

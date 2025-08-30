import React, { useState, useEffect, useCallback } from 'react';
import { postAPI, blogAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Post, Blog } from '../../types';
import { Plus, X, Send } from 'lucide-react';

interface CreatePostProps {
  onPostCreated?: (post: Post) => void;
  blogId?: string;
  isModal?: boolean;
  onClose?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, blogId, isModal = false, onClose }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(isModal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    blogId: ''
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoadingBlogs(true);
      const blogsData = await blogAPI.getAllBlogs();
      
      const filteredBlogs = blogId 
        ? blogsData.items.filter(blog => blog.id === blogId)
        : blogsData.items;
      
      setBlogs(filteredBlogs);
      
      if (filteredBlogs.length > 0) {
        setFormData(prev => ({ 
          ...prev, 
          blogId: blogId || filteredBlogs[0].id 
        }));
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setErrors(['Не удалось загрузить список блогов']);
    } finally {
      setIsLoadingBlogs(false);
    }
  }, [blogId]);

  useEffect(() => {
    if (isOpen) {
      fetchBlogs();
    }
  }, [isOpen, fetchBlogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.shortDescription.trim() || !formData.content.trim() || !formData.blogId) {
      setErrors(['Пожалуйста, заполните все обязательные поля']);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors([]);
      
      const newPost = await postAPI.createPost(formData.blogId, {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        content: formData.content.trim()
      });
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      setFormData({
        title: '',
        shortDescription: '',
        content: '',
        blogId: formData.blogId
      });
      
      setIsOpen(false);
      
      if (isModal && onClose) {
        onClose();
      }
    } catch (err: any) {
      console.log('CreatePost Error:', err);
      console.log('Error Response:', err.response);
      console.log('Error Status:', err.response?.status);
      console.log('Error Data:', err.response?.data);
      
      let errorMessages: string[] = [];
      const errorData = err.response?.data;
      
      // 1. Массив errorMessages
      if (errorData?.errorMessages && Array.isArray(errorData.errorMessages)) {
        errorMessages.push(...errorData.errorMessages);
      }
      
      // 2. Request fail из объекта
      if (errorData?.requestFail) {
        errorMessages.push(errorData.requestFail);
      }
      
      // 3. Обычные поля ошибок
      if (errorData?.message) {
        errorMessages.push(errorData.message);
      }
      
      if (errorData?.error) {
        errorMessages.push(errorData.error);
      }
      
      // 4. Ошибки валидации
      if (errorData?.errorsMessages && Array.isArray(errorData.errorsMessages)) {
        errorData.errorsMessages.forEach((validationError: any) => {
          if (validationError.message) {
            errorMessages.push(validationError.message);
          }
        });
      }
      
      // 5. Fallback
      if (errorMessages.length === 0) {
        if (err.message) {
          errorMessages = [err.message];
        } else {
          errorMessages = ['Не удалось создать пост'];
        }
      }
      
      const uniqueErrors = [...new Set(errorMessages)];
      setErrors(uniqueErrors);
      console.error('Failed to create post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      shortDescription: '',
      content: '',
      blogId: formData.blogId
    });
    setErrors([]);
    setIsOpen(false);
    
    if (isModal && onClose) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  if (!user) {
    return null;
  }

  if (!isModal && !isOpen) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Создать пост</span>
        </button>
      </div>
    );
  }

  return (
    <div className={isModal ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" : "mb-6"}>
      <div className={`bg-white rounded-lg ${isModal ? "max-w-2xl w-full max-h-[90vh] overflow-y-auto" : ""} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Создать новый пост</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Ошибка при создании поста:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((errorMsg, index) => (
                      <li key={index}>{errorMsg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="blogId" className="block text-sm font-medium text-gray-700 mb-1">
              Блог *
            </label>
            {isLoadingBlogs ? (
              <div className="text-sm text-gray-500">Загрузка блогов...</div>
            ) : (
              <select
                id="blogId"
                name="blogId"
                value={formData.blogId}
                onChange={handleChange}
                required
                disabled={!!blogId}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Выберите блог</option>
                {blogs.map(blog => (
                  <option key={blog.id} value={blog.id}>
                    {blog.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите заголовок поста"
              required
              maxLength={30}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.title.length}/30 символов
            </div>
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Краткое описание *
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Краткое описание поста"
              required
              rows={2}
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.shortDescription.length}/100 символов
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Содержание *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Основное содержание поста"
              required
              rows={6}
              maxLength={1000}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.content.length}/1000 символов
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.shortDescription.trim() || !formData.content.trim() || !formData.blogId}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Создание...' : 'Создать пост'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
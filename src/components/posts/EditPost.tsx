import React, { useState } from 'react';
import { postAPI } from '../../services/api';
import type { Post, ErrorResponse } from '../../types';
import { Edit, Save, X } from 'lucide-react';

interface EditPostProps {
  post: Post;
  onUpdate: (updatedPost: Post) => void;
  onCancel: () => void;
  isModal?: boolean;
}

const EditPost: React.FC<EditPostProps> = ({ post, onUpdate, onCancel, isModal = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isModal) {
      onCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.shortDescription.trim() || !formData.content.trim()) {
      setErrorMessages(['Пожалуйста, заполните все поля']);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessages([]);
      
      console.log('Attempting to update post with ID:', post.id);
      console.log('Blog ID:', post.blogId);
      console.log('Post data:', {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        content: formData.content.trim()
      });
      
      await postAPI.updatePost(post.id, post.blogId, {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        content: formData.content.trim()
      });
      
      const updatedPost: Post = {
        ...post,
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        content: formData.content.trim()
      };
      
      onUpdate(updatedPost);
      
    } catch (err: any) {
      console.error('Failed to update post:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      const errorData = err.response?.data as ErrorResponse;
      const errorMessages: string[] = [];
      
      if (err.response?.status === 404) {
        errorMessages.push('Пост не найден. Возможно, он был удален.');
      } else if (errorData) {
        if (errorData.errorMessages) {
          errorMessages.push(...errorData.errorMessages);
        }
        if (errorData.errorsMessages) {
          errorData.errorsMessages.forEach(validationError => {
            if (validationError.message) {
              errorMessages.push(validationError.message);
            }
          });
        }
        if (errorData.message) {
          errorMessages.push(errorData.message);
        }
        if (errorData.error) {
          errorMessages.push(errorData.error);
        }
      }
      
      if (errorMessages.length === 0) {
        errorMessages.push('Не удалось обновить пост');
      }
      
      const uniqueErrors = Array.from(new Set(errorMessages));
      setErrorMessages(uniqueErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={isModal ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" : ""}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg ${isModal ? "max-w-2xl w-full max-h-[90vh] overflow-y-auto" : ""} border border-gray-200 p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Редактировать пост</span>
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Заголовок
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите заголовок поста..."
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.title.length}/100
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Краткое описание
          </label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Кратко опишите ваш пост..."
            maxLength={300}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.shortDescription.length}/300
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Содержимое
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Напишите ваш пост..."
            rows={6}
            maxLength={2000}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.content.length}/2000
          </div>
        </div>

        {errorMessages.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            {errorMessages.map((errorMessage, index) => (
              <p key={index} className="text-red-600 text-sm">
                {errorMessage}
              </p>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim() || !formData.shortDescription.trim() || !formData.content.trim()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </span>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditPost;

import React, { useState } from 'react';
import { blogAPI } from '../../services/api';
import type { Blog, ErrorResponse } from '../../types';
import { Edit, Save, X } from 'lucide-react';

interface EditBlogProps {
  blog: Blog;
  onUpdate: (updatedBlog: Blog) => void;
  onCancel: () => void;
  isModal?: boolean;
}

const EditBlog: React.FC<EditBlogProps> = ({ blog, onUpdate, onCancel, isModal = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isModal) {
      onCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.websiteUrl.trim()) {
      setErrorMessages(['Пожалуйста, заполните все поля']);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessages([]);
      
      console.log('Attempting to update blog with ID:', blog.id);
      console.log('Blog data:', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        websiteUrl: formData.websiteUrl.trim()
      });
      
      await blogAPI.updateBlog(blog.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        websiteUrl: formData.websiteUrl.trim()
      });
      
      const updatedBlog: Blog = {
        ...blog,
        name: formData.name.trim(),
        description: formData.description.trim(),
        websiteUrl: formData.websiteUrl.trim()
      };
      
      onUpdate(updatedBlog);
      
    } catch (err: any) {
      console.error('Failed to update blog:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      const errorData = err.response?.data as ErrorResponse;
      const errorMessages: string[] = [];
      
      if (err.response?.status === 404) {
        errorMessages.push('Блог не найден. Возможно, он был удален.');
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
        errorMessages.push('Не удалось обновить блог');
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
            <span>Редактировать блог</span>
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
            Название блога
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название блога..."
            maxLength={15}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.name.length}/15
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Введите описание блога..."
            maxLength={500}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.description.length}/500
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL сайта
          </label>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.websiteUrl.length}/100
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
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Отменить
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Сохранить</span>
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditBlog;

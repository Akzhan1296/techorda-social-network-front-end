import React, { useState } from 'react';
import { blogAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Blog } from '../../types';
import { X, Globe, FileText, Link as LinkIcon, Loader2 } from 'lucide-react';

interface CreateBlogProps {
  onClose: () => void;
  onBlogCreated: (blog: Blog) => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ onClose, onBlogCreated }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors([]);

    try {
      setIsSubmitting(true);
      
      const newBlog = await blogAPI.createBlog({
        name: formData.name.trim(),
        description: formData.description.trim(),
        websiteUrl: formData.websiteUrl.trim() || 'https://example.com',
        userId: user?.userId
      });
      
      onBlogCreated(newBlog);
      
    } catch (err: any) {
      console.log('CreateBlog Error:', err);
      console.log('Error Response:', err.response);
      console.log('Error Status:', err.response?.status);
      console.log('Error Data:', err.response?.data);
      
      let errorMessages: string[] = [];
      
      // Собираем все возможные ошибки
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
      
      // 4. Ошибки валидации (если есть массив errorsMessages)
      if (errorData?.errorsMessages && Array.isArray(errorData.errorsMessages)) {
        errorData.errorsMessages.forEach((validationError: any) => {
          if (validationError.message) {
            errorMessages.push(validationError.message);
          }
        });
      }
      
      // 5. Если нет никаких ошибок от сервера, используем стандартные
      if (errorMessages.length === 0) {
        if (err.message) {
          errorMessages = [err.message];
        } else {
          errorMessages = ['Не удалось создать блог'];
        }
      }
      
      // Удаляем дубликаты
      const uniqueErrors = [...new Set(errorMessages)];
      
      setErrors(uniqueErrors);
      console.error('Failed to create blog:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Создать новый блог</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Название блога *</span>
              </div>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название вашего блога..."
              maxLength={50}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.name.length}/50
            </div>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Описание *</span>
              </div>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Расскажите о чем ваш блог..."
              rows={4}
              maxLength={500}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.description.length}/500
            </div>
          </div>

          {/* Веб-сайт */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4" />
                <span>Веб-сайт</span>
              </div>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Опционально. Ссылка на ваш веб-сайт или портфолио
            </p>
          </div>

          {/* Ошибки - отображаем в самом верху формы */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Ошибка при создании блога:
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

          {/* Действия */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isSubmitting ? 'Создание...' : 'Создать блог'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;

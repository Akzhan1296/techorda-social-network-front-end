import React, { useState } from 'react';
import { commentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Comment } from '../../types';
import { Send } from 'lucide-react';

interface CreateCommentProps {
  postId: string;
  onCommentCreated: (comment: Comment) => void;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, onCommentCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !user) return;

    try {
      setIsSubmitting(true);
      setErrors([]);
      
      const newComment = await commentAPI.createComment(postId, content.trim());
      onCommentCreated(newComment);
      setContent('');
    } catch (err: any) {
      console.log('CreateComment Error:', err);
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
      
      // 2. Request fail из объекта (может быть вложенным)
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
          errorMessages = ['Не удалось создать комментарий'];
        }
      }
      
      // Удаляем дубликаты
      const uniqueErrors = [...new Set(errorMessages)];
      
      setErrors(uniqueErrors);
      console.error('Failed to create comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-gray-600 text-center">
          Войдите в аккаунт, чтобы оставить комментарий
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {user.login[0].toUpperCase()}
            </div>
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Напишите комментарий..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={300}
              disabled={isSubmitting}
            />
            
            {errors.length > 0 && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Ошибка при создании комментария:
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
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/300
              </span>
              
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>
                  {isSubmitting ? 'Отправка...' : 'Отправить'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;

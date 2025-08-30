import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Hash } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-gray-600 text-3xl font-medium">
              {user.login[0].toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {user.login}
            </h2>
            <p className="text-gray-600">@{user.login}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Логин</p>
                <p className="text-gray-900">{user.login}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">ID пользователя</p>
                <p className="text-gray-900 font-mono text-sm">{user.userId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

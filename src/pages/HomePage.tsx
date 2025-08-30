import React, { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import type { Post as PostType, PaginationResponse } from '../types';
import Post from '../components/posts/Post';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [postsData, setPostsData] = useState<PaginationResponse<PostType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      setIsLoading(true);
      const fetchedData = await postAPI.getAllPosts({
        pageNumber: page,
        pageSize: pageSize,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      setPostsData(fetchedData);
      setError(null);
    } catch (err: any) {
      setError('Не удалось загрузить посты');
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: PostType) => {
    if (!postsData) return;
    
    setPostsData({
      ...postsData,
      items: postsData.items.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    });
  };

  const handlePostDelete = (postId: string) => {
    if (!postsData) return;
    
    setPostsData({
      ...postsData,
      items: postsData.items.filter(post => post.id !== postId),
      totalCount: postsData.totalCount - 1
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && !postsData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !postsData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchPosts(currentPage)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Лента постов</h1>
        <p className="text-gray-600 mt-2">Все посты из публичных блогов</p>
      </div>
      
      {!postsData || postsData.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Постов пока нет</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {postsData.items.map(post => (
              <Post
                key={post.id}
                post={post}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
                readonly={true}
              />
            ))}
          </div>

          {postsData.pagesCount > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Назад</span>
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(postsData.pagesCount, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === postsData.pagesCount || isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Вперед</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-500">
            Показано {postsData.items.length} из {postsData.totalCount} постов
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;

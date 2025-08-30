import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import type { Post as PostType, Comment, PaginationResponse } from '../types';
import Post from '../components/posts/Post';
import CommentsList from '../components/comments/CommentsList';
import CreateComment from '../components/comments/CreateComment';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<PostType | null>(null);
  const [commentsData, setCommentsData] = useState<PaginationResponse<Comment> | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments(currentPage);
    }
  }, [id, currentPage]);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setIsLoadingPost(true);
      const fetchedPost = await postAPI.getPostById(id);
      setPost(fetchedPost);
      setError(null);
    } catch (err: any) {
      setError('Не удалось загрузить пост');
      console.error('Failed to fetch post:', err);
    } finally {
      setIsLoadingPost(false);
    }
  };

  const fetchComments = async (page: number) => {
    if (!id) return;
    
    try {
      setIsLoadingComments(true);
      const fetchedComments = await commentAPI.getCommentsByPostId(id, {
        pageNumber: page,
        pageSize: pageSize,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      setCommentsData(fetchedComments);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostUpdate = (updatedPost: PostType) => {
    setPost(updatedPost);
  };

  const handlePostDelete = () => {
    navigate('/');
  };

  const handleCommentCreated = (newComment: Comment) => {
    if (!commentsData) return;
    
    setCommentsData({
      ...commentsData,
      items: [newComment, ...commentsData.items],
      totalCount: commentsData.totalCount + 1
    });
  };

  const handleCommentUpdate = (updatedComment: Comment) => {
    if (!commentsData) return;
    
    setCommentsData({
      ...commentsData,
      items: commentsData.items.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    });
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </button>
        
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchPost}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingPost) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </button>
        
        <div className="text-center py-12">
          <p className="text-gray-500">Пост не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Назад</span>
      </button>

      <Post 
        post={post} 
        onUpdate={handlePostUpdate} 
        onDelete={handlePostDelete}
        showFullContent 
        readonly={true}
      />

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Комментарии ({commentsData?.totalCount || 0})
        </h3>

        <CreateComment postId={post.id} onCommentCreated={handleCommentCreated} />

        {isLoadingComments ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <CommentsList
            comments={commentsData?.items || []}
            onCommentUpdate={handleCommentUpdate}
            pagination={{
              currentPage,
              totalPages: commentsData?.pagesCount || 1,
              onPageChange: setCurrentPage
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;

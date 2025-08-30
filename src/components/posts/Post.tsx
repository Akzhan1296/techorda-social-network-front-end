import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Post as PostType } from '../../types';
import { ThumbsUp, ThumbsDown, MessageCircle, Edit, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import EditPost from './EditPost';

interface PostProps {
  post: PostType;
  onUpdate?: (post: PostType) => void;
  onDelete?: (postId: string) => void;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (post: PostType) => void;
  showFullContent?: boolean;
  readonly?: boolean;
}

const Post: React.FC<PostProps> = ({ 
  post, 
  onUpdate, 
  onDelete, 
  onPostDeleted, 
  onPostUpdated, 
  showFullContent = false,
  readonly = false
}) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthor = !readonly && !!user;

  const handleUpdatePost = (updatedPost: PostType) => {
    onUpdate?.(updatedPost);
    onPostUpdated?.(updatedPost);
  };

  const handleDeletePost = (postId: string) => {
    onDelete?.(postId);
    onPostDeleted?.(postId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLike = async () => {
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      const newStatus = post.extendedLikesInfo.myStatus === 'Like' ? 'None' : 'Like';
      await postAPI.likePost(post.id, newStatus);
      
      const updatedPost: PostType = {
        ...post,
        extendedLikesInfo: {
          ...post.extendedLikesInfo,
          myStatus: newStatus,
          likesCount: newStatus === 'Like' ? post.extendedLikesInfo.likesCount + 1 : post.extendedLikesInfo.likesCount - 1
        }
      };
      handleUpdatePost(updatedPost);
    } catch (err) {
      console.error('Failed to like post:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      const newStatus = post.extendedLikesInfo.myStatus === 'Dislike' ? 'None' : 'Dislike';
      await postAPI.likePost(post.id, newStatus);
      
      const updatedPost: PostType = {
        ...post,
        extendedLikesInfo: {
          ...post.extendedLikesInfo,
          myStatus: newStatus,
          dislikesCount: newStatus === 'Dislike' ? post.extendedLikesInfo.dislikesCount + 1 : post.extendedLikesInfo.dislikesCount - 1
        }
      };
      handleUpdatePost(updatedPost);
    } catch (err) {
      console.error('Failed to dislike post:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await postAPI.deletePost(post.id, post.blogId);
      handleDeletePost(post.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Не удалось удалить пост');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditComplete = (updatedPost: PostType) => {
    handleUpdatePost(updatedPost);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow w-full max-w-full overflow-hidden">
        <div className="flex items-start justify-between mb-4 min-w-0">
        <div className="flex-1 min-w-0">
          <Link 
            to={`/posts/${post.id}`}
            className="block group"
          >
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 break-words overflow-wrap-anywhere">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-600 mb-3 break-words overflow-wrap-anywhere">
            {post.shortDescription}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="truncate">{post.blogName}</span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {isAuthor && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Редактировать</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>{isDeleting ? 'Удаление...' : 'Удалить'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="prose prose-gray max-w-none">
          {showFullContent ? (
            <div 
              className="text-gray-700 break-words overflow-wrap-anywhere"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} 
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap-anywhere">
              {truncateContent(post.content)}
            </p>
          )}
        </div>
        
        {!showFullContent && post.content.length > 200 && (
          <Link
            to={`/posts/${post.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
          >
            Читать полностью →
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={!user || isLiking}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
              post.extendedLikesInfo.myStatus === 'Like'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiking ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">{post.extendedLikesInfo.likesCount}</span>
          </button>

          <button
            onClick={handleDislike}
            disabled={!user || isLiking}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
              post.extendedLikesInfo.myStatus === 'Dislike'
                ? 'bg-red-50 text-red-600'
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ThumbsDown className={`h-4 w-4 ${isLiking ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">{post.extendedLikesInfo.dislikesCount}</span>
          </button>

          <Link
            to={`/posts/${post.id}#comments`}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">Комментарии</span>
          </Link>
        </div>
      </div>
    </article>

    {isEditing && (
      <EditPost
        post={post}
        onUpdate={handleEditComplete}
        onCancel={() => setIsEditing(false)}
        isModal={true}
      />
    )}
  </>
  );
};

export default Post;

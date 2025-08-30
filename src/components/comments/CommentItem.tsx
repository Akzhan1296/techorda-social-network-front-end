import React, { useState } from 'react';
import { commentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Comment } from '../../types';
import { ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (comment: Comment) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      const newStatus = comment.likesInfo.myStatus === 'Like' ? 'None' : 'Like';
      await commentAPI.likeComment(comment.id, newStatus);
      
      const updatedComment: Comment = {
        ...comment,
        likesInfo: {
          ...comment.likesInfo,
          myStatus: newStatus,
          likesCount: newStatus === 'Like' ? comment.likesInfo.likesCount + 1 : comment.likesInfo.likesCount - 1
        }
      };
      onUpdate(updatedComment);
    } catch (err) {
      console.error('Failed to like comment:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      const newStatus = comment.likesInfo.myStatus === 'Dislike' ? 'None' : 'Dislike';
      await commentAPI.likeComment(comment.id, newStatus);
      
      const updatedComment: Comment = {
        ...comment,
        likesInfo: {
          ...comment.likesInfo,
          myStatus: newStatus,
          dislikesCount: newStatus === 'Dislike' ? comment.likesInfo.dislikesCount + 1 : comment.likesInfo.dislikesCount - 1
        }
      };
      onUpdate(updatedComment);
    } catch (err) {
      console.error('Failed to dislike comment:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
            {comment.commentatorInfo.userLogin[0].toUpperCase()}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">
              {comment.commentatorInfo.userLogin}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-gray-700 mb-3">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.likesInfo.myStatus === 'Like'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              } disabled:opacity-50`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{comment.likesInfo.likesCount}</span>
            </button>
            
            <button
              onClick={handleDislike}
              disabled={!user || isLiking}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.likesInfo.myStatus === 'Dislike'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-red-600'
              } disabled:opacity-50`}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{comment.likesInfo.dislikesCount}</span>
            </button>

            {user?.userId === comment.commentatorInfo.userId && (
              <button className="text-gray-500 hover:text-gray-700 p-1">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;

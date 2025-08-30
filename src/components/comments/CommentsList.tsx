import React from 'react';
import type { Comment } from '../../types';
import CommentItem from './CommentItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CommentsListProps {
  comments: Comment[];
  onCommentUpdate: (comment: Comment) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  onCommentUpdate,
  pagination
}) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Комментариев пока нет. Будьте первым!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onUpdate={onCommentUpdate}
          />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="flex items-center space-x-2 px-3 py-1 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Назад</span>
          </button>
          
          <span className="text-sm text-gray-600">
            Страница {pagination.currentPage} из {pagination.totalPages}
          </span>
          
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center space-x-2 px-3 py-1 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Вперед</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;

export interface User {
  userId: string;
  login: string;
  email: string;
}

export interface Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  userId?: string;
}

export interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: PostLike[];
  };
}

export interface PostLike {
  addedAt: string;
  userId: string;
  login: string;
}

export interface Comment {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus?: string;
  };
  postId?: string;
}

export interface PaginationResponse<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  pagesCount: number;
  items: T[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  loginOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateBlogRequest {
  name: string;
  description: string;
  websiteUrl: string;
  userId?: string;
}

export interface PostLikeRequest {
  likeStatus: 'Like' | 'Dislike' | 'None';
}

export interface CommentLikeRequest {
  likeStatus: 'Like' | 'Dislike' | 'None';
}

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  errorsMessages?: ValidationError[];
  errorMessages?: string[];
  message?: string;
  error?: string;
  requestFail?: string;
}

import axios from 'axios';
import type { 
  User, 
  Post, 
  Comment, 
  Blog,
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  CreateBlogRequest,
  QueryParams,
  PaginationResponse
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}` : '',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    console.log('API Error intercepted:', error.response?.status, error.config?.url);
    
    // Avoid infinite loop on refresh-token endpoint
    if (error.config?.url?.includes('/auth/refresh-token')) {
      console.log('Refresh token endpoint failed, clearing tokens...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth';
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('Attempting token refresh...');
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh-token', {
            refreshToken
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log('Token refreshed successfully, retrying request...');
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log('Token refresh failed, redirecting to auth...');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/registration', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const postAPI = {
  getAllPosts: async (params?: QueryParams): Promise<PaginationResponse<Post>> => {
    const searchParams = new URLSearchParams();
    if (params?.pageNumber) searchParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    
    const response = await api.get(`/posts?${searchParams}`);
    return response.data;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (blogId: string, data: { title: string; content: string; shortDescription: string }): Promise<Post> => {
    const response = await api.post(`/sa/blogs/${blogId}/posts`, data, {
      headers: {
        'Authorization': 'Basic YWRtaW46cXdlcnR5' // admin:qwerty в base64
      }
    });
    return response.data;
  },

  updatePost: async (id: string, blogId: string, data: { title: string; content: string; shortDescription: string }): Promise<void> => {
    await api.put(`/sa/blogs/${blogId}/posts/${id}`, data, {
      headers: {
        'Authorization': 'Basic YWRtaW46cXdlcnR5'
      }
    });
  },

  deletePost: async (id: string, blogId?: string): Promise<void> => {
    if (blogId) {
      await api.delete(`/sa/blogs/${blogId}/posts/${id}`, {
        headers: {
          'Authorization': 'Basic YWRtaW46cXdlcnR5'
        }
      });
    } else {
      await api.delete(`/posts/${id}`);
    }
  },

  likePost: async (id: string, likeStatus: 'Like' | 'Dislike' | 'None'): Promise<void> => {
    await api.put(`/posts/${id}/like-status`, { likeStatus });
  }
};

export const commentAPI = {
  getCommentsByPostId: async (postId: string, params?: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }): Promise<PaginationResponse<Comment>> => {
    const searchParams = new URLSearchParams();
    if (params?.pageNumber) searchParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    
    const response = await api.get(`/posts/${postId}/comments?${searchParams}`);
    return response.data;
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  getCommentById: async (id: string): Promise<Comment> => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  updateComment: async (id: string, content: string): Promise<void> => {
    await api.put(`/comments/${id}`, { content });
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  likeComment: async (id: string, likeStatus: 'Like' | 'Dislike' | 'None'): Promise<void> => {
    await api.put(`/comments/${id}/like-status`, { likeStatus });
  }
};

export const userAPI = {
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (data: { login?: string; email?: string }): Promise<void> => {
    await api.put('/users/profile', data);
  }
};

export const blogAPI = {
  getAllBlogs: async (params?: QueryParams): Promise<PaginationResponse<Blog>> => {
    const searchParams = new URLSearchParams();
    if (params?.pageNumber) searchParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    
    const response = await api.get(`/blogs?${searchParams}`);
    return response.data;
  },

  getBlogById: async (id: string): Promise<Blog> => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (data: CreateBlogRequest): Promise<Blog> => {
    console.log('Creating blog with data:', data);
    console.log('API base URL:', api.defaults.baseURL);
    
    try {
      const response = await api.post('/sa/blogs', data, {
        headers: {
          'Authorization': 'Basic YWRtaW46cXdlcnR5' // admin:qwerty в base64
        }
      });
      console.log('Blog creation successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Blog creation failed:', error);
      console.error('Error response:', error.response);
      console.error('Error config:', error.config);
      throw error;
    }
  },

  updateBlog: async (id: string, data: { name: string; description: string; websiteUrl: string }): Promise<void> => {
    await api.put(`/sa/blogs/${id}`, data, {
      headers: {
        'Authorization': 'Basic YWRtaW46cXdlcnR5'
      }
    });
  },

  deleteBlog: async (id: string): Promise<void> => {
    await api.delete(`/sa/blogs/${id}`, {
      headers: {
        'Authorization': 'Basic YWRtaW46cXdlcnR5'
      }
    });
  },

  getBlogPosts: async (blogId: string, params?: QueryParams): Promise<PaginationResponse<Post>> => {
    const searchParams = new URLSearchParams();
    if (params?.pageNumber) searchParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    
    const response = await api.get(`/blogs/${blogId}/posts?${searchParams}`);
    return response.data;
  }
};

export default api;

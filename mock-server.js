/**
 * Простой мок-сервер для локальной разработки
 * Запуск: node mock-server.js
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Мок данные
const mockUser = {
  userId: "user123",
  login: "testuser",
  email: "test@example.com"
};

const mockBlogs = [
  {
    id: "blog1",
    name: "Мой блог",
    description: "Описание блога",
    websiteUrl: "https://example.com",
    createdAt: new Date().toISOString(),
    isMembership: false
  }
];

const mockPosts = [
  {
    id: "post1",
    title: "Тестовый пост",
    shortDescription: "Краткое описание",
    content: "Содержимое поста",
    blogId: "blog1",
    blogName: "Мой блог",
    createdAt: new Date().toISOString(),
    extendedLikesInfo: {
      likesCount: 5,
      dislikesCount: 1,
      myStatus: "None",
      newestLikes: []
    }
  }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({
    accessToken: "mock-access-token",
    user: mockUser
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request:', req.body);
  res.json({
    accessToken: "mock-access-token",
    user: mockUser
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// User endpoints
app.get('/api/users/profile', (req, res) => {
  res.json(mockUser);
});

// Blog endpoints
app.get('/api/sa/blogs', (req, res) => {
  res.json({
    pagesCount: 1,
    page: 1,
    pageSize: 10,
    totalCount: 1,
    items: mockBlogs
  });
});

app.post('/api/sa/blogs', (req, res) => {
  const newBlog = {
    id: `blog${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    isMembership: false
  };
  mockBlogs.push(newBlog);
  res.status(201).json(newBlog);
});

// Posts endpoints
app.get('/api/posts', (req, res) => {
  res.json({
    pagesCount: 1,
    page: 1,
    pageSize: 10,
    totalCount: 1,
    items: mockPosts
  });
});

app.get('/api/sa/blogs/:blogId/posts', (req, res) => {
  const blogPosts = mockPosts.filter(post => post.blogId === req.params.blogId);
  res.json({
    pagesCount: 1,
    page: 1,
    pageSize: 10,
    totalCount: blogPosts.length,
    items: blogPosts
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server is running' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register`);
  console.log(`   GET  /api/users/profile`);
  console.log(`   GET  /api/sa/blogs`);
  console.log(`   GET  /api/posts`);
  console.log(`   GET  /api/health`);
});

module.exports = app;

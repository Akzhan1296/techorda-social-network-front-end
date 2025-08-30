import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import AuthPage from './pages/AuthPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import MyBlogsPage from './pages/MyBlogsPage';
import MyBlogDetailPage from './pages/MyBlogDetailPage';
import PublicPostsPage from './pages/PublicPostsPage';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={<Navigate to="/auth" />}
            />
            <Route
              path="/register"
              element={<Navigate to="/auth?mode=register" />}
            />
            <Route
              path="/public-posts"
              element={<PublicPostsPage />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <BlogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <BlogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/:blogId"
              element={
                <ProtectedRoute>
                  <BlogDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-blogs"
              element={
                <ProtectedRoute>
                  <MyBlogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-blogs/:blogId"
              element={
                <ProtectedRoute>
                  <MyBlogDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

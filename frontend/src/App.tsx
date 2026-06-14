import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArchivedPage from './pages/ArchivedPage';
import NoteFormPage from './pages/NoteFormPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archived" element={<ArchivedPage />} />
        <Route path="/new" element={<NoteFormPage />} />
        <Route path="/edit/:id" element={<NoteFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

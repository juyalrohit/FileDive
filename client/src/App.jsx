import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FolderPage from './pages/FolderPage';
import ImagesPage from './pages/ImagesPage';
import FoldersPage from './pages/FoldersPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/folder/:folderId" element={<ProtectedRoute><FolderPage /></ProtectedRoute>} />


          <Route path="/images" element={<ProtectedRoute><ImagesPage/></ProtectedRoute>} />
          <Route path="/folders" element={<ProtectedRoute><FoldersPage/></ProtectedRoute>} />


          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App

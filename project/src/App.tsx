import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateTemplate from './pages/CreateTemplate';
import MyTemplates from './pages/MyTemplates';
import EditTemplate from './pages/EditTemplate';
import AdminDashboard from './pages/AdminDashboard';
import Search from './pages/Search';
import { useThemeStore } from './stores/themeStore';

function App() {
  const { theme } = useThemeStore();

  return (
    <Router>
      <div className={theme}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTemplate />} />
            <Route path="/my-templates" element={<MyTemplates />} />
            <Route path="/templates/:id/edit" element={<EditTemplate />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Layout>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
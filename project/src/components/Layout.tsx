import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Plus, PenTool, Layout as LayoutIcon, LogOut, User, Search } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import AuthModal from './AuthModal';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const ThemeToggle = ({ theme, onClick }: { theme: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-gray-200 hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );

  const CreateButton = () => (
    <Link
      to="/create"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 hover:scale-105 transition-all duration-200"
    >
      <Plus className="h-5 w-5 mr-2" />
      Create Form
    </Link>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <PenTool className="h-6 w-6 text-primary-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Formify
                </span>
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/my-templates"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    <LayoutIcon className="h-5 w-5" />
                    <span>My Templates</span>
                  </Link>
                  <Link
                    to="/search"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!isHome && user && <CreateButton />}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
              
              <ThemeToggle theme={theme} onClick={toggleTheme} />
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Formify</p>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default Layout;
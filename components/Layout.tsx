import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, MapPin, Hammer, Home as HomeIcon, GraduationCap, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  theme?: string;
  toggleTheme?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, theme, toggleTheme }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans text-secondary dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-20 border-b border-transparent dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Brand Logo - White House with Purple Hammer Cutout */}
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center relative w-8 h-8 shrink-0">
               <svg viewBox="0 0 24 24" className="w-full h-full text-primary fill-current">
                  <mask id="header-logo-mask">
                    <rect width="24" height="24" fill="white" />
                    {/* Joined TF Monogram Cutout */}
                    <rect x="6" y="8" width="12" height="2.5" fill="black" />
                    <rect x="10.5" y="8" width="3" height="10" fill="black" />
                    <rect x="13.5" y="8" width="4" height="2.5" fill="black" />
                    <rect x="13.5" y="12" width="3.5" height="2.5" fill="black" />
                  </mask>
                  <path d="M2 12L12 2L22 12H19V21H5V12H2Z" fill="white" mask="url(#header-logo-mask)" />
               </svg>
            </div>
            <h1 className="text-xl font-extrabold text-secondary dark:text-white tracking-tight">Trampo<span className="text-primary">Fácil</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            {toggleTheme && (
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            )}

            {/* Only show add button on header if not on add page */}
            {!isActive('/add') && (
              <Link to="/add" className="text-sm font-bold text-primary dark:text-purple-400 border border-primary/20 dark:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-1.5 rounded-full transition-colors">
                Anunciar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto pb-24 p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-200">
        <div className="max-w-md mx-auto flex justify-between items-center h-16 px-6">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive('/') ? 'text-primary dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Home className={`w-6 h-6 ${isActive('/') && 'fill-current'}`} />
            <span className="text-[10px] font-bold">Início</span>
          </Link>

          <Link
            to="/training"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive('/training') ? 'text-primary dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <GraduationCap className={`w-6 h-6 ${isActive('/training') && 'fill-current'}`} />
            <span className="text-[10px] font-bold">Cursos</span>
          </Link>

          <Link
            to="/add"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive('/add') ? 'text-primary dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <PlusCircle className={`w-6 h-6 ${isActive('/add') && 'fill-current'}`} />
            <span className="text-[10px] font-bold">Publicar</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive('/profile') ? 'text-primary dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <User className={`w-6 h-6 ${isActive('/profile') && 'fill-current'}`} />
            <span className="text-[10px] font-bold">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
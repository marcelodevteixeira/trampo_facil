import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, MapPin, Hammer, Home as HomeIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-secondary">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center relative w-8 h-8">
               <HomeIcon className="text-white w-5 h-5 absolute" strokeWidth={2.5} />
               <Hammer className="w-3 h-3 text-white absolute bottom-1 right-1 fill-white" />
            </div>
            <h1 className="text-xl font-extrabold text-secondary tracking-tight">Trampo<span className="text-primary">Fácil</span></h1>
          </div>
          {/* Only show add button on header if not on add page */}
          {!isActive('/add') && (
            <Link to="/add" className="text-sm font-bold text-primary border border-primary/20 hover:bg-purple-50 px-4 py-1.5 rounded-full transition-colors">
              Anunciar
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto pb-24 p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home className={`w-6 h-6 ${isActive('/') && 'fill-current'}`} />
            <span className="text-[10px] font-bold">Início</span>
          </Link>

          <Link
            to="/add"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive('/add') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <PlusCircle className={`w-6 h-6 ${isActive('/add') && 'fill-current'}`} />
            <span className="text-[10px] font-bold">Publicar</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive('/profile') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
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
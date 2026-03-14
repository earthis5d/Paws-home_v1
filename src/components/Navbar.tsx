import { Link } from 'react-router-dom';
import { PawPrint, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from './supabase';

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <PawPrint className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold text-warm-text tracking-tight">Paws & Home</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-warm-text hover:text-primary font-medium transition-colors">Home</Link>
            <Link to="/pets" className="text-warm-text hover:text-primary font-medium transition-colors">Browse Pets</Link>
            <Link to="/contact" className="text-warm-text hover:text-primary font-medium transition-colors">Contact</Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-purple-100">
                <span className="text-sm text-warm-muted hidden lg:block">Hello, {user.email?.split('@')[0]}</span>
                <button onClick={handleLogout} className="flex items-center gap-2 text-warm-muted hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-6 flex items-center gap-2">
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-warm-text p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-warm-text hover:bg-purple-50 rounded-lg">Home</Link>
            <Link to="/pets" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-warm-text hover:bg-purple-50 rounded-lg">Browse Pets</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-warm-text hover:bg-purple-50 rounded-lg">Contact</Link>
            {user ? (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-primary font-bold">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

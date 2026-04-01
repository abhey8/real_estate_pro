import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Heart, Home, LayoutDashboard, LogOut, Mail, Map, Menu, User, X } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';
import { Button } from './ui/button';

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Properties', path: '/properties', icon: Building2 },
    { name: 'Map', path: '/map-view', icon: Map },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <motion.nav
      initial={{ y: -96 }}
      animate={{ y: 0 }}
      className={`fixed left-0 right-0 top-0 z-50 border-b border-black/5 transition-all duration-300 ${
        isScrolled ? 'bg-white/96 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl' : 'bg-white/90 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link to="/" className="min-w-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3"
            >
              <img
                src="/logo.png"
                alt="Real Estate Pro logo"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/logo.svg';
                }}
                className="h-9 w-9 rounded-full object-contain md:h-11 md:w-11"
              />
              <div className="min-w-0">
                <span className="block whitespace-nowrap text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                  Real Estate Pro
                </span>
                <span className="hidden text-xs uppercase tracking-[0.28em] text-slate-400 sm:block">
                  Premium Property Search
                </span>
              </div>
            </motion.div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex xl:gap-4">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;

                return (
                  <Link key={link.path} to={link.path}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="hidden rounded-full px-4 text-slate-600 hover:bg-slate-100 lg:flex">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="hidden rounded-full px-4 text-slate-600 hover:bg-slate-100 lg:flex">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Button>
                </Link>
                <div
                  className="max-w-[180px] truncate rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                  title={user?.name || 'User'}
                >
                  Hi, {user?.name || 'User'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full px-4 text-slate-700 hover:bg-slate-100">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-200 bg-white lg:hidden"
        >
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}

            <div className="border-t border-slate-200 pt-2" />

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <Heart className="h-5 w-5" />
                    <span>Favorites</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <User className="h-5 w-5" />
                    <span>Log in</span>
                  </div>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <User className="h-5 w-5" />
                    <span>Sign up</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

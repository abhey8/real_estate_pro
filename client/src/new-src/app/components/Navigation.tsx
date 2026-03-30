import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Building2, Mail, Menu, X, Map, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../../../context/AuthContext';

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Properties', path: '/properties', icon: Building2 },
    { name: 'Map View', path: '/map-view', icon: Map },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <img
                src="/logo.png"
                alt="Real Estate Pro logo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/logo.svg';
                }}
                className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full"
              />
              <span className="text-lg md:text-xl tracking-tight">Real Estate Pro</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="relative flex items-center gap-2 px-4 py-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className={isActive ? '' : 'opacity-70'}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Favorites
                  </Button>
                </Link>
                <div className="text-sm font-medium pr-2">Hi, {user?.name || 'User'}</div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-4 space-y-2">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}
            
            <div className="border-t my-2 pt-2"></div>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>Favorites</span>
                  </div>
                </Link>
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-red-600"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <User className="w-5 h-5" />
                    <span>Log in</span>
                  </div>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <User className="w-5 h-5" />
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

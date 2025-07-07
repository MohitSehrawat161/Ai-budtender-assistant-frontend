'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Leaf, Package, FileText, Settings, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { login as loginAction, logout as logoutAction, setUser } from '@/store/authSlice';
import { api } from '@/store/api/api'; 


const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/strains', label: 'Strains', icon: Leaf },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/terms', label: 'Terms', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;
  const isLoggedIn = auth.isLoggedIn;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On mount, sync Redux state with cookies if present
  useEffect(() => {
    const token = Cookies.get('token');
    const userCookie = Cookies.get('user');
    if (token && userCookie) {
      dispatch(loginAction(JSON.parse(userCookie)));
    } else {
      dispatch(logoutAction());
    }
    setAuthChecked(true);
  }, [dispatch]);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    dispatch(api.util.resetApiState());

    dispatch(logoutAction());
    router.push('/login');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-white/20'
            : 'bg-white/60 backdrop-blur-md shadow-md shadow-slate-200/30'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/">
            <div className="flex items-center group">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${isScrolled
                      ? 'bg-gradient-to-br from-green-500 to-green-800 shadow-lg shadow-indigo-500/25'
                      : 'bg-gradient-to-br from-green-400 to-green-700 shadow-md shadow-indigo-400/20'
                    }`}
                >
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  AI Budtender
                </span>
              </div>
            </div>
           </Link>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`group  relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ease-out ${isActive
                        ? 'bg-gradient-to-r from-green-500/10 to-green-500/10 text-green-600 shadow-sm'
                        : 'text-slate-600 hover:text-green-600 hover:bg-white/50'
                      }`}
                  >
                    <IconComponent className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                    <span className="font-medium text-sm tracking-wide">{link.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl border border-indigo-200/30" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth Buttons Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {authChecked && (
                isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-800 flex items-center justify-center">
                      {user && <span className="text-white text-sm font-semibold">{user?.name.charAt(0).toUpperCase()+user?.name.split(' ').slice(1).join(' ').charAt(0).toUpperCase()}</span>}
                    </div>
                    <span className="text-slate-600 font-medium text-sm">Logged In</span>
                    <button
                      onClick={handleLogout}
                      className="text-slate-600 cursor-pointer hover:text-red-500 font-medium text-sm transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/30"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/sign-up"
                      className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 ease-out"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-out ${isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div
          className={`absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 ease-out ${isMobileMenuOpen
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95'
            }`}
        >
          <div className="p-6 space-y-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </a>
              );
            })}

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />

            {isLoggedIn ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  {user && <span className="text-white text-sm font-semibold">{user?.name.charAt(0).toUpperCase()+user?.name.split(' ').slice(1).join(' ').charAt(0).toUpperCase()}</span>}
                  </div>
                  <span className="font-medium text-slate-700">Logged In</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-500 cursor-pointer hover:text-red-600 font-medium text-sm px-3 py-1 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center space-x-2 text-slate-600 hover:text-indigo-600 font-medium px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-50"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/sign-up"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 ease-out"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
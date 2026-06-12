import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Job Openings', href: '/job-openings' },
    { name: 'Job Application', href: '/job-application' },
    { name: 'Placement Statistics', href: '/placement-statistics' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const linkClass = ({ isActive }) => 
    `text-sm font-semibold transition-all ${
      isActive 
        ? 'text-primary-600 border-b-2 border-primary-500 pb-1' 
        : 'text-gray-600 hover:text-primary-600'
    }`;

  const mobileLinkClass = ({ isActive }) => 
    `block px-4 py-3 text-base font-bold rounded-xl transition-all ${
      isActive 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
    }`;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-350 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-white/80 backdrop-blur-sm py-4 border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/10">
              <Briefcase size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Tenkasi Jobs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={linkClass}
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/admin-login"
              className="p-2 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Admin Console"
            >
              <ShieldAlert size={18} />
            </Link>

            <Link
              to="/job-application"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5 transition-all"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              to="/admin-login"
              className="p-2 text-gray-500 hover:text-gray-900 rounded-lg"
            >
              <ShieldAlert size={20} />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none p-1"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100">
          <div className="px-4 pt-3 pb-8 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={mobileLinkClass}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/job-application"
                className="block text-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold text-sm shadow-md"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
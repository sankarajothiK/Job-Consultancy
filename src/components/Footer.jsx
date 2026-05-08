import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-6">Tenkasi Jobs</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting talented candidates with top companies. Your dream career starts here with our dedicated placement support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/tenkasi_jobs_official?igsh=MXRvMHl3azV0cXdvbQ==" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Why Choose Us', 'Placements', 'Application Form', 'Contact'].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              {['IT Job Placements', 'Non-IT Placements', 'Medical Coding Jobs', 'Work From Home', 'Resume Building', 'Interview Preparation'].map((service, i) => (
                <li key={i} className="text-gray-400">
                  <span className="mr-2">›</span> {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for daily job updates.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-2 rounded-l-lg bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-r-lg font-medium hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tenkasi Jobs Consultancy. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Designed & Developed by <span className="text-primary-500 font-semibold cursor-pointer hover:text-primary-400">Jo</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

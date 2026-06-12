import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-6">Tenkasi Jobs</h3>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              Connecting talented candidates with top companies. Your dream career starts here with our dedicated recruitment support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/tenkasi_jobs_official?igsh=MXRvMHl3azV0cXdvbQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/job-openings" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Job Openings
                </Link>
              </li>
              <li>
                <Link to="/job-application" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Job Application
                </Link>
              </li>
              <li>
                <Link to="/placement-statistics" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Placement statistics
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Contact Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Our Sectors</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><span className="mr-2">›</span> IT Support Placements</li>
              <li><span className="mr-2">›</span> BPO Voice / Non-Voice</li>
              <li><span className="mr-2">›</span> Medical Billing & Coding</li>
              <li><span className="mr-2">›</span> Work From Home Support</li>
              <li><span className="mr-2">›</span> Candidate Interview Prep</li>
            </ul>
          </div>

          {/* Admin gate */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Administrators</h4>
            <p className="text-slate-400 mb-4 text-sm">Internal dashboard console access for registry moderation.</p>
            <Link 
              to="/admin-login" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
            >
              <ShieldAlert size={14} /> Admin Portal Login
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tenkasi Jobs Consultancy. All rights reserved.
          </p>
          <p>
            Designed & Developed for <span className="text-primary-500 font-semibold">Tenkasi Jobs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

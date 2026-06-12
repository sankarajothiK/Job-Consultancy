import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Phone, CheckCircle, 
  Activity, Mic, Headphones, Users, Keyboard, FolderOpen, Heart, Cpu,
  Briefcase, MapPin, DollarSign, Calendar
} from 'lucide-react';
import About from '../components/About';
import WhyChooseUs from '../components/WhyChooseUs';
import Feedback from '../components/Feedback';
import PlacementHighlights from '../components/PlacementHighlights';
import FloatingElements from '../components/FloatingElements';
import { getPublicJobs } from '../services/api';

const servicesList = [
  { name: 'Medical Billing', desc: 'Healthcare documentation & payment lifecycle management.', icon: Activity, color: 'from-green-500 to-emerald-600' },
  { name: 'Voice Process', desc: 'Inbound & outbound communication services.', icon: Mic, color: 'from-blue-500 to-indigo-600' },
  { name: 'Customer Support', desc: 'Providing world-class assistance for international clients.', icon: Headphones, color: 'from-purple-500 to-pink-600' },
  { name: 'BPO', desc: 'Comprehensive business process operations & support.', icon: Users, color: 'from-orange-500 to-red-600' },
  { name: 'Data Entry', desc: 'High-speed administrative data processing & entry.', icon: Keyboard, color: 'from-teal-500 to-cyan-600' },
  { name: 'Back Office', desc: 'Administrative and operational backend task handling.', icon: FolderOpen, color: 'from-sky-500 to-blue-600' },
  { name: 'Healthcare', desc: 'Medical billing, coding, and record analysis support.', icon: Heart, color: 'from-rose-500 to-red-600' },
  { name: 'IT Support', desc: 'Technical troubleshooting & workspace operations.', icon: Cpu, color: 'from-violet-500 to-purple-600' },
];

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await getPublicJobs();
        if (res.success) {
          // Take the latest 3 active jobs
          setFeaturedJobs(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading featured jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop"
            alt="Tenkasi Jobs Consultancy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-primary-950/60"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/10 backdrop-blur-[1px]"></div>
        </div>

        {/* Floating background blobs */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-semibold uppercase tracking-wider mb-6">
                Tenkasi's Leading Recruitment Agency
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Connecting Talent with <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary-400 via-emerald-300 to-secondary-400 bg-clip-text text-transparent">
                  World-Class Opportunities
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="mt-4 text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                Expert placement support for IT, Non-IT, Medical Billing, BPO, Data Entry, and work-from-home jobs. Build your dream career today.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/job-application"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold text-lg shadow-xl hover:shadow-primary-500/50 hover:-translate-y-1 transition-all flex items-center justify-center group"
              >
                Apply Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <Link
                to="/job-openings"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold text-lg border border-white/20 hover:bg-white hover:text-primary-700 transition-all flex items-center justify-center"
              >
                Browse Openings
              </Link>
            </motion.div>

            {/* Counters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8"
            >
              {[
                { number: '1500+', label: 'Candidates Placed' },
                { number: '50+', label: 'Partner Companies' },
                { number: '98%', label: 'Placement Rate' },
                { number: '24/7', label: 'Candidate Support' },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</span>
                  <span className="text-xs md:text-sm font-medium text-gray-200 uppercase tracking-wider text-center">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <About />

      {/* ── WHY CHOOSE US ── */}
      <WhyChooseUs />

      {/* ── SERVICES SECTION ── */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wider">Expertise Areas</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Services We Offer</h3>
            <p className="mt-4 text-lg text-gray-600">
              We specialize in screening and placing candidate profiles across highly demanding sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesList.map((service, index) => {
              const IconComp = service.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-2xl p-6 bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                    <IconComp size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOB OPENINGS ── */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wider">Get Employed</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Latest Job Openings</h3>
            </div>
            <Link
              to="/job-openings"
              className="mt-4 md:mt-0 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 group transition-all"
            >
              View All Openings <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingJobs ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-600 text-lg">No active openings found at the moment.</p>
              <Link
                to="/job-application"
                className="mt-4 inline-block px-6 py-2.5 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors"
              >
                Submit General Application
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-semibold uppercase mb-4">
                      {job.workType}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{job.jobRole}</h4>
                    <p className="text-gray-500 text-sm font-medium mb-4">{job.companyName}</p>

                    <div className="space-y-2.5 border-t border-b border-gray-100 py-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <DollarSign size={16} className="text-gray-400" />
                        <span>{job.salaryPackage}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <Briefcase size={16} className="text-gray-400" />
                        <span>{job.experience} Required</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/job-application', { state: { prefilledRole: job.jobRole } })}
                    className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl font-bold hover:shadow-md transition-shadow"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PLACEMENT HIGHLIGHTS ── */}
      <PlacementHighlights />

      {/* ── SUCCESS STATISTICS CARD ── */}
      <section className="py-20 bg-white relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-primary-700 to-secondary-800 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to kickstart your career journey?</h3>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Submit your resume details once, and let our experienced recruiters match you with active hiring partners in Tenkasi and across Tamil Nadu.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/job-application"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary-700 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Register as Candidate
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Contact Our Office
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Feedback />

      {/* ── FLOATING DESIGN ELEMENTS ── */}
      <FloatingElements />
    </div>
  );
};

export default Home;

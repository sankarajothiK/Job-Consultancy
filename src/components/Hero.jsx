import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop"
          alt="Job Consultancy"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-primary-900/60"></div>

        {/* Extra Blur Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-secondary-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Successfully Placed Candidates Across <br className="hidden lg:block" />
              <span className="bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                Multiple Companies
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mt-4 text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Freshers & Experienced candidates can apply for IT, Non-IT,
              Medical Coding, Data Entry & Work From Home jobs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#apply"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold text-lg shadow-xl hover:shadow-primary-500/50 hover:-translate-y-1 transition-all flex items-center justify-center group"
            >
              Apply Now
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </a>

            <a
              href="https://wa.link/wsvir6"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold text-lg border border-white/20 hover:bg-white hover:text-primary-600 transition-all flex items-center justify-center"
            >
              <Phone className="mr-2" size={20} />
              Contact WhatsApp
            </a>
          </motion.div>

          {/* Animated Counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8"
          >
            {[
              { number: '1000+', label: 'Candidates' },
              { number: '200+', label: 'Companies' },
              { number: 'Daily', label: 'Openings' },
              { number: '100%', label: 'Support' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center"
              >
                <span className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-200 uppercase tracking-wider text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
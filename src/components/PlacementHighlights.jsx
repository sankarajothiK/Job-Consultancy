import React from 'react';
import { motion } from 'framer-motion';

const companies = [
  'Tech Mahindra', 'Accenture', 'Infosys', 'Wipro', 
  'HCL', 'TCS', 'Cognizant', 'Capgemini'
];

const PlacementHighlights = () => {
  return (
    <section id="placements" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Top Placement Partners
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Our candidates are successfully placed in reputed MNCs and fast-growing startups.
        </motion.p>
      </div>

      {/* Marquee Animation */}
      <div className="relative flex overflow-x-hidden group bg-gray-50 py-10 border-y border-gray-100">
        <div className="animate-marquee flex whitespace-nowrap">
          {companies.map((company, idx) => (
            <div key={idx} className="mx-8 flex items-center justify-center">
              <div className="px-8 py-4 bg-white shadow-sm border border-gray-100 rounded-xl text-xl font-bold text-gray-400 grayscale hover:grayscale-0 hover:text-primary-600 transition-all duration-300">
                {company}
              </div>
            </div>
          ))}
        </div>
        {/* Duplicate for seamless infinite scrolling */}
        <div className="animate-marquee flex whitespace-nowrap absolute top-10">
          {companies.map((company, idx) => (
            <div key={`dup-${idx}`} className="mx-8 flex items-center justify-center">
              <div className="px-8 py-4 bg-white shadow-sm border border-gray-100 rounded-xl text-xl font-bold text-gray-400 grayscale hover:grayscale-0 hover:text-primary-600 transition-all duration-300">
                {company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacementHighlights;

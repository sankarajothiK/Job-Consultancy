import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Layers, Users, Zap, Compass, Bell, FileSignature, Handshake } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    { icon: <ShieldCheck />, title: 'Trusted Support', desc: 'Reliable placement support you can count on.' },
    { icon: <Layers />, title: 'Multiple Openings', desc: 'Access to a wide variety of job roles across industries.' },
    { icon: <Users />, title: 'All Experience Levels', desc: 'Opportunities for both freshers and experienced professionals.' },
    { icon: <Zap />, title: 'Quick Process', desc: 'Fast-tracked interview scheduling and rapid feedback.' },
    { icon: <Compass />, title: 'Career Guidance', desc: 'Expert counseling to steer your career in the right direction.' },
    { icon: <Bell />, title: 'Daily Updates', desc: 'Get notified about the latest job openings every day.' },
    { icon: <FileSignature />, title: 'Resume Building', desc: 'Professional assistance in crafting a winning resume.' },
    { icon: <Handshake />, title: 'HR Guidance', desc: 'Direct tips and preparation from experienced HRs.' },
  ];

  return (
    <section id="why-us" className="py-20 bg-gray-50 relative">
      <div className="absolute inset-0 bg-primary-900/5 mix-blend-multiply pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Choose Us?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            We stand out by providing dedicated, end-to-end support until you secure your desired job.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 group hover:bg-white transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-4 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-600">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

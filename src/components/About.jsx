import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, UserPlus, BookOpen, FileText, CalendarClock } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <UserPlus className="w-6 h-6 text-primary-600" />,
      title: 'Freshers Hiring',
      description: 'Dedicated support for fresh graduates to kickstart their careers in top companies.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-secondary-600" />,
      title: 'Experienced Hiring',
      description: 'Find better opportunities and career growth with our extensive corporate network.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary-600" />,
      title: 'Career Guidance',
      description: 'Expert advice to help you choose the right path and succeed in your interviews.'
    },
    {
      icon: <FileText className="w-6 h-6 text-secondary-600" />,
      title: 'Resume Support',
      description: 'Professional resume building services to make your profile stand out to recruiters.'
    },
    {
      icon: <CalendarClock className="w-6 h-6 text-primary-600" />,
      title: 'Interview Scheduling',
      description: 'Hassle-free coordination and scheduling of interviews with potential employers.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Comprehensive Placement Support
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            We bridge the gap between talented individuals and leading companies, ensuring a smooth transition into your dream job.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

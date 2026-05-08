import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions? We are here to help you navigate your career journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                <MapPin />
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Our Location</h4>
                <p className="text-gray-600">123 / 4A ,Sakthi Nagar,
                 <br />Tenkasi, Tamil Nadu 627811</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 shrink-0">
                <Phone />
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Phone & WhatsApp</h4>
                <p className="text-gray-600">+91 9025290418</p>
              
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                <Mail />
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Email Us</h4>
                <p className="text-gray-600">tenkasijobsofficial@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 shrink-0">
                <Clock />
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Working Hours</h4>
                <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </motion.div>

          {/* Map Embed */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100"
          >
            <iframe
              title="Tenkasi Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.948241482977!2d77.29875412752263!3d8.97691026808881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06820c2b66d265%3A0x8b49515f6a473f3b!2sSakthi%20Nagar%2C%20Tenkasi%2C%20Tamil%20Nadu%20627811!5e0!3m2!1sen!2sin!4v1778221546276!5m2!1sen!2sin" width="600" height="450" 
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

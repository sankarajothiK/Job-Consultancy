import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const mockFeedbacks = [
  { id: 1, name: 'Arun Kumar', company: 'TCS', message: 'Tenkasi Jobs helped me get placed in TCS within 2 weeks. Their interview preparation was excellent!', rating: 5 },
  { id: 2, name: 'Priya M', company: 'Cognizant', message: 'Very professional consultancy. They guided me through the entire process.', rating: 5 },
  { id: 3, name: 'Siva', company: 'Tech Mahindra', message: 'Best placement support in Tenkasi. Highly recommended for freshers.', rating: 4 },
];

const Feedback = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    message: '',
    rating: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeedback = { ...formData, id: Date.now() };
    setFeedbacks([newFeedback, ...feedbacks]);
    setFormData({ name: '', company: '', message: '', rating: 5 });
    setIsModalOpen(false);
    toast.success('Feedback submitted successfully!');
    // In actual implementation, send this to Firebase
  };

  return (
    <section id="feedback" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Candidate Feedbacks
            </motion.h2>
            <p className="text-gray-600 text-lg">See what our successfully placed candidates say.</p>
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => setIsModalOpen(true)}
            className="mt-6 md:mt-0 px-6 py-3 bg-white text-primary-600 font-semibold rounded-full shadow-md border border-primary-100 hover:bg-primary-50 hover:shadow-lg transition-all flex items-center"
          >
            <MessageSquarePlus className="mr-2" size={20} />
            Add Feedback
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 relative"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < item.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{item.message}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl">
                  {item.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">Placed at <span className="font-semibold text-primary-600">{item.company}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Placed</label>
                  <input required type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className={`${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                        <Star fill="currentColor" size={28} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Message</label>
                  <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold shadow-md hover:bg-primary-700 transition-colors">
                  Submit Feedback
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Feedback;

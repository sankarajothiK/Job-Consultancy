import React, { useState, useEffect } from 'react';
import { getPublicPlacements } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Calendar, DollarSign, MapPin, X, Send, 
  Award, MessageSquare, Quote, GraduationCap
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ADMIN_WHATSAPP_NUMBER = '919025290418'; // Tenkasi Jobs WhatsApp number

const PlacementStatisticsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await getPublicPlacements();
        if (res.success) {
          setPlacements(res.data);
        }
      } catch (err) {
        console.error('Error fetching placements:', err);
        toast.error('Failed to load placement statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlacements();
  }, []);

  const handleWhatsAppVerify = (candidateName) => {
    const message = `Hi Tenkasi Jobs,\nI would like to verify or view the offer letter of candidate ${candidateName}. Please provide further details.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Our Success Stories</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">Placement Highlights</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our successfully placed candidates. We bridge the gap between talented individuals and leading companies.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : placements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm border border-gray-150">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No placements logged yet</h3>
            <p className="text-gray-500 mb-6">Our placed candidate roster is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {placements.map((p) => (
              <motion.div
                key={p._id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Photo & Company Logo bar */}
                <div className="relative h-48 bg-gradient-to-tr from-primary-600 to-secondary-700">
                  <img
                    src={p.candidatePhoto || 'https://picsum.photos/400/400'}
                    alt={p.candidateName}
                    className="w-full h-full object-cover mix-blend-overlay opacity-90"
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold">{p.candidateName}</h3>
                    <p className="text-xs text-primary-100 font-medium">Placed Candidate</p>
                  </div>
                </div>

                {/* Placement Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Hired By:</span>
                      <span className="font-bold text-primary-700">{p.companyName}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Role:</span>
                      <span className="font-semibold text-gray-900">{p.jobRole}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Package:</span>
                      <span className="font-semibold text-gray-900">{p.salaryPackage}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Joining Date:</span>
                      <span className="text-gray-800">
                        {new Date(p.joiningDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={() => setSelectedPlacement(p)}
                      className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleWhatsAppVerify(p.candidateName)}
                      className="py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl text-xs font-bold hover:shadow-md transition-shadow text-center flex items-center justify-center gap-1"
                    >
                      <Send size={12} /> Verify Offer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── DETAIL MODAL ── */}
        <AnimatePresence>
          {selectedPlacement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPlacement(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full relative z-10 border border-gray-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPlacement(null)}
                  className="absolute top-4 right-4 z-25 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Left Side: Image / Key Stats */}
                <div className="md:w-2/5 bg-gradient-to-br from-primary-600 to-secondary-800 text-white p-6 flex flex-col justify-between">
                  <div className="text-center md:text-left">
                    <img
                      src={selectedPlacement.candidatePhoto || 'https://picsum.photos/400/400'}
                      alt={selectedPlacement.candidateName}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20 mx-auto md:mx-0 mb-4 shadow-lg"
                    />
                    <h4 className="text-xl font-bold">{selectedPlacement.candidateName}</h4>
                    <p className="text-xs text-primary-200 mt-1">{selectedPlacement.companyName}</p>
                  </div>

                  <div className="space-y-3 mt-6 border-t border-white/10 pt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-primary-200 font-semibold">Degree:</span>
                      <span className="font-medium truncate max-w-[120px]">{selectedPlacement.qualification}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-200 font-semibold">Passout Year:</span>
                      <span>{selectedPlacement.yearOfPassing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-200 font-semibold">Score/CGPA:</span>
                      <span>{selectedPlacement.cgpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-200 font-semibold">Location:</span>
                      <span className="truncate max-w-[120px]">{selectedPlacement.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Description / Feedbacks */}
                <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
                  <div>
                    {/* Header stats */}
                    <div className="border-b border-gray-100 pb-4 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Placement Story</span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{selectedPlacement.jobRole}</h3>
                      <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 mt-1">
                        <DollarSign size={12} /> {selectedPlacement.salaryPackage} LPA Package
                      </p>
                    </div>

                    {/* Success Story */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                          <Award size={14} className="text-primary-500" /> Success Story
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {selectedPlacement.successStory || 'Placed successfully as candidate through Tenkasi Jobs.'}
                        </p>
                      </div>

                      {/* Candidate Feedback */}
                      {selectedPlacement.feedback && (
                        <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-4 relative">
                          <Quote className="absolute top-2 right-2 w-8 h-8 text-primary-100" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700 mb-1 flex items-center gap-1">
                            <MessageSquare size={14} /> Candidate Feedback
                          </h4>
                          <p className="text-gray-600 text-sm italic leading-relaxed whitespace-pre-line">
                            "{selectedPlacement.feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedPlacement(null)}
                      className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const name = selectedPlacement.candidateName;
                        setSelectedPlacement(null);
                        handleWhatsAppVerify(name);
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl text-xs font-bold hover:shadow-md transition-shadow flex items-center gap-1"
                    >
                      <Send size={10} /> Verify Offer Letter
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default PlacementStatisticsPage;

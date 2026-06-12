import React, { useState } from 'react';
import { submitContact } from '../services/api';
import { 
  MapPin, Phone, Mail, MessageSquare, Send, CheckCircle, 
  Clock, ShieldAlert 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.mobile || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Sending your message...');

    try {
      const res = await submitContact(formData);
      if (res.success) {
        toast.success('Thank you! Your message has been received.', { id: toastId });
        setIsSuccess(true);
        setFormData({ name: '', mobile: '', email: '', message: '' });
      } else {
        toast.error(res.message || 'Failed to send message.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Get in Touch</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">Contact Tenkasi Jobs</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our recruitment process or job openings? Drop us a line or visit our office.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Info cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-md flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Office Address</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tenkasi Jobs Consultancy,<br />
                  12/A, Old Bus Stand Road,<br />
                  Tenkasi, Tamil Nadu - 627811
                </p>
              </div>
            </div>

            {/* Mobile Numbers */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-md flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Call / WhatsApp</h3>
                <p className="text-gray-600 text-sm">
                  Mobile: <a href="tel:+919025290418" className="hover:underline font-semibold text-gray-800">+91 90252 90418</a>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  WhatsApp: <a href="https://wa.me/919025290418" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-gray-800">+91 90252 90418</a>
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-md flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Email Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <a href="mailto:tenkasijobsofficial@gmail.com" className="hover:underline font-semibold text-gray-800">tenkasijobsofficial@gmail.com</a>
                </p>
              </div>
            </div>

            {/* Timings */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-md flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Office Hours</h3>
                <p className="text-gray-600 text-sm">Monday - Saturday: 9:30 AM - 6:30 PM</p>
                <p className="text-gray-500 text-xs mt-1">Sunday: Holiday</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 border border-gray-150 shadow-md">
            
            {isSuccess ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Thank you for contacting Tenkasi Jobs. Our support team will respond to your inquiry shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                  <MessageSquare className="text-primary-600" size={20} /> Send an Inquiry
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white"
                      placeholder="10-digit mobile"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email ID *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white resize-none"
                    placeholder="Enter your message details here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Send size={16} /> {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Google Maps Embed Section */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-md">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <ShieldAlert className="text-primary-600" size={20} />
            <h3 className="font-bold text-gray-900">Map Location</h3>
          </div>
          <div className="relative h-96 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15769.756209426914!2d77.30663765!3d8.83838305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0429f45d8b88d3%3A0xe54e3d062e742be9!2sTenkasi%2C%20Tamil%20Nadu%20627811!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              title="Tenkasi Jobs Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;

import React, { useState, useEffect } from 'react';
import { getContacts, deleteContact } from '../../services/api';
import { Search, Trash2, Mail, MessageSquare, AlertCircle, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ContactsModule = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getContacts(search);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the message from "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteContact(id);
      if (res.success) {
        toast.success(`Deleted message from ${name}`);
        setMessages(messages.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Contact Enquiries</h2>
        <p className="text-gray-400 text-xs">Review customer, client, or candidate support message logs</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender name, email, mobile, or message contents..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-150 shadow-sm">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No contact messages</h3>
          <p className="text-gray-400 text-xs">Roster is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-lg leading-snug">{m.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{m.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Mobile: {m.mobile}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(m._id, m.name)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Message body */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {m.message}
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-4">
                <Calendar size={12} />
                <span>
                  Received: {new Date(m.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ContactsModule;

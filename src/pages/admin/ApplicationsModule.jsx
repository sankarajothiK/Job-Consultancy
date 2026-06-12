import React, { useState, useEffect } from 'react';
import { getApplications, deleteApplication } from '../../services/api';
import { Search, Eye, Trash2, Calendar, FileText, Download, User, CheckCircle, X, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ApplicationsModule = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');

  // Modals state
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search.trim()) filters.search = search;
      if (qualification) filters.qualification = qualification;
      if (experience) filters.experience = experience;

      const res = await getApplications(filters);
      if (res.success) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load job applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, qualification, experience]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the application of "${name}"?`)) {
      return;
    }
    
    try {
      const res = await deleteApplication(id);
      if (res.success) {
        toast.success(`Deleted application for ${name}`);
        setApplications(applications.filter(app => app._id !== id));
        if (selectedApp?._id === id) {
          setSelectedApp(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete application.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Job Applications</h2>
          <p className="text-gray-400 text-xs">Review registry of candidates who applied on the portal</p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, mobile, email or preferred role..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Qualification filter */}
        <div className="w-full md:w-48">
          <input
            type="text"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="Filter Qualification"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Experience filter */}
        <div className="w-full md:w-48">
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white"
          >
            <option value="">All Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>

      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-150 shadow-sm">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
          <p className="text-gray-400 text-xs">Try relaxing search parameters or checking later.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Mobile</th>
                  <th className="py-4 px-6">Qualification</th>
                  <th className="py-4 px-6">Preferred Role</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{app.name}</td>
                    <td className="py-4 px-6">{app.mobile}</td>
                    <td className="py-4 px-6 font-medium">{app.qualification}</td>
                    <td className="py-4 px-6 font-semibold text-primary-700">{app.preferredRole}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.experience === 'Fresher' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {app.experience}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye size={18} />
                        </button>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Resume"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(app._id, app.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PROFILE DETAILS MODAL ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal Container */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full relative z-10 border border-gray-100 max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary-600 to-secondary-700 text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-extrabold text-lg">
                  {selectedApp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedApp.name}</h3>
                  <p className="text-xs text-primary-200">Candidate Profile Detail</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="bg-black/20 hover:bg-black/40 text-white p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
              
              {/* Section: Contact details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedApp.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Mobile Number</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedApp.mobile}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">WhatsApp Number</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedApp.whatsapp}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedApp.location}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Gender / DOB</span>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {selectedApp.gender} • {new Date(selectedApp.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preferred Role</span>
                  <p className="font-bold text-primary-700 mt-0.5">
                    {selectedApp.preferredRole === 'Other' && selectedApp.customJobRole
                      ? `Other: ${selectedApp.customJobRole}`
                      : selectedApp.preferredRole}
                  </p>
                </div>
                {selectedApp.preferredCompanies && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preferred Companies</span>
                    <p className="font-semibold text-gray-900 mt-0.5">{selectedApp.preferredCompanies}</p>
                  </div>
                )}
              </div>

              {/* Section: Education */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Education & College</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400">Qualification</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.qualification}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">College Name</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.collegeName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Year of Passing</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.yearOfPassing}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">CGPA / Percentage</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.cgpa}</p>
                  </div>
                </div>
              </div>

              {/* Section: Experience */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Work History</h4>
                <div>
                  <span className="text-xs text-gray-400">Experience Type</span>
                  <p className="font-bold text-gray-800 mt-0.5">{selectedApp.experience}</p>
                </div>
                {selectedApp.experience === 'Experienced' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div>
                      <span className="text-xs text-blue-800">Current / Last Company</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.currentCompany}</p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-800">Salary (Current / Expected)</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.currentSalary} / {selectedApp.expectedSalary}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-xs text-blue-800">Experience Details</span>
                      <p className="text-gray-700 mt-1 whitespace-pre-line leading-relaxed">{selectedApp.experienceDetails}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Skills & Languages */}
              <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.skills && selectedApp.skills.length > 0 ? (
                      selectedApp.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs font-medium italic">No specific skills listed</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Languages Known</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.languages && selectedApp.languages.length > 0 ? (
                      selectedApp.languages.map((lang, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs font-medium italic">No languages listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Notes */}
              {selectedApp.notes && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Additional Candidate Notes</h4>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{selectedApp.notes}</p>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <a
                href={selectedApp.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl text-xs font-bold hover:shadow-md transition-shadow flex items-center gap-1.5"
              >
                <Download size={14} /> View / Download Resume PDF
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationsModule;

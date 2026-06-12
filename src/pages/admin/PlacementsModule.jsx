import React, { useState, useEffect } from 'react';
import { getAllPlacements, createPlacement, updatePlacement, deletePlacement } from '../../services/api';
import { Plus, Edit2, Trash2, Award, X, Upload, Image, FileText, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PlacementsModule = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    candidateName: '',
    companyName: '',
    jobRole: '',
    salaryPackage: '',
    location: '',
    qualification: '',
    yearOfPassing: '',
    cgpa: '',
    joiningDate: '',
    feedback: '',
    successStory: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [offerLetterFile, setOfferLetterFile] = useState(null);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await getAllPlacements();
      if (res.success) {
        setPlacements(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load placements roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      candidateName: '',
      companyName: '',
      jobRole: '',
      salaryPackage: '',
      location: '',
      qualification: '',
      yearOfPassing: '',
      cgpa: '',
      joiningDate: '',
      feedback: '',
      successStory: '',
    });
    setPhotoFile(null);
    setOfferLetterFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p._id);
    const dateFormatted = p.joiningDate ? new Date(p.joiningDate).toISOString().split('T')[0] : '';
    setFormData({
      candidateName: p.candidateName,
      companyName: p.companyName,
      jobRole: p.jobRole,
      salaryPackage: p.salaryPackage,
      location: p.location,
      qualification: p.qualification,
      yearOfPassing: p.yearOfPassing,
      cgpa: p.cgpa,
      joiningDate: dateFormatted,
      feedback: p.feedback || '',
      successStory: p.successStory || '',
    });
    setPhotoFile(null);
    setOfferLetterFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.candidateName || !formData.companyName || !formData.jobRole || !formData.salaryPackage || !formData.joiningDate) {
      toast.error('Please enter all required candidate details.');
      return;
    }

    // Candidate photo is optional, no required check

    const toastId = toast.loading(editingId ? 'Saving modifications...' : 'Adding placement story...');

    try {
      // Build FormData payload for files
      const dataPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        dataPayload.append(key, formData[key]);
      });

      if (photoFile) dataPayload.append('candidatePhoto', photoFile);
      if (offerLetterFile) dataPayload.append('offerLetter', offerLetterFile);

      if (editingId) {
        const res = await updatePlacement(editingId, dataPayload);
        if (res.success) {
          toast.success('Placement details updated successfully!', { id: toastId });
          setPlacements(placements.map((p) => (p._id === editingId ? res.data : p)));
          setIsModalOpen(false);
        }
      } else {
        const res = await createPlacement(dataPayload);
        if (res.success) {
          toast.success('Candidate placement added successfully!', { id: toastId });
          setPlacements([res.data, ...placements]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error saving placement details.', { id: toastId });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the placement record for "${name}"?`)) {
      return;
    }

    try {
      const res = await deletePlacement(id);
      if (res.success) {
        toast.success(`Deleted placement of ${name}`);
        setPlacements(placements.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete placement.');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5';

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Title Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Placement Statistics</h2>
          <p className="text-gray-400 text-xs">Manage placement histories and candidate offer letters</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-500 hover:shadow-md text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-shadow"
        >
          <Plus size={16} /> Add Placement
        </button>
      </div>

      {/* Roster list */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : placements.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-150 shadow-sm">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No placements listed</h3>
          <p className="text-gray-400 text-xs">Register your first placed candidate using the button above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Job Role</th>
                  <th className="py-4 px-6">Package</th>
                  <th className="py-4 px-6">Joining Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {placements.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.candidatePhoto}
                          alt={p.candidateName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        />
                        <span className="font-bold text-gray-900">{p.candidateName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">{p.companyName}</td>
                    <td className="py-4 px-6 text-primary-700 font-medium">{p.jobRole}</td>
                    <td className="py-4 px-6">{p.salaryPackage} LPA</td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(p.joiningDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.candidateName)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* ── PLACEMENT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full relative z-10 border border-gray-100 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary-600 to-secondary-700 text-white flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold">{editingId ? 'Modify Placement Record' : 'Record New Placement'}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-black/20 hover:bg-black/45 text-white p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Candidate Name *</label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Candidate Name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Hiring Company"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Job Role *</label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Medical Coder"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Salary Package (LPA) *</label>
                  <input
                    type="text"
                    name="salaryPackage"
                    value={formData.salaryPackage}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. 3.6"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Tenkasi"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Qualification *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. B.Sc Biotech"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Year of Passing *</label>
                  <input
                    type="number"
                    name="yearOfPassing"
                    value={formData.yearOfPassing}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. 2024"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>CGPA / Percentage *</label>
                  <input
                    type="text"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. 85%"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Joining Date *</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="hidden md:block" />

                {/* Candidate Photo */}
                <div>
                  <label className={labelClass}>Candidate Photo (Optional)</label>
                  <div className="relative border border-dashed border-gray-200 hover:bg-gray-50 rounded-xl p-3 text-center flex items-center justify-center gap-2 cursor-pointer h-[50px] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Image size={16} className="text-primary-600" />
                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[180px]">
                      {photoFile ? photoFile.name : 'Choose Candidate Photo'}
                    </span>
                  </div>
                </div>

                {/* Offer Letter */}
                <div>
                  <label className={labelClass}>Offer Letter (Optional, PDF)</label>
                  <div className="relative border border-dashed border-gray-200 hover:bg-gray-50 rounded-xl p-3 text-center flex items-center justify-center gap-2 cursor-pointer h-[50px] transition-colors">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setOfferLetterFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileText size={16} className="text-primary-600" />
                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[180px]">
                      {offerLetterFile ? offerLetterFile.name : 'Choose Offer Letter (PDF)'}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Candidate Feedback *</label>
                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder="Candidate quotation/testimonial about Tenkasi Jobs..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Success Story *</label>
                  <textarea
                    name="successStory"
                    value={formData.successStory}
                    onChange={handleInputChange}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe candidate's road to success, challenges faced, or interview guidance experience..."
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-500 hover:shadow-md text-white rounded-xl text-xs font-bold transition-all"
                >
                  {editingId ? 'Save Changes' : 'Record Placement'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default PlacementsModule;

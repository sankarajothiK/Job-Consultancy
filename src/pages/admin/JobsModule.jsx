import React, { useState, useEffect } from 'react';
import { getAllJobs, createJob, updateJob, deleteJob } from '../../services/api';
import { Plus, Edit2, Trash2, Shield, Calendar, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const JobsModule = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    vacancyCount: '',
    salaryPackage: '',
    shiftTiming: '',
    workType: 'Office',
    location: '',
    qualification: '',
    experience: '',
    requiredSkills: '',
    jobDescription: '',
    benefits: '',
    lastDateToApply: '',
    status: 'active',
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch job openings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingJobId(null);
    setFormData({
      companyName: '',
      jobRole: '',
      vacancyCount: '',
      salaryPackage: '',
      shiftTiming: '',
      workType: 'Office',
      location: '',
      qualification: '',
      experience: '',
      requiredSkills: '',
      jobDescription: '',
      benefits: '',
      lastDateToApply: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJobId(job._id);
    
    // Format date for input tag (YYYY-MM-DD)
    const formattedDate = job.lastDateToApply
      ? new Date(job.lastDateToApply).toISOString().split('T')[0]
      : '';

    setFormData({
      companyName: job.companyName,
      jobRole: job.jobRole,
      vacancyCount: job.vacancyCount,
      salaryPackage: job.salaryPackage,
      shiftTiming: job.shiftTiming,
      workType: job.workType,
      location: job.location,
      qualification: job.qualification,
      experience: job.experience,
      requiredSkills: job.requiredSkills.join(', '),
      jobDescription: job.jobDescription,
      benefits: job.benefits || '',
      lastDateToApply: formattedDate,
      status: job.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.jobRole || !formData.vacancyCount || !formData.salaryPackage || !formData.lastDateToApply) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const toastId = toast.loading(editingJobId ? 'Updating opening...' : 'Creating opening...');

    try {
      if (editingJobId) {
        const res = await updateJob(editingJobId, formData);
        if (res.success) {
          toast.success('Job opening updated successfully!', { id: toastId });
          setJobs(jobs.map((j) => (j._id === editingJobId ? res.data : j)));
          setIsModalOpen(false);
        }
      } else {
        const res = await createJob(formData);
        if (res.success) {
          toast.success('Job opening created successfully!', { id: toastId });
          setJobs([res.data, ...jobs]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error saving job opening.', { id: toastId });
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await updateJob(job._id, { status: newStatus });
      if (res.success) {
        toast.success(`Job marked as ${newStatus}`);
        setJobs(jobs.map((j) => (j._id === job._id ? res.data : j)));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to change status.');
    }
  };

  const handleDelete = async (id, role, company) => {
    if (!window.confirm(`Are you sure you want to delete the job opening for "${role}" at "${company}"?`)) {
      return;
    }

    try {
      const res = await deleteJob(id);
      if (res.success) {
        toast.success('Job opening deleted successfully!');
        setJobs(jobs.filter((j) => j._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job opening.');
    }
  };

  const inputClass = 'w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5';

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Title Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Job Openings Management</h2>
          <p className="text-gray-400 text-xs">Create, modify, or archive active job openings on the consultancy website</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-500 hover:shadow-md text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-shadow"
        >
          <Plus size={16} /> Add Job Opening
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-150 shadow-sm">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No openings posted</h3>
          <p className="text-gray-400 text-xs">Click the button above to post your first vacancy.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Job Role</th>
                  <th className="py-4 px-6">Vacancies</th>
                  <th className="py-4 px-6">Package</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{job.companyName}</td>
                    <td className="py-4 px-6 font-semibold text-primary-700">{job.jobRole}</td>
                    <td className="py-4 px-6">{job.vacancyCount} Openings</td>
                    <td className="py-4 px-6">{job.salaryPackage}</td>
                    <td className="py-4 px-6">{job.location} ({job.workType})</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          job.status === 'active'
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {job.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {job.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(job)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id, job.jobRole, job.companyName)}
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

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full relative z-10 border border-gray-100 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary-600 to-secondary-700 text-white flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold">{editingJobId ? 'Edit Job Opening' : 'Add New Job Opening'}</h3>
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
                  <label className={labelClass}>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. TCS"
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
                    placeholder="e.g. Software Developer"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Vacancy Count *</label>
                  <input
                    type="number"
                    name="vacancyCount"
                    value={formData.vacancyCount}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. 5"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Salary Package *</label>
                  <input
                    type="text"
                    name="salaryPackage"
                    value={formData.salaryPackage}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. 3.6 - 4.2 LPA"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Shift Timing *</label>
                  <input
                    type="text"
                    name="shiftTiming"
                    value={formData.shiftTiming}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Day Shift (9 AM - 6 PM)"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Work Type *</label>
                  <select name="workType" value={formData.workType} onChange={handleInputChange} className={inputClass}>
                    <option value="WFH">Work From Home (WFH)</option>
                    <option value="Office">Office (On-Site)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Tenkasi, Chennai"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Qualification Required *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. B.E CSE, B.Sc, Any Graduate"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Experience Required *</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Fresher / 0 - 2 Years"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Last Date to Apply *</label>
                  <input
                    type="date"
                    name="lastDateToApply"
                    value={formData.lastDateToApply}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Required Skills (Comma separated) *</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. React.js, Node.js, JavaScript, MongoDB"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Job Description *</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Enter detailed job roles & responsibilities..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Benefits / Perks</label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder="e.g. Free Food, Cab facility, Health Insurance..."
                  />
                </div>
              </div>

              {/* Submit panel */}
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
                  {editingJobId ? 'Save Changes' : 'Post Opening'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default JobsModule;

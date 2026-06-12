import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicJobs } from '../services/api';
import { 
  MapPin, DollarSign, Calendar, Briefcase, Users, Clock, 
  Search, SlidersHorizontal, BookOpen, Heart, Info, ArrowLeft
} from 'lucide-react';

const JobOpeningsPage = () => {
  const [openings, setOpenings] = useState([]);
  const [filteredOpenings, setFilteredOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [workType, setWorkType] = useState('All');
  const [location, setLocation] = useState('All');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        const res = await getPublicJobs();
        if (res.success) {
          setOpenings(res.data);
          setFilteredOpenings(res.data);
        } else {
          setError(res.message || 'Failed to fetch job openings.');
        }
      } catch (err) {
        console.error('Error fetching job openings:', err);
        setError('Connection error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpenings();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = openings;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (job) =>
          job.jobRole.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (workType !== 'All') {
      result = result.filter((job) => job.workType === workType);
    }

    if (location !== 'All') {
      result = result.filter((job) => job.location.toLowerCase() === location.toLowerCase());
    }

    setFilteredOpenings(result);
  }, [search, workType, location, openings]);

  // Extract unique locations for filter dropdown
  const uniqueLocations = ['All', ...new Set(openings.map((job) => job.location))];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Hiring Now</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">Available Job Openings</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through active openings and apply directly. Our team will fast-track your applications to the hiring managers.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job role, company or skills…"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
              />
            </div>

            {/* Work Type Filter */}
            <div className="relative">
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white"
              >
                <option value="All">All Work Types</option>
                <option value="WFH">Work From Home (WFH)</option>
                <option value="Office">Work From Office</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white"
              >
                <option value="All">All Locations</option>
                {uniqueLocations.filter(loc => loc !== 'All').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 max-w-xl mx-auto">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredOpenings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm">
            <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matching jobs found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => { setSearch(''); setWorkType('All'); setLocation('All'); }}
              className="px-6 py-2 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOpenings.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line info */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                      {job.workType}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Apply before: {new Date(job.lastDateToApply).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Title & Company */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.jobRole}</h2>
                  <p className="text-primary-700 font-semibold text-sm mb-6">{job.companyName}</p>

                  {/* Meta stats grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-b border-gray-100 py-5 mb-6 text-sm">
                    <div className="flex items-center text-gray-600 gap-2">
                      <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2">
                      <DollarSign size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{job.salaryPackage}</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2">
                      <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{job.experience} Required</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2">
                      <Clock size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{job.shiftTiming}</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2">
                      <BookOpen size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{job.qualification}</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2">
                      <Users size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{job.vacancyCount} Openings</span>
                    </div>
                  </div>

                  {/* Job details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Job Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.jobDescription}</p>
                    </div>
                    
                    {job.benefits && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Benefits</h4>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.benefits}</p>
                      </div>
                    )}

                    {/* Required Skills */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => navigate('/job-application', { state: { prefilledRole: job.jobRole } })}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-center"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOpeningsPage;

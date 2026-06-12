import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, ChevronRight, ChevronLeft, Upload, FileText, 
  User, Mail, Phone, MapPin, Calendar, BookOpen, Briefcase, Award 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { submitApplication } from '../services/api';

const jobRoleOptions = [
  { value: 'Software Developer', label: 'Software Developer' },
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Backend Developer', label: 'Backend Developer' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  { value: 'Medical Coder', label: 'Medical Coder' },
  { value: 'Medical Billing', label: 'Medical Billing' },
  { value: 'Customer Support', label: 'Customer Support' },
  { value: 'Voice Process', label: 'Voice Process' },
  { value: 'Non Voice Process', label: 'Non Voice Process' },
  { value: 'BPO', label: 'BPO' },
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Back Office', label: 'Back Office' },
  { value: 'IT Support', label: 'IT Support' },
  { value: 'Other', label: 'Other (Specify)' },
];

const languageOptions = [
  { value: 'Tamil', label: 'Tamil' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Malayalam', label: 'Malayalam' },
];

const JobApplicationPage = () => {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const routeLocation = useLocation();
  const navigate = useNavigate();
  
  // Get prefilled role from route state if redirected from Job Openings Page
  const prefilledRole = routeLocation.state?.prefilledRole || '';

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      gender: '',
      experience: 'Fresher',
      preferredRole: prefilledRole ? { value: prefilledRole, label: prefilledRole } : null,
      customJobRole: '',
      preferredCompanies: '',
      skills: [],
      languages: [],
    },
  });

  const experience = watch('experience');
  const preferredRole = watch('preferredRole');
  const isOtherRoleSelected = preferredRole?.value === 'Other';

  useEffect(() => {
    if (prefilledRole) {
      setValue('preferredRole', { value: prefilledRole, label: prefilledRole });
      toast.success(`Applying for: ${prefilledRole}`);
    }
  }, [prefilledRole, setValue]);

  // Handle Resume File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF resumes are accepted');
      setResumeFile(null);
      e.target.value = ''; // Reset input
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume size must be less than 5MB');
      setResumeFile(null);
      e.target.value = ''; // Reset input
      return;
    }

    setResumeFile(file);
    toast.success('Resume uploaded successfully');
  };

  // Navigations
  const handleNextStep = async () => {
    let fields = [];

    if (step === 1) fields = ['name', 'mobile', 'whatsapp', 'email', 'gender', 'dob', 'location'];
    if (step === 2) fields = ['qualification', 'collegeName', 'yearOfPassing', 'cgpa'];
    if (step === 3) {
      fields = ['experience'];
      if (experience === 'Experienced') {
        fields = [...fields, 'currentCompany', 'currentSalary', 'expectedSalary', 'experienceDetails'];
      }
    }
    if (step === 4) {
      fields = ['preferredRole', 'languages'];
      if (isOtherRoleSelected) {
        fields.push('customJobRole');
      }
    }

    const valid = await trigger(fields);
    if (valid) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Handler
  const onSubmit = async (data) => {
    if (!resumeFile) {
      toast.error('Please upload your resume in PDF format');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting application details...');

    try {
      // Build FormData
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('name', data.name);
      formData.append('mobile', data.mobile);
      formData.append('whatsapp', data.whatsapp);
      formData.append('email', data.email);
      formData.append('gender', data.gender);
      formData.append('dob', data.dob);
      formData.append('qualification', data.qualification);
      formData.append('collegeName', data.collegeName);
      formData.append('yearOfPassing', data.yearOfPassing);
      formData.append('cgpa', data.cgpa);
      formData.append('location', data.location);
      formData.append('experience', data.experience);
      formData.append('notes', data.notes || '');

      // Preferred Role
      formData.append('preferredRole', data.preferredRole ? data.preferredRole.value : '');
      formData.append('customJobRole', data.customJobRole || '');
      formData.append('preferredCompanies', data.preferredCompanies || '');

      // Conditional Experienced fields
      if (data.experience === 'Experienced') {
        formData.append('currentCompany', data.currentCompany || '');
        formData.append('currentSalary', data.currentSalary || '');
        formData.append('expectedSalary', data.expectedSalary || '');
        formData.append('experienceDetails', data.experienceDetails || '');
      }

      // Arrays (parse as JSON string arrays so backend handles them easily)
      const skillsArr = data.skills?.map((s) => s.value) || [];
      const langsArr = data.languages?.map((l) => l.value) || [];
      formData.append('skills', JSON.stringify(skillsArr));
      formData.append('languages', JSON.stringify(langsArr));

      const res = await submitApplication(formData);

      if (res.success) {
        toast.success('Your job application has been submitted successfully!', { id: toastId });
        setIsSuccess(true);
        reset();
        setResumeFile(null);
        setStep(1);
      } else {
        toast.error(res.message || 'Something went wrong. Please try again.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error submitting application.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm bg-white';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2';

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl p-10 md:p-16 shadow-2xl bg-gradient-to-br from-primary-600 to-secondary-700 text-white"
          >
            <CheckCircle className="w-20 h-20 mx-auto text-white mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Application Submitted!</h2>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Thank you for applying to Tenkasi Jobs. Our recruitment officers will evaluate your resume profile and reach out to you via Phone/WhatsApp for suitable job matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsSuccess(false)}
                className="px-8 py-3 bg-white text-primary-700 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Submit Another Application
              </button>
              <button
                onClick={() => navigate('/job-openings')}
                className="px-8 py-3 bg-transparent border border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Go to Openings
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Candidate Registry</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Submit Job Application</h1>
          <p className="mt-2 text-gray-600 text-sm">Fill in your qualifications and upload your resume profile.</p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-10 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            {['Personal', 'Education', 'Experience', 'Preferences', 'Resume'].map((sName, index) => {
              const active = step >= index + 1;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1.5 transition-all ${
                      active ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-150 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-primary-700' : 'text-gray-400'}`}>
                    {sName}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-350"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-md"
        >
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Personal */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
                  <User className="text-primary-600" size={20} /> Personal Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input {...register('name', { required: 'Name is required' })} className={inputClass} placeholder="Full Name" />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
                      })}
                      className={inputClass}
                      placeholder="name@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input
                      type="tel"
                      {...register('mobile', {
                        required: 'Mobile is required',
                        pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit number' },
                      })}
                      className={inputClass}
                      placeholder="10-Digit Mobile"
                    />
                    {errors.mobile && <span className="text-red-500 text-xs mt-1 block">{errors.mobile.message}</span>}
                  </div>

                  <div>
                    <label className={labelClass}>WhatsApp Number *</label>
                    <input
                      type="tel"
                      {...register('whatsapp', {
                        required: 'WhatsApp is required',
                        pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit number' },
                      })}
                      className={inputClass}
                      placeholder="10-Digit WhatsApp"
                    />
                    {errors.whatsapp && <span className="text-red-500 text-xs mt-1 block">{errors.whatsapp.message}</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select {...register('gender', { required: 'Select gender' })} className={inputClass}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-xs mt-1 block">{errors.gender.message}</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input type="date" {...register('dob', { required: 'DOB is required' })} className={inputClass} />
                    {errors.dob && <span className="text-red-500 text-xs mt-1 block">{errors.dob.message}</span>}
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Current Location *</label>
                    <input {...register('location', { required: 'Location is required' })} className={inputClass} placeholder="City, District (e.g. Tenkasi)" />
                    {errors.location && <span className="text-red-500 text-xs mt-1 block">{errors.location.message}</span>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Education */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
                  <BookOpen className="text-primary-600" size={20} /> Educational details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Qualification / Degree *</label>
                    <input {...register('qualification', { required: 'Qualification is required' })} className={inputClass} placeholder="e.g. B.E CSE, B.Sc Maths, MBA" />
                    {errors.qualification && <span className="text-red-500 text-xs mt-1 block">{errors.qualification.message}</span>}
                  </div>

                  <div>
                    <label className={labelClass}>College / Institution Name *</label>
                    <input {...register('collegeName', { required: 'College is required' })} className={inputClass} placeholder="College Name" />
                    {errors.collegeName && <span className="text-red-500 text-xs mt-1 block">{errors.collegeName.message}</span>}
                  </div>

                  <div>
                    <label className={labelClass}>Year of Passing *</label>
                    <input
                      type="number"
                      {...register('yearOfPassing', {
                        required: 'Year is required',
                        min: { value: 1980, message: 'Invalid year' },
                        max: { value: new Date().getFullYear() + 4, message: 'Invalid year' },
                      })}
                      className={inputClass}
                      placeholder="e.g. 2024"
                    />
                    {errors.yearOfPassing && <span className="text-red-500 text-xs mt-1 block">{errors.yearOfPassing.message}</span>}
                  </div>

                  <div>
                    <label className={labelClass}>CGPA / Percentage *</label>
                    <input {...register('cgpa', { required: 'Marks are required' })} className={inputClass} placeholder="e.g. 8.2 CGPA or 82%" />
                    {errors.cgpa && <span className="text-red-500 text-xs mt-1 block">{errors.cgpa.message}</span>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Experience */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
                  <Briefcase className="text-primary-600" size={20} /> Work Experience
                </h3>

                <div className="mb-6">
                  <label className={labelClass}>Experience Level *</label>
                  <div className="flex gap-4">
                    {['Fresher', 'Experienced'].map((val) => (
                      <label
                        key={val}
                        className={`flex items-center justify-center gap-2 cursor-pointer bg-white px-6 py-4 rounded-2xl border hover:border-primary-500 transition-colors shadow-sm w-full font-semibold text-gray-800 ${
                          experience === val ? 'border-primary-600 ring-2 ring-primary-500/20' : 'border-gray-200'
                        }`}
                      >
                        <input type="radio" value={val} {...register('experience')} className="hidden" />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {experience === 'Experienced' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Current / Last Company Name *</label>
                      <input {...register('currentCompany', { required: 'Company name is required' })} className={inputClass} placeholder="Last Company" />
                      {errors.currentCompany && <span className="text-red-500 text-xs mt-1 block">{errors.currentCompany.message}</span>}
                    </div>

                    <div>
                      <label className={labelClass}>Current Salary (Per Annum) *</label>
                      <input {...register('currentSalary', { required: 'Salary is required' })} className={inputClass} placeholder="e.g. 3.2 LPA" />
                      {errors.currentSalary && <span className="text-red-500 text-xs mt-1 block">{errors.currentSalary.message}</span>}
                    </div>

                    <div>
                      <label className={labelClass}>Expected Salary (Per Annum) *</label>
                      <input {...register('expectedSalary', { required: 'Expected salary is required' })} className={inputClass} placeholder="e.g. 5.0 LPA" />
                      {errors.expectedSalary && <span className="text-red-500 text-xs mt-1 block">{errors.expectedSalary.message}</span>}
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>Experience Details (Roles & Tenure) *</label>
                      <textarea
                        rows={3}
                        {...register('experienceDetails', { required: 'Experience details are required' })}
                        className={`${inputClass} resize-none`}
                        placeholder="Briefly describe your past roles, tech stacks, and total experience tenure (e.g. 2 Years in Software Development)"
                      />
                      {errors.experienceDetails && <span className="text-red-500 text-xs mt-1 block">{errors.experienceDetails.message}</span>}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Preferences */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
                  <Award className="text-primary-600" size={20} /> Job Preferences & Skills
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Preferred Job Role *</label>
                    <Controller
                      name="preferredRole"
                      control={control}
                      rules={{ required: 'Select a preferred role' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={jobRoleOptions}
                          placeholder="Select role..."
                          className="text-sm font-medium"
                        />
                      )}
                    />
                    {errors.preferredRole && <span className="text-red-500 text-xs mt-1 block">{errors.preferredRole.message}</span>}
                  </div>

                  {isOtherRoleSelected && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                      <label className={labelClass}>Specify Other Job Role *</label>
                      <input
                        type="text"
                        {...register('customJobRole', { required: 'Please specify the job role' })}
                        className={inputClass}
                        placeholder="e.g. Graphic Designer"
                      />
                      {errors.customJobRole && <span className="text-red-500 text-xs mt-1 block">{errors.customJobRole.message}</span>}
                    </motion.div>
                  )}

                  <div>
                    <label className={labelClass}>Key Skills *</label>
                    <Controller
                      name="skills"
                      control={control}
                      render={({ field }) => (
                        <CreatableSelect
                          {...field}
                          isMulti
                          placeholder="Type skill & press Enter..."
                          className="text-sm font-medium"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Languages Known *</label>
                    <Controller
                      name="languages"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isMulti
                          options={languageOptions}
                          placeholder="Select languages..."
                          className="text-sm font-medium"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Preferred Companies (Optional)</label>
                    <input
                      type="text"
                      {...register('preferredCompanies')}
                      className={inputClass}
                      placeholder="e.g. TCS, Zoho, Tech Mahindra"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Additional Notes / Comments</label>
                    <textarea
                      rows={3}
                      {...register('notes')}
                      className={`${inputClass} resize-none`}
                      placeholder="Any specific hiring conditions, shift preferences or details..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Resume */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
                  <Upload className="text-primary-600" size={20} /> Upload Resume
                </h3>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                    <input
                      type="file"
                      id="resume-upload"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <FileText className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {resumeFile ? resumeFile.name : 'Select PDF Resume'}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {resumeFile ? `Size: ${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : 'Drag and drop or click to upload PDF resume (Max 5MB)'}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-xs text-yellow-800 leading-relaxed">
                    <strong>Important Note:</strong> Please upload a clean, updated resume document. Resumes should only be uploaded in <strong>PDF</strong> format. This resume will be forwarded directly to employers.
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1 text-sm"
              >
                <ChevronLeft size={18} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1 text-sm ml-auto"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !resumeFile}
                className={`px-10 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm ml-auto ${
                  isSubmitting || !resumeFile ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default JobApplicationPage;

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, CheckCircle, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_b7mig5h';
const EMAILJS_TEMPLATE_ID = 'template_617jtfe';
const EMAILJS_PUBLIC_KEY  = '4_CQow8t392ZoF5JU';
const RECIPIENT_EMAIL     = 'tenkasijobsofficial@gmail.com';

const jobCategories = [
  { label: 'IT Jobs', options: [
    { value: 'Software Developer',        label: 'Software Developer' },
    { value: 'Frontend Developer',         label: 'Frontend Developer' },
    { value: 'Backend Developer',          label: 'Backend Developer' },
    { value: 'Full Stack Developer',       label: 'Full Stack Developer' },
    { value: 'Python Developer',           label: 'Python Developer' },
    { value: 'Java Developer',             label: 'Java Developer' },
    { value: 'Data Analyst',               label: 'Data Analyst' },
    { value: 'Data Scientist',             label: 'Data Scientist' },
    { value: 'AI Engineer',                label: 'AI Engineer' },
    { value: 'Machine Learning Engineer',  label: 'Machine Learning Engineer' },
    { value: 'Cloud Engineer',             label: 'Cloud Engineer' },
    { value: 'DevOps Engineer',            label: 'DevOps Engineer' },
    { value: 'UI/UX Designer',             label: 'UI/UX Designer' },
    { value: 'QA Tester',                  label: 'QA Tester' },
    { value: 'Cyber Security Analyst',     label: 'Cyber Security Analyst' },
    { value: 'Network Engineer',           label: 'Network Engineer' },
    { value: 'Mobile App Developer',       label: 'Mobile App Developer' },
    { value: 'Web Developer',              label: 'Web Developer' },
  ]},
  { label: 'Non-IT Jobs', options: [
    { value: 'HR',                label: 'HR' },
    { value: 'BPO',               label: 'BPO' },
    { value: 'Voice Process',     label: 'Voice Process' },
    { value: 'Non Voice Process', label: 'Non Voice Process' },
    { value: 'Customer Support',  label: 'Customer Support' },
    { value: 'Sales Executive',   label: 'Sales Executive' },
    { value: 'Marketing Executive', label: 'Marketing Executive' },
    { value: 'Admin',             label: 'Admin' },
    { value: 'Office Assistant',  label: 'Office Assistant' },
    { value: 'Accountant',        label: 'Accountant' },
    { value: 'Receptionist',      label: 'Receptionist' },
    { value: 'Telecaller',        label: 'Telecaller' },
    { value: 'Banking Staff',     label: 'Banking Staff' },
  ]},
  { label: 'Medical Coding', options: [
    { value: 'Medical Coder',         label: 'Medical Coder' },
    { value: 'Medical Billing',       label: 'Medical Billing' },
    { value: 'Medical Transcription', label: 'Medical Transcription' },
  ]},
  { label: 'Work From Home', options: [
    { value: 'Data Entry',       label: 'Data Entry' },
    { value: 'Chat Support',     label: 'Chat Support' },
    { value: 'Online Tutor',     label: 'Online Tutor' },
    { value: 'Virtual Assistant', label: 'Virtual Assistant' },
    { value: 'Content Writer',   label: 'Content Writer' },
  ]},
  { label: 'Other', options: [
    { value: 'Other Job Role', label: 'Other Job Role' }
  ]},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const validateDriveLink = (link) => {
  if (!link) return false;
  return /(https?:\/\/)?(drive\.google\.com|docs\.google\.com)/i.test(link);
};

const scrollToForm = () => {
  const el = document.getElementById('apply');
  if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
};

// ─── Component ────────────────────────────────────────────────────────────────
const ApplicationForm = () => {
  const [step, setStep]               = useState(1);
  const [resumeLink, setResumeLink]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [linkError, setLinkError]     = useState('');

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      experienceType: 'Fresher',
      preferredJobType: [],
    },
  });

  const experienceType = watch('experienceType');
  const selectedRoles  = watch('interestedRoles');
  const hasOtherRole   = selectedRoles?.some((r) => r.value === 'Other Job Role');

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handleNextStep = async () => {
    let fields = [];

    if (step === 1) fields = ['fullName', 'mobile', 'whatsapp', 'email', 'gender', 'dob', 'location'];
    if (step === 2) fields = ['degree', 'department', 'college', 'passoutYear', 'percentage'];
    if (step === 3) {
      fields = ['experienceType'];
      if (experienceType === 'Experienced') {
        fields = [...fields, 'lastCompany', 'currentCtc', 'expectedCtc', 'noticePeriod', 'totalExperience'];
      }
    }
    if (step === 4) {
      fields = ['interestedRoles', 'preferredJobType', 'preferredShift'];
      if (hasOtherRole) fields.push('customJobRole');
    }
    if (step === 5) {
      if (!resumeLink) { toast.error('Please add your Google Drive resume link'); return; }
      if (!validateDriveLink(resumeLink)) { toast.error('Please enter a valid Google Drive link'); return; }
      // Step 5 is the last — handled by form submit
      return;
    }

    const valid = await trigger(fields);
    if (valid) {
      setStep((prev) => prev + 1);
      scrollToForm();
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    scrollToForm();
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    if (!resumeLink) { toast.error('Please add your Google Drive resume link.'); return; }
    if (!validateDriveLink(resumeLink)) { toast.error('Please enter a valid Google Drive link.'); return; }

    setIsSubmitting(true);
    toast.loading('Submitting…', { id: 'submit' });

    try {
      // ── Format shared strings ──────────────────────────────────────────────
      const interestedRolesStr  = data.interestedRoles?.map((r) => r.value).join(', ') || '';
      const skillsStr           = data.skills?.map((s) => s.value).join(', ') || '';
      const preferredJobTypeStr = Array.isArray(data.preferredJobType)
        ? data.preferredJobType.join(', ')
        : '';
      const applicationDate     = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });



      // ── EmailJS payload ────────────────────────────────────────────────────
      const emailParams = {
        to_email:           RECIPIENT_EMAIL,
        fullName:           data.fullName           || 'Not provided',
        mobile:             data.mobile             || 'Not provided',
        whatsapp:           data.whatsapp           || 'Not provided',
        email:              data.email              || 'Not provided',
        gender:             data.gender             || 'Not provided',
        dob:                data.dob                || 'Not provided',
        location:           data.location           || 'Not provided',
        degree:             data.degree             || 'Not provided',
        department:         data.department         || 'Not provided',
        college:            data.college            || 'Not provided',
        passoutYear:        data.passoutYear        || 'Not provided',
        percentage:         data.percentage         || 'Not provided',
        experienceType:     data.experienceType     || 'Not provided',
        lastCompany:        data.lastCompany        || 'Not applicable',
        currentCtc:         data.currentCtc         || 'Not applicable',
        expectedCtc:        data.expectedCtc        || 'Not applicable',
        noticePeriod:       data.noticePeriod       || 'Not applicable',
        totalExperience:    data.totalExperience    || '0 years',
        interestedRoles:    interestedRolesStr      || 'Not provided',
        customJobRole:      data.customJobRole      || 'Not provided',
        preferredJobType:   preferredJobTypeStr     || 'Not provided',
        preferredShift:     data.preferredShift     || 'Not provided',
        preferredCompanies: data.preferredCompanies || 'Not provided',
        skills:             skillsStr               || 'Not provided',
        resume_link:        resumeLink,
        application_date:   applicationDate,
      };

      // ── Show success INSTANTLY — fire Firestore & email in background ────────
      toast.success('Application submitted successfully!', { id: 'submit' });
      reset();
      setResumeLink('');
      setStep(1);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Fire and forget — user never waits for these
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams, EMAILJS_PUBLIC_KEY)
        .catch((err) => console.error('EmailJS error:', err));

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Something went wrong. Please try again.', { id: 'submit' });
      setIsSubmitting(false);
    }
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';

  // ── Success screen ───────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <>
        <Toaster position="top-right" />
        <section id="apply" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-3xl p-12 shadow-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white"
            >
              <CheckCircle className="w-24 h-24 mx-auto text-white mb-6" />
              <h2 className="text-4xl font-bold mb-4">Application Submitted!</h2>
              <p className="text-xl text-primary-100 mb-8">
                Thank you for applying. Our team will review your profile and contact you soon regarding suitable opportunities.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-8 py-3 bg-white text-primary-600 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Submit Another Application
              </button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-right" />
      <section id="apply" className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apply for Jobs</h2>
            <p className="text-gray-600 text-lg">Complete the application form to get started.</p>
          </div>

          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    step >= s ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl p-6 md:p-10 shadow-xl bg-white border border-gray-200"
          >
            <AnimatePresence mode="wait">

              {/* ── Step 1: Personal ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input {...register('fullName', { required: 'Full name is required' })} className={inputClass} placeholder="John Doe" />
                      {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Number *</label>
                      <input {...register('mobile', { required: 'Mobile number is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit number' } })} type="tel" className={inputClass} placeholder="9876543210" />
                      {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>WhatsApp Number *</label>
                      <input {...register('whatsapp', { required: 'WhatsApp number is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit number' } })} type="tel" className={inputClass} placeholder="9876543210" />
                      {errors.whatsapp && <span className="text-red-500 text-sm">{errors.whatsapp.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>Email ID *</label>
                      <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Enter valid email' } })} type="email" className={inputClass} placeholder="john@example.com" />
                      {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>Gender *</label>
                      <select {...register('gender', { required: 'Gender is required' })} className={inputClass}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <span className="text-red-500 text-sm">{errors.gender.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>Date of Birth *</label>
                      <input {...register('dob', { required: 'Date of birth is required' })} type="date" className={inputClass} />
                      {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Current Location *</label>
                      <input {...register('location', { required: 'Location is required' })} className={inputClass} placeholder="City, State" />
                      {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Education ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Educational Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Degree / Qualification *</label>
                      <input {...register('degree', { required: 'Degree is required' })} className={inputClass} placeholder="e.g., B.E, B.Sc, MBA" />
                      {errors.degree && <span className="text-red-500 text-sm">{errors.degree.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>Department / Stream *</label>
                      <input {...register('department', { required: 'Department is required' })} className={inputClass} placeholder="e.g., Computer Science" />
                      {errors.department && <span className="text-red-500 text-sm">{errors.department.message}</span>}
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>College / University Name *</label>
                      <input {...register('college', { required: 'College name is required' })} className={inputClass} placeholder="Enter your college name" />
                      {errors.college && <span className="text-red-500 text-sm">{errors.college.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>Passout Year *</label>
                      <input {...register('passoutYear', { required: 'Passout year is required', min: { value: 1950, message: 'Enter valid year' }, max: { value: new Date().getFullYear(), message: 'Year cannot be in future' } })} type="number" className={inputClass} placeholder="YYYY" />
                      {errors.passoutYear && <span className="text-red-500 text-sm">{errors.passoutYear.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>Percentage / CGPA *</label>
                      <input {...register('percentage', { required: 'Percentage/CGPA is required' })} className={inputClass} placeholder="e.g., 85% or 8.5" />
                      {errors.percentage && <span className="text-red-500 text-sm">{errors.percentage.message}</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Experience ── */}
              {step === 3 && (
                <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Experience Details</h3>
                  <div className="mb-6">
                    <label className={labelClass}>Are you a Fresher or Experienced? *</label>
                    <div className="flex gap-4">
                      {['Fresher', 'Experienced'].map((val) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer bg-white px-6 py-3 rounded-xl border border-gray-200 hover:border-primary-500 transition-colors shadow-sm w-full">
                          <input type="radio" value={val} {...register('experienceType')} className="w-5 h-5 text-primary-600" />
                          <span className="font-semibold text-gray-800">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {experienceType === 'Experienced' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className={labelClass}>Last/Current Company Name *</label>
                        <input {...register('lastCompany', { required: 'Company name is required' })} className={inputClass} placeholder="Company Name" />
                        {errors.lastCompany && <span className="text-red-500 text-sm">{errors.lastCompany.message}</span>}
                      </div>
                      <div>
                        <label className={labelClass}>Current CTC *</label>
                        <input {...register('currentCtc', { required: 'Current CTC is required' })} className={inputClass} placeholder="e.g., 4 LPA" />
                        {errors.currentCtc && <span className="text-red-500 text-sm">{errors.currentCtc.message}</span>}
                      </div>
                      <div>
                        <label className={labelClass}>Expected CTC *</label>
                        <input {...register('expectedCtc', { required: 'Expected CTC is required' })} className={inputClass} placeholder="e.g., 6 LPA" />
                        {errors.expectedCtc && <span className="text-red-500 text-sm">{errors.expectedCtc.message}</span>}
                      </div>
                      <div>
                        <label className={labelClass}>Notice Period *</label>
                        <input {...register('noticePeriod', { required: 'Notice period is required' })} className={inputClass} placeholder="e.g., 30 Days" />
                        {errors.noticePeriod && <span className="text-red-500 text-sm">{errors.noticePeriod.message}</span>}
                      </div>
                      <div>
                        <label className={labelClass}>Total Experience *</label>
                        <input {...register('totalExperience', { required: 'Total experience is required' })} className={inputClass} placeholder="e.g., 2 Years 6 Months" />
                        {errors.totalExperience && <span className="text-red-500 text-sm">{errors.totalExperience.message}</span>}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── Step 4: Job Preferences ── */}
              {step === 4 && (
                <motion.div key="step4" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Job Preferences</h3>
                  <div className="space-y-6">

                    <div className="z-50 relative">
                      <label className={labelClass}>Interested Job Roles *</label>
                      <Controller
                        name="interestedRoles"
                        control={control}
                        rules={{ required: 'Select at least one job role' }}
                        render={({ field }) => (
                          <Select {...field} isMulti options={jobCategories} placeholder="Search and select roles…" />
                        )}
                      />
                      {errors.interestedRoles && <span className="text-red-500 text-sm">{errors.interestedRoles.message}</span>}
                    </div>

                    {hasOtherRole && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label className={labelClass}>Please specify other role *</label>
                        <input {...register('customJobRole', { required: 'Please specify your job role' })} className={inputClass} placeholder="Enter specific role" />
                        {errors.customJobRole && <span className="text-red-500 text-sm">{errors.customJobRole.message}</span>}
                      </motion.div>
                    )}

                    <div>
                      <label className={labelClass}>Preferred Job Type *</label>
                      <div className="flex flex-wrap gap-4">
                        {['Work From Home', 'Work From Office', 'Hybrid', 'Full Time', 'Part Time', 'Internship'].map((type) => (
                          <label key={type} className="flex items-center gap-2">
                            <input type="checkbox" value={type} {...register('preferredJobType', { required: 'Select at least one job type' })} className="w-5 h-5 text-primary-600 rounded" />
                            <span className="text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                      {errors.preferredJobType && <span className="text-red-500 text-sm">{errors.preferredJobType.message}</span>}
                    </div>

                    <div>
                      <label className={labelClass}>Preferred Shift *</label>
                      <select {...register('preferredShift', { required: 'Select preferred shift' })} className={inputClass}>
                        <option value="">Select Shift</option>
                        <option value="Day Shift">Day Shift</option>
                        <option value="Night Shift">Night Shift</option>
                        <option value="Rotational Shift">Rotational Shift</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                      {errors.preferredShift && <span className="text-red-500 text-sm">{errors.preferredShift.message}</span>}
                    </div>

                    <div>
                      <label className={labelClass}>Interested Company Names (Optional)</label>
                      <input {...register('preferredCompanies')} className={inputClass} placeholder="e.g., Tech Mahindra, TCS, Infosys" />
                    </div>

                    {/* ✅ Fixed: use CreatableSelect instead of Select with isCreatable */}
                    <div className="z-40 relative">
                      <label className={labelClass}>Key Skills (Optional)</label>
                      <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                          <CreatableSelect
                            {...field}
                            isMulti
                            placeholder="Type a skill and press Enter…"
                          />
                        )}
                      />
                    </div>

                  </div>
                </motion.div>
              )}

              {/* ── Step 5: Resume ── */}
              {step === 5 && (
                <motion.div key="step5" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Resume Link</h3>
                  <div className="space-y-6">

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 mt-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">How to share your resume:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Upload your resume to Google Drive</li>
                            <li>Right-click on the file and click "Share"</li>
                            <li>Click "Change to anyone with link"</li>
                            <li>Copy the link and paste it below</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Google Drive Resume Link *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Link size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="url"
                          value={resumeLink}
                          onChange={(e) => { setResumeLink(e.target.value); setLinkError(''); }}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder="https://drive.google.com/file/d/…"
                        />
                      </div>
                      {linkError && <span className="text-red-500 text-sm mt-1">{linkError}</span>}
                      {resumeLink && validateDriveLink(resumeLink) && (
                        <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                          <ExternalLink size={14} />
                          <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Preview your resume link
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Make sure your Google Drive link sharing is set to "Anyone with the link" can view. Otherwise, our team won't be able to access your resume.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between">
              {step > 1 ? (
                <button type="button" onClick={handlePrevStep} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center">
                  <ChevronLeft size={20} className="mr-1" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button type="button" onClick={handleNextStep} className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center ml-auto">
                  Next <ChevronRight size={20} className="ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !resumeLink || !validateDriveLink(resumeLink)}
                  className={`px-10 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center ml-auto ${
                    isSubmitting || !resumeLink || !validateDriveLink(resumeLink) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting…
                    </>
                  ) : 'Submit Application'}
                </button>
              )}
            </div>
          </form>

        </div>
      </section>
    </>
  );
};

export default ApplicationForm;
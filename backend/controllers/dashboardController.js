const JobApplication = require('../models/JobApplication');
const Placement = require('../models/Placement');
const JobOpening = require('../models/JobOpening');
const ContactMessage = require('../models/ContactMessage');

// Helper to format month key (e.g., "2026-06" -> "Jun 26")
const formatMonthLabel = (dateStr) => {
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[parseInt(month, 10) - 1] || 'Unknown';
  return `${monthName} ${year.slice(2)}`;
};

// @desc    Get Admin Dashboard Stats and Charts Data
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // 1. Fetch Total Counts (Cards)
    const totalApplications = await JobApplication.countDocuments();
    const totalPlacements = await Placement.countDocuments();
    const activeJobOpenings = await JobOpening.countDocuments({ status: 'active' });
    const totalEnquiries = await ContactMessage.countDocuments();

    // 2. Fetch Applications Per Month (last 6 months)
    const appStats = await JobApplication.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 6 }
    ]);

    const applicationsChart = appStats.map(item => ({
      month: formatMonthLabel(item._id),
      count: item.count,
    }));

    // 3. Fetch Placements Per Month (last 6 months)
    const placementStats = await Placement.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$joiningDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 6 }
    ]);

    const placementsChart = placementStats.map(item => ({
      month: formatMonthLabel(item._id),
      count: item.count,
    }));

    // 4. Job Openings By Category/Role (Grouped by jobRole)
    const jobStats = await JobOpening.aggregate([
      {
        $group: {
          _id: '$jobRole',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const jobsChart = jobStats.map(item => ({
      category: item._id,
      count: item.count,
    }));

    res.json({
      success: true,
      data: {
        cards: {
          totalApplications,
          totalPlacements,
          activeJobOpenings,
          totalEnquiries,
        },
        charts: {
          applicationsPerMonth: applicationsChart,
          placementsPerMonth: placementsChart,
          jobOpeningsByCategory: jobsChart,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error generating dashboard data' });
  }
};

module.exports = {
  getDashboardStats,
};

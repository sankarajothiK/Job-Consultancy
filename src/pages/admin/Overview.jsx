import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { FileText, Award, Briefcase, MessageSquare, AlertCircle } from 'lucide-react';

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to load stats');
        }
      } catch (err) {
        console.error(err);
        setError('Server error loading dashboard analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const { cards, charts } = data;

  // Helpers for Pure SVG Charts
  const renderBarChart = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return <div className="text-gray-400 text-sm py-10 text-center">No trend data available.</div>;
    }
    const maxCount = Math.max(...chartData.map(d => d.count), 5);
    const height = 160;
    const width = 380;
    const barWidth = 35;
    const gap = 20;

    return (
      <svg viewBox={`0 0 ${width} ${height + 40}`} className="w-full h-full">
        {chartData.map((item, idx) => {
          const barHeight = (item.count / maxCount) * height;
          const x = idx * (barWidth + gap) + 30;
          const y = height - barHeight + 15;
          return (
            <g key={idx}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="6"
                fill="url(#primaryGrad)"
                className="transition-all duration-350 hover:opacity-85 cursor-pointer"
              />
              {/* Value Text */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fill="#4b5563"
                fontSize="10"
                fontWeight="bold"
              >
                {item.count}
              </text>
              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height + 30}
                textAnchor="middle"
                fill="#6b7280"
                fontSize="9"
                fontWeight="600"
              >
                {item.month}
              </text>
            </g>
          );
        })}
        {/* Gradients */}
        <defs>
          <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const renderHorizontalBarChart = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return <div className="text-gray-400 text-sm py-10 text-center">No category data available.</div>;
    }
    const maxCount = Math.max(...chartData.map(d => d.count), 5);
    const barHeight = 24;
    const gap = 16;
    const totalHeight = chartData.length * (barHeight + gap) + 10;

    return (
      <svg viewBox={`0 0 400 ${totalHeight}`} className="w-full h-full">
        {chartData.map((item, idx) => {
          const barWidth = (item.count / maxCount) * 220;
          const y = idx * (barHeight + gap) + 15;
          return (
            <g key={idx}>
              {/* Job Category Title */}
              <text
                x="10"
                y={y + 16}
                fill="#4b5563"
                fontSize="11"
                fontWeight="bold"
                className="font-sans"
              >
                {item.category.length > 15 ? `${item.category.slice(0, 15)}…` : item.category}
              </text>

              {/* Bar background */}
              <rect
                x="140"
                y={y}
                width="220"
                height={barHeight}
                rx="6"
                fill="#f3f4f6"
              />

              {/* Bar */}
              <rect
                x="140"
                y={y}
                width={barWidth}
                height={barHeight}
                rx="6"
                fill="url(#secondaryGrad)"
                className="transition-all duration-350 hover:opacity-85 cursor-pointer"
              />

              {/* Count Text */}
              <text
                x={140 + barWidth + 10}
                y={y + 16}
                fill="#374151"
                fontSize="11"
                fontWeight="bold"
              >
                {item.count}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="secondaryGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Applications */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-md shadow-green-100 flex-shrink-0">
            <FileText size={26} />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Total Applications</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">{cards.totalApplications}</span>
          </div>
        </div>

        {/* Placements */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-md shadow-blue-100 flex-shrink-0">
            <Award size={26} />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Placed Candidates</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">{cards.totalPlacements}</span>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-md shadow-purple-100 flex-shrink-0">
            <Briefcase size={26} />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Active Openings</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">{cards.activeJobOpenings}</span>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-md shadow-orange-100 flex-shrink-0">
            <MessageSquare size={26} />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Contact Inquiries</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">{cards.totalEnquiries}</span>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trend chart */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Monthly Recruitment Metrics</h3>
            <p className="text-gray-400 text-xs mb-6">Candidate additions and placement curves</p>
          </div>
          <div className="h-64 flex items-center">
            {renderBarChart(charts.applicationsPerMonth)}
          </div>
        </div>

        {/* Placements/Category Distribution */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Job Openings By Role</h3>
            <p className="text-gray-400 text-xs mb-6">Distribution across top 5 categories</p>
          </div>
          <div className="h-64 flex items-center">
            {renderHorizontalBarChart(charts.jobOpeningsByCategory)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;

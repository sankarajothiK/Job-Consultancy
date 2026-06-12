import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Overview from './Overview';
import ApplicationsModule from './ApplicationsModule';
import JobsModule from './JobsModule';
import PlacementsModule from './PlacementsModule';
import ContactsModule from './ContactsModule';
import { 
  LayoutDashboard, FileText, Briefcase, Award, 
  MessageSquare, LogOut, Menu, X, ShieldAlert 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Enforce session check
  useEffect(() => {
    const token = localStorage.getItem('tenkasi_admin_token');
    const user = localStorage.getItem('tenkasi_admin_user');
    
    if (!token || !user) {
      toast.error('Session expired or unauthorized. Please login.');
      navigate('/admin-login');
    } else {
      setAdminUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tenkasi_admin_token');
    localStorage.removeItem('tenkasi_admin_user');
    toast.success('Logged out successfully.');
    setTimeout(() => {
      navigate('/admin-login');
    }, 600);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'jobs', label: 'Job Openings', icon: Briefcase },
    { id: 'placements', label: 'Placements', icon: Award },
    { id: 'contacts', label: 'Contact Logs', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'applications':
        return <ApplicationsModule />;
      case 'jobs':
        return <JobsModule />;
      case 'placements':
        return <PlacementsModule />;
      case 'contacts':
        return <ContactsModule />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-800 font-sans">
      <Toaster position="top-right" />

      {/* ── SIDEBAR (DESKTOP) ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 flex-shrink-0">
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-none">Admin Panel</h1>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tenkasi Jobs</span>
          </div>
        </div>

        {/* Profile info */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
            {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="truncate">
            <p className="text-xs text-gray-400 font-medium">Logged in as</p>
            <p className="text-sm font-bold text-gray-200 mt-0.5 truncate">{adminUser?.username || 'Admin'}</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/10'
                    : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <IconComp size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-sm font-semibold transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE DRAWER SIDEBAR ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Drawer Panel */}
          <div className="absolute inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl">
            <div>
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-primary-500" size={20} />
                  <span className="font-bold text-lg">Admin Panel</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/20">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-sm">
                  {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Administrator</p>
                  <p className="text-sm font-bold text-gray-200 mt-0.5">{adminUser?.username || 'Admin'}</p>
                </div>
              </div>

              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-slate-800'
                      }`}
                    >
                      <IconComp size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-sm font-semibold transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-slate-900 text-white flex justify-between items-center px-4 flex-shrink-0 shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
          <span className="font-bold tracking-tight">Tenkasi Jobs Admin</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

    </div>
  );
};

export default Dashboard;

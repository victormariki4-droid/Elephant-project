// ──────────────────────────────────────────────────────────────
// Sidebar Navigation — Dark themed vertical nav
// ──────────────────────────────────────────────────────────────

import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import {
  LayoutDashboard,
  AlertTriangle,
  FolderArchive,
  Shield,
  Settings,
  LogOut,
  Users,
} from 'lucide-react';

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alerts',    icon: AlertTriangle,   label: 'Active Alerts' },
  { to: '/history',   icon: FolderArchive,   label: 'Historical Logs' },
  { to: '/rangers',   icon: Shield,          label: 'Ranger Deployment' },
  { to: '/users',     icon: Users,           label: 'User Management' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-sidebar flex flex-col border-r border-slate-800">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-800/60">
        <img src="/tef-logo.png" alt="TEF" className="w-10 h-10 rounded-full object-contain" />
        <div>
          <h1 className="text-base font-bold text-white tracking-tight font-display">
            HEC
          </h1>
          <p className="text-[11px] text-sidebar-text font-medium">Alert Center</p>
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User Card ── */}
      <div className="border-t border-slate-800/60 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-[11px] text-sidebar-text truncate">System Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-sidebar-text hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[9px] text-slate-600 mt-3 text-center">Powered by TEF</p>
      </div>
    </aside>
  );
}

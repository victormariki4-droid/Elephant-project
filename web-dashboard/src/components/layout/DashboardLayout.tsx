// ──────────────────────────────────────────────────────────────
// Dashboard Layout — Sidebar + Main Content Grid Shell
// ──────────────────────────────────────────────────────────────

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 p-6 lg:p-8">
        <div className="max-w-[1440px] mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

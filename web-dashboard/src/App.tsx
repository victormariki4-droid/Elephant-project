import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ActiveAlertsPage from './pages/ActiveAlertsPage';
import HistoricalLogsPage from './pages/HistoricalLogsPage';
import RangerDeploymentPage from './pages/RangerDeploymentPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/alerts" element={<ActiveAlertsPage />} />
            <Route path="/history" element={<HistoricalLogsPage />} />
            <Route path="/rangers" element={<RangerDeploymentPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

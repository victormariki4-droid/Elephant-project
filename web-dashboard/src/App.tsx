import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ActiveAlertsPage from './pages/ActiveAlertsPage';
import HistoricalLogsPage from './pages/HistoricalLogsPage';
import RangerDeploymentPage from './pages/RangerDeploymentPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/alerts" element={<ActiveAlertsPage />} />
          <Route path="/history" element={<HistoricalLogsPage />} />
          <Route path="/rangers" element={<RangerDeploymentPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import Header from '../components/layout/Header';
import KPIRow from '../components/dashboard/KPIRow';
import IncidentChart from '../components/dashboard/IncidentChart';
import MitigationChart from '../components/dashboard/MitigationChart';
import LiveAlertStream from '../components/dashboard/LiveAlertStream';
import MapPlaceholder from '../components/dashboard/MapPlaceholder';
import { useAlertKPIs } from '../hooks/useAlerts';

export default function DashboardPage() {
  const { kpis } = useAlertKPIs();

  return (
    <div className="space-y-6">
      <Header activeAlertCount={kpis.activeAlerts} />

      {/* KPI Metrics */}
      <KPIRow
        activeAlerts={kpis.activeAlerts}
        totalIncidentsThisMonth={kpis.totalIncidentsThisMonth}
        immediateDangerCount={kpis.immediateDangerCount}
        resolvedAlerts={kpis.resolvedCount}
      />

      {/* Charts + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column — Charts */}
        <div className="space-y-6">
          <IncidentChart />
          <MitigationChart />
        </div>

        {/* Right Column — Live Alerts */}
        <LiveAlertStream />
      </div>

      {/* Map */}
      <MapPlaceholder />
    </div>
  );
}

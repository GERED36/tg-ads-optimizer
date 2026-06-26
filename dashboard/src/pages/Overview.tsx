import { useDashboard, useWebSocketUpdates } from '../hooks/useMetrics';
import KPICard from '../components/KPICard';
import MetricsChart from '../components/MetricsChart';
import CampaignsTable from '../components/CampaignsTable';

export default function Overview() {
  const { data, isLoading, error } = useDashboard();
  const wsData = useWebSocketUpdates();
  const displayData = wsData ?? data;

  if (isLoading && !data) return <div style={{ color: '#666' }}>Loading...</div>;
  if (error) return <div style={{ color: '#ff6b6b' }}>Error loading data</div>;
  if (!displayData) return <div style={{ color: '#666' }}>No data available</div>;

  const { overview, campaigns, statsHistory } = displayData;

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPICard label="Total Spend" value={`$${overview.totalSpend.toFixed(2)}`} color="#6c8cff" />
        <KPICard label="Avg CPC" value={`$${overview.avgCpc.toFixed(4)}`} color="#4caf50" />
        <KPICard label="Avg CPM" value={`$${overview.avgCpm.toFixed(2)}`} color="#ff9800" />
        <KPICard label="Avg CPO" value={`$${overview.avgCpo.toFixed(2)}`} color="#e91e63" />
        <KPICard label="Conversions" value={String(overview.totalConversions)} color="#9c27b0" />
        <KPICard label="Active Campaigns" value={String(overview.activeCampaigns)} color="#00bcd4" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>Metric History</h3>
        <MetricsChart
          data={statsHistory as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: '#4caf50', name: 'CPC' },
            { key: 'cpm', color: '#ff9800', name: 'CPM' },
            { key: 'ctr', color: '#6c8cff', name: 'CTR' },
          ]}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>Campaigns</h3>
        <CampaignsTable campaigns={campaigns} onSelect={() => {}} />
      </div>
    </div>
  );
}

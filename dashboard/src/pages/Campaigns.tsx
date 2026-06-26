import { useDashboard } from '../hooks/useMetrics';
import CampaignsTable from '../components/CampaignsTable';

interface CampaignsProps {
  onSelect: (id: string) => void;
}

export default function Campaigns({ onSelect }: CampaignsProps) {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <div style={{ color: '#666' }}>Loading...</div>;
  if (!data) return <div style={{ color: '#666' }}>No data</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 20 }}>All Campaigns</h2>
      <CampaignsTable campaigns={data.campaigns} onSelect={onSelect} />
    </div>
  );
}

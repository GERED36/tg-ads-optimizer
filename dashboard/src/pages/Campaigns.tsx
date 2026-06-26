import { useDashboard } from '../hooks/useMetrics'
import CampaignsTable from '../components/CampaignsTable'

interface CampaignsProps {
  onSelect: (id: string) => void
}

export default function Campaigns({ onSelect }: CampaignsProps) {
  const { data, isLoading } = useDashboard()

  if (isLoading) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Загрузка...</div>
  if (!data) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Нет данных</div>

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 700 }}>Все кампании</h2>
      <CampaignsTable campaigns={data.campaigns} onSelect={onSelect} />
    </div>
  )
}

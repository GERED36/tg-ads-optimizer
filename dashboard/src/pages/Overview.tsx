import { useDashboard, useWebSocketUpdates } from '../hooks/useMetrics'
import KPICard from '../components/KPICard'
import MetricsChart from '../components/MetricsChart'
import CampaignsTable from '../components/CampaignsTable'

export default function Overview() {
  const { data, isLoading } = useDashboard()
  const wsData = useWebSocketUpdates()
  const displayData = wsData ?? data

  if (isLoading && !data) {
    return (
      <div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {Array.from({ length: 6 }).map((_, i) => <KPICard key={i} label="" value="" loading />)}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)', marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius)' }} />
      </div>
    )
  }

  if (!displayData) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Нет данных</div>

  const { overview, campaigns, statsHistory } = displayData

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPICard label="Общий расход" value={`${overview.totalSpend.toFixed(2)} ₽`} subtitle="За всё время" />
        <KPICard label="Средний CPC" value={`${overview.avgCpc.toFixed(4)} ₽`} subtitle="Цена за клик" />
        <KPICard label="Средний CPM" value={`${overview.avgCpm.toFixed(2)} ₽`} subtitle="Цена за 1000 показов" />
        <KPICard label="Средний CPO" value={`${overview.avgCpo.toFixed(2)} ₽`} subtitle="Цена за заказ" />
        <KPICard label="Конверсии" value={String(overview.totalConversions)} subtitle="Всего" />
        <KPICard label="Активные кампании" value={String(overview.activeCampaigns)} subtitle={`${campaigns.length} всего`} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>История метрик</h3>
        <MetricsChart
          data={statsHistory as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: 'var(--accent-secondary)', name: 'CPC' },
            { key: 'cpm', color: '#ff9800', name: 'CPM' },
            { key: 'ctr', color: 'var(--accent-primary)', name: 'CTR' },
          ]}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>Кампании</h3>
        <CampaignsTable campaigns={campaigns} onSelect={() => {}} />
      </div>
    </div>
  )
}

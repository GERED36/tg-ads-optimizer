import { motion } from 'framer-motion'
import { useDashboard, useWebSocketUpdates } from '../../hooks/useMetrics'
import KPICard from '../../components/KPICard'
import MetricsChart from '../../components/MetricsChart'

export default function Overview() {
  const { data, isLoading } = useDashboard()
  const wsData = useWebSocketUpdates()
  const displayData = wsData ?? data

  if (isLoading && !data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {Array.from({ length: 6 }).map((_, i) => <KPICard key={i} label="" value="" loading />)}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)', marginBottom: 24 }} />
      </motion.div>
    )
  }

  if (!displayData) return (
    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 60 }}>
      Нет данных
    </div>
  )

  const { overview, campaigns, statsHistory } = displayData

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPICard label="Общий расход" value={`${overview.totalSpend.toFixed(2)} ₽`} subtitle="За всё время" />
        <KPICard label="Средний CPC" value={`${overview.avgCpc.toFixed(4)} ₽`} subtitle="Цена за клик" />
        <KPICard label="Средний CPM" value={`${overview.avgCpm.toFixed(2)} ₽`} subtitle="Цена за 1000 показов" />
        <KPICard label="Средний CPO" value={`${overview.avgCpo.toFixed(2)} ₽`} subtitle="Цена за заказ" />
        <KPICard label="Конверсии" value={String(overview.totalConversions)} subtitle="Всего" />
        <KPICard label="Активные кампании" value={String(overview.activeCampaigns)} subtitle={`${campaigns.length} всего`} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
          История метрик
        </h3>
        <MetricsChart
          data={statsHistory as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: '#22C55E', name: 'CPC' },
            { key: 'cpm', color: '#06B6D4', name: 'CPM' },
            { key: 'ctr', color: '#f59e0b', name: 'CTR' },
          ]}
        />
      </div>
    </motion.div>
  )
}

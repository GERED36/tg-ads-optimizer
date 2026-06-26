import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCampaignDetail, CampaignDetail as CampaignDetailType } from '../../api/client'
import MetricsChart from '../../components/MetricsChart'
import GlassCard from '../../components/GlassCard'

const actionLabels: Record<string, { label: string; color: string; bg: string }> = {
  raise: { label: 'Повышение', color: '#22C55E', bg: 'rgba(34,197,94,.15)' },
  lower: { label: 'Понижение', color: '#ef4444', bg: 'rgba(239,68,68,.15)' },
  pause: { label: 'Пауза', color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
  hold: { label: 'Без изменений', color: 'var(--text-secondary)', bg: 'rgba(255,255,255,.05)' },
  reallocate: { label: 'Перераспределение', color: '#06B6D4', bg: 'rgba(6,182,212,.15)' },
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery<CampaignDetailType>({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaignDetail(id!),
    refetchInterval: 30_000,
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="skeleton" style={{ width: 120, height: 36, marginBottom: 16, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: '60%', height: 28, marginBottom: 24, borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ flex: 1, height: 80, borderRadius: 'var(--radius)' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)' }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius)', marginTop: 24 }} />
      </motion.div>
    )
  }

  if (!data) return <div style={{ color: '#ef4444', textAlign: 'center', padding: 40 }}>Кампания не найдена</div>

  const chartData = data.stats.map(s => ({
    timestamp: s.timestamp,
    cpc: s.cpc,
    cpm: s.cpm,
    ctr: s.ctr,
    spend: s.spend,
    conversions: s.conversions + s.conversionsExternal,
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <button onClick={() => navigate('/dashboard/campaigns')} style={{
        background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)',
        padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginBottom: 16, fontSize: 13,
        transition: 'all var(--transition)',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}
      >
        ← Назад к кампаниям
      </button>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{data.name}</h2>
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
          background: data.status === 'active' ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.05)',
          color: data.status === 'active' ? '#22C55E' : 'var(--text-secondary)',
        }}>
          {data.status === 'active' ? 'Активна' : data.status === 'paused' ? 'Пауза' : data.status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Дневной бюджет', value: `${data.dailyBudget.toLocaleString('ru')} ₽` },
          { label: 'Целевой CPC', value: `${data.cpcTarget} ₽` },
          { label: 'Целевой CPO', value: `${data.cpoTarget} ₽` },
        ].map(m => (
          <GlassCard key={m.label} style={{ padding: '12px 16px', minWidth: 140 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{m.value}</div>
          </GlassCard>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Производительность
        </h3>
        <MetricsChart
          data={chartData as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: '#22C55E', name: 'CPC' },
            { key: 'spend', color: '#f59e0b', name: 'Расход' },
            { key: 'conversions', color: '#06B6D4', name: 'Конверсии' },
          ]}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Журнал оптимизаций
        </h3>
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)', overflow: 'hidden',
        }}>
          {data.optimizations.length === 0 ? (
            <div style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>Оптимизаций ещё не было</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-card)' }}>
                  {['Время', 'Действие', 'Причина', 'Изменение бюджета'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 16px', fontSize: 11, color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--glass-border)', fontWeight: 600, letterSpacing: '.5px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.optimizations.map(o => {
                  const action = actionLabels[o.action] || { label: o.action, color: 'var(--text-secondary)', bg: 'rgba(255,255,255,.05)' }
                  return (
                    <tr key={o.id}>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                        {new Date(o.timestamp).toLocaleString('ru')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)' }}>
                        <span style={{
                          display: 'inline-block', padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                          background: action.bg, color: action.color,
                        }}>{action.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                        {o.reason}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)' }}>
                        {o.oldBudget != null && o.newBudget != null
                          ? `${o.oldBudget.toLocaleString('ru')} → ${o.newBudget.toLocaleString('ru')} ₽`
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  )
}

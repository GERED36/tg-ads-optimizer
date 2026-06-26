import { useQuery } from '@tanstack/react-query'
import { fetchCampaignDetail, CampaignDetail as CampaignDetailType } from '../../api/client'
import MetricsChart from '../../components/MetricsChart'

interface CampaignDetailProps {
  campaignId: string
  onBack: () => void
}

const actionLabels: Record<string, { label: string; color: string; bg: string }> = {
  raise: { label: 'Повышение', color: '#4caf50', bg: 'rgba(76,175,80,.15)' },
  lower: { label: 'Понижение', color: '#ff6b6b', bg: 'rgba(255,107,107,.15)' },
  pause: { label: 'Пауза', color: '#ff9800', bg: 'rgba(255,152,0,.15)' },
  hold: { label: 'Без изменений', color: 'var(--text-secondary)', bg: 'var(--bg-elevated)' },
  reallocate: { label: 'Перераспределение', color: '#6c8cff', bg: 'rgba(108,140,255,.15)' },
}

export default function CampaignDetail({ campaignId, onBack }: CampaignDetailProps) {
  const { data, isLoading } = useQuery<CampaignDetailType>({
    queryKey: ['campaign', campaignId],
    queryFn: () => fetchCampaignDetail(campaignId),
    refetchInterval: 30_000,
  })

  if (isLoading) {
    return (
      <div>
        <div className="skeleton" style={{ width: 120, height: 36, marginBottom: 16, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: '60%', height: 28, marginBottom: 24, borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ flex: 1, height: 80, borderRadius: 'var(--radius)' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)' }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius)', marginTop: 24 }} />
      </div>
    )
  }

  if (!data) return <div style={{ color: '#ff6b6b', textAlign: 'center', padding: 40 }}>Кампания не найдена</div>

  const chartData = data.stats.map(s => ({
    timestamp: s.timestamp,
    cpc: s.cpc,
    cpm: s.cpm,
    ctr: s.ctr,
    spend: s.spend,
    conversions: s.conversions + s.conversionsExternal,
  }))

  return (
    <div>
      <button onClick={onBack} style={{
        background: 'none', border: '1px solid var(--border)', color: 'var(--accent-primary)',
        padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginBottom: 16, fontSize: 13,
        transition: 'background .15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
        onMouseLeave={e => e.currentTarget.style.background = ''}
      >
        ← Назад к кампаниям
      </button>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{data.name}</h2>
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
          background: data.status === 'active' ? 'rgba(76,175,80,.15)' : 'var(--bg-elevated)',
          color: data.status === 'active' ? '#4caf50' : 'var(--text-secondary)',
        }}>
          {data.status === 'active' ? 'Активна' : data.status === 'paused' ? 'Пауза' : data.status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Дневной бюджет</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{data.dailyBudget.toLocaleString('ru')} ₽</div>
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Целевой CPC</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{data.cpcTarget} ₽</div>
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Целевой CPO</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{data.cpoTarget} ₽</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>Производительность</h3>
        <MetricsChart
          data={chartData as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: 'var(--accent-secondary)', name: 'CPC' },
            { key: 'spend', color: '#ff9800', name: 'Расход' },
            { key: 'conversions', color: 'var(--accent-primary)', name: 'Конверсии' },
          ]}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>Журнал оптимизаций</h3>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {data.optimizations.length === 0 ? (
            <div style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>Оптимизаций ещё не было</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-card)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>Время</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>Действие</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>Причина</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>Изменение бюджета</th>
                </tr>
              </thead>
              <tbody>
                {data.optimizations.map(o => {
                  const action = actionLabels[o.action] || { label: o.action, color: 'var(--text-secondary)', bg: 'var(--bg-elevated)' }
                  return (
                    <tr key={o.id}>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                        {new Date(o.timestamp).toLocaleString('ru')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                        <span style={{
                          display: 'inline-block', padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                          background: action.bg, color: action.color,
                        }}>{action.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                        {o.reason}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
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
    </div>
  )
}

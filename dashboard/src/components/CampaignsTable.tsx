import { CampaignRow } from '../api/client'

interface CampaignsTableProps {
  campaigns: CampaignRow[]
  onSelect: (id: string) => void
}

const statusLabels: Record<string, string> = {
  active: 'Активна',
  paused: 'Пауза',
  archived: 'Архив',
}

export default function CampaignsTable({ campaigns, onSelect }: CampaignsTableProps) {
  const cellStyle: React.CSSProperties = {
    padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--border)',
  }

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', overflow: 'auto', maxHeight: 600,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>Название</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>Статус</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>Бюджет</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>CPC</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>CPO</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>CTR</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>Расход</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>Конверсии</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => (
            <tr key={c.id}
              style={{ cursor: 'pointer', transition: 'background .15s' }}
              onClick={() => onSelect(c.id)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <td style={{ ...cellStyle, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
              <td style={cellStyle}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                  background: c.status === 'active' ? 'rgba(76,175,80,.15)' : 'var(--bg-elevated)',
                  color: c.status === 'active' ? '#4caf50' : 'var(--text-secondary)',
                }}>
                  {statusLabels[c.status] || c.status}
                </span>
              </td>
              <td style={cellStyle}>{c.dailyBudget.toLocaleString('ru')} ₽</td>
              <td style={cellStyle}>{c.cpc.toFixed(4)} ₽</td>
              <td style={cellStyle}>{c.cpo.toFixed(2)} ₽</td>
              <td style={cellStyle}>{(c.ctr * 100).toFixed(2)}%</td>
              <td style={cellStyle}>{c.spend.toFixed(2)} ₽</td>
              <td style={cellStyle}>{c.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import { motion } from 'framer-motion'
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
    padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--glass-border)',
  }

  return (
    <div style={{
      background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--glass-border)',
      overflow: 'auto', maxHeight: 600,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
            {['Название', 'Статус', 'Бюджет', 'CPC', 'CPO', 'CTR', 'Расход', 'Конверсии'].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '12px 16px', fontSize: 11, color: 'var(--text-muted)',
                borderBottom: '1px solid var(--glass-border)', fontWeight: 600, letterSpacing: '.5px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <motion.tr
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * .02 }}
              style={{ cursor: 'pointer', transition: 'all var(--transition)' }}
              onClick={() => onSelect(c.id)}
              whileHover={{ scale: 1.01, background: 'rgba(255,255,255,.03)', boxShadow: '0 0 20px rgba(34,197,94,.08)' }}
            >
              <td style={{ ...cellStyle, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
              <td style={cellStyle}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                  background: c.status === 'active' ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.05)',
                  color: c.status === 'active' ? '#22C55E' : 'var(--text-secondary)',
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
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

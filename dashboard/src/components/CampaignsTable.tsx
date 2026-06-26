import { CampaignRow } from '../api/client';

interface CampaignsTableProps {
  campaigns: CampaignRow[];
  onSelect: (id: string) => void;
}

export default function CampaignsTable({ campaigns, onSelect }: CampaignsTableProps) {
  const styles = {
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: 12, color: '#888', borderBottom: '1px solid #2a2a2e', textTransform: 'uppercase' as const },
    td: { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #2a2a2e' },
    row: { cursor: 'pointer' },
    badge: (status: string) => ({
      display: 'inline-block' as const, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      background: status === 'active' ? '#1a3a2a' : '#2a2a2e',
      color: status === 'active' ? '#4caf50' : '#888',
    }),
  };

  return (
    <div style={{ background: '#1a1a1e', borderRadius: 12, border: '1px solid #2a2a2e', overflow: 'hidden' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Budget</th>
            <th style={styles.th}>CPC</th>
            <th style={styles.th}>CPO</th>
            <th style={styles.th}>CTR</th>
            <th style={styles.th}>Spend</th>
            <th style={styles.th}>Conversions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => (
            <tr key={c.id} style={styles.row} onClick={() => onSelect(c.id)}>
              <td style={styles.td}>{c.name}</td>
              <td style={styles.td}><span style={styles.badge(c.status)}>{c.status}</span></td>
              <td style={styles.td}>${c.dailyBudget}</td>
              <td style={styles.td}>${c.cpc.toFixed(4)}</td>
              <td style={styles.td}>${c.cpo.toFixed(2)}</td>
              <td style={styles.td}>{(c.ctr * 100).toFixed(2)}%</td>
              <td style={styles.td}>${c.spend.toFixed(2)}</td>
              <td style={styles.td}>{c.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

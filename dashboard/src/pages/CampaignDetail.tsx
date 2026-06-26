import { useQuery } from '@tanstack/react-query';
import { fetchCampaignDetail, CampaignDetail as CampaignDetailType } from '../api/client';
import MetricsChart from '../components/MetricsChart';

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
}

export default function CampaignDetail({ campaignId, onBack }: CampaignDetailProps) {
  const { data, isLoading } = useQuery<CampaignDetailType>({
    queryKey: ['campaign', campaignId],
    queryFn: () => fetchCampaignDetail(campaignId),
    refetchInterval: 30_000,
  });

  if (isLoading) return <div style={{ color: '#666' }}>Loading...</div>;
  if (!data) return <div style={{ color: '#ff6b6b' }}>Campaign not found</div>;

  const chartData = data.stats.map(s => ({
    timestamp: s.timestamp,
    cpc: s.cpc,
    cpm: s.cpm,
    ctr: s.ctr,
    spend: s.spend,
    conversions: s.conversions + s.conversionsExternal,
  }));

  return (
    <div>
      <button onClick={onBack} style={{
        background: 'none', border: '1px solid #2a2a2e', color: '#6c8cff',
        padding: '8px 16px', borderRadius: 6, cursor: 'pointer', marginBottom: 16, fontSize: 13,
      }}>
        ← Back to Campaigns
      </button>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <h2 style={{ fontSize: 20 }}>{data.name}</h2>
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
          background: data.status === 'active' ? '#1a3a2a' : '#2a2a2e',
          color: data.status === 'active' ? '#4caf50' : '#888',
        }}>{data.status}</span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ background: '#1a1a1e', borderRadius: 8, padding: '12px 16px', border: '1px solid #2a2a2e' }}>
          <div style={{ fontSize: 12, color: '#888' }}>Daily Budget</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>${data.dailyBudget}</div>
        </div>
        <div style={{ background: '#1a1a1e', borderRadius: 8, padding: '12px 16px', border: '1px solid #2a2a2e' }}>
          <div style={{ fontSize: 12, color: '#888' }}>CPC Target</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>${data.cpcTarget}</div>
        </div>
        <div style={{ background: '#1a1a1e', borderRadius: 8, padding: '12px 16px', border: '1px solid #2a2a2e' }}>
          <div style={{ fontSize: 12, color: '#888' }}>CPO Target</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>${data.cpoTarget}</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>Performance</h3>
        <MetricsChart
          data={chartData as unknown as Array<{ timestamp: string } & Record<string, number>>}
          lines={[
            { key: 'cpc', color: '#4caf50', name: 'CPC' },
            { key: 'spend', color: '#ff9800', name: 'Spend' },
            { key: 'conversions', color: '#6c8cff', name: 'Conversions' },
          ]}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>Optimization Log</h3>
        <div style={{ background: '#1a1a1e', borderRadius: 12, border: '1px solid #2a2a2e', overflow: 'hidden' }}>
          {data.optimizations.length === 0 ? (
            <div style={{ padding: 20, color: '#666', textAlign: 'center' }}>No optimizations yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: '#888', borderBottom: '1px solid #2a2a2e' }}>Time</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: '#888', borderBottom: '1px solid #2a2a2e' }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: '#888', borderBottom: '1px solid #2a2a2e' }}>Reason</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: '#888', borderBottom: '1px solid #2a2a2e' }}>Budget Change</th>
                </tr>
              </thead>
              <tbody>
                {data.optimizations.map(o => (
                  <tr key={o.id}>
                    <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #2a2a2e' }}>
                      {new Date(o.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #2a2a2e' }}>
                      <span style={{
                        display: 'inline-block', padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                        background: o.action === 'raise' ? '#1a3a2a' : o.action === 'lower' ? '#3a1a2a' : '#2a2a2e',
                        color: o.action === 'raise' ? '#4caf50' : o.action === 'lower' ? '#ff6b6b' : '#888',
                      }}>{o.action}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #2a2a2e', color: '#aaa' }}>
                      {o.reason}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #2a2a2e' }}>
                      {o.oldBudget != null && o.newBudget != null
                        ? `$${o.oldBudget} → $${o.newBudget}`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

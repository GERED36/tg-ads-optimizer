import { useState } from 'react';
import Overview from './pages/Overview';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Settings from './pages/Settings';

type Page = 'overview' | 'campaigns' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('overview');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const navStyle: React.CSSProperties = {
    display: 'flex', gap: 16, padding: '16px 24px', background: '#1a1a1e',
    borderBottom: '1px solid #2a2a2e', alignItems: 'center',
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer', color: active ? '#6c8cff' : '#888', fontWeight: active ? 600 : 400,
    fontSize: 14, background: 'none', border: 'none', padding: '4px 8px',
  });

  return (
    <div>
      <nav style={navStyle}>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#e1e1e6', marginRight: 16 }}>Marketing Agent</span>
        <button style={linkStyle(page === 'overview')} onClick={() => { setPage('overview'); setSelectedCampaignId(null); }}>
          Overview
        </button>
        <button style={linkStyle(page === 'campaigns')} onClick={() => setPage('campaigns')}>
          Campaigns
        </button>
        <button style={linkStyle(page === 'settings')} onClick={() => setPage('settings')}>
          Settings
        </button>
      </nav>
      <main style={{ padding: 24 }}>
        {page === 'overview' && <Overview />}
        {page === 'campaigns' && !selectedCampaignId && (
          <Campaigns onSelect={(id: string) => { setSelectedCampaignId(id); setPage('campaigns'); }} />
        )}
        {page === 'campaigns' && selectedCampaignId && (
          <CampaignDetail campaignId={selectedCampaignId} onBack={() => setSelectedCampaignId(null)} />
        )}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  );
}

import { useState } from 'react';

const defaultSettings = {
  cpcTarget: 0.5,
  cpoTarget: 10.0,
  minCtrPercent: 0.5,
  optimizationIntervalMs: 900000,
  pidKp: 0.1,
  pidKi: 0.01,
  pidKd: 0.05,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: '#0f0f11', border: '1px solid #2a2a2e', color: '#e1e1e6',
    padding: '8px 12px', borderRadius: 6, fontSize: 14, width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, color: '#888', marginBottom: 6,
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20 }}>Settings</h2>

      <div style={{ background: '#1a1a1e', borderRadius: 12, border: '1px solid #2a2a2e', padding: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, color: '#6c8cff' }}>Optimization Targets</h3>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Target CPC ($)</label>
          <input style={inputStyle} type="number" step="0.01" value={settings.cpcTarget}
            onChange={e => setSettings(s => ({ ...s, cpcTarget: +e.target.value }))} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Target CPO ($)</label>
          <input style={inputStyle} type="number" step="0.1" value={settings.cpoTarget}
            onChange={e => setSettings(s => ({ ...s, cpoTarget: +e.target.value }))} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Min CTR (%)</label>
          <input style={inputStyle} type="number" step="0.1" value={settings.minCtrPercent}
            onChange={e => setSettings(s => ({ ...s, minCtrPercent: +e.target.value }))} />
        </div>

        <h3 style={{ margin: '24px 0 16px', fontSize: 16, color: '#6c8cff' }}>PID Controller</h3>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kp (Proportional)</label>
          <input style={inputStyle} type="number" step="0.01" value={settings.pidKp}
            onChange={e => setSettings(s => ({ ...s, pidKp: +e.target.value }))} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Ki (Integral)</label>
          <input style={inputStyle} type="number" step="0.001" value={settings.pidKi}
            onChange={e => setSettings(s => ({ ...s, pidKi: +e.target.value }))} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kd (Derivative)</label>
          <input style={inputStyle} type="number" step="0.01" value={settings.pidKd}
            onChange={e => setSettings(s => ({ ...s, pidKd: +e.target.value }))} />
        </div>

        <h3 style={{ margin: '24px 0 16px', fontSize: 16, color: '#6c8cff' }}>Schedule</h3>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Optimization Interval (minutes)</label>
          <input style={inputStyle} type="number" step="5" value={settings.optimizationIntervalMs / 60000}
            onChange={e => setSettings(s => ({ ...s, optimizationIntervalMs: +e.target.value * 60000 }))} />
        </div>

        <button onClick={handleSave} style={{
          background: '#6c8cff', color: '#fff', border: 'none', padding: '10px 24px',
          borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8,
        }}>
          {saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

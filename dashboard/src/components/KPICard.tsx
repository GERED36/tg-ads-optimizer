interface KPICardProps {
  label: string;
  value: string;
  subtitle?: string;
  color?: string;
}

export default function KPICard({ label, value, subtitle, color = '#6c8cff' }: KPICardProps) {
  return (
    <div style={{
      background: '#1a1a1e', borderRadius: 12, padding: '20px 24px',
      border: '1px solid #2a2a2e', flex: 1, minWidth: 180,
    }}>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

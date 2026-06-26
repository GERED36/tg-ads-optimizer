import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MetricsChartProps {
  data: Array<{ timestamp: string } & Record<string, number>>;
  lines: Array<{ key: string; color: string; name: string }>;
}

export default function MetricsChart({ data, lines }: MetricsChartProps) {
  if (data.length === 0) {
    return <div style={{ color: '#666', textAlign: 'center', padding: 40 }}>No data yet</div>;
  }

  return (
    <div style={{ background: '#1a1a1e', borderRadius: 12, padding: 20, border: '1px solid #2a2a2e' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" />
          <XAxis
            dataKey="timestamp"
            stroke="#666"
            tickFormatter={(v: string) => new Date(v).toLocaleTimeString()}
            fontSize={11}
          />
          <YAxis stroke="#666" fontSize={11} />
          <Tooltip
            contentStyle={{ background: '#1a1a1e', border: '1px solid #2a2a2e', borderRadius: 8 }}
            labelStyle={{ color: '#888' }}
          />
          <Legend />
          {lines.map(line => (
            <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} name={line.name} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface MetricsChartProps {
  data: Array<{ timestamp: string } & Record<string, number>>
  lines: Array<{ key: string; color: string; name: string }>
}

export default function MetricsChart({ data, lines }: MetricsChartProps) {
  if (data.length === 0) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Нет данных</div>
  }

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 'var(--radius)',
      padding: 20, border: '1px solid var(--border)',
    }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            {lines.map(line => (
              <linearGradient key={line.key} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="timestamp"
            stroke="var(--text-muted)"
            tickFormatter={(v: string) => {
              const d = new Date(v)
              return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
            }}
            fontSize={11}
          />
          <YAxis stroke="var(--text-muted)" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', fontSize: 13,
            }}
            labelFormatter={(v: string) => new Date(v).toLocaleString('ru')}
          />
          <Legend formatter={(value: string) => <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{value}</span>} />
          {lines.map(line => (
            <Area
              key={line.key} type="monotone" dataKey={line.key}
              stroke={line.color} fill={`url(#gradient-${line.key})`}
              name={line.name} dot={false} strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

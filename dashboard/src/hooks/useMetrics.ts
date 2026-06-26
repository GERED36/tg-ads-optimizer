import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboard, DashboardData } from '../api/client';

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    refetchInterval: 60_000,
  });
}

export function useWebSocketUpdates() {
  const [data, setData] = useState<DashboardData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'metrics') {
          setData(msg.data);
        }
      } catch { /* ignore parse errors */ }
    };

    return () => { ws.close(); };
  }, []);

  return data;
}

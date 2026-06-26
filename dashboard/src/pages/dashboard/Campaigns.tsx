import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../../hooks/useMetrics'
import CampaignsTable from '../../components/CampaignsTable'

export default function Campaigns() {
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()

  if (isLoading) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Загрузка...</div>
  if (!data) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Нет данных</div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 700 }}>Все кампании</h2>
      <CampaignsTable campaigns={data.campaigns} onSelect={(id) => navigate(`/dashboard/campaigns/${id}`)} />
    </motion.div>
  )
}

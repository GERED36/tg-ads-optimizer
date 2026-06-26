export default function Footer() {
  const linkStyle: React.CSSProperties = {
    fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer',
    transition: 'color var(--transition)',
  }
  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      padding: '40px 80px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Marketing Agent</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 Marketing Agent. All rights reserved.</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Product', 'Company', 'Legal', 'Contact'].map(l => (
            <span key={l} style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = ''}
            >{l}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}

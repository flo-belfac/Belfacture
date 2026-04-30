'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
const [user, setUser] = useState(null)
const [stats, setStats] = useState({ factures: 0, clients: 0, total: 0 })

useEffect(() => {
async function chargerDonnees() {
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/login'; return }
setUser(user)
const { data: factures } = await supabase.from('factures').select('*').eq('user_id', user.id)
const { data: clients } = await supabase.from('clients').select('*').eq('user_id', user.id)
const total = factures?.reduce((acc, f) => acc + (f.total_tvac || 0), 0) || 0
setStats({ factures: factures?.length || 0, clients: clients?.length || 0, total })
}
chargerDonnees()
}, [])

async function handleLogout() {
await supabase.auth.signOut()
window.location.href = '/login'
}

const navStyle = {
background: 'rgba(15,12,41,0.95)',
backdropFilter: 'blur(20px)',
borderBottom: '1px solid rgba(255,255,255,0.08)',
padding: '16px 32px',
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
position: 'sticky',
top: 0,
zIndex: 100
}

const linkStyle = {
color: 'rgba(255,255,255,0.6)',
textDecoration: 'none',
fontSize: '14px',
fontWeight: '500',
padding: '8px 16px',
borderRadius: '8px',
transition: 'all 0.2s'
}

return (
<div style={{
minHeight: '100vh',
background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
fontFamily: "'Segoe UI', sans-serif"
}}>
<nav style={navStyle}>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
<div style={{
background: 'linear-gradient(135deg, #667eea, #764ba2)',
borderRadius: '10px',
width: '36px',
height: '36px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '18px'
}}>⚡</div>
<span style={{
fontWeight: '800',
fontSize: '18px',
background: 'linear-gradient(135deg, #667eea, #a78bfa)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent'
}}>BelFacture</span>
</div>
<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
<a href="/dashboard" style={{ ...linkStyle, color: 'white', background: 'rgba(102,126,234,0.2)' }}>Dashboard</a>
<a href="/clients" style={linkStyle}>Clients</a>
<a href="/factures" style={linkStyle}>Factures</a>
<a href="/devis" style={linkStyle}>Devis</a>
<button onClick={handleLogout} style={{
background: 'rgba(248,113,113,0.15)',
border: '1px solid rgba(248,113,113,0.3)',
borderRadius: '8px',
color: '#f87171',
padding: '8px 16px',
cursor: 'pointer',
fontSize: '14px',
fontWeight: '500'
}}>Déconnexion</button>
</div>
</nav>

<div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
<div style={{ marginBottom: '40px' }}>
<h1 style={{
fontSize: '32px',
fontWeight: '800',
color: 'white',
margin: '0 0 8px'
}}>
Bonjour 👋
</h1>
<p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>
Bienvenue sur votre espace BelFacture
</p>
</div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
{[
{ label: 'Factures envoyées', value: stats.factures, icon: '📄', color: '#667eea' },
{ label: 'Total facturé', value: stats.total.toFixed(2) + '€', icon: '💶', color: '#34d399' },
{ label: 'Clients actifs', value: stats.clients, icon: '👥', color: '#a78bfa' }
].map((stat, i) => (
<div key={i} style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '28px',
textAlign: 'center'
}}>
<div style={{ fontSize: '36px', marginBottom: '12px' }}>{stat.icon}</div>
<div style={{
fontSize: '36px',
fontWeight: '800',
color: stat.color,
marginBottom: '8px'
}}>{stat.value}</div>
<div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{stat.label}</div>
</div>
))}
</div>

<div style={{
display: 'grid',
gridTemplateColumns: 'repeat(2, 1fr)',
gap: '24px'
}}>
{[
{ href: '/factures', icon: '📄', title: 'Nouvelle facture', desc: 'Créer et envoyer une facture', color: '#667eea' },
{ href: '/devis', icon: '📋', title: 'Nouveau devis', desc: 'Créer un devis avec acomptes', color: '#764ba2' },
{ href: '/clients', icon: '👥', title: 'Mes clients', desc: 'Gérer votre liste de clients', color: '#34d399' },
{ href: '/factures', icon: '💶', title: 'Mes factures', desc: 'Voir toutes vos factures', color: '#a78bfa' }
].map((item, i) => (
<a key={i} href={item.href} style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '28px',
textDecoration: 'none',
display: 'flex',
alignItems: 'center',
gap: '20px',
transition: 'all 0.2s'
}}>
<div style={{
background: `linear-gradient(135deg, ${item.color}33, ${item.color}22)`,
border: `1px solid ${item.color}44`,
borderRadius: '14px',
width: '56px',
height: '56px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '24px',
flexShrink: 0
}}>{item.icon}</div>
<div>
<div style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{item.title}</div>
<div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{item.desc}</div>
</div>
</a>
))}
</div>
</div>
</div>
)
}
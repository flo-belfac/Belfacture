'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Clients() {
const [clients, setClients] = useState([])
const [nom, setNom] = useState('')
const [email, setEmail] = useState('')
const [tva, setTva] = useState('')
const [adresse, setAdresse] = useState('')
const [message, setMessage] = useState('')

useEffect(() => { chargerClients() }, [])

async function chargerClients() {
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/login'; return }
const { data } = await supabase.from('clients').select('*').eq('user_id', user.id)
setClients(data || [])
}

async function ajouterClient() {
const { data: { user } } = await supabase.auth.getUser()
const { error } = await supabase.from('clients').insert([{ nom, email, numero_tva: tva, adresse, user_id: user.id }])
if (error) { setMessage('Erreur : ' + error.message) }
else { setMessage('Client ajouté ✅'); setNom(''); setEmail(''); setTva(''); setAdresse(''); chargerClients() }
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

const inputStyle = {
width: '100%',
padding: '14px 16px',
background: 'rgba(255,255,255,0.08)',
border: '1px solid rgba(255,255,255,0.15)',
borderRadius: '12px',
color: 'white',
fontSize: '15px',
outline: 'none',
boxSizing: 'border-box',
marginBottom: '12px'
}

const linkStyle = {
color: 'rgba(255,255,255,0.6)',
textDecoration: 'none',
fontSize: '14px',
fontWeight: '500',
padding: '8px 16px',
borderRadius: '8px'
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
<a href="/dashboard" style={linkStyle}>Dashboard</a>
<a href="/clients" style={{ ...linkStyle, color: 'white', background: 'rgba(102,126,234,0.2)' }}>Clients</a>
<a href="/factures" style={linkStyle}>Factures</a>
<a href="/devis" style={linkStyle}>Devis</a>
</div>
</nav>

<div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
<h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '32px' }}>
👥 Mes clients
</h1>

<div style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '32px',
marginBottom: '24px'
}}>
<h3 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>
➕ Ajouter un client
</h3>
<input placeholder="Nom de l'entreprise" value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} />
<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
<input placeholder="Numéro TVA (ex: BE0123456789)" value={tva} onChange={(e) => setTva(e.target.value)} style={inputStyle} />
<input placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} style={inputStyle} />
<button onClick={ajouterClient} style={{
padding: '14px 28px',
background: 'linear-gradient(135deg, #667eea, #764ba2)',
border: 'none',
borderRadius: '12px',
color: 'white',
fontSize: '15px',
fontWeight: '700',
cursor: 'pointer',
boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
}}>
+ Ajouter le client
</button>
{message && <p style={{ marginTop: '12px', color: '#34d399', fontSize: '14px' }}>{message}</p>}
</div>

<div style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '32px'
}}>
<h3 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>
📋 Liste des clients
</h3>
{clients.length === 0 ? (
<p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '32px' }}>
Aucun client pour le moment
</p>
) : (
clients.map((client) => (
<div key={client.id} style={{
borderBottom: '1px solid rgba(255,255,255,0.06)',
padding: '16px 0',
display: 'flex',
alignItems: 'center',
gap: '16px'
}}>
<div style={{
background: 'linear-gradient(135deg, #667eea33, #764ba233)',
border: '1px solid rgba(102,126,234,0.3)',
borderRadius: '12px',
width: '44px',
height: '44px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '20px',
flexShrink: 0
}}>👤</div>
<div>
<p style={{ color: 'white', fontWeight: '600', margin: '0 0 4px', fontSize: '15px' }}>{client.nom}</p>
<p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '13px' }}>
{client.email} {client.numero_tva ? '· ' + client.numero_tva : ''}
</p>
</div>
</div>
))
)}
</div>
</div>
</div>
)
}
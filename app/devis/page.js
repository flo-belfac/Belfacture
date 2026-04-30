'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Devis() {
const [clients, setClients] = useState([])
const [clientId, setClientId] = useState('')
const [description, setDescription] = useState('')
const [montantTotal, setMontantTotal] = useState('')
const [acomptes, setAcomptes] = useState([
{ pourcentage: 30 },
{ pourcentage: 30 },
{ pourcentage: 40 }
])
const [devisList, setDevisList] = useState([])
const [message, setMessage] = useState('')

useEffect(() => { chargerDonnees() }, [])

async function chargerDonnees() {
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/login'; return }
const { data: clientsData } = await supabase.from('clients').select('*').eq('user_id', user.id)
setClients(clientsData || [])
const { data: devisData } = await supabase.from('devis').select('*, clients(nom)').eq('user_id', user.id)
setDevisList(devisData || [])
}

async function creerDevis() {
const { data: { user } } = await supabase.auth.getUser()
const numero = 'D-' + Date.now()
const total = parseFloat(montantTotal)
const { data: devis, error } = await supabase.from('devis').insert([{
user_id: user.id, client_id: clientId, numero,
description, montant_total: total, statut: 'en_attente'
}]).select().single()
if (error) { setMessage('Erreur : ' + error.message); return }
await supabase.from('acomptes').insert(acomptes.map(a => ({
devis_id: devis.id,
pourcentage: a.pourcentage,
montant: (total * a.pourcentage / 100),
statut: 'non_facture'
})))
setMessage('Devis ' + numero + ' créé ✅')
setDescription(''); setMontantTotal(''); setClientId('')
chargerDonnees()
}

async function transformerEnFacture(devis, acompteIndex) {
const { data: { user } } = await supabase.auth.getUser()
const { data: acomptesDevis } = await supabase.from('acomptes').select('*').eq('devis_id', devis.id)
const acompte = acomptesDevis[acompteIndex]
if (!acompte || acompte.statut === 'facture') {
setMessage('Cet acompte a déjà été facturé !')
return
}
const numero = 'F-' + Date.now()
const { data: facture } = await supabase.from('factures').insert([{
user_id: user.id, client_id: devis.client_id, numero,
total_htva: acompte.montant / 1.21,
total_tva: acompte.montant - acompte.montant / 1.21,
total_tvac: acompte.montant, statut: 'envoyee'
}]).select().single()
await supabase.from('lignes_facture').insert([{
facture_id: facture.id,
description: 'Acompte ' + acompte.pourcentage + '% — ' + devis.description,
quantite: 1, prix_unitaire: acompte.montant / 1.21, taux_tva: 21
}])
await supabase.from('acomptes').update({ statut: 'facture', facture_id: facture.id }).eq('id', acompte.id)
setMessage('Facture acompte ' + acompte.pourcentage + '% créée ✅')
chargerDonnees()
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
borderRadius: '8px'
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
<a href="/clients" style={linkStyle}>Clients</a>
<a href="/factures" style={linkStyle}>Factures</a>
<a href="/devis" style={{ ...linkStyle, color: 'white', background: 'rgba(102,126,234,0.2)' }}>Devis</a>
</div>
</nav>

<div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
<h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '32px' }}>
📋 Devis & Acomptes
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
➕ Créer un devis
</h3>

<select value={clientId} onChange={(e) => setClientId(e.target.value)} style={inputStyle}>
<option value="">Choisir un client</option>
{clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
</select>

<input
placeholder="Description du chantier (ex: Installation électrique complète)"
value={description}
onChange={(e) => setDescription(e.target.value)}
style={inputStyle}
/>

<input
type="number"
placeholder="Montant total TVAC (€)"
value={montantTotal}
onChange={(e) => setMontantTotal(e.target.value)}
style={inputStyle}
/>

<h4 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px' }}>
Répartition des acomptes
</h4>

{acomptes.map((a, i) => (
<div key={i} style={{
display: 'flex',
alignItems: 'center',
gap: '12px',
marginBottom: '10px',
background: 'rgba(255,255,255,0.04)',
padding: '12px 16px',
borderRadius: '12px',
border: '1px solid rgba(255,255,255,0.06)'
}}>
<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', minWidth: '80px' }}>
Acompte {i + 1}
</span>
<input
type="number"
value={a.pourcentage}
onChange={(e) => {
const na = [...acomptes]
na[i].pourcentage = parseFloat(e.target.value)
setAcomptes(na)
}}
style={{
width: '70px',
padding: '8px 12px',
background: 'rgba(255,255,255,0.08)',
border: '1px solid rgba(255,255,255,0.15)',
borderRadius: '8px',
color: 'white',
fontSize: '14px',
outline: 'none',
textAlign: 'center'
}}
/>
<span style={{ color: 'rgba(255,255,255,0.4)' }}>%</span>
{montantTotal && (
<span style={{
marginLeft: 'auto',
color: '#34d399',
fontWeight: '700',
fontSize: '16px'
}}>
{(parseFloat(montantTotal) * a.pourcentage / 100).toFixed(2)}€
</span>
)}
</div>
))}

<button onClick={creerDevis} style={{
width: '100%',
padding: '16px',
background: 'linear-gradient(135deg, #667eea, #764ba2)',
border: 'none',
borderRadius: '14px',
color: 'white',
fontSize: '16px',
fontWeight: '700',
cursor: 'pointer',
marginTop: '16px',
boxShadow: '0 4px 20px rgba(102,126,234,0.4)'
}}>
Créer le devis
</button>

{message && (
<p style={{ marginTop: '12px', color: '#34d399', textAlign: 'center', fontWeight: '600' }}>
{message}
</p>
)}
</div>

<div style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '32px'
}}>
<h3 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>
📁 Mes devis
</h3>
{devisList.length === 0 ? (
<p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '32px' }}>
Aucun devis pour le moment
</p>
) : (
devisList.map((devis) => (
<div key={devis.id} style={{
background: 'rgba(255,255,255,0.04)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '16px',
padding: '20px',
marginBottom: '16px'
}}>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
<div>
<p style={{ color: 'white', fontWeight: '700', margin: '0 0 4px', fontSize: '16px' }}>
{devis.numero}
</p>
<p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 4px', fontSize: '13px' }}>
{devis.clients?.nom} — {devis.description}
</p>
</div>
<span style={{ color: '#34d399', fontWeight: '800', fontSize: '20px' }}>
{devis.montant_total}€
</span>
</div>

<p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '12px' }}>
👇 Clique sur un bouton quand le client a payé cet acompte pour générer la facture
</p>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
{[0, 1, 2].map((i) => (
<button
key={i}
onClick={() => transformerEnFacture(devis, i)}
style={{
padding: '12px 8px',
background: 'linear-gradient(135deg, #34d39922, #05966922)',
border: '1px solid rgba(52,211,153,0.3)',
borderRadius: '10px',
color: '#34d399',
fontSize: '12px',
fontWeight: '600',
cursor: 'pointer',
lineHeight: '1.4'
}}
>
✅ Client a payé<br/>l'acompte {i + 1}<br/>→ Créer facture
</button>
))}
</div>
</div>
))
)}
</div>
</div>
</div>
)
}
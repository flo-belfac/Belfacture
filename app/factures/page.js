'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import jsPDF from 'jspdf'

export default function Factures() {
const [clients, setClients] = useState([])
const [clientId, setClientId] = useState('')
const [lignes, setLignes] = useState([
{ description: '', quantite: '', prix_unitaire: '', taux_tva: 21 }
])
const [message, setMessage] = useState('')
const [derniereFacture, setDerniereFacture] = useState(null)
const [mesFactures, setMesFactures] = useState([])

useEffect(() => { chargerDonnees() }, [])

async function chargerDonnees() {
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/login'; return }
const { data: clientsData } = await supabase.from('clients').select('*').eq('user_id', user.id)
setClients(clientsData || [])
const { data: facturesData } = await supabase.from('factures').select('*, clients(nom)').eq('user_id', user.id).order('created_at', { ascending: false })
setMesFactures(facturesData || [])
}

function calculerTotal() {
return lignes.reduce((acc, l) => {
const htva = (parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0)
return acc + htva + htva * l.taux_tva / 100
}, 0)
}

async function creerFacture() {
const { data: { user } } = await supabase.auth.getUser()
const numero = 'F-' + Date.now()
const total_htva = lignes.reduce((acc, l) => acc + (parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0), 0)
const total_tva = lignes.reduce((acc, l) => acc + (parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0) * l.taux_tva / 100, 0)
const total_tvac = total_htva + total_tva
const client = clients.find(c => c.id === clientId)
const { data: facture, error } = await supabase.from('factures').insert([{ user_id: user.id, client_id: clientId, numero, total_htva, total_tva, total_tvac, statut: 'brouillon' }]).select().single()
if (error) { setMessage('Erreur : ' + error.message); return }
await supabase.from('lignes_facture').insert(lignes.map(l => ({ ...l, facture_id: facture.id })))
setDerniereFacture({ ...facture, client, lignes, total_htva, total_tva, total_tvac })
setMessage('Facture ' + numero + ' créée ✅')
chargerDonnees()
}

function telechargerPDF() {
if (!derniereFacture) return
const doc = new jsPDF()
doc.setFontSize(22)
doc.setTextColor(102, 126, 234)
doc.text('BelFacture', 20, 25)
doc.setFontSize(12)
doc.setTextColor(0, 0, 0)
doc.text('FACTURE', 150, 25)
doc.text('N° : ' + derniereFacture.numero, 150, 33)
doc.text('Date : ' + new Date().toLocaleDateString('fr-BE'), 150, 41)
doc.text('Client :', 20, 60)
doc.text(derniereFacture.client?.nom || '', 20, 68)
doc.setFillColor(102, 126, 234)
doc.rect(20, 100, 170, 8, 'F')
doc.setTextColor(255, 255, 255)
doc.text('Description', 22, 106)
doc.text('Qté', 110, 106)
doc.text('Prix HT', 130, 106)
doc.text('Total', 160, 106)
doc.setTextColor(0, 0, 0)
let y = 118
derniereFacture.lignes.forEach(l => {
doc.text(l.description, 22, y)
doc.text(String(l.quantite), 110, y)
doc.text(l.prix_unitaire + '€', 130, y)
doc.text((l.quantite * l.prix_unitaire).toFixed(2) + '€', 160, y)
y += 10
})
doc.line(20, y + 5, 190, y + 5)
doc.text('Total HTVA :', 120, y + 15)
doc.text(derniereFacture.total_htva.toFixed(2) + '€', 165, y + 15)
doc.text('TVA :', 120, y + 23)
doc.text(derniereFacture.total_tva.toFixed(2) + '€', 165, y + 23)
doc.setTextColor(102, 126, 234)
doc.text('Total TVAC :', 120, y + 33)
doc.text(derniereFacture.total_tvac.toFixed(2) + '€', 165, y + 33)
doc.save(derniereFacture.numero + '.pdf')
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
padding: '12px 14px',
background: 'rgba(255,255,255,0.08)',
border: '1px solid rgba(255,255,255,0.15)',
borderRadius: '10px',
color: 'white',
fontSize: '14px',
outline: 'none',
width: '100%',
boxSizing: 'border-box'
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
<a href="/factures" style={{ ...linkStyle, color: 'white', background: 'rgba(102,126,234,0.2)' }}>Factures</a>
<a href="/devis" style={linkStyle}>Devis</a>
</div>
</nav>

<div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
<h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '32px' }}>
📄 Nouvelle facture
</h1>

<div style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '32px',
marginBottom: '24px'
}}>
<h3 style={{ color: 'white', fontWeight: '700', marginBottom: '16px' }}>Client</h3>
<select value={clientId} onChange={(e) => setClientId(e.target.value)} style={{ ...inputStyle }}>
<option value="">Choisir un client</option>
{clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
</select>
</div>

<div style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '32px',
marginBottom: '24px'
}}>
<h3 style={{ color: 'white', fontWeight: '700', marginBottom: '16px' }}>Lignes de facture</h3>

<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '8px' }}>
<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', paddingLeft: '4px' }}>Description</span>
<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', paddingLeft: '4px' }}>Quantité</span>
<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', paddingLeft: '4px' }}>Prix unitaire €</span>
</div>

{lignes.map((ligne, i) => (
<div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
<input
placeholder="Ex: Installation électrique"
value={ligne.description}
onChange={(e) => { const nl = [...lignes]; nl[i].description = e.target.value; setLignes(nl) }}
style={inputStyle}
/>
<input
type="number"
placeholder="Ex: 2"
value={ligne.quantite}
onChange={(e) => { const nl = [...lignes]; nl[i].quantite = e.target.value; setLignes(nl) }}
style={inputStyle}
/>
<input
type="number"
placeholder="Ex: 150"
value={ligne.prix_unitaire}
onChange={(e) => { const nl = [...lignes]; nl[i].prix_unitaire = e.target.value; setLignes(nl) }}
style={inputStyle}
/>
</div>
))}
<button
onClick={() => setLignes([...lignes, { description: '', quantite: '', prix_unitaire: '', taux_tva: 21 }])}
style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}
>
+ Ajouter une ligne
</button>
</div>

<div style={{
background: 'rgba(255,255,255,0.05)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '24px 32px',
marginBottom: '24px',
textAlign: 'right'
}}>
<span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Total TVAC</span>
<div style={{ fontSize: '32px', fontWeight: '800', color: '#34d399' }}>
{calculerTotal().toFixed(2)}€
</div>
</div>

<button onClick={creerFacture} style={{
width: '100%',
padding: '16px',
background: 'linear-gradient(135deg, #667eea, #764ba2)',
border: 'none',
borderRadius: '14px',
color: 'white',
fontSize: '16px',
fontWeight: '700',
cursor: 'pointer',
marginBottom: '12px',
boxShadow: '0 4px 20px rgba(102,126,234,0.4)'
}}>
Créer la facture
</button>

{derniereFacture && (
<button onClick={telechargerPDF} style={{
width: '100%',
padding: '16px',
background: 'linear-gradient(135deg, #34d399, #059669)',
border: 'none',
borderRadius: '14px',
color: 'white',
fontSize: '16px',
fontWeight: '700',
cursor: 'pointer',
marginBottom: '24px',
boxShadow: '0 4px 20px rgba(52,211,153,0.3)'
}}>
📄 Télécharger le PDF
</button>
)}

{message && <p style={{ textAlign: 'center', color: '#34d399', marginBottom: '24px' }}>{message}</p>}

<div style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '32px'
}}>
<h3 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>
📋 Mes factures
</h3>
{mesFactures.length === 0 ? (
<p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '24px' }}>Aucune facture</p>
) : (
mesFactures.map((f) => (
<div key={f.id} style={{
borderBottom: '1px solid rgba(255,255,255,0.06)',
padding: '16px 0',
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center'
}}>
<div>
<p style={{ color: 'white', fontWeight: '600', margin: '0 0 4px' }}>{f.numero}</p>
<p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '13px' }}>{f.clients?.nom}</p>
</div>
<div style={{ textAlign: 'right' }}>
<p style={{ color: '#34d399', fontWeight: '700', margin: '0 0 4px' }}>{f.total_tvac?.toFixed(2)}€</p>
<span style={{
background: 'rgba(102,126,234,0.2)',
color: '#a78bfa',
padding: '2px 10px',
borderRadius: '20px',
fontSize: '12px'
}}>{f.statut}</span>
</div>
</div>
))
)}
</div>
</div>
</div>
)
}
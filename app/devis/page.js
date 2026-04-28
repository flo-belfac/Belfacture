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

useEffect(() => {
chargerDonnees()
}, [])

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

const { data: devis, error } = await supabase
.from('devis')
.insert([{ user_id: user.id, client_id: clientId, numero, description, montant_total: total, statut: 'en_attente' }])
.select().single()

if (error) { setMessage('Erreur : ' + error.message); return }

const acomptesData = acomptes.map(a => ({
devis_id: devis.id,
pourcentage: a.pourcentage,
montant: (total * a.pourcentage / 100),
statut: 'non_facture'
}))

await supabase.from('acomptes').insert(acomptesData)
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
const { data: facture } = await supabase
.from('factures')
.insert([{
user_id: user.id,
client_id: devis.client_id,
numero,
total_htva: acompte.montant / 1.21,
total_tva: acompte.montant - acompte.montant / 1.21,
total_tvac: acompte.montant,
statut: 'envoyee'
}])
.select().single()

await supabase.from('lignes_facture').insert([{
facture_id: facture.id,
description: 'Acompte ' + acompte.pourcentage + '% — ' + devis.description,
quantite: 1,
prix_unitaire: acompte.montant / 1.21,
taux_tva: 21
}])

await supabase.from('acomptes').update({ statut: 'facture', facture_id: facture.id }).eq('id', acompte.id)
setMessage('Facture acompte ' + acompte.pourcentage + '% créée ✅')
chargerDonnees()
}

return (
<div className="min-h-screen bg-blue-50">
<nav className="bg-white shadow p-4 flex justify-between items-center">
<h1 className="text-xl font-bold text-blue-700">BelFacture</h1>
<div className="flex gap-4">
<a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
<a href="/clients" className="text-blue-600 hover:underline">Clients</a>
<a href="/factures" className="text-blue-600 hover:underline">Factures</a>
<a href="/devis" className="text-blue-600 font-bold">Devis</a>
</div>
</nav>

<div className="max-w-4xl mx-auto p-6">
<h2 className="text-2xl font-bold text-gray-800 mb-6">Devis & Acomptes</h2>

<div className="bg-white rounded-xl shadow p-6 mb-6">
<h3 className="text-lg font-bold mb-4">Créer un devis</h3>
<select
value={clientId}
onChange={(e) => setClientId(e.target.value)}
className="w-full border rounded-lg p-3 mb-3"
>
<option value="">Choisir un client</option>
{clients.map(c => (
<option key={c.id} value={c.id}>{c.nom}</option>
))}
</select>
<input
placeholder="Description du chantier (ex: Installation électrique)"
value={description}
onChange={(e) => setDescription(e.target.value)}
className="w-full border rounded-lg p-3 mb-3"
/>
<input
type="number"
placeholder="Montant total TVAC (€)"
value={montantTotal}
onChange={(e) => setMontantTotal(e.target.value)}
className="w-full border rounded-lg p-3 mb-4"
/>

<h4 className="font-bold mb-2">Acomptes :</h4>
{acomptes.map((a, i) => (
<div key={i} className="flex items-center gap-3 mb-2">
<span className="text-gray-600">Acompte {i + 1} :</span>
<input
type="number"
value={a.pourcentage}
onChange={(e) => {
const na = [...acomptes]
na[i].pourcentage = parseFloat(e.target.value)
setAcomptes(na)
}}
className="border rounded-lg p-2 w-20"
/>
<span>%</span>
{montantTotal && (
<span className="text-blue-600 font-semibold">
= {(parseFloat(montantTotal) * a.pourcentage / 100).toFixed(2)}€
</span>
)}
</div>
))}

<button
onClick={creerDevis}
className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-blue-700"
>
Créer le devis
</button>
{message && <p className="mt-3 text-green-600 font-semibold">{message}</p>}
</div>

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-lg font-bold mb-4">Mes devis</h3>
{devisList.length === 0 ? (
<p className="text-gray-400 text-center py-4">Aucun devis pour le moment</p>
) : (
devisList.map((devis) => (
<div key={devis.id} className="border rounded-xl p-4 mb-4">
<div className="flex justify-between items-center mb-3">
<div>
<p className="font-bold text-gray-800">{devis.numero}</p>
<p className="text-gray-500 text-sm">{devis.clients?.nom} — {devis.description}</p>
<p className="text-blue-600 font-semibold">{devis.montant_total}€ TVAC</p>
</div>
</div>
<div className="grid grid-cols-3 gap-2">
{[0, 1, 2].map((i) => (
<button
key={i}
onClick={() => transformerEnFacture(devis, i)}
className="bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600"
>
Facturer acompte {i + 1}
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
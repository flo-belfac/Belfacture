'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import jsPDF from 'jspdf'

export default function Factures() {
const [clients, setClients] = useState([])
const [clientId, setClientId] = useState('')
const [lignes, setLignes] = useState([
{ description: '', quantite: 1, prix_unitaire: 0, taux_tva: 21 }
])
const [message, setMessage] = useState('')
const [derniereFacture, setDerniereFacture] = useState(null)
const [mesFactures, setMesFactures] = useState([])

useEffect(() => {
chargerDonnees()
}, [])

async function chargerDonnees() {
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/login'; return }
const { data: clientsData } = await supabase.from('clients').select('*').eq('user_id', user.id)
setClients(clientsData || [])
const { data: facturesData } = await supabase
.from('factures')
.select('*, clients(nom)')
.eq('user_id', user.id)
.order('created_at', { ascending: false })
setMesFactures(facturesData || [])
}

function calculerTotal() {
return lignes.reduce((acc, l) => {
const htva = l.quantite * l.prix_unitaire
const tva = htva * l.taux_tva / 100
return acc + htva + tva
}, 0)
}

async function creerFacture() {
const { data: { user } } = await supabase.auth.getUser()
const numero = 'F-' + Date.now()
const total_htva = lignes.reduce((acc, l) => acc + l.quantite * l.prix_unitaire, 0)
const total_tva = lignes.reduce((acc, l) => acc + l.quantite * l.prix_unitaire * l.taux_tva / 100, 0)
const total_tvac = total_htva + total_tva
const client = clients.find(c => c.id === clientId)

const { data: facture, error } = await supabase
.from('factures')
.insert([{ user_id: user.id, client_id: clientId, numero, total_htva, total_tva, total_tvac, statut: 'brouillon' }])
.select().single()

if (error) { setMessage('Erreur : ' + error.message); return }

await supabase.from('lignes_facture').insert(
lignes.map(l => ({ ...l, facture_id: facture.id }))
)
setDerniereFacture({ ...facture, client, lignes, total_htva, total_tva, total_tvac })
setMessage('Facture ' + numero + ' créée ✅')
chargerDonnees()
}

function telechargerPDF() {
if (!derniereFacture) return
const doc = new jsPDF()
doc.setFontSize(22)
doc.setTextColor(29, 78, 216)
doc.text('BelFacture', 20, 25)
doc.setFontSize(12)
doc.setTextColor(0, 0, 0)
doc.text('FACTURE', 150, 25)
doc.text('N° : ' + derniereFacture.numero, 150, 33)
doc.text('Date : ' + new Date().toLocaleDateString('fr-BE'), 150, 41)
doc.setFontSize(11)
doc.text('Client :', 20, 60)
doc.text(derniereFacture.client?.nom || '', 20, 68)
doc.text(derniereFacture.client?.numero_tva || '', 20, 76)
doc.text(derniereFacture.client?.adresse || '', 20, 84)
doc.setFillColor(29, 78, 216)
doc.rect(20, 100, 170, 8, 'F')
doc.setTextColor(255, 255, 255)
doc.text('Description', 22, 106)
doc.text('Qté', 110, 106)
doc.text('Prix HT', 130, 106)
doc.text('Total', 160, 106)
doc.setTextColor(0, 0, 0)
let y = 118
derniereFacture.lignes.forEach(l => {
const total = l.quantite * l.prix_unitaire
doc.text(l.description, 22, y)
doc.text(String(l.quantite), 110, y)
doc.text(l.prix_unitaire + '€', 130, y)
doc.text(total.toFixed(2) + '€', 160, y)
y += 10
})
doc.line(20, y + 5, 190, y + 5)
doc.text('Total HTVA :', 120, y + 15)
doc.text(derniereFacture.total_htva.toFixed(2) + '€', 165, y + 15)
doc.text('TVA :', 120, y + 23)
doc.text(derniereFacture.total_tva.toFixed(2) + '€', 165, y + 23)
doc.setFontSize(13)
doc.setTextColor(29, 78, 216)
doc.text('Total TVAC :', 120, y + 33)
doc.text(derniereFacture.total_tvac.toFixed(2) + '€', 165, y + 33)
doc.save(derniereFacture.numero + '.pdf')
}

return (
<div className="min-h-screen bg-blue-50">
<nav className="bg-white shadow p-4 flex justify-between items-center">
<h1 className="text-xl font-bold text-blue-700">BelFacture</h1>
<div className="flex gap-4">
<a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
<a href="/clients" className="text-blue-600 hover:underline">Clients</a>
<a href="/factures" className="text-blue-600 font-bold">Factures</a>
<a href="/devis" className="text-blue-600 hover:underline">Devis</a>
</div>
</nav>

<div className="max-w-4xl mx-auto p-6">
<h2 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle facture</h2>

<div className="bg-white rounded-xl shadow p-6 mb-6">
<h3 className="text-lg font-bold mb-4">Client</h3>
<select
value={clientId}
onChange={(e) => setClientId(e.target.value)}
className="w-full border rounded-lg p-3"
>
<option value="">Choisir un client</option>
{clients.map(c => (
<option key={c.id} value={c.id}>{c.nom}</option>
))}
</select>
</div>

<div className="bg-white rounded-xl shadow p-6 mb-6">
<h3 className="text-lg font-bold mb-4">Lignes de facture</h3>
{lignes.map((ligne, i) => (
<div key={i} className="grid grid-cols-4 gap-2 mb-3">
<input
placeholder="Description"
value={ligne.description}
onChange={(e) => {
const nl = [...lignes]
nl[i].description = e.target.value
setLignes(nl)
}}
className="border rounded-lg p-2 col-span-2"
/>
<input
type="number"
placeholder="Qté"
value={ligne.quantite}
onChange={(e) => {
const nl = [...lignes]
nl[i].quantite = parseFloat(e.target.value)
setLignes(nl)
}}
className="border rounded-lg p-2"
/>
<input
type="number"
placeholder="Prix"
value={ligne.prix_unitaire}
onChange={(e) => {
const nl = [...lignes]
nl[i].prix_unitaire = parseFloat(e.target.value)
setLignes(nl)
}}
className="border rounded-lg p-2"
/>
</div>
))}
<button
onClick={() => setLignes([...lignes, { description: '', quantite: 1, prix_unitaire: 0, taux_tva: 21 }])}
className="text-blue-600 hover:underline text-sm"
>
+ Ajouter une ligne
</button>
</div>

<div className="bg-white rounded-xl shadow p-6 mb-6 text-right">
<p className="text-xl font-bold text-gray-800">
Total TVAC : {calculerTotal().toFixed(2)}€
</p>
</div>

<button
onClick={creerFacture}
className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 mb-4"
>
Créer la facture
</button>

{derniereFacture && (
<button
onClick={telechargerPDF}
className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 mb-4"
>
📄 Télécharger le PDF
</button>
)}

{message && <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>}

<div className="bg-white rounded-xl shadow p-6 mt-6">
<h3 className="text-lg font-bold mb-4">Mes factures</h3>
{mesFactures.length === 0 ? (
<p className="text-gray-400 text-center py-4">Aucune facture</p>
) : (
mesFactures.map((f) => (
<div key={f.id} className="border-b py-3 flex justify-between">
<div>
<p className="font-semibold">{f.numero}</p>
<p className="text-gray-500 text-sm">{f.clients?.nom}</p>
</div>
<div className="text-right">
<p className="font-bold text-blue-600">{f.total_tvac?.toFixed(2)}€</p>
<p className="text-gray-400 text-sm">{f.statut}</p>
</div>
</div>
))
)}
</div>

</div>
</div>
)
}
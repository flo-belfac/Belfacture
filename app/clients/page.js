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

useEffect(() => {
chargerClients()
}, [])

async function chargerClients() {
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/login'; return }
const { data } = await supabase
.from('clients')
.select('*')
.eq('user_id', user.id)
setClients(data || [])
}

async function ajouterClient() {
const { data: { user } } = await supabase.auth.getUser()
const { error } = await supabase
.from('clients')
.insert([{ nom, email, numero_tva: tva, adresse, user_id: user.id }])
if (error) {
setMessage('Erreur : ' + error.message)
} else {
setMessage('Client ajouté ✅')
setNom(''); setEmail(''); setTva(''); setAdresse('')
chargerClients()
}
}

return (
<div className="min-h-screen bg-blue-50">
<nav className="bg-white shadow p-4 flex justify-between items-center">
<h1 className="text-xl font-bold text-blue-700">BelFacture</h1>
<div className="flex gap-4">
<a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
<a href="/clients" className="text-blue-600 font-bold">Clients</a>
</div>
</nav>

<div className="max-w-4xl mx-auto p-6">
<h2 className="text-2xl font-bold text-gray-800 mb-6">Mes clients</h2>

<div className="bg-white rounded-xl shadow p-6 mb-6">
<h3 className="text-lg font-bold mb-4">Ajouter un client</h3>
<input
placeholder="Nom de l'entreprise"
value={nom}
onChange={(e) => setNom(e.target.value)}
className="w-full border rounded-lg p-3 mb-3"
/>
<input
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="w-full border rounded-lg p-3 mb-3"
/>
<input
placeholder="Numéro TVA (ex: BE0123456789)"
value={tva}
onChange={(e) => setTva(e.target.value)}
className="w-full border rounded-lg p-3 mb-3"
/>
<input
placeholder="Adresse"
value={adresse}
onChange={(e) => setAdresse(e.target.value)}
className="w-full border rounded-lg p-3 mb-4"
/>
<button
onClick={ajouterClient}
className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
>
+ Ajouter le client
</button>
{message && <p className="mt-3 text-green-600">{message}</p>}
</div>

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-lg font-bold mb-4">Liste des clients</h3>
{clients.length === 0 ? (
<p className="text-gray-400 text-center py-4">Aucun client pour le moment</p>
) : (
clients.map((client) => (
<div key={client.id} className="border-b py-3">
<p className="font-semibold">{client.nom}</p>
<p className="text-gray-500 text-sm">{client.email} · {client.numero_tva}</p>
</div>
))
)}
</div>
</div>
</div>
)
}
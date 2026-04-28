'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
const [user, setUser] = useState(null)
const [factures, setFactures] = useState([])

useEffect(() => {
async function getUser() {
const { data } = await supabase.auth.getUser()
if (!data.user) {
window.location.href = '/login'
} else {
setUser(data.user)
}
}
getUser()
}, [])

async function handleLogout() {
await supabase.auth.signOut()
window.location.href = '/login'
}

return (
<div className="min-h-screen bg-blue-50">
<nav className="bg-white shadow p-4 flex justify-between items-center">
<h1 className="text-xl font-bold text-blue-700">
Belfacure
</h1>
<button
onClick={handleLogout}
className="text-red-500 font-semibold hover:underline"
>
Déconnexion
</button>
</nav>

<div className="max-w-4xl mx-auto p-6">
<h2 className="text-2xl font-bold text-gray-800 mb-6">
Bonjour 👋
</h2>

<div className="grid grid-cols-3 gap-4 mb-8">
<div className="bg-white rounded-xl shadow p-4 text-center">
<p className="text-3xl font-bold text-blue-600">0</p>
<p className="text-gray-500 mt-1">Factures envoyées</p>
</div>
<div className="bg-white rounded-xl shadow p-4 text-center">
<p className="text-3xl font-bold text-green-600">0€</p>
<p className="text-gray-500 mt-1">Total ce mois</p>
</div>
<div className="bg-white rounded-xl shadow p-4 text-center">
<p className="text-3xl font-bold text-orange-500">0</p>
<p className="text-gray-500 mt-1">En attente</p>
</div>
</div>

<div className="bg-white rounded-xl shadow p-6">
<div className="flex justify-between items-center mb-4">
<h3 className="text-lg font-bold text-gray-800">
Mes factures
</h3>
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
+ Nouvelle facture
</button>
</div>
<p className="text-gray-400 text-center py-8">
Aucune facture pour le moment
</p>
</div>
</div>
</div>
)
}

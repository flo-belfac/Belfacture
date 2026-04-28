'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [message, setMessage] = useState('')

async function handleLogin() {
const { error } = await supabase.auth.signInWithPassword({
email,
password
})
if (error) {
setMessage('Erreur : ' + error.message)
} else {
window.location.href = '/dashboard'
}
}

async function handleRegister() {
const { error } = await supabase.auth.signUp({
email,
password
})
if (error) {
setMessage('Erreur : ' + error.message)
} else {
setMessage('Compte créé ! Vérifiez votre email.')
}
}

return (
<div className="min-h-screen bg-blue-50 flex items-center justify-center">
<div className="bg-white p-8 rounded-xl shadow-lg w-96">
<h1 className="text-2xl font-bold text-blue-700 mb-2">
Belfacture
</h1>
<p className="text-gray-500 mb-6">
Facturation électronique simplifiée
</p>
<input
type="email"
placeholder="Votre email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:border-blue-500"
/>
<input
type="password"
placeholder="Votre mot de passe"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:border-blue-500"
/>
<button
onClick={handleLogin}
className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-3 hover:bg-blue-700"
>
Se connecter
</button>
<button
onClick={handleRegister}
className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
>
Créer un compte
</button>
{message && (
<p className="mt-4 text-center text-sm text-red-500">{message}</p>
)}
</div>
</div>
)
}
'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [message, setMessage] = useState('')
const [loading, setLoading] = useState(false)

async function handleLogin() {
setLoading(true)
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error) {
setMessage('Erreur : ' + error.message)
} else {
window.location.href = '/dashboard'
}
setLoading(false)
}

async function handleRegister() {
setLoading(true)
const { error } = await supabase.auth.signUp({ email, password })
if (error) {
setMessage('Erreur : ' + error.message)
} else {
setMessage('Compte créé ! Vérifiez votre email ✅')
}
setLoading(false)
}

return (
<div style={{
minHeight: '100vh',
background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontFamily: "'Segoe UI', sans-serif"
}}>
<div style={{
background: 'rgba(255,255,255,0.05)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255,255,255,0.1)',
borderRadius: '24px',
padding: '48px',
width: '100%',
maxWidth: '420px',
boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
}}>
<div style={{ textAlign: 'center', marginBottom: '32px' }}>
<div style={{
background: 'linear-gradient(135deg, #667eea, #764ba2)',
borderRadius: '16px',
width: '64px',
height: '64px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
margin: '0 auto 16px',
fontSize: '28px'
}}>
⚡
</div>
<h1 style={{
fontSize: '28px',
fontWeight: '800',
background: 'linear-gradient(135deg, #667eea, #a78bfa)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
margin: '0 0 8px'
}}>
BelFacture
</h1>
<p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
Facturation électronique belge simplifiée
</p>
</div>

<div style={{ marginBottom: '16px' }}>
<input
type="email"
placeholder="Votre email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style={{
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
}}
/>
<input
type="password"
placeholder="Votre mot de passe"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={{
width: '100%',
padding: '14px 16px',
background: 'rgba(255,255,255,0.08)',
border: '1px solid rgba(255,255,255,0.15)',
borderRadius: '12px',
color: 'white',
fontSize: '15px',
outline: 'none',
boxSizing: 'border-box'
}}
/>
</div>

<button
onClick={handleLogin}
disabled={loading}
style={{
width: '100%',
padding: '14px',
background: 'linear-gradient(135deg, #667eea, #764ba2)',
border: 'none',
borderRadius: '12px',
color: 'white',
fontSize: '16px',
fontWeight: '700',
cursor: 'pointer',
marginBottom: '12px',
boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
}}
>
{loading ? '⏳ Connexion...' : 'Se connecter'}
</button>

<button
onClick={handleRegister}
disabled={loading}
style={{
width: '100%',
padding: '14px',
background: 'transparent',
border: '1px solid rgba(102,126,234,0.5)',
borderRadius: '12px',
color: '#a78bfa',
fontSize: '16px',
fontWeight: '600',
cursor: 'pointer'
}}
>
Créer un compte
</button>

{message && (
<p style={{
marginTop: '16px',
textAlign: 'center',
color: message.includes('Erreur') ? '#f87171' : '#34d399',
fontSize: '14px'
}}>
{message}
</p>
)}

<p style={{
textAlign: 'center',
color: 'rgba(255,255,255,0.3)',
fontSize: '12px',
marginTop: '24px'
}}>
🇧🇪 Conforme Peppol 2026
</p>
</div>
</div>
)
}
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
      background: 'radial-gradient(120% 90% at 30% 0%, #241a12 0%, #15110d 55%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Figtree', system-ui, sans-serif", padding: '20px'
    }}>
      <style>{`
        .lg-card input:focus{border-color:#db6e44 !important;}
        .lg-badge{position:relative;display:flex;align-items:center;justify-content:center;background:#db6e44;width:64px;height:64px;border-radius:20px;margin:0 auto 18px;}
        .lg-badge .core{width:11px;height:11px;border-radius:999px;background:#f4eddd;position:relative;z-index:2;}
        .lg-badge .ring{position:absolute;width:14px;height:14px;border-radius:999px;border:2px solid #f4eddd;animation:lgripple 2.4s ease-out infinite;}
        .lg-badge .ring:nth-child(2){animation-delay:1.2s;}
        @keyframes lgripple{0%{transform:scale(.6);opacity:.85;}100%{transform:scale(2.8);opacity:0;}}
        .lg-btn{transition:transform .15s, filter .15s;}
        .lg-btn:hover{transform:translateY(-1px);filter:brightness(1.08);}
      `}</style>

      <div className="lg-card" style={{
        background: 'rgba(33,26,19,0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(219,110,68,0.18)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="lg-badge">
            <span className="ring" />
            <span className="ring" />
            <span className="core" />
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '40px', fontWeight: 400, color: '#f2ebdc',
            margin: '0 0 6px', letterSpacing: '-0.01em'
          }}>
            BelFacture
          </h1>
          <p style={{ color: 'rgba(242,235,220,0.5)', fontSize: '14px', margin: 0 }}>
            Facturation belge, prête pour Peppol
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="email" placeholder="Votre email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px', color: '#f2ebdc', fontSize: '15px',
              outline: 'none', boxSizing: 'border-box', marginBottom: '12px'
            }}
          />
          <input
            type="password" placeholder="Votre mot de passe" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px', color: '#f2ebdc', fontSize: '15px',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleLogin} disabled={loading} className="lg-btn"
          style={{
            width: '100%', padding: '14px', background: '#db6e44',
            border: 'none', borderRadius: '12px', color: '#15110d',
            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
            marginBottom: '12px', boxShadow: '0 8px 24px rgba(219,110,68,0.35)'
          }}
        >
          {loading ? '⏳ Connexion...' : 'Se connecter'}
        </button>

        <button
          onClick={handleRegister} disabled={loading} className="lg-btn"
          style={{
            width: '100%', padding: '14px', background: 'transparent',
            border: '1px solid rgba(219,110,68,0.5)', borderRadius: '12px',
            color: '#db6e44', fontSize: '16px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          Créer un compte
        </button>

        {message && (
          <p style={{
            marginTop: '16px', textAlign: 'center',
            color: message.includes('Erreur') ? '#f08a63' : '#7ed3a8',
            fontSize: '14px'
          }}>
            {message}
          </p>
        )}

        <p style={{ textAlign: 'center', color: 'rgba(242,235,220,0.3)', fontSize: '12px', marginTop: '24px' }}>
          Conforme Peppol 2026
        </p>
      </div>
    </div>
  )
}
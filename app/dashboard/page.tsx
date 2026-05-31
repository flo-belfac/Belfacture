'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Logo = ({ size = 32 }: { size?: number }) => (
  <span className="logo-b" style={{ width: size, height: size, borderRadius: size * 0.3, background: '#db6e44', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span className="ring" />
    <span className="ring" style={{ animationDelay: '1.2s' }} />
    <span className="core" />
  </span>
)

export default function Dashboard() {
  const [stats, setStats] = useState({ factures: 0, clients: 0, total: 0 })
  const [activeNav, setActiveNav] = useState('dashboard')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: factures } = await supabase.from('factures').select('*').eq('user_id', user.id)
      const { data: clients } = await supabase.from('clients').select('*').eq('user_id', user.id)
      const total = factures?.reduce((acc, f) => acc + (f.total_tvac || 0), 0) || 0
      setStats({ factures: factures?.length || 0, clients: clients?.length || 0, total })
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const navLink = (href: string, label: string, key: string) => (
    <a href={href} onClick={() => setActiveNav(key)} style={{
      color: activeNav === key ? '#db6e44' : 'rgba(242,235,220,0.5)',
      textDecoration: 'none', fontSize: '14px', fontWeight: 500,
      padding: '7px 14px', borderRadius: '9px', transition: 'all .2s',
      background: activeNav === key ? 'rgba(219,110,68,0.12)' : 'transparent',
      fontFamily: "'Figtree', sans-serif",
    }}>{label}</a>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12 0%, #15110d 55%)', fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .logo-b .core{width:7px;height:7px;border-radius:999px;background:#f4eddd;position:relative;z-index:2;}
        .logo-b .ring{position:absolute;width:9px;height:9px;border-radius:999px;border:1.5px solid #f4eddd;animation:ripple 2.4s ease-out infinite;}
        @keyframes ripple{0%{transform:scale(.6);opacity:.85;}100%{transform:scale(2.8);opacity:0;}}
        .nav-link:hover{color:#db6e44 !important;background:rgba(219,110,68,0.08) !important;}
        .stat-card{background:rgba(33,26,19,0.6);backdrop-filter:blur(20px);border:1px solid rgba(219,110,68,0.12);border-radius:20px;padding:28px;text-align:center;transition:transform .2s,border-color .2s;}
        .stat-card:hover{transform:translateY(-3px);border-color:rgba(219,110,68,0.35);}
        .action-card{background:rgba(33,26,19,0.6);backdrop-filter:blur(20px);border:1.5px solid rgba(219,110,68,0.12);border-radius:20px;padding:24px;text-decoration:none;display:flex;align-items:center;gap:18px;transition:transform .2s,border-color .2s;}
        .action-card:hover{transform:translateY(-3px);border-color:rgba(219,110,68,0.4);}
      `}</style>

      {/* NAV */}
      <nav style={{
        background: 'rgba(21,17,13,0.88)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(219,110,68,0.12)',
        padding: '0 32px', height: '60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo />
          <span style={{ fontFamily: "'Instrument Serif', serif", color: '#f2ebdc', fontSize: '22px', fontWeight: 400 }}>BelFacture</span>
        </a>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {navLink('/dashboard', 'Dashboard', 'dashboard')}
          {navLink('/clients', 'Clients', 'clients')}
          {navLink('/factures', 'Factures', 'factures')}
          {navLink('/devis', 'Devis', 'devis')}
          {navLink('/parametres', '⚙️ Paramètres', 'parametres')}
          <button onClick={handleLogout} style={{
            background: 'rgba(240,138,99,0.1)', border: '1px solid rgba(240,138,99,0.25)',
            borderRadius: '9px', color: '#f08a63', padding: '7px 14px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            fontFamily: "'Figtree', sans-serif", marginLeft: '6px',
          }}>Déconnexion</button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '44px' }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '52px', fontWeight: 400, color: '#f2ebdc', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Bonjour 👋
          </h1>
          <p style={{ color: 'rgba(242,235,220,0.45)', margin: 0, fontSize: '15px' }}>
            Bienvenue sur votre espace BelFacture
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
          {[
            { label: 'Factures envoyées', value: stats.factures, icon: '📄', color: '#db6e44' },
            { label: 'Total facturé', value: stats.total.toFixed(2) + ' €', icon: '💶', color: '#e8c56a' },
            { label: 'Clients actifs', value: stats.clients, icon: '👥', color: '#9eb8e0' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '42px', fontWeight: 400, color: s.color, marginBottom: '8px', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ color: 'rgba(242,235,220,0.45)', fontSize: '13px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { href: '/factures/new', icon: '📄', title: 'Nouvelle facture', desc: 'Créer et envoyer une facture' },
            { href: '/devis/new', icon: '📋', title: 'Nouveau devis', desc: 'Créer un devis avec acomptes' },
            { href: '/clients', icon: '👥', title: 'Mes clients', desc: 'Gérer votre liste de clients' },
            { href: '/factures', icon: '💶', title: 'Mes factures', desc: 'Voir toutes vos factures' },
            { href: '/parametres', icon: '⚙️', title: 'Paramètres', desc: 'Infos entreprise & Peppol' },
          ].map((item, i) => (
            <a key={i} href={item.href} className="action-card">
              <div style={{
                background: 'rgba(219,110,68,0.12)', border: '1px solid rgba(219,110,68,0.22)',
                borderRadius: '14px', width: '52px', height: '52px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ color: '#f2ebdc', fontWeight: 700, fontSize: '15px', marginBottom: '3px' }}>{item.title}</div>
                <div style={{ color: 'rgba(242,235,220,0.4)', fontSize: '13px' }}>{item.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
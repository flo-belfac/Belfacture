'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'

export default function Dashboard() {
  const [stats, setStats] = useState({ factures: 0, clients: 0, total: 0 })

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

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12 0%, #15110d 55%)', fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .stat-card{background:rgba(33,26,19,.6);backdrop-filter:blur(20px);border:1px solid rgba(219,110,68,.12);border-radius:20px;padding:28px;text-align:center;transition:transform .2s,border-color .2s;}
        .stat-card:hover{transform:translateY(-3px);border-color:rgba(219,110,68,.35);}
        .action-card{background:rgba(33,26,19,.6);backdrop-filter:blur(20px);border:1.5px solid rgba(219,110,68,.12);border-radius:20px;padding:24px;text-decoration:none;display:flex;align-items:center;gap:18px;transition:transform .2s,border-color .2s;}
        .action-card:hover{transform:translateY(-3px);border-color:rgba(219,110,68,.4);}
      `}</style>

      <Nav />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 44 }}>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: '#f2ebdc', margin: '0 0 8px', letterSpacing: '-0.01em' }}>Bonjour 👋</h1>
          <p style={{ color: 'rgba(242,235,220,.45)', margin: 0, fontSize: 15 }}>Bienvenue sur votre espace BelFacture</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 28 }}>
          {[
            { label: 'Factures envoyées', value: stats.factures, icon: '📄', color: '#db6e44' },
            { label: 'Total facturé', value: stats.total.toFixed(2) + ' €', icon: '💶', color: '#e8c56a' },
            { label: 'Clients actifs', value: stats.clients, icon: '👥', color: '#9eb8e0' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 42, fontWeight: 400, color: s.color, marginBottom: 8, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ color: 'rgba(242,235,220,.45)', fontSize: 13, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {[
            { href: '/factures', icon: '📄', title: 'Nouvelle facture', desc: 'Créer et envoyer une facture' },
            { href: '/devis', icon: '📋', title: 'Nouveau devis', desc: 'Créer un devis avec acomptes' },
            { href: '/clients', icon: '👥', title: 'Mes clients', desc: 'Gérer votre liste de clients' },
            { href: '/factures', icon: '💶', title: 'Mes factures', desc: 'Voir toutes vos factures' },
            { href: '/parametres', icon: '⚙️', title: 'Paramètres', desc: 'Infos entreprise & Peppol' },
          ].map((item, i) => (
            <a key={i} href={item.href} className="action-card">
              <div style={{ background: 'rgba(219,110,68,.12)', border: '1px solid rgba(219,110,68,.22)', borderRadius: 14, width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ color: '#f2ebdc', fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{item.title}</div>
                <div style={{ color: 'rgba(242,235,220,.4)', fontSize: 13 }}>{item.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
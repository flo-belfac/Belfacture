'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'

export default function Abonnement() {
  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState('gratuit')
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data } = await supabase.from('parametres_entreprise').select('plan').eq('user_id', user.id).single()
      if (data?.plan) setPlan(data.plan)
      setLoading(false)
    }
    load()
  }, [])

  async function souscrire(priceId: string, planName: string) {
    if (!user) return
    setCheckoutLoading(planName)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId: user.id,
        userEmail: user.email,
        plan: planName,
      }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setCheckoutLoading(null)
  }

  const plans = [
    {
      id: 'gratuit',
      nom: 'Découverte',
      prix: '0€',
      desc: 'Pour tester sans engagement',
      features: ['5 factures PDF/mois', 'Gestion clients basique', 'Mentions légales belges'],
      priceId: null,
    },
    {
      id: 'solo',
      nom: 'Solo',
      prix: '12€/mois',
      desc: 'Pour les indépendants actifs',
      features: ['Factures & devis illimités', 'Acomptes progressifs', 'Tous les taux de TVA', '30 envois Peppol/mois', 'Support email'],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO,
      popular: true,
    },
    {
      id: 'pro',
      nom: 'Pro',
      prix: '24€/mois',
      desc: 'Pour les TPE et actifs',
      features: ['Tout Solo', '150 envois Peppol/mois', 'Réception Peppol', 'Statistiques', 'Multi-utilisateurs'],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12, #15110d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f2ebdc', fontFamily: "'Figtree',sans-serif" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12 0%, #15110d 55%)', fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .plan-card{background:rgba(33,26,19,0.6);backdrop-filter:blur(20px);border:1.5px solid rgba(219,110,68,0.15);border-radius:20px;padding:28px;display:flex;flex-direction:column;transition:border-color .2s;}
        .plan-card:hover{border-color:rgba(219,110,68,0.4);}
        .plan-active{border-color:rgba(219,110,68,0.6) !important;background:rgba(219,110,68,0.07) !important;}
        .check{width:18px;height:18px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;background:rgba(219,110,68,.18);color:#db6e44;font-size:11px;flex-shrink:0;font-weight:700;}
        @media(max-width:768px){.plans-grid{grid-template-columns:1fr !important;}}
      `}</style>

      <Nav />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: '#f2ebdc', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          Abonnement
        </h1>
        <p style={{ color: 'rgba(242,235,220,0.5)', marginBottom: 48, fontSize: 15 }}>
          Plan actuel : <span style={{ color: '#db6e44', fontWeight: 700, textTransform: 'capitalize' }}>{plan}</span>
        </p>

        <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {plans.map(p => (
            <div key={p.id} className={`plan-card${plan === p.id ? ' plan-active' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ color: '#db6e44', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{p.nom}</div>
                {(p as any).popular && <span style={{ background: 'rgba(219,110,68,0.15)', color: '#db6e44', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>Populaire</span>}
                {plan === p.id && <span style={{ background: 'rgba(126,211,168,0.15)', color: '#7ed3a8', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>✓ Actif</span>}
              </div>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, color: '#f2ebdc', fontWeight: 400, margin: '8px 0 4px' }}>{p.prix}</div>
              <p style={{ color: 'rgba(242,235,220,0.45)', fontSize: 13, marginBottom: 20 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'rgba(242,235,220,0.8)' }}>
                    <span className="check">✓</span>{f}
                  </li>
                ))}
              </ul>
              {plan === p.id ? (
                <div style={{ padding: '12px', background: 'rgba(126,211,168,0.1)', border: '1px solid rgba(126,211,168,0.25)', borderRadius: 12, textAlign: 'center', color: '#7ed3a8', fontWeight: 600, fontSize: 14 }}>
                  Plan actuel ✓
                </div>
              ) : p.priceId ? (
                <button
                  onClick={() => souscrire(p.priceId!, p.id)}
                  disabled={checkoutLoading === p.id}
                  style={{ padding: '13px', background: '#db6e44', border: 'none', borderRadius: 12, color: '#15110d', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(219,110,68,.3)', fontFamily: "'Figtree',sans-serif" }}
                >
                  {checkoutLoading === p.id ? '⏳ Redirection...' : `Passer à ${p.nom} →`}
                </button>
              ) : (
                <div style={{ padding: '12px', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', borderRadius: 12, textAlign: 'center', color: 'rgba(242,235,220,0.4)', fontSize: 14 }}>
                  Gratuit
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(242,235,220,0.3)', fontSize: 12, marginTop: 32 }}>
          Paiement sécurisé par Stripe · Sans engagement · Annulation en un clic
        </p>
      </div>
    </div>
  )
}
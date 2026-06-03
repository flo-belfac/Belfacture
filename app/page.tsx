'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  const Logo = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <style>{`
        @keyframes docFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
        @keyframes line1{0%{stroke-dashoffset:14}100%{stroke-dashoffset:0}}
        @keyframes line2{0%{stroke-dashoffset:10}100%{stroke-dashoffset:0}}
        @keyframes line3{0%{stroke-dashoffset:7}100%{stroke-dashoffset:0}}
        .doc-wrap{animation:docFloat 3s ease-in-out infinite;}
        .l1{stroke-dasharray:14;stroke-dashoffset:0;animation:line1 1.2s ease-out .2s both;}
        .l2{stroke-dasharray:10;stroke-dashoffset:0;animation:line2 1.2s ease-out .5s both;}
        .l3{stroke-dasharray:7;stroke-dashoffset:0;animation:line3 1.2s ease-out .8s both;}
      `}</style>
      <g className="doc-wrap">
        <rect x="4" y="2" width="22" height="28" rx="4" fill="#3b82f6"/>
        <rect x="4" y="2" width="22" height="28" rx="4" fill="url(#dg2)" opacity=".3"/>
        <path d="M22 2v6h6" stroke="#93c5fd" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <rect x="22" y="2" width="6" height="6" rx="0" fill="#60a5fa" opacity=".7"/>
        <line x1="10" y1="16" x2="24" y2="16" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" className="l1"/>
        <line x1="10" y1="21" x2="20" y2="21" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" className="l2"/>
        <line x1="10" y1="26" x2="17" y2="26" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" className="l3"/>
        <defs>
          <linearGradient id="dg2" x1="4" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </g>
    </svg>
  )

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await supabase.from('waitlist').insert([{ email }])
    setSubmitted(true)
    setSending(false)
  }

  return (
    <>
      <style>{`
        :root{--bg:#0d1117;--bg-2:#111820;--surface:#1e2736;--line:#1e3a5f;--text:#e8f0fe;--muted:#7a92b0;--accent:#3b82f6;--ink:#0d1117;}
        body{background:var(--bg);color:var(--text);font-family:'Figtree',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
        .display{font-family:'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:-0.01em;line-height:1.0;}
        .display-light{font-family:'Instrument Serif',serif;font-weight:400;}
        .italic-accent{font-style:italic;color:var(--accent);font-family:'Instrument Serif',serif;}
        .accent{color:var(--accent);}
        .eyebrow{font-family:'Figtree',sans-serif;font-weight:600;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);}
        .grain{background-image:radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px);background-size:4px 4px;}
        .btn-primary{background:var(--accent);color:var(--ink);font-weight:700;border-radius:13px;padding:14px 22px;display:inline-block;transition:transform .2s,filter .2s;}
        .btn-primary:hover{filter:brightness(1.1);transform:translateY(-2px);}
        .btn-ghost{color:var(--text);border:1.5px solid var(--line);background:transparent;border-radius:13px;padding:13px 22px;display:inline-block;transition:all .2s;}
        .btn-ghost:hover{border-color:var(--accent);}
        .btn-on-accent{background:var(--ink);color:var(--text);font-weight:600;border-radius:13px;padding:14px 22px;display:inline-block;transition:transform .2s;border:none;cursor:pointer;font-family:'Figtree',sans-serif;font-size:15px;}
        .btn-on-accent:hover{transform:translateY(-2px);}
        .card{background:var(--surface);border:1.5px solid var(--line);border-radius:18px;transition:transform .2s,border-color .2s;}
        .card:hover{transform:translateY(-3px);border-color:var(--accent);}
        .card-pop{background:var(--accent);color:var(--ink);border-radius:18px;}
        .check{width:20px;height:20px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;background:rgba(219,110,68,.18);color:var(--accent);font-size:12px;flex-shrink:0;font-weight:700;}
        .check-ink{width:20px;height:20px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;background:rgba(21,17,13,.18);color:var(--ink);font-size:12px;flex-shrink:0;font-weight:700;}
        .rule{height:1.5px;background:var(--line);}
        details>summary{list-style:none;cursor:pointer;}
        details>summary::-webkit-details-marker{display:none;}
        details[open] .plus{transform:rotate(45deg);}
        .plus{transition:transform .2s;display:inline-block;}
        @keyframes rise{to{opacity:1;transform:none;}}
        .rise{opacity:0;transform:translateY(10px);animation:rise .7s cubic-bezier(.2,.7,.2,1) forwards;}
        .d1{animation-delay:.05s;}.d2{animation-delay:.13s;}.d3{animation-delay:.21s;}.d4{animation-delay:.29s;}
        .tag{background:rgba(219,110,68,.13);color:var(--accent);border-radius:999px;padding:5px 13px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:8px;}
        .pulse{width:7px;height:7px;border-radius:999px;background:var(--accent);animation:pulse 2.2s infinite;}
        @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(219,110,68,.5);}70%{box-shadow:0 0 0 8px rgba(219,110,68,0);}100%{box-shadow:0 0 0 0 rgba(219,110,68,0);}}
        .logo-b{position:relative;display:inline-flex;align-items:center;justify-content:center;background:var(--accent);}
        .logo-b .core{width:7px;height:7px;border-radius:999px;background:#f4eddd;position:relative;z-index:2;}
        .logo-b .ring{position:absolute;width:9px;height:9px;border-radius:999px;border:1.5px solid #f4eddd;animation:ripple 2.4s ease-out infinite;}
        .logo-b .ring:nth-child(2){animation-delay:1.2s;}
        @keyframes ripple{0%{transform:scale(.6);opacity:.85;}100%{transform:scale(2.8);opacity:0;}}
        .wl-input:focus{border-color:var(--ink) !important;outline:none;}
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-30" style={{ background: 'rgba(21,17,13,.8)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="display text-2xl">BelFacture</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--muted)' }}>
            <a href="#aujourdhui" className="hover:text-white transition">Le produit</a>
            <a href="#roadmap" className="hover:text-white transition">Peppol</a>
            <a href="#tarifs" className="hover:text-white transition">Tarifs</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium px-3 py-2" style={{ color: 'var(--muted)' }}>Se connecter</Link>
            <Link href="/login" className="btn-primary text-sm">S'inscrire</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-24 lg:pt-28 lg:pb-36 relative">
          <div className="tag rise d1"><span className="pulse" /> Obligatoire en Belgique depuis janvier 2026</div>
          <h1 className="display mt-7 rise d2" style={{ fontSize: 'clamp(58px,11vw,134px)' }}>
            Vos factures,<br /><span className="italic-accent">prêtes</span> pour Peppol.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed rise d3" style={{ color: 'var(--muted)' }}>
            Créez vos factures, gérez vos clients, suivez vos devis et acomptes. L&apos;envoi automatique sur le réseau Peppol arrive bientôt — verrouillez votre tarif anticipé dès aujourd&apos;hui.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 rise d4">
            <a href="#waitlist" className="btn-primary">Réserver mon accès anticipé →</a>
            <a href="#aujourdhui" className="btn-ghost">Voir le produit</a>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* CONTEXTE */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="eyebrow">Le contexte</div>
            <h2 className="display mt-4" style={{ fontSize: 'clamp(42px,5.5vw,70px)' }}>Le compte à rebours <span className="italic-accent">a commencé.</span></h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-xl leading-relaxed">
              Depuis le 1<sup>er</sup> janvier 2026, toute facture B2B entre entreprises belges assujetties à la TVA doit transiter par <span className="accent" style={{ fontWeight: 600 }}>Peppol</span>, le réseau électronique européen.
            </p>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
              Le PDF par email ne suffit plus. La règle s&apos;applique même aux indépendants sous franchise de TVA.
            </p>
            <p className="mt-7 text-sm" style={{ color: 'var(--muted)' }}>
              Les obligations exactes sont fixées par le SPF Finances. BelFacture est en cours d&apos;intégration avec un Access Point Peppol agréé.
            </p>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* DISPONIBLE */}
      <section id="aujourdhui" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="eyebrow">Disponible aujourd&apos;hui</div>
              <h2 className="display mt-4" style={{ fontSize: 'clamp(44px,6.5vw,76px)' }}>Démarrez <span className="italic-accent">sans attendre.</span></h2>
            </div>
            <p className="max-w-md text-base leading-relaxed" style={{ color: 'var(--muted)' }}>Toutes les fondations sont prêtes. Vous organisez vos clients dès aujourd&apos;hui — Peppol viendra se greffer dessus.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {[
              { i: '📄', t: 'Factures PDF pro', d: 'Génération de factures au format européen avec vos coordonnées légales belges.' },
              { i: '📋', t: 'Devis & acomptes', d: 'Acomptes progressifs (30/30/40 ou personnalisés). Transformez chaque acompte en facture en un clic.' },
              { i: '👥', t: 'Gestion clients', d: 'Centralisez vos clients, leurs coordonnées et leur historique. Recherche instantanée.' },
              { i: '🔐', t: 'Données sécurisées', d: 'Authentification chiffrée, base de données européenne (Supabase). Vos données restent vos données.' },
              { i: '⚡', t: 'Rapide, partout', d: 'Application web responsive. Créez une facture depuis votre téléphone entre deux rendez-vous.' },
              { i: '🏛️', t: 'Pensé pour la Belgique', d: "Mentions TVA, numéros d'entreprise, IBAN au format belge. Pas une app US traduite." },
            ].map((f) => (
              <div key={f.t} className="card p-7">
                <div className="text-3xl">{f.i}</div>
                <div className="display-light text-3xl mt-4">{f.t}</div>
                <p className="mt-3 leading-relaxed text-sm" style={{ color: 'var(--muted)' }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ROADMAP */}
      <section id="roadmap" className="py-24 lg:py-32" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="tag"><span className="pulse" /> En route — accès anticipé</div>
          <h2 className="display mt-5" style={{ fontSize: 'clamp(44px,6.5vw,76px)' }}>Vers la conformité <span className="italic-accent">totale.</span></h2>
          <p className="mt-5 text-lg leading-relaxed max-w-xl" style={{ color: 'var(--muted)' }}>Voici la feuille de route. Les inscrits en accès anticipé seront activés en priorité, sans rien à faire.</p>

          <div className="mt-14 relative">
            <div style={{ position: 'absolute', left: 19, top: 8, bottom: 8, width: 2, background: 'var(--line)' }} />
            {[
              { n: '1', tag: 'Envoi automatique', t: 'Connexion Peppol', d: 'Vos factures transmises automatiquement en UBL BIS 3.0 via un Access Point belge agréé.', status: 'En intégration', active: true },
              { n: '2', tag: 'Réception', t: 'Boîte Peppol entrante', d: 'Recevez les factures de vos fournisseurs directement dans BelFacture.', status: 'Bientôt', active: false },
              { n: '3', tag: 'Multi-taux', t: 'TVA 0 · 6 · 12 · 21', d: 'Tous les taux belges et régimes spéciaux calculés et codifiés correctement.', status: 'Bientôt', active: false },
              { n: '4', tag: 'Légal', t: 'Numérotation séquentielle', d: 'Numérotation continue, conforme à la loi, avec archivage légal sur la durée requise.', status: 'Planifié', active: false },
            ].map((s, i, arr) => (
              <div key={s.n} className="relative flex gap-5" style={{ paddingBottom: i === arr.length - 1 ? 0 : 40 }}>
                <div className="display-light shrink-0 grid place-items-center" style={{ width: 40, height: 40, borderRadius: 12, fontSize: 18, zIndex: 1, background: s.active ? 'var(--accent)' : 'var(--surface)', color: s.active ? 'var(--ink)' : 'var(--muted)', border: s.active ? 'none' : '1.5px solid var(--line)' }}>
                  {s.n}
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="eyebrow accent">{s.tag}</span>
                    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 600, borderRadius: 999, padding: '3px 10px', background: s.active ? 'rgba(219,110,68,.14)' : 'var(--surface)', color: s.active ? 'var(--accent)' : 'var(--muted)', border: s.active ? 'none' : '1px solid var(--line)' }}>
                      {s.active && <span className="pulse" style={{ width: 6, height: 6 }} />}
                      {s.status}
                    </span>
                  </div>
                  <div className="display-light text-3xl mt-1.5">{s.t}</div>
                  <p className="mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* TARIFS */}
      <section id="tarifs" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="eyebrow">Tarifs</div>
            <h2 className="display mt-4" style={{ fontSize: 'clamp(44px,6.5vw,76px)' }}>Tarif simple, <span className="italic-accent">tarif honnête.</span></h2>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>Tarif anticipé verrouillé à vie pour les inscrits avant l&apos;activation publique de l&apos;envoi Peppol.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-14 items-stretch">
            <div className="card p-8 flex flex-col">
              <div className="eyebrow">Découverte</div>
              <div className="display mt-2 text-6xl">0€</div>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Pour tester sans engagement</p>
              <Link href="/login" className="btn-ghost text-sm mt-6 text-center">Créer un compte</Link>
              <ul className="space-y-3 mt-8 text-sm" style={{ color: 'var(--muted)' }}>
                <li className="flex gap-3 items-center"><span className="check">✓</span> 5 factures PDF par mois</li>
                <li className="flex gap-3 items-center"><span className="check">✓</span> Gestion clients basique</li>
                <li className="flex gap-3 items-center"><span className="check">✓</span> Mentions légales belges</li>
                <li className="flex gap-3 items-center opacity-50"><span className="check">—</span> Pas d&apos;envoi Peppol</li>
              </ul>
            </div>
            <div className="card-pop p-8 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="eyebrow" style={{ color: 'var(--ink)' }}>Solo</div>
                <span style={{ background: 'var(--ink)', color: 'var(--accent)', borderRadius: 999, padding: '4px 11px', fontSize: 11, fontWeight: 600 }}>Le plus populaire</span>
              </div>
              <div className="display mt-2 text-6xl">12€<span className="text-xl" style={{ opacity: .7 }}>/mois</span></div>
              <p className="text-sm mt-1" style={{ opacity: .8 }}>Verrouillé à vie pour les inscrits anticipés</p>
              <a href="#waitlist" className="btn-on-accent text-sm mt-6 text-center" style={{ borderRadius: 13 }}>Réserver mon accès</a>
              <ul className="space-y-3 mt-8 text-sm">
                <li className="flex gap-3 items-center"><span className="check-ink">✓</span> Factures &amp; devis PDF illimités</li>
                <li className="flex gap-3 items-center"><span className="check-ink">✓</span> Acomptes progressifs</li>
                <li className="flex gap-3 items-center"><span className="check-ink">✓</span> Tous les taux de TVA</li>
                <li className="flex gap-3 items-center"><span className="check-ink">✓</span> <strong>30 envois Peppol/mois</strong></li>
                <li className="flex gap-3 items-center"><span className="check-ink">✓</span> Support email réactif</li>
              </ul>
            </div>
            <div className="card p-8 flex flex-col">
              <div className="eyebrow">Pro</div>
              <div className="display mt-2 text-6xl">24€<span className="text-xl" style={{ color: 'var(--muted)' }}>/mois</span></div>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Indépendants actifs &amp; TPE</p>
              <a href="#waitlist" className="btn-ghost text-sm mt-6 text-center">Réserver mon accès</a>
              <ul className="space-y-3 mt-8 text-sm" style={{ color: 'var(--muted)' }}>
                <li className="flex gap-3 items-center"><span className="check">✓</span> Tout Solo, en illimité</li>
                <li className="flex gap-3 items-center"><span className="check">✓</span> <strong style={{ color: 'var(--text)' }}>150 envois Peppol/mois</strong></li>
                <li className="flex gap-3 items-center"><span className="check">✓</span> Réception Peppol entrante</li>
                <li className="flex gap-3 items-center"><span className="check">✓</span> Statistiques &amp; export comptable</li>
                <li className="flex gap-3 items-center"><span className="check">✓</span> Multi-utilisateurs (jusqu&apos;à 3)</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>Au-delà du volume inclus, chaque envoi Peppol supplémentaire est facturé 0,30 €. Sans engagement, annulation en un clic.</p>
        </div>
      </section>

      <div className="rule" />

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="eyebrow">FAQ</div>
            <h2 className="display mt-4" style={{ fontSize: 'clamp(42px,5.5vw,68px)' }}>Questions <span className="italic-accent">fréquentes.</span></h2>
          </div>
          <div className="mt-12 space-y-3">
            {[
              { q: "C'est quoi Peppol, concrètement ?", a: "Peppol est le réseau officiel européen de facturation électronique. En Belgique, depuis janvier 2026, toute facture B2B entre assujettis à la TVA doit transiter par ce réseau au format UBL, et non plus en simple PDF par email." },
              { q: "Quand l'envoi Peppol sera-t-il disponible ?", a: "L'intégration est en cours avec un Access Point belge agréé. Les inscrits en accès anticipé recevront un email dès l'activation — leur abonnement bascule automatiquement sans rien à faire." },
              { q: "Pourquoi m'inscrire maintenant ?", a: "Vous verrouillez le tarif anticipé à vie, vous utilisez dès aujourd'hui le générateur de factures et devis, et le jour où Peppol s'active votre compte est déjà prêt." },
              { q: "Et si je dépasse mon volume mensuel ?", a: "Pas de blocage. Au-delà du volume inclus, chaque envoi supplémentaire est facturé 0,30 €. Vous pouvez aussi passer à un palier supérieur." },
              { q: "Je peux annuler quand je veux ?", a: "Oui, sans frais et sans engagement. Vous annulez en un clic depuis votre profil." },
            ].map((item) => (
              <details key={item.q} className="card p-6">
                <summary className="flex items-center justify-between gap-4">
                  <span className="display-light text-2xl">{item.q}</span>
                  <span className="plus text-2xl accent">+</span>
                </summary>
                <p className="mt-4 leading-relaxed text-sm" style={{ color: 'var(--muted)' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="py-24 lg:py-36 relative overflow-hidden" style={{ background: 'var(--accent)', color: 'var(--ink)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(21,17,13,0.07) 1px,transparent 1px)', backgroundSize: '4px 4px' }} />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative text-center">
          <div className="eyebrow" style={{ color: 'rgba(21,17,13,.6)' }}>Accès anticipé</div>
          <h2 className="display mt-4" style={{ fontSize: 'clamp(46px,7.5vw,90px)' }}>Verrouillez votre tarif. <span style={{ fontStyle: 'italic' }}>À vie.</span></h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: 'rgba(21,17,13,.8)' }}>
            Inscrivez-vous maintenant : vous utilisez BelFacture dès aujourd&apos;hui, et l&apos;envoi Peppol s&apos;activera automatiquement le jour du lancement.
          </p>
          {submitted ? (
            <div className="mt-10 display text-3xl">Inscrit ✓ On vous contacte dès l&apos;activation !</div>
          ) : (
            <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleWaitlist}>
              <input
                required type="email"
                placeholder="votre@email.be"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="wl-input flex-1 rounded-xl px-5 py-4"
                style={{ background: 'rgba(21,17,13,.07)', border: '1.5px solid rgba(21,17,13,.28)', color: 'var(--ink)', fontFamily: "'Figtree',sans-serif", fontSize: 15 }}
              />
              <button type="submit" className="btn-on-accent" disabled={sending}>
                {sending ? '⏳ Envoi...' : 'Réserver ma place →'}
              </button>
            </form>
          )}
          <p className="text-xs mt-5" style={{ color: 'rgba(21,17,13,.6)' }}>Pas de spam. Un email à l&apos;activation, c&apos;est tout.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1.5px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-10 text-sm" style={{ color: 'var(--muted)' }}>
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="display text-xl" style={{ color: 'var(--text)' }}>BelFacture</span>
            </div>
            <p className="mt-4 leading-relaxed">Facturation belge, prête pour Peppol. Fait en Belgique.</p>
          </div>
          <div><div className="eyebrow">Produit</div><ul className="mt-4 space-y-2"><li><a href="#aujourdhui" className="hover:text-white">Fonctionnalités</a></li><li><a href="#roadmap" className="hover:text-white">Roadmap Peppol</a></li><li><a href="#tarifs" className="hover:text-white">Tarifs</a></li></ul></div>
          <div><div className="eyebrow">Ressources</div><ul className="mt-4 space-y-2"><li><a href="#faq" className="hover:text-white">FAQ</a></li></ul></div>
          <div><div className="eyebrow">Légal</div><ul className="mt-4 space-y-2"><li><a href="/conditions" className="hover:text-white">Conditions</a></li><li><a href="/confidentialite" className="hover:text-white">Confidentialité</a></li><li><a href="/mentions-legales" className="hover:text-white">Mentions légales</a></li></ul></div>
        </div>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-10 text-xs" style={{ color: 'var(--muted)' }}>
          BelFacture · 2026 · Les informations légales sont indicatives. Pour les obligations exactes, consultez le SPF Finances.
        </div>
      </footer>
    </>
  )
}
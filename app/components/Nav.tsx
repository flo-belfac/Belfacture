'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

function LogoDoc({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <rect x="4" y="2" width="22" height="28" rx="4" fill="url(#dg)" opacity=".3"/>
        <path d="M22 2v6h6" stroke="#93c5fd" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <rect x="22" y="2" width="6" height="6" rx="0 4 0 0" fill="#60a5fa" opacity=".7"/>
        <line x1="10" y1="16" x2="24" y2="16" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" className="l1"/>
        <line x1="10" y1="21" x2="20" y2="21" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" className="l2"/>
        <line x1="10" y1="26" x2="17" y2="26" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" className="l3"/>
        <defs>
          <linearGradient id="dg" x1="4" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </g>
    </svg>
  )
}

export default function Nav() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const pathname = usePathname()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const liens = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clients', label: 'Clients' },
    { href: '/factures', label: 'Factures' },
    { href: '/devis', label: 'Devis' },
    { href: '/abonnement', label: '⭐ Abonnement' },
    { href: '/parametres', label: '⚙️ Paramètres' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <style>{`
        .logo-b{position:relative;display:inline-flex;align-items:center;justify-content:center;background:#3b82f6;}
        .logo-b .core{width:7px;height:7px;border-radius:999px;background:#f4eddd;position:relative;z-index:2;}
        .logo-b .ring{position:absolute;width:9px;height:9px;border-radius:999px;border:1.5px solid #f4eddd;animation:ripple 2.4s ease-out infinite;}
        .logo-b .ring:nth-child(2){animation-delay:1.2s;}
        @keyframes ripple{0%{transform:scale(.6);opacity:.85;}100%{transform:scale(2.8);opacity:0;}}
        .nav-desktop{display:flex;gap:4px;align-items:center;}
        .nav-ham{display:none !important;background:none;border:1.5px solid rgba(59,130,246,0.3);border-radius:9px;color:#3b82f6;width:40px;height:40px;cursor:pointer;font-size:20px;align-items:center;justify-content:center;flex-shrink:0;}
        .nav-mobile{position:absolute;top:60px;left:0;right:0;background:rgba(13,17,23,0.98);backdrop-filter:blur(20px);border-bottom:1px solid rgba(59,130,246,0.15);padding:10px 16px 16px;z-index:99;}
        .nav-mob-link{display:block;padding:12px 16px;border-radius:10px;text-decoration:none;font-family:'Figtree',sans-serif;font-size:15px;font-weight:500;margin-bottom:4px;transition:background .15s;}
        @media(max-width:768px){
          .nav-desktop{display:none !important;}
          .nav-ham{display:inline-flex !important;}
        }
      `}</style>

      <nav style={{ background: 'rgba(13,17,23,.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(219,110,68,.12)', padding: '0 24px', height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoDoc size={36} />
          <span style={{ fontFamily: "'Instrument Serif',serif", color: '#e8f0fe', fontSize: 22, fontWeight: 400 }}>BelFacture</span>
        </Link>

        {/* Desktop */}
        <div className="nav-desktop">
          {liens.map(l => (
            <a key={l.href} href={l.href} style={{
              color: isActive(l.href) ? '#3b82f6' : 'rgba(242,235,220,0.5)',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              padding: '7px 14px', borderRadius: 9, fontFamily: "'Figtree',sans-serif",
              background: isActive(l.href) ? 'rgba(59,130,246,0.12)' : 'transparent',
            }}>{l.label}</a>
          ))}
          <button onClick={handleLogout} style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.25)', borderRadius: 9, color: '#3b82f6', padding: '7px 14px', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Figtree',sans-serif", marginLeft: 6 }}>
            Déconnexion
          </button>
        </div>

        {/* Hamburger */}
        <button className="nav-ham" onClick={() => setMenuOuvert(!menuOuvert)}>
          {menuOuvert ? '✕' : '☰'}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="nav-mobile">
          {liens.map(l => (
            <a key={l.href} href={l.href} className="nav-mob-link"
              onClick={() => setMenuOuvert(false)}
              style={{
                color: isActive(l.href) ? '#3b82f6' : 'rgba(242,235,220,0.75)',
                background: isActive(l.href) ? 'rgba(219,110,68,0.1)' : 'transparent',
              }}>
              {l.label}
            </a>
          ))}
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', background: 'rgba(240,138,99,.08)', border: '1px solid rgba(240,138,99,.2)', borderRadius: 10, color: '#3b82f6', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'Figtree',sans-serif", marginTop: 4 }}>
            Déconnexion
          </button>
        </div>
      )}
    </>
  )
}
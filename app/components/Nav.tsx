'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

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
    { href: '/parametres', label: '⚙️ Paramètres' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <style>{`
        .logo-b{position:relative;display:inline-flex;align-items:center;justify-content:center;background:#db6e44;}
        .logo-b .core{width:7px;height:7px;border-radius:999px;background:#f4eddd;position:relative;z-index:2;}
        .logo-b .ring{position:absolute;width:9px;height:9px;border-radius:999px;border:1.5px solid #f4eddd;animation:ripple 2.4s ease-out infinite;}
        .logo-b .ring:nth-child(2){animation-delay:1.2s;}
        @keyframes ripple{0%{transform:scale(.6);opacity:.85;}100%{transform:scale(2.8);opacity:0;}}
        .nav-desktop{display:flex;gap:4px;align-items:center;}
        .nav-ham{display:none !important;background:none;border:1.5px solid rgba(219,110,68,0.3);border-radius:9px;color:#db6e44;width:40px;height:40px;cursor:pointer;font-size:20px;align-items:center;justify-content:center;flex-shrink:0;}
        .nav-mobile{position:absolute;top:60px;left:0;right:0;background:rgba(21,17,13,0.98);backdrop-filter:blur(20px);border-bottom:1px solid rgba(219,110,68,0.15);padding:10px 16px 16px;z-index:99;}
        .nav-mob-link{display:block;padding:12px 16px;border-radius:10px;text-decoration:none;font-family:'Figtree',sans-serif;font-size:15px;font-weight:500;margin-bottom:4px;transition:background .15s;}
        @media(max-width:768px){
          .nav-desktop{display:none !important;}
          .nav-ham{display:inline-flex !important;}
        }
      `}</style>

      <nav style={{ background: 'rgba(21,17,13,.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(219,110,68,.12)', padding: '0 24px', height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span className="logo-b" style={{ width: 36, height: 36, borderRadius: 11 }}>
            <span className="ring" /><span className="ring" />
            <span className="core" />
          </span>
          <span style={{ fontFamily: "'Instrument Serif',serif", color: '#f2ebdc', fontSize: 22, fontWeight: 400 }}>BelFacture</span>
        </Link>

        {/* Desktop */}
        <div className="nav-desktop">
          {liens.map(l => (
            <a key={l.href} href={l.href} style={{
              color: isActive(l.href) ? '#db6e44' : 'rgba(242,235,220,0.5)',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              padding: '7px 14px', borderRadius: 9, fontFamily: "'Figtree',sans-serif",
              background: isActive(l.href) ? 'rgba(219,110,68,0.12)' : 'transparent',
            }}>{l.label}</a>
          ))}
          <button onClick={handleLogout} style={{ background: 'rgba(240,138,99,.1)', border: '1px solid rgba(240,138,99,.25)', borderRadius: 9, color: '#f08a63', padding: '7px 14px', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Figtree',sans-serif", marginLeft: 6 }}>
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
                color: isActive(l.href) ? '#db6e44' : 'rgba(242,235,220,0.75)',
                background: isActive(l.href) ? 'rgba(219,110,68,0.1)' : 'transparent',
              }}>
              {l.label}
            </a>
          ))}
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', background: 'rgba(240,138,99,.08)', border: '1px solid rgba(240,138,99,.2)', borderRadius: 10, color: '#f08a63', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'Figtree',sans-serif", marginTop: 4 }}>
            Déconnexion
          </button>
        </div>
      )}
    </>
  )
}
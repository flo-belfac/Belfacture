'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Logo = ({ size = 32 }) => (
  <span style={{ width: size, height: size, borderRadius: size * 0.3, background: '#db6e44', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span className="ring" /><span className="ring" style={{ animationDelay: '1.2s' }} />
    <span className="core" />
  </span>
)

const inp = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', color: '#f2ebdc',
  fontSize: '15px', outline: 'none',
  boxSizing: 'border-box' as const,
  fontFamily: "'Figtree', sans-serif",
}

const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  color: 'rgba(242,235,220,0.45)', marginBottom: '6px',
}

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [tva, setTva] = useState('')
  const [peppol, setPeppol] = useState('')
  const [adresse, setAdresse] = useState('')
  const [message, setMessage] = useState('')
  const [clientEnEdition, setClientEnEdition] = useState<any>(null)

  useEffect(() => { chargerClients() }, [])

  async function chargerClients() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data } = await supabase.from('clients').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setClients(data || [])
  }

  function viderFormulaire() {
    setNom(''); setEmail(''); setTva(''); setPeppol(''); setAdresse('')
    setClientEnEdition(null)
  }

  function chargerPourEdition(client: any) {
    setClientEnEdition(client)
    setNom(client.nom || '')
    setEmail(client.email || '')
    setTva(client.numero_tva || '')
    setPeppol(client.identifiant_peppol || '')
    setAdresse(client.adresse || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function ajouterClient() {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('clients').insert([{
      nom, email, numero_tva: tva, identifiant_peppol: peppol, adresse, user_id: user.id
    }])
    if (error) { setMessage('Erreur : ' + error.message) }
    else { setMessage('Client ajouté ✅'); viderFormulaire(); chargerClients() }
  }

  async function modifierClient() {
    const { error } = await supabase.from('clients').update({
      nom, email, numero_tva: tva, identifiant_peppol: peppol, adresse
    }).eq('id', clientEnEdition.id)
    if (error) { setMessage('Erreur : ' + error.message) }
    else { setMessage('Client modifié ✅'); viderFormulaire(); chargerClients() }
  }

  async function supprimerClient(clientId: string) {
    if (!confirm('Supprimer ce client ? Ses factures ne seront pas supprimées.')) return
    await supabase.from('clients').delete().eq('id', clientId)
    chargerClients()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const navLink = (href: string, label: string, active = false) => (
    <a href={href} style={{
      color: active ? '#db6e44' : 'rgba(242,235,220,0.5)',
      textDecoration: 'none', fontSize: '14px', fontWeight: 500,
      padding: '7px 14px', borderRadius: '9px',
      background: active ? 'rgba(219,110,68,0.12)' : 'transparent',
      fontFamily: "'Figtree', sans-serif",
    }}>{label}</a>
  )

  const modeEdition = !!clientEnEdition

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12 0%, #15110d 55%)', fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .core{width:7px;height:7px;border-radius:999px;background:#f4eddd;position:relative;z-index:2;}
        .ring{position:absolute;width:9px;height:9px;border-radius:999px;border:1.5px solid #f4eddd;animation:ripple 2.4s ease-out infinite;}
        @keyframes ripple{0%{transform:scale(.6);opacity:.85;}100%{transform:scale(2.8);opacity:0;}}
        .c-inp:focus{border-color:#db6e44 !important;}
        .c-row{border-bottom:1px solid rgba(219,110,68,0.08);padding:14px 8px;display:flex;align-items:center;gap:16px;border-radius:10px;transition:background .15s;}
        .c-row:hover{background:rgba(219,110,68,0.05);}
        .edit-btn{background:rgba(219,110,68,0.1);border:1px solid rgba(219,110,68,0.25);border-radius:8px;color:#db6e44;padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;transition:all .15s;}
        .edit-btn:hover{background:rgba(219,110,68,0.2);}
        .del-btn{background:rgba(240,138,99,0.08);border:1px solid rgba(240,138,99,0.2);border-radius:8px;color:#f08a63;padding:5px 8px;font-size:12px;cursor:pointer;font-family:'Figtree',sans-serif;transition:all .15s;margin-left:4px;}
        .del-btn:hover{background:rgba(240,138,99,0.2);}
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(21,17,13,.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(219,110,68,.12)', padding: '0 32px', height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Logo /><span style={{ fontFamily: "'Instrument Serif',serif", color: '#f2ebdc', fontSize: 22, fontWeight: 400 }}>BelFacture</span>
        </a>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navLink('/dashboard', 'Dashboard')}
          {navLink('/clients', 'Clients', true)}
          {navLink('/factures', 'Factures')}
          {navLink('/devis', 'Devis')}
          {navLink('/parametres', '⚙️ Paramètres')}
          <button onClick={handleLogout} style={{ background: 'rgba(240,138,99,.1)', border: '1px solid rgba(240,138,99,.25)', borderRadius: 9, color: '#f08a63', padding: '7px 14px', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Figtree',sans-serif", marginLeft: 6 }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: '#f2ebdc', margin: '0 0 40px', letterSpacing: '-0.01em' }}>
          Mes clients
        </h1>

        {/* Formulaire ajouter / modifier */}
        <div style={{
          background: modeEdition ? 'rgba(219,110,68,0.07)' : 'rgba(33,26,19,0.6)',
          backdropFilter: 'blur(20px)',
          border: modeEdition ? '1.5px solid rgba(219,110,68,0.4)' : '1px solid rgba(219,110,68,0.15)',
          borderRadius: 20, padding: 28, marginBottom: 20,
          transition: 'all .2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <h3 style={{ color: '#db6e44', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
              {modeEdition ? '✏️ Modifier — ' + clientEnEdition.nom : 'Ajouter un client'}
            </h3>
            {modeEdition && (
              <button onClick={viderFormulaire} style={{ background: 'none', border: '1px solid rgba(242,235,220,0.2)', borderRadius: 8, color: 'rgba(242,235,220,0.5)', padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
                Annuler
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <span style={lbl}>Nom de l&apos;entreprise</span>
              <input className="c-inp" style={inp} placeholder="Dupont Consulting" value={nom} onChange={e => setNom(e.target.value)} />
            </div>
            <div>
              <span style={lbl}>Email</span>
              <input className="c-inp" style={inp} placeholder="contact@dupont.be" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <span style={lbl}>Numéro de TVA</span>
              <input className="c-inp" style={inp} placeholder="BE0123456789" value={tva} onChange={e => setTva(e.target.value)} />
            </div>
            <div>
              <span style={lbl}>Identifiant Peppol</span>
              <input className="c-inp" style={inp} placeholder="0208:0123456789" value={peppol} onChange={e => setPeppol(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <span style={lbl}>Adresse</span>
            <input className="c-inp" style={inp} placeholder="Rue de la Loi 16, 1000 Bruxelles" value={adresse} onChange={e => setAdresse(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={modeEdition ? modifierClient : ajouterClient}
              style={{ padding: '13px 24px', background: '#db6e44', border: 'none', borderRadius: 12, color: '#15110d', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(219,110,68,.3)', fontFamily: "'Figtree',sans-serif" }}
            >
              {modeEdition ? '💾 Enregistrer les modifications' : '+ Ajouter le client'}
            </button>
          </div>

          {message && <p style={{ marginTop: 12, color: message.includes('Erreur') ? '#f08a63' : '#7ed3a8', fontSize: 14 }}>{message}</p>}
        </div>

        {/* Liste */}
        <div style={{ background: 'rgba(33,26,19,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(219,110,68,0.15)', borderRadius: 20, padding: 28 }}>
          <h3 style={{ color: '#db6e44', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 22px' }}>
            Liste des clients ({clients.length})
          </h3>

          {clients.length === 0 ? (
            <p style={{ color: 'rgba(242,235,220,.3)', textAlign: 'center', padding: 32 }}>Aucun client pour le moment</p>
          ) : clients.map(client => (
            <div key={client.id} className="c-row">
              <div style={{ background: 'rgba(219,110,68,.12)', border: '1px solid rgba(219,110,68,.22)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#f2ebdc', fontWeight: 700, margin: '0 0 3px', fontSize: 15 }}>{client.nom}</p>
                <p style={{ color: 'rgba(242,235,220,.4)', margin: 0, fontSize: 13 }}>
                  {client.email}
                  {client.numero_tva && <span style={{ marginLeft: 8, background: 'rgba(219,110,68,.12)', color: '#db6e44', padding: '1px 7px', borderRadius: 5, fontSize: 12 }}>{client.numero_tva}</span>}
                  {client.identifiant_peppol && <span style={{ marginLeft: 6, background: 'rgba(158,184,224,.1)', color: '#9eb8e0', padding: '1px 7px', borderRadius: 5, fontSize: 12 }}>Peppol ✓</span>}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button className="edit-btn" onClick={() => chargerPourEdition(client)}>✏️ Modifier</button>
                <button className="del-btn" onClick={() => supprimerClient(client.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
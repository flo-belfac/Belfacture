'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'

const BG = 'radial-gradient(120% 90% at 30% 0%, #111820 0%, #0d1117 55%)'
const BLUE = '#3b82f6'

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(59,130,246,0.05)',
  border: '1.5px solid rgba(59,130,246,0.15)',
  borderRadius: '12px', color: '#e8f0fe',
  fontSize: '15px', outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Figtree', sans-serif",
  transition: 'border-color .2s',
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: 'rgba(232,240,254,0.5)', marginBottom: '8px',
}

const card: React.CSSProperties = {
  background: 'rgba(30,39,54,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1.5px solid rgba(59,130,246,0.12)',
  borderRadius: 20, padding: 28, marginBottom: 20,
}

const section: React.CSSProperties = {
  borderBottom: '1px solid rgba(59,130,246,0.08)',
  paddingBottom: 24, marginBottom: 24,
}

type Tab = 'entreprise' | 'paiement' | 'securite'

export default function Parametres() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('entreprise')
  const [form, setForm] = useState({
    nom_entreprise: '', numero_tva: '', numero_entreprise: '',
    identifiant_peppol: '', iban: '', bic: '',
    adresse_rue: '', code_postal: '', ville: '', pays: 'BE',
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [secMsg, setSecMsg] = useState('')
  const [changingPass, setChangingPass] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUserEmail(user.email || '')
      const { data } = await supabase.from('parametres_entreprise').select('*').eq('user_id', user.id).single()
      if (data) setForm(f => ({ ...f, ...data }))
      setLoading(false)
    }
    load()
  }, [])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('parametres_entreprise').upsert({ ...form, user_id: user.id }, { onConflict: 'user_id' })
    setSaving(false)
    if (!error) setSaved(true)
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) { setSecMsg('Au moins 6 caractères.'); return }
    if (newPassword !== confirmPassword) { setSecMsg('Les mots de passe ne correspondent pas.'); return }
    setChangingPass(true); setSecMsg('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSecMsg(error ? 'Erreur : ' + error.message : '✅ Mot de passe modifié !')
    if (!error) { setNewPassword(''); setConfirmPassword('') }
    setChangingPass(false)
  }

  async function handleChangeEmail() {
    if (!newEmail.includes('@')) { setSecMsg('Email invalide.'); return }
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setSecMsg(error ? 'Erreur : ' + error.message : '✅ Lien envoyé à ' + newEmail)
    if (!error) setNewEmail('')
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'entreprise', label: 'Mon entreprise', icon: '🏢' },
    { id: 'paiement', label: 'Paiement & Peppol', icon: '💳' },
    { id: 'securite', label: 'Sécurité', icon: '🔐' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#e8f0fe', fontFamily: "'Figtree', sans-serif" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .par-inp:focus{border-color:${BLUE} !important;box-shadow:0 0 0 3px rgba(59,130,246,.1);}
        .tab-item{padding:10px 18px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;border:none;background:none;font-family:'Figtree',sans-serif;display:flex;align-items:center;gap:8px;transition:all .15s;color:rgba(232,240,254,.5);white-space:nowrap;}
        .tab-item:hover{color:#e8f0fe;background:rgba(59,130,246,.08);}
        .tab-item.active{color:#e8f0fe;background:rgba(59,130,246,.15);border:1.5px solid rgba(59,130,246,.25);}
        .save-btn{width:100%;padding:15px;background:${BLUE};border:none;border-radius:13px;color:#0d1117;font-size:15px;font-weight:700;cursor:pointer;font-family:'Figtree',sans-serif;transition:all .2s;box-shadow:0 8px 24px rgba(59,130,246,.25);}
        .save-btn:hover{filter:brightness(1.1);}
        .save-btn:disabled{opacity:.5;cursor:not-allowed;}
        .sec-btn{padding:12px 20px;background:rgba(59,130,246,.1);border:1.5px solid rgba(59,130,246,.25);border-radius:11px;color:${BLUE};font-size:14px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;transition:all .15s;}
        .sec-btn:hover{background:rgba(59,130,246,.18);}
        @media(max-width:640px){.tabs-row{flex-direction:column;}.tabs-row .tab-item{width:100%;}}
      `}</style>

      <Nav />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", color: '#e8f0fe', fontSize: 48, fontWeight: 400, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Paramètres</h1>
          <p style={{ color: 'rgba(232,240,254,.4)', margin: 0, fontSize: 14 }}>Connecté en tant que <strong style={{ color: 'rgba(232,240,254,.7)' }}>{userEmail}</strong></p>
        </div>

        {/* Onglets */}
        <div className="tabs-row" style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-item${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ONGLET ENTREPRISE */}
        {activeTab === 'entreprise' && (
          <div style={card}>
            <div style={section}>
              <p style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>Identité</p>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <span style={lbl}>Nom de l'entreprise / Prénom Nom</span>
                  <input className="par-inp" style={inp} placeholder="Ex : Dupont Consulting ou Jean Dupont" value={form.nom_entreprise} onChange={e => update('nom_entreprise', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <span style={lbl}>Numéro de TVA</span>
                    <input className="par-inp" style={inp} placeholder="BE0123456789" value={form.numero_tva} onChange={e => update('numero_tva', e.target.value)} />
                  </div>
                  <div>
                    <span style={lbl}>Numéro BCE</span>
                    <input className="par-inp" style={inp} placeholder="0123.456.789" value={form.numero_entreprise} onChange={e => update('numero_entreprise', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>Adresse</p>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <span style={lbl}>Rue et numéro</span>
                  <input className="par-inp" style={inp} placeholder="Rue de la Loi 16" value={form.adresse_rue} onChange={e => update('adresse_rue', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
                  <div>
                    <span style={lbl}>Code postal</span>
                    <input className="par-inp" style={inp} placeholder="1000" value={form.code_postal} onChange={e => update('code_postal', e.target.value)} />
                  </div>
                  <div>
                    <span style={lbl}>Ville</span>
                    <input className="par-inp" style={inp} placeholder="Bruxelles" value={form.ville} onChange={e => update('ville', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Sauvegarde...' : saved ? '✅ Sauvegardé !' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {/* ONGLET PAIEMENT & PEPPOL */}
        {activeTab === 'paiement' && (
          <div style={card}>
            <div style={section}>
              <p style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 8px' }}>Coordonnées bancaires</p>
              <p style={{ color: 'rgba(232,240,254,.4)', fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>Apparaissent sur vos factures PDF pour le paiement par virement.</p>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <span style={lbl}>IBAN</span>
                  <input className="par-inp" style={inp} placeholder="BE68 5390 0754 7034" value={form.iban} onChange={e => update('iban', e.target.value)} />
                </div>
                <div>
                  <span style={lbl}>BIC / SWIFT</span>
                  <input className="par-inp" style={inp} placeholder="TRIOBEBB" value={form.bic} onChange={e => update('bic', e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <p style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 8px' }}>Identifiant Peppol</p>
              <div style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                <p style={{ color: 'rgba(232,240,254,.7)', fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                  Format : <code style={{ background: 'rgba(59,130,246,.15)', color: BLUE, padding: '2px 8px', borderRadius: 6, fontSize: 13 }}>0208:</code> suivi de votre numéro BCE sans points.<br />
                  <span style={{ color: 'rgba(232,240,254,.4)', fontSize: 12 }}>Ex : BCE 0123.456.789 → Peppol 0208:0123456789</span>
                </p>
              </div>
              <div>
                <span style={lbl}>Identifiant Peppol</span>
                <input className="par-inp" style={inp} placeholder="0208:0123456789" value={form.identifiant_peppol} onChange={e => update('identifiant_peppol', e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Sauvegarde...' : saved ? '✅ Sauvegardé !' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {/* ONGLET SÉCURITÉ */}
        {activeTab === 'securite' && (
          <div style={card}>
            <div style={section}>
              <p style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>Mot de passe</p>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <span style={lbl}>Nouveau mot de passe</span>
                  <input className="par-inp" type="password" style={inp} placeholder="Au moins 6 caractères" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div>
                  <span style={lbl}>Confirmer le mot de passe</span>
                  <input className="par-inp" type="password" style={inp} placeholder="Répéter le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <button className="sec-btn" onClick={handleChangePassword} disabled={changingPass} style={{ marginTop: 16 }}>
                {changingPass ? '⏳...' : 'Changer le mot de passe'}
              </button>
            </div>

            <div>
              <p style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 8px' }}>Adresse email</p>
              <p style={{ color: 'rgba(232,240,254,.4)', fontSize: 13, marginBottom: 16 }}>
                Email actuel : <strong style={{ color: 'rgba(232,240,254,.7)' }}>{userEmail}</strong>
              </p>
              <div>
                <span style={lbl}>Nouvelle adresse email</span>
                <input className="par-inp" type="email" style={inp} placeholder="nouvelle@adresse.be" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              </div>
              <p style={{ color: 'rgba(232,240,254,.3)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.5 }}>Un lien de confirmation sera envoyé à la nouvelle adresse.</p>
              <button className="sec-btn" onClick={handleChangeEmail}>Changer l'email</button>
            </div>

            {secMsg && (
              <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: secMsg.includes('Erreur') || secMsg.includes('pas') || secMsg.includes('invalide') ? 'rgba(248,113,113,.08)' : 'rgba(74,222,128,.08)', color: secMsg.includes('Erreur') || secMsg.includes('pas') || secMsg.includes('invalide') ? '#f87171' : '#4ade80', fontSize: 14, fontWeight: 600 }}>
                {secMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'

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

const card = {
  background: 'rgba(33,26,19,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(219,110,68,0.15)',
  borderRadius: 20, padding: 28, marginBottom: 16,
}

export default function Parametres() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    nom_entreprise: '', numero_tva: '', numero_entreprise: '',
    identifiant_peppol: '', iban: '', bic: '',
    adresse_rue: '', code_postal: '', ville: '', pays: 'BE',
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [passMessage, setPassMessage] = useState('')
  const [changingPass, setChangingPass] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data } = await supabase.from('parametres_entreprise').select('*').eq('user_id', user.id).single()
      if (data) setForm(f => ({ ...f, ...data }))
      setLoading(false)
    }
    load()
  }, [])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true); setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('parametres_entreprise').upsert({ ...form, user_id: user.id }, { onConflict: 'user_id' })
    setMessage(error ? 'Erreur : ' + error.message : '✅ Paramètres sauvegardés !')
    setSaving(false)
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) { setPassMessage('Au moins 6 caractères.'); return }
    if (newPassword !== confirmPassword) { setPassMessage('Les mots de passe ne correspondent pas.'); return }
    setChangingPass(true); setPassMessage('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { setPassMessage('Erreur : ' + error.message) }
    else { setPassMessage('✅ Mot de passe modifié !'); setNewPassword(''); setConfirmPassword('') }
    setChangingPass(false)
  }

  async function handleChangeEmail() {
    if (!newEmail.includes('@')) { setPassMessage('Email invalide.'); return }
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) { setPassMessage('Erreur : ' + error.message) }
    else { setPassMessage('✅ Lien envoyé à ' + newEmail); setNewEmail('') }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12, #15110d 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f2ebdc', fontFamily: "'Figtree', sans-serif" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12 0%, #15110d 55%)', fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .par-input:focus{border-color:#db6e44 !important;}
        .sec-btn{transition:filter .15s,transform .15s;}
        .sec-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}
      `}</style>

      <Nav />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", color: '#f2ebdc', fontSize: 40, fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.01em' }}>Paramètres</h1>
        <p style={{ color: 'rgba(242,235,220,0.5)', margin: '0 0 32px', fontSize: 14 }}>Infos entreprise, Peppol et sécurité de votre compte.</p>

        <div style={card}>
          <h2 style={{ color: '#db6e44', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>Votre entreprise</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            <div><span style={lbl}>Nom de l&apos;entreprise</span><input className="par-input" style={inp} placeholder="Ex : Dupont Consulting" value={form.nom_entreprise} onChange={e => update('nom_entreprise', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><span style={lbl}>Numéro de TVA</span><input className="par-input" style={inp} placeholder="BE0123456789" value={form.numero_tva} onChange={e => update('numero_tva', e.target.value)} /></div>
              <div><span style={lbl}>Numéro d&apos;entreprise</span><input className="par-input" style={inp} placeholder="0123.456.789" value={form.numero_entreprise} onChange={e => update('numero_entreprise', e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ color: '#db6e44', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 10px' }}>Peppol & Paiement</h2>
          <p style={{ color: 'rgba(242,235,220,0.4)', fontSize: 12, marginBottom: 18, lineHeight: 1.6 }}>
            Identifiant Peppol = <code style={{ background: 'rgba(219,110,68,0.15)', color: '#db6e44', padding: '2px 6px', borderRadius: 4 }}>0208:</code> + numéro d&apos;entreprise sans points.
          </p>
          <div style={{ display: 'grid', gap: 14 }}>
            <div><span style={lbl}>Identifiant Peppol</span><input className="par-input" style={inp} placeholder="0208:0123456789" value={form.identifiant_peppol} onChange={e => update('identifiant_peppol', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div><span style={lbl}>IBAN</span><input className="par-input" style={inp} placeholder="BE68 5390 0754 7034" value={form.iban} onChange={e => update('iban', e.target.value)} /></div>
              <div><span style={lbl}>BIC</span><input className="par-input" style={inp} placeholder="TRIOBEBB" value={form.bic} onChange={e => update('bic', e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ color: '#db6e44', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>Adresse légale</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            <div><span style={lbl}>Rue et numéro</span><input className="par-input" style={inp} placeholder="Rue de la Loi 16" value={form.adresse_rue} onChange={e => update('adresse_rue', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 12 }}>
              <div><span style={lbl}>Code postal</span><input className="par-input" style={inp} placeholder="1000" value={form.code_postal} onChange={e => update('code_postal', e.target.value)} /></div>
              <div><span style={lbl}>Ville</span><input className="par-input" style={inp} placeholder="Bruxelles" value={form.ville} onChange={e => update('ville', e.target.value)} /></div>
              <div><span style={lbl}>Pays</span><input className="par-input" style={inp} placeholder="BE" value={form.pays} onChange={e => update('pays', e.target.value)} /></div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: 16, background: '#db6e44', border: 'none', borderRadius: 13, color: '#15110d', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(219,110,68,.35)', marginBottom: 16, opacity: saving ? 0.7 : 1, fontFamily: "'Figtree',sans-serif" }}>
          {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder les paramètres'}
        </button>

        {message && <p style={{ textAlign: 'center', marginBottom: 20, fontSize: 15, color: message.includes('Erreur') ? '#f08a63' : '#7ed3a8', fontWeight: 600 }}>{message}</p>}

        <div style={card}>
          <h2 style={{ color: '#db6e44', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 22px' }}>🔐 Sécurité</h2>
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: '#f2ebdc', fontWeight: 600, fontSize: 15, margin: '0 0 14px' }}>Changer le mot de passe</p>
            <div style={{ display: 'grid', gap: 10 }}>
              <div><span style={lbl}>Nouveau mot de passe</span><input className="par-input" type="password" style={inp} placeholder="Au moins 6 caractères" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div>
              <div><span style={lbl}>Confirmer</span><input className="par-input" type="password" style={inp} placeholder="Répéter le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
            </div>
            <button className="sec-btn" onClick={handleChangePassword} disabled={changingPass} style={{ marginTop: 12, padding: '12px 22px', background: 'rgba(219,110,68,0.12)', border: '1px solid rgba(219,110,68,0.3)', borderRadius: 11, color: '#db6e44', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
              {changingPass ? '⏳...' : 'Changer le mot de passe'}
            </button>
          </div>
          <div style={{ borderTop: '1px solid rgba(219,110,68,0.1)', paddingTop: 20 }}>
            <p style={{ color: '#f2ebdc', fontWeight: 600, fontSize: 15, margin: '0 0 14px' }}>Changer l&apos;adresse email</p>
            <div><span style={lbl}>Nouvelle adresse email</span><input className="par-input" type="email" style={inp} placeholder="nouvelle@adresse.be" value={newEmail} onChange={e => setNewEmail(e.target.value)} /></div>
            <p style={{ color: 'rgba(242,235,220,0.35)', fontSize: 12, margin: '8px 0 12px', lineHeight: 1.5 }}>Un lien de confirmation sera envoyé à la nouvelle adresse.</p>
            <button className="sec-btn" onClick={handleChangeEmail} style={{ padding: '12px 22px', background: 'rgba(219,110,68,0.12)', border: '1px solid rgba(219,110,68,0.3)', borderRadius: 11, color: '#db6e44', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
              Changer l&apos;email
            </button>
          </div>
          {passMessage && <p style={{ marginTop: 14, fontSize: 14, fontWeight: 600, color: passMessage.includes('Erreur') || passMessage.includes('pas') || passMessage.includes('invalide') ? '#f08a63' : '#7ed3a8' }}>{passMessage}</p>}
        </div>
      </div>
    </div>
  )
}
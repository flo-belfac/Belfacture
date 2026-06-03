'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import jsPDF from 'jspdf'

const BG = 'radial-gradient(120% 90% at 30% 0%, #111820 0%, #0d1117 55%)'
const BLUE = '#3b82f6'

const inp: React.CSSProperties = {
  padding: '13px 16px',
  background: 'rgba(59,130,246,0.05)',
  border: '1.5px solid rgba(59,130,246,0.15)',
  borderRadius: '12px',
  color: '#e8f0fe',
  fontSize: '15px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: "'Figtree', sans-serif",
  transition: 'border-color .2s',
}

const card: React.CSSProperties = {
  background: 'rgba(30,39,54,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1.5px solid rgba(59,130,246,0.12)',
  borderRadius: 20,
  padding: 28,
  marginBottom: 16,
}

function defaultEcheance() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

export default function Factures() {
  const [vue, setVue] = useState<'liste' | 'form'>('liste')
  const [clients, setClients] = useState<any[]>([])
  const [clientId, setClientId] = useState('')
  const [lignes, setLignes] = useState([{ description: '', quantite: '1', prix_unitaire: '', taux_tva: 21 }])
  const [tvaModeAvance, setTvaModeAvance] = useState(false)
  const [echeance, setEcheance] = useState(defaultEcheance())
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [derniereFacture, setDerniereFacture] = useState<any>(null)
  const [mesFactures, setMesFactures] = useState<any[]>([])
  const [pdfEnCours, setPdfEnCours] = useState<string | null>(null)

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data: c } = await supabase.from('clients').select('*').eq('user_id', user.id).order('nom')
    setClients(c || [])
    const { data: f } = await supabase.from('factures').select('*, clients(*)').eq('user_id', user.id).order('created_at', { ascending: false })
    setMesFactures(f || [])
  }

  async function genererNumero(userId: string) {
    const year = new Date().getFullYear()
    const { count } = await supabase.from('factures').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', `${year}-01-01`).lt('created_at', `${year + 1}-01-01`)
    return `F-${year}-${String((count || 0) + 1).padStart(3, '0')}`
  }

  function calculerTotaux() {
    const htva = lignes.reduce((acc, l) => acc + (parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0), 0)
    const tva = lignes.reduce((acc, l) => acc + (parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0) * l.taux_tva / 100, 0)
    return { htva, tva, tvac: htva + tva }
  }

  async function creerFacture() {
    if (!clientId) { setMessage('Veuillez choisir un client.'); return }
    if (lignes.some(l => !l.description || !l.prix_unitaire)) { setMessage('Remplissez toutes les lignes.'); return }
    setLoading(true)
    setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const numero = await genererNumero(user.id)
    const { htva, tva, tvac } = calculerTotaux()
    const client = clients.find(c => c.id === clientId)
    const { data: facture, error } = await supabase.from('factures').insert([{
      user_id: user.id, client_id: clientId, numero,
      total_htva: htva, total_tva: tva, total_tvac: tvac,
      statut: 'brouillon', date_echeance: echeance
    }]).select().single()
    if (error) { setMessage('Erreur : ' + error.message); setLoading(false); return }
    await supabase.from('lignes_facture').insert(lignes.map(l => ({ ...l, facture_id: facture.id })))
    setDerniereFacture({ ...facture, client, lignes, total_htva: htva, total_tva: tva, total_tvac: tvac })
    setMessage('✅ Facture ' + numero + ' créée !')
    setLignes([{ description: '', quantite: '1', prix_unitaire: '', taux_tva: 21 }])
    setClientId('')
    setEcheance(defaultEcheance())
    chargerDonnees()
    setLoading(false)
  }

  async function getParams() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('parametres_entreprise').select('*').eq('user_id', user?.id).single()
    return { nom: data?.nom_entreprise || 'Mon entreprise', tva: data?.numero_tva || '', rue: data?.adresse_rue || '', cp: data?.code_postal || '', ville: data?.ville || '', iban: data?.iban || '', bic: data?.bic || '' }
  }

  function genererPDF(factureData: any, e: any) {
    const doc = new jsPDF()
    doc.setFontSize(18); doc.setTextColor(59, 130, 246); doc.setFont('helvetica', 'bold')
    doc.text(e.nom, 20, 22)
    doc.setFontSize(10); doc.setTextColor(80, 100, 130); doc.setFont('helvetica', 'normal')
    if (e.rue) doc.text(e.rue, 20, 30)
    if (e.cp || e.ville) doc.text((e.cp + ' ' + e.ville).trim(), 20, 37)
    if (e.tva) doc.text('TVA : ' + e.tva, 20, 44)
    if (e.iban) doc.text('IBAN : ' + e.iban, 20, 51)
    doc.setFontSize(22); doc.setTextColor(20, 30, 50); doc.setFont('helvetica', 'bold')
    doc.text('FACTURE', 145, 22)
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 100, 130)
    doc.text('N° : ' + factureData.numero, 145, 31)
    doc.text('Date : ' + new Date().toLocaleDateString('fr-BE'), 145, 38)
    if (factureData.date_echeance) doc.text('Échéance : ' + new Date(factureData.date_echeance).toLocaleDateString('fr-BE'), 145, 45)
    doc.setDrawColor(59, 130, 246); doc.setLineWidth(0.8); doc.line(20, 60, 190, 60)
    doc.setFontSize(10); doc.setTextColor(80, 100, 130); doc.text('Facturé à :', 20, 72)
    doc.setFontSize(13); doc.setTextColor(20, 30, 50); doc.setFont('helvetica', 'bold')
    doc.text(factureData.client?.nom || '', 20, 81)
    if (factureData.client?.numero_tva) { doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 100, 130); doc.text('TVA : ' + factureData.client.numero_tva, 20, 88) }
    doc.setFillColor(59, 130, 246); doc.rect(20, 98, 170, 9, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold')
    doc.text('Description', 23, 104.5); doc.text('Qté', 112, 104.5); doc.text('Prix HT', 132, 104.5); doc.text('TVA', 155, 104.5); doc.text('Total HT', 170, 104.5)
    doc.setFont('helvetica', 'normal')
    let y = 117
    ;(factureData.lignes || []).forEach((l: any, i: number) => {
      if (i % 2 === 0) { doc.setFillColor(235, 242, 255); doc.rect(20, y - 6, 170, 10, 'F') }
      doc.setTextColor(20, 30, 50); doc.setFontSize(9)
      doc.text(l.description || '', 23, y); doc.text(String(l.quantite || ''), 112, y)
      doc.text((parseFloat(l.prix_unitaire) || 0).toFixed(2) + ' €', 130, y)
      doc.text((l.taux_tva || 21) + '%', 155, y)
      doc.text(((parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0)).toFixed(2) + ' €', 168, y)
      y += 12
    })
    doc.setDrawColor(59, 130, 246); doc.setLineWidth(0.4); doc.line(120, y + 4, 190, y + 4)
    doc.setFontSize(10); doc.setTextColor(80, 100, 130); doc.text('Total HTVA :', 122, y + 13)
    doc.setTextColor(20, 30, 50); doc.text(factureData.total_htva.toFixed(2) + ' €', 188, y + 13, { align: 'right' })
    doc.setTextColor(80, 100, 130); doc.text('TVA :', 122, y + 21)
    doc.setTextColor(20, 30, 50); doc.text(factureData.total_tva.toFixed(2) + ' €', 188, y + 21, { align: 'right' })
    doc.setFillColor(59, 130, 246); doc.rect(118, y + 25, 74, 11, 'F')
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold')
    doc.text('Total TVAC :', 122, y + 32.5); doc.text(factureData.total_tvac.toFixed(2) + ' €', 188, y + 32.5, { align: 'right' })
    if (e.iban) { doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 100, 130); doc.text('Paiement par virement :', 20, y + 50); doc.setTextColor(20, 30, 50); doc.text('IBAN : ' + e.iban + (e.bic ? '   BIC : ' + e.bic : ''), 20, y + 57); doc.text('Communication : ' + factureData.numero, 20, y + 64) }
    doc.setFontSize(8); doc.setTextColor(150, 170, 200); doc.text('Facture générée via BelFacture — belfacture.vercel.app', 105, 285, { align: 'center' })
    doc.save(factureData.numero + '.pdf')
  }

  async function telechargerPDF(facture: any) {
    setPdfEnCours(facture.id)
    const lignesData = facture.lignes || (await supabase.from('lignes_facture').select('*').eq('facture_id', facture.id)).data || []
    const e = await getParams()
    genererPDF({ ...facture, lignes: lignesData }, e)
    setPdfEnCours(null)
  }

  async function changerStatut(id: string, statut: string) {
    await supabase.from('factures').update({ statut }).eq('id', id)
    chargerDonnees()
  }

  async function supprimerFacture(id: string) {
    if (!confirm('Supprimer cette facture ?')) return
    await supabase.from('lignes_facture').delete().eq('facture_id', id)
    await supabase.from('factures').delete().eq('id', id)
    chargerDonnees()
  }

  const { htva, tva, tvac } = calculerTotaux()

  const statutStyle = (s: string): React.CSSProperties => ({
    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: s === 'payee' ? 'rgba(74,222,128,0.12)' : s === 'envoyee' ? 'rgba(59,130,246,0.15)' : 'rgba(232,240,254,0.08)',
    color: s === 'payee' ? '#4ade80' : s === 'envoyee' ? '#60a5fa' : 'rgba(232,240,254,0.4)',
  })

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .f-inp:focus{border-color:${BLUE} !important;box-shadow:0 0 0 3px rgba(59,130,246,.1);}
        .f-inp option{background:#1e2736;color:#e8f0fe;}
        .facture-row{border-bottom:1px solid rgba(59,130,246,0.08);padding:16px 8px;display:flex;justify-content:space-between;align-items:center;transition:background .15s;border-radius:12px;gap:8px;}
        .facture-row:hover{background:rgba(59,130,246,0.05);}
        .pdf-btn{background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);border-radius:8px;color:#60a5fa;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;white-space:nowrap;}
        .pay-btn{background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);border-radius:8px;color:#4ade80;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;white-space:nowrap;}
        .del-btn{background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:8px;color:#f87171;padding:6px 8px;font-size:12px;cursor:pointer;font-family:'Figtree',sans-serif;}
        .tab-btn{padding:8px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;border:none;font-family:'Figtree',sans-serif;transition:all .15s;}
        @media(max-width:640px){.facture-row{flex-direction:column;align-items:flex-start;}.facture-actions{display:flex;flex-wrap:wrap;gap:6px;width:100%;}}
      `}</style>

      <Nav />

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: '#e8f0fe', margin: 0, letterSpacing: '-0.01em' }}>Factures</h1>
          <button
            onClick={() => { setVue(vue === 'liste' ? 'form' : 'liste'); setMessage('') }}
            className="tab-btn"
            style={{ background: vue === 'form' ? 'rgba(59,130,246,.15)' : BLUE, color: vue === 'form' ? '#60a5fa' : '#0d1117', fontSize: 15, padding: '12px 24px', borderRadius: 13 }}
          >
            {vue === 'form' ? '← Mes factures' : '+ Nouvelle facture'}
          </button>
        </div>

        {/* VUE FORMULAIRE */}
        {vue === 'form' && (
          <>
            {/* Client */}
            <div style={card}>
              <h3 style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 14px' }}>Client</h3>
              <select className="f-inp" value={clientId} onChange={e => setClientId(e.target.value)} style={{ ...inp, appearance: 'none' }}>
                <option value="">Choisir un client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
              {clients.length === 0 && (
                <p style={{ color: 'rgba(232,240,254,.4)', fontSize: 13, marginTop: 10 }}>
                  Aucun client — <a href="/clients" style={{ color: BLUE }}>créez-en un d'abord</a>
                </p>
              )}
            </div>

            {/* Date échéance */}
            <div style={card}>
              <h3 style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 14px' }}>Date d'échéance</h3>
              <input className="f-inp" type="date" value={echeance} onChange={e => setEcheance(e.target.value)} style={inp} />
              <p style={{ color: 'rgba(232,240,254,.35)', fontSize: 12, marginTop: 8 }}>Par défaut : 30 jours à partir d'aujourd'hui</p>
            </div>

            {/* Lignes */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>Prestations</h3>
                <button
                  onClick={() => setTvaModeAvance(!tvaModeAvance)}
                  style={{ background: 'none', border: '1px solid rgba(59,130,246,.2)', borderRadius: 8, color: 'rgba(232,240,254,.5)', fontSize: 12, cursor: 'pointer', padding: '4px 10px', fontFamily: "'Figtree',sans-serif" }}
                >
                  {tvaModeAvance ? 'TVA simple' : 'TVA avancée'}
                </button>
              </div>

              {/* Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: tvaModeAvance ? '2fr 0.5fr 0.8fr 0.6fr 28px' : '2fr 0.5fr 0.8fr 28px', gap: 8, marginBottom: 8 }}>
                {['Description', 'Qté', 'Prix HT €', ...(tvaModeAvance ? ['TVA %'] : []), ''].map((h, i) => (
                  <span key={i} style={{ color: 'rgba(232,240,254,.35)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>

              {lignes.map((ligne, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: tvaModeAvance ? '2fr 0.5fr 0.8fr 0.6fr 28px' : '2fr 0.5fr 0.8fr 28px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input className="f-inp" style={inp} placeholder="ex: Consultation web" value={ligne.description} onChange={e => { const nl = [...lignes]; nl[i].description = e.target.value; setLignes(nl) }} />
                  <input className="f-inp" type="number" style={inp} placeholder="1" value={ligne.quantite} onChange={e => { const nl = [...lignes]; nl[i].quantite = e.target.value; setLignes(nl) }} />
                  <input className="f-inp" type="number" style={inp} placeholder="150" value={ligne.prix_unitaire} onChange={e => { const nl = [...lignes]; nl[i].prix_unitaire = e.target.value; setLignes(nl) }} />
                  {tvaModeAvance && (
                    <select className="f-inp" style={{ ...inp, appearance: 'none' }} value={ligne.taux_tva} onChange={e => { const nl = [...lignes]; nl[i].taux_tva = parseInt(e.target.value); setLignes(nl) }}>
                      <option value={21}>21%</option><option value={12}>12%</option><option value={6}>6%</option><option value={0}>0%</option>
                    </select>
                  )}
                  {lignes.length > 1
                    ? <button onClick={() => setLignes(lignes.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.5)', cursor: 'pointer', fontSize: 20, padding: 0 }}>×</button>
                    : <span />}
                </div>
              ))}

              {!tvaModeAvance && (
                <p style={{ color: 'rgba(232,240,254,.3)', fontSize: 12, marginTop: 4 }}>TVA 21% appliquée par défaut. Cliquez sur "TVA avancée" pour changer.</p>
              )}

              <button onClick={() => setLignes([...lignes, { description: '', quantite: '1', prix_unitaire: '', taux_tva: 21 }])}
                style={{ color: BLUE, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '8px 16px', marginTop: 12, fontFamily: "'Figtree',sans-serif" }}>
                + Ajouter une ligne
              </button>
            </div>

            {/* Totaux */}
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(232,240,254,.45)', fontSize: 14 }}>Total HTVA</span>
                  <span style={{ color: 'rgba(232,240,254,.7)', fontWeight: 600 }}>{htva.toFixed(2)} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(232,240,254,.45)', fontSize: 14 }}>TVA</span>
                  <span style={{ color: 'rgba(232,240,254,.7)', fontWeight: 600 }}>{tva.toFixed(2)} €</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(59,130,246,0.2)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(232,240,254,.55)', fontSize: 14, fontWeight: 600 }}>Total TVAC</span>
                  <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 38, color: '#60a5fa', fontWeight: 400 }}>{tvac.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <button onClick={creerFacture} disabled={loading}
              style={{ width: '100%', padding: 17, background: loading ? 'rgba(59,130,246,.4)' : BLUE, border: 'none', borderRadius: 13, color: '#0d1117', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 12, boxShadow: '0 8px 24px rgba(59,130,246,.25)', fontFamily: "'Figtree',sans-serif', transition: 'all .2s" }}>
              {loading ? '⏳ Création en cours...' : 'Créer la facture →'}
            </button>

            {message && (
              <div style={{ textAlign: 'center', color: message.includes('Erreur') || message.includes('Veuillez') || message.includes('Remplissez') ? '#f87171' : '#4ade80', marginBottom: 16, fontWeight: 600, padding: '12px', background: message.includes('Erreur') || message.includes('Veuillez') || message.includes('Remplissez') ? 'rgba(248,113,113,.08)' : 'rgba(74,222,128,.08)', borderRadius: 10 }}>
                {message}
              </div>
            )}

            {derniereFacture && (
              <button onClick={() => telechargerPDF(derniereFacture)} disabled={pdfEnCours === derniereFacture?.id}
                style={{ width: '100%', padding: 16, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 13, color: '#4ade80', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
                {pdfEnCours === derniereFacture?.id ? '⏳ Génération...' : '📄 Télécharger le PDF — ' + derniereFacture.numero}
              </button>
            )}
          </>
        )}

        {/* VUE LISTE */}
        {vue === 'liste' && (
          <div style={card}>
            <h3 style={{ color: BLUE, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>
              Mes factures ({mesFactures.length})
            </h3>
            {mesFactures.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: 'rgba(232,240,254,.3)', marginBottom: 16 }}>Aucune facture pour l'instant</p>
                <button onClick={() => setVue('form')} style={{ background: BLUE, border: 'none', borderRadius: 12, color: '#0d1117', padding: '12px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Figtree',sans-serif" }}>
                  + Créer ma première facture
                </button>
              </div>
            ) : mesFactures.map(f => (
              <div key={f.id} className="facture-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#e8f0fe', fontWeight: 700, margin: '0 0 3px', fontSize: 15 }}>{f.numero}</p>
                  <p style={{ color: 'rgba(232,240,254,.4)', margin: 0, fontSize: 13 }}>{f.clients?.nom}</p>
                  {f.date_echeance && <p style={{ color: 'rgba(232,240,254,.3)', margin: '3px 0 0', fontSize: 12 }}>Échéance : {new Date(f.date_echeance).toLocaleDateString('fr-BE')}</p>}
                </div>
                <div className="facture-actions" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right', marginRight: 4 }}>
                    <p style={{ fontFamily: "'Instrument Serif',serif", color: '#60a5fa', fontWeight: 400, fontSize: 20, margin: '0 0 4px' }}>{f.total_tvac?.toFixed(2)} €</p>
                    <span style={statutStyle(f.statut)}>{f.statut}</span>
                  </div>
                  <button className="pdf-btn" onClick={() => telechargerPDF(f)} disabled={pdfEnCours === f.id}>{pdfEnCours === f.id ? '⏳' : '📄 PDF'}</button>
                  {f.statut !== 'payee' && <button className="pay-btn" onClick={() => changerStatut(f.id, 'payee')}>✅ Payée</button>}
                  <button className="del-btn" onClick={() => supprimerFacture(f.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

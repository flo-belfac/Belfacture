'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import jsPDF from 'jspdf'

const inp = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', color: '#e8f0fe',
  fontSize: '15px', outline: 'none',
  boxSizing: 'border-box' as const,
  fontFamily: "'Figtree', sans-serif",
}

const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  color: 'rgba(232,240,254,0.45)', marginBottom: '6px',
}

const card = {
  background: 'rgba(30,39,54,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(59,130,246,0.15)',
  borderRadius: 20, padding: 28,
}

export default function Devis() {
  const [clients, setClients] = useState<any[]>([])
  const [clientId, setClientId] = useState('')
  const [description, setDescription] = useState('')
  const [montantTotal, setMontantTotal] = useState('')
  const [acomptes, setAcomptes] = useState([{ pourcentage: 30 }, { pourcentage: 30 }, { pourcentage: 40 }])
  const [devisList, setDevisList] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [pdfEnCours, setPdfEnCours] = useState<string | null>(null)

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data: c } = await supabase.from('clients').select('*').eq('user_id', user.id)
    setClients(c || [])
    const { data: d } = await supabase.from('devis').select('*, clients(*)').eq('user_id', user.id).order('created_at', { ascending: false })
    setDevisList(d || [])
  }

  async function genererNumeroDevis(userId: string) {
    const year = new Date().getFullYear()
    const { count } = await supabase.from('devis').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', `${year}-01-01`).lt('created_at', `${year + 1}-01-01`)
    return `D-${year}-${String((count || 0) + 1).padStart(3, '0')}`
  }

  async function creerDevis() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const numero = await genererNumeroDevis(user.id)
    const total = parseFloat(montantTotal)
    const { data: devis, error } = await supabase.from('devis').insert([{
      user_id: user.id, client_id: clientId, numero,
      description, montant_total: total, statut: 'en_attente'
    }]).select().single()
    if (error) { setMessage('Erreur : ' + error.message); return }
    await supabase.from('acomptes').insert(acomptes.map(a => ({
      devis_id: devis.id, pourcentage: a.pourcentage,
      montant: (total * a.pourcentage / 100), statut: 'non_facture'
    })))
    setMessage('Devis ' + numero + ' créé ✅')
    setDescription(''); setMontantTotal(''); setClientId('')
    chargerDonnees()
  }

  async function transformerEnFacture(devis: any, acompteIndex: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: acomptesDevis } = await supabase.from('acomptes').select('*').eq('devis_id', devis.id)
    const acompte = acomptesDevis?.[acompteIndex]
    if (!acompte || acompte.statut === 'facture') { setMessage('Cet acompte a déjà été facturé !'); return }
    const year = new Date().getFullYear()
    const { count } = await supabase.from('factures').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', `${year}-01-01`).lt('created_at', `${year + 1}-01-01`)
    const numero = `F-${year}-${String((count || 0) + 1).padStart(3, '0')}`
    const { data: facture } = await supabase.from('factures').insert([{
      user_id: user.id, client_id: devis.client_id, numero,
      total_htva: acompte.montant / 1.21,
      total_tva: acompte.montant - acompte.montant / 1.21,
      total_tvac: acompte.montant, statut: 'envoyee'
    }]).select().single()
    if (!facture) return
    await supabase.from('lignes_facture').insert([{
      facture_id: facture.id,
      description: 'Acompte ' + acompte.pourcentage + '% — ' + devis.description,
      quantite: 1, prix_unitaire: acompte.montant / 1.21, taux_tva: 21
    }])
    await supabase.from('acomptes').update({ statut: 'facture', facture_id: facture.id }).eq('id', acompte.id)
    setMessage('Facture acompte ' + acompte.pourcentage + '% créée ✅')
    chargerDonnees()
  }

  async function supprimerDevis(id: string) {
    if (!confirm('Supprimer ce devis ?')) return
    await supabase.from('acomptes').delete().eq('devis_id', id)
    await supabase.from('devis').delete().eq('id', id)
    chargerDonnees()
  }

  async function getParams() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('parametres_entreprise').select('*').eq('user_id', user?.id ?? '').single()
    return {
      nom: data?.nom_entreprise || 'Mon entreprise',
      tva: data?.numero_tva || '', rue: data?.adresse_rue || '',
      cp: data?.code_postal || '', ville: data?.ville || '',
      iban: data?.iban || '', bic: data?.bic || ''
    }
  }

  async function telechargerPDFDevis(devis: any) {
    setPdfEnCours(devis.id)
    const e = await getParams()
    const { data: acomptesData } = await supabase.from('acomptes').select('*').eq('devis_id', devis.id)
    const client = devis.clients
    const doc = new jsPDF()
    doc.setFontSize(18); doc.setTextColor(219, 110, 68); doc.setFont('helvetica', 'bold'); doc.text(e.nom, 20, 22)
    doc.setFontSize(10); doc.setTextColor(100, 80, 60); doc.setFont('helvetica', 'normal')
    if (e.rue) doc.text(e.rue, 20, 30)
    if (e.cp || e.ville) doc.text((e.cp + ' ' + e.ville).trim(), 20, 37)
    if (e.tva) doc.text('TVA : ' + e.tva, 20, 44)
    doc.setFontSize(22); doc.setTextColor(40, 30, 20); doc.setFont('helvetica', 'bold'); doc.text('DEVIS', 155, 22)
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 80, 60)
    doc.text('N° : ' + devis.numero, 145, 31)
    doc.text('Date : ' + new Date().toLocaleDateString('fr-BE'), 145, 38)
    doc.text('Valable 30 jours', 145, 45)
    doc.setDrawColor(219, 110, 68); doc.setLineWidth(0.8); doc.line(20, 58, 190, 58)
    doc.setFontSize(10); doc.setTextColor(130, 100, 80); doc.text('Établi pour :', 20, 70)
    doc.setFontSize(13); doc.setTextColor(40, 30, 20); doc.setFont('helvetica', 'bold'); doc.text(client?.nom || '', 20, 79)
    if (client?.numero_tva) { doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 80, 60); doc.text('TVA : ' + client.numero_tva, 20, 86) }
    doc.setFontSize(12); doc.setTextColor(40, 30, 20); doc.setFont('helvetica', 'bold'); doc.text('Objet :', 20, 102)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.text(devis.description || '', 20, 110)
    doc.setFillColor(219, 110, 68); doc.rect(20, 122, 170, 9, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold')
    doc.text('Échéance', 23, 128.5); doc.text('Pourcentage', 90, 128.5); doc.text('Montant TVAC', 145, 128.5)
    let y = 141
    ;(acomptesData || []).forEach((a: any, i: number) => {
      if (i % 2 === 0) { doc.setFillColor(252, 247, 240); doc.rect(20, y - 6, 170, 10, 'F') }
      doc.setTextColor(40, 30, 20); doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
      doc.text('Acompte ' + (i + 1), 23, y); doc.text(a.pourcentage + ' %', 90, y); doc.text(a.montant.toFixed(2) + ' €', 145, y)
      y += 12
    })
    doc.setDrawColor(219, 110, 68); doc.setLineWidth(0.4); doc.line(20, y + 4, 190, y + 4)
    doc.setFillColor(219, 110, 68); doc.rect(118, y + 8, 74, 11, 'F')
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(10)
    doc.text('Total TVAC :', 122, y + 15.5); doc.text(devis.montant_total.toFixed(2) + ' €', 188, y + 15.5, { align: 'right' })
    y += 40
    doc.setTextColor(100, 80, 60); doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
    doc.text('Bon pour accord — Date et signature :', 20, y)
    doc.setDrawColor(180, 160, 140); doc.setLineWidth(0.3); doc.line(20, y + 25, 100, y + 25); doc.text('Signature client', 20, y + 32)
    if (e.iban) { doc.setFontSize(9); doc.setTextColor(130, 100, 80); doc.text('Paiement : IBAN : ' + e.iban + (e.bic ? '   BIC : ' + e.bic : ''), 20, y + 45) }
    doc.setFontSize(8); doc.setTextColor(180, 160, 140); doc.text('Devis généré via BelFacture — belfacture.vercel.app', 105, 285, { align: 'center' })
    doc.save(devis.numero + '.pdf')
    setPdfEnCours(null)
  }

  const totalPct = acomptes.reduce((s, a) => s + a.pourcentage, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #111820 0%, #0d1117 55%)', fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .d-inp:focus{border-color:#3b82f6 !important;}
        .d-inp option{background:#211a13;color:#e8f0fe;}
        .acompte-row{background:rgba(30,39,54,0.5);border:1px solid rgba(59,130,246,0.12);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;margin-bottom:10px;}
        .devis-card{background:rgba(30,39,54,0.5);border:1.5px solid rgba(59,130,246,0.12);border-radius:16px;padding:22px;margin-bottom:14px;transition:border-color .2s;}
        .devis-card:hover{border-color:rgba(59,130,246,0.35);}
        .facture-btn{padding:11px 8px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);border-radius:10px;color:#3b82f6;font-size:12px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;transition:all .2s;line-height:1.4;}
        .facture-btn:hover{background:rgba(59,130,246,0.2);}
        .pdf-btn{background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);border-radius:8px;color:#4ade80;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;}
        .del-btn{background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:8px;color:#f87171;padding:6px 10px;font-size:12px;cursor:pointer;font-family:'Figtree',sans-serif;}
      `}</style>

      <Nav />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: '#e8f0fe', margin: '0 0 40px', letterSpacing: '-0.01em' }}>Devis &amp; Acomptes</h1>

        <div style={{ ...card, marginBottom: 20 }}>
          <h3 style={{ color: '#3b82f6', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 22px' }}>Créer un devis</h3>
          <div style={{ display: 'grid', gap: 14, marginBottom: 14 }}>
            <div>
              <span style={lbl}>Client</span>
              <select className="d-inp" value={clientId} onChange={e => setClientId(e.target.value)} style={{ ...inp, appearance: 'none' as any }}>
                <option value="">Choisir un client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div><span style={lbl}>Description du projet</span><input className="d-inp" style={inp} placeholder="Ex : Installation électrique complète" value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div><span style={lbl}>Montant total TVAC (€)</span><input className="d-inp" type="number" style={inp} placeholder="5000" value={montantTotal} onChange={e => setMontantTotal(e.target.value)} /></div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={lbl}>Répartition des acomptes</span>
              <span style={{ fontSize: 12, color: totalPct === 100 ? '#4ade80' : '#f87171', fontWeight: 600 }}>Total : {totalPct}% {totalPct === 100 ? '✓' : '⚠️'}</span>
            </div>
            {acomptes.map((a, i) => (
              <div key={i} className="acompte-row">
                <span style={{ color: 'rgba(232,240,254,0.5)', fontSize: 13, minWidth: 80 }}>Acompte {i + 1}</span>
                <input type="number" value={a.pourcentage} onChange={e => { const na = [...acomptes]; na[i].pourcentage = parseFloat(e.target.value); setAcomptes(na) }}
                  style={{ width: 70, padding: '8px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, color: '#e8f0fe', fontSize: 14, outline: 'none', textAlign: 'center', fontFamily: "'Figtree',sans-serif" }} />
                <span style={{ color: 'rgba(232,240,254,0.4)', fontSize: 13 }}>%</span>
                {montantTotal && <span style={{ marginLeft: 'auto', color: '#60a5fa', fontWeight: 700, fontSize: 16, fontFamily: "'Instrument Serif',serif" }}>{(parseFloat(montantTotal) * a.pourcentage / 100).toFixed(2)} €</span>}
              </div>
            ))}
          </div>
          <button onClick={creerDevis} style={{ width: '100%', padding: 16, background: '#3b82f6', border: 'none', borderRadius: 13, color: '#0d1117', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(59,130,246,.3)', fontFamily: "'Figtree',sans-serif" }}>Créer le devis</button>
          {message && <p style={{ marginTop: 12, textAlign: 'center', color: message.includes('Erreur') || message.includes('déjà') ? '#f87171' : '#4ade80', fontSize: 14, fontWeight: 600 }}>{message}</p>}
        </div>

        <div style={card}>
          <h3 style={{ color: '#3b82f6', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 22px' }}>Mes devis ({devisList.length})</h3>
          {devisList.length === 0 ? (
            <p style={{ color: 'rgba(232,240,254,.3)', textAlign: 'center', padding: 32 }}>Aucun devis pour le moment</p>
          ) : devisList.map(devis => (
            <div key={devis.id} className="devis-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <p style={{ color: '#e8f0fe', fontWeight: 700, margin: '0 0 3px', fontSize: 16 }}>{devis.numero}</p>
                  <p style={{ color: 'rgba(232,240,254,.45)', margin: 0, fontSize: 13 }}>{devis.clients?.nom} — {devis.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'Instrument Serif',serif", color: '#60a5fa', fontWeight: 400, fontSize: 24 }}>{devis.montant_total} €</span>
                  <button className="pdf-btn" onClick={() => telechargerPDFDevis(devis)} disabled={pdfEnCours === devis.id}>{pdfEnCours === devis.id ? '⏳' : '📄 PDF'}</button>
                  <button className="del-btn" onClick={() => supprimerDevis(devis.id)}>🗑️</button>
                </div>
              </div>
              <p style={{ color: 'rgba(232,240,254,.3)', fontSize: 12, margin: '0 0 12px' }}>Cliquez sur un acompte quand le client a payé pour générer la facture.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[0, 1, 2].map(i => (
                  <button key={i} className="facture-btn" onClick={() => transformerEnFacture(devis, i)}>
                    Acompte {i + 1}<br /><span style={{ opacity: .7 }}>{acomptes[i]?.pourcentage || '—'}%</span><br />→ Créer facture
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
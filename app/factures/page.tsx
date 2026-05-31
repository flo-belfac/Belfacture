'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import jsPDF from 'jspdf'

const Logo = ({ size = 32 }) => (
  <span style={{ width: size, height: size, borderRadius: size * 0.3, background: '#db6e44', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span className="ring" /><span className="ring" style={{ animationDelay: '1.2s' }} />
    <span className="core" />
  </span>
)

const inp = {
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', color: '#f2ebdc',
  fontSize: '14px', outline: 'none',
  width: '100%', boxSizing: 'border-box' as const,
  fontFamily: "'Figtree', sans-serif",
}

const card = {
  background: 'rgba(33,26,19,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(219,110,68,0.15)',
  borderRadius: 20, padding: 28, marginBottom: 16,
}

export default function Factures() {
  const [clients, setClients] = useState<any[]>([])
  const [clientId, setClientId] = useState('')
  const [lignes, setLignes] = useState([
    { description: '', quantite: '', prix_unitaire: '', taux_tva: 21 }
  ])
  const [message, setMessage] = useState('')
  const [derniereFacture, setDerniereFacture] = useState<any>(null)
  const [mesFactures, setMesFactures] = useState<any[]>([])
  const [pdfEnCours, setPdfEnCours] = useState<string | null>(null)

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data: clientsData } = await supabase.from('clients').select('*').eq('user_id', user.id)
    setClients(clientsData || [])
    const { data: facturesData } = await supabase.from('factures').select('*, clients(*)').eq('user_id', user.id).order('created_at', { ascending: false })
    setMesFactures(facturesData || [])
  }

  async function genererNumero(userId: string) {
    const year = new Date().getFullYear()
    const debut = `${year}-01-01`
    const fin = `${year + 1}-01-01`
    const { count } = await supabase
      .from('factures')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', debut)
      .lt('created_at', fin)
    const num = String((count || 0) + 1).padStart(3, '0')
    return `F-${year}-${num}`
  }

  function calculerTotaux() {
    const htva = lignes.reduce((acc, l) => acc + (parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0), 0)
    const tva = lignes.reduce((acc, l) => acc + (parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0) * l.taux_tva / 100, 0)
    return { htva, tva, tvac: htva + tva }
  }

  async function creerFacture() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const numero = await genererNumero(user.id)
    const { htva, tva, tvac } = calculerTotaux()
    const client = clients.find(c => c.id === clientId)
    const { data: facture, error } = await supabase.from('factures').insert([{
      user_id: user.id, client_id: clientId, numero,
      total_htva: htva, total_tva: tva, total_tvac: tvac, statut: 'brouillon'
    }]).select().single()
    if (error) { setMessage('Erreur : ' + error.message); return }
    await supabase.from('lignes_facture').insert(lignes.map(l => ({ ...l, facture_id: facture.id })))
    setDerniereFacture({ ...facture, client, lignes, total_htva: htva, total_tva: tva, total_tvac: tvac })
    setMessage('Facture ' + numero + ' créée ✅')
    chargerDonnees()
  }

  async function getParams() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('parametres_entreprise').select('*').eq('user_id', user?.id).single()
    return {
      nom: data?.nom_entreprise || 'Mon entreprise',
      tva: data?.numero_tva || '',
      rue: data?.adresse_rue || '',
      cp: data?.code_postal || '',
      ville: data?.ville || '',
      iban: data?.iban || '',
      bic: data?.bic || '',
    }
  }

  function genererPDF(factureData: any, entreprise: any) {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(219, 110, 68)
    doc.setFont('helvetica', 'bold')
    doc.text(entreprise.nom, 20, 22)
    doc.setFontSize(10)
    doc.setTextColor(100, 80, 60)
    doc.setFont('helvetica', 'normal')
    if (entreprise.rue) doc.text(entreprise.rue, 20, 30)
    if (entreprise.cp || entreprise.ville) doc.text((entreprise.cp + ' ' + entreprise.ville).trim(), 20, 37)
    if (entreprise.tva) doc.text('TVA : ' + entreprise.tva, 20, 44)
    if (entreprise.iban) doc.text('IBAN : ' + entreprise.iban, 20, 51)
    doc.setFontSize(22)
    doc.setTextColor(40, 30, 20)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURE', 145, 22)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 80, 60)
    doc.text('N° : ' + factureData.numero, 145, 31)
    doc.text('Date : ' + new Date().toLocaleDateString('fr-BE'), 145, 38)
    doc.setDrawColor(219, 110, 68)
    doc.setLineWidth(0.8)
    doc.line(20, 60, 190, 60)
    doc.setFontSize(10)
    doc.setTextColor(130, 100, 80)
    doc.text('Facturé à :', 20, 72)
    doc.setFontSize(13)
    doc.setTextColor(40, 30, 20)
    doc.setFont('helvetica', 'bold')
    doc.text(factureData.client?.nom || '', 20, 81)
    if (factureData.client?.numero_tva) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 80, 60)
      doc.text('TVA : ' + factureData.client.numero_tva, 20, 88)
    }
    doc.setFillColor(219, 110, 68)
    doc.rect(20, 98, 170, 9, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Description', 23, 104.5)
    doc.text('Qté', 112, 104.5)
    doc.text('Prix HT', 132, 104.5)
    doc.text('TVA', 155, 104.5)
    doc.text('Total HT', 170, 104.5)
    doc.setFont('helvetica', 'normal')
    let y = 117
    const lignesFacture = factureData.lignes || []
    lignesFacture.forEach((l: any, i: number) => {
      if (i % 2 === 0) { doc.setFillColor(252, 247, 240); doc.rect(20, y - 6, 170, 10, 'F') }
      doc.setTextColor(40, 30, 20)
      doc.setFontSize(9)
      doc.text(l.description || '', 23, y)
      doc.text(String(l.quantite || ''), 112, y)
      doc.text((parseFloat(l.prix_unitaire) || 0).toFixed(2) + ' €', 130, y)
      doc.text((l.taux_tva || 21) + '%', 155, y)
      doc.text(((parseFloat(l.quantite) || 0) * (parseFloat(l.prix_unitaire) || 0)).toFixed(2) + ' €', 168, y)
      y += 12
    })
    doc.setDrawColor(219, 110, 68)
    doc.setLineWidth(0.4)
    doc.line(120, y + 4, 190, y + 4)
    doc.setFontSize(10)
    doc.setTextColor(100, 80, 60)
    doc.text('Total HTVA :', 122, y + 13)
    doc.setTextColor(40, 30, 20)
    doc.text(factureData.total_htva.toFixed(2) + ' €', 188, y + 13, { align: 'right' })
    doc.setTextColor(100, 80, 60)
    doc.text('TVA :', 122, y + 21)
    doc.setTextColor(40, 30, 20)
    doc.text(factureData.total_tva.toFixed(2) + ' €', 188, y + 21, { align: 'right' })
    doc.setFillColor(219, 110, 68)
    doc.rect(118, y + 25, 74, 11, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('Total TVAC :', 122, y + 32.5)
    doc.text(factureData.total_tvac.toFixed(2) + ' €', 188, y + 32.5, { align: 'right' })
    if (entreprise.iban) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(130, 100, 80)
      doc.text('Paiement par virement :', 20, y + 50)
      doc.setTextColor(40, 30, 20)
      doc.text('IBAN : ' + entreprise.iban + (entreprise.bic ? '   BIC : ' + entreprise.bic : ''), 20, y + 57)
      doc.text('Communication : ' + factureData.numero, 20, y + 64)
    }
    doc.setFontSize(8)
    doc.setTextColor(180, 160, 140)
    doc.text('Facture générée via BelFacture — belfacture.vercel.app', 105, 285, { align: 'center' })
    doc.save(factureData.numero + '.pdf')
  }

  async function telechargerPDF() {
    if (!derniereFacture) return
    setPdfEnCours(derniereFacture.id)
    const entreprise = await getParams()
    genererPDF(derniereFacture, entreprise)
    setPdfEnCours(null)
  }

  async function telechargerPDFExistant(facture: any) {
    setPdfEnCours(facture.id)
    const { data: lignesData } = await supabase.from('lignes_facture').select('*').eq('facture_id', facture.id)
    const entreprise = await getParams()
    genererPDF({ ...facture, lignes: lignesData || [] }, entreprise)
    setPdfEnCours(null)
  }

  async function changerStatut(factureId: string, statut: string) {
    await supabase.from('factures').update({ statut }).eq('id', factureId)
    chargerDonnees()
  }

  async function supprimerFacture(factureId: string) {
    if (!confirm('Supprimer cette facture ?')) return
    await supabase.from('lignes_facture').delete().eq('facture_id', factureId)
    await supabase.from('factures').delete().eq('id', factureId)
    chargerDonnees()
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

  const { htva, tva, tvac } = calculerTotaux()

  const statutStyle = (s: string) => ({
    padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: s === 'payee' ? 'rgba(126,211,168,0.15)' : s === 'envoyee' ? 'rgba(219,110,68,0.15)' : 'rgba(242,235,220,0.08)',
    color: s === 'payee' ? '#7ed3a8' : s === 'envoyee' ? '#db6e44' : 'rgba(242,235,220,0.4)',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 30% 0%, #241a12 0%, #15110d 55%)', fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        .core{width:7px;height:7px;border-radius:999px;background:#f4eddd;position:relative;z-index:2;}
        .ring{position:absolute;width:9px;height:9px;border-radius:999px;border:1.5px solid #f4eddd;animation:ripple 2.4s ease-out infinite;}
        @keyframes ripple{0%{transform:scale(.6);opacity:.85;}100%{transform:scale(2.8);opacity:0;}}
        .f-inp:focus{border-color:#db6e44 !important;}
        .f-inp option{background:#211a13;color:#f2ebdc;}
        .ligne-row{display:grid;grid-template-columns:2fr 0.6fr 0.8fr 0.6fr 28px;gap:8px;margin-bottom:8px;align-items:center;}
        .facture-row{border-bottom:1px solid rgba(219,110,68,0.08);padding:14px 8px;display:flex;justify-content:space-between;align-items:center;transition:background .15s;border-radius:10px;}
        .facture-row:hover{background:rgba(219,110,68,0.05);}
        .pdf-btn{background:rgba(219,110,68,0.1);border:1px solid rgba(219,110,68,0.25);border-radius:8px;color:#db6e44;padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;transition:all .15s;}
        .pdf-btn:hover{background:rgba(219,110,68,0.2);}
        .pay-btn{background:rgba(126,211,168,0.1);border:1px solid rgba(126,211,168,0.25);border-radius:8px;color:#7ed3a8;padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Figtree',sans-serif;transition:all .15s;margin-left:4px;}
        .pay-btn:hover{background:rgba(126,211,168,0.2);}
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
          {navLink('/clients', 'Clients')}
          {navLink('/factures', 'Factures', true)}
          {navLink('/devis', 'Devis')}
          {navLink('/parametres', '⚙️ Paramètres')}
          <button onClick={handleLogout} style={{ background: 'rgba(240,138,99,.1)', border: '1px solid rgba(240,138,99,.25)', borderRadius: 9, color: '#f08a63', padding: '7px 14px', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Figtree',sans-serif", marginLeft: 6 }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: '#f2ebdc', margin: '0 0 40px', letterSpacing: '-0.01em' }}>
          Nouvelle facture
        </h1>

        {/* Client */}
        <div style={card}>
          <h3 style={{ color: '#db6e44', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 14px' }}>Client</h3>
          <select className="f-inp" value={clientId} onChange={e => setClientId(e.target.value)} style={{ ...inp, appearance: 'none' as any }}>
            <option value="">Choisir un client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>

        {/* Lignes */}
        <div style={card}>
          <h3 style={{ color: '#db6e44', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 16px' }}>Lignes de facture</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.8fr 0.6fr 28px', gap: 8, marginBottom: 8 }}>
            {['Description', 'Qté', 'Prix HT €', 'TVA %', ''].map((h, i) => (
              <span key={i} style={{ color: 'rgba(242,235,220,0.35)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{h}</span>
            ))}
          </div>
          {lignes.map((ligne, i) => (
            <div key={i} className="ligne-row">
              <input className="f-inp" style={inp} placeholder="Description" value={ligne.description} onChange={e => { const nl = [...lignes]; nl[i].description = e.target.value; setLignes(nl) }} />
              <input className="f-inp" type="number" style={inp} placeholder="1" value={ligne.quantite} onChange={e => { const nl = [...lignes]; nl[i].quantite = e.target.value; setLignes(nl) }} />
              <input className="f-inp" type="number" style={inp} placeholder="150" value={ligne.prix_unitaire} onChange={e => { const nl = [...lignes]; nl[i].prix_unitaire = e.target.value; setLignes(nl) }} />
              <select className="f-inp" style={{ ...inp, appearance: 'none' as any }} value={ligne.taux_tva} onChange={e => { const nl = [...lignes]; nl[i].taux_tva = parseInt(e.target.value); setLignes(nl) }}>
                <option value={21}>21%</option>
                <option value={12}>12%</option>
                <option value={6}>6%</option>
                <option value={0}>0%</option>
              </select>
              {lignes.length > 1
                ? <button onClick={() => setLignes(lignes.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(240,138,99,0.5)', cursor: 'pointer', fontSize: 18, padding: 0 }}>×</button>
                : <span />}
            </div>
          ))}
          <button onClick={() => setLignes([...lignes, { description: '', quantite: '', prix_unitaire: '', taux_tva: 21 }])}
            style={{ color: '#db6e44', background: 'rgba(219,110,68,0.08)', border: '1px solid rgba(219,110,68,0.2)', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '8px 16px', marginTop: 8, fontFamily: "'Figtree',sans-serif" }}>
            + Ajouter une ligne
          </button>
        </div>

        {/* Total */}
        <div style={{ ...card, textAlign: 'right' as const }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(242,235,220,0.45)', fontSize: 14 }}>Total HTVA</span>
              <span style={{ color: 'rgba(242,235,220,0.7)', fontWeight: 600 }}>{htva.toFixed(2)} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(242,235,220,0.45)', fontSize: 14 }}>TVA</span>
              <span style={{ color: 'rgba(242,235,220,0.7)', fontWeight: 600 }}>{tva.toFixed(2)} €</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(219,110,68,0.2)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(242,235,220,0.55)', fontSize: 14, fontWeight: 600 }}>Total TVAC</span>
              <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 36, color: '#e8c56a', fontWeight: 400 }}>{tvac.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <button onClick={creerFacture} style={{ width: '100%', padding: 16, background: '#db6e44', border: 'none', borderRadius: 13, color: '#15110d', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 12, boxShadow: '0 8px 24px rgba(219,110,68,.3)', fontFamily: "'Figtree',sans-serif" }}>
          Créer la facture
        </button>

        {derniereFacture && (
          <button onClick={telechargerPDF} disabled={pdfEnCours === derniereFacture?.id}
            style={{ width: '100%', padding: 16, background: 'rgba(126,211,168,0.15)', border: '1px solid rgba(126,211,168,0.3)', borderRadius: 13, color: '#7ed3a8', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 16, fontFamily: "'Figtree',sans-serif" }}>
            {pdfEnCours === derniereFacture?.id ? '⏳ Génération...' : '📄 Télécharger le PDF — ' + derniereFacture.numero}
          </button>
        )}

        {message && <p style={{ textAlign: 'center', color: message.includes('Erreur') ? '#f08a63' : '#7ed3a8', marginBottom: 24, fontWeight: 600 }}>{message}</p>}

        {/* Liste */}
        <div style={card}>
          <h3 style={{ color: '#db6e44', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>Mes factures ({mesFactures.length})</h3>
          {mesFactures.length === 0 ? (
            <p style={{ color: 'rgba(242,235,220,.3)', textAlign: 'center', padding: 24 }}>Aucune facture</p>
          ) : mesFactures.map(f => (
            <div key={f.id} className="facture-row">
              <div>
                <p style={{ color: '#f2ebdc', fontWeight: 700, margin: '0 0 3px', fontSize: 15 }}>{f.numero}</p>
                <p style={{ color: 'rgba(242,235,220,.4)', margin: 0, fontSize: 13 }}>{f.clients?.nom}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ textAlign: 'right' as const, marginRight: 8 }}>
                  <p style={{ fontFamily: "'Instrument Serif',serif", color: '#e8c56a', fontWeight: 400, fontSize: 20, margin: '0 0 4px' }}>{f.total_tvac?.toFixed(2)} €</p>
                  <span style={statutStyle(f.statut)}>{f.statut}</span>
                </div>
                <button className="pdf-btn" onClick={() => telechargerPDFExistant(f)} disabled={pdfEnCours === f.id}>
                  {pdfEnCours === f.id ? '⏳' : '📄 PDF'}
                </button>
                {f.statut !== 'payee' && (
                  <button className="pay-btn" onClick={() => changerStatut(f.id, 'payee')}>✅ Payée</button>
                )}
                <button className="del-btn" onClick={() => supprimerFacture(f.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
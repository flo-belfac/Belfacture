import Link from 'next/link'

export default function Home() {
return (
<div style={{
minHeight: '100vh',
background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
fontFamily: "'Segoe UI', sans-serif",
color: 'white'
}}>

{/* NAVBAR */}
<nav style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: '20px 48px',
borderBottom: '1px solid rgba(255,255,255,0.06)'
}}>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
<div style={{
background: 'linear-gradient(135deg, #667eea, #764ba2)',
borderRadius: '10px',
width: '36px',
height: '36px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '18px'
}}>⚡</div>
<span style={{
fontWeight: '800',
fontSize: '20px',
background: 'linear-gradient(135deg, #667eea, #a78bfa)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent'
}}>BelFacture</span>
</div>
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
<Link href="/login" style={{
color: 'rgba(255,255,255,0.6)',
textDecoration: 'none',
fontSize: '14px',
fontWeight: '500'
}}>
Se connecter
</Link>
<Link href="/login" style={{
background: 'linear-gradient(135deg, #667eea, #764ba2)',
color: 'white',
textDecoration: 'none',
padding: '10px 24px',
borderRadius: '10px',
fontSize: '14px',
fontWeight: '700',
boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
}}>
Essayer gratuitement →
</Link>
</div>
</nav>

{/* HERO */}
<div style={{
textAlign: 'center',
padding: '100px 24px 80px',
maxWidth: '800px',
margin: '0 auto'
}}>
<div style={{
display: 'inline-block',
background: 'rgba(102,126,234,0.15)',
border: '1px solid rgba(102,126,234,0.3)',
borderRadius: '20px',
padding: '8px 20px',
fontSize: '13px',
color: '#a78bfa',
marginBottom: '32px',
fontWeight: '600'
}}>
🇧🇪 Obligatoire depuis janvier 2026 — Peppol Belgique
</div>

<h1 style={{
fontSize: '56px',
fontWeight: '900',
lineHeight: '1.1',
marginBottom: '24px',
background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent'
}}>
Envoyez vos factures<br />électroniques en<br />60 secondes
</h1>

<p style={{
fontSize: '20px',
color: 'rgba(255,255,255,0.5)',
marginBottom: '48px',
lineHeight: '1.6'
}}>
BelFacture met les indépendants belges en conformité avec la loi Peppol 2026.<br />
Simple, rapide, 100% belge. Sans stress, sans comptable.
</p>

<div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
<Link href="/login" style={{
background: 'linear-gradient(135deg, #667eea, #764ba2)',
color: 'white',
textDecoration: 'none',
padding: '18px 40px',
borderRadius: '14px',
fontSize: '18px',
fontWeight: '700',
boxShadow: '0 8px 30px rgba(102,126,234,0.5)'
}}>
Commencer gratuitement →
</Link>
<a href="#features" style={{
background: 'rgba(255,255,255,0.06)',
border: '1px solid rgba(255,255,255,0.12)',
color: 'white',
textDecoration: 'none',
padding: '18px 40px',
borderRadius: '14px',
fontSize: '18px',
fontWeight: '600'
}}>
En savoir plus
</a>
</div>
</div>

{/* ALERTE AMENDE */}
<div style={{
maxWidth: '700px',
margin: '0 auto 80px',
background: 'rgba(248,113,113,0.08)',
border: '1px solid rgba(248,113,113,0.25)',
borderRadius: '20px',
padding: '24px 32px',
textAlign: 'center'
}}>
<p style={{ margin: 0, fontSize: '16px', color: '#fca5a5' }}>
⚠️ Sans logiciel Peppol conforme, vous risquez jusqu'à <strong style={{ color: '#f87171' }}>5.000€ d'amende</strong> par infraction. BelFacture vous protège.
</p>
</div>

{/* FEATURES */}
<div id="features" style={{
maxWidth: '1100px',
margin: '0 auto',
padding: '0 24px 100px'
}}>
<h2 style={{
textAlign: 'center',
fontSize: '36px',
fontWeight: '800',
marginBottom: '16px'
}}>
Tout ce dont vous avez besoin
</h2>
<p style={{
textAlign: 'center',
color: 'rgba(255,255,255,0.4)',
marginBottom: '64px',
fontSize: '16px'
}}>
Une app simple qui fait tout le travail pour vous
</p>

<div style={{
display: 'grid',
gridTemplateColumns: 'repeat(3, 1fr)',
gap: '24px',
marginBottom: '48px'
}}>
{[
{ icon: '⚡', title: 'Envoi Peppol officiel', desc: 'Vos factures sont envoyées automatiquement sur le réseau officiel belge. 100% conforme.', color: '#667eea' },
{ icon: '📄', title: 'PDF professionnel', desc: 'Générez des factures PDF élégantes en un clic. Parfait pour votre comptable.', color: '#a78bfa' },
{ icon: '📋', title: 'Devis & Acomptes', desc: 'Créez des devis et gérez vos acomptes progressifs. Idéal pour les artisans et entrepreneurs.', color: '#34d399' },
{ icon: '🇧🇪', title: '100% belge', desc: 'Conçu spécifiquement pour les indépendants belges. TVA 6%, 12%, 21% intégrée.', color: '#f59e0b' },
{ icon: '💶', title: 'Déduction 120%', desc: 'Votre abonnement est déductible à 120% de vos impôts. BelFacture se rembourse tout seul !', color: '#34d399' },
{ icon: '👥', title: 'Gestion clients', desc: 'Centralisez tous vos clients et retrouvez leur historique de facturation en un clin d\'œil.', color: '#667eea' }
].map((f, i) => (
<div key={i} style={{
background: 'rgba(255,255,255,0.04)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '20px',
padding: '28px'
}}>
<div style={{
background: `${f.color}22`,
border: `1px solid ${f.color}44`,
borderRadius: '14px',
width: '52px',
height: '52px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '24px',
marginBottom: '16px'
}}>{f.icon}</div>
<h3 style={{ color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>{f.title}</h3>
<p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
</div>
))}
</div>
</div>

{/* PRICING */}
<div style={{
maxWidth: '900px',
margin: '0 auto',
padding: '0 24px 100px',
textAlign: 'center'
}}>
<h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
Tarifs simples et transparents
</h2>
<p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '64px', fontSize: '16px' }}>
Sans engagement, sans frais cachés
</p>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
{[
{
plan: 'Starter',
prix: 'Gratuit',
desc: 'Pour commencer',
features: ['5 factures/mois', 'Export PDF', 'Gestion clients'],
color: '#667eea',
highlight: false
},
{
plan: 'Solo',
prix: '9€',
desc: '/mois',
features: ['Factures illimitées', 'Envoi Peppol officiel', 'Devis & acomptes', 'Export PDF', 'Support réactif'],
color: '#a78bfa',
highlight: true
},
{
plan: 'Pro',
prix: '19€',
desc: '/mois',
features: ['Tout Solo inclus', 'Multi-utilisateurs', 'Statistiques avancées', 'Support prioritaire'],
color: '#34d399',
highlight: false
}
].map((p, i) => (
<div key={i} style={{
background: p.highlight ? 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))' : 'rgba(255,255,255,0.04)',
border: p.highlight ? '2px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)',
borderRadius: '24px',
padding: '36px 28px',
position: 'relative'
}}>
{p.highlight && (
<div style={{
position: 'absolute',
top: '-14px',
left: '50%',
transform: 'translateX(-50%)',
background: 'linear-gradient(135deg, #667eea, #764ba2)',
borderRadius: '20px',
padding: '4px 16px',
fontSize: '12px',
fontWeight: '700',
whiteSpace: 'nowrap'
}}>
⭐ Le plus populaire
</div>
)}
<h3 style={{ color: p.color, fontWeight: '700', marginBottom: '8px' }}>{p.plan}</h3>
<div style={{ fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{p.prix}</div>
<div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>{p.desc}</div>
{p.features.map((feat, j) => (
<div key={j} style={{
display: 'flex',
alignItems: 'center',
gap: '10px',
marginBottom: '10px',
textAlign: 'left'
}}>
<span style={{ color: p.color, fontSize: '16px' }}>✓</span>
<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{feat}</span>
</div>
))}
<Link href="/login" style={{
display: 'block',
marginTop: '24px',
padding: '14px',
background: p.highlight ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.08)',
border: p.highlight ? 'none' : '1px solid rgba(255,255,255,0.15)',
borderRadius: '12px',
color: 'white',
textDecoration: 'none',
fontWeight: '700',
fontSize: '15px',
boxShadow: p.highlight ? '0 4px 20px rgba(102,126,234,0.4)' : 'none'
}}>
Commencer →
</Link>
</div>
))}
</div>
</div>

{/* FAQ */}
<div style={{
maxWidth: '700px',
margin: '0 auto',
padding: '0 24px 100px'
}}>
<h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: '800', marginBottom: '48px' }}>
Questions fréquentes
</h2>
{[
{ q: "C'est quoi Peppol ?", r: "Peppol est le réseau officiel européen de facturation électronique. Depuis janvier 2026, toutes les entreprises belges assujetties à la TVA doivent l'utiliser pour leurs factures B2B." },
{ q: "Je ne suis pas tech, c'est compliqué ?", r: "Non ! Si vous savez envoyer un email, vous savez utiliser BelFacture. Inscription en 2 minutes, première facture en 60 secondes." },
{ q: "Mon comptable peut accéder à mes factures ?", r: "Oui ! Vous pouvez lui envoyer les PDFs directement ou lui donner accès à votre compte." },
{ q: "Je peux annuler quand je veux ?", r: "Oui, sans engagement et sans frais cachés. Vous annulez en un clic depuis votre profil." }
].map((faq, i) => (
<div key={i} style={{
background: 'rgba(255,255,255,0.04)',
border: '1px solid rgba(255,255,255,0.08)',
borderRadius: '16px',
padding: '24px',
marginBottom: '12px'
}}>
<h4 style={{ color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>
{faq.q}
</h4>
<p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
{faq.r}
</p>
</div>
))}
</div>

{/* CTA FINAL */}
<div style={{
textAlign: 'center',
padding: '80px 24px',
borderTop: '1px solid rgba(255,255,255,0.06)'
}}>
<h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>
Prêt à vous mettre en conformité ?
</h2>
<p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '40px', fontSize: '18px' }}>
Rejoignez les indépendants belges qui facturent sereinement
</p>
<Link href="/login" style={{
background: 'linear-gradient(135deg, #667eea, #764ba2)',
color: 'white',
textDecoration: 'none',
padding: '20px 48px',
borderRadius: '16px',
fontSize: '20px',
fontWeight: '700',
boxShadow: '0 8px 40px rgba(102,126,234,0.5)',
display: 'inline-block'
}}>
Commencer gratuitement →
</Link>
<p style={{ color: 'rgba(255,255,255,0.3)', marginTop: '16px', fontSize: '13px' }}>
🇧🇪 Fait en Belgique · Conforme Peppol 2026 · Sans engagement
</p>
</div>

</div>
)
}
import Link from 'next/link'

export const metadata = { title: "Mentions légales – BelFacture" }

export default function MentionsLegales() {
  return (
    <div style={{ minHeight: '100vh', background: '#15110d', color: '#f2ebdc', fontFamily: "'Figtree', sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>
        <Link href="/" style={{ color: '#db6e44', textDecoration: 'none', fontSize: 14 }}>← Retour</Link>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, fontWeight: 400, margin: '24px 0 8px' }}>Mentions légales</h1>
        <p style={{ color: 'rgba(242,235,220,0.4)', fontSize: 13, marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>Éditeur du site</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.8 }}>
            <strong>[NOM DE LA SOCIÉTÉ]</strong><br />
            [Forme juridique : SRL / SA / Indépendant personne physique]<br />
            BCE n° : <strong>[NUMÉRO BCE]</strong><br />
            N° de TVA : <strong>BE [NUMÉRO TVA]</strong><br />
            Siège social : <strong>[ADRESSE COMPLÈTE]</strong><br />
            Email : <a href="mailto:[EMAIL]" style={{ color: '#db6e44' }}>[EMAIL]</a><br />
            Téléphone : <strong>[NUMÉRO DE TÉLÉPHONE]</strong>
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>Hébergement</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.8 }}>
            <strong>Vercel Inc.</strong><br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723, États-Unis<br />
            <a href="https://vercel.com" target="_blank" style={{ color: '#db6e44' }}>vercel.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>Base de données</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.8 }}>
            <strong>Supabase Inc.</strong><br />
            970 Toa Payoh North, Singapour<br />
            <a href="https://supabase.com" target="_blank" style={{ color: '#db6e44' }}>supabase.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>Paiement</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.8 }}>
            Les paiements sont traités par <strong>Stripe Payments Europe, Ltd.</strong>, 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irlande. Stripe est agréé par la Banque Centrale d'Irlande.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>Propriété intellectuelle</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            L'ensemble du contenu de ce site (textes, graphismes, logo, code) est la propriété exclusive de [NOM DE LA SOCIÉTÉ] et est protégé par le droit belge et européen de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>Droit applicable</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Le présent site est soumis au droit belge. Tout litige sera soumis aux juridictions compétentes de Belgique.
          </p>
        </section>
      </div>
    </div>
  )
}

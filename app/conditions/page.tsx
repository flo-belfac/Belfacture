import Link from 'next/link'

export const metadata = { title: "Conditions générales – BelFacture" }

export default function Conditions() {
  return (
    <div style={{ minHeight: '100vh', background: '#15110d', color: '#f2ebdc', fontFamily: "'Figtree', sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>
        <Link href="/" style={{ color: '#db6e44', textDecoration: 'none', fontSize: 14 }}>← Retour</Link>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, fontWeight: 400, margin: '24px 0 8px' }}>Conditions générales</h1>
        <p style={{ color: 'rgba(242,235,220,0.4)', fontSize: 13, marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>1. Identification de l'éditeur</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            BelFacture est édité par <strong>[NOM DE LA SOCIÉTÉ]</strong>, [FORME JURIDIQUE], inscrite à la Banque-Carrefour des Entreprises sous le numéro <strong>[NUMÉRO BCE]</strong>, dont le siège social est situé à <strong>[ADRESSE COMPLÈTE]</strong>, Belgique.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>2. Objet</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            BelFacture est une application SaaS de facturation destinée aux indépendants et TPE belges. Les présentes conditions générales régissent l'accès et l'utilisation de la plateforme accessible à l'adresse belfacture.vercel.app.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>3. Accès au service</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            L'inscription est réservée aux personnes physiques ou morales disposant de la capacité juridique. L'utilisateur s'engage à fournir des informations exactes lors de son inscription et à les maintenir à jour.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>4. Abonnements et facturation</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Les abonnements payants (Solo à 12€/mois, Pro à 24€/mois) sont facturés mensuellement via Stripe. L'utilisateur peut résilier à tout moment depuis son espace abonnement. Aucun remboursement n'est prévu pour les périodes entamées.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>5. Responsabilité</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            BelFacture met à disposition des outils de facturation conformes à la législation belge en vigueur. L'utilisateur reste seul responsable de l'exactitude des données saisies et de la conformité fiscale de ses documents. BelFacture ne peut être tenu responsable d'éventuelles erreurs comptables ou fiscales.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>6. Droit applicable</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Les présentes conditions sont soumises au droit belge. Tout litige relève de la compétence exclusive des tribunaux de l'arrondissement judiciaire de <strong>[VILLE]</strong>, Belgique.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>7. Contact</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Pour toute question : <a href="mailto:[EMAIL]" style={{ color: '#db6e44' }}>[EMAIL DE CONTACT]</a>
          </p>
        </section>
      </div>
    </div>
  )
}

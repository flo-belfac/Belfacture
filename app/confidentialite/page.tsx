import Link from 'next/link'

export const metadata = { title: "Politique de confidentialité – BelFacture" }

export default function Confidentialite() {
  return (
    <div style={{ minHeight: '100vh', background: '#15110d', color: '#f2ebdc', fontFamily: "'Figtree', sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>
        <Link href="/" style={{ color: '#db6e44', textDecoration: 'none', fontSize: 14 }}>← Retour</Link>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, fontWeight: 400, margin: '24px 0 8px' }}>Politique de confidentialité</h1>
        <p style={{ color: 'rgba(242,235,220,0.4)', fontSize: 13, marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>1. Responsable du traitement</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Le responsable du traitement des données personnelles est <strong>[NOM DE LA SOCIÉTÉ]</strong>, [FORME JURIDIQUE], BCE n° <strong>[NUMÉRO BCE]</strong>, situé à <strong>[ADRESSE]</strong>, Belgique. Contact : <a href="mailto:[EMAIL]" style={{ color: '#db6e44' }}>[EMAIL]</a>
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>2. Données collectées</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Nous collectons les données suivantes :
          </p>
          <ul style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 2, paddingLeft: 20, marginTop: 8 }}>
            <li>Données d'identification : nom, prénom, adresse email</li>
            <li>Données de facturation : coordonnées d'entreprise, numéro de TVA, IBAN</li>
            <li>Données de paiement : traitées exclusivement par Stripe (nous ne stockons pas les données de carte)</li>
            <li>Données d'utilisation : logs de connexion, actions dans l'application</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>3. Finalités du traitement</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Vos données sont utilisées pour : la fourniture du service de facturation, la gestion de votre abonnement, l'envoi de notifications liées au service, et le respect de nos obligations légales belges.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>4. Base légale (RGPD)</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Le traitement est fondé sur l'exécution du contrat (art. 6.1.b RGPD) pour la fourniture du service, et sur notre intérêt légitime (art. 6.1.f RGPD) pour l'amélioration du service.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>5. Conservation des données</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Vos données sont conservées pendant la durée de votre abonnement et 7 ans après sa résiliation (obligation légale belge de conservation des documents comptables).
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>6. Sous-traitants</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Nous faisons appel aux sous-traitants suivants : <strong>Supabase</strong> (hébergement base de données), <strong>Stripe</strong> (paiement), <strong>Vercel</strong> (hébergement application). Tous sont conformes au RGPD.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#db6e44' }}>7. Vos droits</h2>
          <p style={{ color: 'rgba(242,235,220,0.75)', lineHeight: 1.7 }}>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits, contactez-nous à <a href="mailto:[EMAIL]" style={{ color: '#db6e44' }}>[EMAIL]</a>. Vous pouvez également introduire une réclamation auprès de l'Autorité de protection des données belge (<a href="https://www.autoriteprotectiondonnees.be" target="_blank" style={{ color: '#db6e44' }}>autoriteprotectiondonnees.be</a>).
          </p>
        </section>
      </div>
    </div>
  )
}

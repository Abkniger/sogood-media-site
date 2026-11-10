# So’Good Media — Cloudflare Pages

Ce dossier contient le site web et sa fonction serveur Cloudflare Pages pour recevoir les demandes de devis par e-mail.

## Contenu
- `index.html` : site So’Good Media, avec les photos intégrées et le formulaire.
- `functions/api/devis.js` : endpoint sécurisé `POST /api/devis` qui transmet chaque demande à l’adresse Gmail configurée dans le code.

## Déploiement sur Cloudflare Pages
1. Décompressez ce ZIP.
2. Dans Cloudflare, ouvrez **Workers & Pages** puis créez un projet **Pages**. Pour conserver la fonction serveur, déployez le dossier avec Git (dépôt connecté) ou avec Wrangler CLI — le simple téléversement des seuls fichiers statiques ne suffit pas pour déployer `functions/`.
3. Avec Wrangler, depuis le dossier décompressé, utilisez : `npx wrangler pages deploy . --project-name NOM-DU-PROJET`. Le dossier `functions/` doit rester à la racine, au même niveau que `index.html`, afin que Cloudflare détecte la fonction `/api/devis`.
4. Dans **Settings → Variables and Secrets**, ajoutez les deux variables suivantes comme secrets :
   - `RESEND_API_KEY` : votre clé API Resend.
   - `FROM_EMAIL` : une adresse expéditrice vérifiée dans Resend, par exemple `So’Good Media <devis@votre-domaine.com>`.
5. Redéployez le projet après avoir ajouté les secrets.

## Important pour la réception Gmail
Le destinataire est actuellement `issoufoutanda@gmail.com`. L'envoi utilise Resend : il faut créer un compte Resend et vérifier un domaine/adresse expéditrice selon les conditions de Resend. Ne mettez jamais la clé API dans `index.html`.

## WhatsApp
Après l'envoi du formulaire, le site affiche les deux liens WhatsApp déjà configurés dans le HTML. Le visiteur doit cliquer sur chaque bouton pour ouvrir WhatsApp et envoyer le message. Un site web ne peut pas expédier automatiquement un message à deux comptes WhatsApp personnels via de simples liens `wa.me`. Pour un envoi WhatsApp automatique côté serveur, il faut intégrer l'API officielle WhatsApp Business avec ses identifiants et modèles de messages.

## Test
Après déploiement, envoyez une demande test depuis le formulaire et vérifiez la réception dans Gmail (y compris le dossier Spam). Si l'e-mail ne part pas, vérifiez les secrets Cloudflare et la configuration de l'expéditeur dans Resend.

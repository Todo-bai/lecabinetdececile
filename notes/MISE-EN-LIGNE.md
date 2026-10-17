# Mise en ligne et bascule du domaine

État au 17/10/2026 :

- Le domaine `lecabinetdececile.com` est enregistré chez **OVH** et ses DNS sont chez OVH (`ns16.ovh.net`, `dns16.ovh.net`).
  **Il expire le 7/12/2026** : activer le renouvellement automatique chez OVH (environ 15 €/an).
- `www.lecabinetdececile.com` pointe vers Squarespace (`CNAME ext-cust.squarespace.com`).
- `lecabinetdececile.com` (sans www) utilise la redirection OVH (`A 213.186.33.5` et `TXT "1|www.lecabinetdececile.com"`).
- Les MX et le SPF OVH (`mx1/mx2/mx3.mail.ovh.net`, `v=spf1 include:mx.ovh.com -all`) ne concernent pas le site.
  **Ne pas y toucher.**

Aucun transfert de domaine n'est nécessaire : on change seulement 2 ou 3 enregistrements DNS chez OVH.

## 1. Publier le site sur GitHub Pages (sans toucher au domaine)

Le code est sur https://github.com/Todo-bai/lecabinetdececile. À chaque push sur `main`, l'action « Publier le site »
vérifie que le site se construit ; elle ne le publie pas tant que l'interrupteur ci-dessous est éteint.

1. Dans le dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
2. **Settings → Secrets and variables → Actions → onglet Variables → New repository variable** :
   nom `PUBLIER`, valeur `oui`.
3. **Actions → Publier le site → Run workflow** (ou faire un push). Une fois l'action verte, le site est visible sur
   `https://todo-bai.github.io/lecabinetdececile/`. Les images et liens y seront cassés tant que le site n'est pas sur
   son domaine (il est prévu pour être à la racine) : ne vérifier que la publication.

## 2. Préparer la bascule (la veille)

1. Chez OVH, **Domaines → lecabinetdececile.com → Zone DNS** : noter ou exporter la zone actuelle (pour revenir en
   arrière si besoin).
2. Baisser le TTL des enregistrements `www` et de la racine à 300 secondes (5 min), pour que le changement se
   propage vite.
3. Dans GitHub : **Settings (du compte) → Pages → Add a verified domain** → `lecabinetdececile.com`. GitHub donne un
   enregistrement `TXT _github-pages-challenge-<compte>` à ajouter chez OVH. Cette vérification empêche quelqu'un
   d'autre de publier sur le domaine.

## 3. Bascule (5 minutes de manipulation)

Dans la zone DNS OVH :

| Action                  | Sous-domaine | Type  | Valeur                                                                     |
| ----------------------- | ------------ | ----- | -------------------------------------------------------------------------- |
| Modifier                | `www`        | CNAME | `<compte>.github.io.`                                                      |
| Supprimer la redirection OVH | (racine) | —     | Onglet **Redirection** : supprimer la redirection vers www, ce qui retire `A 213.186.33.5` et le TXT `1\|www…` |
| Ajouter                 | (racine)     | A     | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| Ajouter (facultatif)    | (racine)     | AAAA  | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |

Puis, dans le dépôt GitHub : **Settings → Pages → Custom domain** → `www.lecabinetdececile.com` → Save. Cocher
**Enforce HTTPS** dès que GitHub le propose (le certificat peut prendre jusqu'à une heure). GitHub redirige
automatiquement `lecabinetdececile.com` vers `www.lecabinetdececile.com`.

## 4. Vérifier

- `https://www.lecabinetdececile.com` affiche le nouveau site, avec le cadenas HTTPS.
- `https://lecabinetdececile.com` redirige vers `www`.
- Les anciens liens fonctionnent : `/home`, `/ateliers/event-one-7cmz6`, etc.
- Les mails vers l'adresse Gmail ne sont pas concernés. Si une adresse `@lecabinetdececile.com` est utilisée chez OVH,
  envoyer un mail de test.
- Dans [Google Search Console](https://search.google.com/search-console) (si déjà utilisé) : soumettre
  `https://www.lecabinetdececile.com/sitemap-index.xml` (voir le point « Plus tard »).

En cas de problème, remettre `www CNAME ext-cust.squarespace.com` chez OVH : Squarespace reprend la main
immédiatement.

## 5. Quitter Squarespace (une fois le nouveau site vérifié, quelques jours plus tard)

1. Squarespace → **Paramètres → Domaines** : déconnecter `lecabinetdececile.com`. Le domaine est chez OVH, cela ne
   le supprime pas.
2. Squarespace → **Facturation** : annuler l'abonnement du site. Vérifier la date de renouvellement pour annuler
   avant le prochain prélèvement.
3. Avant d'annuler, garder une copie de ce qui n'est pas dans ce dépôt (factures, éventuelles adresses de la
   newsletter : le formulaire n'avait pas de stockage configuré, il est donc probablement vide ; sinon, les importer
   dans Brevo).

## Newsletter avec Brevo (gratuit jusqu'à 300 e-mails envoyés par jour)

Le formulaire est prêt dans le site ; il ne manque que l'adresse du formulaire Brevo. Tant qu'elle est vide, le
bouton « S’inscrire » ouvre un e-mail prérempli.

1. Créer un compte sur [brevo.com](https://www.brevo.com) (offre gratuite) avec l'adresse du cabinet.
2. **Contacts → Listes** : créer une liste « Newsletter ateliers ».
3. **Contacts → Formulaires → Créer un formulaire d'inscription** :
   - champ : seulement **E-mail** ;
   - liste : « Newsletter ateliers » ;
   - **double opt-in** activé (e-mail de confirmation, recommandé pour le RGPD) ;
   - après inscription : **rediriger vers une URL** → `https://www.lecabinetdececile.com/merci/`.
4. **Partager → Code HTML** : dans le code fourni, copier l'adresse de l'attribut `action` du `<form>`
   (elle ressemble à `https://xxxx.sibforms.com/serve/MUIF…`) et la coller dans `src/site.ts`, champ `brevoForm`.
5. Commit + push : le formulaire du site envoie maintenant les inscriptions dans la liste Brevo.
6. Pour écrire une newsletter : **Campagnes → Créer une campagne e-mail**, destinataires « Newsletter ateliers ».

## Coût annuel

| Poste                         | Avant                  | Après        |
| ----------------------------- | ---------------------- | ------------ |
| Hébergement                   | abonnement Squarespace | 0 € (GitHub Pages) |
| Domaine `.com` chez OVH       | ≈ 15 €                 | ≈ 15 €       |
| **Total**                     | Squarespace + 15 €     | **≈ 15 €**   |

## Plus tard (optionnel)

- **Plan du site** : ajouter `@astrojs/sitemap` pour générer `sitemap-index.xml` (utile pour Google).
- **Adresse** : le site Squarespace écrivait « Rue de Solitude » et « Rumilies ». Le nouveau site utilise
  l'orthographe officielle « Rue de la Solitude » et « Rumillies ». Vérifier que c'est bien voulu.

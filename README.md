# Le Cabinet de Cécile

Site de [lecabinetdececile.com](https://www.lecabinetdececile.com), cabinet de psychomotricité à Rumillies (Tournai).
C'est un site statique fait avec [Astro](https://astro.build).

## Travailler en local

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:4321. `npm run build` produit la version finale dans `dist/`.

## Où modifier quoi

| Contenu                                        | Fichier                                |
| ---------------------------------------------- | -------------------------------------- |
| Téléphone, e-mail, adresse, Instagram          | `src/site.ts`                          |
| Textes de la page d'accueil                    | `src/pages/index.astro`                |
| Ateliers                                       | `src/content/ateliers/` (un fichier par atelier) |
| Mentions légales                               | `src/pages/mentions-legales.astro`     |
| Couleurs, boutons, typographie (tout le site)  | `src/styles/global.css`                |
| Mise en page des sections de l'accueil         | `src/styles/accueil.css`               |
| Photos                                         | `public/images/`                       |

## Ajouter un atelier

1. Copier un fichier de `src/content/ateliers/` et le renommer, par exemple `2026-11-14-eveil-moteur-marcheurs.md`.
2. Modifier l'en-tête :

   ```md
   ---
   titre: "Éveil moteur marcheurs"
   date: "2026-11-14"
   debut: "10:30"
   fin: "11:30"
   image: "/images/ateliers/eveil-marcheurs.jpg"
   ---

   Infos et inscriptions par mail, GSM ou MP.
   ```

3. Mettre la photo dans `public/images/ateliers/`, puis faire un commit et un push sur `main`.

Les ateliers à venir apparaissent en haut de la page Ateliers et passent seuls dans « Ateliers passés » une fois
la date dépassée. Les liens Google Agenda et `.ics` sont générés automatiquement.

## Mise en ligne

Le site est publié par GitHub Pages (voir `.github/workflows/deploy.yml`). Les étapes de la première mise en ligne
et de la bascule du nom de domaine sont décrites dans [MISE-EN-LIGNE.md](MISE-EN-LIGNE.md).

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Pages à ne pas proposer à Google : la page de remerciement de la newsletter,
// et les anciennes adresses Squarespace qui ne font que rediriger.
const horsPlan = (page) => {
  const { pathname } = new URL(page);
  if (pathname === "/merci/" || pathname === "/home/") return false;
  // Les fiches d'atelier ont une adresse qui commence par leur date (AAAA-MM-JJ-…) ;
  // les autres adresses sous /ateliers/ sont les anciens liens Squarespace.
  const atelier = pathname.match(/^\/ateliers\/([^/]+)\/$/);
  return !atelier || /^\d{4}-\d{2}-\d{2}-/.test(atelier[1]);
};

export default defineConfig({
  site: "https://www.lecabinetdececile.com",
  integrations: [sitemap({ filter: horsPlan })],
  // Anciennes adresses Squarespace (celles des ateliers sont gérées dans src/pages/ateliers/[id].astro).
  redirects: {
    "/home": "/",
  },
});

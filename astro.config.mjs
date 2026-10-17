import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.lecabinetdececile.com",
  // Anciennes adresses Squarespace (celles des ateliers sont gérées dans src/pages/ateliers/[id].astro).
  redirects: {
    "/home": "/",
  },
});

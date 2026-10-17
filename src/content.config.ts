import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Un atelier = un fichier .md dans src/content/ateliers/.
const ateliers = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ateliers" }),
  schema: z.object({
    titre: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date au format AAAA-MM-JJ"),
    debut: z.string().regex(/^\d{2}:\d{2}$/, "heure au format HH:MM"),
    fin: z.string().regex(/^\d{2}:\d{2}$/, "heure au format HH:MM"),
    image: z.string().optional(),
    lieu: z.string().default("Le Cabinet de Cécile"),
    adresse: z.string().default("34 Rue de la Solitude, 7540 Tournai, Belgique"),
    // Ancienne adresse de la page sur Squarespace, pour rediriger les vieux liens.
    ancienSlug: z.string().optional(),
  }),
});

export const collections = { ateliers };

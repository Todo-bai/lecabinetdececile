import { getCollection, type CollectionEntry } from "astro:content";

export type Atelier = CollectionEntry<"ateliers">;

const TZ = "Europe/Brussels";

// Décalage horaire de Bruxelles ce jour-là (+01:00 en hiver, +02:00 en été).
function offset(date: string): string {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value;
  return name === "GMT" ? "+00:00" : (name ?? "GMT+01:00").replace("GMT", "");
}

export const debut = (a: Atelier) => new Date(`${a.data.date}T${a.data.debut}:00${offset(a.data.date)}`);
export const fin = (a: Atelier) => new Date(`${a.data.date}T${a.data.fin}:00${offset(a.data.date)}`);

export async function tousLesAteliers() {
  const ateliers = await getCollection("ateliers");
  return ateliers.sort((a, b) => debut(b).getTime() - debut(a).getTime());
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-BE", { timeZone: TZ, ...opts });
export const jourLong = (a: Atelier) => fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(debut(a));
export const mois = (a: Atelier) => fmt({ month: "short" }).format(debut(a));
export const jour = (a: Atelier) => fmt({ day: "numeric" }).format(debut(a));
export const jourCourt = (a: Atelier) => fmt({ day: "numeric", month: "long" }).format(debut(a));

const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function lienGoogleAgenda(a: Atelier) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: a.data.titre,
    dates: `${utc(debut(a))}/${utc(fin(a))}`,
    location: a.data.adresse,
  });
  return `https://www.google.com/calendar/render?${params}`;
}

export const lienCarte = (a: Atelier) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(a.data.adresse)}`;

export function ics(a: Atelier, url: string) {
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Le Cabinet de Cecile//Ateliers//FR",
    "BEGIN:VEVENT",
    `UID:${a.id}@lecabinetdececile.com`,
    `DTSTAMP:${utc(debut(a))}`,
    `DTSTART:${utc(debut(a))}`,
    `DTEND:${utc(fin(a))}`,
    `SUMMARY:${esc(a.data.titre)}`,
    `LOCATION:${esc(`${a.data.lieu}, ${a.data.adresse}`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

// Premier paragraphe du texte de l'atelier, sans mise en forme Markdown.
export function resume(a: Atelier) {
  const ligne = (a.body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    // Les listes et la ligne « Infos et inscriptions… » ne décrivent pas l'atelier.
    .find((p) => p && !p.startsWith("-") && !p.startsWith("Infos"));
  return ligne ?? "";
}

export const descriptionAtelier = (a: Atelier) =>
  `${a.data.titre}, le ${jourLong(a)} de ${a.data.debut.replace(":", "h")} à ${a.data.fin.replace(":", "h")} ` +
  `au Cabinet de Cécile, psychomotricienne à Rumillies (Tournai). Inscriptions par mail ou téléphone.`;

// Données structurées « événement » (schema.org) pour que Google puisse afficher l'atelier.
export function evenement(a: Atelier, url: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: a.data.titre,
    description: resume(a) || descriptionAtelier(a),
    startDate: debut(a).toISOString(),
    endDate: fin(a).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: url.toString(),
    ...(a.data.image && { image: [new URL(a.data.image, url).toString()] }),
    location: {
      "@type": "Place",
      name: a.data.lieu,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rue de la Solitude 34",
        postalCode: "7540",
        addressLocality: "Tournai",
        addressCountry: "BE",
      },
    },
    organizer: { "@type": "Organization", name: "Le Cabinet de Cécile", url: "https://www.lecabinetdececile.com/" },
  };
}

import type { APIRoute } from "astro";
import { type Atelier, ics, tousLesAteliers } from "../../ateliers";

export async function getStaticPaths() {
  return (await tousLesAteliers()).map((a) => ({ params: { id: a.id }, props: { atelier: a } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const atelier = props.atelier as Atelier;
  const url = new URL(`/ateliers/${atelier.id}/`, site).toString();
  return new Response(ics(atelier, url), { headers: { "Content-Type": "text/calendar; charset=utf-8" } });
};

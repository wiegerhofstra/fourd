// The CMS calls this when an editor clicks Revalidate (Settings → Revalidation in the CMS).
// It clears every cached CMS response: pages, navigation, redirects and services.
// Register https://<site>/api/revalidate there with the same secret as CMS_REVALIDATION_SECRET.
import type { APIRoute } from "astro";
import { CMS_REVALIDATION_SECRET } from "astro:env/server";
import { handleRevalidation } from "../../../docs/cms/revalidation";
import { invalidateCmsCache } from "../../lib/cms";

export const ALL: APIRoute = ({ request }) =>
  handleRevalidation(request, { secret: CMS_REVALIDATION_SECRET, invalidate: invalidateCmsCache });

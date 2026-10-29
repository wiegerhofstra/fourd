// Stable URLs for CMS files: /media/<assetId>. The CMS only hands out signed URLs that expire after
// five minutes, so this route looks up a fresh one and streams the bytes from our own domain.
// An asset ID always points to the same file, which makes the response safe to cache forever.
import type { APIRoute } from "astro";
import { cms, CmsApiError } from "../../lib/cms";

const assetIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const notFound = () => new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });

export const GET: APIRoute = async ({ params }) => {
  const assetId = params.assetId ?? "";
  if (!assetIdPattern.test(assetId)) return notFound();

  try {
    const { data } = await cms.getAsset(assetId);
    const file = await fetch(data.url, { signal: AbortSignal.timeout(15000) });
    if (!file.ok || !file.body) return new Response(null, { status: 502, headers: { "Cache-Control": "no-store" } });
    return new Response(file.body, {
      headers: {
        "Content-Type": data.mimeType || "application/octet-stream",
        ...(file.headers.get("content-length") ? { "Content-Length": file.headers.get("content-length")! } : {}),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        // Files are shown inline; anything that is not an image or PDF downloads instead of rendering as a page.
        ...(/^image\/(?!svg)|^application\/pdf$/.test(data.mimeType) ? {} : { "Content-Disposition": "attachment" }),
      },
    });
  } catch (error) {
    if (error instanceof CmsApiError && error.status === 404) return notFound();
    console.error("[cms] Asset unavailable", error);
    return new Response(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
};

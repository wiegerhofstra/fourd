// This endpoint runs only during the build (or local development), emitting real static files.
import type { APIRoute, GetStaticPaths } from "astro";
import type { DeliveryAsset } from "../../../docs/cms/types";
import { cms, getAssets, mediaFilename } from "../../lib/cms";

export const getStaticPaths = (async () => (await getAssets()).map((asset) => ({
  params: { file: mediaFilename(asset) },
  props: { asset },
}))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const asset = props.asset as DeliveryAsset;
  // Request a fresh signed URL immediately before downloading, even during a long build.
  const { data } = await cms.getAsset(asset.id);
  const file = await fetch(data.url, { signal: AbortSignal.timeout(30000) });
  if (!file.ok) throw new Error(`Could not download CMS asset ${asset.id}: HTTP ${file.status}`);
  // Consume the body here so a failed/truncated transfer also fails the build.
  return new Response(await file.arrayBuffer(), {
    headers: { "Content-Type": data.mimeType || "application/octet-stream" },
  });
};

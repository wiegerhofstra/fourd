// This endpoint runs only during the build (or local development), emitting real static files.
// Serving copies keeps the deployed site independent of the CMS, which only needs to be up while building.
import type { APIRoute, GetStaticPaths } from "astro";
import type { DeliveryAsset } from "../../../docs/cms/types";
import { getAssets, mediaFilename } from "../../lib/cms";

export const getStaticPaths = (async () => (await getAssets()).map((asset) => ({
  params: { file: mediaFilename(asset) },
  props: { asset },
}))) satisfies GetStaticPaths;

// Network failures and 5xx responses are retried with a bounded backoff, as the CMS documentation allows.
const attempts = 3;

async function download(asset: DeliveryAsset) {
  for (let attempt = 1; ; attempt++) {
    // The asset url from this build's content snapshot is stable, so it can be fetched directly.
    const file = await fetch(asset.url, { signal: AbortSignal.timeout(30000) }).catch((error) => {
      if (attempt === attempts) throw error;
      return null;
    });
    // Consume the body here so a failed/truncated transfer also fails the build.
    if (file?.ok) return file.arrayBuffer();
    if (file && (file.status < 500 || attempt === attempts)) {
      throw new Error(`Could not download CMS asset ${asset.id}: HTTP ${file.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
  }
}

export const GET: APIRoute = async ({ props }) => {
  const asset = props.asset as DeliveryAsset;
  return new Response(await download(asset), {
    headers: { "Content-Type": asset.mimeType || "application/octet-stream" },
  });
};

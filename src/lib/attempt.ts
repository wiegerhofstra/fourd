/** Runs a CMS read; a failure is logged and returned as null so the page can still render. */
export async function attempt<T>(load: () => Promise<T>): Promise<{ ok: true; value: T } | { ok: false }> {
  try {
    return { ok: true, value: await load() };
  } catch (error) {
    console.error("[cms] Request failed", error);
    return { ok: false };
  }
}

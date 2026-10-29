// Generated from the selected tenant. Regenerate after model changes.
// Raw fields use unknown because delivery does not validate their stored JSON.
export type EntryReference = { id: string; modelId: string };
export type DeliveryEntry<T = Record<string, unknown>> = EntryReference & {
  url: string | null; pageParentId: string | null; status: "published"; data: T; publishedAt: string | null; createdAt: string; updatedAt: string;
};
export type DeliveryAsset = {
  id: string; originalName: string; mimeType: string; sizeBytes: number;
  imageWidth: number | null; imageHeight: number | null; url: string; downloadUrl: string;
};
export type RichTextNode = {
  type: string; text?: string; content?: RichTextNode[];
  attrs?: Record<string, unknown> & { assetId?: string; asset?: DeliveryAsset | null };
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};
export type PageUrlConfig = { pattern: string; slugField: string | null; hierarchy?: boolean };
export type PageResolution = { kind: "page"; modelSlug: string; entry: DeliveryEntry } | { kind: "redirect"; location: string; status: 308 };
export type Model = { id: string; name: string; slug: string; pageUrl: PageUrlConfig | null; status: "active" | "archived"; createdAt: string; updatedAt: string };
export type Field = {
  id: string; key: string; label: string; type: "text" | "rich_text" | "url" | "number" | "boolean" | "date" | "time" | "enum" | "asset" | "component" | "slug";
  required: boolean; position: number; config: Record<string, unknown>; isList: boolean; isTitle: boolean; localized: boolean; targetModelIds: string[];
};
export type ModelDetail = Model & { fields: Field[] };
export type EntryByModel = {
  "menu": DeliveryEntry<{
    "internal_name"?: unknown;
    "items"?: Array<EntryReference | EntryByModel["page"]>;
    [key: string]: unknown;
  }> & { modelId: "4b7dbfbb-eaab-44d7-bd4a-8ef1b97d6c0f" };
  "page": DeliveryEntry<{
    "slug"?: unknown;
    "title"?: unknown;
    "cover_image"?: DeliveryAsset | null;
    "content"?: unknown;
    [key: string]: unknown;
  }> & { modelId: "c14051f7-8f0f-422d-9acf-f568b5c9f1e4" };
  "service": DeliveryEntry<{
    "title"?: unknown;
    "short"?: unknown;
    "intro"?: unknown;
    "page"?: EntryReference | EntryByModel["page"] | null;
    [key: string]: unknown;
  }> & { modelId: "ca392046-8f89-471e-979f-fb1dff75642b" };
};
// Editor intent only: validate/normalize raw values before treating them as these types.
export type ExpectedDataByModel = {
  "menu": {
    "internal_name"?: string | null;
    "items"?: Array<EntryReference | EntryByModel["page"]>;
  };
  "page": {
    "slug"?: string | null;
    "title"?: string | null;
    "cover_image"?: DeliveryAsset | null;
    "content"?: RichTextNode | null;
  };
  "service": {
    "title"?: string | null;
    "short"?: string | null;
    "intro"?: RichTextNode | null;
    "page"?: EntryReference | EntryByModel["page"] | null;
  };
};
export const modelSlugById: Record<string, string> = {
  "4b7dbfbb-eaab-44d7-bd4a-8ef1b97d6c0f": "menu",
  "c14051f7-8f0f-422d-9acf-f568b5c9f1e4": "page",
  "ca392046-8f89-471e-979f-fb1dff75642b": "service"
};
export function isExpandedEntry(value: unknown): value is DeliveryEntry {
  return !!value && typeof value === "object" && "id" in value && typeof value.id === "string"
    && "modelId" in value && typeof value.modelId === "string" && "status" in value && value.status === "published"
    && "data" in value && !!value.data && typeof value.data === "object" && !Array.isArray(value.data);
}

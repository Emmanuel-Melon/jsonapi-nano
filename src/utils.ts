import type { IncludedResource, ResourceConfig } from "./types";

export function formatSingle<
  T extends { id: string | number },
  Context = unknown,
>(
  item: T,
  resource: {
    type: string;
    attributes: (item: T, ctx: Context | undefined) => Record<string, unknown>;
    meta?: (item: T, ctx: Context | undefined) => Record<string, unknown>;
    links?: (
      item: T,
      ctx: Context | undefined,
    ) => Record<string, string | undefined>;
    relationships?: ResourceConfig<T, Context>["relationships"];
  },
  context: Context | undefined,
) {
  if (item.id === null || item.id === undefined) {
    throw new Error("jsonapi-nano: resource item is missing an `id`");
  }

  return {
    type: resource.type,
    id: String(item.id),
    attributes: resource.attributes(item, context),
    ...(resource.relationships && {
      relationships: resource.relationships(item, context),
    }),
    ...(resource.meta && { meta: resource.meta(item, context) }),
    ...(resource.links && { links: resource.links(item, context) }),
  };
}

export function dedupeIncluded(
  included: IncludedResource[],
): IncludedResource[] {
  const seen = new Map<string, IncludedResource>();
  for (const res of included) {
    seen.set(`${res.type}:${res.id}`, res);
  }
  return Array.from(seen.values()).map((r) => ({
    ...r,
    id: String(r.id),
  }));
}

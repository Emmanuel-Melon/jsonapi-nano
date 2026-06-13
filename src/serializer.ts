import type { ResourceConfig } from "./types";
import { applyFieldset } from "./utils";

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
  fields?: Record<string, string[]>,
) {
  if (item.id === null || item.id === undefined) {
    throw new Error("jsonapi-nano: resource item is missing an `id`");
  }

  const attributes = applyFieldset(
    resource.attributes(item, context),
    resource.type,
    fields,
  );
  const relationships = resource.relationships
    ? applyFieldset(
        resource.relationships(item, context),
        resource.type,
        fields,
      )
    : undefined;

  return {
    type: resource.type,
    id: String(item.id),
    ...(attributes && Object.keys(attributes).length > 0 && { attributes }),
    ...(relationships &&
      Object.keys(relationships).length > 0 && { relationships }),
    ...(resource.meta && { meta: resource.meta(item, context) }),
    ...(resource.links && { links: resource.links(item, context) }),
  };
}

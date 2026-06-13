import type { ResourceConfig, SerializeOptions } from "./types";
import { formatSingle } from "./serializer";
import { dedupeIncluded, resolveIncluded } from "./utils";

export function createResource<T, Context = unknown>(
  type: string,
  config?: Omit<ResourceConfig<T, Context>, "type">,
) {
  return {
    type,
    attributes:
      config?.attributes ??
      ((item: T) => {
        const copy = { ...item } as Record<string, unknown>;
        delete copy.id;
        return copy;
      }),
    meta: config?.meta,
    links: config?.links,
    relationships: config?.relationships,
  };
}

export function serialize<T extends { id: string | number }, Context = unknown>(
  data: T | T[],
  resource: ReturnType<typeof createResource<T, Context>>,
  options?: SerializeOptions<Context>,
) {
  const isCollection = Array.isArray(data);
  const context = options?.context;
  const fields = options?.fields;

  const primaryData = isCollection
    ? (data as T[]).map((item) => formatSingle(item, resource, context, fields))
    : [formatSingle(data as T, resource, context, fields)];

  const includedFromRelationships = options?.include
    ? resolveIncluded(primaryData, options.include, context)
    : [];

  const includedExplicit = options?.included ?? [];

  const allIncluded = [...includedFromRelationships, ...includedExplicit];
  const included = allIncluded.length
    ? dedupeIncluded(allIncluded, fields)
    : undefined;

  const includeTimestamp = options?.timestamp !== false;
  const metaObj = {
    ...(includeTimestamp && { timestamp: new Date().toISOString() }),
    ...options?.meta,
  };

  return {
    data: isCollection ? primaryData : primaryData[0],
    ...(included && { included }),
    ...(options?.links && { links: options.links }),
    ...(options?.jsonapi && { jsonapi: options.jsonapi }),
    ...(Object.keys(metaObj).length > 0 && { meta: metaObj }),
  };
}

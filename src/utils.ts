import type { IncludedResource, RelationshipObject } from "./types";
import { formatSingle } from "./serializer";

export function applyFieldset<T extends Record<string, unknown>>(
  obj: T | undefined,
  type: string,
  fields?: Record<string, string[]>,
): T | undefined {
  if (!obj || !fields || !fields[type]) return obj;

  const allowed = new Set(fields[type]);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowed.has(key)),
  ) as T;
}

export function dedupeIncluded(
  included: IncludedResource[],
  fields?: Record<string, string[]>,
): IncludedResource[] {
  const seen = new Map<string, IncludedResource>();
  for (const res of included) {
    seen.set(`${res.type}:${res.id}`, res);
  }
  return Array.from(seen.values()).map((r) => ({
    ...r,
    id: String(r.id),
    ...(r.attributes && {
      attributes: applyFieldset(r.attributes, r.type, fields),
    }),
  }));
}

export function resolveIncluded<Context = unknown>(
  primaryData: Array<{ relationships?: Record<string, RelationshipObject> }>,
  include: Record<string, [Array<{ id: string | number }>, any]>,
  context: Context | undefined,
  fields?: Record<string, string[]>,
): IncludedResource[] {
  const result: IncludedResource[] = [];
  const seen = new Set<string>();

  for (const [relName, [dataset, resource]] of Object.entries(include)) {
    // Composite Key tracking prevents cross-type ID matching collisions
    const wantedCompositeKeys = new Set<string>();

    for (const item of primaryData) {
      const rel = item.relationships?.[relName];
      if (!rel?.data) continue;

      const refs = Array.isArray(rel.data) ? rel.data : [rel.data];
      for (const ref of refs) {
        wantedCompositeKeys.add(`${ref.type}:${ref.id}`);
      }
    }

    for (const entity of dataset) {
      const compositeKey = `${resource.type}:${entity.id}`;
      if (!wantedCompositeKeys.has(compositeKey) || seen.has(compositeKey))
        continue;

      seen.add(compositeKey);

      const formatted = formatSingle(entity, resource, context, fields);
      result.push(formatted as IncludedResource);
    }
  }

  return result;
}

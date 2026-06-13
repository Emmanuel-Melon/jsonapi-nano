import type { RelationshipObject } from "./types";

export function belongsTo(
  type: string,
  id: string | number | null | undefined,
  extra?: Pick<RelationshipObject, "links" | "meta">,
): RelationshipObject {
  return {
    data: id === null || id === undefined ? null : { type, id: String(id) },
    ...extra,
  };
}

export function hasMany(
  type: string,
  ids: Array<string | number>,
  extra?: Pick<RelationshipObject, "links" | "meta">,
): RelationshipObject {
  return {
    data: ids.map((id) => ({ type, id: String(id) })),
    ...extra,
  };
}

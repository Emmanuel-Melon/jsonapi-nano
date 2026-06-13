export function fieldsFromQuery(
  query: Record<string, unknown>,
): Record<string, string[]> | undefined {
  if (
    !query.fields ||
    typeof query.fields !== "object" ||
    Array.isArray(query.fields)
  ) {
    return undefined;
  }

  const fields = query.fields as Record<string, unknown>;
  const result: Record<string, string[]> = {};

  for (const [type, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      result[type] = value.split(",").map((field) => field.trim());
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

import type { ErrorConfig, ResourceConfig, SerializeOptions } from "./types";

export function createResource<T, Context = unknown>(
  type: string,
  config?: Omit<ResourceConfig<T, Context>, "type">,
): {
  type: string;
  attributes: (item: T, ctx: Context | undefined) => Record<string, unknown>;
  meta?: (item: T, ctx: Context | undefined) => Record<string, unknown>;
  links?: (
    item: T,
    ctx: Context | undefined,
  ) => Record<string, string | undefined>;
} {
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
  };
}

export function serialize<T extends { id: string | number }, Context = unknown>(
  data: T | T[],
  resource: ReturnType<typeof createResource<T, Context>>,
  options?: SerializeOptions<Context>,
) {
  const isCollection = Array.isArray(data);
  const context = options?.context;

  const formatSingle = (item: T) => ({
    type: resource.type,
    id: String(item.id),
    attributes: resource.attributes(item, context),
    ...(resource.meta && { meta: resource.meta(item, context) }),
    ...(resource.links && { links: resource.links(item, context) }),
  });

  return {
    data: isCollection
      ? (data as T[]).map(formatSingle)
      : formatSingle(data as T),
    ...(options?.links && { links: options.links }),
    meta: {
      timestamp: new Date().toISOString(),
      ...options?.meta,
    },
  };
}

export function serializeErrors(errors: ErrorConfig | ErrorConfig[]) {
  const errorArray = Array.isArray(errors) ? errors : [errors];
  return {
    errors: errorArray.map((err) => ({
      status: String(err.status),
      title: err.title ?? "Error",
      ...(err.detail && { detail: err.detail }),
      ...(err.code && { code: err.code }),
      ...(err.source && { source: err.source }),
      ...(err.meta && { meta: err.meta }),
    })),
  };
}

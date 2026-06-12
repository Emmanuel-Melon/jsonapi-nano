import type { ResourceConfig, SerializeOptions } from "./types";

export function createResource<T>(
  type: string,
  config?: Omit<ResourceConfig<T>, "type">
) {
  return {
    type,
    attributes: config?.attributes ?? ((item: T) => item as Record<string, unknown>),
    meta: config?.meta,
    links: config?.links,
  };
}

export function serialize<T extends { id: string | number }>(
  data: T | T[],
  resource: ReturnType<typeof createResource<T>>,
  options?: SerializeOptions
) {
  const isCollection = Array.isArray(data);
  
  const formatSingle = (item: T) => ({
    type: resource.type,
    id: String(item.id),
    attributes: resource.attributes(item),
    ...(resource.meta && { meta: resource.meta(item) }),
    ...(resource.links && { links: resource.links(item, options?.context) }),
  });

  return {
    data: isCollection ? data.map(formatSingle) : formatSingle(data),
    ...(options?.links && { links: options.links }),
    metadata: {
      timestamp: new Date().toISOString(),
      ...options?.meta,
    },
  };
}

export interface ErrorConfig {
  status: number;
  title?: string;
  detail?: string;
  code?: string;
  source?: { pointer?: string; method?: string };
  meta?: Record<string, unknown>;
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
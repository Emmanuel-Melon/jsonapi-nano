export interface ResourceConfig<T> {
  type: string;
  attributes?: (item: T) => Record<string, unknown>;
  meta?: (item: T) => Record<string, unknown>;
  links?: (item: T, ctx: any) => Record<string, string | undefined>;
}

export interface SerializeOptions {
  meta?: Record<string, unknown>;
  links?: Record<string, string | undefined>;
  context?: unknown; // we can pass Express 'req', Fastify 'request', etc.
}
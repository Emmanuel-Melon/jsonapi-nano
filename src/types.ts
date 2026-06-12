export interface ResourceConfig<T, Context = unknown> {
  type: string;
  attributes?: (item: T, ctx: Context | undefined) => Record<string, unknown>;
  meta?: (item: T, ctx: Context | undefined) => Record<string, unknown>;
  links?: (
    item: T,
    ctx: Context | undefined,
  ) => Record<string, string | undefined>;
}

export interface SerializeOptions<Context = unknown> {
  meta?: Record<string, unknown>;
  links?: Record<string, string | undefined>;
  context?: Context;
}
export interface ErrorConfig {
  status: number | string;
  title?: string;
  detail?: string;
  code?: string;
  source?: { pointer?: string; parameter?: string };
  meta?: Record<string, unknown>;
}

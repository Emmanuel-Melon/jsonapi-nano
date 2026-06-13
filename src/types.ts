// Relationships & compound documents
export interface RelationshipObject {
  data?: { type: string; id: string } | { type: string; id: string }[] | null;
  links?: { self?: string; related?: string };
  meta?: Record<string, unknown>;
}

export interface IncludedResource {
  type: string;
  id: string | number;
  attributes?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  links?: Record<string, string | undefined>;
}

// Resources
export interface ResourceConfig<T, Context = unknown> {
  type: string;
  attributes?: (item: T, ctx: Context | undefined) => Record<string, unknown>;
  meta?: (item: T, ctx: Context | undefined) => Record<string, unknown>;
  links?: (
    item: T,
    ctx: Context | undefined,
  ) => Record<string, string | undefined>;
  relationships?: (
    item: T,
    ctx: Context | undefined,
  ) => Record<string, RelationshipObject>;
}

// Serialization options
export interface SerializeOptions<Context = unknown> {
  meta?: Record<string, unknown>;
  links?: Record<string, string | undefined>;
  context?: Context;
  included?: IncludedResource[];
  jsonapi?: { version?: string; ext?: string[]; profile?: string[] };
  timestamp?: boolean;
}

// Errors
export interface ErrorConfig {
  status: number | string;
  title?: string;
  detail?: string;
  code?: string;
  source?: { pointer?: string; parameter?: string; header?: string };
  meta?: Record<string, unknown>;
}

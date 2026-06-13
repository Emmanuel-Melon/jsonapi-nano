// Base types
export interface ResourceIdentifier {
  type: string;
  id: string;
}

export interface LinksObject {
  [key: string]: string | undefined;
}

export interface MetaObject {
  [key: string]: unknown;
}

export interface JsonApiObject {
  version?: string;
  ext?: string[];
  profile?: string[];
}

// Relationships & compound documents
export interface RelationshipObject {
  data?: ResourceIdentifier | ResourceIdentifier[] | null;
  links?: {
    self?: string;
    related?: string;
  };
  meta?: MetaObject;
}

export interface IncludedResource {
  type: string;
  id: string | number;
  attributes?: Record<string, unknown>;
  meta?: MetaObject;
  links?: LinksObject;
}

// Resources
export interface ResourceConfig<T, Context = unknown> {
  type: string;

  attributes?: (item: T, ctx: Context | undefined) => Record<string, unknown>;

  meta?: (item: T, ctx: Context | undefined) => MetaObject;

  links?: (item: T, ctx: Context | undefined) => LinksObject;

  relationships?: (
    item: T,
    ctx: Context | undefined,
  ) => Record<string, RelationshipObject>;
}

export interface ResourceDefinition<T, Context = unknown> {
  type: string;

  attributes: (item: T, ctx: Context | undefined) => Record<string, unknown>;

  meta?: (item: T, ctx: Context | undefined) => MetaObject;

  links?: (item: T, ctx: Context | undefined) => LinksObject;

  relationships?: (
    item: T,
    ctx: Context | undefined,
  ) => Record<string, RelationshipObject>;
}

export interface ResourceLike<
  T extends { id: string | number },
  Context = unknown,
> {
  type: string;

  attributes: (item: T, ctx: Context | undefined) => Record<string, unknown>;
}

export type IncludeConfig<Context = unknown> = Record<
  string,
  [Array<{ id: string | number }>, ResourceLike<any, Context>]
>;

// Serialization options
export interface SerializeOptions<Context = unknown> {
  meta?: MetaObject;
  links?: LinksObject;
  context?: Context;
  included?: IncludedResource[];
  jsonapi?: JsonApiObject;
  timestamp?: boolean;
  fields?: Record<string, string[]>;
  include?: IncludeConfig<Context>;
}

// Errors
export interface ErrorSource {
  pointer?: string;
  parameter?: string;
  header?: string;
}

export interface ErrorConfig {
  status: number | string;
  title?: string;
  detail?: string;
  code?: string;
  source?: ErrorSource;
  meta?: MetaObject;
}

---
layout: layout.njk
title: API Reference
---

# API Reference

## createResource

Creates a reusable, typesafe resource serializer definition.

### Signature

```ts
createResource<T, Context = unknown>(
  type: string,
  config?: Omit<ResourceConfig<T, Context>, "type">
)
```

### Parameters

| Parameter | Type     | Description                                                             |
| --------- | -------- | ----------------------------------------------------------------------- |
| `type`    | `string` | The JSON:API resource type designation (e.g., `"articles"`, `"users"`). |
| `config`  | `object` | Optional lifecycle mappings configuration.                              |

### Config Options

| Option          | Type                                                             | Description                                                                                                     |
| --------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `attributes`    | `(item: T, ctx?: Context) => Record<string, unknown>`            | Maps incoming entities to their JSON:API attributes object block. _Default: Copies all properties except `id`._ |
| `relationships` | `(item: T, ctx?: Context) => Record<string, RelationshipObject>` | Defines linkages to other resources. Use semantic helpers like `belongsTo`.                                     |
| `meta`          | `(item: T, ctx?: Context) => Record<string, unknown>`            | Evaluates per-resource isolated metadata.                                                                       |
| `links`         | `(item: T, ctx?: Context) => Record<string, string               | undefined>`                                                                                                     | Evaluates per-resource document links. |

### Example with Relationships

```ts
import { createResource, belongsTo } from "@emelon/jsonapi-nano";

type Article = { id: string; title: string; body: string; authorId: string };

const articleResource = createResource<Article>("articles", {
  attributes: (a) => ({ title: a.title, body: a.body }),
  relationships: (a) => ({
    author: belongsTo("authors", a.authorId),
  }),
  links: (a) => ({ self: `/articles/${a.id}` }),
});
```

---

## belongsTo

A shorthand semantics helper for creating standard JSON:API structural relationship pointers.

### Signature

```ts
belongsTo(type: string, id: string | number): { data: { type: string; id: string } }
```

### Example

```ts
relationships: (article) => ({
  author: belongsTo("authors", article.authorId),
});
```

---

## serialize

Transforms raw entities or collections into strict, compliance-ready JSON:API documents.

### Signature

```ts
serialize<T extends { id: string | number }, Context = unknown>(
  data: T | T[],
  resource: ReturnType<typeof createResource<T, Context>>,
  options?: SerializeOptions<Context>
)
```

### Options Block Configuration

| Option      | Type                                         | Description                                                                                                                |
| ----------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `context`   | `Context`                                    | Execution-specific runtime context passed down directly to all configuration functions.                                    |
| `include`   | `Record<string, [Array<any>, ResourceLike]>` | Maps defined relationships to secondary datasets and resource configurations to automatically generate compound documents. |
| `fields`    | `Record<string, string[]>`                   | An object mapping resource types to an array of properties to keep, enforcing sparse fieldsets.                            |
| `links`     | `Record<string, string                       | undefined>`                                                                                                                | Top-level global document links. |
| `meta`      | `Record<string, unknown>`                    | Top-level global document metadata (merged alongside automated runtime tracking flags).                                    |
| `timestamp` | `boolean`                                    | Set to `false` to opt-out of the automatic `meta.timestamp` insertion block. _Default: `true`._                            |
| `jsonapi`   | `{ version: string }`                        | Optional top-level member indicating JSON:API spec version details.                                                        |

### Example with Compound Inclusions & Sparse Fieldsets

```ts
import { serialize } from "@emelon/jsonapi-nano";
import { fieldsFromQuery } from "@emelon/jsonapi-nano/query";

const output = serialize(mockArticles, articleResource, {
  context: req,
  links: { self: "[https://api.com/articles](https://api.com/articles)" },
  include: {
    author: [mockAuthors, authorResource], // Side-loads author documents matching the relationship linkage
  },
  fields: {
    articles: ["title"], // Only serializes the "title" attribute down the wire
  },
});
```

---

## fieldsFromQuery (`/query` subpath)

An isolated framework-agnostic request query parser module designed to format incoming application states directly into engine-compatible sparse fieldset parameter maps.

### Signature

```ts
fieldsFromQuery(query: Record<string, unknown>): Record<string, string[]> | undefined
```

### Example

```ts
import express from "express";
import { fieldsFromQuery } from "@emelon/jsonapi-nano/query";

const app = express();

app.get("/articles", (req, res) => {
  // Parses ?fields[articles]=title,body into { articles: ["title", "body"] }
  const fields = fieldsFromQuery(req.query);

  const payload = serialize(data, resource, { fields });
  res.json(payload);
});
```

---

## serializeErrors

Converts single or multi-record error arrays into standard compliant JSON:API `errors` array documents.

### Signature

```ts
serializeErrors(errors: ErrorConfig | ErrorConfig[]): { errors: SerializedError[] }
```

> 📖 For an exhaustive breakdown of parameters, interfaces, and middleware wiring blueprints, visit the complete [Error Handling](https://www.google.com/search?q=/error-handling/) section.

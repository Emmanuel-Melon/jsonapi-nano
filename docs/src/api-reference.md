---
layout: layout.njk
title: API Reference
---

# API Reference

## createResource

Creates a reusable resource serializer.

### Signature

```ts
createResource<T, Context = unknown>(
  type: string,
  config?: Omit<ResourceConfig<T, Context>, "type">
)
```

### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `type`    | `string` | The JSON:API resource type (e.g., `"users"`) |
| `config`  | `object` | Optional configuration (see below)           |

### Config options

| Option       | Type                                                              | Description                                                    |
| ------------ | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| `attributes` | `(item: T, ctx?: Context) => Record<string, unknown>`             | Maps entity to attributes. Default: all properties except `id` |
| `meta`       | `(item: T, ctx?: Context) => Record<string, unknown>`             | Adds per‑resource metadata                                     |
| `links`      | `(item: T, ctx?: Context) => Record<string, string \| undefined>` | Adds per‑resource links                                        |

### Example

```ts
import { createResource } from "@eman/jsonapi-nano";

type Article = { id: string; title: string; body: string; authorId: string };

const articleResource = createResource<Article>("articles", {
  attributes: (article) => ({ title: article.title, body: article.body }),
  meta: (article) => ({ authorId: article.authorId }),
  links: (article) => ({ self: `/articles/${article.id}` }),
});
```

---

## serialize

Transforms one or more entities into a JSON:API resource document.

### Signature

```ts
serialize<T extends { id: string | number }, Context = unknown>(
  data: T | T[],
  resource: ReturnType<typeof createResource<T, Context>>,
  options?: SerializeOptions<Context>
)
```

### Parameters

| Parameter  | Type               | Description                                  |
| ---------- | ------------------ | -------------------------------------------- |
| `data`     | `T \| T[]`         | Single entity or array (each must have `id`) |
| `resource` | `ReturnType<...>`  | The resource object from `createResource`    |
| `options`  | `SerializeOptions` | Optional top‑level configuration             |

### Options

| Option    | Type                                  | Description                                     |
| --------- | ------------------------------------- | ----------------------------------------------- |
| `context` | `Context`                             | Passed to `attributes`/`meta`/`links` functions |
| `meta`    | `Record<string, unknown>`             | Top‑level metadata (merged with `timestamp`)    |
| `links`   | `Record<string, string \| undefined>` | Top‑level links object                          |

### Example

```ts
import { serialize } from "@eman/jsonapi-nano";

const article = {
  id: "1",
  title: "Hello World",
  body: "This is a test article",
  authorId: "auth_1",
};
const output = serialize(article, articleResource);

console.log(output);
```

Output:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "Hello World",
      "body": "This is a test article"
    },
    "meta": { "authorId": "auth_1" },
    "links": { "self": "/articles/1" }
  },
  "meta": {
    "timestamp": "2026-06-12T10:30:00.000Z"
  }
}
```

### Using `context`

```ts
import express from "express";
import { createResource, serialize } from "@eman/jsonapi-nano";

type Article = { id: string; title: string };

const resourceWithDynamicLinks = createResource<Article, express.Request>(
  "articles",
  {
    links: (article, req) => ({
      self: req
        ? `${req.protocol}://${req.get("host")}/articles/${article.id}`
        : undefined,
    }),
  },
);

serialize(article, resourceWithDynamicLinks, {
  context: req,
});
```

---

## serializeErrors

Converts one or more error definitions into a JSON:API `errors` array.

### Signature

```ts
serializeErrors(errors: ErrorConfig | ErrorConfig[]): { errors: SerializedError[] }
```

### Example

```ts
import { serializeErrors } from "@eman/jsonapi-nano";

const errorResponse = serializeErrors({
  status: 422,
  title: "Validation failed",
  source: { pointer: "/data/attributes/title" },
  detail: "Title is required",
});
```

Output:

```json
{
  "errors": [
    {
      "status": "422",
      "title": "Validation failed",
      "source": { "pointer": "/data/attributes/title" },
      "detail": "Title is required"
    }
  ]
}
```

> See the [Error Handling](/error-handling/) page for more examples and Express middleware integration.

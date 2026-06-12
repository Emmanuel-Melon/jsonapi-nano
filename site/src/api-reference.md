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

type User = { id: string; name: string; email: string; role: string };

const userResource = createResource<User>("users", {
  attributes: (user) => ({ name: user.name, email: user.email }),
  meta: (user) => ({ role: user.role }),
  links: (user) => ({ self: `/users/${user.id}` }),
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

const user = {
  id: "1",
  name: "Emmanuel",
  email: "emmanuel@example.com",
  role: "admin",
};
const output = serialize(user, userResource);

console.log(output);
```

Output:

```json
{
  "data": {
    "type": "users",
    "id": "1",
    "attributes": {
      "name": "Emmanuel",
      "email": "emmanuel@example.com"
    },
    "meta": { "role": "admin" },
    "links": { "self": "/users/1" }
  },
  "meta": {
    "timestamp": "2026-06-12T10:30:00.000Z"
  }
}
```

### Using `context`

```ts
const resourceWithDynamicLinks = createResource<User, { req: Request }>(
  "users",
  {
    links: (user, ctx) => ({
      self: `${ctx?.req.protocol}://${ctx?.req.get("host")}/users/${user.id}`,
    }),
  },
);

serialize(user, resourceWithDynamicLinks, {
  context: { req },
});
```

---

## serializeErrors

Converts one or more error definitions into a JSON:API `errors` array.

### Signature

```ts
serializeErrors(errors: ErrorConfig | ErrorConfig[]): { errors: SerializedError[] }
```

### ErrorConfig fields

| Field    | Type                                       | Description                             |
| -------- | ------------------------------------------ | --------------------------------------- |
| `status` | `number \| string`                         | HTTP status code (stringified)          |
| `title`  | `string`                                   | Short summary (defaults to `"Error"`)   |
| `detail` | `string`                                   | Explanation specific to this occurrence |
| `code`   | `string`                                   | Application‑specific error code         |
| `source` | `{ pointer?: string; parameter?: string }` | Pointer to request part                 |
| `meta`   | `Record<string, unknown>`                  | Additional metadata                     |

### Example

```ts
import { serializeErrors } from "@eman/jsonapi-nano";

const errorResponse = serializeErrors({
  status: 422,
  title: "Validation failed",
  source: { pointer: "/data/attributes/email" },
  detail: "Must be a valid email address",
});
```

Output:

```json
{
  "errors": [
    {
      "status": "422",
      "title": "Validation failed",
      "source": { "pointer": "/data/attributes/email" },
      "detail": "Must be a valid email address"
    }
  ]
}
```

> See the [Error Handling](/error-handling/) page for more examples and Express middleware integration.

````

---

## Updated navigation (`nav.njk`) with repo link

```html
<nav>
  <a href="/">Home</a>
  <a href="/getting-started/">Getting Started</a>
  <a href="/api-reference/">API Reference</a>
  <a href="/examples/">Examples</a>
  <a href="/error-handling/">Error Handling</a>
  <a href="https://github.com/egatwech/jsonapi-nano" target="_blank" rel="noopener">GitHub</a>
</nav>
````

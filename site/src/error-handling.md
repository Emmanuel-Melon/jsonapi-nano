---
layout: layout.njk
title: Error Handling
---

# Error Handling

jsonapi-nano provides a simple, spec‑compliant way to format error responses following the [JSON:API Error Object specification](https://jsonapi.org/format/#errors).

## serializeErrors

Converts one or more error definitions into a JSON:API `errors` array.

### Signature

```ts
serializeErrors(errors: ErrorConfig | ErrorConfig[]): { errors: SerializedError[] }
```

### ErrorConfig

An object describing a single error.

| Field    | Type                                       | Description                                              |
| -------- | ------------------------------------------ | -------------------------------------------------------- |
| `status` | `number \| string`                         | HTTP status code (will be stringified)                   |
| `title`  | `string`                                   | Short, human‑readable summary                            |
| `detail` | `string`                                   | Explanation specific to this occurrence                  |
| `code`   | `string`                                   | Application‑specific error code                          |
| `source` | `{ pointer?: string; parameter?: string }` | Pointer to the part of the request that caused the error |
| `meta`   | `Record<string, unknown>`                  | Additional non‑standard metadata                         |

### Examples

#### Single error

```ts
import { serializeErrors } from "@eman/jsonapi-nano";

const errorResponse = serializeErrors({
  status: 404,
  title: "Resource not found",
  detail: `User with id "abc" does not exist`,
});
```

Output:

```json
{
  "errors": [
    {
      "status": "404",
      "title": "Resource not found",
      "detail": "User with id \"abc\" does not exist"
    }
  ]
}
```

#### Multiple errors (validation)

```ts
serializeErrors([
  {
    status: 422,
    title: "Invalid attribute",
    source: { pointer: "/data/attributes/email" },
    detail: "Must be a valid email address",
  },
  {
    status: 422,
    title: "Missing attribute",
    source: { pointer: "/data/attributes/name" },
    detail: "This field is required",
  },
]);
```

Output:

```json
{
  "errors": [
    {
      "status": "422",
      "title": "Invalid attribute",
      "source": { "pointer": "/data/attributes/email" },
      "detail": "Must be a valid email address"
    },
    {
      "status": "422",
      "title": "Missing attribute",
      "source": { "pointer": "/data/attributes/name" },
      "detail": "This field is required"
    }
  ]
}
```

#### Including meta information

```ts
serializeErrors({
  status: 429,
  title: "Rate limit exceeded",
  meta: {
    retryAfter: 30,
    limit: 1000,
  },
});
```

## Usage with Express

A typical error‑handling middleware:

```ts
app.use((err, req, res, next) => {
  if (err.code === "VALIDATION_FAILED") {
    return res.status(422).json(
      serializeErrors({
        status: 422,
        title: "Validation Error",
        detail: err.message,
        source: { pointer: "/data" },
      }),
    );
  }

  res.status(500).json(
    serializeErrors({
      status: 500,
      title: "Internal Server Error",
    }),
  );
});
```

## Notes

- The `status` field is always converted to a string, as required by JSON:API.
- If `title` is omitted, it defaults to `"Error"`.
- The function never throws – it always produces a valid error object.

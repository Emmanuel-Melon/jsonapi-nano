---
layout: layout.njk
title: Error Handling
---

# Error Handling

`jsonapi-nano` provides a simple, zero-overhead, spec-compliant way to format error responses following the strict [JSON:API Error Object specification](https://jsonapi.org/format/#errors).

The error module guarantees that your server responses maintain structural parity with your primary resources, making client-side error processing predictable.

---

## serializeErrors

Converts one or more error configuration shapes into a standardized JSON:API `errors` collection document.

### Signature

```ts
function serializeErrors(errors: ErrorConfig | ErrorConfig[]): {
  errors: SerializedError[];
};
```

### ErrorConfig Reference

An object describing the specific context of an execution failure.

| Field    | Type                                                        | Description                                                                                        |
| -------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `status` | `number                                                     | string`                                                                                            | The HTTP status code applicable to this problem (automatically cast to a string). |
| `title`  | `string`                                                    | A brief, human-readable summary of the problem that does not change from occurrence to occurrence. |
| `detail` | `string`                                                    | A human-readable explanation specific to this occurrence of the problem.                           |
| `code`   | `string`                                                    | An application-specific error code.                                                                |
| `source` | `{ pointer?: string; parameter?: string; header?: string }` | An object containing references to the primary source of the error.                                |
| `meta`   | `Record<string, unknown>`                                   | A meta object containing non-standard meta-information about the error.                            |

---

## Examples

### Single Error Response

```ts
import { serializeErrors } from "@emelon/jsonapi-nano";

const errorResponse = serializeErrors({
  status: 404,
  title: "Resource Not Found",
  detail: `Article with id "abc" does not exist.`,
});
```

**Output Payload:**

```json
{
  "errors": [
    {
      "status": "404",
      "title": "Resource Not Found",
      "detail": "Article with id \"abc\" does not exist."
    }
  ]
}
```

### Request Parameter & Attribute Validation (Multiple Errors)

When validating requests, you can combine multiple error blocks into a single payload response. Use `source.pointer` for body attribute failures, `source.parameter` for query string errors, or `source.header` for header mismatches.

```ts
import { serializeErrors } from "@emelon/jsonapi-nano";

const validationPayload = serializeErrors([
  {
    status: 422,
    title: "Invalid Attribute",
    source: { pointer: "/data/attributes/title" },
    detail: "The 'title' field is required and cannot be empty.",
  },
  {
    status: 400,
    title: "Invalid Query Parameter",
    source: { parameter: "fields[articles]" },
    detail:
      "Requested fieldset contains parameters that do not exist on the base schema.",
  },
]);
```

**Output Payload:**

```json
{
  "errors": [
    {
      "status": "422",
      "title": "Invalid Attribute",
      "source": { "pointer": "/data/attributes/title" },
      "detail": "The 'title' field is required and cannot be empty."
    },
    {
      "status": "400",
      "title": "Invalid Query Parameter",
      "source": { "parameter": "fields[articles]" },
      "detail": "Requested fieldset contains parameters that do not exist on the base schema."
    }
  ]
}
```

### Including Metadata & Throttling Limits

```ts
import { serializeErrors } from "@emelon/jsonapi-nano";

const rateLimitPayload = serializeErrors({
  status: 429,
  title: "Rate Limit Exceeded",
  detail: "Too many requests down the wire. Please slow down.",
  meta: {
    retryAfterSeconds: 30,
    limitPerHour: 1000,
  },
});
```

---

## Example Middleware Implementations

### Express Example

Ensure your global error boundary interceptor catches system errors and maps them explicitly without disrupting runtime telemetry.

```ts
import type { Request, Response, NextFunction } from "express";
import { serializeErrors } from "@emelon/jsonapi-nano";

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Ensure we signal the proper JSON:API content-type header for errors
  res.setHeader("Content-Type", "application/vnd.api+json");

  if (err.name === "ValidationError") {
    return res.status(422).json(
      serializeErrors({
        status: 422,
        title: "Unprocessable Entity",
        detail: err.message,
        source: { pointer: `/data/attributes/${err.path}` },
      }),
    );
  }

  // Fallback catch-all for unexpected internal runtime bugs
  res.status(500).json(
    serializeErrors({
      status: 500,
      title: "Internal Server Error",
      detail: process.env.NODE_ENV === "production" ? undefined : err.stack,
    }),
  );
});
```

---

## Architectural Guarantees

- **Strict Type Safety:** The `status` field is automatically cast to a valid JSON string at runtime, keeping your responses perfectly compliant with JSON:API requirements.
- **Fail-Safe Processing:** `serializeErrors` handles internal falls gracefully and will never throw a secondary runtime exception while executing. If a `title` parameter is omitted, it falls back to a structural standard of `"Error"`.

## Notes

- The `status` field is always converted to a string, as required by JSON:API.
- If `title` is omitted, it defaults to `"Error"`.
- The function never throws – it always produces a valid error object.

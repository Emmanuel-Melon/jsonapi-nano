# jsonapi-nano

A lightweight, ultra-fast, zero-dependency presentation layer engine for formatting data into strict, compliance-ready [JSON:API](https://jsonapi.org/) spec configurations. 100% framework-agnostic design built for modern cloud-native architectures.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![NPM Version](https://img.shields.io/npm/v/@emelon/jsonapi-nano)
![Bundle Size](https://img.shields.io/bundlephobia/min/@emelon/jsonapi-nano)

## 📖 Complete Documentation

Our full installation guides, framework integration examples, type parameters, and error-handling utilities are live at:
👉 **[emmanuel-melon.github.io/jsonapi-nano](https://emmanuel-melon.github.io/jsonapi-nano/)**

---

## Installation

```bash
npm install @emelon/jsonapi-nano
```

## Quick Start

```typescript
import { createResource, serialize, belongsTo } from "@emelon/jsonapi-nano";
import { fieldsFromQuery } from "@emelon/jsonapi-nano/query";

interface Article {
  id: string;
  title: string;
  body: string;
  authorId: string;
}

interface Author {
  id: string;
  name: string;
}

// 1. Define reusable presentation schemas matching your entities
const authorResource = createResource<Author>("authors", {
  attributes: (author) => ({ name: author.name }),
});

const articleResource = createResource<Article>("articles", {
  attributes: (article) => article,
  relationships: (article) => ({
    author: belongsTo("authors", article.authorId),
  }),
});

// 2. Format data into strict JSON:API specifications with side-loaded data
const mockArticles = [
  {
    id: "1",
    title: "Say Hello",
    body: "A presentation engine.",
    authorId: "99",
  },
];
const mockAuthors = [{ id: "99", name: "Emmanuel Gatwech" }];

const output = serialize(mockArticles, articleResource, {
  include: {
    author: [mockAuthors, authorResource],
  },
  // Optional: Pass raw express/fastify query params for sparse fieldsets
  fields: fieldsFromQuery(req.query),
});
```

**Output Target Shape:**

```json
{
  "data": [
    {
      "type": "articles",
      "id": "1",
      "attributes": {
        "title": "Say Hello",
        "body": "A presentation engine."
      },
      "relationships": {
        "author": {
          "data": { "type": "authors", "id": "99" }
        }
      }
    }
  ],
  "included": [
    {
      "type": "authors",
      "id": "99",
      "attributes": {
        "name": "Emmanuel Gatwech"
      }
    }
  ],
  "meta": {
    "timestamp": "2026-06-13T18:20:33.243Z"
  }
}
```

---

## Spec Compliance

`jsonapi-nano` is **not** a tutorial on JSON:API — see [jsonapi.org](https://jsonapi.org/) for the full specification. Below is the current implementation status of `serialize` / `createResource` / `serializeErrors` against the spec.

| Feature                                             | Status         | Notes                                                             |
| --------------------------------------------------- | -------------- | ----------------------------------------------------------------- |
| `data` (resource objects, `type`/`id`/`attributes`) | ✅ Implemented | Core `createResource` + `serialize`                               |
| `meta` (top-level and per-resource)                 | ✅ Implemented | Auto `timestamp` is opt-out via `options.timestamp: false`        |
| `links` (top-level and per-resource)                | ✅ Implemented |                                                                   |
| `relationships`                                     | ✅ Implemented | Semantic abstractions available via `belongsTo` helper            |
| `included` (compound documents)                     | ✅ Implemented | Fully resolved and deduped by type+id via `options.include`       |
| `jsonapi` top-level member                          | ✅ Implemented | Via `serialize` options                                           |
| `errors` array                                      | ✅ Implemented | `serializeErrors`, includes `source.pointer`/`parameter`/`header` |
| Sparse fieldsets (`fields[type]`)                   | ✅ Implemented | Fully supported via @emelon/jsonapi-nano/query filtering          |
| Pagination links/meta helpers                       | 🚧 Planned     | Not yet supported                                                 |
| Resource `type` validation                          | 🚧 Planned     | No runtime validation of member-name format                       |
| Error object `id` / `links.about`                   | 🚧 Planned     | Not yet on `ErrorConfig`                                          |

---

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)

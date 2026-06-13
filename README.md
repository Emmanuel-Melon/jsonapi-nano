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
import { createResource, serialize } from "@emelon/jsonapi-nano";

interface Article {
  id: string;
  title: string;
  body: string;
  authorId: string;
}

// 1. Define a reusable presentation schema matching your entity
const articleResource = createResource<Article>("articles", {
  attributes: (article) => ({
    title: article.title,
    body: article.body,
  }),
});

// 2. Format data into strict JSON:API specifications
const article = {
  id: "art_100",
  title: "Hello World",
  body: "This is a test article",
  authorId: "auth_1",
};
const output = serialize(article, articleResource);
```

**Output Target Shape:**

```json
{
  "data": {
    "type": "articles",
    "id": "art_100",
    "attributes": {
      "title": "Hello World",
      "body": "This is a test article"
    }
  },
  "meta": {
    "timestamp": "2026-06-12T13:08:00.000Z"
  }
}
```

---

## Spec Compliance

`jsonapi-nano` is **not** a tutorial on JSON:API — see [jsonapi.org](https://jsonapi.org/) for the full specification. Below is the current implementation status of `serialize` / `createResource` / `serializeErrors` against the spec.

| Feature | Status | Notes |
| --- | --- | --- |
| `data` (resource objects, `type`/`id`/`attributes`) | ✅ Implemented | Core `createResource` + `serialize` |
| `meta` (top-level and per-resource) | ✅ Implemented | Auto `timestamp` is opt-out via `options.timestamp: false` |
| `links` (top-level and per-resource) | ✅ Implemented | |
| `relationships` | ✅ Implemented | Via `createResource({ relationships })` |
| `included` (compound documents) | ✅ Implemented | Deduped by `type`+`id` per spec |
| `jsonapi` top-level member | ✅ Implemented | Via `serialize` options |
| `errors` array | ✅ Implemented | `serializeErrors`, includes `source.pointer`/`parameter`/`header` |
| Sparse fieldsets (`fields[type]`) | 🚧 Planned | Not yet supported |
| Pagination links/meta helpers | 🚧 Planned | Not yet supported |
| Resource `type` validation | 🚧 Planned | No runtime validation of member-name format |
| Error object `id` / `links.about` | 🚧 Planned | Not yet on `ErrorConfig` |

---

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)
---
layout: layout.njk
title: jsonapi-nano
---

# jsonapi-nano

**Tiny, type‑safe JSON:API serialization for TypeScript.** Zero dependencies, framework agnostic.

## Quick start

```bash
npm install @emelon/jsonapi-nano

```

```ts
import {
  createResource,
  serialize,
  belongsTo,
  fieldsFromQuery,
} from "@emelon/jsonapi-nano";

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
  attributes: (article) => ({ title: article.title, body: article.body }),
  relationships: (article) => ({
    author: belongsTo("authors", article.authorId),
  }),
});

// 2. Format data into strict JSON:API specifications with side-loaded data
const mockArticles = [
  {
    id: "1",
    title: "The Will of Fire",
    body: "Believing in your dreams no matter what.",
    authorId: "7",
  },
];
const mockAuthors = [{ id: "7", name: "Naruto Uzumaki" }];

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
        "title": "The Will of Fire",
        "body": "Believing in your dreams no matter what."
      },
      "relationships": {
        "author": {
          "data": { "type": "authors", "id": "7" }
        }
      }
    }
  ],
  "included": [
    {
      "type": "authors",
      "id": "7",
      "attributes": {
        "name": "Naruto Uzumaki"
      }
    }
  ],
  "meta": {
    "timestamp": "2026-06-13T18:20:33.243Z"
  }
}
```

---

## Why jsonapi-nano?

- 🪶 **Zero dependencies** – keeps your bundle lean.
- ⚡ **Ultra‑fast** – minimal overhead, no magic.
- 🧩 **Framework agnostic** – works with Express, Fastify, Next.js, Lambda, etc.
- 🛡️ **Fully typed** – written in TypeScript with full inference.

## Documentation

- [Getting Started](https://www.google.com/search?q=/getting-started/) – basic usage and setup
- [API Reference](https://www.google.com/search?q=/api-reference/) – detailed function signatures
- [Examples](https://www.google.com/search?q=/examples/) – Express, Zod, and advanced patterns
- [Error Handling](https://www.google.com/search?q=/error-handling/) – JSON:API error responses

## Links

- [GitHub repository](https://github.com/Emmanuel-Melon/jsonapi-nano)
- [npm package](https://www.npmjs.com/package/@emelon/jsonapi-nano)
- [JSON:API specification](https://jsonapi.org/)

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)

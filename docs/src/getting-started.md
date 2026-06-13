---
layout: layout.njk
title: Getting Started
---

# Getting Started

`jsonapi-nano` is a lightweight, framework-agnostic JSON:API serializer for TypeScript.

It transforms your application data into consistent JSON:API resource and error documents without imposing runtime dependencies, middleware, decorators, or framework-specific abstractions.

---

## Installation

```bash
npm install @emelon/jsonapi-nano
```

## Defining a Resource

Resources describe how your data should be presented.

```typescript
import { createResource, belongsTo } from "@emelon/jsonapi-nano";

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

export const authorResource = createResource<Author>("authors", {
  attributes: (author) => ({ name: author.name }),
});

export const articleResource = createResource<Article>("articles", {
  attributes: (article) => ({
    title: article.title,
    body: article.body,
  }),
  relationships: (article) => ({
    author: belongsTo("authors", article.authorId),
  }),
});
```

### Compound Documents & Including Relations

Pass related raw data records into your serialize execution configurations using the include map parameter. The serialization engine will match relation keys, build full JSON:API relationship definitions on your primary data records, and safely deduplicate elements inside your root included collection block automatically.

```typescript
import { serialize } from "@emelon/jsonapi-nano";

const mockArticles = [
  {
    id: "1",
    title: "Say Hello",
    body: "A presentation engine.",
    authorId: "99",
  },
];
const mockAuthors = [{ id: "99", name: "Naruto Uzumaki" }];

const response = serialize(mockArticles, articleResource, {
  include: {
    author: [mockAuthors, authorResource],
  },
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
        "name": "Naruto Uzumaki"
      }
    }
  ],
  "meta": {
    "timestamp": "2026-06-13T18:20:33.243Z"
  }
}
```

### Sparse Fieldsets

To let clients request a lightweight network payload containing only explicit fields, use the built-in `fieldsFromQuery` parameter parser from the isolated `/query` subpath.

```typescript
import { serialize } from "@emelon/jsonapi-nano";
import { fieldsFromQuery } from "@emelon/jsonapi-nano/query";

// Automatically parses standard incoming HTTP formats (e.g. ?fields[articles]=title)
// into valid serialization maps: { articles: ["title"] }
const fields = fieldsFromQuery(req.query);

const response = serialize(mockArticles, articleResource, { fields });
```

## Next Steps

- Learn every available API in the [API Reference](/api-reference) section.
- Explore real-world framework integrations in the [Examples](/examples) section.

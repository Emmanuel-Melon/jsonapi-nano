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
import { createResource } from "@emelon/jsonapi-nano";

interface Article {
  id: string;
  title: string;
  body: string;
  authorId: string;
}

const articleResource = createResource<Article>("articles", {
  attributes: (article) => ({
    title: article.title,
    body: article.body,
  }),
});
```

## Serializing a Single Resource

```typescript
import { serialize } from "@emelon/jsonapi-nano";

const article = {
  id: "art_100",
  title: "Hello World",
  body: "This is a test article",
  authorId: "auth_1",
};

const response = serialize(article, articleResource);
```

### Output

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

## Serializing a Collection

```typescript
const articles = [
  {
    id: "art_100",
    title: "Hello World",
    body: "This is a test article",
    authorId: "auth_1",
  },
  {
    id: "art_101",
    title: "Another Article",
    body: "This is another test article",
    authorId: "auth_2",
  },
];

const response = serialize(articles, articleResource);
```

### Output

```json
{
  "data": [
    {
      "type": "articles",
      "id": "art_100",
      "attributes": {
        "title": "Hello World",
        "body": "This is a test article"
      }
    },
    {
      "type": "articles",
      "id": "art_101",
      "attributes": {
        "title": "Another Article",
        "body": "This is another test article"
      }
    }
  ]
}
```

## Next Steps

- Learn every available API in the [API Reference](/api-reference) section.
- Explore real-world framework integrations in the [Examples](/examples) section.

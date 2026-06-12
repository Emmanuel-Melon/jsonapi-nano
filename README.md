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
const article = { id: "art_100", title: "Hello World", body: "This is a test article", authorId: "auth_1" };
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
    "timestamp": "2026-06-12T13:08:00.000Z",
    "authorId": "auth_1"
  }
}
```

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)

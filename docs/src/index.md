---
layout: layout.njk
title: jsonapi-nano
---

# jsonapi-nano

**Tiny, type‑safe JSON:API serialization for TypeScript.**  
Zero dependencies, framework agnostic.

## Quick start

```bash
npm install @emelon/jsonapi-nano
```

```ts
import { createResource, serialize } from "@emelon/jsonapi-nano";

const articleResource = createResource("articles", {
  attributes: (article) => ({ title: article.title, body: article.body }),
});

const article = {
  id: "1",
  title: "Hello World",
  body: "This is a test article",
};
const output = serialize(article, articleResource);
```

## Why jsonapi-nano?

- 🪶 **Zero dependencies** – keeps your bundle lean.
- ⚡ **Ultra‑fast** – minimal overhead, no magic.
- 🧩 **Framework agnostic** – works with Express, Fastify, Next.js, Lambda, etc.
- 🛡️ **Fully typed** – written in TypeScript with full inference.

## Documentation

- [Getting Started](/getting-started/) – basic usage and setup
- [API Reference](/api-reference/) – detailed function signatures
- [Examples](/examples/) – Express, Zod, and advanced patterns
- [Error Handling](/error-handling/) – JSON:API error responses

## Links

- [GitHub repository](https://github.com/Emmanuel-Melon/jsonapi-nano)
- [npm package](https://www.npmjs.com/package/@emelon/jsonapi-nano)
- [JSON:API specification](https://jsonapi.org/)

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)

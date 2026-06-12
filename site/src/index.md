---
layout: layout.njk
title: jsonapi-nano
---

# jsonapi-nano

**Tiny, type‑safe JSON:API serialization for TypeScript.**  
Zero dependencies, framework agnostic.

## Quick start

```bash
npm install @eman/jsonapi-nano
```

```ts
import { createResource, serialize } from "@eman/jsonapi-nano";

const userResource = createResource("users", {
  attributes: (user) => ({ name: user.name, email: user.email }),
});

const user = { id: "1", name: "Alice", email: "alice@example.com" };
const output = serialize(user, userResource);
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
- [npm package](https://www.npmjs.com/package/@eman/jsonapi-nano)
- [JSON:API specification](https://jsonapi.org/)

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)

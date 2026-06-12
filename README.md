# jsonapi-nano

A lightweight, ultra-fast, zero-dependency presentation layer engine for formatting data into strict, compliance-ready [JSON:API](https://jsonapi.org/) spec configurations. 100% framework-agnostic design matching modern cloud-native architectures.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![NPM Version](https://img.shields.io/npm/v/@eman/jsonapi-nano)
![Bundle Size](https://img.shields.io/bundlephobia/min/@eman/jsonapi-nano)

## Why jsonapi-nano?

- 🚀 **Zero Production Dependencies:** Keeps your deployment artifacts, Lambda layers, and production bundles incredibly lean.
- 🧩 **Ecosystem Agnostic Core:** Works out-of-the-box inside Express, Fastify, Next.js, NestJS, AWS Lambda, or vanilla Node.js environments.
- 🛡️ **Pristine Type-Safety:** Written entirely in TypeScript for clear code-completion across models, properties, and runtime execution contexts.
- 🪶 **Zero Opinion Structure:** No runtime configuration files, HTTP status registries, arbitrary wrapper classes, or request middlewares forced onto your code.

---

## Installation

````bash
npm install @eman/jsonapi-nano

## Why jsonapi-nano?
* 🚀 **Zero Dependencies:** Keeps your production bundles incredibly tiny.
* 🧩 **Framework Agnostic Core:** Use it natively in Express, Fastify, Next.js, NestJS, AWS Lambda, or pure Node.
* 🛡️ **Type-Safe:** Built from the ground up with TypeScript for flawless autocompletion.
* 🪶 **Unopinionated:** No custom HTTP status catalogs, rigid error classes, or request ID middleware forced on you.

---

## Installation

```bash
npm install jsonapi-nano
````

## Quick Start

```typescript
import { createResource, serialize } from "@eman/jsonapi-nano";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// 1. Define a reusable presentation schema matching your entity
const userResource = createResource<User>("users", {
  attributes: (user) => ({
    name: user.name,
    email: user.email,
  }),
});

// 2. Format database objects into JSON:API specification
const user = {
  id: "usr_100",
  name: "Emmanuel",
  email: "emmanuel@example.com",
  role: "admin",
};
const output = serialize(user, userResource);

console.log(output);
/*
{
  "data": {
    "type": "users",
    "id": "usr_100",
    "attributes": {
      "name": "Emmanuel",
      "email": "emmanuel@example.com"
    }
  },
  "meta": {
    "timestamp": "2026-06-12T13:08:00.000Z"
  }
}
*/
```

## Examples

### Express

```typescript
import express from "express";
import { createResource, serialize } from "@eman/jsonapi-nano";

const app = express();

interface Article {
  id: number;
  title: string;
  content: string;
}

// Provide express.Request as context parameter to gain full type-safety inside maps
const articleResource = createResource<Article, express.Request>("articles", {
  attributes: (article) => ({ title: article.title }),
  links: (article, req) => ({
    self: `${req.protocol}://${req.get("host")}/api/articles/${article.id}`,
  }),
});

app.get("/api/articles/:id", (req, res) => {
  const article: Article = {
    id: 42,
    title: "JSON:API Rules",
    content: "Lorem Ipsum...",
  };

  res.json(serialize(article, articleResource, { context: req }));
});
```

### API Reference

#### createResource<T, Context = any>(type, config?)

Configures configuration maps for specific content types.

- **type**: String indicating resource collection classification.
- **config.attributes**: Unpack or whitelist payload items.
- **config.meta**: Map entity values directly into individual item data arrays.
- **config.links**: Map pagination or self paths utilizing runtime framework instances.

#### serialize<T, Context = any>(data, resource, options?)

Converts active raw data sets or single entities into structural formats.

- **options.meta**: Globally set pipeline data wrappers.
- **options.links**: Global root path properties.
- **options.context**: Context payload execution state references.

#### serializeErrors(errors)

Transforms arbitrary operational issues into unified collection payloads.

```typescript
import { serializeErrors } from "@eman/jsonapi-nano";

const errorResponse = serializeErrors({
  status: 422,
  title: "Invalid Attribute",
  detail: "First name must contain at least 2 characters.",
  source: { pointer: "/data/attributes/first-name" },
});
```

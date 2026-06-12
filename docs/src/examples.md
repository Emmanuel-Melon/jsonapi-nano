---
layout: layout.njk
title: Examples
---

# Examples

This page demonstrates common integration patterns with popular frameworks.

---

# Express

```ts
import express from "express";
import { createResource, serialize } from "@emelon/jsonapi-nano";

const app = express();

const articleResource = createResource("articles");

app.get("/articles/:id", (req, res) => {
  const article = {
    id: req.params.id,
    title: "Hello World",
    body: "This is a test article",
  };

  res.json(serialize(article, articleResource));
});
```

# Fastify

```ts
import Fastify from "fastify";
import { createResource, serialize } from "@emelon/jsonapi-nano";

const app = Fastify();

const articleResource = createResource("articles");

app.get("/articles/:id", async (request) => {
  const article = {
    id: request.params.id,
    title: "Hello World",
    body: "This is a test article",
  };

  return serialize(article, articleResource);
});
```

# NestJS

```typescript
@Controller("articles")
export class ArticlesController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    const article = {
      id,
      title: "Hello World",
      body: "This is a test article",
    };

    return serialize(article, articleResource);
  }
}
```

> See the [Examples](https://github.com/Emmanuel-Melon/jsonapi-nano/tree/main/examples) for more examples.

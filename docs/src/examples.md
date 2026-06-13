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
import {
  serialize,
  serializeErrors,
  belongsTo,
  createResource,
} from "@emelon/jsonapi-nano";
import { fieldsFromQuery } from "@emelon/jsonapi-nano/query";

const app = express();
const PORT = 3000;

const mockAuthors = [{ id: "99", name: "Jane Doe" }];
const mockArticles = [
  {
    id: "1",
    title: "Why local testing matters",
    body: "Using yalc is easy.",
    authorId: "99",
  },
];

// Resource schemas
const authorResource = createResource("authors", {
  attributes: (a) => ({ name: a.name }),
});

const articleResource = createResource("articles", {
  attributes: (a) => ({ title: a.title, body: a.body }),
  relationships: (a) => ({
    author: belongsTo("authors", a.authorId),
  }),
});

app.get("/articles", (req, res) => {
  const jsonapiResponse = serialize(mockArticles, articleResource, {
    context: req,
    links: { self: `${req.protocol}://${req.get("host")}${req.originalUrl}` },
    include: {
      author: [mockAuthors, authorResource],
    },
    fields: fieldsFromQuery(req.query),
  });

  res.setHeader("Content-Type", "application/vnd.api+json");
  res.json(jsonapiResponse);
});

app.listen(PORT);
```

# Fastify

```ts
import Fastify from "fastify";
import { serialize, createResource } from "@emelon/jsonapi-nano";
import { fieldsFromQuery } from "@emelon/jsonapi-nano/query";

const fastify = Fastify();

const articleResource = createResource("articles", {
  attributes: (a) => ({ title: a.title, body: a.body }),
});

fastify.get("/articles/:id", async (request, reply) => {
  const article = {
    id: request.params.id,
    title: "Hello World",
    body: "Fastify example",
  };

  reply.header("Content-Type", "application/vnd.api+json");
  return serialize(article, articleResource, {
    fields: fieldsFromQuery(request.query as Record<string, unknown>),
  });
});

await fastify.listen({ port: 3000 });
```

# NestJS

```typescript
import { Controller, Get, Req, HttpCode, Injectable } from "@nestjs/common";
import { Request } from "express";
import { serialize, createResource, belongsTo } from "@emelon/jsonapi-nano";
import { fieldsFromQuery } from "@emelon/jsonapi-nano/query";

const authorResource = createResource("authors", {
  attributes: (a) => ({ name: a.name }),
});
const articleResource = createResource("articles", {
  attributes: (a) => ({ title: a.title, body: a.body }),
  relationships: (a) => ({ author: belongsTo("authors", a.authorId) }),
});

@Injectable()
export class ArticlesService {
  getArticles() {
    return [
      {
        id: "1",
        title: "NestJS Integration",
        body: "Super clean presentation layers.",
        authorId: "10",
      },
    ];
  }
  getAuthors() {
    return [{ id: "10", name: "Nest Developer" }];
  }
}

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @HttpCode(200)
  findAll(@Req() req: Request) {
    const articles = this.articlesService.getArticles();
    const authors = this.articlesService.getAuthors();

    // NestJS route handlers will respect your returned object
    // and stream it down as valid JSON automatically
    return serialize(articles, articleResource, {
      context: req,
      include: {
        author: [authors, authorResource],
      },
      fields: fieldsFromQuery(req.query),
    });
  }
}
```

> See the [Examples](https://github.com/Emmanuel-Melon/jsonapi-nano/tree/main/examples) for more examples.

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
import { createResource, serialize } from "@eman/jsonapi-nano";

const app = express();

const userResource = createResource("users");

app.get("/users/:id", (req, res) => {
  const user = {
    id: req.params.id,
    name: "Emmanuel",
    email: "emmanuel@example.com",
  };

  res.json(serialize(user, userResource));
});
```

# Fastify

```ts
import Fastify from "fastify";
import { createResource, serialize } from "@eman/jsonapi-nano";

const app = Fastify();

const userResource = createResource("users");

app.get("/users/:id", async (request) => {
  const user = {
    id: request.params.id,
    name: "Emmanuel",
  };

  return serialize(user, userResource);
});
```

NestJS

```typescript
@Controller("users")
export class UsersController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    const user = {
      id,
      name: "Emmanuel",
    };

    return serialize(user, userResource);
  }
}
```

AWS Lambda

```typescript
import { serialize } from "@eman/jsonapi-nano";

export const handler = async () => {
  const user = {
    id: "usr_100",
    name: "Emmanuel",
  };

  return {
    statusCode: 200,
    body: JSON.stringify(serialize(user, userResource)),
  };
};
```

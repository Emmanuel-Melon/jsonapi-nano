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
npm install @eman/jsonapi-nano
```

## Defining a Resource

Resources describe how your entities should be presented.

```typescript
import { createResource } from "@eman/jsonapi-nano";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const userResource = createResource<User>("users", {
  attributes: (user) => ({
    name: user.name,
    email: user.email,
  }),
});
```

## Serializing a Single Resource

```typescript
import { serialize } from "@eman/jsonapi-nano";

const user = {
  id: "usr_100",
  name: "Emmanuel",
  email: "emmanuel@example.com",
  role: "admin",
};

const response = serialize(user, userResource);
```

### Output

```json
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
```

## Serializing a Collection

```typescript
const users = [
  {
    id: "usr_100",
    name: "Emmanuel",
    email: "emmanuel@example.com",
  },
  {
    id: "usr_101",
    name: "Alice",
    email: "alice@example.com",
  },
];

const response = serialize(users, userResource);
```

### Output

```json
{
  "data": [
    {
      "type": "users",
      "id": "usr_100",
      "attributes": {
        "name": "Emmanuel",
        "email": "emmanuel@example.com"
      }
    },
    {
      "type": "users",
      "id": "usr_101",
      "attributes": {
        "name": "Alice",
        "email": "alice@example.com"
      }
    }
  ]
}
```

## Next Steps

Learn every available API in the [API Reference](/api-reference) section.  
Explore real-world framework integrations in the [Examples](/examples) section.

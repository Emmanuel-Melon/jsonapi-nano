import { describe, it, expect } from "vitest";
import { createResource, serialize } from "../src/core";

type Article = { id: string; title: string; body: string; authorId: string };

const article: Article = {
  id: "1",
  title: "Hello World",
  body: "Test article",
  authorId: "auth_1",
};

describe("createResource", () => {
  it("uses default attributes (all fields except id)", () => {
    const resource = createResource<Article>("articles");
    const output = serialize(article, resource, { timestamp: false });
    expect(output.data).toMatchObject({
      type: "articles",
      id: "1",
      attributes: {
        title: "Hello World",
        body: "Test article",
        authorId: "auth_1",
      },
    });
    expect((output.data as any).attributes.id).toBeUndefined();
  });

  it("uses custom attributes function", () => {
    const resource = createResource<Article>("articles", {
      attributes: (a) => ({ title: a.title }),
    });
    const output = serialize(article, resource, { timestamp: false });
    expect((output.data as any).attributes).toEqual({ title: "Hello World" });
  });
});

describe("serialize - single resource", () => {
  it("serializes a single item with type/id/attributes", () => {
    const resource = createResource<Article>("articles", {
      attributes: (a) => ({ title: a.title, body: a.body }),
    });
    const output = serialize(article, resource, { timestamp: false });
    expect(output).toEqual({
      data: {
        type: "articles",
        id: "1",
        attributes: { title: "Hello World", body: "Test article" },
      },
    });
  });

  it("throws if item is missing an id", () => {
    const resource = createResource<any>("articles");
    expect(() => serialize({ title: "no id" } as any, resource)).toThrow(
      /missing an `id`/,
    );
  });

  it("includes meta and links when provided by resource config", () => {
    const resource = createResource<Article>("articles", {
      attributes: (a) => ({ title: a.title }),
      meta: (a) => ({ authorId: a.authorId }),
      links: (a) => ({ self: `/articles/${a.id}` }),
    });
    const output = serialize(article, resource, { timestamp: false });
    expect((output.data as any).meta).toEqual({ authorId: "auth_1" });
    expect((output.data as any).links).toEqual({ self: "/articles/1" });
  });

  it("includes relationships when provided", () => {
    const resource = createResource<Article>("articles", {
      attributes: (a) => ({ title: a.title }),
      relationships: (a) => ({
        author: { data: { type: "people", id: a.authorId } },
      }),
    });
    const output = serialize(article, resource, { timestamp: false });
    expect((output.data as any).relationships).toEqual({
      author: { data: { type: "people", id: "auth_1" } },
    });
  });
});

describe("serialize - collections", () => {
  it("serializes an array of items as data array", () => {
    const resource = createResource<Article>("articles", {
      attributes: (a) => ({ title: a.title }),
    });
    const output = serialize(
      [article, { ...article, id: "2", title: "Second" }],
      resource,
      {
        timestamp: false,
      },
    );
    expect(Array.isArray(output.data)).toBe(true);
    expect((output.data as any[]).map((d) => d.id)).toEqual(["1", "2"]);
  });
});

describe("serialize - timestamp option", () => {
  it("includes meta.timestamp by default", () => {
    const resource = createResource<Article>("articles");
    const output = serialize(article, resource);
    expect(output.meta?.timestamp).toBeDefined();
  });

  it("omits meta entirely when timestamp is false and no other meta", () => {
    const resource = createResource<Article>("articles");
    const output = serialize(article, resource, { timestamp: false });
    expect(output.meta).toBeUndefined();
  });

  it("keeps custom meta even when timestamp is false", () => {
    const resource = createResource<Article>("articles");
    const output = serialize(article, resource, {
      timestamp: false,
      meta: { total: 1 },
    });
    expect(output.meta).toEqual({ total: 1 });
  });
});

describe("serialize - included (compound documents)", () => {
  it("dedupes included resources by type+id", () => {
    const resource = createResource<Article>("articles");
    const output = serialize(article, resource, {
      timestamp: false,
      included: [
        { type: "people", id: "9", attributes: { name: "Dan" } },
        { type: "people", id: "9", attributes: { name: "Dan" } }, // duplicate
        { type: "people", id: "10", attributes: { name: "Jane" } },
      ],
    });
    expect(output.included).toHaveLength(2);
    expect(output.included?.map((r) => r.id)).toEqual(["9", "10"]);
  });
});

describe("serialize - jsonapi member", () => {
  it("includes jsonapi top-level member when provided", () => {
    const resource = createResource<Article>("articles");
    const output = serialize(article, resource, {
      timestamp: false,
      jsonapi: { version: "1.1" },
    });
    expect(output.jsonapi).toEqual({ version: "1.1" });
  });
});

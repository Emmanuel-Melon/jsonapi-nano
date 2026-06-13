import { describe, it, expect } from "vitest";
import { createResource, serialize } from "../src/core";

type Article = {
  id: string;
  title: string;
  body: string;
  authorId: string;
};

const article: Article = {
  id: "1",
  title: "Hello World",
  body: "Test article",
  authorId: "auth_1",
};

const articleResource = createResource<Article>("articles", {
  attributes: (a) => ({
    title: a.title,
    body: a.body,
  }),
});

describe("createResource", () => {
  it("uses default attributes (all fields except id)", () => {
    const resource = createResource<Article>("articles");

    const output = serialize(article, resource, {
      timestamp: false,
    });

    expect(output.data).toMatchObject({
      type: "articles",
      id: "1",
      attributes: {
        title: "Hello World",
        body: "Test article",
        authorId: "auth_1",
      },
    });

    expect(output.data).not.toMatchObject({
      attributes: {
        id: expect.anything(),
      },
    });
  });

  it("uses custom attributes function", () => {
    const resource = createResource<Article>("articles", {
      attributes: (a) => ({
        title: a.title,
      }),
    });

    const output = serialize(article, resource, {
      timestamp: false,
    });

    expect(output.data).toMatchObject({
      attributes: {
        title: "Hello World",
      },
    });
  });
});

describe("serialize", () => {
  describe("single resources", () => {
    it("serializes a single item with type, id and attributes", () => {
      const output = serialize(article, articleResource, {
        timestamp: false,
      });

      expect(output).toEqual({
        data: {
          type: "articles",
          id: "1",
          attributes: {
            title: "Hello World",
            body: "Test article",
          },
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
        attributes: (a) => ({
          title: a.title,
        }),
        meta: (a) => ({
          authorId: a.authorId,
        }),
        links: (a) => ({
          self: `/articles/${a.id}`,
        }),
      });

      const output = serialize(article, resource, {
        timestamp: false,
      });

      expect(output.data).toMatchObject({
        meta: {
          authorId: "auth_1",
        },
        links: {
          self: "/articles/1",
        },
      });
    });
  });

  describe("collections", () => {
    it("serializes an array of items as a data array", () => {
      const output = serialize(
        [
          article,
          {
            ...article,
            id: "2",
            title: "Second",
          },
        ],
        articleResource,
        {
          timestamp: false,
        },
      );

      expect(Array.isArray(output.data)).toBe(true);

      expect(
        (output.data as Array<{ id: string }>).map((item) => item.id),
      ).toEqual(["1", "2"]);
    });

    it("supports empty collections", () => {
      const output = serialize([], articleResource, {
        timestamp: false,
      });

      expect(output).toEqual({
        data: [],
      });
    });
  });

  describe("metadata", () => {
    it("includes meta.timestamp by default", () => {
      const output = serialize(article, articleResource);

      expect(output.meta?.timestamp).toBeDefined();
    });

    it("omits meta entirely when timestamp is false and no other meta exists", () => {
      const output = serialize(article, articleResource, {
        timestamp: false,
      });

      expect(output.meta).toBeUndefined();
    });

    it("keeps custom meta even when timestamp is false", () => {
      const output = serialize(article, articleResource, {
        timestamp: false,
        meta: {
          total: 1,
        },
      });

      expect(output.meta).toEqual({
        total: 1,
      });
    });

    it("includes jsonapi top-level member when provided", () => {
      const output = serialize(article, articleResource, {
        timestamp: false,
        jsonapi: {
          version: "1.1",
        },
      });

      expect(output.jsonapi).toEqual({
        version: "1.1",
      });
    });
  });

  describe("context", () => {
    it("passes context to resource callbacks", () => {
      const resource = createResource<Article, { host: string }>("articles", {
        attributes: (a) => ({
          title: a.title,
        }),
        links: (a, ctx) => ({
          self: `${ctx?.host}/articles/${a.id}`,
        }),
      });

      const output = serialize(article, resource, {
        timestamp: false,
        context: {
          host: "https://example.com",
        },
      });

      expect(output.data).toMatchObject({
        links: {
          self: "https://example.com/articles/1",
        },
      });
    });
  });

  describe("compound documents", () => {
    it("dedupes explicitly included resources by type and id", () => {
      const output = serialize(article, articleResource, {
        timestamp: false,
        included: [
          {
            type: "people",
            id: "9",
            attributes: {
              name: "Dan",
            },
          },
          {
            type: "people",
            id: "9",
            attributes: {
              name: "Dan",
            },
          },
          {
            type: "people",
            id: "10",
            attributes: {
              name: "Jane",
            },
          },
        ],
      });

      expect(output.included).toHaveLength(2);

      expect(output.included?.map((r) => r.id)).toEqual(["9", "10"]);
    });
  });
});

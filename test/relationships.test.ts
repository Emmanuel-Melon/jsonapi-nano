import { describe, it, expect } from "vitest";
import { belongsTo, hasMany } from "../src/relationships";

describe("belongsTo", () => {
  it("creates a resource identifier relationship", () => {
    expect(belongsTo("authors", "auth_1")).toEqual({
      data: {
        type: "authors",
        id: "auth_1",
      },
    });
  });

  it("returns null relationship data when id is null", () => {
    expect(belongsTo("authors", null)).toEqual({
      data: null,
    });
  });
});

describe("belongsTo - with extra properties", () => {
  it("appends links and meta objects when provided", () => {
    const extra = {
      links: { self: "/articles/1/relationships/author" },
      meta: { verified: true },
    };
    expect(belongsTo("authors", "auth_1", extra)).toEqual({
      data: { type: "authors", id: "auth_1" },
      links: { self: "/articles/1/relationships/author" },
      meta: { verified: true },
    });
  });
});

describe("hasMany", () => {
  it("creates an array of resource identifiers", () => {
    expect(hasMany("authors", ["1", "2"])).toEqual({
      data: [
        {
          type: "authors",
          id: "1",
        },
        {
          type: "authors",
          id: "2",
        },
      ],
    });
  });

  it("supports empty relationships", () => {
    expect(hasMany("authors", [])).toEqual({
      data: [],
    });
  });
});

describe("hasMany - with extra properties", () => {
  it("appends links and meta objects when provided", () => {
    const extra = {
      links: { related: "/articles/1/comments" },
    };
    expect(hasMany("comments", ["1"], extra)).toEqual({
      data: [{ type: "comments", id: "1" }],
      links: { related: "/articles/1/comments" },
    });
  });
});

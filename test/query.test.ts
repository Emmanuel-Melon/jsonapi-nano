import { describe, it, expect } from "vitest";
import { fieldsFromQuery } from "../src/query";

describe("fieldsFromQuery", () => {
  it("returns undefined when no fields query parameter exists", () => {
    const query = { page: "2", filter: "active" };
    const result = fieldsFromQuery(query);
    expect(result).toBeUndefined();
  });

  it("returns undefined when query is completely empty", () => {
    const result = fieldsFromQuery({});
    expect(result).toBeUndefined();
  });

  it("parses single comma-separated field fields correctly", () => {
    const query = {
      fields: {
        articles: "title,body",
      },
    };
    const result = fieldsFromQuery(query);
    expect(result).toEqual({
      articles: ["title", "body"],
    });
  });

  it("parses multiple resources with sparse fieldsets simultaneously", () => {
    const query = {
      fields: {
        articles: "title,body,relationships",
        people: "name,twitter",
      },
    };
    const result = fieldsFromQuery(query);
    expect(result).toEqual({
      articles: ["title", "body", "relationships"],
      people: ["name", "twitter"],
    });
  });

  it("handles a single attribute string with no commas safely", () => {
    const query = {
      fields: {
        articles: "title",
      },
    };
    const result = fieldsFromQuery(query);
    expect(result).toEqual({
      articles: ["title"],
    });
  });

  it("handles empty values gracefully by returning an array with an empty string", () => {
    const query = {
      fields: {
        articles: "",
      },
    };
    const result = fieldsFromQuery(query);
    expect(result).toEqual({
      articles: [""],
    });
  });
});

import { describe, it, expect } from "vitest";
import { serializeErrors } from "../src/errors";

describe("serializeErrors", () => {
  it("serializes a single error", () => {
    const output = serializeErrors({
      status: 404,
      title: "Not Found",
      detail: "Article not found",
    });
    expect(output.errors).toEqual([
      { status: "404", title: "Not Found", detail: "Article not found" },
    ]);
  });

  it("defaults title to 'Error' when omitted", () => {
    const output = serializeErrors({ status: 500 });
    expect(output.errors[0].title).toBe("Error");
  });

  it("serializes multiple errors", () => {
    const output = serializeErrors([
      {
        status: 422,
        title: "Invalid",
        source: { pointer: "/data/attributes/title" },
      },
      {
        status: 422,
        title: "Missing",
        source: { pointer: "/data/attributes/body" },
      },
    ]);
    expect(output.errors).toHaveLength(2);
  });

  it("includes source.header when provided", () => {
    const output = serializeErrors({
      status: 400,
      title: "Bad header",
      source: { header: "X-Api-Key" },
    });
    expect(output.errors[0].source).toEqual({ header: "X-Api-Key" });
  });

  it("stringifies numeric status codes", () => {
    const output = serializeErrors({ status: 429, meta: { retryAfter: 30 } });
    expect(output.errors[0].status).toBe("429");
    expect(typeof output.errors[0].status).toBe("string");
  });
});

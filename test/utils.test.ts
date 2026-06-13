import { describe, it, expect } from "vitest";
import { applyFieldset, dedupeIncluded, resolveIncluded } from "../src/utils";

describe("dedupeIncluded", () => {
  it("removes duplicate type+id pairs, keeping the last", () => {
    const result = dedupeIncluded([
      { type: "people", id: 9, attributes: { name: "Dan" } },
      { type: "people", id: 9, attributes: { name: "Dan Updated" } },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].attributes?.name).toBe("Dan Updated");
  });

  it("stringifies ids", () => {
    const result = dedupeIncluded([{ type: "people", id: 9 }]);
    expect(result[0].id).toBe("9");
  });
});

describe("applyFieldset", () => {
  it("returns object unchanged when no fields option is provided", () => {
    const result = applyFieldset(
      { title: "A", body: "B" },
      "articles",
      undefined,
    );
    expect(result).toEqual({ title: "A", body: "B" });
  });

  it("returns object unchanged when no fields entry for this type", () => {
    const result = applyFieldset({ title: "A", body: "B" }, "articles", {
      authors: ["name"],
    });
    expect(result).toEqual({ title: "A", body: "B" });
  });

  it("filters keys to only those listed for the type", () => {
    const result = applyFieldset({ title: "A", body: "B" }, "articles", {
      articles: ["title"],
    });
    expect(result).toEqual({ title: "A" });
  });

  it("returns an empty object when no fields match", () => {
    const result = applyFieldset({ title: "A", body: "B" }, "articles", {
      articles: ["summary"],
    });
    expect(result).toEqual({});
  });
});

describe("resolveIncluded", () => {
  it("extracts matching dataset items specified by primary resource relationships", () => {
    const primaryData = [
      {
        id: "1",
        type: "articles",
        relationships: {
          author: { data: { type: "people", id: "auth_99" } },
          tags: {
            data: [
              { type: "labels", id: "tag_1" },
              { type: "labels", id: "tag_2" },
            ],
          },
        },
      },
    ];

    const peopleDataset = [
      { id: "auth_99", name: "Alice" },
      { id: "auth_100", name: "Bob" }, // Should be ignored (unreferenced)
    ];

    const fakePeopleResource = {
      type: "people",
      attributes: (item: any) => ({ name: item.name }),
    };

    const result = resolveIncluded(
      primaryData,
      { author: [peopleDataset, fakePeopleResource] },
      undefined,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: "people",
      id: "auth_99",
      attributes: { name: "Alice" },
    });
  });
});

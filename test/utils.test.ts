import { describe, it, expect } from "vitest";
import { dedupeIncluded } from "../src/utils";

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

import { describe, it, expect } from "vitest";
import { formatSingle } from "../src/serializer";

describe("formatSingle", () => {
  const ninjaResource = {
    type: "shinobi",
    attributes: (item: { name: string; rank: string }) => ({
      name: item.name,
      rank: item.rank,
    }),
  };

  it("successfully transforms a raw object into JSON:API document format", () => {
    const item = { id: 7, name: "Naruto Uzumaki", rank: "Genin" };
    const result = formatSingle(item, ninjaResource, undefined, undefined);

    expect(result).toEqual({
      type: "shinobi",
      id: "7",
      attributes: {
        name: "Naruto Uzumaki",
        rank: "Genin",
      },
    });
  });

  it("throws an explicit error if the item is missing an id", () => {
    // Rogue ninja with no registration ID
    const item = { name: "Missing-nin", rank: "Unranked" } as any;

    expect(() =>
      formatSingle(item, ninjaResource, undefined, undefined),
    ).toThrowError("jsonapi-nano: resource item is missing an `id`");
  });

  it("passes runtime context through to attributes, links, and meta methods", () => {
    const contextMock = { village: "Konohagakure" };

    const hiddenLeafResource = {
      type: "shinobi",
      attributes: (item: any) => ({ name: item.name }),
      meta: (item: any, ctx: any) => ({
        isFromHometown: ctx.village === "Konohagakure",
      }),
      links: (item: any, ctx: any) => ({
        profile: `https://api.leaf.village/shinobi/${item.id}`,
      }),
    };

    const item = { id: "uzumaki-7", name: "Naruto Uzumaki" };
    const result = formatSingle(
      item,
      hiddenLeafResource,
      contextMock,
      undefined,
    );

    expect(result.meta).toEqual({ isFromHometown: true });
    expect(result.links).toEqual({
      profile: "https://api.leaf.village/shinobi/uzumaki-7",
    });
  });

  it("omits empty attributes, relationships, links, or meta blocks if undefined", () => {
    const minimalResource = {
      type: "jutsu",
      attributes: () => ({}),
    };
    const item = { id: "rasengan-01" };
    const result = formatSingle(item, minimalResource, undefined, undefined);

    expect(result).not.toHaveProperty("attributes");
    expect(result).not.toHaveProperty("relationships");
    expect(result).not.toHaveProperty("links");
    expect(result).not.toHaveProperty("meta");
  });
});

import { describe, expect, test } from "bun:test";
import { content } from "./content";
import { contentCategories } from "./types";

describe("content list", () => {
  for (const category of contentCategories) {
    const items = content[category];

    describe(category, () => {
      test("has at least one item", () => {
        expect(items.length).toBeGreaterThan(0);
      });

      test("ids are lowercase kebab-case", () => {
        for (const item of items) {
          expect(item.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        }
      });

      test("ids are unique", () => {
        const ids = items.map((item) => item.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }

  test("has the game's 17 base cities and 5 promo cities", () => {
    const count = (source: string) => content.cities.filter((city) => city.source === source).length;
    expect(count("base")).toBe(17);
    expect(count("promo")).toBe(5);
  });

  test("has the game's 12 characters, none of them promos", () => {
    expect(content.characters.length).toBe(12);
    expect(content.characters.every((character) => character.source === "base")).toBe(true);
  });

  test("difficulty range is whole numbers with min <= max", () => {
    const { min, max } = content.difficulty;
    expect(Number.isInteger(min)).toBe(true);
    expect(Number.isInteger(max)).toBe(true);
    expect(min).toBeLessThanOrEqual(max);
  });
});

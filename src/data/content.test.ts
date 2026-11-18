import { describe, expect, test } from "bun:test";
import { content } from "./content";

const categories = {
  cities: content.cities,
  characters: content.characters,
  scenarios: content.scenarios,
  specialTiles: content.specialTiles,
};

describe("content list", () => {
  for (const [category, items] of Object.entries(categories)) {
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

      test("names are not blank", () => {
        for (const item of items) {
          expect(item.name.trim()).not.toBe("");
        }
      });
    });
  }

  test("difficulty range is whole numbers with min <= max", () => {
    const { min, max } = content.difficulty;
    expect(Number.isInteger(min)).toBe(true);
    expect(Number.isInteger(max)).toBe(true);
    expect(min).toBeLessThanOrEqual(max);
  });
});

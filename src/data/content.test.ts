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

  test("difficulty range is whole numbers with min <= max", () => {
    const { min, max } = content.difficulty;
    expect(Number.isInteger(min)).toBe(true);
    expect(Number.isInteger(max)).toBe(true);
    expect(min).toBeLessThanOrEqual(max);
  });
});

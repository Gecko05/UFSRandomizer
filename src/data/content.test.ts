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

  test("has the game's 13 scenarios, none of them promos", () => {
    expect(content.scenarios.length).toBe(13);
    expect(content.scenarios.every((scenario) => scenario.source === "base")).toBe(true);
  });

  describe("sky and special tiles", () => {
    const tiles = [...content.skyTiles, ...content.specialTiles];

    test("black stars are whole numbers, 0 or more, and flipping never lowers them", () => {
      for (const { id, blackStars } of tiles) {
        const { normal, flipped } = blackStars;
        expect({ id, valid: Number.isInteger(normal) && Number.isInteger(flipped) }).toEqual({ id, valid: true });
        expect({ id, valid: normal >= 0 && flipped >= normal }).toEqual({ id, valid: true });
      }
    });

    test("each special tile replaces a different, existing sky tile", () => {
      const skyTileIds = content.skyTiles.map((tile) => tile.id);
      const replaced = content.specialTiles.map((tile) => tile.replaces);
      expect(replaced.filter((id) => !skyTileIds.includes(id))).toEqual([]);
      expect(new Set(replaced).size).toBe(replaced.length);
    });

    test("match the game: 4 sky tiles (0 / 1 black) and 4 special tiles (1 / 2 black)", () => {
      expect(content.skyTiles.map((tile) => tile.blackStars)).toEqual(
        Array(4).fill({ normal: 0, flipped: 1 }),
      );
      expect(content.specialTiles.map((tile) => tile.blackStars)).toEqual(
        Array(4).fill({ normal: 1, flipped: 2 }),
      );
    });

    test("match the game: special sky tile N replaces sky tile N", () => {
      expect(content.specialTiles.map((tile) => [tile.id, tile.replaces])).toEqual([
        ["special-sky-tile-1", "sky-tile-1"],
        ["special-sky-tile-2", "sky-tile-2"],
        ["special-sky-tile-3", "sky-tile-3"],
        ["special-sky-tile-4", "sky-tile-4"],
      ]);
    });
  });

  test("difficulty range is whole numbers with min <= max", () => {
    const { min, max } = content.difficulty;
    expect(Number.isInteger(min)).toBe(true);
    expect(Number.isInteger(max)).toBe(true);
    expect(min).toBeLessThanOrEqual(max);
  });
});

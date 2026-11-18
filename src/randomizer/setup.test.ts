import { describe, expect, test } from "bun:test";
import { content } from "../data/content";
import { randomSetup, setupStars, type Setup } from "./setup";

const always = (value: number) => () => value;

describe("randomSetup", () => {
  test("with the lowest random values, takes the first options and every 'yes'", () => {
    expect(randomSetup(content, always(0))).toEqual({
      city: { id: "washington", damaged: true },
      sky: [1, 2, 3, 4].map((n) => ({
        skyTileId: `sky-tile-${n}`,
        tileId: `special-sky-tile-${n}`,
        special: true,
        flipped: true,
      })),
      character: { id: "jackson-moss", upgraded: true },
      scenario: null,
    });
  });

  test("with the highest random values, takes the last options and every 'no'", () => {
    expect(randomSetup(content, always(0.999))).toEqual({
      city: { id: "berlin", damaged: false },
      sky: [1, 2, 3, 4].map((n) => ({
        skyTileId: `sky-tile-${n}`,
        tileId: `sky-tile-${n}`,
        special: false,
        flipped: false,
      })),
      character: { id: "wang-lin", upgraded: false },
      scenario: "the-final-battle",
    });
  });

  test("always builds a valid setup", () => {
    const ids = (items: readonly { id: string }[]) => items.map((item) => item.id);
    for (let i = 0; i < 500; i++) {
      const setup = randomSetup(content, Math.random);
      expect(ids(content.cities)).toContain(setup.city.id);
      expect(ids(content.characters)).toContain(setup.character.id);
      expect([null, ...ids(content.scenarios)]).toContain(setup.scenario);
      expect(setup.sky.map((position) => position.skyTileId)).toEqual(ids(content.skyTiles));
      for (const position of setup.sky) {
        const allowed = position.special
          ? content.specialTiles.filter((tile) => tile.replaces === position.skyTileId)
          : content.skyTiles.filter((tile) => tile.id === position.skyTileId);
        expect(ids(allowed)).toContain(position.tileId);
      }
    }
  });

  test("throws when a category it picks from is empty", () => {
    expect(() => randomSetup({ ...content, cities: [] }, Math.random)).toThrow(
      "Cannot pick from an empty list",
    );
  });
});

describe("setupStars", () => {
  /** No scenario, all sky tiles on their normal side, undamaged city, regular character. */
  const plain: Setup = {
    city: { id: "london", damaged: false },
    sky: [1, 2, 3, 4].map((n) => ({
      skyTileId: `sky-tile-${n}`,
      tileId: `sky-tile-${n}`,
      special: false,
      flipped: false,
    })),
    character: { id: "wang-lin", upgraded: false },
    scenario: null,
  };

  const withSky = (index: number, special: boolean, flipped: boolean): Setup => ({
    ...plain,
    sky: plain.sky.map((position, i) =>
      i === index
        ? {
            ...position,
            tileId: special ? `special-${position.skyTileId}` : position.skyTileId,
            special,
            flipped,
          }
        : position,
    ),
  });

  const stars = (setup: Setup) => setupStars(setup, content);

  test("plain setup: only the regular character's 0.5 yellow", () => {
    expect(stars(plain)).toEqual({ black: 0, yellow: 0.5, difficulty: -0.5, complexity: 0.5 });
  });

  test("a scenario adds 1 black", () => {
    expect(stars({ ...plain, scenario: "evacuation" }).black).toBe(1);
  });

  test("a sky tile adds 0 black, 1 if flipped", () => {
    expect(stars(withSky(0, false, false)).black).toBe(0);
    expect(stars(withSky(0, false, true)).black).toBe(1);
  });

  test("a special tile adds 1 black, 2 if flipped", () => {
    expect(stars(withSky(2, true, false)).black).toBe(1);
    expect(stars(withSky(2, true, true)).black).toBe(2);
  });

  test("a damaged city adds 0.5 yellow", () => {
    expect(stars({ ...plain, city: { id: "london", damaged: true } }).yellow).toBe(1);
  });

  test("a character adds 0.5 yellow, 1 if upgraded", () => {
    expect(stars(plain).yellow).toBe(0.5);
    expect(stars({ ...plain, character: { id: "wang-lin", upgraded: true } }).yellow).toBe(1);
  });

  test("hardest setup: scenario, 4 flipped special tiles, damaged city, upgraded character", () => {
    expect(stars(randomSetup(content, always(0)))).toEqual({
      black: 8,
      yellow: 1.5,
      difficulty: 6.5,
      complexity: 9.5,
    });
    const full: Setup = { ...randomSetup(content, always(0)), scenario: "evacuation" };
    expect(stars(full)).toEqual({ black: 9, yellow: 1.5, difficulty: 7.5, complexity: 10.5 });
  });

  test("throws for an unknown tile", () => {
    const broken: Setup = {
      ...plain,
      sky: plain.sky.map((position) => ({ ...position, tileId: "nope" })),
    };
    expect(() => stars(broken)).toThrow('Unknown sky tile "nope"');
  });
});

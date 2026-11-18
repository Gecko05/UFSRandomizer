import { describe, expect, test } from "bun:test";
import { content } from "../data/content";
import { complexityOptions, complexityRange, findRandomSetup } from "./constraints";
import { setupStars, type RandomSource } from "./setup";

/** Small seeded random source (mulberry32), so tests are repeatable. */
function seeded(seed: number): RandomSource {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("complexityRange", () => {
  test("goes from 0.5 to 10.5 with the game's content", () => {
    expect(complexityRange(content)).toEqual({ min: 0.5, max: 10.5 });
  });
});

describe("complexityOptions", () => {
  test("lists every value from 0.5 to 10.5 in steps of 0.5", () => {
    const options = complexityOptions(content);
    expect(options.length).toBe(21);
    expect(options[0]).toBe(0.5);
    expect(options.at(-1)).toBe(10.5);
    expect(options).toContain(5);
  });
});

describe("findRandomSetup", () => {
  test("finds a setup with exactly the chosen complexity, for every option", () => {
    const random = seeded(1);
    for (const complexity of complexityOptions(content)) {
      const setup = findRandomSetup(content, random, (stars) => stars.complexity === complexity);
      expect(setup).not.toBeNull();
      if (setup !== null) {
        expect(setupStars(setup, content).complexity).toBe(complexity);
      }
    }
  });

  test("still varies the setup for a fixed complexity", () => {
    const random = seeded(2);
    const cities = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const setup = findRandomSetup(content, random, (stars) => stars.complexity === 5);
      if (setup !== null) {
        cities.add(setup.city.id);
      }
    }
    expect(cities.size).toBeGreaterThan(5);
  });

  test("returns null when no setup fits", () => {
    expect(findRandomSetup(content, seeded(3), () => false, 100)).toBeNull();
  });
});

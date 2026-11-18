import { describe, expect, test } from "bun:test";
import { content } from "../data/content";
import {
  chooseSetup,
  complexityOptions,
  difficultyOptions,
  findRandomSetup,
  possibleStars,
} from "./constraints";
import { randomSetup, setupStars, type RandomSource } from "./setup";

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

/** A random source that fails the test if any setup is drawn. */
const noDraws: RandomSource = () => {
  throw new Error("drew a setup");
};

const range = (from: number, to: number) =>
  Array.from({ length: (to - from) / 0.5 + 1 }, (_, i) => from + i * 0.5);

describe("possibleStars", () => {
  test("combines 0–9 black stars with 0.5, 1 or 1.5 yellow stars", () => {
    const stars = possibleStars(content);
    expect(stars.length).toBe(30);
    expect(stars).toContainEqual({ black: 0, yellow: 0.5, difficulty: -0.5, complexity: 0.5 });
    expect(stars).toContainEqual({ black: 9, yellow: 1.5, difficulty: 7.5, complexity: 10.5 });
  });

  test("matches the stars of real setups exactly (no missing or impossible combination)", () => {
    const key = (stars: { black: number; yellow: number }) => `${stars.black}/${stars.yellow}`;
    const random = seeded(6);
    const seen = new Set<string>();
    for (let i = 0; i < 200_000; i++) {
      seen.add(key(setupStars(randomSetup(content, random), content)));
    }
    expect([...seen].sort()).toEqual(possibleStars(content).map(key).sort());
  });
});

describe("complexityOptions", () => {
  test("lists every value from 0.5 to 10.5 in steps of 0.5", () => {
    expect(complexityOptions(content)).toEqual(range(0.5, 10.5));
  });
});

describe("difficultyOptions", () => {
  test("goes from the lowest possible difficulty up to the complexity", () => {
    // Complexity 5 needs 1 yellow star (black stars are whole), so difficulty 3 at least.
    expect(difficultyOptions(content, 5)).toEqual(range(3, 5));
    // Complexity 5.5: 0.5 or 1.5 yellow stars, so difficulty 4.5 or 2.5.
    expect(difficultyOptions(content, 5.5)).toEqual(range(2.5, 5.5));
    expect(difficultyOptions(content, 0.5)).toEqual(range(-0.5, 0.5));
  });

  test("is empty for a complexity no setup has", () => {
    expect(difficultyOptions(content, 11)).toEqual([]);
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

  test("returns null at once, without drawing, when no setup can fit", () => {
    expect(findRandomSetup(content, noDraws, () => false)).toBeNull();
  });
});

describe("chooseSetup", () => {
  test("totally random (no choice) takes the first setup drawn, with no filter", () => {
    expect(chooseSetup(content, () => 0, null)).toEqual(randomSetup(content, () => 0));
  });

  test("keeps the complexity exact and the difficulty inside the range", () => {
    const random = seeded(5);
    for (const difficulty of [
      { min: 4.5, max: 5.5 },
      { min: 2.5, max: 2.5 },
    ]) {
      for (let i = 0; i < 20; i++) {
        const setup = chooseSetup(content, random, { complexity: 5.5, difficulty });
        expect(setup).not.toBeNull();
        if (setup !== null) {
          const stars = setupStars(setup, content);
          expect(stars.complexity).toBe(5.5);
          expect(stars.difficulty).toBeGreaterThanOrEqual(difficulty.min);
          expect(stars.difficulty).toBeLessThanOrEqual(difficulty.max);
        }
      }
    }
  });

  test("returns null at once when no setup has that difficulty", () => {
    // Complexity 5 always gives difficulty 3.
    expect(chooseSetup(content, noDraws, { complexity: 5, difficulty: { min: 4, max: 5 } })).toBeNull();
  });
});

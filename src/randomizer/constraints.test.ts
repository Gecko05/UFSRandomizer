import { describe, expect, test } from "bun:test";
import { content } from "../data/content";
import {
  chooseSetup,
  complexityOptions,
  defaultChoice,
  difficultyOptions,
  findRandomSetup,
  fullTarget,
  possibleStars,
  withOptions,
} from "./constraints";
import { allOptionsOn, randomSetup, setupStars, type RandomSource, type SetupOptions } from "./setup";

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

const allOff: SetupOptions = { characters: false, scenarios: false, specialTiles: false };
const noCharacters: SetupOptions = { ...allOptionsOn, characters: false };

/** All 8 on/off combinations of the three options. */
const everyOptions: SetupOptions[] = [false, true].flatMap((characters) =>
  [false, true].flatMap((scenarios) =>
    [false, true].map((specialTiles) => ({ characters, scenarios, specialTiles })),
  ),
);

describe("possibleStars", () => {
  test("all on: 1–9 black stars with 0.5, 1 or 1.5 yellow stars", () => {
    const stars = possibleStars(content, allOptionsOn);
    expect(stars.length).toBe(27);
    expect(stars).toContainEqual({ black: 1, yellow: 0.5, difficulty: 0.5, complexity: 1.5 });
    expect(stars).toContainEqual({ black: 9, yellow: 1.5, difficulty: 7.5, complexity: 10.5 });
  });

  test("all off: 0–4 black stars with 0 or 0.5 yellow stars", () => {
    const stars = possibleStars(content, allOff);
    expect(stars.length).toBe(10);
    expect(stars).toContainEqual({ black: 0, yellow: 0, difficulty: 0, complexity: 0 });
  });

  test("matches the stars of real setups exactly, for every combination of options", () => {
    const key = (stars: { black: number; yellow: number }) => `${stars.black}/${stars.yellow}`;
    const random = seeded(6);
    for (const options of everyOptions) {
      const seen = new Set<string>();
      for (let i = 0; i < 30_000; i++) {
        seen.add(key(setupStars(randomSetup(content, random, options), content)));
      }
      expect({ options, stars: [...seen].sort() }).toEqual({
        options,
        stars: possibleStars(content, options).map(key).sort(),
      });
    }
  });
});

describe("complexityOptions", () => {
  test("follows the options", () => {
    expect(complexityOptions(content, allOptionsOn)).toEqual(range(1.5, 10.5));
    expect(complexityOptions(content, allOff)).toEqual(range(0, 4.5));
  });
});

describe("difficultyOptions", () => {
  test("goes from the lowest possible difficulty up to the complexity", () => {
    // All on, complexity 5 needs 1 yellow star (black stars are whole): difficulty 3.
    expect(difficultyOptions(content, allOptionsOn, 5)).toEqual(range(3, 5));
    // Complexity 5.5: 0.5 or 1.5 yellow stars, so difficulty 4.5 or 2.5.
    expect(difficultyOptions(content, allOptionsOn, 5.5)).toEqual(range(2.5, 5.5));
  });

  test("without characters, difficulty can equal complexity", () => {
    expect(difficultyOptions(content, noCharacters, 5)).toEqual([5]);
  });

  test("is empty for a complexity no setup has", () => {
    expect(difficultyOptions(content, allOptionsOn, 0.5)).toEqual([]);
  });
});

describe("findRandomSetup", () => {
  test("finds a setup with exactly the chosen complexity, for every option", () => {
    const random = seeded(1);
    for (const options of everyOptions) {
      for (const complexity of complexityOptions(content, options)) {
        const setup = findRandomSetup(content, random, options, (stars) => stars.complexity === complexity);
        expect(setup).not.toBeNull();
        if (setup !== null) {
          expect(setupStars(setup, content).complexity).toBe(complexity);
        }
      }
    }
  });

  test("still varies the setup for a fixed complexity", () => {
    const random = seeded(2);
    const cities = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const setup = findRandomSetup(content, random, allOptionsOn, (stars) => stars.complexity === 5);
      if (setup !== null) {
        cities.add(setup.city.id);
      }
    }
    expect(cities.size).toBeGreaterThan(5);
  });

  test("returns null at once, without drawing, when no setup can fit", () => {
    expect(findRandomSetup(content, noDraws, allOptionsOn, () => false)).toBeNull();
  });
});

describe("chooseSetup", () => {
  test("totally random takes the first setup drawn, with the options but no filter", () => {
    expect(chooseSetup(content, () => 0, defaultChoice)).toEqual(randomSetup(content, () => 0));
    expect(chooseSetup(content, () => 0, { options: allOff, target: null })).toEqual(
      randomSetup(content, () => 0, allOff),
    );
  });

  test("keeps the options, the exact complexity and the difficulty range", () => {
    const random = seeded(5);
    for (const difficulty of [
      { min: 4.5, max: 5.5 },
      { min: 2.5, max: 2.5 },
    ]) {
      for (let i = 0; i < 20; i++) {
        const setup = chooseSetup(content, random, {
          options: allOptionsOn,
          target: { complexity: 5.5, difficulty },
        });
        expect(setup).not.toBeNull();
        if (setup !== null) {
          const stars = setupStars(setup, content);
          expect(stars.complexity).toBe(5.5);
          expect(stars.difficulty).toBeGreaterThanOrEqual(difficulty.min);
          expect(stars.difficulty).toBeLessThanOrEqual(difficulty.max);
        }
      }
    }
    const withoutCharacter = chooseSetup(content, random, {
      options: noCharacters,
      target: { complexity: 5, difficulty: { min: 5, max: 5 } },
    });
    expect(withoutCharacter?.character).toBeNull();
  });

  test("returns null at once when no setup has that difficulty", () => {
    // All on, complexity 5 always gives difficulty 3.
    const choice = { options: allOptionsOn, target: { complexity: 5, difficulty: { min: 4, max: 5 } } };
    expect(chooseSetup(content, noDraws, choice)).toBeNull();
  });
});

describe("fullTarget", () => {
  test("picks the whole difficulty range, up to the complexity", () => {
    expect(fullTarget(content, allOptionsOn, 5.5)).toEqual({
      complexity: 5.5,
      difficulty: { min: 2.5, max: 5.5 },
    });
  });
});

describe("withOptions", () => {
  test("keeps the complexity if still possible, with the full difficulty range again", () => {
    const choice = { options: allOptionsOn, target: { complexity: 5, difficulty: { min: 3, max: 3 } } };
    expect(withOptions(content, choice, noCharacters)).toEqual({
      options: noCharacters,
      target: { complexity: 5, difficulty: { min: 5, max: 5 } },
    });
  });

  test("goes back to totally random if the complexity is no longer possible", () => {
    const choice = { options: allOff, target: { complexity: 0, difficulty: { min: 0, max: 0 } } };
    expect(withOptions(content, choice, allOptionsOn)).toEqual({ options: allOptionsOn, target: null });
  });

  test("stays totally random", () => {
    expect(withOptions(content, defaultChoice, allOff)).toEqual({ options: allOff, target: null });
  });
});

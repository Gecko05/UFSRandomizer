import { starRules } from "../data/rules";
import type { GameContent } from "../data/types";
import {
  allOptionsOn,
  randomSetup,
  setupStars,
  type RandomSource,
  type Setup,
  type SetupOptions,
  type SetupStars,
} from "./setup";

/** Star values, and so difficulty and complexity, are multiples of this. */
export const starStep = 0.5;

const unique = (values: number[]) => [...new Set(values)];

/**
 * Every combination of black and yellow stars a setup can have with these options.
 * Black stars (scenario, sky) and yellow stars (city, character) are chosen
 * independently, so every black total combines with every yellow total.
 */
export function possibleStars(content: GameContent, options: SetupOptions): SetupStars[] {
  const { scenarioBlack, damagedCityYellow, characterYellow } = starRules;

  let blacks = [options.scenarios ? scenarioBlack : 0];
  for (const skyTile of content.skyTiles) {
    const specialTiles = options.specialTiles
      ? content.specialTiles.filter((tile) => tile.replaces === skyTile.id)
      : [];
    const tileBlacks = unique(
      [skyTile, ...specialTiles].flatMap((tile) => [tile.blackStars.normal, tile.blackStars.flipped]),
    );
    blacks = unique(blacks.flatMap((black) => tileBlacks.map((tileBlack) => black + tileBlack)));
  }

  const characterYellows = options.characters
    ? [characterYellow.regular, characterYellow.upgraded]
    : [0];
  const yellows = unique(
    [0, damagedCityYellow].flatMap((city) => characterYellows.map((character) => city + character)),
  );

  return blacks.flatMap((black) =>
    yellows.map((yellow) => ({
      black,
      yellow,
      difficulty: black - yellow,
      complexity: black + yellow,
    })),
  );
}

/** Every complexity value a setup can have with these options, lowest first. */
export function complexityOptions(content: GameContent, options: SetupOptions): number[] {
  return unique(possibleStars(content, options).map((stars) => stars.complexity)).sort(
    (a, b) => a - b,
  );
}

/**
 * Difficulty values a player can pick for a complexity: from the lowest difficulty a
 * setup with that complexity can have, up to the complexity itself.
 */
export function difficultyOptions(
  content: GameContent,
  options: SetupOptions,
  complexity: number,
): number[] {
  const difficulties = possibleStars(content, options)
    .filter((stars) => stars.complexity === complexity)
    .map((stars) => stars.difficulty);
  if (difficulties.length === 0) {
    return [];
  }
  const min = Math.min(...difficulties);
  const count = Math.round((complexity - min) / starStep) + 1;
  return Array.from({ length: count }, (_, i) => min + i * starStep);
}

/**
 * A random setup whose stars pass `fits`, or `null` if no setup can fit.
 *
 * Checks first that some setup can fit, so "no fit" is instant. Then draws random
 * setups until one fits. Every allowed setup is equally likely to be drawn, so every
 * setup that fits is equally likely to be returned. The rarest complexity fits about
 * 1 setup in 1,000, so the attempt limit is only a safety net.
 */
export function findRandomSetup(
  content: GameContent,
  random: RandomSource,
  options: SetupOptions,
  fits: (stars: SetupStars) => boolean,
  maxAttempts = 1_000_000,
): Setup | null {
  if (!possibleStars(content, options).some(fits)) {
    return null;
  }
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const setup = randomSetup(content, random, options);
    if (fits(setupStars(setup, content))) {
      return setup;
    }
  }
  return null;
}

/** An exact complexity and a difficulty range within it. */
export interface StarTarget {
  complexity: number;
  difficulty: { min: number; max: number };
}

/** Everything the player chose. A `null` target means "Totally random". */
export interface SetupChoice {
  options: SetupOptions;
  target: StarTarget | null;
}

export const defaultChoice: SetupChoice = { options: allOptionsOn, target: null };

/** A setup for the player's choice, or `null` if none fits. */
export function chooseSetup(
  content: GameContent,
  random: RandomSource,
  choice: SetupChoice,
): Setup | null {
  const { options, target } = choice;
  if (target === null) {
    return randomSetup(content, random, options);
  }
  const { complexity, difficulty } = target;
  return findRandomSetup(
    content,
    random,
    options,
    (stars) =>
      stars.complexity === complexity &&
      stars.difficulty >= difficulty.min &&
      stars.difficulty <= difficulty.max,
  );
}

/** A target with the full difficulty range for this complexity. */
export function fullTarget(
  content: GameContent,
  options: SetupOptions,
  complexity: number,
): StarTarget {
  const difficulties = difficultyOptions(content, options, complexity);
  return { complexity, difficulty: { min: difficulties[0] ?? complexity, max: complexity } };
}

/**
 * The choice after the player changes the options. Keeps the complexity if the new
 * options still allow it (with the full difficulty range again); otherwise goes back to
 * "Totally random".
 */
export function withOptions(
  content: GameContent,
  choice: SetupChoice,
  options: SetupOptions,
): SetupChoice {
  const { target } = choice;
  if (target === null || !complexityOptions(content, options).includes(target.complexity)) {
    return { options, target: null };
  }
  return { options, target: fullTarget(content, options, target.complexity) };
}

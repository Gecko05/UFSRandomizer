import { starRules } from "../data/rules";
import type { GameContent } from "../data/types";
import { randomSetup, setupStars, type RandomSource, type Setup, type SetupStars } from "./setup";

/** Star values, and so difficulty and complexity, are multiples of this. */
export const starStep = 0.5;

const unique = (values: number[]) => [...new Set(values)];

/**
 * Every combination of black and yellow stars some setup from this content can have.
 * Black stars (scenario, sky) and yellow stars (city, character) are chosen
 * independently, so every black total combines with every yellow total.
 */
export function possibleStars(content: GameContent): SetupStars[] {
  let blacks = content.scenarios.length > 0 ? [0, starRules.scenarioBlack] : [0];
  for (const skyTile of content.skyTiles) {
    const tiles = [skyTile, ...content.specialTiles.filter((tile) => tile.replaces === skyTile.id)];
    const tileBlacks = unique(tiles.flatMap((tile) => [tile.blackStars.normal, tile.blackStars.flipped]));
    blacks = unique(blacks.flatMap((black) => tileBlacks.map((tileBlack) => black + tileBlack)));
  }

  const { damagedCityYellow, characterYellow } = starRules;
  const yellows = unique(
    [0, damagedCityYellow].flatMap((city) =>
      [characterYellow.regular, characterYellow.upgraded].map((character) => city + character),
    ),
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

/** Every complexity value some setup can have, lowest first. */
export function complexityOptions(content: GameContent): number[] {
  return unique(possibleStars(content).map((stars) => stars.complexity)).sort((a, b) => a - b);
}

/**
 * Difficulty values a player can pick for a complexity: from the lowest difficulty a
 * setup with that complexity can have, up to the complexity itself.
 */
export function difficultyOptions(content: GameContent, complexity: number): number[] {
  const difficulties = possibleStars(content)
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
 * setups until one fits. Every setup is equally likely to be drawn, so every setup that
 * fits is equally likely to be returned. The rarest complexity value (0.5) fits 1 setup
 * in 14,336, so the attempt limit is only a safety net.
 */
export function findRandomSetup(
  content: GameContent,
  random: RandomSource,
  fits: (stars: SetupStars) => boolean,
  maxAttempts = 1_000_000,
): Setup | null {
  if (!possibleStars(content).some(fits)) {
    return null;
  }
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const setup = randomSetup(content, random);
    if (fits(setupStars(setup, content))) {
      return setup;
    }
  }
  return null;
}

/** What the player asked for: an exact complexity and a difficulty range within it. */
export interface SetupChoice {
  complexity: number;
  difficulty: { min: number; max: number };
}

/** A setup for the player's choice (`null` choice = totally random), or `null` if none fits. */
export function chooseSetup(
  content: GameContent,
  random: RandomSource,
  choice: SetupChoice | null,
): Setup | null {
  if (choice === null) {
    return randomSetup(content, random);
  }
  const { complexity, difficulty } = choice;
  return findRandomSetup(
    content,
    random,
    (stars) =>
      stars.complexity === complexity &&
      stars.difficulty >= difficulty.min &&
      stars.difficulty <= difficulty.max,
  );
}

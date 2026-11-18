import { starRules } from "../data/rules";
import type { GameContent } from "../data/types";
import { randomSetup, setupStars, type RandomSource, type Setup, type SetupStars } from "./setup";

/** Complexity values are multiples of this. */
export const complexityStep = 0.5;

/** Lowest and highest complexity any setup from this content can have. */
export function complexityRange(content: GameContent): { min: number; max: number } {
  const { characterYellow, damagedCityYellow, scenarioBlack } = starRules;
  const skyStars = content.skyTiles.map((skyTile) => {
    const options = [skyTile, ...content.specialTiles.filter((tile) => tile.replaces === skyTile.id)];
    const stars = options.flatMap((tile) => [tile.blackStars.normal, tile.blackStars.flipped]);
    return { min: Math.min(...stars), max: Math.max(...stars) };
  });
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

  return {
    min: sum(skyStars.map((stars) => stars.min)) + characterYellow.regular,
    max:
      sum(skyStars.map((stars) => stars.max)) +
      scenarioBlack +
      damagedCityYellow +
      characterYellow.upgraded,
  };
}

/** Every complexity value a player can pick, lowest first. */
export function complexityOptions(content: GameContent): number[] {
  const { min, max } = complexityRange(content);
  const count = Math.round((max - min) / complexityStep) + 1;
  return Array.from({ length: count }, (_, i) => min + i * complexityStep);
}

/**
 * A random setup whose stars pass `fits`, or `null` if none was found.
 *
 * Draws random setups until one fits. Every setup is equally likely to be drawn, so
 * every setup that fits is equally likely to be returned. The rarest complexity
 * values fit about 1 setup in 15,000, so the default attempt limit is far above that.
 */
export function findRandomSetup(
  content: GameContent,
  random: RandomSource,
  fits: (stars: SetupStars) => boolean,
  maxAttempts = 1_000_000,
): Setup | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const setup = randomSetup(content, random);
    if (fits(setupStars(setup, content))) {
      return setup;
    }
  }
  return null;
}

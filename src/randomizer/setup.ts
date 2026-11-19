import { starRules } from "../data/rules";
import type { GameContent } from "../data/types";

/** Returns a number from 0 (inclusive) to 1 (exclusive), like `Math.random`. */
export type RandomSource = () => number;

/** One of the 4 sky positions: its sky tile, or the special tile that replaces it. */
export interface SkyPosition {
  /** The sky tile that belongs in this position. */
  skyTileId: string;
  /** The tile placed here: the sky tile itself, or its special tile. */
  tileId: string;
  special: boolean;
  flipped: boolean;
}

export interface Setup {
  city: { id: string; damaged: boolean };
  /** One entry per sky tile, in sky tile order. */
  sky: SkyPosition[];
  /** `null` when characters are turned off. */
  character: { id: string; upgraded: boolean } | null;
  /** `null` when scenarios are turned off. */
  scenario: string | null;
}

/** What the player turned on. Off means the setup never uses it. */
export interface SetupOptions {
  /** On: every setup has a character. */
  characters: boolean;
  /** On: every setup has a scenario. */
  scenarios: boolean;
  /** On: each sky position picks its sky tile or its special tile at random. */
  specialTiles: boolean;
}

export const allOptionsOn: SetupOptions = { characters: true, scenarios: true, specialTiles: true };

export interface SetupStars {
  black: number;
  yellow: number;
  /** black − yellow */
  difficulty: number;
  /** black + yellow */
  complexity: number;
}

function pick<T>(items: readonly T[], random: RandomSource): T {
  const item = items[Math.floor(random() * items.length)];
  if (item === undefined) {
    throw new Error("Cannot pick from an empty list");
  }
  return item;
}

function coinFlip(random: RandomSource): boolean {
  return random() < 0.5;
}

/**
 * A random setup from the given content and options. Every setup the options allow is
 * equally likely.
 */
export function randomSetup(
  content: GameContent,
  random: RandomSource,
  options: SetupOptions = allOptionsOn,
): Setup {
  const city = { id: pick(content.cities, random).id, damaged: coinFlip(random) };

  const sky = content.skyTiles.map((skyTile): SkyPosition => {
    const specialTile = options.specialTiles
      ? content.specialTiles.find((tile) => tile.replaces === skyTile.id)
      : undefined;
    const tile = specialTile !== undefined && coinFlip(random) ? specialTile : skyTile;
    return {
      skyTileId: skyTile.id,
      tileId: tile.id,
      special: tile !== skyTile,
      flipped: coinFlip(random),
    };
  });

  const character = options.characters
    ? { id: pick(content.characters, random).id, upgraded: coinFlip(random) }
    : null;

  const scenario = options.scenarios ? pick(content.scenarios, random).id : null;

  return { city, sky, character, scenario };
}

/** Black and yellow stars of a setup, and the difficulty and complexity they give. */
export function setupStars(setup: Setup, content: GameContent): SetupStars {
  const tiles = [...content.skyTiles, ...content.specialTiles];
  const skyBlack = setup.sky.reduce((sum, position) => {
    const tile = tiles.find((candidate) => candidate.id === position.tileId);
    if (tile === undefined) {
      throw new Error(`Unknown sky tile "${position.tileId}"`);
    }
    return sum + (position.flipped ? tile.blackStars.flipped : tile.blackStars.normal);
  }, 0);

  const black = skyBlack + (setup.scenario === null ? 0 : starRules.scenarioBlack);
  const { character } = setup;
  const characterYellow =
    character === null
      ? 0
      : character.upgraded
        ? starRules.characterYellow.upgraded
        : starRules.characterYellow.regular;
  const yellow = (setup.city.damaged ? starRules.damagedCityYellow : 0) + characterYellow;

  return { black, yellow, difficulty: black - yellow, complexity: black + yellow };
}

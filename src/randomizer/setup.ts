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
  character: { id: string; upgraded: boolean };
  /** Scenarios are optional: `null` means no scenario. */
  scenario: string | null;
}

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

/** A random setup from the given content. Every possible setup can come up. */
export function randomSetup(content: GameContent, random: RandomSource): Setup {
  const city = { id: pick(content.cities, random).id, damaged: coinFlip(random) };

  const sky = content.skyTiles.map((skyTile): SkyPosition => {
    const specialTile = content.specialTiles.find((tile) => tile.replaces === skyTile.id);
    const tile = specialTile !== undefined && coinFlip(random) ? specialTile : skyTile;
    return {
      skyTileId: skyTile.id,
      tileId: tile.id,
      special: tile !== skyTile,
      flipped: coinFlip(random),
    };
  });

  const character = { id: pick(content.characters, random).id, upgraded: coinFlip(random) };

  const scenarioIds = content.scenarios.map((scenario) => scenario.id);
  const scenario = pick([null, ...scenarioIds], random);

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
  const yellow =
    (setup.city.damaged ? starRules.damagedCityYellow : 0) +
    (setup.character.upgraded
      ? starRules.characterYellow.upgraded
      : starRules.characterYellow.regular);

  return { black, yellow, difficulty: black - yellow, complexity: black + yellow };
}

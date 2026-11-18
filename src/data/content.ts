import type { GameContent } from "./types";

/**
 * The game's content list: everything the randomizer can pick from.
 *
 * Edit this file to match the real game. Rules (checked by content.test.ts):
 * - `id` is lowercase kebab-case and unique within its category. Don't change an
 *   id once released: players' saved selections refer to it.
 * - `name` is what players see.
 * - `source` is "base" for the base game box, "promo" for promo content.
 * - Every category has at least one item.
 * - `difficulty.min` <= `difficulty.max`, both whole numbers.
 *
 * Everything below is PLACEHOLDER data.
 */
export const content: GameContent = {
  cities: [
    { id: "placeholder-city-1", name: "Placeholder City 1", source: "base" },
    { id: "placeholder-city-2", name: "Placeholder City 2", source: "base" },
    { id: "placeholder-city-3", name: "Placeholder City 3", source: "base" },
    { id: "placeholder-promo-city", name: "Placeholder Promo City", source: "promo" },
  ],
  characters: [
    { id: "placeholder-character-1", name: "Placeholder Character 1", source: "base" },
    { id: "placeholder-character-2", name: "Placeholder Character 2", source: "base" },
    { id: "placeholder-character-3", name: "Placeholder Character 3", source: "base" },
    { id: "placeholder-promo-character", name: "Placeholder Promo Character", source: "promo" },
  ],
  scenarios: [
    { id: "placeholder-scenario-1", name: "Placeholder Scenario 1", source: "base" },
    { id: "placeholder-scenario-2", name: "Placeholder Scenario 2", source: "base" },
    { id: "placeholder-promo-scenario", name: "Placeholder Promo Scenario", source: "promo" },
  ],
  specialTiles: [
    { id: "placeholder-special-tile-1", name: "Placeholder Special Tile 1", source: "base" },
    { id: "placeholder-special-tile-2", name: "Placeholder Special Tile 2", source: "base" },
  ],
  difficulty: { min: 0, max: 4 },
};

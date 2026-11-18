import type { GameContent } from "./types";

/**
 * The game's content list: everything the randomizer can pick from.
 * Display names are not here: each language has its own file in `src/i18n/languages/`.
 *
 * Edit this file to match the real game. Rules (checked by content.test.ts):
 * - `id` is lowercase kebab-case and unique within its category. Keep ids stable:
 *   code and language files refer to content by id.
 * - `source` is "base" for the base game box, "promo" for promo content.
 * - Every category has at least one item.
 * - `difficulty.min` <= `difficulty.max`, both whole numbers.
 *
 * When you add or remove an item, add or remove its name in every language file
 * (i18n tests fail until you do).
 *
 * Everything below is PLACEHOLDER data.
 */
export const content: GameContent = {
  cities: [
    { id: "placeholder-city-1", source: "base" },
    { id: "placeholder-city-2", source: "base" },
    { id: "placeholder-city-3", source: "base" },
    { id: "placeholder-promo-city", source: "promo" },
  ],
  characters: [
    { id: "placeholder-character-1", source: "base" },
    { id: "placeholder-character-2", source: "base" },
    { id: "placeholder-character-3", source: "base" },
    { id: "placeholder-promo-character", source: "promo" },
  ],
  scenarios: [
    { id: "placeholder-scenario-1", source: "base" },
    { id: "placeholder-scenario-2", source: "base" },
    { id: "placeholder-promo-scenario", source: "promo" },
  ],
  specialTiles: [
    { id: "placeholder-special-tile-1", source: "base" },
    { id: "placeholder-special-tile-2", source: "base" },
  ],
  difficulty: { min: 0, max: 4 },
};

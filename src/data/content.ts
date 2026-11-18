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
 * Cities, characters and scenarios are the real game content; special tiles are still
 * PLACEHOLDER data.
 */
export const content: GameContent = {
  cities: [
    { id: "washington", source: "base" },
    { id: "roswell", source: "base" },
    { id: "new-york", source: "base" },
    { id: "mexico-city", source: "base" },
    { id: "havana", source: "base" },
    { id: "montreal", source: "base" },
    { id: "rio-de-janeiro", source: "base" },
    { id: "london", source: "base" },
    { id: "cairo", source: "base" },
    { id: "moscow", source: "base" },
    { id: "johannesburg", source: "base" },
    { id: "paris", source: "base" },
    { id: "sydney", source: "base" },
    { id: "tokyo", source: "base" },
    { id: "seoul", source: "base" },
    { id: "beijing", source: "base" },
    { id: "singapore", source: "base" },
    { id: "kyiv", source: "promo" },
    { id: "essen", source: "promo" },
    { id: "cullompton", source: "promo" },
    { id: "prague", source: "promo" },
    { id: "berlin", source: "promo" },
  ],
  characters: [
    { id: "jackson-moss", source: "base" },
    { id: "clinton-harper", source: "base" },
    { id: "samantha-legrand", source: "base" },
    { id: "lucia-ortega", source: "base" },
    { id: "karima-almasi", source: "base" },
    { id: "shanti-aumann", source: "base" },
    { id: "jaroslav-ruzicka", source: "base" },
    { id: "pietr-bernstein", source: "base" },
    { id: "izox", source: "base" },
    { id: "archie-bell", source: "base" },
    { id: "jang-chanwook", source: "base" },
    { id: "wang-lin", source: "base" },
  ],
  scenarios: [
    { id: "fire-in-the-sky", source: "base" },
    { id: "evacuation", source: "base" },
    { id: "reactor-leak", source: "base" },
    { id: "reinforcements", source: "base" },
    { id: "satellites", source: "base" },
    { id: "the-saboteur", source: "base" },
    { id: "contamination", source: "base" },
    { id: "base-repair", source: "base" },
    { id: "a-risky-investigation", source: "base" },
    { id: "the-storm", source: "base" },
    { id: "the-command-ship", source: "base" },
    { id: "kamikaze-ships", source: "base" },
    { id: "the-final-battle", source: "base" },
  ],
  specialTiles: [
    { id: "placeholder-special-tile-1", source: "base" },
    { id: "placeholder-special-tile-2", source: "base" },
  ],
  difficulty: { min: 0, max: 4 },
};

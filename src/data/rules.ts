/**
 * Star rules that apply to a whole kind of content rather than to one item.
 * Sky and special tile stars are per tile, in `content.ts`.
 *
 * Black stars add difficulty, yellow stars lower it.
 * Difficulty = black − yellow. Complexity = black + yellow.
 */
export const starRules = {
  /** Black stars added by playing a scenario (scenarios are optional). */
  scenarioBlack: 1,
  /** Yellow stars added by a city on its damaged side. */
  damagedCityYellow: 0.5,
  /** Yellow stars added by the character, per side. */
  characterYellow: { regular: 0.5, upgraded: 1 },
} as const;

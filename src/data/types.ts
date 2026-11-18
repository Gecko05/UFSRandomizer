/** Where a piece of content comes from: the base game box or a promo. */
export type ContentSource = "base" | "promo";

/** One selectable item in a content category (a city, a character…). */
export interface ContentItem {
  /** Stable identifier, lowercase kebab-case (e.g. "jackson-moss"). Used in saved selections. */
  id: string;
  /** Display name shown to players. */
  name: string;
  source: ContentSource;
}

/** Every city can start damaged or undamaged. */
export type City = ContentItem;

/** Every character has a regular and an upgraded side. */
export type Character = ContentItem;

export type Scenario = ContentItem;

/** Details still to be defined. */
export type SpecialTile = ContentItem;

/** Inclusive range of threat levels (difficulty) the game offers. */
export interface DifficultyRange {
  min: number;
  max: number;
}

/** All content available for randomization. */
export interface GameContent {
  cities: readonly City[];
  characters: readonly Character[];
  scenarios: readonly Scenario[];
  specialTiles: readonly SpecialTile[];
  difficulty: DifficultyRange;
}

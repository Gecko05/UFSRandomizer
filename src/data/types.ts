/** Where a piece of content comes from: the base game box or a promo. */
export type ContentSource = "base" | "promo";

/**
 * One selectable item in a content category (a city, a character…).
 * Display names are per language, in `src/i18n/languages/`.
 */
export interface ContentItem {
  /** Stable identifier, lowercase kebab-case (e.g. "jackson-moss"). Must stay stable. */
  id: string;
  source: ContentSource;
}

/** Every city can start damaged or undamaged. */
export type City = ContentItem;

/** Every character has a regular and an upgraded side. */
export type Character = ContentItem;

export type Scenario = ContentItem;

/** Black stars (difficulty) a tile adds on each side. Tiles add no yellow stars. */
export interface BlackStars {
  normal: number;
  flipped: number;
}

/** One of the 4 numbered sky tiles. Can be flipped for extra difficulty. */
export interface SkyTile extends ContentItem {
  blackStars: BlackStars;
}

/** A special sky tile: replaces one specific sky tile, and can be flipped too. */
export interface SpecialTile extends ContentItem {
  /** Id of the sky tile this special tile replaces. */
  replaces: string;
  blackStars: BlackStars;
}

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
  skyTiles: readonly SkyTile[];
  specialTiles: readonly SpecialTile[];
  difficulty: DifficultyRange;
}

/** The categories of selectable content items. */
export type ContentCategory = Exclude<keyof GameContent, "difficulty">;

// `satisfies` makes the compiler reject a missing or unknown category here.
const categoryKeys = {
  cities: true,
  characters: true,
  scenarios: true,
  skyTiles: true,
  specialTiles: true,
} as const satisfies Record<ContentCategory, true>;

/** Every content category, in display order. */
export const contentCategories = Object.keys(categoryKeys) as readonly ContentCategory[];

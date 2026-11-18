import type { ContentCategory } from "../data/types";

/** Display names of content items, per category, keyed by content id. */
export type ContentNames = Record<ContentCategory, Readonly<Record<string, string>>>;

/** A character's tag (their role) on each side of the card. */
export interface CharacterTags {
  regular: string;
  upgraded: string;
}

/** Everything one language provides. One file per language in `languages/`. */
export interface LanguageDefinition {
  /** The language's own name for itself, shown in a language picker (e.g. "Español"). */
  label: string;
  contentNames: ContentNames;
  /** Character tags, keyed by character id. */
  characterTags: Readonly<Record<string, CharacterTags>>;
}

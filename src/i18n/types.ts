import type { ContentCategory } from "../data/types";

/** Display names of content items, per category, keyed by content id. */
export type ContentNames = Record<ContentCategory, Readonly<Record<string, string>>>;

/** A character's tag (their role) on each side of the card. */
export interface CharacterTags {
  regular: string;
  upgraded: string;
}

/** The parts of a setup, each shown with a singular heading (e.g. "Ciudad"). */
export type SetupPart = "city" | "character" | "scenario" | "sky";

/** Everything one language provides. One file per language in `languages/`. */
export interface LanguageDefinition {
  /** The language's own name for itself, shown in a language picker (e.g. "Español"). */
  label: string;
  /** Title of each content type, shown to players (e.g. "Ciudades"). */
  categoryLabels: Readonly<Record<ContentCategory, string>>;
  /** Heading of each part of a shown setup (e.g. "Ciudad"). */
  setupHeadings: Readonly<Record<SetupPart, string>>;
  contentNames: ContentNames;
  /** Character tags, keyed by character id. */
  characterTags: Readonly<Record<string, CharacterTags>>;
}

import type { ContentCategory } from "../data/types";
import { en } from "./languages/en";
import { es } from "./languages/es";
import type { LanguageDefinition } from "./types";

/**
 * Registry of supported languages, keyed by language code.
 * To add a language: create `languages/<code>.ts` and register it here.
 */
export const languages = { en, es } satisfies Record<string, LanguageDefinition>;

export type LanguageCode = keyof typeof languages;

/** Every registered language code, in registry order. */
export const languageCodes = Object.keys(languages) as LanguageCode[];

/** The language the app starts in. */
export const defaultLanguage: LanguageCode = "en";

/** Title of a content type in the given language (e.g. "Ciudades"). */
export function categoryLabel(language: LanguageCode, category: ContentCategory): string {
  return languages[language].categoryLabels[category];
}

/** Display name of a content item in the given language. Throws for an id the language doesn't name. */
export function contentName(language: LanguageCode, category: ContentCategory, id: string): string {
  const names = languages[language].contentNames[category];
  // Own entries only: plain objects also expose built-ins like `constructor` or `__proto__`.
  const name = Object.hasOwn(names, id) ? names[id] : undefined;
  if (name === undefined) {
    throw new Error(`Missing "${language}" name for ${category} item "${id}"`);
  }
  return name;
}

/** A character's tag in the given language, for the regular or upgraded side. Throws for an unknown id. */
export function characterTag(language: LanguageCode, id: string, upgraded: boolean): string {
  const tags = languages[language].characterTags;
  const tag = Object.hasOwn(tags, id) ? tags[id] : undefined;
  if (tag === undefined) {
    throw new Error(`Missing "${language}" tags for character "${id}"`);
  }
  return upgraded ? tag.upgraded : tag.regular;
}

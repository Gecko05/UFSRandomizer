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

/** Display name of a content item in the given language. */
export function contentName(language: LanguageCode, category: ContentCategory, id: string): string {
  const name = languages[language].contentNames[category][id];
  if (name === undefined) {
    throw new Error(`Missing "${language}" name for ${category} item "${id}"`);
  }
  return name;
}

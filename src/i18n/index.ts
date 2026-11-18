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

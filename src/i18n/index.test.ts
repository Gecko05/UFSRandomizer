import { describe, expect, test } from "bun:test";
import { content } from "../data/content";
import { contentCategories } from "../data/types";
import { contentName, languages } from "./index";

describe("language definitions", () => {
  for (const [code, language] of Object.entries(languages)) {
    describe(code, () => {
      test("has a label", () => {
        expect(language.label.trim()).not.toBe("");
      });

      for (const category of contentCategories) {
        const contentIds = content[category].map((item) => item.id);
        const names = language.contentNames[category];

        test(`names every ${category} item`, () => {
          const missing = contentIds.filter((id) => names[id] === undefined);
          expect(missing).toEqual([]);
        });

        test(`has no blank ${category} names`, () => {
          const blank = Object.entries(names)
            .filter(([, name]) => name.trim() === "")
            .map(([id]) => id);
          expect(blank).toEqual([]);
        });

        test(`names no unknown ${category} ids`, () => {
          const unknown = Object.keys(names).filter((id) => !contentIds.includes(id));
          expect(unknown).toEqual([]);
        });
      }
    });
  }
});

describe("contentName", () => {
  test("returns the name in the requested language", () => {
    expect(contentName("es", "cities", "placeholder-city-1")).toBe("Ciudad de ejemplo 1");
    expect(contentName("en", "cities", "placeholder-city-1")).toBe("Placeholder City 1");
  });

  test("throws for an unknown id", () => {
    expect(() => contentName("es", "cities", "atlantis")).toThrow(
      'Missing "es" name for cities item "atlantis"',
    );
  });
});

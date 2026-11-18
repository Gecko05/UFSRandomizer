import { describe, expect, test } from "bun:test";
import { content } from "../data/content";
import { contentCategories } from "../data/types";
import { contentName, languages } from "./index";

/** Problems in one category's name table, counting only the table's own entries. */
function findNameProblems(names: Readonly<Record<string, string>>, contentIds: readonly string[]) {
  return {
    missing: contentIds.filter((id) => !Object.hasOwn(names, id)),
    blank: Object.entries(names)
      .filter(([, name]) => name.trim() === "")
      .map(([id]) => id),
    unknown: Object.keys(names).filter((id) => !contentIds.includes(id)),
  };
}

describe("findNameProblems", () => {
  test("reports a missing name even when the id is a built-in object property", () => {
    const ids = ["constructor", "to-string", "__proto__"];
    expect(findNameProblems({ "to-string": "Name" }, ids).missing).toEqual([
      "constructor",
      "__proto__",
    ]);
  });

  test("reports blank names and unknown ids", () => {
    const problems = findNameProblems({ a: " ", b: "B", c: "C" }, ["a", "b"]);
    expect(problems.blank).toEqual(["a"]);
    expect(problems.unknown).toEqual(["c"]);
  });
});

describe("language definitions", () => {
  for (const [code, language] of Object.entries(languages)) {
    describe(code, () => {
      test("has a label", () => {
        expect(language.label.trim()).not.toBe("");
      });

      for (const category of contentCategories) {
        test(`names every ${category} item, with no blank names or unknown ids`, () => {
          const contentIds = content[category].map((item) => item.id);
          expect(findNameProblems(language.contentNames[category], contentIds)).toEqual({
            missing: [],
            blank: [],
            unknown: [],
          });
        });
      }
    });
  }
});

describe("contentName", () => {
  test("returns the name in the requested language", () => {
    expect(contentName("es", "cities", "mexico-city")).toBe("Ciudad de México");
    expect(contentName("en", "cities", "mexico-city")).toBe("Mexico City");
  });

  test("throws for an unknown id", () => {
    expect(() => contentName("es", "cities", "atlantis")).toThrow(
      'Missing "es" name for cities item "atlantis"',
    );
  });

  test.each(["constructor", "toString", "hasOwnProperty", "__proto__"])(
    "throws for built-in object property %p",
    (id) => {
      expect(() => contentName("es", "cities", id)).toThrow(`Missing "es" name for cities item "${id}"`);
    },
  );
});

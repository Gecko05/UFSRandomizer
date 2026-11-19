import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { content } from "../data/content";
import type { LanguageCode } from "../i18n";
import { defaultChoice, fullTarget, type SetupChoice } from "../randomizer/constraints";
import { allOptionsOn } from "../randomizer/setup";
import { ChoicePicker } from "./ChoicePicker";

const render = (choice: SetupChoice, language: LanguageCode = "en") =>
  renderToStaticMarkup(
    <ChoicePicker content={content} choice={choice} language={language} onChange={() => {}} />,
  );

/** The option values of the select inside the label with this text. */
function optionsAfter(html: string, label: string): string[] {
  const start = html.indexOf(label);
  const select = html.slice(start, html.indexOf("</select>", start));
  return [...select.matchAll(/<option value="([^"]+)"/g)].map((match) => match[1] ?? "");
}

describe("ChoicePicker", () => {
  test("shows the three toggles, all on by default", () => {
    const html = render(defaultChoice);
    for (const label of ["Characters", "Scenarios", "Special sky tiles"]) {
      expect(html).toContain(`<input type="checkbox" checked=""/>${label}`);
    }
  });

  test("names the toggles with the content type labels of the chosen language", () => {
    const html = render(defaultChoice, "es");
    for (const label of ["Personajes", "Escenarios", "Losetas de cielo especiales"]) {
      expect(html).toContain(`<input type="checkbox" checked=""/>${label}`);
    }
  });

  test("shows a toggle that is off as unchecked", () => {
    const html = render({ options: { ...allOptionsOn, characters: false }, target: null });
    expect(html).toContain('<input type="checkbox"/>Characters');
  });

  test("totally random: no difficulty range to pick", () => {
    const html = render(defaultChoice);
    expect(html).toContain('<option value="random" selected="">Totally random</option>');
    expect(html).not.toContain("Difficulty from");
  });

  test("offers only the complexities the toggles allow", () => {
    expect(optionsAfter(render(defaultChoice), "Complexity")[1]).toBe("1.5");
    const allOff = { characters: false, scenarios: false, specialTiles: false };
    expect(optionsAfter(render({ options: allOff, target: null }), "Complexity")[1]).toBe("0");
  });

  test("with a complexity: difficulty from the lowest possible up to the complexity", () => {
    const html = render({ options: allOptionsOn, target: fullTarget(content, allOptionsOn, 5.5) });
    expect(html).toContain('<option value="5.5" selected="">5.5</option>');
    expect(optionsAfter(html, "Difficulty from")).toEqual(["2.5", "3", "3.5", "4", "4.5", "5", "5.5"]);
    expect(optionsAfter(html, "to<")).toEqual(["2.5", "3", "3.5", "4", "4.5", "5", "5.5"]);
  });

  test("'from' can't go above 'to', and 'to' can't go below 'from'", () => {
    const html = render({
      options: allOptionsOn,
      target: { complexity: 5.5, difficulty: { min: 3.5, max: 4.5 } },
    });
    expect(optionsAfter(html, "Difficulty from")).toEqual(["2.5", "3", "3.5", "4", "4.5"]);
    expect(optionsAfter(html, "to<")).toEqual(["3.5", "4", "4.5", "5", "5.5"]);
  });
});

import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { content } from "../data/content";
import type { SetupChoice } from "../randomizer/constraints";
import { ChoicePicker, fullChoice } from "./ChoicePicker";

const render = (choice: SetupChoice | null) =>
  renderToStaticMarkup(<ChoicePicker content={content} choice={choice} onChange={() => {}} />);

/** The option values of the select inside the label with this text. */
function optionsAfter(html: string, label: string): string[] {
  const start = html.indexOf(label);
  const select = html.slice(start, html.indexOf("</select>", start));
  return [...select.matchAll(/<option value="([^"]+)"/g)].map((match) => match[1] ?? "");
}

describe("fullChoice", () => {
  test("picks the whole difficulty range, up to the complexity", () => {
    expect(fullChoice(content, 5.5)).toEqual({ complexity: 5.5, difficulty: { min: 2.5, max: 5.5 } });
  });
});

describe("ChoicePicker", () => {
  test("totally random: no difficulty range to pick", () => {
    const html = render(null);
    expect(html).toContain('<option value="random" selected="">Totally random</option>');
    expect(html).not.toContain("Difficulty from");
  });

  test("with a complexity: difficulty from the lowest possible up to the complexity", () => {
    const html = render(fullChoice(content, 5.5));
    expect(html).toContain('<option value="5.5" selected="">5.5</option>');
    expect(optionsAfter(html, "Difficulty from")).toEqual(["2.5", "3", "3.5", "4", "4.5", "5", "5.5"]);
    expect(optionsAfter(html, "to<")).toEqual(["2.5", "3", "3.5", "4", "4.5", "5", "5.5"]);
  });

  test("'from' can't go above 'to', and 'to' can't go below 'from'", () => {
    const html = render({ complexity: 5.5, difficulty: { min: 3.5, max: 4.5 } });
    expect(optionsAfter(html, "Difficulty from")).toEqual(["2.5", "3", "3.5", "4", "4.5"]);
    expect(optionsAfter(html, "to<")).toEqual(["3.5", "4", "4.5", "5", "5.5"]);
  });
});

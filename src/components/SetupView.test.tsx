import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { content } from "../data/content";
import { randomSetup, setupStars, type Setup } from "../randomizer/setup";
import { SetupView } from "./SetupView";

const render = (setup: Setup, language: "en" | "es" = "en") =>
  renderToStaticMarkup(
    <SetupView setup={setup} stars={setupStars(setup, content)} language={language} />,
  );

test("shows every part of the setup and its stars", () => {
  const html = render(randomSetup(content, () => 0));

  expect(html).toContain("Washington, DC · Damaged");
  expect(html).toContain("Jackson Moss · General (Upgraded)");
  expect(html).toContain("Fire in the Sky");
  for (const n of [1, 2, 3, 4]) {
    expect(html).toContain(`Special sky tile ${n} · Flipped`);
  }
  expect(html).toContain("Black stars 9 · Yellow stars 1.5 · Difficulty 7.5 ·");
  expect(html).toContain("Complexity 10.5");
});

test("shows a setup with every tile, city and character on its plain side", () => {
  const html = render(randomSetup(content, () => 0.999));

  expect(html).toContain("Berlin · Undamaged");
  expect(html).toContain("Wang Lin · Scientist (Regular)");
  expect(html).toContain("The Final Battle");
  expect(html).toContain("Sky tile 1</li>");
});

test("shows 'No character' and 'No scenario' when the setup has none", () => {
  const setup: Setup = { ...randomSetup(content, () => 0), character: null, scenario: null };
  const html = render(setup);

  expect(html).toContain("No character");
  expect(html).toContain("No scenario");
  expect(html).toContain("Black stars 8 · Yellow stars 0.5 ·");
});

test("shows names in the given language", () => {
  const html = render(randomSetup(content, () => 0), "es");

  expect(html).toContain("Washington · Damaged");
  expect(html).toContain("Jackson Moss · General");
  expect(html).toContain("Fuego en el cielo");
  expect(html).toContain("Loseta de cielo especial 1");
});

test("shows the headings in the given language", () => {
  const headings = (language: "en" | "es") =>
    [...render(randomSetup(content, () => 0), language).matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)].map(
      (match) => match[1],
    );
  expect(headings("en")).toEqual(["City", "Character", "Scenario", "Sky"]);
  expect(headings("es")).toEqual(["Ciudad", "Personaje", "Escenario", "Cielo"]);
});

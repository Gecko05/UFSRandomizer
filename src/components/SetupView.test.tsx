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
  const setup: Setup = { ...randomSetup(content, () => 0), scenario: "evacuation" };
  const html = render(setup);

  expect(html).toContain("Washington, DC · Damaged");
  expect(html).toContain("Jackson Moss · General (Upgraded)");
  expect(html).toContain("Evacuation");
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

test("shows names in the given language", () => {
  const html = render(randomSetup(content, () => 0), "es");

  expect(html).toContain("Washington · Damaged");
  expect(html).toContain("Jackson Moss · General");
  expect(html).toContain("No scenario");
  expect(html).toContain("Loseta de cielo especial 1");
});

import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { content } from "../data/content";
import { randomSetup } from "../randomizer/setup";
import { ResultView } from "./ResultView";

test("says so when no setup fits the choices", () => {
  const html = renderToStaticMarkup(
    <ResultView content={content} result={{ kind: "no-fit" }} language="en" />,
  );
  expect(html).toContain("No setup fits these choices.");
  expect(html).not.toContain('aria-label="Setup"');
});

test("shows the setup and its stars when one fits", () => {
  const setup = randomSetup(content, () => 0.999);
  const html = renderToStaticMarkup(
    <ResultView content={content} result={{ kind: "setup", setup }} language="en" />,
  );
  expect(html).toContain('aria-label="Setup"');
  expect(html).toContain("Complexity 1.5");
});

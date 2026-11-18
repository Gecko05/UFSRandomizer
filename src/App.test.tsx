import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { App } from "./App";

test("starts with the Randomize button and no setup yet", () => {
  const html = renderToStaticMarkup(<App />);
  expect(html).toContain(">Randomize</button>");
  expect(html).not.toContain('aria-label="Setup"');
});

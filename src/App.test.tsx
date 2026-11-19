import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { App } from "./App";

test("starts with the Randomize button and no setup yet", () => {
  const html = renderToStaticMarkup(<App />);
  expect(html).toContain(">Randomize</button>");
  expect(html).not.toContain('aria-label="Setup"');
});

test("starts with every toggle on, 'Totally random', and complexity 1.5 to 10.5", () => {
  const html = renderToStaticMarkup(<App />);
  expect(html.match(/<input type="checkbox" checked=""\/>/g)?.length).toBe(3);
  expect(html).toContain('<option value="random" selected="">Totally random</option>');
  expect(html).toContain('<option value="1.5">1.5</option>');
  expect(html).toContain('<option value="10.5">10.5</option>');
  expect(html.match(/<option /g)?.length).toBe(20);
});

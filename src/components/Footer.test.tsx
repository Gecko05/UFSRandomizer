import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { languages, type LanguageCode } from "../i18n";
import { Footer } from "./Footer";

const render = (language: LanguageCode) =>
  renderToStaticMarkup(<Footer language={language} onLanguageChange={() => {}} />);

test("footer states this is an unofficial fan tool and credits Czech Games Edition", () => {
  const html = render("en");
  expect(html).toContain("Unofficial fan tool");
  expect(html).toContain("Not affiliated with or endorsed by Czech Games Edition");
  expect(html).toContain("© Czech Games Edition");
});

test("has a button for every registered language, named in that language", () => {
  const html = render("en");
  for (const [code, language] of Object.entries(languages)) {
    expect(html).toContain(`lang="${code}"`);
    expect(html).toContain(`>${language.label}</button>`);
  }
});

test("marks only the current language as pressed", () => {
  const html = render("es");
  expect(html).toMatch(/lang="es" aria-pressed="true"[^>]*>Español</);
  expect(html).toMatch(/lang="en" aria-pressed="false"[^>]*>English</);
});

import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "./Footer";

test("footer states this is an unofficial fan tool and credits Czech Games Edition", () => {
  const html = renderToStaticMarkup(<Footer />);
  expect(html).toContain("Unofficial fan tool");
  expect(html).toContain("© Czech Games Edition");
});

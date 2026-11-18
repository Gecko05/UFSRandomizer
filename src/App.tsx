import { useState } from "react";
import "./index.css";
import { Footer } from "./components/Footer";
import { SetupView } from "./components/SetupView";
import { content } from "./data/content";
import type { LanguageCode } from "./i18n";
import { complexityOptions, findRandomSetup } from "./randomizer/constraints";
import { randomSetup, setupStars, type Setup } from "./randomizer/setup";

/** The app starts in English; a language button comes in a later work item. */
const language: LanguageCode = "en";

const complexityChoices = complexityOptions(content);

/** `null` complexity means "Totally random". */
function generate(complexity: number | null): Setup | null {
  if (complexity === null) {
    return randomSetup(content, Math.random);
  }
  return findRandomSetup(content, Math.random, (stars) => stars.complexity === complexity);
}

type Result = { kind: "setup"; setup: Setup } | { kind: "no-fit" };

export function App() {
  const [complexity, setComplexity] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function randomize() {
    const setup = generate(complexity);
    setResult(setup === null ? { kind: "no-fit" } : { kind: "setup", setup });
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 text-center">
      <h1 className="text-2xl font-bold">Under Falling Skies Setup Randomizer</h1>
      <label className="flex items-center gap-2">
        Complexity
        <select
          className="rounded bg-neutral-800 px-2 py-1"
          value={complexity ?? "random"}
          onChange={(event) =>
            setComplexity(event.target.value === "random" ? null : Number(event.target.value))
          }
        >
          <option value="random">Totally random</option>
          {complexityChoices.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="rounded-lg bg-red-700 px-6 py-3 font-semibold hover:bg-red-600"
        onClick={randomize}
      >
        Randomize
      </button>
      {result?.kind === "setup" && (
        <SetupView
          setup={result.setup}
          stars={setupStars(result.setup, content)}
          language={language}
        />
      )}
      {result?.kind === "no-fit" && <p role="status">No setup fits these choices.</p>}
      <Footer />
    </div>
  );
}

export default App;

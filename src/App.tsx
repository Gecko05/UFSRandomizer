import { useState } from "react";
import "./index.css";
import { Footer } from "./components/Footer";
import { SetupView } from "./components/SetupView";
import { content } from "./data/content";
import type { LanguageCode } from "./i18n";
import { randomSetup, setupStars, type Setup } from "./randomizer/setup";

/** The app starts in English; a language button comes in a later work item. */
const language: LanguageCode = "en";

export function App() {
  const [setup, setSetup] = useState<Setup | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 text-center">
      <h1 className="text-2xl font-bold">Under Falling Skies Setup Randomizer</h1>
      <button
        type="button"
        className="rounded-lg bg-red-700 px-6 py-3 font-semibold hover:bg-red-600"
        onClick={() => setSetup(randomSetup(content, Math.random))}
      >
        Randomize
      </button>
      {setup !== null && (
        <SetupView setup={setup} stars={setupStars(setup, content)} language={language} />
      )}
      <Footer />
    </div>
  );
}

export default App;

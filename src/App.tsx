import { useState } from "react";
import "./index.css";
import { ChoicePicker } from "./components/ChoicePicker";
import { Footer } from "./components/Footer";
import { ResultView, type Result } from "./components/ResultView";
import { content } from "./data/content";
import { defaultLanguage, type LanguageCode } from "./i18n";
import { chooseSetup, defaultChoice, type SetupChoice } from "./randomizer/constraints";

export function App() {
  const [language, setLanguage] = useState<LanguageCode>(defaultLanguage);
  const [choice, setChoice] = useState<SetupChoice>(defaultChoice);
  const [result, setResult] = useState<Result | null>(null);

  function randomize() {
    const setup = chooseSetup(content, Math.random, choice);
    setResult(setup === null ? { kind: "no-fit" } : { kind: "setup", setup });
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 text-center">
      <h1 className="text-2xl font-bold">Under Falling Skies Setup Randomizer</h1>
      <ChoicePicker content={content} choice={choice} language={language} onChange={setChoice} />
      <button
        type="button"
        className="rounded-lg bg-red-700 px-6 py-3 font-semibold hover:bg-red-600"
        onClick={randomize}
      >
        Randomize
      </button>
      {result !== null && <ResultView content={content} result={result} language={language} />}
      <Footer language={language} onLanguageChange={setLanguage} />
    </div>
  );
}

export default App;

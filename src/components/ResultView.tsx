import type { GameContent } from "../data/types";
import type { LanguageCode } from "../i18n";
import { setupStars, type Setup } from "../randomizer/setup";
import { SetupView } from "./SetupView";

/** What Randomize produced: a setup, or nothing because no setup fits the choices. */
export type Result = { kind: "setup"; setup: Setup } | { kind: "no-fit" };

interface ResultViewProps {
  content: GameContent;
  result: Result;
  language: LanguageCode;
}

export function ResultView({ content, result, language }: ResultViewProps) {
  if (result.kind === "no-fit") {
    return <p role="status">No setup fits these choices.</p>;
  }
  return (
    <SetupView setup={result.setup} stars={setupStars(result.setup, content)} language={language} />
  );
}

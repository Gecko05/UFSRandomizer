import type { GameContent } from "../data/types";
import { complexityOptions, difficultyOptions, type SetupChoice } from "../randomizer/constraints";

interface ChoicePickerProps {
  content: GameContent;
  /** `null` = totally random. */
  choice: SetupChoice | null;
  onChange: (choice: SetupChoice | null) => void;
}

const selectClass = "rounded bg-neutral-800 px-2 py-1";

/** A full difficulty range for a complexity: every difficulty a player may pick. */
export function fullChoice(content: GameContent, complexity: number): SetupChoice {
  const options = difficultyOptions(content, complexity);
  return { complexity, difficulty: { min: options[0] ?? complexity, max: complexity } };
}

// Interface text is English only for now; translating it is a later work item.
export function ChoicePicker({ content, choice, onChange }: ChoicePickerProps) {
  const difficulties = choice === null ? [] : difficultyOptions(content, choice.complexity);

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="flex items-center gap-2">
        Complexity
        <select
          className={selectClass}
          value={choice?.complexity ?? "random"}
          onChange={(event) =>
            onChange(
              event.target.value === "random" ? null : fullChoice(content, Number(event.target.value)),
            )
          }
        >
          <option value="random">Totally random</option>
          {complexityOptions(content).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      {choice !== null && (
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            Difficulty from
            <select
              className={selectClass}
              value={choice.difficulty.min}
              onChange={(event) =>
                onChange({
                  ...choice,
                  difficulty: { ...choice.difficulty, min: Number(event.target.value) },
                })
              }
            >
              {difficulties
                .filter((value) => value <= choice.difficulty.max)
                .map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            to
            <select
              className={selectClass}
              value={choice.difficulty.max}
              onChange={(event) =>
                onChange({
                  ...choice,
                  difficulty: { ...choice.difficulty, max: Number(event.target.value) },
                })
              }
            >
              {difficulties
                .filter((value) => value >= choice.difficulty.min)
                .map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

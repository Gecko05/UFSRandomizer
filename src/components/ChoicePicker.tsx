import type { ContentCategory, GameContent } from "../data/types";
import { categoryLabel, type LanguageCode } from "../i18n";
import {
  complexityOptions,
  difficultyOptions,
  fullTarget,
  withOptions,
  type SetupChoice,
  type StarTarget,
} from "../randomizer/constraints";
import type { SetupOptions } from "../randomizer/setup";

interface ChoicePickerProps {
  content: GameContent;
  choice: SetupChoice;
  /** For the toggle labels, which are content type labels. */
  language: LanguageCode;
  onChange: (choice: SetupChoice) => void;
}

const selectClass = "rounded bg-neutral-800 px-2 py-1";

/** Each toggle is named after the content type it turns on or off. */
const toggles: (keyof SetupOptions & ContentCategory)[] = ["characters", "scenarios", "specialTiles"];

// Other interface text is English only for now; translating it is a later work item.
export function ChoicePicker({ content, choice, language, onChange }: ChoicePickerProps) {
  const { options, target } = choice;
  const setTarget = (newTarget: StarTarget | null) => onChange({ options, target: newTarget });
  const difficulties = target === null ? [] : difficultyOptions(content, options, target.complexity);

  return (
    <div className="flex flex-col items-center gap-3">
      <fieldset className="flex flex-wrap justify-center gap-4">
        <legend className="sr-only">Use in setups</legend>
        {toggles.map((key) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={(event) =>
                onChange(withOptions(content, choice, { ...options, [key]: event.target.checked }))
              }
            />
            {categoryLabel(language, key)}
          </label>
        ))}
      </fieldset>

      <label className="flex items-center gap-2">
        Complexity
        <select
          className={selectClass}
          value={target?.complexity ?? "random"}
          onChange={(event) =>
            setTarget(
              event.target.value === "random"
                ? null
                : fullTarget(content, options, Number(event.target.value)),
            )
          }
        >
          <option value="random">Totally random</option>
          {complexityOptions(content, options).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      {target !== null && (
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            Difficulty from
            <select
              className={selectClass}
              value={target.difficulty.min}
              onChange={(event) =>
                setTarget({
                  ...target,
                  difficulty: { ...target.difficulty, min: Number(event.target.value) },
                })
              }
            >
              {difficulties
                .filter((value) => value <= target.difficulty.max)
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
              value={target.difficulty.max}
              onChange={(event) =>
                setTarget({
                  ...target,
                  difficulty: { ...target.difficulty, max: Number(event.target.value) },
                })
              }
            >
              {difficulties
                .filter((value) => value >= target.difficulty.min)
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

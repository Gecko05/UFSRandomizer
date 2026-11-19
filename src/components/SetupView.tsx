import { characterTag, contentName, setupHeading, type LanguageCode } from "../i18n";
import type { Setup, SetupStars } from "../randomizer/setup";

interface SetupViewProps {
  setup: Setup;
  stars: SetupStars;
  language: LanguageCode;
}

// Headings and content follow the language; other interface text is English only for now.
export function SetupView({ setup, stars, language }: SetupViewProps) {
  const { city, sky, character, scenario } = setup;

  return (
    <section aria-label="Setup" className="w-full max-w-md rounded-lg bg-white/5 p-6 text-left">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <dt className="text-white/60">{setupHeading(language, "city")}</dt>
        <dd>
          {contentName(language, "cities", city.id)} · {city.damaged ? "Damaged" : "Undamaged"}
        </dd>

        <dt className="text-white/60">{setupHeading(language, "character")}</dt>
        <dd>
          {character === null ? (
            "No character"
          ) : (
            <>
              {contentName(language, "characters", character.id)} ·{" "}
              {characterTag(language, character.id, character.upgraded)}{" "}
              ({character.upgraded ? "Upgraded" : "Regular"})
            </>
          )}
        </dd>

        <dt className="text-white/60">{setupHeading(language, "scenario")}</dt>
        <dd>{scenario === null ? "No scenario" : contentName(language, "scenarios", scenario)}</dd>

        <dt className="text-white/60">{setupHeading(language, "sky")}</dt>
        <dd>
          <ol>
            {sky.map((position) => (
              <li key={position.skyTileId}>
                {contentName(language, position.special ? "specialTiles" : "skyTiles", position.tileId)}
                {position.flipped ? " · Flipped" : ""}
              </li>
            ))}
          </ol>
        </dd>
      </dl>

      <p className="mt-4 border-t border-white/10 pt-4">
        Black stars {stars.black} · Yellow stars {stars.yellow} · Difficulty {stars.difficulty} ·
        Complexity {stars.complexity}
      </p>
    </section>
  );
}

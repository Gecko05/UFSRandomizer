# UFS Randomizer

<!--
This file is the project's ONLY living doc and the specialist agent's instructions.
Keep it short. Update it in the same PR as any change to architecture, conventions or
commands. The retrospective prunes it every iteration.
Global workflow and Definition of Done: ~/.claude/standards.md
-->

## Role

You are the specialist engineer for this project: Bun, React 19, Tailwind 4 and
TypeScript. You implement **one work item at a time as one vertical-slice PR**,
following the workflow and Definition of Done in `~/.claude/standards.md`.

## Product

A web app that generates a random game setup for the board game *Under Falling Skies*,
so players can start a varied game with one click.

### Domain

A setup randomizes:
- **City** — and whether it is damaged
- **Sky** — for each of the 4 sky tiles: the tile or its special sky tile, and whether
  it is flipped
- **Character** — and whether it is upgraded
- **Scenario**

The player toggles characters, scenarios and special sky tiles (`SetupOptions`).
Characters/scenarios: on = every setup has one, off = none (`null` in the setup).
Special sky tiles: on = each position picks plain or special at random, off = plain only.

Stars: black stars add difficulty, yellow stars lower it. Difficulty = black − yellow;
complexity = black + yellow. Scenario: 1 black. Sky tile: 0 black, 1 flipped. Special
sky tile: 1 black, 2 flipped. Damaged city: 0.5 yellow. Character: 0.5 yellow, 1
upgraded. No scenario or no character adds nothing. Tile stars live in `content.ts`,
the others in `src/data/rules.ts`.

Setup shape (`Setup` in `src/randomizer/setup.ts`):

```json
{
  "city": { "id": "moscow", "damaged": true },
  "sky": [{ "skyTileId": "sky-tile-1", "tileId": "special-sky-tile-1", "special": true, "flipped": false }],
  "character": { "id": "jackson-moss", "upgraded": false },
  "scenario": "evacuation"
}
```

## Stack

- Runtime / package manager / bundler / test runner: **Bun 1.4**
- Frontend: React 19, Tailwind CSS 4 (`bun-plugin-tailwind`)
- Language: TypeScript (strict, `noUncheckedIndexedAccess`)
- Hosting / deploy: not decided yet

## Commands

| Task | Command |
|---|---|
| Install | `bun install` |
| Run locally (hot reload) | `bun dev` |
| Run production | `bun start` |
| Test | `bun test` |
| Typecheck | `bunx tsc --noEmit` |
| Build (to `dist/`) | `bun run build` |

## Architecture

- `src/index.ts` — Bun server. Serves `index.html` for all routes. The `/api/hello`
  routes are leftovers from the template.
- `src/index.html` → `src/frontend.tsx` → `src/App.tsx` — the React app. Bun bundles
  it through the HTML import.
- `build.ts` — production bundle of `src/**/*.html` into `dist/`.
- `src/data/content.ts` — the game's content list (cities, characters, scenarios,
  sky tiles, special sky tiles): language-independent data only (`id`, `source`;
  tiles also have `blackStars` per side, and each special tile `replaces` one sky
  tile). Maintained by hand by the product owner. Types in `src/data/types.ts`;
  `content.test.ts` enforces its rules (unique kebab-case ids, non-empty categories,
  valid tile stars, one special tile per sky tile).
- `src/i18n/` — languages. `languages/<code>.ts` holds one language's definition (its
  `label`, a label for each content type, the display names of every content item,
  and each character's regular and upgraded tag, keyed by id); `index.ts` is the
  registry (`languages`, `languageCodes`, `defaultLanguage` = English) and the
  `categoryLabel(language, category)`,
  `contentName(language, category, id)` and `characterTag(language, id, upgraded)`
  lookups. `index.test.ts` fails if a registered language misses a label, name or tag,
  has a blank one, or uses an id not in the content list.
  **To add a language:** copy `languages/en.ts` to `languages/<code>.ts`, translate it,
  and add it to `languages` in `index.ts`. The footer's language buttons pick it up.
- `src/data/rules.ts` — star rules that aren't per item (scenario, damaged city,
  character).
- `src/randomizer/setup.ts` — pure functions: `randomSetup(content, random, options)`
  builds a setup from a random source (`Math.random` in the app, fixed values in
  tests) and the player's `SetupOptions`; `setupStars(setup, content)` counts its
  stars, difficulty and complexity.
- `src/randomizer/constraints.ts` — player choices on top of the randomizer. All take
  the `SetupOptions`:
  - `possibleStars`: every black/yellow star combination a setup can have.
  - `complexityOptions` and `difficultyOptions`: what the player can pick (difficulty
    from the lowest possible up to the complexity).
  - `findRandomSetup`: returns `null` at once if no star combination fits; otherwise
    draws random setups until one fits, so every fitting setup is equally likely.
  - `chooseSetup(content, random, choice)`: a setup for a `SetupChoice` (options plus
    a `StarTarget` of exact complexity and difficulty range, or `null` target for
    "Totally random"). `withOptions` updates a choice when a toggle changes.
- `src/components/` — React components: `ChoicePicker` (the three toggles, named with
  the content type labels; complexity: "Totally random" or an exact value; then a
  difficulty range), `ResultView` (the setup, or "No setup fits these choices."),
  `SetupView` (a setup and its stars), `Footer` (language buttons and fan-tool
  disclaimer). `App.tsx` holds the language, the choice, the Randomize button and the
  result. Content names and content type labels follow the language; other interface
  text is English only for now.
- `under-falling-skies-artworks/` — official press-kit artwork, **git-ignored** (157 MB of
  originals). Commit only resized web copies under `src/`.

Randomization runs entirely client-side. There is no backend logic yet.

## Conventions

- Keep randomization logic in **pure functions**, separate from React components, and
  have them take the random source as a parameter so tests can be deterministic.
- Game data (cities, characters, scenarios…) lives in typed constant modules, not
  inside components.
- Tests sit next to the code as `*.test.ts(x)` and use `bun:test`.
- Style with Tailwind utility classes. Avoid custom CSS unless it is needed.

## Decisions

<!-- One line per significant design decision, newest first. Spikes land here. -->
- 2026-11-18 — Client-side only randomizer, no persistence — nothing needs a server yet.
- 2026-11-18 — The game has no expansions, only promos: each content item is tagged
  `source: "base" | "promo"`. Players select individual items per category.
- 2026-11-18 — Multilanguage, starting with Spanish and English. Each language is one
  self-contained definition file; display text never lives in the content list.
- 2026-11-18 — Every page shows a footer stating this is an unofficial fan tool and that
  the game and artwork are © Czech Games Edition.

## Working a work item

1. `gh issue view <N>` — read the acceptance criteria. Only work on `ready` items.
2. Branch `<type>/<N>-<slug>` from the default branch.
3. Implement the full vertical slice with tests. Stay within the item's scope; if you
   discover extra work, note it in the PR for the backlog instead of doing it.
4. Run test, typecheck and build. All must pass.
5. Update this file if architecture, conventions, commands or decisions changed.
6. Open the PR (`Closes #N`, what changed, how verified, what to look at), then run
   the `reviewer` agent on it.

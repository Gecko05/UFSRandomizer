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
- **City** — and whether it starts damaged or undamaged
- **Special tiles**
- **Threat level** (difficulty) — and which sky tile is flipped
- **Character** — and whether it is upgraded
- **Scenario**

Target setup shape:

```json
{
  "city": "moscow",
  "difficulty": 2,
  "skyThreat": [0, 1],
  "character": { "id": "jackson", "upgraded": false },
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
  special tiles, difficulty range). Maintained by hand by the product owner; currently
  placeholder data. Types in `src/data/types.ts`; `content.test.ts` enforces its rules
  (unique kebab-case ids, non-blank names, non-empty categories, valid difficulty range).
- `src/components/` — React components (e.g. `Footer` with the fan-tool disclaimer).
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

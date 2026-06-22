# Design System Extractor — Backend

The embedded TypeScript pipeline behind the `sk-design-md-generator` skill: it crawls a live URL, extracts real CSS into `tokens.json`, pre-renders the deterministic value sections of a v3 Style Reference `DESIGN.md`, and validates the result for fidelity. This backend is driven by the parent skill (`../SKILL.md`); it is not used standalone.

## Layout

| Path | Purpose |
|------|---------|
| `scripts/` | The pipeline modules (20 TypeScript files): `extract.ts`, `build-write-prompt.ts`, `formatters-v3.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`, plus the internal stages they call. |
| `tests/` | Vitest unit tests (`npm test`). |
| `package.json` | Dependencies, scripts, and the `design-system-extractor` bin. |
| `tsconfig.json` | Type-check config (covers `scripts/` + `tests/`). |
| `tsconfig.build.json` | Emit config (`scripts/` → `dist/`, tests excluded). |
| `vitest.config.ts` | Test-runner config. |
| `dist/` | Built output — git-ignored, produced by `npm run build`. |

## Setup

```bash
cd backend
npm install
npx playwright install chromium
```

## Pipeline commands

```bash
# Phase 1 — extract: crawl a URL across 5 viewports, emit tokens.json
npx ts-node scripts/extract.ts <url> --fast --output <dir>

# Phase 2 — build the WRITE prompt (pre-renders the deterministic v3 value sections + a FACTS block)
npx ts-node scripts/build-write-prompt.ts <dir>/tokens.json

# Phase 3 — validate a DESIGN.md against its tokens.json
npx ts-node scripts/validate.ts <DESIGN.md> <dir>/tokens.json

# Phase 4 (optional) — fidelity proof + visual report/preview (tokens.json first)
npx ts-node scripts/proof.ts <url> <dir>/tokens.json
npx ts-node scripts/report-gen.ts <dir>/tokens.json <dir> <DESIGN.md>
npx ts-node scripts/preview-gen.ts <dir>/tokens.json <dir>
```

### `extract.ts` flags

| Flag | Effect |
|------|--------|
| `--fast` | 5 pages at 8 concurrency (still captures interaction states) |
| `--max-pages <n>` | Page cap (default 8) |
| `--concurrency <n>` | Parallel page workers (default 5) |
| `--with-interaction` | Capture hover/focus/active states — **the default** |
| `--no-interaction` | Opt out of interaction capture |
| `--fast-no-interaction` | Fast crawl AND skip interaction (the old `--fast` behavior) |
| `--no-dark-mode` | Skip dark-mode detection |
| `--wait-for <strategy>` | Page-ready strategy before sampling |
| `--extra-urls` / `--merge-with` | Add URLs / merge into an existing `tokens.json` |
| `--output <dir>` | Output directory for `tokens.json` |
| `--verbose` | Verbose logging |

## Maintenance scripts

```bash
npm run typecheck   # tsc --noEmit over scripts/ + tests/
npm run build       # tsc -p tsconfig.build.json -> dist/
npm test            # vitest run
```

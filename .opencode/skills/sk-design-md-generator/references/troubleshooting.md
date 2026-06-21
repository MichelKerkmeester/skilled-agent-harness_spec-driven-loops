---
title: "Troubleshooting"
description: "Failure modes and fixes for the design-md-generator pipeline: Chromium install, crawl blocks, dark-mode gaps, validation mismatches, and TypeScript execution."
trigger_phrases:
  - "design extraction failed"
  - "playwright chromium error"
  - "validate.ts hex mismatch"
  - "crawl blocked 403"
  - "extract.ts not running"
importance_tier: "normal"
contextType: "implementation"
---

# Troubleshooting

## Chromium / Playwright missing

Symptom: `extract.ts` throws "browserType.launch: Executable doesn't exist". Fix: run the one-time install from `tool/`:

```bash
cd tool && npx playwright install chromium
```

Chromium is ~500 MB and is not bundled with the vendored tool.

## ts-node not found / module errors

Symptom: `command not found: ts-node` or import resolution errors. Fix: install deps first — `cd tool && npm install`. The tool runs its TypeScript directly via `ts-node`; there is no build step.

## Site blocks the crawl (403 / 429 / bot wall)

The tool ships `playwright-extra` + stealth, but some sites still block automated browsers. Symptom: empty or partial `tokens.json`, or the crawl errors on every page. Do NOT fabricate tokens to fill the gap — escalate. Options: try `--max-pages 1` on a single accessible page, add `--wait-for css` for JS-heavy SPAs, or report that the site is not crawlable.

## No dark-mode palette captured

Symptom: the site has a dark mode but `tokens.json` has no dark tokens. The extractor keys on a `prefers-color-scheme` media query; sites that toggle dark mode with a JS class may not be detected. Do NOT derive a dark palette from the light one. Either investigate a manual toggle and re-extract, or write the `DESIGN.md` light-only and note the gap.

## validate.ts reports hex mismatches

Symptom: validation flags a hex in `DESIGN.md` that is not in `tokens.json`. Usual cause: a write-phase value was estimated or its case/format drifted (use 6-digit lowercase). Fix the `DESIGN.md` value to match `tokens.json` exactly. If `tokens.json` itself holds an invalid value (e.g. uppercase or a 3-digit hex), that is an extractor issue — escalate before editing source data.

## Output landed somewhere unexpected

`tokens.json` and screenshots go to `output/<domain>/` by default, not the working directory. Override with `--output <dir>`. Validation and report commands take the explicit `tokens.json` path, so point them at `output/<domain>/tokens.json`.

## Tests

Confirm the vendored tool is intact with `cd tool && npx vitest run` — it runs the upstream unit suite (clustering + validation).

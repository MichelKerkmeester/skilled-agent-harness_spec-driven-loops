---
title: "Troubleshooting"
description: "Failure modes and fixes for the extraction pipeline: Chromium install, crawl blocks, dark-mode gaps, validation mismatches, and TypeScript execution."
trigger_phrases:
  - "design extraction failed"
  - "playwright chromium error"
  - "validate.ts hex mismatch"
  - "crawl blocked 403"
  - "extract.ts not running"
importance_tier: "normal"
contextType: implementation
version: 1.0.0.5
---

# Troubleshooting

Symptom-and-fix guidance for the common failure modes of the embedded extraction pipeline.

---

## 1. OVERVIEW

### Purpose

Resolve the failures that block an extraction run: missing browser binaries, uninstalled dependencies, crawl blocks, dark-mode detection gaps, and validation mismatches. The guiding rule when a phase fails is to escalate rather than fabricate tokens.

---

## 2. SETUP FAILURES

**Chromium / Playwright missing.** `extract.ts` throws `browserType.launch: Executable doesn't exist`.
- Fix: `cd backend && npx playwright install chromium`. Chromium is ~500 MB and is not bundled with the tool.

**ts-node not found / module errors.** `command not found: ts-node` or import-resolution errors.
- Fix: `cd backend && npm install`. The tool runs its TypeScript directly via `ts-node`; there is no build step.

---

## 3. CRAWL FAILURES

**Site blocks the crawl (403 / 429 / bot wall).** Empty or partial `tokens.json`, or the crawl errors on every page. The tool ships `playwright-extra` + stealth, but some sites still block automated browsers.
- Fix: do NOT fabricate tokens. Try `--max-pages 1` on a single accessible page, add `--wait-for css` for JS-heavy SPAs, or report that the site is not crawlable.

**No dark-mode palette captured.** The site has a dark mode but `tokens.json` has no dark tokens. The extractor keys on a `prefers-color-scheme` media query; sites that toggle dark mode with a JS class may not be detected.
- Fix: do NOT derive a dark palette from the light one. Investigate a manual toggle and re-extract, or write the `DESIGN.md` light-only and note the gap.

---

## 4. VALIDATION FAILURES

**`validate.ts` reports hex mismatches.** Validation flags a hex in `DESIGN.md` that is not in `tokens.json`. Usual cause: a write-phase value was estimated or its case/format drifted.
- Fix: make the `DESIGN.md` value match `tokens.json` exactly (6-digit lowercase). If `tokens.json` itself holds an invalid value (uppercase or a 3-digit hex), that is an extractor issue - escalate before editing source data.
- Note: the value-bearing token sections — Tokens — Colors, Tokens — Spacing & Shapes, Surfaces, and the Quick Start CSS + Tailwind — come **pre-rendered** from `build-write-prompt.ts` (doc-as-view, via `formatters-v3.ts`). Paste those tables unchanged. A hex mismatch in those sections means they were hand-edited after pre-rendering — re-run `build-write-prompt.ts` and paste the fresh tables rather than patching values by hand. (Typography and component values are not pre-rendered as tables; they come verbatim from the FACTS block, so a mismatch there means a value was typed by hand instead of copied from FACTS.)

**`validate.ts` reports prose-discipline or section-coverage warnings.** WARNING-tier (never a hard fail): flags interpretive fabrication such as "gradient-as-depth", "unlike most systems", or an unbacked "focus is consistent" claim, and flags a section that is present but whose backing token field is empty.
- Fix: remove the unbacked interpretive claim or label a genuine inference `[INFERRED]` with the token it rests on. For a filled-but-empty section, stamp it ABSENT (`_No <X> data was extracted._`) instead of inventing content. Validation reports a dual score: `valuesScore` (hex/section/format fidelity) and `claimsScore` (prose provenance).

**Interaction states are missing from `tokens.json`.** Hover/focus/active state capture runs by **default**, including under `--fast`.
- Fix: if states are absent you likely passed `--no-interaction` or `--fast-no-interaction` (the only opt-outs). Re-run without those flags. There is no `--with-interaction` requirement — it is the default.

**Output landed somewhere unexpected.** `tokens.json` and screenshots go to `<--output>/` by default, not the working directory.
- Fix: override with `--output <dir>`. Validation and report commands take the explicit `tokens.json` path, so point them at `<--output>/tokens.json`.

---

## 5. TESTS

Confirm the tool is intact with `cd backend && npx vitest run` - it runs the unit suite (clustering + validation).

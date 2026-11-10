---
title: "Iteration 5: tests estate and the CI coverage boundary"
trigger_phrases: []
---
# Iteration 5: Tests estate and the CI coverage boundary

## Focus

Recount the test estate in this tree (no round-one numbers) and pin down exactly which lanes the new spec-kit-check workflow executes versus which remain outside CI. Also recount the js-yaml importer set (round one's dropped merge row relied on a count; job 3 says recount in this tree).

## Actions Taken

1. Vitest topology: root vitest.config.ts defines TWO projects — `root` (include `tests/**/*.vitest.ts` + `runtime/tests/**/*.vitest.ts`, setup runtime/tests/_support/vitest-setup.ts) and `cli` (rooted at runtime/cli, include `tests/**/*.vitest.ts`, same setup). Inventories: cli/tests holds 141 `*.vitest.ts`; runtime/tests holds 88 `*.vitest.ts`; test:legacy = node test-scripts-modules.js + test-extractors-loaders.js; test:validation = node test-validation-system.cjs + bash test-validation.sh + bash test-validation-extended.sh; the engine's runtime `test` = node scripts/run-tests.mjs, `test:core` = vitest run.
2. Workflow census for each lane: spec-kit-check.yml runs `npm run check`, `npm run typecheck`, shared `test`, and `npx vitest run --config ../../vitest.config.ts --project cli` — i.e. exactly ONE of the two vitest projects (the cli one) and NONE of the legacy/validation lanes. routing-registry-drift.yml runs its own three routing-registry guard tests (its own concern; unrelated). No other workflow runs vitest, run-tests.mjs, or the cli test:legacy/test:validation scripts.
3. Fallout check for the legacy suites: they are the ONLY consumers of utils/validation-utils.ts (test-scripts-modules.js:177-186) and helpers; the validation shell suites cover the core dispatch engine (validate.sh → orchestrator → registry → rules).
4. js-yaml recount: 3 production importers (validation/continuity-freshness.ts:9, lib/validate-memory-quality.ts:17, rules/check-grep-convention-helper.mjs:15) + 2 test importers (tests/deep-review-contract-parity.vitest.ts:6, tests/deep-review-reducer-schema.vitest.ts:5); cli/package.json dependencies carry `js-yaml ^4.3.0`. Matches round one's corrected count exactly (3 production); the two test imports were not part of the dropped-claim count.
5. config/, types/, loaders/ sanity: config/index.ts is a comment-documented inversion seam re-exporting core/config.js (extractors→core upward dependency); loaders/data-loader.ts is imported by continuity/generate-context.ts and core/workflow.ts (production-wired); types/ holds js-yaml.d.ts + save-mode.ts + session-types.ts.

## Findings

1. **P2 — the CI coverage boundary is narrower than the 007 summary's claim, and the core-validation test lanes are still CI-invisible**: spec-kit-check.yml runs the CLI vitest project (141 files) plus check/typecheck/shared tests, but NOT `test:legacy` (test-scripts-modules.js, test-extractors-loaders.js — the suites that still carry utils/validation-utils.ts), NOT `test:validation` (test-validation-system.cjs, test-validation.sh, test-validation-extended.sh — the suites over the package's core dispatch engine: validate.sh → orchestrator → 39-rule registry), and NOT the root vitest project (the engine's runtime/tests, 88 files). The 007 implementation-summary's prose claims a pull-request workflow that runs "the test suites that until today ran only in a developer's shell" — the workflow's actual step list is narrower than that sentence. Declared purpose of the workflow: "Typecheck, import policy and test suites for the spec-kit packages". Observed callers: pull_request path on main. Severity P2 (partial automation; the single highest-value gates — check, typecheck, cli vitest — are now automated; the residual is the acceptance-evidence lanes for the package's heaviest machinery). Recommendation: **fix** — add the two lanes (`npm run test:legacy && npm run test:validation` or the equivalent) to the workflow and add a `--project root` invocation, or narrow the summary's sentence to what the workflow actually runs.

2. (Verification positive, no finding): js-yaml importer recount matches round one's corrected count (3 production); config/ and loaders/ carry documented seams with live production importers; the cli vitest project's include pattern points at 141 real files; routing-registry-drift.yml is a separate concern (routing-registry guards), not a cli test lane.

## Questions Answered

- (Q4, partial) config/, types/, loaders/ carry per-file verdicts (round one had them via a census; here confirmed live: data-loader wired through generate-context.ts + workflow.ts; config barrel is the documented inversion seam; types/ is the dep-shim + mode/session types).
- (Q6 momentum) The tests/ estate: 353 files under tests/ (141 vitest + 17 js + 11 sh + 2 cjs + 1 mjs + 1 py + fixtures), of which the CI runs the vitest project only.

## Questions Remaining

- The round-one residuals by name: observability's ultimate consumer (iteration 6 — round one left it caller-not-verified).
- retrieval/ + graph/ + spec-folder/ + metrics/ + optimizer/ + resource-map/ + sweep/ + setup/ + templates/ + references/ individual verdicts where round one passed in one sweep (iterations 6-8).

## What Worked / What Failed

- Worked: comparing the workflow step list against every npm test lane — the exact-set method beats the "is any CI running" question and surfaces the residual boundary precisely.
- Worked: recounting js-yaml importers as a kept-row check; the count is stable (3 production), so no recomputation drama and no new claim.
- Failed: none; no approach exhausted.

## Ruled Out

- routing-registry-drift.yml as a cli-coverage lane — its tests are the routing registry's own guards (tests/routing-registry-drift-guard.vitest.ts etc.), not spec-kit package tests.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/vitest.config.ts (both projects)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/tests/ (141 vitest + lane files), runtime/tests/ (88 vitest)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/package.json (scripts: test, test:legacy, test:validation, check)] [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json (scripts: test, test:core, test:spec-validation)] [SOURCE: .github/workflows/spec-kit-check.yml (step list), .github/workflows/routing-registry-drift.yml:88-96] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/{validation/continuity-freshness.ts:9, lib/validate-memory-quality.ts:17, rules/check-grep-convention-helper.mjs:15, tests/deep-review-contract-parity.vitest.ts:6, tests/deep-review-reducer-schema.vitest.ts:5, package.json dependencies}] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/config/index.ts (full), loaders/data-loader.ts importers (generate-context.ts, core/workflow.ts)]

## Next Iteration

Iteration 6: observability — the round-one residual ("results' ultimate consumer: caller-not-verified"). Inventory the 7 files, trace every producer and every consumer script/wrapper, and answer who needs the committed smart-router-measurement-report.md + results.jsonl; if nothing consumes them, that is the removal finding; then metrics/ (3 files) and optimizer/ (7 files) one-pass verdicts.

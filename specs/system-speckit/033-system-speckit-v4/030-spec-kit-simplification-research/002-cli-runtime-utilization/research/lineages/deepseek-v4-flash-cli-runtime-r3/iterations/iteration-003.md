---
title: "Iteration 3: Test coverage by script"
trigger_phrases: []
---
# Iteration 3: Test coverage by script

## Focus

List every script under `runtime/cli/spec` and `runtime/cli/rules`, read the test file names under `runtime/cli/tests` and `runtime/tests`, read the two legacy lane entry points (`cli/tests/test-validation-system.cjs`, `cli/tests/test-validation-extended.sh`), and build one table: script → suite or lane that names it. Every "none" is a finding at P2 unless the script is a rule the validation lane exercises through validate.sh, which is stated.

## Coverage model used

- The validation lane: `cli/spec/validate.sh` is a front-end for `lib/validation/orchestrator.ts` (validate.sh:5-8); the dispatcher walks `cli/lib/validator-registry.json` (39 rule rows, each with `rule_id`, `script_path`, `severity`, `category`). Rules with `script_path` under `rules/` are therefore exercised through validate.sh by definition of this registry — stated row-by-row below.
- The legacy lanes: `cli/package.json:22` — `"test:validation": "node tests/test-validation-system.cjs && bash tests/test-validation.sh && bash tests/test-validation-extended.sh"`; CI runs `test:legacy` + `test:validation` under spec-kit-check.yml:55-62, plus `npm run check`, `npm run typecheck`, shared tests, CLI vitest `--project cli` (spec-kit-check.yml:40-62), runtime vitest `--project root` (63-70).
- Evidence method: exact-filename `grep -rln -- "<script>"` over both tests dirs and the legacy lanes; fixture/snapshot hits excluded.

## Table: scripts under cli/spec

| Script | Suite or lane that names it |
|---|---|
| validate.sh | validator-registry.json (rule dispatcher), test-validation-system.cjs, test-validation-extended.sh, test-validation.sh, validate-help-lists-every-rule.vitest.ts, validation-engine-coherence.vitest.ts, test-integration.vitest.ts, workflow-invariance.vitest.ts, scaffold-passes-its-own-gate.vitest.ts, test-phase-validation.js, test-phase-command-workflows.js, progressive-validation.vitest.ts/js |
| check-completion.sh | completion-evidence-sentinel.vitest.ts (CLI vitest project) |
| create.sh | test-phase-command-workflows.js, test-phase-system.{js,sh}, test-phase-validation.js, test-integration.vitest.ts, workflow-invariance.vitest.ts, scaffold-passes-its-own-gate.vitest.ts, graph-metadata-backfill.vitest.ts, spec-root-writer-autosave.vitest.ts |
| progressive-validate.sh | progressive-validation.vitest.ts, progressive-validation.vitest.js |
| recommend-level.sh | test-phase-system.js, test-phase-validation.js |
| quality-audit.sh | quality-audit-script.vitest.ts |
| upgrade-level.sh | test-upgrade-level.sh (legacy lane) |
| archive.sh | test-phase-validation.js |
| check-placeholders.sh | PLACEHOLDER_FILLED registry rule (validation lane), test-integration.vitest.ts, test-validation-extended.sh |
| check-template-staleness.sh | template-version-parity.vitest.ts |
| scaffold-debug-delegation.sh | workflow-invariance.vitest.ts |
| repair-derived.cjs | repair-derived.vitest.ts |
| is-phase-parent.ts | spec-root-writer-autosave.vitest.ts:37 (vi.mock '../spec/is-phase-parent'), phase-parent-health.vitest.ts (imports the lib/spec twin), generator-hardening.vitest.ts:26 (imports lib/spec twin) |
| sync-phase-map-status.ts | sync-phase-map-status.vitest.ts |
| test-validation.sh | itself; run by `test:validation` (package.json:22) |
| sweep-track-roots.mjs | **NONE** — named by no test, vitest, lane, or package.json script. Verified as a recorded-kept manual tool: cli/spec/README.md:74,108,152 documents it as the only check that sees track-root drift (round-one census row 10, "kept as a documented manual tool", plus round-two kept rows do not contradict). **Not re-listed as a finding** — recorded decision holds; stated for completeness. |

## Table: rules under cli/rules (validation-lane status)

Registry: 39 rule rows, 31 unique `script_path` values (27 `rules/*.sh`, 1 `native:orchestrator`, 3 `validation/*.ts`, plus `ts:spec-doc-structure`; several rules share a script, e.g. the five CANONICAL_SAVE_* → check-canonical-save.sh, four GRAPH_METADATA_* → check-graph-metadata*.sh).

| Script | Suite or lane |
|---|---|
| 26 rule scripts named in the registry (check-ac-closure, check-ac-coverage, check-ai-protocols, check-canonical-save, check-comment-hygiene, check-complexity, check-description-shape, check-files, check-folder-naming, check-frontmatter, check-graph-metadata, check-graph-metadata-child-drift, check-graph-metadata-child-identity, check-graph-metadata-shape, check-grep-convention, check-improvement-artifacts, check-level-match, check-level, check-metadata-disk-consistency, check-normalizer-lint, check-placeholders, check-scaffold-never-touched, check-spec-doc-integrity, check-status-cross-doc-consistency, check-template-source, check-toc-policy) | **Validation lane** — exercised through validate.sh via the registry dispatcher (stated per the angle's exemption) |
| check-canonical-save-helper.cjs, check-grep-convention-helper.mjs, check-metadata-disk-consistency-helper.cjs | Helpers sourced/required by their registry sibling scripts → validation lane through validate.sh (stated) |
| check-links.sh | **Not in the registry** — validation never runs it. Live caller: `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` (verified by grep). This matches the round-two census row 10 (the removed `cli/check-links.sh` duplicate; the rule stays the router's target). Not a finding. |

## cli/tests standalone bash tests

`cli/tests` also ships four standalone bash test scripts: check-ac-closure.sh, check-ac-coverage.sh, check-graph-metadata-child-drift.sh, check-graph-metadata-shape-last-active-child.sh. Each is a TEST (header "TEST: ...") and **differs from its `rules/` namesake** (diff -q: all four differ — they are not duplicates). No vitest names them; `test:validation` does not run them (package.json:22 verified); test-validation-extended.sh does not reference them.

## Findings

| # | Severity | Claim side | Actual side | Verdict |
|---|----------|-----------|-------------|---------|
| F1 | P2 | cli/tests README + CI step "Legacy module lanes and the bash validation suites" (spec-kit-check.yml:55-62) implies the bash suites in cli/tests run in CI | Four standalone bash tests (cli/tests/check-ac-closure.sh, check-ac-coverage.sh, check-graph-metadata-child-drift.sh, check-graph-metadata-shape-last-active-child.sh) are named by no vitest file, by no package.json script (test:validation verified at package.json:22), and by no CI step read; the extended suite does not reference them. Runner association for `test:legacy` was NOT verified within the call budget | Grouped as conditional P2: if `test:legacy` doesn't dispatch them, they are dead tests that rotted unseen (the exact failure mode the CI comment at spec-kit-check.yml:55-56 describes). Recommend: **merge** — either wire them into test:legacy/test:validation or delete them; either way the CI comment gains ground truth |
| F2 | P2 | The audit design: "a rule the validation lane exercises through validate.sh" exemption | `rules/check-links.sh` is the one rule script exempt by lane, not by validation: it sits in `rules/` but has no registry row, so validate.sh never runs it; its only live caller is the post-edit-quality router | Not a defect (matches the recorded round-two row 10), but the angle's own premise deserves the stated row: check-links is a validator-shaped script living outside validation. Recommendation: none required (document) |

## Verified Correct (no finding)

- All 27 `rules/*.sh` registry entries resolve to files on disk; the 3 `validation/*.ts` paths resolve to `cli/validation/` (a second root in the same script_path namespace, verified in iteration 2 for continuity-freshness.ts).
- validate.sh's own coverage is dense: it is named by the two legacy lanes, five vitest suites and the registry itself.
- sweep-track-roots.mjs: no test names it, but the recorded-kept manual-tool decision holds and README.md:152 documents its exact invocation — no new evidence against the stated reason.
- cli/tests/check-*.sh test scripts are not accidentally-shipped rule copies (all four differ from rules/).

## Questions Answered

- Does every cli/spec script have a lane? Yes, except sweep-track-roots.mjs (kept manual tool, recorded).
- Does every rules script run through validate.sh? No — check-links.sh is post-edit-rule only (stated), three helpers ride their siblings.

## Open Questions

1. Does `npm run test:legacy` (package.json, unread under budget) dispatch the four standalone cli/tests bash tests? If yes, F1 is resolved-and-clean; if no, they are unrunned dead tests.
2. Are the four standalone tests' results asserted anywhere else (e.g., a fixture-docset reporter)? Not found in the lanes read.

---
title: "Iteration 1: Removal census — did every 007/008-removed path leave the tree AND its references?"
trigger_phrases: []
---
# Iteration 1: Removal census — did every 007/008-removed path leave the tree AND its references?

## Focus

Job 1 opens with the removal census: for each of the 15+ targets 007 deleted and each of the 13 variables 008 deleted, verify (a) the path is absent from the checked-in tree and (b) no live consumer, document line, fixture or asset still names it. The reference census runs over `.opencode`, `.github`, and the root, excluding `specs/`, `dist/`, `node_modules/`, changelogs and benchmark reports (the round-one exclusion set). No node tooling, no validate.sh, no git — bash `rg`/`find` and reads only.

## Actions Taken

1. Existence check (bash `-e`) for 31 removed paths: the seven `.scan*`/no-frontmatter files, `continuity/ast-parser.ts`, `continuity/fix-memory-h1.mjs`, `kpi/`, `setup/_utils.sh`, the three evals harnesses, `doctor.sh`, `migrate-deep-research-paths.ts`, `seed-council-value-fixture.cjs`, `continuity/rank-memories.ts`, `spec/check-smart-router.sh`, `core/quality-scorer.ts`, `renderers/`, `registry-loader.sh`, `scripts-registry.json`, `lib/coverage-graph*` (cluster + stray cjs), the ops healer/runbook set, `tests/test-export-contracts.js`, `.opencode/skills/system-spec-kit/.env.example` — **all 31 absent**.
2. Reference census by filename token (19 sweeps). Clean (zero live hits): scan-*, no-frontmatter-*, enumerate-*, ast-parser, fix-memory-h1, run-phase2-closure-metrics, collect-redaction-calibration-inputs, run-redaction-calibration, rank-memories, check-smart-router, scoreRenderQuality, registry-loader, scripts-registry, test-export-contracts, quality-kpi. Only-changelog/generated-fixture hits (excluded by census rules): migrate-deep-research-paths (changelog v3.0.0.3), seed-council-value-fixture (deep-ai-council changelog), coverage-graph-convergence (benchmark JSON + deep-research changelog + deep-review playbook — the playbook names the LIVE deep-loop reducer, verified by reading its lines 3,30-33: it is about the coverage-graph reducer under loop_type=review, not the removed cli copy). doctor.sh hits are other skills' own scripts (system-skill-advisor/scripts/doctor.sh, mcp-code-mode/scripts/doctor.sh) and unrelated command/doctor files — the precise `cli/doctor.sh` form grep returns NONE. kpi hits are sk-design style content and the spec-kit changelog.
3. 008 census: all thirteen removed variables return 0 occurrences in `.env.example`. Their readers elsewhere: changelogs (excluded), feature-flag-governance.md:43 (honest — says the helper went with the decommission), references/config/environment-variables.md:178 (SEE FINDING 1), three test-fixtures (SEE FINDING 2). `post_save_indexing` — zero residual anywhere. `.github/workflows/spec-kit-check.yml` exists (2,919 bytes).
4. Fix-row spot check: package.json:4, cli/README.md:17 and ARCHITECTURE.md:23 now carry ONE aligned sentence ("continuity save pipeline, spec-folder validation dispatch, packet metadata generation, retrieval tooling, cross-runtime mirror sync, evaluations and setup checks") — but ARCHITECTURE.md:77 (the tree diagram comment) still says "CLI generation, validation, indexing, evals" (SEE FINDING 3).
5. Fresh inventory (recount — no round-one numbers reused): source dirs under cli/ by file count: codex 4, config 2, continuity 6, core 28, evals 9, extractors 13, graph 3, lib 33, loaders 3, metrics 3, observability 7, ops 4, optimizer 7, pi 3, references 1, resource-map 2, retrieval 30, rules 32, runtime-mirrors 3, setup 5, spec-folder 7, spec 19, sweep 2, templates 3, test-fixtures 259, tests 353, types 4, utils 20, validation 8; root files 10. `runtime/`, `dist/`, `node_modules/` confirmed symlinks (runtime → ../dist; dist/node_modules → the ABSOLUTE main checkout) — dist content excluded from evidence per the invocation contract (checked-in source only).

## Findings

1. **P1 — one document line left behind by 008**: `references/config/environment-variables.md:178` still documents `SPECKIT_ROLLOUT_PERCENT` with "read by `getRolloutPercent()`". `getRolloutPercent` exists NOWHERE in code (`rg` over the whole skill tree: the only hit is this document itself). The 008 remediation removed the two rows from `runtime/ENV-REFERENCE.md` but did not touch this SECOND environment-variable document, which sits under the skill's `references/config/`. The row describes a removed variable and a function that never existed outside prose. Declared purpose: env flag reference for operators. Observed callers: no code reads this variable or function; the only consumer of the row is a reader of the reference. Severity P1 (dead/misleading documentation of removed machinery). Recommendation: **fix** — remove the row (and check the section header/footers for the same variable's other mentions) or repoint to the canonical `runtime/ENV-REFERENCE.md`.

2. **P2 — three fixtures still advertise a removed variable**: `runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md:119`, `003-valid-level2/implementation-summary.md:119`, `004-valid-level3/implementation-summary.md:119` each contain "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable." The variable was removed from `.env.example` (008) and has no reader in the tree; the fixtures — sample packet content the validation suite exercises — still instruct a user to set it. The 008 decision ("a template must not advertise switches nothing reachable honours") applies to fixture content of the same class. Observed callers: the fixtures are consumed by spec-doc validation tests as valid packets; nothing reads the variable. Severity P2. Recommendation: **fix** — drop the sentence from the three fixture implementation-summaries (or note the variable's retirement, if the fixture is intentionally historical content).

3. **P2 — one self-description site missed the alignment**: `ARCHITECTURE.md:77` tree comment still says `runtime/cli/ # CLI generation, validation, indexing, evals` while ARCHITECTURE.md:23 (prose) and cli/README.md:17 and package.json:4 now share the aligned sentence without "indexing" (nothing in the package indexes anymore — 007 renamed `post_save_indexing` and removed it from the plan contracts; the mirror-machinery and retrieval tooling the aligned sentence names are absent from the tag). Declared purpose: architecture tree diagram. Observed callers: documentation only. Severity P2 (a stale line inside the very fix that claimed three aligned descriptions). Recommendation: **fix** — replace the tag with the aligned sentence's short form.

4. **NEGATIVE (certified clean, no finding)**: all 31 removed paths absent; zero live references to scan-*, no-frontmatter-*, enumerate-*, ast-parser, fix-memory-h1, the three evals harnesses, rank-memories, check-smart-router, scoreRenderQuality, registry-loader, scripts-registry, test-export-contracts, quality-kpi; zero residual `post_save_indexing`; the deep-review playbook reference to coverage-graph names the LIVE deep-loop reducer, not the removed copy. 007's removal landed fully at the file level.

## Questions Answered

- (Q1, partial) The removal half of job 1: 007's deletions are complete at the file and reference level; the incompleteness found is on the DOC side (findings 1-3, of which 1 and 3 are 008's and 007's own fixes leaving lines behind).

## Questions Remaining

- Q2: the 008 changes beyond the template (ENV-REFERENCE rows, config.ts batch constants, drift test path, deleted skill-level template references).
- Q3: the 007 fix rows (validation story, regex sites, rule headers, ops README, spec-kit-check workflow coherence, deep-loop playbook repoint).
- Q4+: round-one misses per subsystem (iteration 4+).

## What Worked / What Failed

- Worked: filename-token census across the five surfaces in one sweep; existence check with `-e` first (cheap, decisive); the precise-form grep (`cli/doctor.sh`) vs generic (other skills' doctor.sh) distinction.
- Worked: searching for the FUNCTION name (getRolloutPercent) rather than the variable alone — it proved the doc row describes nothing.
- Failed: none; no approach exhausted. (The `runtime/tests/env-reference-drift.vitest.ts` path guess was wrong — the file lives at runtime/tests/ and is checked in iteration 2.)

## Ruled Out

- The `kpi` hits in sk-design bundles (style content, "kpi" as design vocabulary) and the spec-kit changelog — excluded by the census rules.
- The doctor.sh hits — all other skills' own doctor.sh files or unrelated command/doctor scripts; the precise package-file form is clean.

## Sources

[SOURCE: bash `-e` existence sweep, 31 paths, runtime/cli] [SOURCE: rg filename-token census, .opencode + .github + root] [SOURCE: .opencode/skills/system-spec-kit/references/config/environment-variables.md:178] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md:119, 003-valid-level2:119, 004-valid-level3:119] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:23,77] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/package.json:4, README.md:17] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli (find inventory, ls -ld dist/node_modules/runtime)] [SOURCE: .opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/graph-events-review.md:3,30-33]

## Next Iteration

Iteration 2: the 008 side + the 007 fix rows — verify the ENV-REFERENCE.md row removal and section numbering, the config.ts batch-block removal, the drift test path, the deleted skill-level template's references, the aligned validation story (39 rules + orchestrator hop in ARCHITECTURE and rules/README), the post_save_write rename, the ten regex sites, the sibling-lane rule headers, the ops README rewrite, the deep-loop playbook repoint, and read spec-kit-check.yml end to end against the paths it names.

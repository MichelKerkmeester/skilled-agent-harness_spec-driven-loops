---
title: "Tasks: Phase 3: retrieval-coverage-alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval coverage tasks"
  - "generate trigger index twice baseline"
  - "corpus-manifest consumer inventory"
  - "divergence table confirmed"
  - "parity test coverage enforce"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: retrieval-coverage-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline: run `generate-trigger-index.mjs` twice consecutively over the unchanged tree and record both `corpusHash`/`indexSha256` values - baseline `corpusHash 7a9131523902e222ec18c98085c0f2a3ca5fda28b8801d8ceb8a6300b4bbed1d`, `indexSha256 c47151f1f1897675924c905f1c40d16bd0b1f603912175d50f6ca604b8dd82c0`, matched across two runs
- [x] T002 [P] `rg -n "corpus-manifest.json" .opencode/skills/system-spec-kit/scripts/tests` to inventory every consumer before regenerating the fixture - one hit, `trigger-index.vitest.ts`, and it only ever writes/reads a fresh temp-dir copy via `generationPaths()`, never the checked-in fixture; safe to regenerate
- [x] T003 [P] Confirm the divergence table in `spec.md` (roots, exclusions) against a fresh read of `corpus.mjs:20-31` and `retrieval-conventions.md:92-115` - confirmed and recorded in the Resolution subsection of `spec.md` §2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Decide the coverage question for root `README.md`, the five runtime mirrors, and `.opencode/install-guides` and record the decision in `spec.md` - `.opencode/install-guides` joins the trigger index; `README.md` and the five mirrors join neither lane; recorded in `spec.md` §2 Resolution
- [x] T005 Apply the decided exclusion/root policy to `corpus.mjs` and/or `retrieval-conventions.md`, whichever side the decision names - `corpus.mjs` `CORPUS_ROOTS` widened; `scratch` exclusion converged into `lib/rg-lane.mjs`, `rg-wrapper.mjs` and every Section 2 recipe in `retrieval-conventions.md`
- [x] T006 Regenerate `scripts/retrieval/fixtures/corpus-manifest.json` and confirm the T002 consumers still pass - regenerated; `trigger-index.vitest.ts` 48/48 pass (`npx --prefix scripts vitest run --config runtime/vitest.config.ts scripts/tests/trigger-index.vitest.ts`)
- [x] T007 Write the parity test comparing `corpus.mjs`'s exported constants against the parsed `retrieval-conventions.md` glob list - `scripts/tests/retrieval-coverage-parity.vitest.ts`, 7/7 pass
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `generate-trigger-index.mjs` twice again after the change and confirm `corpusHash`/`indexSha256` match between the two post-change runs - both runs report `indexSha256 959b3263cecdae12c1b23bc99141b29f302b1c7d20bcffcaaadbb30def535790`
- [x] T009 Run the new parity test against an injected divergence (temporary fixture) to confirm it fails, then against the converged state to confirm it passes - temporarily added `'undocumented-temp-dir'` to `EXCLUDED_DIR_NAMES`, ran the suite: failed naming that exact entry; reverted (byte-identical diff), reran: 7/7 pass
- [x] T010 Report the `includedPathCount` delta between the T001 baseline and the post-change manifest, and confirm it matches the coverage decision's expected direction - isolating the root change alone (`walkCorpus` with the old vs. new root list over the same tree) adds exactly two documents, `.opencode/install-guides/README.md` and `install-scripts/README.md`, both `ok` category, zero new malformed; matches the decision to add `.opencode/install-guides` only
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001..004, §4
- [x] CHK-002 [P0] Technical approach defined in plan.md - compare-then-converge architecture, §3
- [x] CHK-003 [P1] Dependencies identified and available - `normalize.mjs` unchanged; `corpus-manifest.json` consumer inventory done in T002
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - `node --check` clean on all three edited `.mjs` files
- [x] CHK-011 [P0] No console errors or warnings - vitest runs clean, no stray console output
- [x] CHK-012 [P1] Error handling implemented - no new error paths introduced; existing `walkCorpus` root-missing/symlink handling unchanged
- [x] CHK-013 [P1] Code follows project patterns - new exports mirror existing `CORPUS_ROOTS`/`EXCLUSIONS`/`isExcludedDirectory` style; GLOBS additions match the existing array shape in both `rg-lane.mjs` and `rg-wrapper.mjs`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - AC-001..004 all Met, see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete - Gate 1 lookup smoke test, install-guides lookup, two-run determinism, all executed and read
- [x] CHK-022 [P1] Edge cases tested - symlinked-mirror dedup unchanged (existing test still passes); empty/missing root path (`.opencode/install-guides` absent in temp-dir tests still hits the existing `root does not exist` branch, unchanged)
- [x] CHK-023 [P1] Error scenarios validated - T009 negative control: injected an undocumented exclusion, confirmed the parity test fails and names it, reverted, confirmed it passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. - `matrix/evidence`: a 2-lane × 7-surface coverage/exclusion matrix, filled with a decision and reason per cell.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. - `rg -n "CORPUS_ROOTS|EXCLUSIONS|isExcludedDirectory|EXCLUDED_DIR_NAMES|FIXTURE_DIR_PATTERN" scripts/retrieval --glob '*.mjs'` confirms `corpus.mjs` is the only producer for the two lanes this phase targets. It also surfaced two additional same-shaped-but-out-of-scope producers not named by this phase's Problem Statement: `retrofit-convention.mjs`'s own `EXCLUDED_DIR_NAMES` (`z_archive`, `node_modules` only) and `sweep-memory-residue.mjs`'s own `EXCLUDE_GLOBS` (`.git`, `node_modules`, `z_archive`, `research/lineages`, `scratch`, `.worktrees`). Neither is "the trigger-index corpus walker" or "the documented ripgrep recipes" this phase's Problem Statement names, so both are left untouched and flagged here rather than absorbed - a fourth and fifth divergent list exist and are candidates for a future phase.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. - `rg -n "corpus\.mjs"` and `rg -n "rg-lane\.mjs"` over `scripts/retrieval scripts/tests`: every importer resolves after the change (`generate-trigger-index.mjs`, `retrofit-convention.mjs`, `rg-wrapper.mjs`, `sweep-memory-residue.mjs`, both vitest suites); `retrofit-convention.mjs` only imports `canonicalRelativePath` (unchanged), so the `CORPUS_ROOTS` widening does not reach it.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - Not a security/parser fix; closest equivalent applied: the parity test's scoped-divergence probes cover both branches of each conditional exclusion (`research`-parent vs. not, inside vs. outside `specs/`) and a control case that must not exclude.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. - Axes: lane (trigger-index / ripgrep) × surface; 5 root rows + 6 exclusion rows, both tables in `spec.md` §2 Resolution and `retrieval-conventions.md` §9.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - N/A: this phase's changes touch no process-wide state (`resolveRipgrep`'s `process.env` read in `rg-lane.mjs` is pre-existing and untouched).
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. - Not yet committed (commits are out of this agent's scope); evidence is instead pinned to content-addressed values that do not move with the branch: `indexSha256 959b3263cecdae12c1b23bc99141b29f302b1c7d20bcffcaaadbb30def535790`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - none touched; only path/glob literals
- [x] CHK-031 [P0] Input validation implemented - N/A, no new external input surface added
- [x] CHK-032 [P1] Auth/authz working correctly - N/A, no auth surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - spec.md Resolution + tasks.md evidence + acceptance-criteria.md rows all cite the same decision and hashes
- [x] CHK-041 [P1] Code comments adequate - durable-why comments on every changed export; no spec paths, phase numbers or finding ids embedded (checked by grep, see CHK-FIX evidence)
- [x] CHK-042 [P2] README updated (if applicable) - `scripts/retrieval/README.md` updated: install-guides mention, scratch exclusion, new test file in the validation list; `python3 validate_document.py` clean
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the negative-control backup used `/tmp` and was removed after the T009 revert; no scratch/ needed
- [x] CHK-051 [P1] scratch/ cleaned before completion - no scratch/ files created by this phase; `/tmp` scratch artifacts (`corpus.mjs.bak`, baseline/post-change JSON) all removed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---

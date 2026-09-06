---
title: "Tasks: Phase 6: orphaned-types-and-dead-modules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: orphaned-types-and-dead-modules

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

- [x] T001 Capture baseline typecheck output for `shared`, `scripts`, `runtime` — all three exit 0 before any edit (captured in scratchpad `baseline-shared.log`/`baseline-runtime.log`/`baseline-scripts.log`)
- [x] T002 [P] Capture baseline `check-markdown-links.cjs` output (counts and full broken list) — `7897 files, 13484 links checked, 8 broken` (same 8-entry broken list retained after the fix)
- [x] T003 [P] `rg` each of the seven `shared/types.ts` symbols and both runtime modules across the whole repository (source and `specs/`) to confirm zero non-declaration reference — confirmed all seven confined to `shared/types.ts`/`shared/index.ts`, and `rollout-policy`/`description/repair` confined to their own dedicated test files, with zero production consumer
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete or re-home (with a stated reason) the seven orphaned symbols in `shared/types.ts`, including any individual re-export in `shared/index.ts` — deleted `IVectorStore`, `SearchOptions`, `SearchResult`, `StoreStats`, `Database`, `DatabaseExtended`, `PreparedStatement`; renumbered the file's section-comment sequence; removed the matching `shared/index.ts` re-export lines
- [x] T005 Delete or re-home (with a stated reason) `runtime/lib/cognitive/rollout-policy.ts` and its dedicated test — deleted the module, its test, its README and the now-empty `cognitive/` folder; updated `MODULE-MAP.md`, `lib/README.md` and `ENV-REFERENCE.md` (`SPECKIT_ROLLOUT_PERCENT` row removed — that env var is still read independently by the unrelated, out-of-scope `shared/algorithms/adaptive-fusion.ts`, so the variable itself is not dead, only this module's reader of it)
- [x] T006 Delete or re-home (with a stated reason) `runtime/lib/description/repair.ts` and its dedicated tests — deleted the module and the 100%-dedicated `repair.vitest.ts`; surgically removed only the `mergePreserveRepair`-specific test/import from `repair-specimens.vitest.ts` (7 of 8 tests kept — the rest exercise the real, still-live `folder-discovery.ts` repair path) and from `description-merge.vitest.ts` (5 of 10 kept); updated `MODULE-MAP.md` and `lib/description/README.md`
- [x] T007 Move or delete `scripts/lib/completion-state.test.mjs` so it either runs under a real vitest include glob or is gone — moved to `scripts/tests/completion-state.vitest.ts` first, ran it standalone: 10/27 assertions failed against the current `completion-state.cjs`/`check-completion.sh` contract (stale `checklist`-keyed level inference vs. current `acceptanceCriteria`-keyed inference, and a required anchored Verification Protocol checklist section the fixture never had) — deleted as stale/superseded per the phase's explicit provision
- [x] T008 Move or delete `runtime/scripts/tests/resource-map-extractor.vitest.ts` so it either runs under `runtime/vitest.config.ts`'s include globs or is gone — moved to `runtime/tests/resource-map-extractor.vitest.ts`, ran standalone: 3/3 initially failed on stale example-path existence facts (a concurrent, unrelated commands-tree restructuring mid-session invalidated a first fix attempt too); repaired by recomputing the "Missing on disk" counts and swapping one stale example path for a live one — now 3/3 pass; deleted the now-empty `runtime/scripts/tests/` folder and its README
- [x] T009 Add a log line or a reason comment to `alignment-validator.ts:582-586`'s empty catch — added `console.log` reporting `error.message`, no control-flow change
- [x] T010 Deduplicate `check-markdown-links.cjs:24-26`'s `ROOTS` array — one entry per directory now
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run typecheck for `shared`, `scripts`, `runtime` and confirm no new error versus the T001 baseline — all three `tsc --noEmit` exit 0, same as baseline
- [x] T012 Re-run `check-markdown-links.cjs` and confirm its counts reflect the deduplicated file set, and its `broken` list is unchanged in content from the T002 baseline — `7837 files, 13467 links checked, 8 broken`, same 8 entries as the T002 baseline (files -60, links -17, matching the two duplicated roots' true file/link count exactly once instead of twice)
- [x] T013 Run `vitest run` and confirm the two previously-orphaned tests either appear in the executed-file list or are confirmed deleted, with no new failure — `resource-map-extractor.vitest.ts` appears and passes (3/3) under `runtime/tests/**/*.vitest.ts`; `completion-state.test.mjs` confirmed absent repo-wide (`find` zero hits)
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available — none; phase has no dependency on the other six sibling phases
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `tsc --noEmit` exits 0 for `shared`, `runtime`, `scripts`
- [x] CHK-011 [P0] No console errors or warnings — dist rebuild and `dist-freshness.cjs check-all` both clean
- [x] CHK-012 [P1] Error handling implemented — `alignment-validator.ts`'s empty catch now logs `error.message` instead of swallowing silently
- [x] CHK-013 [P1] Code follows project patterns — matched existing `console.log('   Warning: ...')` convention already used elsewhere in the same function
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — see `acceptance-criteria.md`, AC-001 through AC-005 all Met
- [x] CHK-021 [P0] Manual testing complete — every touched vitest suite run standalone before and after; `check-markdown-links.cjs` run before/after
- [x] CHK-022 [P1] Edge cases tested — the two re-enabled tests were run in isolation first per the plan's own risk mitigation, surfacing and fixing real drift before wiring them in
- [x] CHK-023 [P1] Error scenarios validated — `resource-map-extractor.vitest.ts`'s stale-fixture-path failures and `completion-state.vitest.ts`'s stale-contract failures were both root-caused, not just re-run until green
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — all six items are `instance-only` (a single named symbol/module/catch/array with a proven-zero or fully-enumerated consumer set)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `rg` proofs recorded per item in `implementation-summary.md`
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — `mergePreserveRepair`'s three test consumers individually inventoried (one 100%-dedicated file deleted whole, two files partially trimmed); `rollout-policy`'s one dedicated test deleted whole
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: no security/path/parser/redaction fix in this phase
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — item (7 types + 2 modules + 2 tests + 1 catch + 1 script = 6 rows) × outcome, in `implementation-summary.md`'s Key Decisions table
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: no process-wide env/global-state read introduced or changed by this phase's fixes
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — no commit made per the dispatch instructions (working-tree diff only); evidence below is the command output actually observed, not a SHA reference
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none introduced; the catch-block log prints only `error.message` from a local filesystem read
- [x] CHK-031 [P0] Input validation implemented — N/A, no new input surface
- [x] CHK-032 [P1] Auth/authz working correctly — N/A, no auth/authz surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — this document, `acceptance-criteria.md`, `spec.md` and `implementation-summary.md` all reflect the same closed state
- [x] CHK-041 [P1] Code comments adequate — no ephemeral spec/finding/task ids embedded; durable-WHY comments only (e.g. the description-README's note on why `repair.ts` was removed rather than kept)
- [x] CHK-042 [P2] README updated (if applicable) — `runtime/lib/README.md`, `runtime/lib/MODULE-MAP.md`, `runtime/lib/description/README.md`, `runtime/scripts/README.md`, `runtime/tests/description/README.md`, `runtime/tests/description/fixtures/README.md` and `runtime/ENV-REFERENCE.md` updated; all validate 0 issues via `validate_document.py`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — working files kept in the session scratchpad, not this packet's `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only the pre-existing `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---

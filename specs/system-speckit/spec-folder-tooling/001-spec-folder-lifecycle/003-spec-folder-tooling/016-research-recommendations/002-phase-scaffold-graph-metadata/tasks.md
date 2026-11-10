---
title: "Tasks: Phase 2: phase-scaffold-graph-metadata"
description: "Remove early exit in --phase mode, call graph-metadata backfill for parent and children, refresh children_ids, add test case."
trigger_phrases:
  - "phase scaffold graph metadata tasks"
  - "create.sh --phase backfill tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: phase-scaffold-graph-metadata

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

- [x] T001 [P0] Verify backfill-graph-metadata.ts exists and is callable (`.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts`). Evidence: the file exists at that path, and a throwaway `create.sh --phase` run derived metadata through it; all three packets passed strict.
- [x] T002 [P1] Document the current create.sh --phase control flow at lines 1900-1920. Evidence: recorded in spec.md Problem Statement; at HEAD the phase block's `exit 0` sits at create.sh:1919 and the backfill block starts at line 2006, after it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Extract the graph-metadata backfill code (create.sh lines 2006-2021) into a reusable helper function (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Evidence: `backfill_graph_metadata` is defined at create.sh:885, ahead of the phase block, and takes a list of folders. Done differently: the helper sits in the helper section instead of replacing the block in place.
- [x] T004 [P0] Call the helper for the parent packet in the --phase block before the exit at line 1919 (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Evidence: called at create.sh:1937, before the opt-in post-create check and the exit at line 1947. Done differently: one call passes the parent and the children together, not a separate parent call.
- [x] T005 [P0] Verify the existing _child_paths loop at create.sh:2017-2021 is reached by the helper call; it will drive child backfills automatically (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Done differently: the old child loop (HEAD create.sh:2017) sat in the root path after the phase exit and never ran for `--phase`. The helper now takes the children as arguments, the phase block passes `_child_paths`, and the dead loop was removed. The vitest phase case and the throwaway run confirm both children derive.
- [x] T006 [P0] Verify that parent backfill auto-refreshes children_ids from on-disk directories; the deriveGraphMetadata function handles this automatically (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Evidence: a throwaway `create.sh --phase` run with two children wrote `children_ids` `["001-evidence-phase-probe/001-first","001-evidence-phase-probe/002-second"]`, and the parent passed `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`.
- [x] T007 [P1] Handle errors from backfill calls: report warnings but do not fail the scaffold (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Evidence: the helper returns 0 with a named warning when the tsx loader or the backfill script is missing, and prints `Warning: graph metadata derivation skipped for <folder>` when a derivation fails (create.sh:885-902). Confirmed by reading the code; no test exercises the failure path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Add --phase test case to scaffold-passes-its-own-gate.vitest.ts that creates a parent with two children (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`). Evidence: `a phase parent and its children, untouched, report no errors` with a `scaffoldPhase` helper; `vitest run` on the file: 6 passed. With HEAD create.sh the case fails ("001-scaffold-gate-phase-probe did not report a clean gate").
- [x] T009 [P0] Test case validates parent with strict gates after scaffold (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`). Evidence: the case runs `validate.sh --strict --no-recursive` on the parent and asserts `Errors: 0` and exit status 0.
- [x] T010 [P0] Test case validates each child with strict gates after scaffold (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`). Evidence: the same loop covers each child, read from disk after `create.sh` returns.
- [x] T011 [P1] Run full spec-kit test suite and verify no regressions. Evidence: wave 1 final gate, `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` rc 0, vitest 162 files passed and 3 skipped, 1648 tests passed and 19 skipped, 0 failed; baseline at c85ec7f8803 was 161 files and 1639 passed. The run covers the whole wave, not this phase alone.
- [x] T012 [P1] Manual test: create a real phase parent and validate all three packets with validate.sh --strict. Evidence: a throwaway `create.sh --phase` run with two children; the parent, `001-first` and `002-second` each printed `RESULT: PASSED` under `--strict`; the folders were removed afterwards.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001 through T012 marked complete
- [x] No `[B]` blocked tasks remaining
- [x] Strict validation passes on scaffolded parent and children. Evidence: see T009, T010 and T012.
- [x] Full spec-kit test suite passes. Evidence: see T011.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for problem statement and requirements
- **Plan**: See `plan.md` for technical approach
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research Source**: `../../014-spec-auto-healing-research/research/research.md` section 5.3, section 11 SH-02
<!-- /ANCHOR:cross-refs -->

---

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
## Pre-Implementation Checks

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4 holds REQ-001 to REQ-005.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md sections 3 and 5 define the approach and tests; the data flow now matches the built shape.
- [x] CHK-003 [P0] backfill-graph-metadata.ts exists and is functional. Evidence: the tool exists and derived passing metadata for the parent and both children in the throwaway run.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Checks

- [x] CHK-010 [P0] No syntax errors in create.sh modifications. Evidence: `bash -n` on create.sh exits 0.
- [x] CHK-011 [P0] Error handling for backfill failures implemented. Evidence: see T007; the helper warns and returns 0 on a missing tool or a failed derivation.
- [x] CHK-012 [P1] Code follows bash style conventions in create.sh. Evidence: judgment from the diff; the helper follows the adjacent `report_missing_generator` style (local variables, guard-and-return, stderr warnings), and the review round raised no style finding.
- [x] CHK-013 [P1] New test case follows vitest patterns. Evidence: judgment from the file; `scaffoldPhase` mirrors `scaffold()`, registers the folder for the existing `afterEach` cleanup and reads children from disk.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checks

- [x] CHK-020 [P0] All P0 requirements from acceptance-criteria.md met. Evidence: AC-001 to AC-005 are all Met in acceptance-criteria.md.
- [x] CHK-021 [P0] New --phase test case in scaffold-passes-its-own-gate.vitest.ts passes. Evidence: the phase case passes; the file shows 6 passed in the wave 1 evidence and in a rerun for this closeout.
- [x] CHK-022 [P0] Full spec-kit test suite passes with no regressions. Evidence: see T011; wave 1 final gate rc 0 with 0 failed.
- [x] CHK-023 [P1] Manual test: created phase parent passes strict validation. Evidence: see T012.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. not applicable: the review round raised no actionable finding; both P2 items were not applied (reasons in implementation-summary.md).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg 'backfill-graph-metadata|backfill_graph_metadata'` over runtime/cli/spec finds one call site for the backfill script in create.sh, inside the helper; `repair-derived.cjs` and `upgrade-legacy.mjs` carry their own invocations and were not touched.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `rg backfill_graph_metadata create.sh` finds the definition (line 885) and two callers, the phase block (line 1937) and the root path (line 2034); the helper is new, so no other consumer exists.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. not applicable: no security, path, parser or redaction behavior changed; the helper only passes folder paths that create.sh itself just made.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: plan.md lists the axes, (phase | root) x (backfill present | missing) x (parent only | parent plus children). The present-backfill cells that exist are exercised by the vitest file (levels 1, 2 and 3, and the phase case); the backfill-missing cells are covered by reading the helper's guards only.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. not applicable: the helper reads only paths derived from `SCRIPT_DIR` and no new environment variable or global state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: pinned to the working-tree diff against HEAD c85ec7f880, limited to `create.sh` and `scaffold-passes-its-own-gate.vitest.ts`; the wave 1 commit does not exist yet, so no fix SHA is available.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff adds no credential or token.
- [x] CHK-031 [P0] Input validation implemented. Evidence: the helper skips empty folder arguments and checks that the tsx loader and the backfill script exist before running.
- [x] CHK-032 [P1] Auth/authz working correctly. not applicable: the change has no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec.md, plan.md and tasks.md agree on the built shape; plan.md data flow steps 4 and 5 were updated to match.
- [x] CHK-041 [P1] Code comments adequate. Evidence: the helper carries a comment on why the derivation runs and what a missing tool does.
- [x] CHK-042 [P2] README updated (if applicable). not applicable: spec/README.md describes no --phase graph metadata behavior and no flag or usage changed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the throwaway packets were removed, and `scratch/` holds only `.gitkeep`.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 22/22 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

Counts cover every task and checklist row that carries a priority tag. Five rows are ticked as not applicable (CHK-FIX-001, CHK-FIX-004, CHK-FIX-006, CHK-032, CHK-042), each with its reason.

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---




---
title: "Tasks: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "nested subtracks tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`K` is `.skilled/skills/system-spec-kit`. `S` is this packet's `scratch/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the cli vitest baseline before any source edit (`S/vitest-cli-baseline.txt`). Verify: `grep -E "Test Files|Tests " S/vitest-cli-baseline.txt` prints `1 failed | 208 passed | 3 skipped` and `2593 passed | 20 skipped`.
- [x] T002 Capture the sweep baseline (`S/sweep-baseline.txt`). Verify: `grep -v "declared=" S/sweep-baseline.txt` prints one diagnostic line and `exit=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Recurse one declared level in both reader views and report the third level (`K/runtime/cli/lib/track-roots.mjs`). Verify: `nested-subtrack.vitest.ts` reader cases pass and `node S/one-level-parity.mjs` prints `identical=true` on every line.
- [x] T004 Apply the mixed rule to a level-1 sub-track (`K/runtime/cli/spec/sweep-track-roots.mjs`). Verify: the sweep case in `nested-subtrack.vitest.ts` prints `flat packets beside sub-tracks: 001-flat`.
- [x] T005 Accept a three-segment `--track`, refuse four, refresh every level and compare the fit at level 1 (`K/runtime/cli/spec/create.sh`). Verify: `bash -n` exits 0 and the create cases pass.
- [x] T006 Recognise and recurse into a level-2 sub-track (`K/runtime/cli/spec/validate.sh`). Verify: the validate case passes.
- [x] T007 Exempt a level-2 sub-track from packet rules (`K/runtime/lib/validation/orchestrator.ts`). Verify: after `npm run build`, the validate case sees `TRACK_ROOT` for `mcp/tooling/clickup`.
- [x] T008 Derive a level-2 sub-track as a packet's parent (`K/runtime/lib/graph/graph-metadata-parser.ts`). Verify: the graph case reads `mcp/tooling/clickup`.
- [x] T009 Repair a packet's parent inside a level-2 sub-track (`K/runtime/cli/spec/repair-derived.cjs`). Verify: the repair case prints `graph parent legacy-parent -> mcp/tooling/clickup`.
- [x] T010 Move into, declare and refuse past two levels (`K/runtime/cli/spec/relocate.mjs`). Verify: the three relocation cases pass.
- [x] T011 Archive inside a level-2 sub-track and refresh every level (`K/runtime/cli/spec/archive.sh`). Verify: the archive case passes.
- [x] T012 Move the old depth-limit refusal cases one level deeper (`K/runtime/cli/tests/create-track-refresh.vitest.ts`, `K/runtime/cli/tests/relocate.vitest.ts`). Verify: both files pass.
- [x] T013 Add the two-level test file (`K/runtime/cli/tests/nested-subtrack.vitest.ts`). Verify: 12 tests pass, and 11 fail against the previous sources.
- [x] T014 State the two-level rule (`K/references/structure/folder-structure.md`, three catalog pages, two READMEs, `K/SKILL.md`). Verify: `rg -n "One level is supported" K/references` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Rerun the cli suite (`S/vitest-cli-after.txt`). Verify: `grep -E "Test Files|Tests " S/vitest-cli-after.txt` prints no failed file.
- [x] T016 Rerun the sweep (`S/sweep-after.txt`). Verify: `diff S/sweep-baseline.txt S/sweep-after.txt` shows only the new packet's count line.
- [x] T017 Validate this packet (`spec.md`). Verify: `bash K/runtime/cli/spec/validate.sh <this packet> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `S/one-level-parity.txt` prints `identical=true` on all eight lines
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with the blocker named on its line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md REQ-001 to REQ-009]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md section 3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `npm --prefix .skilled/skills/system-spec-kit run build` exit 0]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax checks [EVIDENCE: `bash -n` on create.sh, validate.sh, archive.sh and `node --check relocate.mjs` exit 0; `tsc --build` exit 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: `S/vitest-cli-after.txt`]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: third-level refusals in create.sh, relocate.mjs and the reader diagnostic]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: each predicate extended in place; no new module]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: `S/one-level-parity.txt`]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: third level, undeclared level 2, mixed level-1 sub-track, missing level-2 metadata]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: create exit 1 and relocate exit 2 cases in nested-subtrack.vitest.ts]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: diff adds no credential]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: every sub-track on the way must declare itself; links are never followed]
- [x] CHK-032 [P1] Auth/authz: N/A, the tools run locally with no auth surface [EVIDENCE: no auth code touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: this file and spec.md name the same nine source files]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: each changed predicate states the two-level rule]
- [x] CHK-042 [P2] README updated [EVIDENCE: runtime/cli/lib/README.md and runtime/cli/spec/README.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: baselines and the parity script sit in scratch/]
- [x] CHK-051 [P1] scratch/ holds only the evidence the summary cites [EVIDENCE: `ls scratch/`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---

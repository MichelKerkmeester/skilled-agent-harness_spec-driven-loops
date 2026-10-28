---
title: "Tasks: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fanout resume and containment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit

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

Shell variables: `RT` is `.skilled/skills/system-deep-loop/runtime`. `LIN` is `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/001-deep-research/research/lineages/llmgateway-flash-undated`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the interrupted lineage's on-disk state without mutating it (`LIN`). Verify: `ls LIN/deep-research-effect-ledger/frames` prints `0000000000000001.frame` and `0000000000000002.frame`, an intent and its confirmation.
- [x] T002 Baseline the runtime suite at HEAD (`RT`). Verify: `cd RT && npm test` prints `Test Files  169 passed (169)` and `Tests  2823 passed | 8 skipped (2831)`.
- [x] T003 Trace the resume path from `readStoredLineageSessionId` through `dispatchExecutorEffect` to the gateway's `execute` (`RT/scripts/fanout-run.cjs`, `RT/lib/deep-loop/fanout-effect-dispatch.ts`, `RT/lib/receipts-and-effect-recovery/effect-gateway.ts`). Verify: the logical effect id `fanout-dispatch:<label>:attempt-<n>` is the only key on that path, and `n` restarts at 1 each supervisor run.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing-first resume tests (`RT/tests/unit/fanout-effect-dispatch.vitest.ts`, `RT/tests/unit/fanout-run.vitest.ts`). Verify: against the unfixed source, `npx vitest run --no-coverage tests/unit/fanout-effect-dispatch.vitest.ts` prints `Tests  4 failed (4)`, and the three-resume case in `fanout-run.vitest.ts` fails with `run 2: expected 3 to be +0`.
- [x] T005 Fix the resume collision (`RT/lib/deep-loop/fanout-effect-dispatch.ts`). Verify: the same four tests print `Tests  4 passed (4)`.
- [x] T006 Add the failing-first containment tests (`RT/tests/unit/write-containment.vitest.ts`, `RT/tests/unit/fanout-run.vitest.ts`). Verify: against the unfixed source the contested block prints 4 failed and the concurrent-operator case fails with `expected undefined`.
- [x] T007 Add the contested class and wire it into the supervisor (`RT/lib/deep-loop/write-containment.ts`, `RT/scripts/fanout-run.cjs`). Verify: the contested block prints 5 passed and the concurrent-operator case passes.
- [x] T008 Move the one existing quarantine test whose setup made the lane's target a baseline-dirty path onto a clean baseline (`RT/tests/unit/write-containment.vitest.ts`, the `content_truncated` case). Verify: its assertions are unchanged and it passes.
- [x] T009 Document the attribution trade-off (`.skilled/skills/system-deep-loop/feature-catalog/fanout-write-containment/fanout-write-containment.md`). Verify: `rg -n "containment_contested" .skilled/skills/system-deep-loop/feature-catalog` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the whole runtime suite after the change (`RT`). Verify: `cd RT && npm test` prints a passing total with 7 more test files' worth of cases added and no failure; the counts are in `implementation-summary.md`.
- [x] T011 Run the drift and type checks. Verify: `node RT/scripts/check-contract-drift.cjs` exits 0, `node RT/scripts/check-documentation-drift.cjs` exits 0, and `cd RT && npm run typecheck` exits 0.
- [x] T012 Validate this packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/043-fanout-resume-and-containment --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

## Phase 4: Documentation Follow-Up

- [x] T013 Add the README rows (`RT/tests/unit/README.md`, `RT/lib/deep-loop/README.md`). Verify: `check_readme_references.py` and `check_derived_readme_counts.py` on each README add no failure; the one unresolved `scripts/runtime-bootstrap.cjs` line in the tests README was there before.
- [x] T014 Add the contested rule to both loop protocols and recompile the command contracts (`deep-research/references/protocol/loop-protocol.md`, `deep-review/references/protocol/loop-protocol.md`, `.skilled/commands/deep/assets/compiled/`). Verify: `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` and exits 0, and `check-documentation-drift.cjs` exits 0 with `"errors": []`.
- [x] T015 Write the runtime and hub changelog entries and bump the hub version carriers (`RT/changelog/v1.9.13.0.md`, `changelog/v1.6.13.0.md`, hub `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, the Hermes mirror). Verify: `validate_document.py` prints `Total issues: 0` on each entry, `frontmatter-version.mjs verify --skill system-deep-loop` exits 0 and `parent-skill-check.cjs` exits 0.

---

## Phase 5: Contested Paths at the Single-Lineage Call Sites

`ASSETS` is `.skilled/commands/deep/assets`. A review found that only `fanout-run.cjs` read the result's `contested` field. The ten direct `enforceWriteContainment` calls in the research and review workflows printed `violations` alone, so a single-lineage run reported a lane write to an operator's dirty file nowhere.

- [x] T016 Confirm the gap before editing (`RT/lib/deep-loop/write-containment.ts`, `RT/scripts/fanout-run.cjs`, `ASSETS/deep-research-*.yaml`, `ASSETS/deep-review-*.yaml`). Verify: `rg -n "contested" RT/scripts/fanout-run.cjs` prints the only reader, and each of the ten YAML call sites prints only `containment.violations`.
- [x] T017 Record a contested path in the caller's state log (`RT/lib/deep-loop/write-containment.ts`). Verify: the two new cases in the contested block of `RT/tests/unit/write-containment.vitest.ts` pass, one with no violation and one with a violation in the same pass.
- [x] T018 Print contested paths and their note at every workflow call site, and state it in the two confirm-step notes (`ASSETS/deep-research-auto.yaml`, `ASSETS/deep-research-confirm.yaml`, `ASSETS/deep-review-auto.yaml`, `ASSETS/deep-review-confirm.yaml`). Verify: `rg -c "containment.contestedNote"` prints 4, 1, 4 and 1.
- [x] T019 Add the call-site guard (`RT/tests/unit/write-containment-yaml-call-sites.vitest.ts`, its README row). Verify: the guard's matching rules applied to the HEAD YAML flag 10 of 10 call sites, and to the working tree 0 of 10.
- [x] T020 State the single-lineage report in both loop protocols, update the shared-checkout playbook scenario to the violations and contested split, and recompile the three command contracts. Verify: `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.
- [x] T021 Write runtime `v1.9.14.0` and hub `v1.6.15.0`, bump the hub carriers and sync Hermes. Verify: `validate_document.py` prints `Total issues: 0` on each entry, `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`.
- [x] T022 Rerun the whole runtime suite and the checks. Verify: the counts are in `implementation-summary.md`.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The runtime suite, the drift checks and strict validation passed after the last edit
- [x] The README, protocol and changelog follow-ups pass their checks
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in the runtime exits 0
- [x] CHK-011 [P0] No ephemeral labels (spec paths, packet or task ids) appear in any code comment added by this change
- [x] CHK-012 [P1] Containment still never deletes or rewrites a file: contested paths are not touched
- [x] CHK-013 [P1] The change follows the module headers and naming of the files it edits
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Each new test failed against the unfixed source for the stated reason (T004, T006)
- [x] CHK-022 [P1] Edge cases tested: a dispatch lost before its confirmation, a changed prompt, three resumes in a row, a path the lane itself left dirty, and restore mode
- [x] CHK-023 [P1] Error scenarios validated: the lane's own stray write is still reported next to a contested path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Resume is `class-of-bug`: any redispatch of a lineage under a stored session id hit it. Containment is `class-of-bug`: any baseline-dirty path that changed again was filed under the lane.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n "logicalEffectId" RT/lib RT/scripts` shows one fan-out producer, `dispatchExecutorEffect`.
- [x] CHK-FIX-003 [P0] Consumers: `enforceWriteContainment` has one script caller (`fanout-run.cjs`) and ten direct calls in the four research and review workflow YAMLs. The first census counted only the script; the YAML calls were found in review and fixed in Phase 5. The stress and in-process tests that import the module do not read `contested`.
- [x] CHK-FIX-004 [P0] The contested rule is a path-identity rule, not a parser or resolver: adversarial cases are the lane's own earlier quarantine (stays the lane's), restore mode (not applied), a regenerable-state path (stays exempt) and an escaping symlink (never contested).
- [x] CHK-FIX-005 [P1] Matrix axes: mode (preserve, restore) by baseline state (clean, dirty and unchanged, dirty and changed, dirty and changed but quarantined by an earlier pass). Four of eight rows are covered; the rest are the existing suite.
- [x] CHK-FIX-006 [P1] Hostile env variant: the fan-out tests run with `GIT_*` redirectors removed, as the neighbouring tests do.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree of this packet; nothing is committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret or credential is read or written
- [x] CHK-031 [P0] The manifest reader added to the guard reads only inside the lineage directory and treats a malformed file as empty
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same two fixes and the same files
- [x] CHK-041 [P1] Code comments state the durable reason and carry no packet or task ids
- [x] CHK-042 [P2] README rows, both loop protocols, the compiled command contracts and the changelogs carry the change (T013 to T015)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the session scratch directory, not in the repository
- [x] CHK-051 [P1] No file under the 035 packet was modified
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---

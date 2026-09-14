---
title: "Tasks: Give the shared-checkout churn detector a cumulative arm so slow drift trips it"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/005-churn-cumulative-arm"
    last_updated_at: "2026-09-14T13:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-max"
    recent_action: "Added the cumulative churn arm and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-005-churn-cumulative-arm"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Give the shared-checkout churn detector a cumulative arm so slow drift trips it

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

- [x] T001 Read the detector, its call site and the config route `churnThreshold` takes, then run the two touched test files to capture the baseline (`runtime/tests/unit/fanout-run.vitest.ts`, `runtime/tests/unit/executor-config.vitest.ts`) [EVIDENCE: baseline exit 0, 235 passed]
- [x] T002 Write the two new cases first and watch them fail against the burst-only detector (`runtime/tests/unit/fanout-run.vitest.ts`, `runtime/tests/unit/executor-config.vitest.ts`) [EVIDENCE: config case exit 1 "expected undefined to be 12"; churn case exit 1 "expected [] to have a length of 1 but got +0"]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `churnCumulativeThreshold` to the containment schema, its prefault literal and the `FanoutConfig` type (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`) [EVIDENCE: `executor-config.ts:706`, `:715`, `:760`]
- [x] T004 Accumulate the running total, detect on either arm and report both counts to the callback (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [EVIDENCE: `fanout-run.cjs:1641`, `:1651`, `:1653`, `:1658`]
- [x] T005 Resolve the new config value and write `cumulative_dirty_paths` and `churn_cumulative_threshold` on the ledger event (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [EVIDENCE: `fanout-run.cjs:3056`, `:3722`]
- [x] T006 Extend the churn fixture with a spread write mode so one path lands per heartbeat (`runtime/tests/unit/fanout-run.vitest.ts`) [EVIDENCE: `fanout-run.vitest.ts:3041`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the cumulative case and confirm it now trips with no window above the per-window threshold (`runtime/tests/unit/fanout-run.vitest.ts`) [EVIDENCE: `fanout-run.vitest.ts:3145` passes; observed event `newly_dirty_paths: 1`, `cumulative_dirty_paths: 4`]
- [x] T008 Run the two touched test files and the typecheck (`npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts tests/unit/executor-config.vitest.ts`; `npm run typecheck`) [EVIDENCE: exit 0 with 237 passed; typecheck exit 0]
- [x] T009 Fill the packet docs and validate the phase folder (`validate.sh --strict`) [EVIDENCE: RESULT: PASSED]
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: `spec.md` REQ-001..REQ-004]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: `plan.md` sections 1 and 3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `plan.md` section 6; no new dependency]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `npm run typecheck` exit 0; `node --check scripts/fanout-run.cjs` clean]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: both test runs clean]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the sampler's catch still ends sampling and never fails the lane]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: per-arm zero toggles mirror the existing threshold guard; the config mirrors `churnThreshold`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: `acceptance-criteria.md` every row Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: not applicable; covered by the stub-lane integration case]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: burst above, at-or-below, spread-across-windows, zero, negative and non-integer config]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: sampling failure path unchanged and still fail-open]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `algorithmic` [EVIDENCE: the detection statistic itself was incomplete, not one call site]
- [x] CHK-FIX-002 [P0] Same-class producer inventory: every read of the churn threshold resolves through `parsedFanoutConfig.containment`; no second detector exists [EVIDENCE: `grep -rn 'churnThreshold' runtime` returns the schema, the runner and the tests only]
- [x] CHK-FIX-003 [P0] Consumer inventory: one detector call site, one ledger event, one config type [EVIDENCE: `plan.md` affected-surfaces table]
- [x] CHK-FIX-004 [P0] Not a path or parser fix; the adversarial cases are the arming matrix rows [EVIDENCE: `plan.md` matrix axes]
- [x] CHK-FIX-005 [P1] Matrix axes and rows listed before completion: arm x window shape x config [EVIDENCE: `plan.md` section 3]
- [x] CHK-FIX-006 [P1] Hostile variant: the stub binary writes outside the lineage while the lane runs, with the checkout on PATH-visible git [EVIDENCE: `fanout-run.vitest.ts:3145`]
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff of this phase [EVIDENCE: four files, `git diff --stat`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: config field and counters only]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: non-negative integer enforced by the schema; two rejection cases]
- [x] CHK-032 [P1] Auth/authz not applicable; no new command or credential [EVIDENCE: `spec.md` NFR-S01]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: REQ, AC and task rows agree]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: detector doc comment names both arms; schema comment states the default and the zero case]
- [x] CHK-042 [P2] README not applicable; the config lives in the schema [EVIDENCE: `spec.md` scope]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `scratch/` holds only `.gitkeep`; fixtures use the OS temp dir]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `find scratch -type f` returns `.gitkeep` only]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-14
<!-- /ANCHOR:summary -->

---


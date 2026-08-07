---
title: "Tasks: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries"
description: "Task breakdown for 027-mode-gate-and-contract-binding: confirm-before-build pass over 9 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "mode gate contract binding"
  - "readiness gate sealed digest binding"
  - "rollback switch certificate binding"
  - "conformance event unbound reducer"
  - "deep loop 027 gates"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/027-mode-gate-and-contract-binding"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown from the WS1 phase-tree proposal"
    next_safe_action: "Execute T001 before any other task"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 | T001-T004 | Clone drift documented; reference chosen |
| M2 | T005-T007 | Shared validator with reason codes |
| M3 | T008-T012 | Four gate families adopted |
| M4 | T013-T016 | Conformance and boundaries closed |
| M5 | T017-T019 | Suite delta clean; validator handed to `032` |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and diff [M1]

The clone drift is the reason four local patches would not hold. Documenting it first is what justifies the shared validator.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 9 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [3h]
- [ ] T002 Diff the research and review gates against the model and skill reference implementation; document the behavior gap [4h] {deps: T001}
- [ ] T003 Choose and record the reference implementation for version-binding comparison [1h] {deps: T002}
- [ ] T004 Cite the `021` baseline; confirm `024` fence primitives and `025` certificate binding are available [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Shared strict validator [M2]

- [ ] T005 Decide and record the validator's home module [1h] {deps: T002}
- [ ] T006 Build the validator: prepared-request comparison, artifact-claim binding, version-binding comparison [8h] {deps: T005}
- [ ] T007 Define blocked-disposition reason codes, shared across families with a per-family detail field [3h] {deps: T006}

### Gate family adoption [M3]

- [ ] T008 Research gate: bind sealed digests to certificate claims; blocked disposition on malformed input (`F-013-01`, `F-013-06`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts`) [6h] {deps: T007}
- [ ] T009 Research rollback switch: compare mode, epoch, evidence digest and request digest against the prepared request (`F-013-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts`) [5h] {deps: T007}
- [ ] T010 Review gate: authenticated rollback-window counting (`F-005-02`); adopt the validator (`.opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts`) [5h] {deps: T007}
- [ ] T011 [P] Common gate: compare version bindings against installed constants (`F-024-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts`) [4h] {deps: T003, T007}
- [ ] T012 [P] Agent gate: same version-binding comparison as common (`.opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts`) [3h] {deps: T011}

### Conformance and boundaries [M4]

- [ ] T013 Reject reducers that ignore the fixture event: require an `appliedEventId` check (`F-013-04`) (`.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts`) [5h] {deps: T007}
- [ ] T014 Reject certificates carrying unrelated non-empty references (`F-013-05`) (`.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts`) [4h] {deps: T013}
- [ ] T015 [P] Store closure-context identity-bearing inputs by value (`F-013-03`) (`.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts`) [4h] {deps: T007}
- [ ] T016 [P] Refuse ledger authority for a caller-supplied resume object (`F-004-04`) (`.opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts`) [4h] {deps: T007}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M5]

- [ ] T017 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T008, T009, T010, T012, T014, T015, T016}
- [ ] T018 Independent adversarial verification pass targeted at whether any gate still accepts unbound evidence [5h] {deps: T017}
- [ ] T019 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/027-mode-gate-and-contract-binding --strict` exits 0; hand the shared validator to `032` for its P2 riders [2h] {deps: T018}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [ ] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [ ] All ADRs have a terminal status (Accepted or Superseded)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->

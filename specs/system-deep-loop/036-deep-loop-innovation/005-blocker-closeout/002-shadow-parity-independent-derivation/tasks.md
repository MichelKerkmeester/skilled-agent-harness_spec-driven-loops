---
title: "Tasks: Rebuild Shadow Parity So Both Sides Derive Independently"
description: "Task breakdown for 002-shadow-parity-independent-derivation: confirm-before-build pass over 6 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "shadow parity independent derivation"
  - "blocker 1 parity harness"
  - "harness adapter legacy oracle"
  - "divergence injection test parity"
  - "deep loop 022 parity"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/002-shadow-parity-independent-derivation"
    last_updated_at: "2026-08-17T04:04:40Z"
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

# Tasks: Rebuild Shadow Parity So Both Sides Derive Independently

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
| M1 | T001-T003 | Six protected-surface lists reviewed |
| M2 | T004-T006 | Comparator core with the partial oracle absorbed |
| M3 | T007-T012 | Six adapters return the folded projection |
| M4 | T013-T018 | Six divergence injections proven on both sides |
| M5 | T019-T021 | Suite delta clean; Blocker 1 recorded as discharged |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and enumerate [M1]

The comparator is only as good as the surface list. Enumerating the surface before writing the comparator is what stops the rebuild reproducing the original defect at a finer granularity.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 6 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [2h]
- [ ] T002 Cite the `021` `runtime` baseline and re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test` to confirm it still reproduces. [1h] {deps: T001}
- [ ] T003 Enumerate the protected semantic surface for each of the six modes from the mode contract and reducer projection type, not from the current comparator; review before proceeding. [6h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Comparator core [M2]

- [ ] T004 Build one comparator that diffs a ledger projection against a legacy projection across an enumerated surface (`.opencode/skills/system-deep-loop/runtime/lib/`) [6h] {deps: T003}
- [ ] T005 Absorb `assertLegacyProjectionMatchesCurrentState` into the comparator, converting throw-on-mismatch into a diff result; delete the duplicate path [3h] {deps: T004}
- [ ] T006 Add the import-graph assertion enforcing that no oracle transitively imports the reducer fold (NFR-I01) [3h] {deps: T004}

### Per-mode rebuild [M3]

- [ ] T007 Council: return `folded.projection` as the ledger side; write the independent oracle (`F-006-01`, CONFIRMED) (`.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts`) [6h] {deps: T005}
- [ ] T008 [P] Alignment: derive the legacy side independently of `foldProjection` (`F-006-02`, CONFIRMED) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts`) [6h] {deps: T005}
- [ ] T009 [P] Agent-improvement: stop discarding `folded.projection` (`F-012-01`) (`.opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts`) [4h] {deps: T005}
- [ ] T010 [P] Model-benchmark: stop discarding `folded.projection` (`F-012-02`) (`.opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts`) [4h] {deps: T005}
- [ ] T011 [P] Skill-benchmark: stop discarding `folded.projection` (`F-012-03`) (`.opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts`) [4h] {deps: T005}
- [ ] T012 Deep-review: propagate reducer exceptions and non-`projected` outcomes as parity failures (`F-012-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`) [5h] {deps: T005}

### Divergence injection [M4]

Acceptance is the contrast, not the green run: each injection must be recorded PASSING against the pre-fix adapter and FAILING against the rebuilt one.

- [ ] T013 Council divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts`) [3h] {deps: T007}
- [ ] T014 [P] Alignment divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-shadow-parity.vitest.ts`) [3h] {deps: T008}
- [ ] T015 [P] Agent-improvement divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-shadow-parity.vitest.ts`) [2h] {deps: T009}
- [ ] T016 [P] Model-benchmark divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-shadow-parity.vitest.ts`) [2h] {deps: T010}
- [ ] T017 [P] Skill-benchmark divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-shadow-parity.vitest.ts`) [2h] {deps: T011}
- [ ] T018 Deep-review reducer-exception test: a throwing reducer must produce FAIL, never legacy success (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts`) [3h] {deps: T012}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M5]

- [ ] T019 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline, separating genuine newly-surfaced divergences from regressions [2h] {deps: T013, T014, T015, T016, T017, T018}
- [ ] T020 Independent adversarial verification pass by an actor other than the builder, targeted at oracle independence [5h] {deps: T019}
- [ ] T021 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-shadow-parity-independent-derivation --strict` exits 0; record the Blocker 1 discharge in the `014` unblock table [2h] {deps: T020}
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
- **Source register**: `../001-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->

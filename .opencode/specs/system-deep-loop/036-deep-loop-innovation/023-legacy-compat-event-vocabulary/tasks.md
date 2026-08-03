---
title: "Tasks: Extend the Compatibility Upcasters to the Six Live Event Vocabularies"
description: "Task breakdown for 023-legacy-compat-event-vocabulary: confirm-before-build pass over 6 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "legacy compat event vocabulary"
  - "blocker 2 upcaster coverage"
  - "unknown legacy record migration"
  - "live event vocabulary upcaster"
  - "deep loop 023 compat"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-legacy-compat-event-vocabulary"
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

# Tasks: Extend the Compatibility Upcasters to the Six Live Event Vocabularies

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
| M1 | T001-T004 | Census complete; `manualStop` sub-claim corrected |
| M2 | T005-T007 | Six real captured fixtures with provenance |
| M3 | T008-T014 | Six vocabularies with per-stem dispositions |
| M4 | T015-T018 | Six zero-blocked replays |
| M5 | T019-T021 | Suite delta clean; Blocker 2 recorded as discharged |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and census [M1]

The census is evidence for the mapping work. The operator has ruled that this child writes the six vocabularies; the census does not offer an exit from that.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 6 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [2h]
- [ ] T002 Record the `F-022-02` `manualStop` sub-claim as REFUTED, citing the grep showing it absent at the cited location. Do not carry the sub-claim into the fix. [1h] {deps: T001}
- [ ] T003 Run the legacy-state census: enumerate which legacy state logs exist, for which modes, and which must survive migration. [6h] {deps: T001}
- [ ] T004 Cite the `021` `runtime` baseline and re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test` to confirm it reproduces. [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Capture real fixtures [M2]

- [ ] T005 Enumerate the live stem set per mode from the command assets and the council orchestrator scripts, not from the current mapping [4h] {deps: T003}
- [ ] T006 Capture a real state log per mode from actual command output; record the producing command and run identifier per fixture [6h] {deps: T005}
- [ ] T007 Where a fresh run is impractical, substitute an existing run artifact and record the substitution explicitly [2h] {deps: T006}

### Write the six vocabularies [M3]

- [ ] T008 Research: map or pin `graph_convergence`, `config_warning`, `lock_released` (`F-022-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007}
- [ ] T009 [P] Review: add `graph_convergence`, `claim_adjudication`, `userPaused`, `synthesis_complete` (`F-022-03`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007}
- [ ] T010 Alignment: separate an iteration slice from terminal lane completion (`F-023-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts`) [5h] {deps: T007}
- [ ] T011 Alignment: accept the identity fields the live config emits rather than requiring `runId`/`authorityEpochId` (`F-023-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts`) [3h] {deps: T010}
- [ ] T012 [P] Council: match the live heartbeat shape and register `topic_completed` / `round_completed` (`F-023-03`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007}
- [ ] T013 [P] Skill-benchmark: delegate unmapped stems to the common upcaster, matching the agent and model variants (`F-024-01`) (`.opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007}
- [ ] T014 Record a map-or-pin disposition with a rationale for every stem in all six vocabularies; check every pin against the census [4h] {deps: T008, T009, T011, T012, T013}

### Replay proof [M4]

- [ ] T015 Per mode, replay the captured real log and assert zero `blocked:unknown-legacy-record` [6h] {deps: T014}
- [ ] T016 Multi-slice alignment lane stream: assert the lane does not complete after slice one [3h] {deps: T011}
- [ ] T017 Assert pinned stems are reported as pins with their rationale, never as blocks [2h] {deps: T014}
- [ ] T018 Negative test: an unmapped stem blocks loudly with the stem named, and does not silently drop [2h] {deps: T014}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M5]

- [ ] T019 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T015, T016, T017, T018}
- [ ] T020 Independent adversarial verification pass by an actor other than the builder, targeted at fixture provenance and pin rationales [5h] {deps: T019}
- [ ] T021 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/023-legacy-compat-event-vocabulary --strict` exits 0; record the Blocker 2 discharge in the `014` unblock table [2h] {deps: T020}
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

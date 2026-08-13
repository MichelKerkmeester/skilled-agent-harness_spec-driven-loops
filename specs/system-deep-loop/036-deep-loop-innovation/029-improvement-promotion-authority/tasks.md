---
title: "Tasks: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots"
description: "Task breakdown for 029-improvement-promotion-authority: confirm-before-build pass over 13 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "improvement promotion authority"
  - "promotion acceptance receipt binding"
  - "council persistence packet root"
  - "stale score authorizes promotion"
  - "deep loop 029 promotion"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/029-improvement-promotion-authority"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "All 13 implementation findings landed across 0d1827eef5 and f6cdf604a2"
    next_safe_action: "Reconcile task evidence against the landed SHAs before checking any task complete"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots

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
| M1 | T001-T005 | Baselines captured; receipt contents fixed |
| M2 | T006-T008 | Receipt-bound promotion and ship |
| M3 | T009-T011 | Rollback and evaluator identity bound |
| M4 | T012-T014 | Containment and approval |
| M5 | T015-T019 | Council confined; parse gates fail closed |
| M6 | T020-T022 | Deltas clean; independent pass recorded |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-exec -->
## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] `spec.md` scope unchanged
2. [ ] Current phase identified in `plan.md`
3. [ ] Task dependencies satisfied
4. [ ] Relevant P0/P1 `checklist.md` items identified
5. [ ] No blocking issues in `decision-record.md`

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against its acceptance criteria |
| TASK-DOC | Update status and evidence immediately on completion |

### Status Reporting Format
```
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [test name + suite digest + candidate SHA]
- **Next**: T### - [Next task]
```

### Blocked Task Protocol
A task marked `[B]` records its blocker inline and is not started until the blocker clears.
<!-- /ANCHOR:ai-exec -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm, baseline and design [M1]

Promotion copies bytes into canonical targets. Every test in this child runs against a fixture target tree, never the real one.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 13 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. Carry the severity calibration: the actor is the operator or a stale local file. (`spec.md` §3 scope table) [4h]
- [ ] T002 [P] Capture the improvement baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs`. Record discovered, pass, fail, skip, exit code and SHA. [1h] {deps: T001}
- [ ] T003 [P] Capture the council baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs`. [1h] {deps: T001}
- [ ] T004 Fix the acceptance receipt contents in ADR-001: evidence digests, paths, target preimage, candidate snapshot, evaluator epoch, approval identity [4h] {deps: T001}
- [ ] T005 Choose and record the evaluator identity authority the candidate cannot control [2h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Acceptance receipt [M2]

- [ ] T006 Implement the authenticated append-only acceptance receipt (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/`) [10h] {deps: T004}
- [ ] T007 Promotion checks `score.candidate`, `score.target` and `score.inputHash` against the receipt (`F-017-01`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [6h] {deps: T006}
- [ ] T008 Ship verifies against the receipt rather than fields inside the mutable acceptance JSON (`F-017-03`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [6h] {deps: T007}

### Rollback and evaluator identity [M3]

- [ ] T009 Rollback accepts only the recorded promoted-candidate hash (`F-017-04`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs`) [5h] {deps: T006}
- [ ] T010 Direct rollback records a pre-promotion hash before copying (`F-008-03`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs`) [4h] {deps: T009}
- [ ] T011 Evaluator profile and `agentName` come from the chosen authority, not candidate frontmatter (`F-017-05`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs`) [6h] {deps: T005}

### Containment and approval [M4]

- [ ] T012 Contain candidate, archive, acceptance, event log and state write boundaries, not only the target (`F-017-02`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [7h] {deps: T007}
- [ ] T013 Autonomous mode advisory-only or receipt-bound; flag presence is not approval (`F-021-01`) (`.opencode/skills/system-deep-loop/commands/deep/assets/deep-model-benchmark-auto.yaml`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [6h] {deps: T007}
- [ ] T014 REMEDIATE requires authorization at both the CLI and the module boundary (`F-021-02`) (`.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs`) [4h] {deps: T001}

### Council persistence and parse gates [M5]

- [ ] T015 Confine council persistence to an authorized packet root (`F-019-01`) (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`) [6h] {deps: T012}
- [ ] T016 Reject topic IDs that can escape the packet, before any `mkdir` (`F-019-02`) (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-{topic,session}.cjs`) [4h] {deps: T015}
- [ ] T017 [P] Confine `--memory-save-payload-out` (`F-019-03`) (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`) [3h] {deps: T015}
- [ ] T018 [P] Non-finite and absent score, delta and aggregate fields fail closed (`F-008-01`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [4h] {deps: T007}
- [ ] T019 [P] A text-less event stream is unscorable rather than scored as raw event JSON (`F-008-02`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs`) [4h] {deps: T001}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M6]

- [ ] T020 Re-run both vitest projects; report deltas against the T002 and T003 baselines [2h] {deps: T008, T010, T011, T013, T014, T016, T017, T018, T019}
- [ ] T021 Independent adversarial verification pass targeted at whether any promotion path still trusts a mutable local file [6h] {deps: T020}
- [ ] T022 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/029-improvement-promotion-authority --strict` exits 0; record the improvement-lane gate for `014` [2h] {deps: T021}
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

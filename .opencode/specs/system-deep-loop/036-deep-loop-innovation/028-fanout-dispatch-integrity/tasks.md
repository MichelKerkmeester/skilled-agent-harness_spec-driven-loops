---
title: "Tasks: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced"
description: "Task breakdown for 028-fanout-dispatch-integrity: confirm-before-build pass over 12 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "fanout dispatch integrity"
  - "fanout fulfillment artifact contract"
  - "write containment dirty path"
  - "executor audit provenance"
  - "deep loop 028 fanout"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity"
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

# Tasks: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced

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
| M1 | T001-T004 | Worktree, classification, and enumerations |
| M2 | T005-T007 | Artifact-contract fulfillment |
| M3 | T008-T010 | Provenance durable and distinguishable |
| M4 | T011-T016 | Uniform containment and argv dispatch |
| M5 | T017-T020 | Sink allowlisted; delta clean |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm, isolate and enumerate [M1]

Blast-radius rule: every dispatch test in this child runs in an isolated worktree. `F-016-02` was observed live reverting 15 untracked files belonging to a concurrent session.

- [ ] T001 Set up an isolated git worktree before any dispatch work; record the path [1h]
- [ ] T002 **CONFIRM BEFORE BUILD.** For each of the 12 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. Line anchors here are among the most likely to have drifted: §5 records that a concurrent session was editing executor configuration and fan-out code during the review. (`spec.md` §3 scope table) [4h] {deps: T001}
- [ ] T003 Enumerate existing lineage artifact shapes so the contract does not reject genuine historical lineages [4h] {deps: T002}
- [ ] T004 Enumerate wrapper shell usage so argv dispatch does not silently remove a relied-on feature [3h] {deps: T002}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Artifact contract [M2]

- [ ] T005 Define the per-mode artifact contract and decide where it lives (registry versus per-asset) [5h] {deps: T003}
- [ ] T006 Validate state JSONL, iteration records, deltas, findings registry and terminal synthesis before fulfilling a lineage (`F-010-01`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [10h] {deps: T005}
- [ ] T007 Derive iteration counts from actual iteration files rather than a synthesis self-report (`F-010-02`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [6h] {deps: T006}

### Provenance [M3]

- [ ] T008 Carry `effectiveConfig` and `invocationFingerprint` through to the worker (`F-010-03`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [4h] {deps: T006}
- [ ] T009 Record sandbox mode, timeout, web-search policy, config dir, governor and executable identity in the audit (`F-010-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`) [5h] {deps: T008}
- [ ] T010 Assert audit distinctness for materially different invocations in the existing receipts suites (`.opencode/skills/system-deep-loop/runtime/tests/executor-audit-*.test.ts`) [4h] {deps: T009}

### Containment and dispatch [M4]

- [ ] T011 Reject sandbox modes a dispatch kind cannot enforce, instead of recording them as effective (`F-016-03`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [5h] {deps: T006}
- [ ] T012 Stop hardcoding permission bypass in native dispatch; honour the computed sandbox mode (`F-016-02`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [6h] {deps: T011}
- [ ] T013 Run post-dispatch containment for every kind, not only `cli-codex` (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`) [6h] {deps: T012}
- [ ] T014 Detect dirty-path truncation by content identity rather than exempting by pathname (`F-016-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`) [5h] {deps: T013}
- [ ] T015 Hard-fail an out-of-worktree artifact scope instead of returning an empty violation list (`F-016-05`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`) [3h] {deps: T013}
- [ ] T016 Move fan-out wrappers to argv dispatch (`F-016-01`, calibrated) and filter the standalone Codex environment (`F-016-06`) (`.opencode/skills/system-deep-loop/commands/deep/assets/`, `.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs`) [8h] {deps: T004}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Sink and gate [M5]

- [ ] T017 Allowlist the persisted observability payload; redact or reject credential-shaped keys and prompt or error text in nested payloads (`F-020-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs`) [5h] {deps: T009}
- [ ] T018 Stop interpolating raw lineage labels onto stderr for the three loud events (`F-020-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs`) [2h] {deps: T017}
- [ ] T019 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test` including the receipts suites; report the delta against the `021` baseline [3h] {deps: T007, T010, T014, T015, T016, T018}
- [ ] T020 Independent adversarial verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity --strict` exits 0 [6h] {deps: T019}
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

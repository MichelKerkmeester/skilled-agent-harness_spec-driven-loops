---
title: "Tasks: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots"
description: "Task breakdown for 007-improvement-promotion-authority: confirm-before-build pass over 13 scoped review findings, then the fix work units, then the delta-reported verification gate."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/007-improvement-promotion-authority"
    last_updated_at: "2026-08-15T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the 13-finding runtime scope; 18 of 22 tasks are complete"
    next_safe_action: "Full baseline, independent verification, main validation"
    blockers:
      - "T002 baseline was not captured for the entire improvement project before edits"
      - "T021 requires a different actor"
      - "T022 requires a complete main-checkout validator environment"
    key_files:
      - "tasks.md"
    completion_pct: 82
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

- [x] T001 **CONFIRM BEFORE BUILD.** For each of the 13 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. Carry the severity calibration: the actor is the operator or a stale local file. (`spec.md` §3 scope table) [4h]
- [ ] T002 [P] Capture the improvement baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs`. Record discovered, pass, fail, skip, exit code and SHA. [1h] {deps: T001}
- [x] T003 [P] Capture the council baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs`. [1h] {deps: T001}
- [x] T004 Fix the acceptance receipt contents in ADR-001: evidence digests, paths, target preimage, candidate snapshot, evaluator epoch, approval identity [4h] {deps: T001} [Evidence: `promotion receipt authority > authenticates the decided authority fields and evidence bindings`; suite SHA-256 `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`]
- [x] T005 Choose and record the evaluator identity authority the candidate cannot control [2h] {deps: T001} [Evidence: `score-candidate evaluator authority > ignores candidate frontmatter when selecting evaluator identity and rubric source`; suite SHA-256 `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Acceptance receipt [M2]

- [x] T006 Implement the authenticated append-only acceptance receipt (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/`) [10h] {deps: T004}
- [x] T007 Promotion checks `score.candidate`, `score.target` and `score.inputHash` against the receipt (`F-017-01`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [6h] {deps: T006}
- [x] T008 Ship verifies against the receipt rather than fields inside the mutable acceptance JSON (`F-017-03`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [6h] {deps: T007}

### Rollback and evaluator identity [M3]

- [x] T009 Rollback accepts only the recorded promoted-candidate hash (`F-017-04`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs`) [5h] {deps: T006}
- [x] T010 Direct rollback records a pre-promotion hash before copying (`F-008-03`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs`) [4h] {deps: T009}
- [x] T011 Evaluator profile and `agentName` come from the chosen authority, not candidate frontmatter (`F-017-05`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs`) [6h] {deps: T005}

### Containment and approval [M4]

- [x] T012 Contain candidate, archive, acceptance, event log and state write boundaries, not only the target (`F-017-02`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [7h] {deps: T007}
- [x] T013 Autonomous mode advisory-only or receipt-bound; flag presence is not approval (`F-021-01`) (`.opencode/skills/system-deep-loop/commands/deep/assets/deep-model-benchmark-auto.yaml`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [6h] {deps: T007}
- [x] T014 REMEDIATE requires authorization at both the CLI and the module boundary (`F-021-02`) (`.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs`) [4h] {deps: T001}

### Council persistence and parse gates [M5]

- [x] T015 Confine council persistence to an authorized packet root (`F-019-01`) (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`) [6h] {deps: T012}
- [x] T016 Reject topic IDs that can escape the packet, before any `mkdir` (`F-019-02`) (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-{topic,session}.cjs`) [4h] {deps: T015}
- [x] T017 [P] Confine `--memory-save-payload-out` (`F-019-03`) (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`) [3h] {deps: T015}
- [x] T018 [P] Non-finite and absent score, delta and aggregate fields fail closed (`F-008-01`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`) [4h] {deps: T007}
- [x] T019 [P] A text-less event stream is unscorable rather than scored as raw event JSON (`F-008-02`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs`) [4h] {deps: T001}

### T001 Finding Classification and Probe Ledger

Severity remains calibrated as an operator/stale-local-file robustness risk, not a remote-attacker incident. `HEAD` before this task was `149742c46260277ae26df6fe6cfe582a9d02454d`. The affected-test aggregate suite-content SHA-256 is `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`. The sandbox denied writes to the shared Git index, so these working-tree changes do not yet have a candidate commit SHA; checklist items that require one remain open.

| Finding | HEAD classification | Final disposition | Named probe |
|---------|---------------------|-------------------|-------------|
| `F-021-01` | `CONFIRMED` | `IMPLEMENTED-NOW` | `autonomous promotion authority > is advisory-only and cannot invoke a canonical promotion command` |
| `F-021-02` | `ALREADY-FIXED` | `CONFIRMED-WAS-LANDED` | `REMEDIATE requires confirmation at both module and CLI boundaries` |
| `F-017-01` | `CONFIRMED` | `IMPLEMENTED-NOW` | `rejects a stale approval receipt after the candidate bytes change`; `rejects an approval receipt issued for a different candidate`; `rejects an approval receipt issued for a different target` |
| `F-017-02` | `CONFIRMED` | `IMPLEMENTED-NOW` | `rejects an uncontained %s before creating output` (candidate, archive, acceptance, event-log, state matrix) |
| `F-017-03` | `CONFIRMED` | `IMPLEMENTED-NOW` | `rejects a forged acceptance JSON that has no authenticated receipt` |
| `F-017-04` | `CONFIRMED` | `IMPLEMENTED-NOW` | `refuses a forged acceptance file with no receipt, even when the OR hash guard would pass`; `refuses an acceptance file that drifted from its issued receipt` |
| `F-017-05` | `CONFIRMED` | `IMPLEMENTED-NOW` | `ignores candidate frontmatter when selecting evaluator identity and rubric source`; `fails closed when no evaluator authority manifest is supplied` |
| `F-019-01` | `CONFIRMED` | `IMPLEMENTED-NOW` | `refuses a caller-selected packet root outside configured authority before mkdir` |
| `F-019-02` | `CONFIRMED` | `IMPLEMENTED-NOW` | `rejects unsafe topic id %s before creating any topic directory` |
| `F-019-03` | `CONFIRMED` | `IMPLEMENTED-NOW` | `rejects a payload output outside the authorized council root` |
| `F-008-01` | `ALREADY-FIXED` | `CONFIRMED-WAS-LANDED`; coverage expanded | `rejects an absent or non-numeric benchmark aggregate %j`; `rejects an infinite benchmark aggregate`; `rejects an absent or non-finite agent %s value %j` |
| `F-008-02` | `ALREADY-FIXED` | `CONFIRMED-WAS-LANDED`; parser hardened | `marks a successful textless JSONL stream unscorable without throwing` |
| `F-008-03` | `CONFIRMED` | `IMPLEMENTED-NOW` | `rejects a backup whose bytes no longer match the authenticated rollback binding` |

### Runner Evidence

| Runner | Before | Final observed state | Status |
|--------|--------|----------------------|--------|
| Council project | 10 files; 109 passed, 2 failed; exit 1 | 10 files; 118 passed, 0 failed; exit 0 | T003 complete; both original failures fixed |
| Promotion-authority affected matrix | Partial baseline: 7 files; 29 passed, 2 failed, 15 skipped; exit 1 | 8 files; 52 passed; exit 0, plus sweep 2 files/25 passed/exit 0 and REMEDIATE 2 passed/exit 0 | Implementation gate green; not a valid full-project T002 baseline |
| Full improvement project | No valid pre-edit full-project baseline | 52 files; 530 passed, 45 failed; exit 1; failure paths are outside this packet, but pre-existence was not proven by a full base run | T002/T020 remain open; no false delta or pre-existing-failure claim |
| TypeScript | Not captured | `tsc --noEmit --ignoreDeprecations 6.0`: exit 0 | Green |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M6]

- [ ] T020 Re-run both vitest projects; report deltas against the T002 and T003 baselines [2h] {deps: T008, T010, T011, T013, T014, T016, T017, T018, T019}
- [ ] T021 Independent adversarial verification pass targeted at whether any promotion path still trusts a mutable local file [6h] {deps: T020}
- [ ] T022 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/007-improvement-promotion-authority --strict` exits 0; record the improvement-lane gate for `014` [2h] {deps: T021}
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

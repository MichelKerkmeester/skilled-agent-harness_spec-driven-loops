---
title: "Acceptance Criteria: Phase 2: persisted-loop-state-and-failure-policy"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "persisted loop state and failure policy acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/002-persisted-loop-state-and-failure-policy"
    last_updated_at: "2026-11-14T11:33:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-persisted-loop-state-and-failure-policy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: persisted-loop-state-and-failure-policy

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `004-workflow-logic-hardening/002-persisted-loop-state-and-failure-policy`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fix is applied, When `convergence.cjs` is required, Then `deriveLoopCounters` is a function that returns `stuckCount` and `consecutiveFailureCount` | `node -e "console.log(typeof require('./.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs').deriveLoopCounters)"` prints `function`. Observed: printed `function`. Evidence at `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1287`. | Met | - |
| AC-002 | REQ-002 | Given the four workflow files, When they are searched for in-memory stuck updates, Then none remain | `rg -n -e 'stuck_count: 0' -e 'stuck_count \+ 1' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing. Observed: the `rg` prints nothing, exit 1. Evidence at `.skilled/commands/deep/assets/deep-research-auto.yaml:771`. | Met | - |
| AC-003 | REQ-003 | Given a pass after an iteration row is appended, When `step_graph_convergence` runs, Then each workflow binds `stuck_count` and `consecutive_failure_count` from `loop_counters_json` | `rg -c 'loop_counters' .skilled/commands/deep/assets/deep-re*.yaml` prints a count for each of the four files. The append-last case in `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts` passes. Observed: 5 for each of the four files, and `-t 'appended last'` reports 1 passed. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:173`. | Met | - |
| AC-004 | REQ-004 | Given both review files, When `step_read_state` binds the severity counters, Then it reads `findingsBySeverity` and no accumulate line remains | `rg -c 'Accumulate from severity_counts' .skilled/commands/deep/assets/deep-review-*.yaml` prints nothing. Observed: the `rg` prints nothing, and `findingsBySeverity` appears 4 times in each review file. Evidence at `.skilled/commands/deep/assets/deep-review-auto.yaml:697`. | Met | - |
| AC-005 | REQ-005 | Given one fixture state log, When `deriveLoopCounters` reads it whole and reads a prefix followed by the remaining records, Then both calls return equal counters | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t resume` exits 0. Observed: 1 passed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:114`. | Met | - |
| AC-006 | REQ-006 | Given a research fixture log with four failed iterations, When the vote runs, Then it does not return a converged stop | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t 'four failed'` exits 0. Observed: 2 passed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:292`. | Met | - |
| AC-007 | REQ-007 | Given a review fixture log with four failed iterations, When the review ratio signals run, Then the rolling average and the MAD noise floor are unchanged by the failed rows | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t review` exits 0. Observed: 3 passed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:329`. | Met | - |
| AC-008 | REQ-008 | Given a log whose latest rows are `error` and `timeout`, When `deriveLoopCounters` runs, Then `stuckCount` equals its value before those rows | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t stuck` exits 0. Observed: 5 passed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:136`. | Met | - |
| AC-009 | REQ-009 | Given three trailing failed runs, When the stop check runs, Then `consecutiveFailureCount` is 3, each auto workflow halts with stop reason `error` and enters synthesis with no question, and each confirm workflow asks Retry / Skip / Cancel before synthesis | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t consecutive` exits 0, `rg -c 'After 3 consecutive failed iterations' .skilled/commands/deep/assets/deep-re*.yaml` prints a count for each of the four files and `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` prints a count for each of the two files. Observed: 2 passed, exit 0, 1 for each of the four files and 1 for each confirm file. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:150`. | Met | - |
| AC-010 | REQ-010 | Given the four workflow files, When they are searched for the failure wordings, Then the old wordings are gone and the Retry / Skip / Cancel gate appears only in the two confirm files | `rg -c -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing, `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` prints a count for each of the two files and `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml` prints nothing. Observed: the first `rg` prints nothing, the second prints 1 per confirm file and the third prints nothing. Evidence at `.skilled/commands/deep/assets/deep-research-confirm.yaml:813`. | Met | - |
| AC-011 | REQ-011 | Given the four workflow files, When they are searched for the model-written dashboard step, Then none remain and a reducer run still writes the dashboard | `rg -c 'step_generate_dashboard' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing and the reducer tests in `deep-research-reduce-state.vitest.ts` pass. Observed: the `rg` prints nothing, and `deep-research-reduce-state.vitest.ts` passes inside a three-file run of 52 passed. Evidence at `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2871`. | Met | - |
| AC-012 | REQ-012 | Given one research fixture log, When the reducer renders the dashboard, Then its stuck count equals `deriveLoopCounters(records).stuckCount` | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t dashboard` exits 0. Observed: 1 passed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:627`. | Met | - |
| AC-013 | REQ-013 | Given the edited workflow files, When the contracts are regenerated, Then the drift check passes for both commands | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research` and the same with `deep/review` exit 0. Observed: both print `[CONTRACT DRIFT] OK commands=1` and exit 0. Evidence at `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:1`. | Met | - |
| AC-014 | REQ-014 | Given the finished change, When the whole runtime suite runs, Then it passes | `npm --prefix .skilled/skills/system-deep-loop/runtime test` exits 0. Observed: 176 test files, 3002 passed, 8 skipped, 0 failed, exit 0 (baseline 175 files and 2986 passed, plus 16 new tests). Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:102`. | Met | - |
| AC-015 | REQ-015 | Given a log whose latest recovery event follows two low-novelty iterations, When `deriveLoopCounters` runs, Then `stuckCount` counts only the iterations after that event | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t recovery` exits 0. Observed: 2 passed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:187`. | Met | - |
| AC-016 | REQ-016 | Given no coverage-graph database exists, When `convergence.cjs --state-log` runs, Then it prints `loop_counters_json`, and each workflow halts with stop reason `error` when the field is missing | `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t 'no graph'` exits 0 and `rg -c 'loop_counters_json is missing' .skilled/commands/deep/assets/deep-re*.yaml` prints a count for each of the four files. Observed: 1 passed, exit 0, and 1 for each of the four files. The field is printed under `--stop-decision`, which every workflow passes with `--state-log`. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:497`. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Yes. Every criterion is met, with the observed result written in its Verification cell.
<!-- /ANCHOR:closure -->

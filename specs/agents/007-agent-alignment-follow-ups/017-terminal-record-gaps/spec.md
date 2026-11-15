---
title: "Feature Specification: Phase 17: terminal-record-gaps"
description: "Two deep-review stop paths still reach a report without a verdict from the terminal gate record. The 120-minute duration stop jumps to synthesis without writing the record, and the four manual stops skip the steps that read it and derive the verdict. This phase closes both."
trigger_phrases:
  - "terminal record gaps"
  - "phase 17 terminal record gaps"
  - "maxDurationReached terminal gate record"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: terminal-record-gaps

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-follow-up-fix-sweep |
| **Successor** | None |
| **Handoff Criteria** | Every path into synthesis writes the terminal gate record and runs the verdict step, the runtime suite shows no failure the baseline lacks, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the agent alignment follow-ups. It closes the two gaps the merge-port review of 016 found on upstream main and recorded as known limitations.

**Scope Boundary**: The duration stop and the four manual-stop exits in `deep-review.yaml`, and the stop-reason enum of the terminal gate record. No other stop path changes.

**Dependencies**:
- 016's terminal record, stop-reason pass-through and reducer (origin/main `e85ca894b9a`)

**Deliverables**:
- The duration stop writes the terminal gate record with stop reason `maxDurationReached`
- Every manual stop runs the summary and verdict steps before the pre-synthesis gate
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the 120-minute default, `step_check_max_duration` jumps to `phase_synthesis` at `deep-review.yaml:903` without writing the terminal gate record. The verdict step then reads an older record or none, so a long review can report PASS while a required gate fails. The four manual-stop exits (lines 1253, 1297, 1411, 1795) jump to `gate_pre_synthesis`, which skips `step_hydrate_summary_metrics` and `step_derive_verdict`, so their record is written but never turned into a verdict.

### Purpose
Every deep-review run that reaches synthesis gets its verdict from a terminal gate record that names its real stop reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n 'skip_to: phase_synthesis' .skilled/commands/deep/assets/deep-review.yaml
587:          skip_to: phase_synthesis
903:          skip_to: phase_synthesis
1300:                  skip_to: phase_synthesis
1304:              skip_to: phase_synthesis
1308:            skip_to: phase_synthesis
$ rg -n 'skip_to: gate_pre_synthesis|proceed_to: gate_pre_synthesis' .skilled/commands/deep/assets/deep-review.yaml
1253:                      skip_to: gate_pre_synthesis
1297:                      skip_to: gate_pre_synthesis
1411:        on_C: { set: { reason: "manualStop" }, run_first: record_terminal_gates, proceed_to: gate_pre_synthesis }
1795:        on_C: { set: { reason: "manualStop" }, run_first: record_terminal_gates, proceed_to: gate_pre_synthesis }
$ sed -n 387p .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts
  readonly stopReason: 'converged' | 'maxIterationsReached' | 'manualStop' | 'error';
$ sed -n 353p .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts
    stopReason: enumRule('converged', 'maxIterationsReached', 'manualStop', 'error'),
```
Line 903 is the duration stop, the only jump that writes no record. Lines 587, 1300, 1304 and 1308 reuse or write one.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `maxDurationReached` to the terminal record's stop-reason enum, in the type and the schema rule (operator answer 2026-11-15: "Add maxDurationReached").
- Run `record_terminal_gates` on the duration stop before it jumps to synthesis, and pass `maxDurationReached` through the stop-reason rule.
- Send the four manual-stop exits to `phase_synthesis` instead of `gate_pre_synthesis`, so the summary and verdict steps run first (operator answer: "Fix it").
- Update the record's `when:` text to name the duration stop.

### Out of Scope
- Other stop reasons such as `userPaused`, `blockedStop` and `stuckRecovery`. They never reach the record: a pause halts first, and a manual stop sets `reason` to `manualStop`.
- Changing the reducer: a passing `maxDurationReached` record already gives outcome `active`, because only a `converged` stop is marked converged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | Modify | Add `maxDurationReached` to `stopReason` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Modify | Add `maxDurationReached` to the enum rule |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Duration stop records the gates; stop-reason rule; manual stops route through the verdict step |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | Source digest |
| `runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Modify | Accept case for `maxDurationReached` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The terminal record accepts `stopReason` `maxDurationReached`. |
| REQ-002 | The duration stop writes the terminal record with stop reason `maxDurationReached` before it enters synthesis. |
| REQ-003 | Every manual stop runs `step_hydrate_summary_metrics` and `step_derive_verdict` before `gate_pre_synthesis`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The record's `when:` text and stop-reason rule name the duration stop, and the compiled contract matches. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `(cd .skilled/skills/system-deep-loop/runtime && npm test)` shows no failure the baseline lacks, and the new schema case passes.
- **SC-002**: `rg -n 'gate_pre_synthesis' .skilled/commands/deep/assets/deep-review.yaml` shows no `skip_to` or `proceed_to` into it from a manual stop.
- **SC-003**: `check-contract-drift.cjs` prints `OK`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 016's terminal record and reducer | Both fixes extend it | Built on origin/main `e85ca894b9a` |
| Risk | Widening the enum changes a frozen schema | Low | Consumers pass `stopReason` through as a string; the census and parity suites rerun |
| Risk | A manual stop through `phase_synthesis` runs `step_fanout_merge` | Low | It is skipped when the run has no fan-out, and with fan-out it binds the merged counts the verdict needs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: no runtime path changes its cost; each fix is an enum value or a jump target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A duration stop with every gate passing: the record says `maxDurationReached`, the reducer outcome is `active`, and the verdict follows the findings.
- A manual stop with a failing gate: the verdict step reads the new record and returns FAIL.
- A confirm run that returns to the loop after `gate_pre_synthesis` and stops again: the newest record wins, as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Four files, small edits |
| Risk | 7/25 | A schema enum widening; workflow jump targets |
| Research | 2/20 | Done by the merge-port review |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose `maxDurationReached` as a new stop reason and the manual-stop route fix on 2026-11-15.
<!-- /ANCHOR:questions -->

---

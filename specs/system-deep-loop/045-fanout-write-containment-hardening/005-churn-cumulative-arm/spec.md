---
title: "Feature Specification: Give the shared-checkout churn detector a cumulative arm so slow drift trips it"
description: "The churn detector only counted newly dirty paths per heartbeat window, so a neighbour dirtying one path per heartbeat never crossed the threshold no matter how long it kept going. A running total across heartbeats trips on that shape while the per-window burst arm stays exactly as it was."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give the shared-checkout churn detector a cumulative arm so slow drift trips it

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-14 |
| **Branch** | `scaffold/005-churn-cumulative-arm` |
| **Parent** | `../spec.md` |
| **Predecessor** | `../004-index-lock-retry/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The churn detector compared each heartbeat's newly dirty out-of-lineage paths against a per-window threshold and forgot them immediately after. A second writer that dirtied one path per heartbeat, or a handful spread across minutes, never exceeded three in any single window, so the detector could sample for an hour and never see a neighbour that was slowly rewriting the checkout around the lane.

### Purpose
Keep a running total of newly dirty out-of-lineage paths across the lane's heartbeats and trip on it as well, so slow cumulative churn is a detection the same way a burst is, without lowering the per-window count into false positives.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A cumulative count inside the existing churn sampler, tripping on its own threshold beside the per-window one
- One new fan-out config field, `containment.churnCumulativeThreshold`, non-negative integer, default 12, zero disabling that arm
- Two ledger fields on `shared_checkout_detected`: `cumulative_dirty_paths` and `churn_cumulative_threshold`
- A stub-lane test that trips the cumulative arm where the burst arm cannot, and a config test for the default and the rejected values

### Out of Scope
- The per-window arm and its default - unchanged by this phase
- The latch - a detection of either kind still forces preserve for the remainder of the run and is final
- A CLI flag for the new threshold - none exists for `churnThreshold` either, so the config route is mirrored rather than extended
- The parent packet's stated defaults - see the deviation note in section 4

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `startSharedCheckoutChurnDetector` gains the cumulative total and its threshold; the runner resolves the new config value and writes the two new ledger fields |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `containment.churnCumulativeThreshold` added to the schema, its prefault literal and the `FanoutConfig` type |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | The churn fixture gains a spread write mode; one new case trips the cumulative arm |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | One new case for the default, zero, an explicit value and the two rejected shapes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The detector keeps a running total of newly dirty out-of-lineage paths across heartbeats and trips when that total exceeds `churnCumulativeThreshold`. The per-window trip (`newlyDirty` greater than `churnThreshold`) is unchanged, and both counts are computed from the same sample so the two arms never disagree about what a window held. |
| REQ-002 | `containment.churnCumulativeThreshold` is a non-negative integer that defaults to 12 and is settable per run through the fan-out config. Zero disables the cumulative arm; zero on both thresholds disables sampling entirely. |
| REQ-003 | A cumulative detection latches preserve for the remainder of the run and stops sampling, exactly as a burst detection does. The `shared_checkout_detected` event keeps every existing field and gains `cumulative_dirty_paths` and `churn_cumulative_threshold`; both counts are reported whichever arm fired. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The cumulative arm is proven where the burst arm cannot fire: a stub lane dirtying one new path per heartbeat across more windows than the threshold trips the detector, and that case fails against the burst-only detector. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Deviation from the parent packet

The parent's REQ-004 and its plan state twelve newly dirty paths per window and forty cumulative. The code has shipped a per-window default of three since the detector landed, and this phase's directive fixes the cumulative default at twelve. The parent packet's numbers are not what the code uses, and reconciling that text is outside this phase's write authority; the values that actually ship are stated in REQ-001 through REQ-003 above and in `implementation-summary.md`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A neighbour dirtying one new path per heartbeat for more heartbeats than the cumulative threshold trips the detector, with no window ever above the per-window threshold
- **SC-002**: A burst above the per-window threshold still trips within one window and still latches preserve
- **SC-003**: The two touched test files and the runtime typecheck exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ordinary slow drift on a busy working tree accumulates past twelve and forces preserve for a lane that has no neighbour | L | Twelve is well above the trickle a working tree produces on its own, and the failure direction is the safe one: preserve leaves every byte in place, and zero disables the arm |
| Risk | A path that goes clean and comes back counts again toward the total | L | That is churn by definition; a writer that keeps touching paths is what the arm exists to notice, and the event reports the total so the shape is visible on the ledger |
| Dependency | The containment snapshot | Green | Reused unchanged; the detector takes no new input, runs no new command, and adds one integer per sample |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Sampling cost is unchanged; the arm adds one integer compare per heartbeat

### Security
- **NFR-S01**: No new process, path or credential is introduced; the arm reads the same snapshot the guard already reads

### Reliability
- **NFR-R01**: A sampling error still ends sampling and never fails the lane; the cumulative total cannot turn a detector fault into a lane fault
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The baseline sample contributes zero: the first sample only establishes what was already dirty
- A long-lived dirty path never counts twice while it stays dirty; it must leave the sample and return to count again
- Zero on one arm leaves the other sampling; zero on both returns the no-op sampler

### Error Scenarios
- Unreadable tree: sampling ends, the lane is untouched, and no event is written
- A ledger write failure cannot leave the destructive mode armed: preserve is set before the append, as before

### State Transitions
- Detection is final: the total stops advancing and no later quiet sample can un-prove the writer
- Partial completion: a lane that detects mid-flight keeps running and only its remedy changes
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two runtime files, two test files, one config field |
| Risk | 8/25 | The detector can force preserve; it never restores, so the failure direction is the safe one |
| Research | 4/20 | The design question was which count sees slow churn without lowering the per-window bar |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


---
title: "Fixed-Rate Cadence and Overrun/Skipped Accounting"
description: "Measure slot duration from run-start time in fanout-run.cjs and persist a skippedCount when an iteration overruns its scheduled interval, preserving single-flight semantics."
trigger_phrases:
  - "fixed-rate overrun accounting"
  - "loop cadence overrun"
  - "skipped slot count"
  - "fanout overrun skippedCount"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/010-fixed-rate-overrun-accounting"
    last_updated_at: "2026-06-28T14:01:59Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-fixed-rate-overrun-accounting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Fixed-Rate Cadence and Overrun/Skipped Accounting

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 18 |
| **Predecessor** | 009-byte-offset-log-regions |
| **Successor** | 011-convergence-score-delta |
| **Handoff Criteria** | `skippedCount` persisted in state when overrun occurs; `slotDurationMs` measured with monotonic clock; backlog catch-up explicitly absent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the deep-loop-runtime recs specification.

**Scope Boundary**: Changes confined to `fanout-run.cjs` elapsed-time measurement and `deep_research_auto.yaml` schema; no changes to convergence, lock, or post-dispatch-validate modules.

**Dependencies**:
- Requires access to `process.hrtime` (Node.js built-in) for monotonic elapsed measurement; no external dependencies added.

**Deliverables**:
- Elapsed slot duration measured from run-start using `process.hrtime` in `fanout-run.cjs`.
- `skippedCount` computed as the number of missed fixed-rate slots when elapsed > interval, persisted to state metadata.
- `deep_research_auto.yaml` updated with `skippedCount` and `slotDurationMs` optional fields.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a loop iteration overruns its scheduled fixed-rate slot, the next slot starts immediately without any record of the overrun; missed slots are silently dropped and there is no `skippedCount` in the persisted state. This makes it impossible to diagnose runaway iterations or distinguish an intentionally fast loop from one that is perpetually behind its cadence.

### Purpose
Record `skippedCount` (missed fixed-rate slots, not a replay backlog) and `slotDurationMs` on each iteration so operators can detect and diagnose overrun patterns without risking concurrent double-dispatch from catch-up logic.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture `hrStart = process.hrtime()` at the beginning of each iteration slot in `fanout-run.cjs`.
- After iteration completes, compute `elapsedMs` using `process.hrtime(hrStart)` and derive `skippedCount = Math.floor(elapsedMs / intervalMs) - 1` (clamped to 0 when not overrun).
- Persist `skippedCount` and `slotDurationMs` to the iteration's state metadata entry.
- Add optional `skippedCount` (integer) and `slotDurationMs` (number) field definitions to `deep_research_auto.yaml`.

### Out of Scope
- Backlog catch-up (replaying missed slots) — explicitly deferred because it risks concurrent double-dispatch and violates single-flight semantics.
- Changes to convergence, lock, or post-dispatch-validate modules — outside this phase's blast radius.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Add monotonic elapsed measurement and `skippedCount`/`slotDurationMs` persistence |
| `.opencode/skills/deep-loop-runtime/deep_research_auto.yaml` | Modify | Add optional `skippedCount` and `slotDurationMs` field definitions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `fanout-run.cjs` measures slot elapsed time using `process.hrtime` (monotonic) and persists `skippedCount` and `slotDurationMs` when an iteration completes | State file after a simulated overrun contains `skippedCount >= 1` and a positive `slotDurationMs`; fast iterations produce `skippedCount: 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No missed-slot catch-up or replay backlog logic is introduced; overrun is counted only, not replayed | Code review confirms the runner proceeds to the next wall-clock slot after recording `skippedCount`; no queuing or backlog array present |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A simulated 3× overrun (iteration takes 3× the interval) produces `skippedCount: 2` in the persisted state for that iteration, and the runner does not launch 2 catch-up iterations immediately after.
- **SC-002**: Elapsed time fields use `process.hrtime` throughout; no `Date.now()` calls are used for slot duration measurement (verified by grep for `Date.now` in the changed code block).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Clock skew between host measurements if `Date.now` is accidentally used instead of monotonic `process.hrtime` | Med | Use `process.hrtime`/`process.hrtime.bigint()` exclusively for elapsed; SC-002 enforces this with a grep check |
| Evidence | `external/loop-cli-main/src/core/loop-controller.ts:337,484,486`; `ARCHITECTURE.md:438` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iter 5)

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

---
title: "Abortable Chunked Sleep Primitive"
description: "Bare setTimeout wait calls have no cancellation support, forcing a cancelled run to wait the full timeout before cleanup and delaying crash-resume restart."
trigger_phrases:
  - "abortable-chunked-sleep"
  - "cancellable-sleep-primitive"
  - "abortsignal-sleep"
  - "chunked-sleep-abort"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/004-abortable-chunked-sleep"
    last_updated_at: "2026-06-28T14:01:54Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-abortable-chunked-sleep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: Abortable Chunked Sleep Primitive

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
| **Phase** | 4 of 18 |
| **Predecessor** | 003-atomic-state-deferred-writer |
| **Successor** | 005-lifecycle-taxonomy-guards |
| **Handoff Criteria** | `sleep.ts` is created and exports `abortableSleep`; abort clears the timeout and rejects with `signal.reason`; natural completion removes the abort listener; call-site migration list is in tasks.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the deep-loop-runtime recs specification.

**Scope Boundary**: Creates a new `sleep.ts` module exporting `abortableSleep(ms, signal)` that waits in `SLEEP_CHUNK_MS` chunks and wires `AbortSignal.any` at the executor run boundary in `executor-audit.ts`.

**Dependencies**:
- None (new file; no dependency on phases 1-3)

**Deliverables**:
- New file `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts` exporting `abortableSleep`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Wait calls are scattered across the deep-loop executor as bare `setTimeout` promises with no cancellation support — a cancelled run must wait the full timeout before cleanup can begin and crash-resume restart can proceed. There is no shared primitive for signal-aware sleeping, so each call site reimplements its own ad-hoc delay. This makes abort propagation impossible to retrofit without touching every call site independently.

### Purpose

Create `abortableSleep(ms, signal)` as a single shared primitive so all wait calls become cancellable via `AbortSignal`, enabling immediate cleanup and restart when a run is aborted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts` exporting `abortableSleep(ms: number, signal?: AbortSignal): Promise<void>`
- Implement chunked waiting: sleep in `SLEEP_CHUNK_MS` (200 ms) chunks, checking the signal between chunks
- On abort: clear the pending timeout, remove the abort listener, and reject with `signal.reason`
- On natural completion: remove the abort listener to prevent leaks
- Wire `AbortSignal.any` composition at the executor run boundary in `executor-audit.ts` so both a per-run abort and a global shutdown signal can cancel any `abortableSleep` call

### Out of Scope

- `AbortSignal` composition across multiple executors — deferred; this phase delivers the primitive and one wiring point only
- Backoff/retry scheduling — depends on crash-resume implementation in a later phase (018)
- Migrating all existing bare `setTimeout` call sites — tracked in tasks.md; callers not yet migrated retain old uncancellable paths during transition

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts` | Create | New module exporting `abortableSleep` |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Modify | Wire `AbortSignal.any` composition at executor run boundary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create `sleep.ts` with `abortableSleep(ms, signal?)` that waits in 200 ms chunks, clears the timeout on abort, removes the abort listener on natural completion, and rejects with `signal.reason` | `abortableSleep` is exported; aborting mid-sleep rejects immediately and clears the pending timeout; natural completion removes the listener |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Wire `AbortSignal.any` at the executor run boundary in `executor-audit.ts`; list unmigrated bare `setTimeout` call sites in tasks.md | `executor-audit.ts` composes signals at the run boundary; tasks.md contains the migration list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Aborting a signal during `abortableSleep` causes the promise to reject within one `SLEEP_CHUNK_MS` (200 ms) interval; no timeout leak is observable after rejection
- **SC-002**: TypeScript compilation passes with zero new type errors; `executor-audit.ts` compiles with the new signal composition wiring
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Evidence | `external/loop-cli-main/src/shared/sleep.ts:1`; `src/config/constants.ts:13` (`SLEEP_CHUNK_MS=200`) (reference only — NOT our code) | Low | Read-only citation from research.md §5.1 |
| Risk | Callers not yet migrated to `abortableSleep` retain old uncancellable `setTimeout` paths during transition | Med | Track all unmigrated call sites in tasks.md; migration is a follow-on task, not a blocker for this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iter 2)

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

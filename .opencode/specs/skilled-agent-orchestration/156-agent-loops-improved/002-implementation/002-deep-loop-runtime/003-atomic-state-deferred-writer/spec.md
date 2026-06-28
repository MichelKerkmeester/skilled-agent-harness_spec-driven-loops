---
title: "Atomic State: Deferred/Debounced Per-Path Writer"
description: "High-frequency reducers issue rapid successive writes that overwrite each other wastefully and may race; a per-path debounced writer with dirty-again reflush and drain guarantees eliminates this waste."
trigger_phrases:
  - "atomic-state-deferred-writer"
  - "debounced-per-path-write"
  - "coalesced-atomic-write"
  - "deferred-atomic-writer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/003-atomic-state-deferred-writer"
    last_updated_at: "2026-06-28T14:01:54Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-atomic-state-deferred-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: Atomic State — Deferred/Debounced Per-Path Writer

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
| **Phase** | 3 of 18 |
| **Predecessor** | 002-atomic-state-integrity-helpers |
| **Successor** | 004-abortable-chunked-sleep |
| **Handoff Criteria** | `createDeferredAtomicWriter` is exported; `flushNow()` and `close()` drain are verified; JSONL append exclusion is documented; process-exit handler hook is noted in tasks.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the deep-loop-runtime recs specification.

**Scope Boundary**: Adds `createDeferredAtomicWriter(path, opts)` to `atomic-state.ts` with coalescing, dirty-again reflush, `flushNow()`, and `close()` drain; integration target is `reduce-state.cjs`.

**Dependencies**:
- 001-atomic-state-serialize-diff (atomic-state.ts baseline with `writeStateIfChangedAtomic`)

**Deliverables**:
- `createDeferredAtomicWriter` factory and `DeferredAtomicWriter` interface exported from `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

High-frequency reducers (registry, strategy, dashboard) issue rapid successive writes to the same path that overwrite each other wastefully and may race with each other. There is no coalescing layer below the caller — every state update results in an independent fsync+rename cycle even when the next update arrives within milliseconds. This inflates I/O, risks write-order races under concurrent fan-out, and masks which version of the state was actually flushed.

### Purpose

Add `createDeferredAtomicWriter` so rapid successive writes to a path are coalesced into one fsync+rename per debounce window, with a dirty-again reflush guarantee and explicit drain via `flushNow()` and `close()`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `createDeferredAtomicWriter(path, opts?: { debounceMs?: number }): DeferredAtomicWriter` factory to `atomic-state.ts` that coalesces superseded writes per path; default debounce window 50 ms
- Implement dirty-again reflush: if a new write arrives during the in-flight fsync, queue one more flush after it completes
- Expose `flushNow(): Promise<void>` for immediate drain (e.g., before process exit)
- Expose `close(): Promise<void>` that flushes any pending write and marks the writer inert
- JSONL appends stay immediate — excluded from the deferred writer path

### Out of Scope

- Coalescing JSONL append streams — out of scope (append-only semantics conflict with coalescing)
- Cross-path write ordering guarantees — deferred; the full kasper-style owned-path model is a future phase
- Integration of existing callers into `createDeferredAtomicWriter` — tracked separately; this phase delivers the primitive only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Modify | Add `createDeferredAtomicWriter`, `DeferredAtomicWriter` interface, and debounce internals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement `createDeferredAtomicWriter(path, opts)` with debounce coalescing, dirty-again reflush, `flushNow()`, and `close()` drain | Factory is exported; multiple rapid writes coalesce to one fsync+rename per window; a write arriving during in-flight flush triggers exactly one additional flush; `close()` resolves only after the queue is drained |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Document the 50 ms default debounce window and the crash-window risk in JSDoc; note that `close()` must be called in process-exit handlers | JSDoc on `createDeferredAtomicWriter` states the default window, the crash window risk, and the process-exit handler requirement |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten rapid successive writes to the same path within one debounce window result in exactly one fsync+rename; a write arriving during the in-flight flush results in exactly one additional flush
- **SC-002**: `flushNow()` and `close()` resolve after all queued data is persisted; TypeScript compilation passes with zero new type errors
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Evidence | `external/kasper/src/state.ts:886-891,939-949,610-615` (reference only — NOT our code) | Low | Read-only citation from research.md §5.1 |
| Risk | A crash between the debounce window and `flushNow()` loses the last coalesced version | Med | Keep debounce window short (default 50 ms); callers MUST call `close()` in process-exit handlers — document this in tasks.md |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iters 15, 20, 43)

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

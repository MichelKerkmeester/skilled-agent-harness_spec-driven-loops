---
title: "JSONL Repair: Lock-Held Read-Merge-Write Set-Union"
description: "Concurrent fan-out writers and salvage callers append to the same JSONL without a read-back-under-lock step, causing duplicate and lost records when multiple processes race on the same file."
trigger_phrases:
  - "jsonl-lock-held-merge"
  - "jsonl-set-union-merge"
  - "fanout-lock-read-merge"
  - "jsonl-repair-dedup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/006-jsonl-lock-held-merge"
    last_updated_at: "2026-06-28T14:01:56Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-jsonl-lock-held-merge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: JSONL Repair — Lock-Held Read-Merge-Write Set-Union

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
| **Phase** | 6 of 18 |
| **Predecessor** | 005-lifecycle-taxonomy-guards |
| **Successor** | 007-loop-lock-heartbeat-hardening |
| **Handoff Criteria** | `jsonl-repair.ts` implements reread-under-lock + set-union merge by stable record identity; `fanout-salvage.cjs` is wired to call it; registry recompute is explicitly left to downstream reducers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the deep-loop-runtime recs specification.

**Scope Boundary**: Implements reread-under-lock + set-union merge by stable record identity `(type, iteration, focus, id/event.id)` in `jsonl-repair.ts`; caller is `fanout-salvage.cjs`.

**Dependencies**:
- None (targets a different module from phases 1-5)

**Deliverables**:
- Updated `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` with lock-held read-merge-write logic

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Concurrent fan-out writers and salvage callers append to the same JSONL file without a read-back-under-lock step; when multiple processes race on the same file, some records are written twice and others are lost depending on who wins the append race. There is no stable identity key to deduplicate on, so repair passes cannot distinguish a genuine duplicate from two independent events with the same content. Registry recomputation from corrupted JSONL then propagates the corruption downstream.

### Purpose

Implement reread-under-lock + set-union merge keyed by stable record identity so concurrent appenders and repair callers converge to a correct, deduplicated JSONL without duplicates or lost records.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Implement `mergeJsonlUnderLock(path, incomingRecords)` in `jsonl-repair.ts`: acquire a file lock, read the current file, build a set-union keyed by stable record identity `(type, iteration, focus, id ?? event.id)`, write the merged result, release lock
- Build the set-union keyed identity before acquiring the write lock to minimize lock hold time (read + union computation outside lock; only the write is inside)
- Wire `fanout-salvage.cjs` to call `mergeJsonlUnderLock` instead of a bare append
- Leave registry recomputation to downstream reducers — this phase only produces a correct, deduplicated JSONL

### Out of Scope

- Registry recomputation from merged JSONL — reducer concern, not this phase
- Cross-host locking (multi-machine scenarios) — deferred
- Lock fairness or queuing across more than two concurrent writers — addressed in a later heartbeat-hardening phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | Modify | Add `mergeJsonlUnderLock` with reread-under-lock + set-union merge by stable record identity |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Modify | Wire salvage appends through `mergeJsonlUnderLock` instead of bare append |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement `mergeJsonlUnderLock(path, incomingRecords)` in `jsonl-repair.ts` with reread-under-lock, set-union by stable record identity `(type, iteration, focus, id ?? event.id)`, and atomic write | Function is exported; two concurrent calls with overlapping records produce exactly one copy of each record; no records are lost; lock is released in all paths including error |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Wire `fanout-salvage.cjs` to call `mergeJsonlUnderLock`; keep lock hold time minimal by building the union set before acquiring the write lock | `fanout-salvage.cjs` no longer issues bare appends; the union computation is outside the write-lock critical section |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Simulated concurrent appends of N records with M overlapping by identity produce exactly N unique records in the output JSONL with zero duplicates and zero losses
- **SC-002**: Lock is released in all code paths (success and error); registry recompute is not triggered from within `jsonl-repair.ts`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Evidence | `external/kasper/src/lock.ts:19-31`; `src/state.ts:920-998` (reference only — NOT our code) | Low | Read-only citation from research.md §5.1 |
| Risk | Lock contention under high fan-out degree may serialize writers and degrade throughput | Med | Build the union set before acquiring the write lock; keep the lock critical section to read-existing + write-merged only; lock hold time is bounded by file size, not fan-out count |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iters 16, 21, 43)

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

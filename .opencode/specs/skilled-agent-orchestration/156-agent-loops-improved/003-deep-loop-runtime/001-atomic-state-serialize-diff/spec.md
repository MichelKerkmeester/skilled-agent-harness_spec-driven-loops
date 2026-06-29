---
title: "Atomic State: Serialize-Diff Write-Only-on-Change"
description: "Unconditional whole-snapshot rewrites on every reducer call amplify I/O across every iteration; a compare-before-write gate eliminates redundant fsync+rename cycles."
trigger_phrases:
  - "atomic-state-serialize-diff"
  - "write-only-on-change"
  - "atomic-state-dedup-write"
  - "state-diff-before-fsync"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/003-deep-loop-runtime/001-atomic-state-serialize-diff"
    last_updated_at: "2026-06-28T14:01:52Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-atomic-state-serialize-diff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: Atomic State — Serialize-Diff Write-Only-on-Change

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
| **Phase** | 1 of 18 |
| **Predecessor** | None |
| **Successor** | 002-atomic-state-integrity-helpers |
| **Handoff Criteria** | `writeStateIfChangedAtomic` is exported, verified with a change and a no-change scenario, and existing callers are listed in tasks.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the deep-loop-runtime recs specification.

**Scope Boundary**: Adds a `writeStateIfChangedAtomic` function to `atomic-state.ts` that skips the fsync+rename write when serialized state matches the in-memory per-path cache.

**Dependencies**:
- None

**Deliverables**:
- `writeStateIfChangedAtomic` exported function in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

All reducers and fan-out callers invoke the atomic write unconditionally, producing redundant whole-snapshot rewrites even when state has not changed — amplifying I/O across every iteration. There is no diff or equality check before the temp-file creation and fsync+rename sequence, meaning each flush incurs kernel I/O regardless of whether anything changed. Over a long-running loop session this accumulates unnecessary write pressure.

### Purpose

Add `writeStateIfChangedAtomic` so callers get fsync+rename durability only when the serialized snapshot has actually changed, reducing redundant I/O to zero for unchanged state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `writeStateIfChangedAtomic(path, state, cache?)` to `atomic-state.ts` that canonicalizes + serializes the incoming state, compares against a per-path in-memory cache keyed by canonical path, and skips the fsync+rename write when equal; returns a boolean indicating whether a write occurred
- Expose the per-path cache as an internal module-level `Map<string, string>` (keyed by canonical path), injected or overridable for tests
- Keep the existing `writeStateAtomic` raw write path intact and functional for callers that must guarantee a write
- Document `writeStateIfChangedAtomic` in JSDoc noting that bypassing it via the raw path is discouraged for production callers

### Out of Scope

- Per-caller optimizations beyond the compare-on-write gate — out of scope for this phase
- Cache invalidation strategies beyond the compare-on-write check — deferred
- Migrating existing callers to use `writeStateIfChangedAtomic` — tracked separately in tasks.md

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Modify | Add `writeStateIfChangedAtomic` and internal per-path serialized-state cache |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add `writeStateIfChangedAtomic(path, state, cache?)` to `atomic-state.ts` with compare-before-write semantics preserving the existing temp+fsync+rename durability | Function is exported; `writeStateAtomic` is skipped when serialized state matches cache; returns `false` for skipped writes and `true` for writes performed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Keep existing `writeStateAtomic` raw write path intact and add JSDoc noting it is discouraged for production callers | Existing callers compile and pass their tests unchanged; JSDoc warning is present on the raw path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `writeStateIfChangedAtomic` returns `false` (no write) on a second call with identical state and returns `true` on the first call and after any state mutation
- **SC-002**: TypeScript compilation passes with zero new type errors; no existing caller of `writeStateAtomic` is broken
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Evidence | `external/loop-cli-main/src/daemon/manager.ts:23,279,281` (reference only — NOT our code) | Low | Read-only citation from research.md §5.1 |
| Risk | Cache staleness if a caller bypasses `writeStateIfChangedAtomic` and writes via the raw `writeStateAtomic` path without updating the cache | Med | Keep raw write path available but document it as discouraged; note the bypass risk in JSDoc on both functions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iter 8)

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

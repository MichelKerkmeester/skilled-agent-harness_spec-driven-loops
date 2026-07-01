---
title: "Persisted-Wait Crash-Resume"
description: "When a loop process is killed during a scheduled wait, the next startup re-dispatches immediately instead of resuming the remaining delay, causing duplicate dispatch and misattributed lineage state."
trigger_phrases:
  - "persisted-wait crash-resume"
  - "resume-waiting classifier"
  - "wait-checkpoint schema"
  - "nextRunAt crash recovery"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime/018-persisted-wait-crash-resume"
    last_updated_at: "2026-06-28T14:02:05Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-persisted-wait-crash-resume"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Nullable schema migration: should existing state files without nextRunAt be treated as 'not waiting' (safe default) or prompt the operator?"
    answered_questions:
      - "Decision: null = not waiting (safe default); no operator prompt required"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Persisted-Wait Crash-Resume

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-fanout-stall-watchdog |
| **Successor** | None |
| **Handoff Criteria** | Wait-checkpoint schema added; `resume-waiting` classifier branch implemented and evaluated first on startup; legacy state files migrate cleanly with null fields; no duplicate dispatch on crash-during-wait |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the deep-loop-runtime recs specification.

**Scope Boundary**: `fanout-run.cjs` (classifier + checkpoint persist) and `deep_research_auto.yaml` (schema extension); per-lineage state isolation and socket-based wait-resume are excluded.

**Dependencies**:
- Startup classifier path must have a defined entry point before which the `resume-waiting` branch can be inserted
- State file schema must be extensible with nullable fields without breaking existing readers

**Deliverables**:
- Nullable wait-checkpoint schema: `nextRunAt` and `remainingDelayMs` fields in persisted state
- Checkpoint written at explicit pre-dispatch wait boundary in `fanout-run.cjs`
- `resume-waiting` classifier branch evaluated first on startup before any dispatch logic
- Migration: state files missing checkpoint fields treated as null (not-waiting)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a loop process is killed during a scheduled wait, the next startup re-dispatches immediately instead of resuming the remaining delay; killed lineages cannot distinguish "killed mid-wait" from "killed mid-dispatch." This causes duplicate dispatch and incorrect lineage attribution on restart. Without a `resume-waiting` classifier branch, all crash states collapse into the same code path, which was designed only for mid-dispatch crashes and has no concept of a remaining delay to honor.

### Purpose
Add a nullable wait-checkpoint schema and `resume-waiting` classifier branch so a crash during a scheduled wait resumes the remaining delay rather than triggering an immediate re-dispatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Nullable wait-checkpoint schema fields `nextRunAt` and `remainingDelayMs` added to persisted state in `deep_research_auto.yaml`
- Checkpoint persisted at the explicit pre-dispatch wait boundary in `fanout-run.cjs`
- `resume-waiting` classifier branch evaluated first on startup before any dispatch logic
- Migration: existing state files missing checkpoint fields have them treated as null (not-waiting, safe default) without operator prompt

### Out of Scope
- Full per-lineage restart (requires per-lineage state isolation; a future deep-rewrite)
- Socket-based wait-resume (requires a resident process; not in scope for this phase)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Add wait-checkpoint persist at pre-dispatch boundary + `resume-waiting` classifier branch evaluated first on startup |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add nullable `nextRunAt` and `remainingDelayMs` fields to the persisted state schema |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `resume-waiting` classifier branch must be evaluated first on startup, before any dispatch logic; state with `nextRunAt` in the future must resume remaining delay rather than re-dispatch | Integration test: supply state with `nextRunAt` 30 seconds in the future with mocked clock → assert remaining delay is waited and no dispatch is triggered during that window |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | State files missing `nextRunAt`/`remainingDelayMs` must be migrated to null on first load without requiring operator intervention or throwing an error | Unit test: load a legacy state file without checkpoint fields → assert fields read as null, no exception thrown, process enters not-waiting state correctly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A crash during a 60-second scheduled wait resumes with the remaining delay on restart (not zero delay), confirmed by integration test with a mocked clock and a state file written at the 20-second mark.
- **SC-002**: Legacy state files without `nextRunAt` start correctly in the not-waiting state with no migration prompt and no error — confirmed by unit test loading a pre-schema state fixture.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing `resume-waiting` classifier branch causes immediate duplicate dispatch on crash-during-wait restart | High | The `resume-waiting` branch must be the first case evaluated on startup before any dispatch logic; add an ordering invariant test |
| Evidence | `external/loop-cli-main/src/core/loop-controller.ts:13,228,266,311`; `src/daemon/manager.ts:69,87,257` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Nullable schema migration: should existing state files without `nextRunAt` be treated as 'not waiting' (safe default) or prompt the operator? **Decision: null = not waiting (safe default); no operator prompt required.**
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

> **Provenance:** research.md §5.1, (iters 1, 40)

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

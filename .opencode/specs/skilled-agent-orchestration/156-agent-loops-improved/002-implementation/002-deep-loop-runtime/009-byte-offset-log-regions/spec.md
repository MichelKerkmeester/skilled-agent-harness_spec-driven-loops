---
title: "Byte-Offset Transcript Log Regions"
description: "Stamp optional logOffset/logSize/logPath fields on each iteration record so tooling can seek directly to a transcript slice without scanning the full log file."
trigger_phrases:
  - "byte-offset log regions"
  - "transcript log offset"
  - "iteration log slice"
  - "log seek by offset"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/009-byte-offset-log-regions"
    last_updated_at: "2026-06-28T14:01:58Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-byte-offset-log-regions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Byte-Offset Transcript Log Regions

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
| **Status** | Draft |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 18 |
| **Predecessor** | 008-loop-lock-single-flight-decision |
| **Successor** | 010-fixed-rate-overrun-accounting |
| **Handoff Criteria** | `logOffset`, `logSize`, and `logPath` fields stamped by post-dispatch-validate; reduce-state reads and displays them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the deep-loop-runtime recs specification.

**Scope Boundary**: Changes are limited to stamping offset metadata at write time in `post-dispatch-validate.ts`, reading it in `reduce-state.cjs`, and adding the field definitions to `deep_research_auto.yaml`; no streaming log tail or multi-segment view is introduced.

**Dependencies**:
- Iteration records must already be written to a known file path before offset metadata can be stamped; assumes existing post-dispatch-validate write path is stable.

**Deliverables**:
- Optional `logOffset` (byte position), `logSize` (byte count), and `logPath` (absolute path) fields on each iteration record, stamped by `post-dispatch-validate.ts`.
- `reduce-state.cjs` reads and surfaces these fields in dashboard output.
- `deep_research_auto.yaml` schema updated with the three new optional fields.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Log analysis tools must scan and parse entire transcript files by markdown headers to locate a specific iteration's output; on long runs with many iterations this is slow and error-prone. There is no metadata on iteration records pointing to the exact byte range of that iteration's transcript, so every consumer must re-parse the full file.

### Purpose
Enable tooling to seek directly to the byte range of any iteration's transcript output by reading the stamped `logOffset`/`logSize`/`logPath` fields from the iteration record rather than scanning the full file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add optional `logOffset: number`, `logSize: number`, `logPath: string` fields to the iteration record type.
- Wire `post-dispatch-validate.ts` to capture `fs.stat` byte position before and after writing the iteration transcript block, then stamp the three fields.
- Update `reduce-state.cjs` to read and display the offset fields in dashboard output.
- Add field definitions to `deep_research_auto.yaml` schema block.

### Out of Scope
- Multi-segment log view or streaming log tail — deferred; requires a resident server capable of holding open file handles across requests.
- Log rotation handling — rotation invalidates stamped offsets; document that rotation invalidates offsets rather than trying to follow rotated files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | Stamp `logOffset`/`logSize`/`logPath` on each iteration record after transcript write |
| `.opencode/skills/deep-loop-runtime/scripts/reduce-state.cjs` | Modify | Read and display `logOffset`/`logSize`/`logPath` in dashboard output |
| `.opencode/skills/deep-loop-runtime/deep_research_auto.yaml` | Modify | Add optional `logOffset`, `logSize`, `logPath` field definitions to iteration schema |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `post-dispatch-validate.ts` stamps `logOffset`, `logSize`, and `logPath` (absolute path) on each iteration record after writing the transcript | Read the JSONL state file after a test run; each iteration record contains all three fields with numeric byte values > 0 and a non-empty absolute path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `reduce-state.cjs` displays `logOffset`/`logSize`/`logPath` in dashboard output when present | Run `reduce-state.cjs` on a state file with stamped offsets; output includes the three fields for each iteration row |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Given a state file produced after this change, a script can open `logPath`, seek to `logOffset`, read exactly `logSize` bytes, and recover the iteration's full transcript output without scanning the rest of the file.
- **SC-002**: Iteration records in state files produced before this change (missing the three fields) load and display without error in `reduce-state.cjs` — fields are optional and absent fields are silently skipped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Log paths may change between write and read if logs are rotated, invalidating the stamped offset | Med | Stamp the absolute path at write time and document clearly that log rotation invalidates offsets; do not attempt to follow rotated files |
| Evidence | `external/loop-cli-main/src/types.ts:50,85`; `loop-controller.ts:345,375`; `daemon/server.ts:282-297` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iter 6)

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

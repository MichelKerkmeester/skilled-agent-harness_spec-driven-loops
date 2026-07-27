---
title: "Feature Specification: Phase 13: skill-deletion-and-daemon-reap"
description: "The irreversible step: stop the running daemon, release its owner lease and IPC socket, then remove the skill directory from the repository once every consumer, registration, and binary has already been decoupled."
trigger_phrases:
  - "delete system-code-graph skill folder"
  - "code graph daemon reap"
  - "code graph owner lease release"
  - "git rm code graph skill"
  - "036 skill deletion"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/013-skill-deletion-and-daemon-reap"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-013-skill-deletion-and-daemon-reap"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: skill-deletion-and-daemon-reap

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 15 |
| **Predecessor** | 012-ci-and-binaries |
| **Successor** | 014-historical-reference-policy |
| **Handoff Criteria** | The directory is gone from the working tree and the index, no daemon process survives, and every runtime still starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the code graph decommission specification.

**Scope Boundary**: Process teardown and the removal of the skill directory. Nothing else is edited here.

**Dependencies**:
- Phases 003 through 012 complete and verified. This phase is gated on all of them.
- A quiet repository: no other session mid-write.

**Deliverables**:
- The running daemon stopped and its process confirmed gone.
- The owner lease, PID registry, readiness marker, and IPC socket released.
- The directory removed from the working tree and the git index.
- A post-deletion start of each runtime with no error.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This is the one step that cannot be undone by editing a file back. The directory holds a live daemon with an active owner lease, a unix socket, a SQLite database with write-ahead state, and lock files. Deleting the directory while the daemon runs would leave an orphan process holding a lease on a path that no longer exists, and could leave the socket bound. The tracked footprint is modest — roughly 270 files, since build output and dependencies are ignored — but the removal is permanent, so ordering and a rehearsed rollback matter more than volume.

### Purpose
Remove the subsystem cleanly: process first, then leases and sockets, then the directory — with every runtime verified to start afterward and a rollback that is known to work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stopping the daemon and confirming no surviving process.
- Releasing the owner lease, PID registry, readiness and invalidation markers, and the launcher lock directory.
- Removing the IPC socket and its temporary directory.
- Removing the directory from the working tree and the git index.
- Verifying each runtime starts afterward.

### Out of Scope
- Any consumer, config, doc, or binary edit — all completed in earlier phases.
- Archived spec packets that reference the subsystem — phase 014.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/` | Delete | The subsystem directory, tracked contents and all |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phases 003–012 are verified complete before deletion | Each predecessor phase reports a green gate |
| REQ-002 | No daemon process survives | A process check finds nothing running from the directory |
| REQ-003 | Leases and sockets are released | No owner lease, lock directory, or bound socket remains |
| REQ-004 | The directory is gone from tree and index | Neither the filesystem nor `git ls-files` shows it |
| REQ-005 | Every runtime starts after deletion | OpenCode, Claude Code, and Codex each start with no error |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The repository is quiet during deletion | No concurrent session is mid-write when this runs |
| REQ-007 | The rollback path is confirmed available | The pre-deletion commit is identified and reachable |
| REQ-008 | Temporary IPC directories are cleaned | No stale socket directory is left behind |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The directory is absent from both the working tree and the git index.
- **SC-002**: All three runtimes start cleanly and no orphan process or socket remains.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting while the daemon runs | Orphan process holding a dead lease | Reap first; verify with a process check before removing |
| Risk | A concurrent session writes during deletion | Corrupt or partial removal | REQ-006 requires a quiet repository |
| Risk | Irreversibility | Capability cannot be restored by editing | Rollback procedure from phase 002; history preserved |
| Dependency | Phases 003–012 | A surviving consumer breaks on deletion | REQ-001 gates this phase on all of them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should deletion land as its own commit to keep the rollback point unambiguous?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

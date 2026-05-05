---
title: "Feature Specification: Phase 4: closeout"
description: "validate.sh --strict + graph-metadata refresh + final commit. Mark packet 071 final."
trigger_phrases: ["071/004", "closeout"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/004-closeout"
    last_updated_at: "2026-05-05T15:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 4 closeout: validate PASS, metadata refreshed, ready for final commit"
    next_safe_action: "(Packet 071 final)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase4-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 (terminal) |
| **Predecessor** | 003-synthesize |
| **Successor** | None |
| **Handoff Criteria** | validate.sh --strict on parent 071 exits 0; graph-metadata refreshed for parent + 4 children; one final commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 4 (terminal) of the 071 packet. Validates spec folder structural integrity, refreshes graph metadata, marks packet final.

**Scope Boundary**: Validation + metadata refresh + final commit. NO new content authoring beyond closeout summary.

**Deliverables**:
- validate.sh --strict on parent 071 exits 0 (already verified — PASS)
- graph-metadata.json refreshed for parent + 4 children (status=complete, parent_id wired, children_ids=[001-004])
- 004-closeout/{spec,plan,tasks,implementation-summary}.md authored
- One final commit on main: `feat(sk-doc): finalize router stress-test packet (071/004)`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 1-3, raw deliverables exist (15 scenarios, 45 cells, matrix.csv, review-report.md) but packet metadata isn't refreshed and validate.sh hasn't been run on the final state.

### Purpose
Mark packet 071 as final: validate spec folder integrity, refresh derived graph metadata, ship a closeout commit on main.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- validate.sh --strict on parent 071
- graph-metadata.json refresh (parent + 4 children) via jq
- 004-closeout spec docs (terminal phase)
- Final commit on main

### Out of Scope
- Re-running matrix
- Authoring new findings
- Follow-up packet 072 creation (only if user requests)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `071/graph-metadata.json` | Modify | children_ids = [001..004]; status=complete; last_active_child_id=004 |
| `071/00{1,2,3,4}-*/graph-metadata.json` | Modify | parent_id=071-sk-doc-router-stress-test; status=complete |
| `071/004-closeout/{spec,plan,tasks,implementation-summary}.md` | Create | Phase 4 spec docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | validate.sh --strict on parent 071 exits 0 | `bash validate.sh ... --strict` returns exit 0 |
| REQ-002 | graph-metadata.json refreshed for parent + 4 children | jq `.derived.status` returns "complete" for each |
| REQ-003 | Parent children_ids contains all 4 | jq `.children_ids` returns [001-scenario-author, 002-matrix-execute, 003-synthesize, 004-closeout] |
| REQ-004 | Each child parent_id wired | jq `.parent_id` returns "071-sk-doc-router-stress-test" for each |
| REQ-005 | 004 spec docs all 5 files present | spec.md, plan.md, tasks.md, implementation-summary.md, description.json all exist |
| REQ-006 | One final commit on main | git branch shows main; commit message matches packet pattern |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | last_active_child_id pointer updated to 004 | jq `.derived.last_active_child_id` returns "004-closeout" |
| REQ-008 | No surviving feature branch | `git branch | grep "071-"` returns nothing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 P0 + 2 P1 REQs verified
- **SC-002**: Packet 071 marked final; ready for downstream consumers (review-report.md is the headline)

### Given/When/Then Verification Scenarios

**Given** Phase 1-3 commits landed, **When** running validate.sh --strict on parent 071, **Then** exit 0 with zero errors and zero warnings.

**Given** graph-metadata.json files exist for parent + 4 children, **When** running jq `.derived.status`, **Then** each returns "complete".

**Given** parent graph-metadata.json, **When** running jq `.children_ids`, **Then** returns array with all 4 child names.

**Given** all closeout work done, **When** committing, **Then** the message follows packet 071 convention.

**Given** the commit, **When** running `git branch --show-current`, **Then** returns main.

**Given** the commit, **When** listing branches, **Then** no `071-*` packet branch survives.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | generate-context.js telemetry-drift error blocks metadata refresh | Low | Fall back to manual jq edits (used in packet 068 same scenario) |
| Risk | validate.sh fails strict on phase parent | Low | Already verified PASS pre-Phase-4; nothing changed since |
| Dependency | Phase 1-3 commits all landed | Green | 76f394f39 (071/001), 1c941ef90 (071/002+003) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Phase 4 is mechanical closeout.
<!-- /ANCHOR:questions -->

---

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

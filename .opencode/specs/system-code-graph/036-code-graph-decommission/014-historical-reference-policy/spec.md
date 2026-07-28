---
title: "Feature Specification: Phase 14: historical-reference-policy"
description: "Apply the archival decision: leave the thousands of references inside archived spec packets, changelogs, and benchmark reports untouched, and add a single tombstone at the track root that explains the removal to anyone who follows a stale pointer."
trigger_phrases:
  - "code graph archival reference policy"
  - "spec history tombstone"
  - "do not scrub archived packets"
  - "code graph removal pointer"
  - "036 historical reference policy"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/014-historical-reference-policy"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-014-historical-reference-policy"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: historical-reference-policy

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 15 |
| **Predecessor** | 013-skill-deletion-and-daemon-reap |
| **Successor** | 015-verification-and-closeout |
| **Handoff Criteria** | A tombstone explains the removal, and no archived packet has been rewritten |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the code graph decommission specification.

**Scope Boundary**: A single explanatory document at the track root. Archived content is read, never edited.

**Dependencies**:
- Phase 013 completed the removal that the tombstone describes.
- Phase 002 ratified the archival boundary this phase applies.

**Deliverables**:
- A tombstone document at the track root explaining what was removed, when, and why.
- A pointer from the tombstone to the decision record and to the commit that removed the directory.
- Confirmation that no archived packet was modified.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The overwhelming majority of references to the subsystem — several thousand files — live inside archived spec packets, changelogs, and benchmark reports. Those documents recorded decisions that were true when they were written, and rewriting them to hide a since-removed dependency would falsify the project's own decision trail. But leaving them entirely unannotated means a future reader following a pointer into the skill directory finds nothing and no explanation.

### Purpose
Resolve the tension in the cheapest honest way: change no history, and add one durable signpost that explains why those paths no longer resolve.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Authoring a tombstone at the track root.
- Linking it to the decision record and the removal commit.
- Verifying that archived surfaces were not modified during the packet.

### Out of Scope
- Editing any archived spec packet, changelog, or benchmark report.
- Editing the live surfaces, which earlier phases already handled.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-code-graph/context-index.md` | Create | Tombstone explaining the removal and pointing at the record |
| `.opencode/specs/system-code-graph/spec.md` | Modify | Note the tombstone in related documents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No archived packet is modified | A diff over archived paths shows no change across the whole packet |
| REQ-002 | The tombstone explains the removal | It states what was removed, when, and where the decision is recorded |
| REQ-003 | The tombstone is discoverable | It sits at the track root and is linked from the root spec |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The removal commit is cited | A reader can reach the exact change from the tombstone |
| REQ-005 | The replacement routing is restated | The tombstone names what to use instead |
| REQ-006 | Benchmark reports are explicitly out of bounds | The policy names them as historical measurements |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A diff over archived surfaces for this packet is empty.
- **SC-002**: Someone following a stale pointer finds an explanation within one hop.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A well-meaning sweep edits archived packets | Decision trail falsified | REQ-001 verifies with a diff over archived paths |
| Risk | The tombstone becomes a migration narrative in the live docs | Instruction files drift into history | Keep the narrative here, not in doctrine |
| Risk | Tombstone goes stale | Points at a moved record | Cite an immutable commit alongside the path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the tombstone also live in the skills tree, where the directory used to be, or only at the spec track root?
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

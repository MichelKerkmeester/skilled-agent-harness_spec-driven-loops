---
title: "Feature Specification: Phase 15: devin-database-reader"
description: "A save inside a live Devin session finds no transcript file, because Devin writes it only when an interactive session ends, so the Devin sweep could not recover an answer the live hook missed. It now rebuilds the session from Devin's message store under the hook's own keys."
trigger_phrases:
  - "devin database reader"
  - "phase 15 devin database reader"
  - "devin message nodes"
  - "devin sweep sessions.db"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: devin-database-reader

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/437-devin-database-reader` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-devin-vibe-lock-probe |
| **Successor** | None |
| **Handoff Criteria** | On a real Devin session with no transcript file, the sweep recovers an answer the hook did not queue under the hook's exact key, and adds nothing when the hook did queue it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the decision capture series. Child 014 made the Devin sweep print the hook's queue when a session has no transcript. The operator chose on 2026-11-16 to probe the key format first and then build a reader for Devin's message store.

**Scope Boundary**: The Devin sweep's source when the chosen session has no transcript file. Transcript reading, session choice and the hook are unchanged.

**Dependencies**:
- Devin 3000.12.57 stores each message as JSON in `sessions.db`, table `message_nodes`, indexed on `session_id`.
- The shared key builder turns the call id's `#` into `.` for every caller.

**Deliverables**:
- A reader that rebuilds a session's steps from `message_nodes`.
- A sweep that uses it when the transcript file is absent.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Devin writes a session's transcript file only when an interactive session ends, and wrote none for four headless probe sessions. A save runs inside a live session, so the sweep finds no file, and an answer the live hook missed is lost. Child 014 described this as Devin writing no transcripts at all; the probe in this child showed the file appears when the interactive session exits.

### Purpose
A Devin save recovers every answered question in its session, whether or not the hook queued it, without writing any answer twice.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
hook payload tool_use_id:   ask_user_question:0#055c21a4a019416f8126a857c7d16509
hook queue key:             devin:complex-walkover:ask_user_question:0.055c21a4a019416f8126a857c7d16509:0
message_nodes call id:      ask_user_question:0#055c21a4a019416f8126a857c7d16509   (stored twice, metadata differs)
message_nodes answer:       {"selected": ["Blue"], "skipped": false}
transcripts/complex-walkover.json written at 20:38, when the interactive session was closed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `databaseTranscript` reads a session's rows in order, keeps each message id once, and maps user, assistant and tool messages to the transcript's step shape.
- With no transcript file, the sweep reads that store and marks the result `transcript_missing: true`. If the store cannot be read, it prints the hook's queue as before.

### Out of Scope
- Headless Devin sessions writing no transcript at all, which the reader now covers anyway.
- Devin's other tables, such as `tool_call_state`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` | Modify | The message-store reader and its use when no transcript exists |
| `.skilled/hooks/decision-capture/bin/sweep-devin.test.mjs` | Modify | The message-store case |
| `.skilled/hooks/decision-capture/bin/README.md` | Modify | When the sweep reads the store |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A missed answer is recovered from the store | On session `complex-walkover` with its queue moved aside and no transcript file, the sweep recovers `Blue` |
| REQ-002 | The recovered key equals the hook's key | The recovered key is `devin:complex-walkover:ask_user_question:0.055c21a4a019416f8126a857c7d16509:0`, and with the hook's queue present the sweep recovers 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A stored-twice message counts once | The test stores the call twice and recovers 1 answer |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` exits 0.
- **SC-002**: The real-session run recovers the hook's key once.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `message_nodes` layout, undocumented | A Devin update could rename it, as the transcript timing changed | A failed read falls back to the hook's queue |
| Risk | A 6.4 GB store | A slow query would slow every save | The query uses Devin's `session_id` index and took 1 to 3 ms |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

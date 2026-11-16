---
title: "Feature Specification: Phase 14: devin-vibe-lock-probe"
description: "Devin and Vibe set no session id in the commands they run, so their sweeps read the newest session in the project and a save can take another open session's answers. Devin also stopped writing transcript files, so its sweep failed on every recent session and never printed the answers the live hook queued."
trigger_phrases:
  - "devin vibe lock probe"
  - "phase 14 devin vibe lock probe"
  - "devin transcript missing"
  - "sweep session lock ancestry"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: devin-vibe-lock-probe

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/436-devin-vibe-lock-probe` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-session-signal-sweeps |
| **Successor** | None |
| **Handoff Criteria** | A live two-session probe shows the calling session's lock in its own process ancestry on Devin and Vibe, both sweeps prefer that session, and the Devin sweep prints queued answers for a session with no transcript |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the decision capture series. Child 013 left Devin and Vibe on the newest-session choice because neither sets a session id. The operator chose on 2026-11-16 to probe their lock files first, and, after the probe found Devin writes no transcripts, to add a fallback for that and leave a database reader for later.

**Scope Boundary**: How the Devin and Vibe sweeps choose a session, and what the Devin sweep prints when the chosen session has no transcript.

**Dependencies**:
- Devin 3000.12.57 writes `session_locks/<id>.lock` holding the session's process id.
- Vibe 3.1.2 writes `active/<id>.lock.json` with `session_id` and `process_id`, and removes it on release.

**Deliverables**:
- Both sweeps prefer the session whose lock a calling process holds.
- A Devin sweep that prints the live queue when no transcript exists.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
With two Devin or two Vibe sessions open in one project, a save reads the newest one, which can be the other session. Separately, Devin has written no transcript file since 2026-11-10: the 103 files in `transcripts/` stop there, while `sessions.db` holds over 5,100 sessions. The Devin sweep reads only those files, so for any recent session it exited 1 with `ENOENT` and the save step never saw the answers the live hook had queued.

### Purpose
A save on Devin or Vibe reads its own session, and a Devin save always gets the answers its hook queued.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
probe, Devin, session A's command ancestry: ... 98661 devin ...
  live locks: glaze-marble pid=98661 (session A), hallowed-limit pid=10112 (session B), 66 others
probe, Vibe, session A's command ancestry: ... 98631 vibe-app-server ...
  live leases: f1cfb352 pid=98631 (session A), 6e289c29 pid=10196 (session B)
$ sweep-devin.mjs   # inside a recent Devin session
{ "error": "ENOENT: no such file or directory, open '.../transcripts/expensive-cormorant.json'" }
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Walk the sweep's process ancestry with `ps`, and prefer a session whose lock names an ancestor process, provided that session ran in this project. A stale lock can carry a reused process id, so the project check keeps a stray match out.
- Keep the newest-session choice when no lock matches.
- Devin: when the chosen session has no transcript, print its queued pending answers with `transcript_missing: true` and exit 0.

### Out of Scope
- Reading Devin's messages from `sessions.db`, which would recover answers the live hook missed. It needs its own probe of the `message_nodes` schema.
- Windows, where `ps` is absent. The ancestry walk returns nothing there, so the newest-session choice stands.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` | Modify | Lock choice and the missing-transcript fallback |
| `.skilled/hooks/decision-capture/bin/sweep-vibe.mjs` | Modify | Lease choice |
| `.skilled/hooks/decision-capture/bin/sweep-devin.test.mjs`, `sweep-vibe.test.mjs` | Modify | One case each per behavior, failing on the old code |
| `.skilled/hooks/decision-capture/README.md`, `bin/README.md` | Modify | How the two sweeps pick a session |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The calling session's lock is in its command's process ancestry | In each runtime's probe exactly one live lock names an ancestor of session A's command, and it is session A |
| REQ-002 | The Vibe sweep prefers the caller's session | Run inside session A with a newer session B, the new sweep prints session A and the old one session B |
| REQ-003 | A Devin session with no transcript still yields its queued answers | Run inside a recent Devin session, the new sweep prints its pending answer and exits 0, where the old one exited 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The Devin sweep prefers the caller's session | The Devin test picks the locked session over a newer one, and fails on the old code |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` exits 0.
- **SC-002**: The seeded probes show the new Vibe sweep reading session A and the new Devin sweep printing session A's queued answer.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stale Devin locks carry reused process ids, and a few ids hold two locks | A stray lock could name the wrong session | A matched session must also have run in this project, and the newest of the matches wins |
| Dependency | `ps` | Without it no lock matches | The newest-session choice stands, as before |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

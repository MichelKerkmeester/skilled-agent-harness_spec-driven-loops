---
title: "Feature Specification: Phase 13: session-signal-sweeps"
description: "The Codex, DSH, OpenCode and Pi sweeps read whichever session in the project changed last, so with two sessions open a save can be offered the other session's answers. The Vibe sweep never looked in the unified folder Vibe 3 writes, so it found no session at all."
trigger_phrases:
  - "session signal sweeps"
  - "phase 13 session signal sweeps"
  - "sweep reads calling session"
  - "vibe unified session folder"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: session-signal-sweeps

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
| **Branch** | `worktrees/435-session-signal-sweeps` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-session-scoped-sweep-and-consume |
| **Successor** | None |
| **Handoff Criteria** | Each runtime that names its session in a command's environment has a sweep that reads that session, shown by a live two-session probe, and the Vibe sweep finds sessions in its unified folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the decision capture series. Child 012 fixed the Claude sweep. A read-only investigation on 2026-11-16 then checked the six other sweeps' runtimes for a session signal.

**Scope Boundary**: How the Codex, DSH, OpenCode, Pi and Vibe sweeps choose a session when no flag names one. The Devin sweep and the save step are unchanged.

**Dependencies**:
- Codex 0.169.0 sets `CODEX_THREAD_ID`, DSH 0.2.2-rc.3 sets `DSH_SESSION_ID`, OpenCode 2.3.0 sets `OPENCODE_SESSION_ID`, and Pi 1.5.2 sets `PI_SESSION_ID` and `PI_SESSION_FILE`.
- Rule D5: a signal is relied on only after a live probe shows it.

**Deliverables**:
- Four sweeps that read the signalled session and never fall back when the signal names nothing on disk.
- A Vibe sweep that reads the `unified/` folder.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Run without a flag, each sweep takes the newest session recorded for the project. With two sessions of one runtime open in a project, a save in the older one reads the newer one's answers and misses its own. Separately, Vibe 3 keeps its sessions under `~/.vibe/logs/session/unified/`, and the Vibe sweep only read the folder above it, so on this machine it found no session and exited silently.

### Purpose
A save reads its own session's answers on every runtime that tells its commands which session they belong to.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls -d ~/.vibe/logs/session/*/journal       # the folder the Vibe sweep read
no matches found
$ ls ~/.vibe/logs/session/
active  continue-pointers  plugins  unified
```
Live two-session probes, before the change: the OpenCode sweep run inside session A read session B, and the Pi and Codex sweeps read the newer session, which held no question, so they printed nothing.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Codex, DSH, OpenCode and Pi: read the session the runtime names. When the variable is set but names no session on disk, read nothing rather than the newest session. Keep the newest-session fallback only when the variable is unset.
- OpenCode: climb from a subagent's session to the session that dispatched it.
- Vibe: read sessions under `unified/` as well as the root.

### Out of Scope
- Devin and Vibe session choice. Neither runtime sets a session id in the commands it runs. Their lock files record a process id, but one long-lived process can serve several sessions, so a lock is not yet a proven signal under D5.
- The save step. No flag or field changes there.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/bin/sweep-codex.mjs` | Modify | Read the rollout named by `CODEX_THREAD_ID` |
| `.skilled/hooks/decision-capture/bin/sweep-dsh.mjs` | Modify | Read the log named by `DSH_SESSION_ID` |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | Modify | Read `OPENCODE_SESSION_ID`, climbing to the root session |
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs` | Modify | Read `PI_SESSION_FILE` |
| `.skilled/hooks/decision-capture/bin/sweep-vibe.mjs` | Modify | Read the `unified/` folder |
| The five matching `*.test.mjs` files | Modify | One case each that fails on the old code, and a blank variable in the fallback cases |
| `.skilled/hooks/decision-capture/README.md`, `bin/README.md` | Modify | How each sweep picks its session |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Codex, DSH, OpenCode and Pi sweeps read the signalled session | In each runtime's live probe the new sweep, run inside session A while session B exists, prints session A's id |
| REQ-002 | A set signal that names nothing on disk reads nothing | The Codex, DSH and Pi tests print no output for an unknown id while another session exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The Vibe sweep finds sessions under `unified/` | The new Vibe CLI test reads a session there, and fails on the old code |
| REQ-004 | An OpenCode subagent's save reads the dispatching session | The OpenCode test resolves a child session to its parent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` exits 0.
- **SC-002**: Each of the four live probes shows the new sweep reading session A.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime session variables | A runtime that stops setting its variable falls back to the newest session, as before | The fallback is unchanged |
| Risk | Codex's app-server daemon keeps the environment of the session that started it | A second thread on one daemon could carry the first thread's id | The binary sets `CODEX_THREAD_ID` beside its per-command variables, so it is likely per thread. Unproven until a two-thread daemon probe |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

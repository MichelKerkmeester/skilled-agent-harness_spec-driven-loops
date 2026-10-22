---
title: "Feature Specification: Phase 22: runtime-certainty-claude-pi-opencode"
description: "Live probes showed that an OpenCode sub-agent and any runtime run from inside a looped session reach the relaunch adapters as if they were the loop's own session. This phase guards both, adds compaction pointers to Pi and OpenCode, and certifies twelve situations live on Claude, Pi and OpenCode."
trigger_phrases:
  - "runtime certainty claude pi opencode"
  - "phase 22 runtime certainty claude pi opencode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 22: runtime-certainty-claude-pi-opencode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/199-relaunch-runtime-certainty` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-fork-nudge-and-precompact-guards |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row Met with live evidence against one recorded commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the Runtime certainty for Claude, Pi and OpenCode specification.

**Scope Boundary**: Claude, Pi and OpenCode only. Cursor, Devin, Codex and Hermes are out of scope by operator decision.

**Dependencies**:
- Phases 019 to 021, which fixed the Claude fork hazards.

**Deliverables**:
- Loop ownership for nested runtimes, the OpenCode sub-agent skip, Pi and OpenCode compaction pointers, missing tests, and a dated live matrix.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A probe on OpenCode 1.19.3 showed that a `task` sub-agent runs as a child session with its own session id. It receives its own system-prompt transforms and its own `session.idle`, and only its `session.created` and `session.updated` events carry `info.parentID`. The plugin keys on the session id alone, so a sub-agent can be nudged on its own fill and can arm a record. Every adapter also treats `SKILLED_LOOP_ID` alone as proof of being inside the loop. A `claude -p`, `pi -p` or `opencode run` started from a looped session's shell inherits that variable, so a nested run can prepare a record and the killer then ends the outer session. Pi and OpenCode have no compaction pointer, so after `keep` and a compaction nothing points the session at its note. The last live hops on Pi and OpenCode predate seven phases of shared-code changes.

### Purpose
Every listed situation is proven on Claude, Pi and OpenCode by an automated test and by a live run against one recorded commit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Loop ownership: a runtime counts as inside the loop only when the wrapper is its parent or grandparent. A nested run is treated as outside the loop.
- The OpenCode plugin skips child sessions that carry `parentID`.
- Compaction pointers for OpenCode (`session.compacted`) and Pi (`session_compact`).
- Missing automated tests: the Claude Stop-side kill switch, Pi re-nudge and stale records, runtime child-process refusal on Pi and OpenCode.
- Live certification of twelve situations on the three runtimes.

### Out of Scope
- Cursor, Devin, Codex and Hermes - operator decision.
- A fork's Claude PreCompact cache write - low harm, documented in phase 021.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Host-runtime and loop-ownership helpers |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | In-loop decision uses ownership |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | prepare and keep use ownership |
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | Arm only for the loop's runtime |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | Ownership at arm, compaction pointer |
| `.opencode/plugins/session-relaunch.js` | Modify | Child-session skip, ownership at arm, compaction pointer |
| Tests beside each file | Modify | Red first |
| `.skilled/hooks/session-relaunch/README.md`, playbooks | Modify | Behavior and dated results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A nested runtime never prepares, arms or receives an in-loop nudge |
| REQ-002 | An OpenCode sub-agent session never nudges, arms or claims |
| REQ-003 | Twelve situations pass live on Claude, Pi and OpenCode against one commit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A Pi or OpenCode session that compacted after `keep` is pointed at its open note |
| REQ-005 | The gaps the coverage map listed have automated tests |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 36-cell live matrix (runtime by situation), all PASS, each with an evidence path.
- **SC-002**: All suites at baseline or better: relaunch 597, OpenCode 42, Pi 40, spec-kit hooks 26, plus the new tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime versions: Claude Code 2.1.306, Pi 1.3.0, OpenCode 1.19.3 | An upgrade can change payloads | Rerun the probes and the matrix after an upgrade |
| Risk | A shim script without `exec` between wrapper and runtime | Med | Ownership allows a grandparent wrapper |
| Risk | `ps` cost on every hook event | Low | Only read when `SKILLED_LOOP_ID` is set; in-process adapters cache it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Outside the loop, no adapter reads the process table.

### Security
- **NFR-S01**: The killer never signals a process that is not the loop's runtime.

### Reliability
- **NFR-R01**: Every adapter stays fail-open: an ownership lookup error means outside the loop, never a crash.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `ps` unavailable or unreadable: treated as outside the loop.
- `SKILLED_LOOP_ID` not a positive integer: outside the loop.

### Error Scenarios
- A nested run started detached (tmux, nohup): not a descendant of the wrapper, so outside the loop.
- Two sessions in one repo: each prepares and claims only its own note.

### State Transitions
- Ctrl-C after arm and before claim: the next start finds no orphaned armed record.
- OpenCode `/new` or Claude `/clear` in the same process: still the loop's runtime, because ownership follows the process.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Six code files, their tests, three docs |
| Risk | 15/25 | Process signalling and shared hook behavior |
| Research | 10/20 | Live probes per runtime |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---



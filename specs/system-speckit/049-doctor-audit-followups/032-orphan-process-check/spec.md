---
title: "Feature Specification: Phase 32: orphan-process-check"
description: "Test runners, tail monitors, stuck searches and executor workers outlive the sessions that started them and hold memory for days. This phase adds a read-only doctor check that lists them, with a reap option that kills only captured PIDs after the operator agrees."
trigger_phrases:
  - "orphan process check"
  - "doctor orphan processes"
  - "reap zombie processes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 32: orphan-process-check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-21 |
| **Branch** | `main` (planning only) |
| **Parent Spec** | ../spec.md |
| **Phase** | 32 of 32 |
| **Predecessor** | 031-changelog-v4003-reality-check |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met or closed by a recorded decision, and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 32** of the Doctor audit followups specification.

**Scope Boundary**: A read-only scan for orphaned helper processes, an informational `/doctor:setup` line, and an opt-in reap of listed PIDs. It never stops intended daemons.

**Dependencies**:
- `ps` on macOS and Linux.
- The `/doctor:setup` workflow and its presentation file.

**Deliverables**:
- `.skilled/commands/doctor/scripts/orphan-process-check.cjs` with tests.
- An informational line in `/doctor:setup`.
- A `--reap` flag that re-verifies each PID's command line before signalling it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-10-21 a manual cleanup found 22 orphaned processes holding about 315 MB: `node --test` runs from removed worktrees, a Pi worker and its child, a harness Python server, test helpers, a `git-live-follow` for a scratch repository, `tail -F` and `grep` monitors, and eight `grep -r` searches stuck on `/private/tmp`. Each had parent PID 1 and outlived its session. Nothing in the doctor commands lists them, so they are found only when memory runs short.

### Purpose
The operator sees orphaned helpers in one line and can reap them safely, without touching the daemons that are meant to stay up.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A scan of processes with parent PID 1 older than a threshold, default 60 minutes, matching known helper patterns: `node --test`, vitest, `tail -F`, `grep -r`, session-relaunch test helpers, `pi`, `codex` and `devin` workers.
- Advisor launchers and `git-live-follow` processes whose checkout or repository no longer exists.
- An allowlist that never reports intended daemons: advisor launchers for existing checkouts, `git-live-follow` for existing repositories, `opencode serve`, the Codex daemon.
- `--json` output, and `--reap` that signals only listed PIDs after re-reading their command line.
- An informational `/doctor:setup` line with the count and total RSS.

### Out of Scope
- Killing anything without the operator's explicit yes.
- Interactive sessions, editors and apps.
- Automatic scheduled reaping.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/orphan-process-check.cjs` | Create | Scan, classify and optional reap |
| `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs` | Create | Fixture `ps` output, allowlist and reap guard tests |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modify | Informational step |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | The orphan line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The scan lists orphaned helper processes with PID, age, RSS and command, and never lists an allowlisted daemon. |
| REQ-002 | `--reap` signals only PIDs from the current scan whose command line still matches, and only after an explicit confirmation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `/doctor:setup` shows one informational line with the orphan count and total RSS, and never fails because of it. |
| REQ-004 | The check runs on macOS and Linux `ps` output. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Run against a fixture of the 2026-10-21 process table, the scan lists the 22 orphans and none of the daemons.
- **SC-002**: `/doctor:setup` prints the line in under a second.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reap kills a process that reused a listed PID | High | Re-read the command line and start time right before each signal |
| Risk | The allowlist misses an intended daemon | Med | Report-only by default; reap needs a yes per run |
| Dependency | `ps` column differences between platforms | Wrong ages | Fixture tests for both |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The scan finishes in under one second on a machine with 1,000 processes.

### Security
- **NFR-S01**: The reap never signals a PID outside the current user's processes.

### Reliability
- **NFR-R01**: A `ps` failure makes the doctor line say the check could not run, never fail the doctor command.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No orphans: the line says none.
- A helper younger than the threshold: not listed.

### Error Scenarios
- A listed PID exits before the reap: reported as gone, not an error.
- A PID reused by another command: skipped with a reason.

### State Transitions
- A helper whose parent is a live terminal multiplexer, not PID 1: not listed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One script, its tests and two doctor assets |
| Risk | 10/25 | A reap path that signals processes |
| Research | 4/20 | Patterns from the 2026-10-21 cleanup |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the age threshold be one value or per pattern?
- Should `/doctor:setup` offer the reap, or only point to the script?
<!-- /ANCHOR:questions -->

---

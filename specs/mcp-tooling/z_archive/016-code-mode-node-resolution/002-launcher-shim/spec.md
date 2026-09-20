---
title: "Feature Specification: code_mode launcher shim"
description: "Front the code_mode server with a launcher that resolves a satisfying interpreter, execs the server, and keeps the entrypoint path visible to the cleanup matchers that hunt orphaned processes."
trigger_phrases:
  - "code mode launcher shim"
  - "mcp launcher exec"
  - "orphan sweeper process identity"
  - "isolated-vm segfault guard"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: code_mode launcher shim

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-resolution-contract |
| **Successor** | 003-host-config-cutover |
| **Handoff Criteria** | The launcher starts the server, and the launched process still carries the server entrypoint path in its command line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the portable Node resolution specification.

**Scope Boundary**: One new executable and its tests. No host configuration points at it yet, so the previous launch path stays live throughout.

**Dependencies**:
- The resolver delivered by 001-resolution-contract

**Deliverables**:
- A launcher that resolves an interpreter and hands off to the server entrypoint
- A refusal path that explains what was needed when no interpreter satisfies
- A test asserting the launched process stays identifiable to the cleanup scripts

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Host configurations currently name an interpreter directly, which is why they had to name an absolute one. Nothing sits between the host and the server entrypoint where a decision could be made.

Introducing that layer is constrained by something already in the repository: two shared cleanup and orphan-sweeper scripts identify this server by matching the entrypoint path in a process command line. A launcher that becomes the visible process, rather than handing off to one, would leave those matchers unable to classify the server they are meant to reap.

### Purpose

Give the launch path a place to make a decision, without changing what the running process looks like to the tools that already watch it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Resolving an interpreter for the server manifest and handing control to the server entrypoint
- A refusal that names the required range, the interpreters found, and how to obtain a satisfying one
- Preserving the entrypoint path in the launched process command line

### Out of Scope

- Changing any host configuration - the cutover is 003, so this phase can be exercised without a live host depending on it
- Changing the cleanup and sweeper matchers - preserving process identity is chosen precisely so they need no edit
- Supervision, respawn or lease behavior - the other two servers front launchers that do this; code_mode does not need it and adding it would widen the risk

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mcp-code-mode-launcher.cjs` | Create | Resolve, then hand off to the server entrypoint |
| `.opencode/bin/mcp-code-mode-launcher.test.cjs` | Create | Handoff, refusal, and process-identity tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A launched server reaches protocol initialization | Sending an initialize request through the launcher returns the same response the direct launch returns today |
| REQ-002 | The entrypoint path remains visible in the launched process command line | The existing cleanup matcher classifies a process started through the launcher |
| REQ-003 | No satisfying interpreter refuses the launch with an actionable message | With the range forced unsatisfiable, the launcher exits non-zero naming the range, and never starts the server |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The launcher adds no measurable startup cost | Resolution completes without executing candidate interpreters, and startup stays within the current launch time |
| REQ-005 | Signals and exit status pass through to the caller | Terminating the launched server yields the server's own exit status to the host |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A host that launches through the launcher behaves the same as one that launches the entrypoint directly under the pinned interpreter.
- **SC-002**: A machine with no satisfying interpreter gets a message naming the requirement, instead of a server that starts and then dies uncatchably on the first tool call.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The launcher becomes the visible process and blinds the cleanup matchers | High | Process identity is an explicit acceptance criterion with its own test, not an assumption |
| Risk | An extra process layer changes signal or exit-status delivery | Medium | Hand off rather than supervise, so the server inherits the launcher's place rather than sitting beneath it |
| Risk | Refusal is silent and looks like a host misconfiguration | Medium | Refusal writes the required range and the candidates it rejected, so the message names the cause |
| Dependency | The resolver from 001 | Low | Delivered and tested before this phase begins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether an operator escape hatch should be able to launch an out-of-range interpreter deliberately, given the failure it invites.
- Whether the refusal should also run when a satisfying interpreter exists but the compiled addon was built against a different one.
<!-- /ANCHOR:questions -->

---

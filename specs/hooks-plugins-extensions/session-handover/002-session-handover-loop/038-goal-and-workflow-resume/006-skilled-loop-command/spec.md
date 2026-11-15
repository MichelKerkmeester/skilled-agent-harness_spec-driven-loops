---
title: "Feature Specification: Phase 6: skilled-loop-command"
description: "The wrapper prints `skilled-loop <runtime>` as the manual claim command, but a shell that sources the shim defines only the runtime functions. The printed command is not found."
trigger_phrases:
  - "skilled loop command"
  - "phase 6 skilled loop command"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: skilled-loop-command

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/358-handover-goal-resume` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-opencode-continuation-hop |
| **Successor** | 007-goal-handover-docs |
| **Handoff Criteria** | Phase 006 is Complete, both shell suites pass, and strict validation prints PASSED. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: Only `.skilled/bin/skilled-loop-shell.sh` and its test change. The wrapper, the relaunch record format and the docs stay unchanged.

**Dependencies**:
- Phase 005 is Complete and its suite passes.
- The shim and the wrapper ship in the same `.skilled/bin` directory.

**Deliverables**:
- A `skilled-loop` function in the shim.
- A test that fails before the function is added.
- The existing shim and printed-text suites still pass.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The wrapper prints `skilled-loop <runtime>` as the manual claim command, and so does `relaunch-core.cjs`. A shell that sources the shim defines `claude`, `pi`, `opencode`, `codex`, `devin` and `cursor-agent`, but not `skilled-loop`. The operator pastes the printed command and gets `command not found`.

### Purpose
Make `skilled-loop` run as typed in a shell that sources the shim.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ zsh -f -c 'source .skilled/bin/skilled-loop-shell.sh; command -v skilled-loop || print missing; type claude'
missing
claude is a shell function from .skilled/bin/skilled-loop-shell.sh
```

The `missing` line is the measured behavior the problem rests on: sourcing the shim defines `claude`, but it does not define `skilled-loop`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `skilled-loop` function to the shim that calls the wrapper with `bash`.
- Forward the runtime and the arguments unchanged.
- Add a test that sources the shim in bash and zsh and asserts the function exists.

### Out of Scope
- Changing the wrapper or its argument parsing - the wrapper already prints and serves the command.
- Changing the printed manual command text - existing tests pin it.
- Documentation changes - the work package names no doc file, and phase 007 has its own doc scope.
- The fixes D4 rules out - the verification refuted or rejected them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop-shell.sh` | Modify | Add the `skilled-loop` function that calls the wrapper with `bash` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modify | Assert that `skilled-loop` exists after sourcing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Sourcing the shim in bash and zsh defines `skilled-loop`, and the function runs the wrapper with `bash` and passes the runtime and arguments through. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The existing shell suite keeps passing, including wrapper resolution, passthrough and snapshot cases in `skilled-loop-shell.test.cjs`. |
| REQ-003 | The printed manual command text for cursor and devin stays unchanged, so `skilled-loop-wrapper-claim-goal.test.cjs:160-170` keeps passing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `zsh -f -c 'source .skilled/bin/skilled-loop-shell.sh; command -v skilled-loop'` prints `skilled-loop`.
- **SC-002**: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0.
- **SC-003**: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.skilled/bin/skilled-loop` wrapper | The function has nothing to call | The wrapper ships in the same directory and is unchanged |
| Risk | A function named `skilled-loop` shadows an installed binary of the same name | Low | The shim already owns the runtime names, and this function is the intended entry point |
| Risk | The function calls a wrapper outside the sourced checkout | Low | The function uses the wrapper path the shim already trusts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The new function adds no work at source time. Sourcing defines it and returns.
- **NFR-P02**: N/A: the shim runs one interactive command, not a service with a throughput target.

### Security
- **NFR-S01**: The function calls the wrapper the shim already trusts. It adds no new trust decision.
- **NFR-S02**: The function reads and writes no credential and no user data.

### Reliability
- **NFR-R01**: The function returns the wrapper's exit status.
- **NFR-R02**: N/A: the shim has no service uptime or error-rate target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A: the function forwards an empty argument list to the wrapper, which owns the default runtime.
- Maximum input: N/A: the function forwards every argument without parsing or buffering.
- Failure path: A shell that did not source the shim still prints `skilled-loop: command not found`. The fix does not change that.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Two files, one function and one test case |
| Risk | 4/25 | A shell function only, no data or auth surface |
| Research | 3/20 | The finding is verified and names the fix |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---

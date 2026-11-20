---
title: "Feature Specification: Phase 55: cross-checkout-root-pinning"
description: "A looped session that runs another checkout's hand-over CLI writes its note where the wrapper never looks, and the wrapper reports it as missing with no command to recover it. This phase pins one root per loop, names an outside note, and makes the shim trust and run the right checkout's wrapper."
trigger_phrases:
  - "cross checkout root pinning"
  - "phase 55 cross checkout root pinning"
  - "handoff note is missing not relaunching"
  - "outside-root handoff note"
  - "skilled-loop rc block"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 55: cross-checkout-root-pinning

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `worktrees/461-handover-cross-checkout-root` |
| **Parent Spec** | ../spec.md |
| **Phase** | 55 of 55 |
| **Predecessor** | 054-handover-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Node suite, OpenCode plugin suite and hooks vitest all pass, and the new cross-checkout tests fail on the old code and pass on the new |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 55** of the session-handover loop. It takes the six fixes a downstream project that vendors Skilled sent after its relaunch failed across two checkouts.

**Scope Boundary**: the wrapper `.skilled/bin/skilled-loop`, the shim `.skilled/bin/skilled-loop-shell.sh`, the hand-over CLI's `consume`, the nudge module's printed command, the Claude stop-arm notice, their tests and the docs that describe them.

**Dependencies**:
- `nudge.resolveRepoRoot()` already honors `SESSION_HANDOVER_REPO_ROOT`, and every root-dependent CLI path goes through it.

**Deliverables**:
- One repository root per loop, an absolute CLI command, an `outside-root` consume state with a pinned claim command, shim trust that survives a second shim, a `skilled-loop` function that prefers the current directory's trusted wrapper, and a documented startup block.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator launched `claude` from the Skilled checkout while the session worked in a project with its own vendored Skilled. The model ran the relative `node .skilled/hooks/session-handover/bin/session-handover.cjs prepare`, which resolved to the project's CLI and wrote the note under the project's handoffs directory. The wrapper's `consume` rejected that note as outside its own root and printed `warning: the handoff note is missing; not relaunching` with no command to recover the hop.

### Purpose
A looped session plans, prepares and consumes its note under one root whichever CLI copy it runs, and a note that still lands elsewhere is named with a claim command that works.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd /tmp && node .skilled/hooks/session-handover/bin/session-handover.cjs --help
Error: Cannot find module '/private/tmp/.skilled/hooks/session-handover/bin/session-handover.cjs'
exit=1

$ node --test skilled-loop-wrapper-repo-root.test.cjs   # against the unchanged wrapper
ℹ pass 1
ℹ fail 3
    actual: 'warning: the handoff note is missing; not relaunching\n'

$ node --test --test-name-pattern='second sourced shim|prefers the trusted wrapper' skilled-loop-shell.test.cjs   # unchanged shim
ℹ pass 0
ℹ fail 4
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Export `SESSION_HANDOVER_REPO_ROOT` from the wrapper as its own real checkout root, keeping a caller's value except one inherited from an outer loop.
- Print the CLI by its absolute path from the nudge module, so every adapter and the Claude stop-arm notice name the planning checkout's CLI.
- Report an outside note from `consume` as `outside-root` with both roots, and have the wrapper print a claim command pinned to the note's root.
- Keep an earlier checkout trusted when a second shim is sourced, and run the current directory's trusted wrapper from the `skilled-loop` function.
- Document a marked shell startup block, its removal and the two-checkout order.

### Out of Scope
- The downstream project's own installer and startup block - it belongs to that project.
- The alignment checker's strict-mode window - a sourced shim cannot set strict mode and the checker exempts sourced files by path only, so the fix belongs to sk-code and is raised separately.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | Pin the root, handle `outside-root` |
| `.skilled/bin/skilled-loop-shell.sh` | Modify | Carry trust across shims, prefer the current wrapper |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modify | `outside-root` consume state with both roots |
| `.skilled/hooks/session-handover/lib/nudge.cjs` | Modify | Absolute `CLI_COMMAND`, cancel command through it |
| `.skilled/hooks/session-handover/claude/handover-stop-arm.mjs` | Modify | Cancel notice through `CLI_COMMAND` |
| `.skilled/hooks/session-handover/tests/` | Modify/Create | Regression tests for each fix |
| `.skilled/bin/README.md`, `runtime-behavior.md`, `handoff-protocol.md`, `ENV-REFERENCE.md` | Modify | Describe the new behavior and the startup block |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The wrapper exports one root for the loop | `skilled-loop-wrapper-repo-root.test.cjs` shows the runtime sees the wrapper's real root, a caller's root kept, and an outer loop's root replaced |
| REQ-002 | An outside note is named and recoverable | The same file shows stderr naming the note's root and the loop's root, and stdout printing `SESSION_HANDOVER_REPO_ROOT=<note root> skilled-loop claude "..."` |
| REQ-003 | The printed CLI command runs from any directory | `nudge.test.cjs` runs `CLI_COMMAND --help` from the temp directory and gets exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A second shim keeps the first checkout trusted | `skilled-loop-shell.test.cjs` resolves each checkout's own wrapper in both source orders, under bash and zsh |
| REQ-005 | `skilled-loop` runs the wrapper for where the operator stands | The same file shows the current checkout's wrapper in each checkout and the last-sourced one elsewhere |
| REQ-006 | A canonical startup block is documented | `runtime-behavior.md` section 7 holds the marked block, the removal command and the two-checkout order, and the block sources in bash and zsh |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-handover/tests/*.test.cjs` passes every test, up from the 1055 baseline by the new cases.
- **SC-002**: The new tests fail on the unchanged code with the symptoms in Measured Behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `resolveRepoRoot()` as the one root reader | High: a path read some other way would ignore the pin | Prepare already accepts the note's own `cwd` as a spec-folder root, relaunch state lives in a per-user directory and hook flags come from the CLI's location, so only the handoffs directory moves |
| Risk | A wrapper started inside a loop inherits the outer root | Med: notes would land in the wrong checkout | The wrapper replaces a root it inherited while `SKILLED_LOOP_ID` was set, and a test covers it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

---
title: "Implementation Plan: Phase 6: skilled-loop-command"
description: "Add one `skilled-loop` function to the shell shim and one test that proves it is defined after sourcing. The wrapper and the printed command text stay unchanged."
trigger_phrases:
  - "skilled loop command plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: skilled-loop-command

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and zsh, Node.js test runner |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node:test` in `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` |

### Overview
The plan adds one `skilled-loop` function to `.skilled/bin/skilled-loop-shell.sh`. The function calls the trusted `.skilled/bin/skilled-loop` wrapper with `bash` and forwards its arguments. A new test in the shell suite sources the shim under bash and zsh and asserts the function exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shell shim function.

### Key Components
- **`skilled-loop-shell.sh`**: Defines the runtime functions and the new `skilled-loop` entry point.
- **`.skilled/bin/skilled-loop`**: Receives the call and relaunches the runtime. Unchanged.
- **`skilled-loop-shell.test.cjs`**: Proves the function exists and the old behavior holds.

### Data Flow
The operator types `skilled-loop <runtime> <args>`. The function calls `bash <wrapper> <runtime> <args>`. The wrapper consumes the handoff and starts the runtime.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/skilled-loop-shell.sh` | Defines the shell entry points | update | New case in `skilled-loop-shell.test.cjs` |
| `.skilled/bin/skilled-loop` | Receives the call and relaunches | unchanged | `skilled-loop-wrapper-claim-goal.test.cjs` |
| `relaunch-core.cjs` manual command | Prints `skilled-loop <runtime>` | unchanged | `skilled-loop-wrapper-claim-goal.test.cjs:160-170` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Tests the shim | update | New case plus the existing suite |

Inventory:
- Same-class producers: `rg -n '^function ' .skilled/bin/skilled-loop-shell.sh` lists the six runtime functions and the new `skilled-loop` function.
- Consumers of the printed command: `rg -n 'build_manual_command_template|manualClaimCommand' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` lists the two producers.
- Matrix axes: two shells (bash and zsh) by two states (function defined and function absent). The test loops over both shells.
- Algorithm invariant: N/A: the change adds no path, redaction, parser or resolver branch.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the function block in `.skilled/bin/skilled-loop-shell.sh` and the current shell test. Implementation adds the failing test, then the `skilled-loop` function. Verification runs the shell suite, the printed-text suite and the packet validator.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Shim function definition in bash and zsh | `node:test` |
| Integration | Manual command text for cursor and devin | `node:test` |
| Manual | Source the shim and run `command -v skilled-loop` | zsh and bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` and `zsh` | Internal | Green | The test cannot cover the missing shell |
| `node` and `node:test` | Internal | Green | The suite cannot run |
| `.skilled/bin/skilled-loop` | Internal | Green | The function has nothing to call |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The function changes a launch outside the wrapper, or a guard suite fails.
- **Procedure**: Revert the phase commit on the worktree branch. No record or data migration is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

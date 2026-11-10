---
title: "Implementation Plan: Phase 13: live-hop-and-notice-reason"
description: "Put the timeout and the ignored template's reason into the killer's notice, start every interactive runtime launch under skilled-loop through a sourced shell shim, stop the nudge outside the loop, update the docs, then run the live hops."
trigger_phrases:
  - "live hop and notice reason plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: live-hop-and-notice-reason

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, AppleScript through `osascript`, Node built-ins only, a shell file sourced by bash 3.2 and zsh |
| **Framework** | None |
| **Storage** | `relaunch.log` in the runtime state directory |
| **Testing** | `node --test` on the concern's test files and the OpenCode plugin suite, vitest for Pi, shellcheck for the shell files |

### Overview
Two lanes. A worker extends the two existing notice tests, sees them fail, then changes `notifyManualClaim` and the two docs. A worker then adds the shell shim and the outside-loop decision, each test first, and updates the docs. The orchestrator runs the live hops in tmux and records their evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The notice is the killer's only channel to an operator who is not reading the log, so the reason the log carries also goes into the notice.

### Key Components
- **`notifyManualClaim`**: asks `core.manualTemplateProblem` once, logs the problem and, when there is one, appends a JSON-escaped `subtitle` to the `display notification` line.
- **The notice title**: `Session relaunch needs attention (killer timed out)`. `recordTimeout` is its only caller, so every notice comes from a timeout.
- **`skilled_loop_resolve`** (shell shim): prints the nearest `.skilled/bin/skilled-loop` at or above `$PWD` when `SKILLED_LOOP_ID` is unset and the arguments open an interactive session, or nothing. Its body runs in a subshell under `set -uo pipefail`, so the operator's shell keeps its own options. The first argument is checked against the runtime's subcommands, and every argument before `--` against its non-interactive flags.
- **The runtime functions**: `claude`, `pi`, `opencode`, `codex`, `hermes`, `devin` and `cursor-agent` add the terminal check on stdin and stdout, then run `bash <wrapper> <arm> "$@"` or `command <binary> "$@"`. They use the `function` keyword so zsh does not expand an alias of the same name while reading them.
- **`insideLoop`** in `nudge.cjs`: `nudgeDecision` returns `outside-loop` after the threshold check when `SKILLED_LOOP_ID` is unset or empty, the same test prepare applies before it exits 3. Every adapter already calls `nudgeDecision`, so none of them changes.

### Data Flow
`supervise` reaches the deadline or survives the grace period, `recordTimeout` disarms the record and calls `notifyManualClaim`, which builds the command, the title and the optional subtitle and makes one best-effort `osascript` call.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `notifyManualClaim` (killer) | Logs the template problem, sends the plain command | update: timeout title, problem subtitle | killer tests |
| Concern README | Describes the notice and `killer-manual-template` | update | `validate_document.py` |
| Claude playbook timeout scenario | Matches the notice title | update: title match and evidence | scenario run, `validate_document.py` |
| `nudgeDecision` (shared core) | Decides every adapter's nudge | update: quiet outside the loop | conformance cases, `nudge.test.cjs`, Pi vitest |
| Claude, Codex, Hermes, Pi and OpenCode adapters | Call `nudgeDecision` | unchanged code, OpenCode comment only | conformance cases |
| `.skilled/bin/skilled-loop-shell.sh` | New | create | `skilled-loop-shell.test.cjs`, shellcheck, drift guards |
| Docs that describe starting the loop or the nudge | Describe the wrapper and the nudge | update | `validate_document.py`, playbook package validator, catalog checker, hvr_scan |

Required inventories:
- Same-class producers: `rg -n "notifyManualClaim|osascript" .skilled/hooks/session-relaunch .opencode/plugins` lists one caller and one `osascript` call.
- Consumers of the notice text: `rg -n "Session relaunch needs attention" .skilled .opencode` lists the killer and the Claude playbook scenario.
- Callers of the nudge decision: `rg -n "nudgeDecision|handoffText\(" -g '!**/tests/**' -g '!*.test.*'` lists the Claude, Codex, Hermes, Pi and OpenCode adapters and nothing else.
- Docs with the old wording: `rg -n -i "outside (the )?\`?skilled-loop|outside (a|the) loop|keeps (nudging|pushing)|planned note file" -g '*.md' -g '!specs/**'` finds only the new wording.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The killer's notice, with `osascript` stubbed | `node --test` |
| Syntax | The AppleScript line with a title and a subtitle | `osacompile` (compiles, displays nothing) |
| Red proof | The pre-phase killer swapped in, then restored | `git show`, `cmp` |
| Live | One Claude hop under `skilled-loop` in tmux | orchestrator |
| Unit | Shim resolution under bash and zsh through a symlinked `.skilled` | `node --test` |
| Terminal | The runtime function's hand-off on a pseudo-terminal | `script -q /dev/null` with stub binaries |
| Conformance | No nudge outside the loop on every adapter | `node --test`, vitest |
| Live | Plain runtime commands through the shim in a repository that links `.skilled` | orchestrator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `core.manualTemplateProblem` | Internal | Green | The subtitle would have no reason to show |
| Claude Code login and tmux | External | Green | The live-hop row would stay Unmet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite fails after merge, or a notice stops appearing.
- **Procedure**: revert the phase commit. Records, notes and log lines keep their format.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Red tests ──► Notice change ──► Docs ──► Verify
Live hop (orchestrator) ─────────────────► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Notice change | Red tests | Docs, Verify |
| Docs | Notice change | Verify |
| Live hop | None | Verify |
| Verify | All above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Two existing tests to extend |
| Core Implementation | Low | One function |
| Verification | Low | One gate run, a red swap and one live hop |
| **Total** | | **About an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: `SYSTEM_SESSION_RELAUNCH_DISABLED` already turns the concern off
- [x] Monitoring alerts set: `killer-timeout` and `killer-manual-template` appear in `relaunch.log`

### Rollback Procedure
1. Revert the phase commit.
2. Rerun the session-relaunch suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

---
title: "Implementation Plan: Phase 15: pi-mode-and-descendant-walk"
description: "Confirm that the Pi plan-build mode is readable from the session branch, then carry it through the arm, consume and the wrapper, test first. Record the descendant walk as declined, because the worker it targets is re-parented to pid 1 before prepare runs."
trigger_phrases:
  - "pi mode and descendant walk plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: pi-mode-and-descendant-walk

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the Pi adapter, CommonJS for the core and CLI, Bash for `skilled-loop` |
| **Framework** | Pi extension API, Node built-in modules |
| **Storage** | The JSON relaunch record in the relaunch state directory |
| **Testing** | Vitest for the Pi adapter, `node:test` for the core, CLI and wrapper |

### Overview
Rank 13 adds a `mode` setting that runs from the Pi adapter through the arm and `consume` to the wrapper's launch line, after one confirmation step that can still decline it. Rank 14 changes no code. Its decline and the evidence behind it go into `decision-record.md` as ADR-002. The proof is four must-fail tests, the guard suites and one strict validation run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator gave the greenlight for this phase
- [ ] `scratch/confirm-pi-mode.txt` holds a `rank 13:` verdict line
- [ ] The five test files pass at baseline

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0 with no failure
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`
- [ ] `rg -n '^### ADR-002' decision-record.md` prints one line
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One new record field.

### Key Components
- **`pi/session-relaunch.ts` `liveSettings`** (`:419`): reads the last `pi-plan-build-state` entry from the session branch.
- **`lib/relaunch-core.cjs` `armLocked`** (`:1011`): keeps `mode` when it is `plan` or `build`.
- **`bin/session-relaunch.cjs` `consume`** (`:793`): prints `mode` beside model, provider and effort.
- **`.skilled/bin/skilled-loop`**: drops the launch `--plan` and `--build` that `skilled_loop_replay_takes_none` (`:546`) lets into `replayed_extra_arguments` (`:969-971`), and adds the consumed mode in the Pi branch of `build_relaunch_arguments` (`:620-635`).

### Data Flow
The plan-build extension appends its state, with `selectedMode`, to the session branch whenever the mode changes (`.pi/git/github.com/janvitos/pi-plan-build/index.ts:228`, `:466`). At `agent_settled` the relaunch adapter reads the last such entry and passes `mode` in the arm settings. The arm keeps it, `consume` prints it, and the wrapper launches the receiver with `--plan` or `--build`. The receiver has no branch entry yet, so the extension takes the flag (`index.ts:1378-1379`).

### Rank 14 Decision
The recommendation is decline. The live run of 2026-11-13 started a worker with `nohup ... &`, and when `prepare` exited 0 the worker's parent pid was 1 (`../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/summary.txt:12`). A walk from the runtime pid never reaches it.

A walk would still catch these cases:
- A shell below a live non-shell child of the runtime, such as a `node` script that runs `sh -c` and waits. Today only a direct child is checked (`bin/session-relaunch.cjs:278`).
- A worker whose tool shell is still alive. The direct shell check already refuses that shell, so the walk adds nothing.
- A Claude background task. The Stop hook already defers while `payload.background_tasks` is non-empty (`claude/stop-arm.mjs:120-121`), so the walk adds nothing.

A walk that matched any program, not only shells, would refuse every hop. A live Claude runtime keeps `node .skilled/bin/mcp-code-mode-launcher.cjs` and `caffeinate -i -t 300` as direct children (spec.md Measured Behavior). The worker the session knows it started is covered by phase 009's `Running workers:` line. One narrow case is left uncovered, so the cost of a medium to large change is not earned.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pi/session-relaunch.ts` `liveSettings` | Produces model, provider and effort for the arm | update | `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` |
| `lib/relaunch-core.cjs` `armLocked` | Filters the arm settings to three keys | update | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` |
| `bin/session-relaunch.cjs` `consume` | Prints the record's settings to the wrapper | update | `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` |
| `.skilled/bin/skilled-loop` | Replays launch flags and consumed settings | update | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` |
| `bin/session-relaunch.cjs` `shellChildOfRuntime` and `refuseForShellChild` (`:270-312`) | The running work check of `prepare` | unchanged | `git diff -U0 -- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` shows no hunk inside lines 270-312 |
| Claude, Codex, Cursor, Devin and OpenCode arm paths | Pass no `mode` | not a consumer | `rg -n "settings:" .skilled/hooks/session-relaunch .opencode/plugins/session-relaunch.js` shows no `mode` key outside the Pi adapter |

Required inventories:
- Finding classes: the Pi mode is `cross-consumer`, because four layers carry it. The descendant walk is `matrix/evidence`, closed by a recorded decision.
- Same-class producers: `rg -n "for \(const key of \['model', 'provider', 'effort'\]\)" .skilled/hooks/session-relaunch` prints the two lists that gain `mode`.
- Consumers of changed symbols: `rg -n 'consumed_field' .skilled/bin/skilled-loop` lists every wrapper read of the consume output.
- Matrix axes: runtime (pi, other), consumed mode (plan, build, absent, other value), launch flag (none, `--plan`, `--build`) and branch (entry present, absent, `getBranch` missing).
- Algorithm invariant: only the literals `plan` and `build` reach the launch line, and the launch line holds at most one mode flag.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the plan-build entry and the `--plan` launch into `scratch/confirm-pi-mode.txt` and records the baseline of the five test files. Implementation writes ADR-002, then builds the Pi mode carry test first in the order adapter, core, CLI, wrapper, README, or writes ADR-001 when Setup declined it. Verification runs the suites, the guard tests and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The adapter mode read, the arm filter and the consume output | Vitest and `node:test` |
| Integration | The wrapper launch line for a Pi hop | `node:test` with `tests/skilled-loop-wrapper-harness.cjs` |
| Manual | One Pi launch through `skilled-loop` with `--plan`, in Setup only | Terminal |

Each of the four must-fail tests runs alone first and must fail on its assertion, with the run saved in `scratch/red.txt`. After the source edit the same command must pass, saved in `scratch/green.txt`. The full gate is `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` plus the Vitest run of the Pi adapter.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator greenlight | Internal | Red | Nothing is built |
| `@janvitos/pi-plan-build` at `51a97327` | External | Green | The carry has no source to read, and rank 13 is declined |
| A Pi binary for the one Setup launch | External | Yellow | REQ-001 cannot confirm the flag, and rank 13 is declined |
| Vitest and `node:test` | Internal | Green | No test can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a Pi hop fails to start because of the mode flag, or a guard test fails after the change.
- **Procedure**: revert the phase's one local commit. The record gains an optional key only, so an older wrapper ignores it and no state needs migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator greenlight | Implementation |
| Implementation | The `rank 13:` verdict in `scratch/confirm-pi-mode.txt` | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

---
title: "Implementation Plan: Phase 16: receiver-claim-under-goal"
description: "Measure the Claude goal receiver's claim rate under a goal that allows other work in ten live hops, then take the decision gate. On a skipped claim, append one claim line after the goal slice in the start prompt, test first, and prove it with ten live hops under each goal."
trigger_phrases:
  - "receiver claim under goal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: receiver-claim-under-goal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS and ESM hooks) and bash (the `skilled-loop` wrapper and the harness) |
| **Framework** | None, Node built-in modules |
| **Storage** | Markdown handoff notes with YAML frontmatter, `relaunch.log` and `hop-history.log` in the relaunch state directory |
| **Testing** | `node:test` with `node:assert/strict`, and live hops in tmux through the harness copy |

### Overview
The phase first runs ten live goal hops under a goal that allows other work, from a copy of the 028 harness, and counts the receivers that claim. Ten of ten closes the phase with no code change. Any skip builds change A: the wrapper appends one claim line after the goal slice, so the claim becomes part of the goal condition, and ten live hops under each goal prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator gave the greenlight to start
- [ ] `claude --version` prints `2.1.323 (Claude Code)`, or the new version is recorded in `goal.md` before the first run
- [ ] `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/make-goal.cjs` prints the path
- [ ] On the build branch, `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 before the first edit

### Definition of Done
- [ ] All acceptance criteria met, or waived by a decision record on the close branch
- [ ] `goal.md` section 4 holds the decision gate row with the claim count out of ten
- [ ] On the build branch, the four test files exit 0 with `fail 0` and all twenty runs under `scratch/live-after/` end with `status: done`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure, gate, then patch.

### Key Components
- **`scratch/harness/` (copy)**: runs a live hop and keeps its evidence. Its `make-goal.cjs` gains an `open` goal so a receiver is not told to do nothing but PONG. Without it the rate under a real goal cannot be measured.
- **`.skilled/hooks/session-relaunch/lib/goal-handover.cjs`**: build branch. `renderGoalSlice` (`:95-138`) owns the 4,000-character check (`:21`, `:132`), so the claim line joins there, where the limit is checked once for the whole text.
- **`.skilled/bin/skilled-loop`**: build branch. `render_goal_slice` (`:332-354`) passes the seed to the helper, and the two callers (`:1026-1031` and `:1215-1219`) already hold the seed in `first_launch_seed` and `seed`.

### Data Flow
Today the wrapper renders the slice, sends `/goal <slice>` as the start prompt and exports the seed as `SKILLED_LOOP_CLAIM_SEED` (`skilled-loop:1217-1219`). The `SessionStart` hook reads that variable and emits the claim as start context under `GOAL_START_LEAD` (`compact-pointer.mjs:40-42`, `:154-157`). Claude Code's goal Stop check then sends the goal condition back on each blocked turn end, and pauses the goal after nine (playbook line 768). The failing receivers followed the condition and never the start context. After change A the condition itself ends with the claim line, so every goal turn names the claim. The start context stays as it is, and on the next hop the slice is read fresh from `goal.md` (`goal-handover.cjs:78-80`), so the line never travels on.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/goal-handover.cjs` `renderGoalSlice` | Renders and checks the slice | update on the build branch | `node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` |
| `bin/skilled-loop` `render_goal_slice` and its two callers | Build the `/goal` start prompt | update on the build branch | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` |
| `lib/relaunch-core.cjs` `claudeGoalPacketResult` | Reads the first non-empty line of the goal condition as the headline (`:624`) | unchanged, pinned by a new test | `node --test --test-name-pattern 'ends with the claim line' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` |
| `claude/compact-pointer.mjs` `claimAfterGoalStart` | Emits the claim as start context (`:136-158`) | unchanged | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'delivers the claim at the start of a goal-command receiver' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` |
| `bin/session-relaunch.cjs` `claim` | Takes the session id from `CLAUDE_CODE_SESSION_ID` when `--session` is absent (`:661-662`) | not a consumer, the line carries the seed and no session id | `rg -n 'CLAUDE_CODE_SESSION_ID' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` |
| `.skilled/hooks/session-relaunch/README.md` line 183 | Says only the `chat_slice` is sent | update on the build branch | `rg -n 'chat_slice' .skilled/hooks/session-relaunch/README.md` |
| Claude playbook GR-1 | Documents the goal hop | not changed here, phase 017 owns it | none in this phase |

Required inventories:
- Finding class: `matrix/evidence` for the rate, then `instance-only` for change A, since one helper builds the one goal start prompt.
- Same-class producers: `rg -n '"/goal ' .skilled/bin/skilled-loop` prints the two start-prompt lines, `:1029` and `:1217`.
- Consumers of changed symbols: `rg -n 'renderGoalSlice|render_goal_slice' .skilled .opencode` lists the helper, the wrapper and the tests.
- Matrix axes: goal (`pong`, `open`), slice size (3,500 and 3,990), branch (close, build) and path (hop, manual claim).
- Algorithm invariant: the goal text's first non-empty line is the slice's first non-empty line, and the whole text is at most 4,000 characters.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup copies the 028 harness into `scratch/harness/`, adds the `open` goal mode and records the baseline. Implementation runs ten live hops under the `open` goal, takes the decision gate and, on a skip, builds change A test first in `goal-handover.cjs` and `skilled-loop`. Verification runs the four test files, twenty live hops under the two goals on the build branch, and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The claim line join, the limit fallback and the packet search with the line | `node:test` |
| Integration | The wrapper start prompt on the hop path and the manual-claim path | `node:test` with the wrapper harness |
| Manual | Live goal hops in tmux, ten before the gate and twenty after a build | The harness copy, `claude` |

The four must-fail tests run first as `env -u AI_SESSION_CHILD node --test --test-name-pattern '<title>' <file>` and each must exit 1 with its assertion. The relaunch-core search test may pass at once, because it pins behaviour the change must keep. After the edit the same command must exit 0 with `fail 0`. A live run passes when its `history.txt` holds a `claimed` line and its `note-final.md` says `status: done`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The 028 harness | Internal | Green | No live run can start |
| `tmux`, `node`, `claude` | External | Green | No live run can start |
| Claude Code 2.1.323 and `claude-sonnet-5-5` | External | Yellow | A newer version makes the two run sets incomparable, so the version is recorded per run |
| Phases 011, 012 and 014 | Internal | Yellow | They also edit `skilled-loop` or `stop-arm.mjs`, so the build waits for them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a guard test in REQ-010 fails, the Claude goal search stops finding a packet, or a live run after the build leaves the note `open`.
- **Procedure**: revert the build's one local commit. No record, data or config changes, and the harness copy lives only in this phase's `scratch/`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Live runs ──► Gate ──► (build branch) Change A ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator greenlight | Live runs |
| Live runs | Setup | Gate |
| Gate | Live runs | Change A or close |
| Change A | Gate on a skip, phases 011, 012 and 014 built | Verification |
| Verification | Change A, or the gate on ten of ten | Close |
<!-- /ANCHOR:phase-deps -->

---

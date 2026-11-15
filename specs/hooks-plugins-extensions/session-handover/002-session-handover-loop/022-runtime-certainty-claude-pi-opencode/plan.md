---
title: "Implementation Plan: Phase 22: runtime-certainty-claude-pi-opencode"
description: "Certify the session relaunch loop on Claude, Pi and OpenCode by running thirteen situations live per runtime against recorded commits, fixing every defect a live run exposes with a failing test first."
trigger_phrases:
  - "runtime certainty claude pi opencode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 22: runtime-certainty-claude-pi-opencode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ESM), TypeScript for the Pi extension, bash and zsh for the wrapper and shim |
| **Framework** | Claude Code hooks, the Pi 1.3.0 extension API, the OpenCode 1.19.3 plugin API |
| **Storage** | None. Relaunch records, nudge state and `relaunch.log` live in the runtime state directory, notes under `.skilled/skills/.state/session-relaunch/handoffs/` |
| **Testing** | `node --test`, vitest, `tsc --noEmit`, shellcheck, live tmux runs |

### Overview
Every situation in the matrix gets an automated test and a live tmux run on Claude, Pi and OpenCode against a recorded commit, with the raw evidence on disk. Probes come first, so each fix keys on an observed payload rather than a guess. Each defect a live run exposes is fixed with a test that fails first, then the affected rows run again on the fixed commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met, waived or superseded by a recorded decision
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared core with thin per-runtime adapters. The decisions live once in `lib/relaunch-core.cjs` and `lib/nudge.cjs`, and each adapter maps its host's events onto them.

### Key Components
- **`lib/relaunch-core.cjs`**: records, arming, unarming, logging and the nested-run check (`hostRuntimePid`, `nestedUnderLoop`, `dropNestedLoop`).
- **`lib/nudge.cjs`**: threshold levels, nudge text and the planned note path.
- **`bin/session-relaunch.cjs`**: the `prepare`, `keep`, `claim` and `complete` commands, including the live shell-child check.
- **`lib/killer.cjs`**: waits for an idle session, then signals it so the wrapper can relaunch.
- **Adapters**: `claude/*.mjs`, `pi/session-relaunch.ts`, `.opencode/plugins/session-relaunch.js`.
- **`.skilled/bin/skilled-loop` and `skilled-loop-shell.sh`**: the wrapper and the shell shim.

### Data Flow
An adapter reads the context fill and nudges. The session writes a note and runs `prepare`, which writes a pending record. The adapter arms the record at its stop event and starts the killer. The killer signals an idle session, the wrapper consumes the record and starts the runtime again with a claim seed, and the fresh session claims and completes the note.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/relaunch-core.cjs` nested-run check | Decides whether a host runtime is nested under the loop | Added | `relaunch-core.test.cjs`, live S13 on Claude and Pi |
| `lib/nudge.cjs` `plannedNotePath`, `openNotePathFor` | Name and find a session's note | Full session id in new names, legacy eight-character names still read | `nudge.test.cjs`, adapter path tests on Claude, Codex, Hermes, Pi and OpenCode, live S9 |
| `.opencode/plugins/session-relaunch.js` | OpenCode adapter | Child-session skip, compaction pointer, arm withdrawal on a new user message | Plugin tests, live S3, S6, S8 |
| `pi/session-relaunch.ts` | Pi adapter | Compaction pointer, nested-run drop, arm withdrawal on `agent_start` | Pi vitest, `tsc`, live S3, S6, S13 |
| `claude/context-nudge.mjs`, `claude/stop-arm.mjs`, `bin/session-relaunch.cjs` | Claude adapter and CLI | Nested-run drop | Adapter and CLI tests, live S13 |
| `.skilled/bin/skilled-loop` | Wrapper | Warns when the relaunched session ends before claiming | `skilled-loop.test.cjs`, live S12 |
| `.skilled/bin/skilled-loop-shell.sh` | Shell shim | Plain helper names that survive a tool-shell snapshot | `skilled-loop-shell.test.cjs` snapshot replay for bash and zsh |
| `.opencode/plugins/tests/plugin-inventory.json` | Lists events the v2 bridge does not map | `session.updated` listed | `plugin-inventory.test.cjs` |

Matrix axes: three runtimes (Claude, Pi, OpenCode) by thirteen situations (S1 to S13), 39 cells. Pi has no sub-agent, so S8 is not applicable there.
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
| Unit | Core, nudge, CLI, killer, wrapper and adapter decisions | `node --test`, vitest |
| Integration | Real process chains for nested runs, shim snapshot replay in bash and zsh | `node --test` with `tests/fixtures/nested-run.cjs`, shell subprocesses |
| Manual | S1 to S13 live per runtime in tmux, with isolated `XDG_RUNTIME_DIR` per run | tmux, `relaunch.log`, note frontmatter, pane captures |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude Code 2.1.306 to 2.1.308 | External | Green | Hook payload changes would invalidate the Claude rows |
| Pi 1.3.0 | External | Green | Same for the Pi rows; on 1.4.0, S1, S3 and S6 were rerun and passed |
| OpenCode 1.19.3 | External | Green | Same for the OpenCode rows |
| `openai/gpt-6-luna` through Pi and OpenCode | External | Yellow | The model sometimes needs the evidence path resent and refuses a nested self-run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hop that loses work or kills a busy session after this change ships.
- **Procedure**: Revert the phase's commits on main with `git revert`, newest first, then rerun the relaunch suites. `SYSTEM_SESSION_RELAUNCH_DISABLED=1` turns the concern off at once.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup and probes) ──► Phase 2 (Fixes, test first) ──► Phase 3 (Live matrix, docs, closure)
                                        ▲                               │
                                        └──── a live failure loops back ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and probes | None | Fixes |
| Fixes | Setup and probes | Live matrix |
| Live matrix, docs, closure | Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and probes | Med | 1-2 hours |
| Fixes | Med | 3-5 hours |
| Live matrix and docs | High | 5-7 hours |
| **Total** | | **9-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): none needed, no data changes
- [x] Feature flag configured: `SYSTEM_SESSION_RELAUNCH_DISABLED` already exists
- [x] Monitoring alerts set: `relaunch.log` records every lifecycle event

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` to stop nudges, arms and relaunches at once.
2. `git revert` the phase's commits on main, newest first.
3. Rerun `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` and the plugin and Pi suites.
4. Tell the operator which notes are open, using `session-relaunch.cjs history`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Notes under the old eight-character names are still read after the change and after a revert.
<!-- /ANCHOR:enhanced-rollback -->

---

---
title: "Implementation Plan: Phase 9: nudge-note-lines"
description: "Change the handoff nudge, the seed text and one prepare check so a hop names its running workers, its scheduled tasks and its added directories, and stops a fan-out runner before it gives up the lock. Test first, one source function at a time."
trigger_phrases:
  - "nudge note lines plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: nudge-note-lines

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS |
| **Framework** | None, Node built-in modules |
| **Storage** | Markdown handoff notes with flat YAML frontmatter |
| **Testing** | `node:test` with `node:assert/strict`, plus one existing `vitest` case in the deep-loop runtime |

### Overview
Two source files change: `lib/nudge.cjs` gets new text in `handoffText` and `seedText`, and `bin/session-relaunch.cjs` gets one check in `validatedNote` that only `prepare` turns on. The `/speckit:handoff` template follows the nudge so its notes still pass. Each change starts with a test that fails, and the proof is the relaunch and plugin suites plus strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The operator gave the greenlight to build
- [ ] T001 and T002 recorded their confirmation in `goal.md` section 4

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Text contract plus gate.

### Key Components
- **`handoffText` in `lib/nudge.cjs:134-233`**: the sender's instructions. The In-flight instruction at `:183-185` gains three lines, and the deep-loop step at `:199-203` gains the runner stop.
- **`seedText` in `lib/nudge.cjs:236-306`**: the receiver's steps. A worker check goes in before the `Active command:` step at `:279-283`, and two hop-only steps go in after it, guarded by the `afterCompaction` flag the function already takes at `:241`.
- **`validatedNote` in `bin/session-relaunch.cjs:415-458`**: the shared note check of `prepare` (`:516`) and `keep` (`:601`). It gains an option `requireRunningWorkers`, read after `core.validateHandoff` at `:419` and before the goal packet write at `:456`.
- **`.skilled/commands/speckit/handoff.md`**: the manual note template (`:116`, `:132-133`) and Step 4 (`:136-144`) that mirror the nudge.

### Data Flow
A runtime adapter prints `handoffText`, so the session writes the three lines and stops its runner before it releases the lock. `prepare` parses the note, refuses it when In-flight state lacks a usable `Running workers:` line, and otherwise records the goal and arms the hop. The receiver gets `seedText` through the claim seed, checks each listed pid, then runs the active command again only when no listed worker is alive, then recreates scheduled tasks and re-adds directories.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/nudge.cjs` `handoffText` | Produces the note contract every adapter prints | update | `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` |
| `lib/nudge.cjs` `seedText` | Produces the receiver steps | update | `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` |
| `bin/session-relaunch.cjs` `validatedNote` and `prepare` | Gate on the note before a hop arms | update | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` |
| `bin/session-relaunch.cjs` `keep` | Calls the same `validatedNote` | unchanged | Test `keep accepts a note with no Running workers line` |
| `lib/relaunch-core.cjs` `validateHandoff` and `HANDOFF_SECTIONS` | Section check shared with the nudge's section list | unchanged | Test `handoff text asks for exactly the sections the core validates` |
| `.skilled/commands/speckit/handoff.md` | The manual note writer | update | `rg -o -e 'Running workers:' -e 'Scheduled:' -e 'Added directories:' -e 'kill -TERM' .skilled/commands/speckit/handoff.md` |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` | The live hop harness note, run through `prepare` by the Claude playbook and phase 016 | update | `rg -c 'Running workers: none' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` |
| `claude/context-nudge.mjs:158`, `codex/shared.mjs:143`, `pi/session-relaunch.ts:508`, `.opencode/plugins/session-relaunch.js:195` | Print `handoffText` | not a consumer of the shape, they pass it through | The full suite in SC-003 |
| `claude/compact-pointer.mjs:220`, `pi/session-relaunch.ts:672`, `.opencode/plugins/session-relaunch.js:285` | Print `seedText` | not a consumer of the shape | The full suite in SC-003 |
| Fixture notes passed to `prepare` | `session-relaunch-cli.test.cjs:108-133`, `skilled-loop-wrapper-claim-goal.test.cjs:132-138` | update | Each gains `Running workers: none` |

Required inventories:
- Finding classes: the lock step is `instance-only`. The missing worker line is `cross-consumer`, because every note writer must now produce it. The scheduled and directory lines are `instance-only`.
- Same-class producers: `rg -l 'In-flight state' .skilled .opencode --glob '!specs/**'` lists every note writer and fixture. On 2026-11-13 it listed `nudge.cjs`, `relaunch-core.cjs`, `handoff.md`, the README, three playbook pages, the Pi test and six relaunch test files.
- Consumers of changed symbols: `rg -n "validatedNote\(|handoffText\(|seedText\(" .skilled/hooks/session-relaunch .opencode/plugins`.
- Matrix axes: line state (missing, empty, `none`, one pid, several pids, no pid), command (`prepare` in loop, `prepare` outside loop, `keep`) and seed kind (hop, after compaction).
- Algorithm invariant: `prepare` never arms a hop for a note without a usable `Running workers:` line, and the receiver never re-runs the active command before it has checked every listed pid.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline of the three test files and confirms the two runtime claims the text rests on (T001, T002). Implementation adds each failing test first, then the fixture lines, then the source change in `lib/nudge.cjs`, `bin/session-relaunch.cjs` and `handoff.md`. Verification runs the relaunch and plugin suites, the named guards and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `handoffText` and `seedText` output | `node:test` |
| Integration | `prepare` and `keep` run as a child process against a fixture note | `node:test` |
| Manual | N/A: a live hop is phase 017's harness work | None |

The seven must-fail tests (five in `nudge.test.cjs`, two in `session-relaunch-cli.test.cjs`) run first as `env -u AI_SESSION_CHILD node --test --test-name-pattern '<title>' <file>` and each must exit 1 with its assertion failure. `prepare accepts Running workers none and a line that names a pid` and `keep accepts a note with no Running workers line` may pass at once, because they pin behavior the change must keep. After the source edit the same command must exit 0 with `fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator greenlight | Internal | Red | Nothing is built |
| Phase 008 Complete | Internal | Green | The guard tests would not be the ones named here |
| Node.js test runner | Internal | Green | No test can run |
| `vitest` in `.skilled/skills/system-deep-loop/runtime` | Internal | Green | T001 cannot confirm the runner stop |
| Claude Code scheduled-tasks page | External | Yellow | T002 falls back to the operator wording already planned |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `prepare` refuses notes in normal use that the operator wants to pass, or a guard test fails after a source change.
- **Procedure**: revert the phase's one local commit. No record format, state file or config changes, so nothing is migrated. A note written with the new lines still passes the old `prepare`, because it only adds text inside a section.
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
| Implementation | Setup, with T001 and T002 recorded | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

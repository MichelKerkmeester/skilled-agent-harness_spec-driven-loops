---
title: "Implementation Plan: Phase 7: goal-handover-docs"
description: "Restate four shipped behaviours in the relaunch README and add the missing goal switch to the example flags, with every statement pinned to the test that asserts it."
trigger_phrases:
  - "goal handover docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: goal-handover-docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents and one dotenv example file |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node:test` guard suites plus `rg` document checks |

### Overview
The relaunch README and the example hook flags still describe the behaviour from before phases 003 and 004. This plan rewrites one sentence, adds one commented row to the example file and adds two statements that explain a known race and a by-design difference. It proves the result with four `rg` checks that fail today and with the four suites that pin the shipped behaviour.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phases 003 and 004 are Complete
- [ ] The four guard suites pass before the first edit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `rg -n -e 'even while the Claude enable switch is off' -e 'Known Race: A Claude Goal Continuation' -e '^A phase child' .skilled/hooks/session-relaunch/README.md` prints three lines
- [ ] `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` prints one line
- [ ] The four guard suites in `REQ-005` exit 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source documentation.

### Key Components
- **`.skilled/hooks/session-relaunch/README.md`**: the operator-facing description of the handoff protocol, the switches and the runtime behaviour. It owns three of the four statements.
- **`.skilled/hooks/hook-flags.env.example`**: the copyable flag file. It owns the missing goal switch row.
- **The four guard suites**: `claude-adapters.test.cjs`, `goal-handover.test.cjs`, `killer.test.cjs` and `goal-slice.test.cjs`. Each pins one documented behaviour and is not changed.

### Data Flow
A behaviour ships in code with a test that asserts it. The phase brief records that behaviour. This phase restates it in the section an operator reads and names the test beside it. The guard suites then show that the prose and the code still agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `README.md` §3 | Documents the old switch rule and omits the race and the phase-child case | update | The three README checks in `SC-001`, `SC-003` and `SC-004` |
| `hook-flags.env.example` | Lists every hook flag except the goal carry-over switch | update | `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` |
| `claude/compact-pointer.mjs` | Delivers the startup claim and keeps its guards | unchanged | `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` |
| `goal-handover.cjs` | Refuses a slice whose budget cannot be checked | unchanged | `node --test --test-name-pattern 'budget cannot be checked' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` |
| `goal-slice.cjs` | Exempts a phase child from the slice budget | unchanged | `node --test --test-name-pattern 'phase child goal carries no budget' .skilled/hooks/goal/lib/goal-slice.test.cjs` |
| `relaunch-core.cjs` | Reads `SESSION_RELAUNCH_GOAL` and owns the switch default | unchanged | `node --test --test-name-pattern 'goalSwitchOn' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` |
| `killer.cjs` | Waits 3 s for an idle transcript and gives up after 30 s | unchanged | `node --test --test-name-pattern 'killer times out' .skilled/hooks/session-relaunch/tests/killer.test.cjs` |

Required inventories:
- Finding class: `F5` semantics and `N7` are `instance-only`, one sentence each. `F13` second half and `N4` are `matrix/evidence`, a missing flag row and an unrecorded race.
- Same-class producers: `rg -n 'SESSION_RELAUNCH_GOAL' .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example` prints the README rows only before the edit.
- Consumers of the changed sentences: `rg -n 'only while the switch is on' .skilled --glob '*.md'`.
- Matrix axes: runtime (Claude, Pi, OpenCode), Claude enable switch (on, off), concern enable (on, off) and goal budget (`ok`, `unknown`).
- Algorithm invariant: N/A: no path, parser, redaction or resolver code changes.

The claimed finding ids above describe the brief. The new statements carry no finding id.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the four document counts and reads each shipped behaviour out of its test. Implementation rewrites the start-claim sentence, adds the goal switch row, adds the known race and adds the phase-child statement. Verification runs the four checks, the four guard suites and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A: this phase changes no code | None |
| Integration | The four guard suites that pin the documented behaviour | `node:test` |
| Manual | Read each new statement beside the test it names | `rg` and the brief |

The failing-first commands are four document checks. `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` prints one line today. `rg -n 'SESSION_RELAUNCH_GOAL' .skilled/hooks/hook-flags.env.example` prints nothing today. `rg -n 'Known Race: A Claude Goal Continuation' .skilled/hooks/session-relaunch/README.md` prints nothing today. `rg -n '^A phase child' .skilled/hooks/session-relaunch/README.md` prints nothing today. Each check must print the opposite result after the edit.

Run the guard suites with `AI_SESSION_CHILD` unset, as `env -u AI_SESSION_CHILD node --test <file>`. The claim guard treats a dispatched child as silent, so a test process that inherits the marker fails the claim cases for that reason alone.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 Complete | Internal | Yellow | The goal resolver rows would describe a plan, not the tree |
| Phase 004 Complete | Internal | Yellow | The switch-off claim sentence would describe a plan, not the tree |
| Node.js test runner | Internal | Green | The guard suites cannot run |
| `rg` | Internal | Green | The four document checks cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a document statement contradicts a guard test, or a new line promises a fix that decision D4 rules out.
- **Procedure**: revert the one local documentation commit on `worktrees/358-handover-goal-resume`. No code, data or config is migrated.
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
| Setup | Phases 003 and 004 Complete | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

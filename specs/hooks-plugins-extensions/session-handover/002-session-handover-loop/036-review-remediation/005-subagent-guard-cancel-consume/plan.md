---
title: "Implementation Plan: Phase 5: subagent-guard-cancel-consume"
description: "Plan for phase 5: add cancel and consume to the sub-agent guard pattern and prove both denials with two failing-first cases in the guard suite. The work changes one regular expression in one hook and one test file."
trigger_phrases:
  - "subagent guard cancel consume plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: subagent-guard-cancel-consume

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM hook script |
| **Framework** | None, a Claude `PreToolUse` hook |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
Change `LIFECYCLE_COMMAND` at `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:18` so the alternation also matches `cancel` and `consume`. Leave `DENIAL_REASON` and `deniesRelaunchCommand` unchanged. Prove the result with `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`, where the two new cases fail before the pattern changes and pass after it.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with a denied `cancel` case and a denied `consume` case
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: hook guard predicate

### Key Components
- **`LIFECYCLE_COMMAND`** in `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`: the only list of lifecycle subcommands the guard denies at line 18.
- **`deniesRelaunchCommand`** in `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`: returns true only for a Bash payload with a non-blank `agent_id` and a matching command, starting at line 45.
- **Guard test** in `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`: spawns the hook with a sub-agent payload and asserts a deny envelope or silence.

### Data Flow
Claude sends a `PreToolUse` JSON payload on stdin. `parseJsonFailOpen` parses it, `deniesRelaunchCommand` checks the tool name, the `agent_id` and the command, and a match emits one `permissionDecision: deny` envelope. Every other payload exits 0 with no output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `LIFECYCLE_COMMAND` in `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Owns the denied subcommand list at line 18 | update | `rg -n 'LIFECYCLE_COMMAND' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints line 18 with `cancel` and `consume` |
| `deniesRelaunchCommand` in `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Reads the constant at line 55 to decide the denial | unchanged | `rg -n 'deniesRelaunchCommand' .skilled/hooks/session-relaunch` prints the definition at line 45 and the call at line 66 |
| `DENIAL_REASON` in `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Supplies the denial text at lines 19 to 22 | unchanged | `rg -n 'DENIAL_REASON' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints the definition and the emit |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Observes the guard through spawned `PreToolUse` payloads | update | `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with the `cancel` and `consume` cases |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Implements `cancel` at line 802 and `consume` at line 707 | not a consumer | No edit. `rg -n '^function (cancel|consume)' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints both lines |
| `.skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs` | Guards the task-dispatch concern, not the relaunch lifecycle | not a consumer | No edit. `rg -n 'session-relaunch' .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'LIFECYCLE_COMMAND' .skilled` prints one definition at line 18 and one use at line 55, both in `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`. Finding 5 is `instance-only`, because the guard owns the only relaunch lifecycle list.
- Consumers of changed symbols: `rg -n 'LIFECYCLE_COMMAND|deniesRelaunchCommand' .skilled/hooks/session-relaunch` prints the constant, the predicate definition and the predicate call. The test file observes the behavior by spawning the script and names neither symbol.
- Matrix axes: the command is one of the six lifecycle subcommands, `history` or an unrelated command. The caller is a sub-agent with a non-blank `agent_id`, a whitespace-only `agent_id` or no `agent_id`. The tool is `Bash` or another tool. Required rows: the six lifecycle subcommands from a sub-agent each deny, and the seven silent shapes stay silent, which is 13 cases.
- Algorithm invariant: `deniesRelaunchCommand` returns true only for a Bash payload whose `agent_id` is a non-blank string and whose command contains `session-relaunch.cjs`, an optional quote, whitespace and one of the six lifecycle subcommands as a whole word. Every other payload returns false. Adversarial inputs are a subcommand named only inside an argument, a `history` call, a main-session call and a non-Bash tool call.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: read `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` and `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`, then record the current four-command list.
- **Implementation**: add the failing `cancel` and `consume` cases, then add both commands to `LIFECYCLE_COMMAND`.
- **Verification**: run the guard suite and the strict packet validator.

The ordered tasks live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `deniesRelaunchCommand` with a deny payload and a silent payload | `node --test` |
| Integration | The guard script spawned with a sub-agent `PreToolUse` payload for `cancel` and `consume` | `node --test` |
| Manual | None. The spawned-payload cases cover both caller shapes | `node --test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node` with the built-in test runner | Internal | Green | The proof commands cannot run |
| No new package | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A sub-agent that only reads relaunch state is denied after the change.
- **Procedure**: Revert the phase commit that changes `LIFECYCLE_COMMAND` and its two test cases.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Implementation -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---

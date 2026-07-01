---
title: "Implementation Plan: Phase 3: goal-command [template:level_1/plan.md]"
description: "Add the root /goal command and plugin tools around the existing state and injection helpers, keeping command markdown state-free."
trigger_phrases:
  - "goal command plan"
  - "mk_goal plan"
  - "mk_goal_status plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/003-goal-command"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented completed goal command plan"
    next_safe_action: "Continue with lifecycle tracking after passive command behavior stays green"
    blockers: []
    key_files:
      - ".opencode/commands/goal_opencode.md"
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
      - ".opencode/plugins/__tests__/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:51b165e229f411c585fb34566e817e6486da9e1d45de34bfb83ae35850be76cc"
      session_id: "goal-m1-goal-command-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: goal-command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command plus Node.js ESM plugin |
| **Framework** | OpenCode command and plugin tool APIs |
| **Storage** | Existing per-session JSON goal store |
| **Testing** | `node --test` and `node --check` |

### Overview
Expose M1 through a root `/goal` command and two plugin tools. The command remains a thin router, while `mk_goal` and `mk_goal_status` own all state reads, mutations, session resolution, and status output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] State helpers from Phase 1 available.
- [x] Injection preview renderer from Phase 2 available.
- [x] Command routing contract defined.

### Definition of Done
- [x] `/goal` command routes to one selected tool call.
- [x] `mk_goal` supports set, show, clear, complete, and pause.
- [x] `mk_goal_status` exposes `injection_preview`.
- [x] Full plugin unit suite passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin command router over plugin-owned tools.

### Key Components
- **Command markdown**: `.opencode/commands/goal_opencode.md` resolves arguments and calls exactly one tool.
- **Mutation tool**: `mk_goal` executes `set`, `show`, `clear`, `complete`, and `pause`.
- **Read tool**: `mk_goal_status` reads the current goal and returns status plus `injection_preview`.
- **Envelope renderer**: `goalStateLines` and `failureLines` produce predictable output for command callers.

### Data Flow
The command parses `$ARGUMENTS`, selects `mk_goal` or `mk_goal_status`, and prints the tool result. The plugin resolves the session id from tool context, performs the state operation, and returns the status envelope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/goal_opencode.md` | Root user command. | Created as a state-free router to plugin tools. | Manual doc inspection and tool tests for called behavior. |
| `.opencode/plugins/mk-goal.js` | Owns state, injection, and tools. | Add tool schemas, action execution, status output, and failure envelopes. | `node --check`; state and tool-path tests. |
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Guards state, injection, and tool output. | Covers set/show/clear and `injection_preview`. | Full plugin unit suite. |
| `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` | Guards tool-context session routing. | Covers command-backed mutation path. | Full plugin unit suite. |

Required inventories:
- Same-class producers: `.opencode/commands/goal_opencode.md`, `executeGoalAction`, `executeGoalStatus`, `goalStateLines`, `failureLines`, `mk_goal`, and `mk_goal_status`.
- Consumers of changed symbols: OpenCode command runner, plugin tool context, state tests, and tool-path regression test.
- Matrix axes: empty args vs show vs set vs bare text vs clear vs complete vs pause, present vs missing goal, valid vs missing session id.
- Algorithm invariant: command markdown is a router only; all stateful behavior stays inside plugin tools.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Define `/goal` argument routing rules.
- [x] Reuse state and injection helpers.
- [x] Define status and failure output envelopes.

### Phase 2: Core Implementation
- [x] Add `.opencode/commands/goal_opencode.md`.
- [x] Add `mk_goal` tool schema and action execution.
- [x] Add `mk_goal_status` read tool.
- [x] Add `injection_preview` to state output.

### Phase 3: Verification
- [x] Verify set, show, clear, and transform parity through tests.
- [x] Verify tool-context session resolution.
- [x] Run full plugin unit suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Tool set/show/clear and status output | `node --test` |
| Regression | Tool-context session resolution | `node --test` |
| Syntax | Plugin, tests, and command markdown sanity | `node --check` for JavaScript surfaces |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 state helpers | Internal | Green | Tools cannot persist or clear goals without them. |
| Phase 2 injection renderer | Internal | Green | Status output cannot expose an exact `injection_preview` without it. |
| OpenCode command/tool APIs | Internal runtime API | Green | `/goal` depends on command markdown and plugin tool registration. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `/goal` routes to the wrong tool, state logic leaks into command markdown, or status output diverges from injection.
- **Procedure**: Remove `.opencode/commands/goal_opencode.md` and revert the `mk_goal` / `mk_goal_status` tool registration while keeping state and injection helpers intact.
<!-- /ANCHOR:rollback -->

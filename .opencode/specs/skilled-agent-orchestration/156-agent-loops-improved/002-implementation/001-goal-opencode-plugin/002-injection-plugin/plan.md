---
title: "Implementation Plan: Phase 2: injection-plugin [template:level_1/plan.md]"
description: "Extend mk-goal.js with passive system-context injection using the existing state store and a fail-open transform hook."
trigger_phrases:
  - "goal injection plan"
  - "active goal transform"
  - "injection preview"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/002-injection-plugin"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented completed injection plan"
    next_safe_action: "Expose the same injection preview through the command tools"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m1-injection-plugin-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: injection-plugin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM plugin |
| **Framework** | OpenCode plugin API |
| **Storage** | Existing per-session JSON goal store |
| **Testing** | `node --test` and `node --check` |

### Overview
Add passive injection to the existing `mk-goal.js` plugin. The implementation reads the current session goal, renders a sanitized fenced block, and appends it through `experimental.chat.system.transform` without throwing if state is missing or malformed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] State helper contract from Phase 1 available.
- [x] Injection block shape defined.
- [x] Fail-open behavior selected for transform errors.

### Definition of Done
- [x] Active goals render a fenced injection block.
- [x] The transform appends the block to `output.system`.
- [x] Full plugin unit suite passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive OpenCode system transform.

### Key Components
- **Injection renderer**: `renderGoalInjection` formats the active goal block and caps output length.
- **Transform append helper**: `appendGoalBrief` resolves the session, reads the goal, and appends the rendered block once.
- **Fail-open hook**: `experimental.chat.system.transform` calls the helper only when the plugin is enabled and never blocks chat on errors.

### Data Flow
OpenCode calls the system transform with a session input and mutable output. The plugin reads the active goal, renders `[active_goal:<goalId>]`, and appends it to `output.system` unless it is empty or already present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-goal.js` | Owns goal state and plugin hooks. | Add injection rendering and system transform append behavior. | `node --check`; state test. |
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Guards M1 state and passive injection behavior. | Covers `injection_preview` and transform output. | Full plugin unit suite. |

Required inventories:
- Same-class producers: `renderGoalInjection`, `appendGoalBrief`, and `experimental.chat.system.transform`.
- Consumers of changed symbols: `mk_goal_status`, `mk_goal` mutation outputs, OpenCode system transform, and state tests.
- Matrix axes: active vs absent goal, existing vs missing `output.system`, duplicate vs first injection marker.
- Algorithm invariant: injection is passive and advisory; failures suppress the block rather than failing the chat turn.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reuse Phase 1 state helpers for session goal reads.
- [x] Define the fenced `[active_goal]` block fields.
- [x] Confirm transform failures should fail open.

### Phase 2: Core Implementation
- [x] Add `renderGoalInjection` with sanitized objective, verifier, usage, and directive fields.
- [x] Add `appendGoalBrief` to read and append the current active goal block once.
- [x] Register `experimental.chat.system.transform` in the plugin export.

### Phase 3: Verification
- [x] Verify `injection_preview` through `mk_goal_status`.
- [x] Verify transform output matches the rendered preview.
- [x] Run full plugin unit suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Injection preview and transform append behavior | `node --test` |
| Syntax | Plugin and tests | `node --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 state helpers | Internal | Green | Injection cannot read the active goal without per-session storage. |
| OpenCode system transform hook | Internal runtime API | Green | Missing hook support would make `/goal` state visible only through tools. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Injection duplicates blocks, leaks unsanitized text, or blocks chat turns.
- **Procedure**: Revert `renderGoalInjection`, `appendGoalBrief`, and the `experimental.chat.system.transform` hook while keeping the state store intact.
<!-- /ANCHOR:rollback -->

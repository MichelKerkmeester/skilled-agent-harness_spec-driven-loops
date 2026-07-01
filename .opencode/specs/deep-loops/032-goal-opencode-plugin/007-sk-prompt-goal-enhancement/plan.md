---
title: "Implementation Plan: Phase 7: sk-prompt-goal-enhancement [template:level_1/plan.md]"
description: "Implement deterministic sk-prompt-style goal prompt generation inside the mk-goal plugin and keep the /goal command as a thin router."
trigger_phrases:
  - "goal prompt generation plan"
  - "sk-prompt goal enhancement"
  - "mk-goal prompt metadata"
  - "goalPrompt"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement"
    last_updated_at: "2026-06-30T16:45:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Implemented plugin helpers and tests for goal prompt generation"
    next_safe_action: "Phase complete; restart OpenCode before relying on the updated plugin in a new session"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:add950c4b1c9352bb36a6142288b11fbee50aaebbdbd93f2e8e0d18f7f24641c"
      session_id: "goal-sk-prompt-enhancement-20260630"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use deterministic sk-prompt methodology inside the plugin rather than an LLM call"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: sk-prompt-goal-enhancement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ESM, OpenCode plugin API |
| **Framework** | OpenCode auto-discovered plugin and command surfaces |
| **Storage** | Per-session JSON files in `.opencode/skills/.goal-state/` |
| **Testing** | Node-based plugin tests under `.opencode/plugins/tests/` |

### Overview
Add a deterministic prompt-generation layer to `mk_goal` set actions. The plugin will preserve the raw objective, generate a compact sk-prompt-style `goalPrompt`, store metadata for framework and CLEAR scoring, and render the enhanced prompt in the active goal injection block.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable, including the 4000-character cap.
- [x] Existing plugin set/render/test paths read before editing.

### Definition of Done
- [x] Enhanced prompt generation implemented in `mk-goal.js`.
- [x] Goal status and injection preview expose the new prompt behavior.
- [x] mk-goal tests pass.
- [x] Strict validation passes for the parent spec packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic adapter inside the existing plugin state pipeline.

### Key Components
- **Prompt Generator**: Sanitizes raw input, applies DEPTH/CRAFT/TIDD-EC-inspired structure, scores with CLEAR, then clamps to 4000 characters.
- **State Normalizer**: Backfills `goalPrompt` and metadata for older goal records during read/write normalization.
- **Injection Renderer**: Uses `goalPrompt` for the model-facing steering block while keeping the raw objective line available.

### Data Flow
`/goal set <input>` routes to `mk_goal`; `setGoal` sanitizes raw input, derives `goalPrompt`, stores both fields atomically, and later `renderGoalInjection` injects the enhanced prompt through the existing system transform.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `setGoal` and `buildNewGoal` | Create active goal records from raw text | Add prompt generation and metadata fields | State and tool-path tests |
| `normalizeStoredGoal` | Reads and validates stored JSON records | Backfill missing prompt fields for older records | Existing read/write tests plus new compatibility assertions |
| `renderGoalInjection` | Builds injected `[active_goal]` block | Render enhanced prompt while preserving fences and clamps | State test injection preview assertions |
| `goalStateLines` | User-facing status envelope | Add prompt metadata lines without breaking existing fields | Tool-path and status assertions |
| `.opencode/commands/goal_opencode.md` | Thin route to plugin tools | Keep unchanged | Grep/read evidence and command contract tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation Setup
- [x] Create phase folder from Spec Kit templates.
- [x] Fill phase scope, requirements, plan and task docs.

### Phase 2: Core Implementation
- [x] Add prompt-generation constants and helpers to `mk-goal.js`.
- [x] Store `objective`, `goalPrompt` and `promptEnhancement` in goal records.
- [x] Render injection from the enhanced prompt.

### Phase 3: Verification
- [x] Update tests for prompt shape, metadata and security controls.
- [x] Run all mk-goal plugin tests.
- [x] Restamp metadata and run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Prompt generation, state normalization, injection rendering | `node .opencode/plugins/tests/mk-goal-state.test.cjs` |
| Integration | Tool context set/show/clear path | `node .opencode/plugins/tests/mk-goal-tool-path.test.cjs` |
| Regression | Lifecycle, supervisor, continuation and export behavior | Existing mk-goal node tests |
| Spec validation | Phase and parent packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-prompt` methodology docs | Internal | Green | Provides DEPTH, framework and CLEAR concepts for deterministic implementation. |
| OpenCode plugin tool API | Internal | Green | Existing `mk_goal` action path remains the mutation boundary. |
| Node test runner | Internal | Green | Existing tests run directly with `node`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New prompt generation breaks existing set/show/injection behavior, or tests show old records cannot be read.
- **Procedure**: Revert `mk-goal.js` to raw-objective rendering, remove prompt metadata assertions, restamp spec metadata and rerun the mk-goal tests.
<!-- /ANCHOR:rollback -->

---
title: "Feature Specification: Phase 7: sk-prompt-goal-enhancement"
description: "Upgrade /goal set so user input is transformed into a bounded sk-prompt-style goal prompt before injection, while preserving the raw objective for status and compatibility."
trigger_phrases:
  - "sk-prompt goal enhancement"
  - "goal prompt under 4000 chars"
  - "improve goal input"
  - "mk_goal prompt metadata"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/007-sk-prompt-goal-enhancement"
    last_updated_at: "2026-06-30T16:45:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Implemented deterministic sk-prompt goal prompt generation in mk-goal"
    next_safe_action: "Phase complete; restart OpenCode before relying on the updated plugin in a new session"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:b12877c7a45bb025f3435522f5fbfd131a113967f56e63077e745fd7abdefe5f"
      session_id: "goal-sk-prompt-enhancement-20260630"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a new phase child under the existing 032 goal plugin packet"
      - "Use sk-prompt methodology to improve user input into the best possible goal prompt under 4000 characters"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: sk-prompt-goal-enhancement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 |
| **Predecessor** | 006-active-continuation |
| **Successor** | None |
| **Handoff Criteria** | `/goal set` stores a raw objective plus a deterministic sk-prompt-enhanced `goalPrompt` under 4000 chars, injection uses the enhanced prompt, and all mk-goal tests plus strict parent validation pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase upgrades the already-shipped `/goal` plugin by improving raw user input into a concise, execution-ready prompt before it is injected into OpenCode system context.

**Scope Boundary**: Owns deterministic prompt enhancement inside `mk-goal.js`, status output metadata, and tests. The `/goal` command remains a state-free one-tool router, and this phase does not introduce hidden LLM calls or new runtime dependencies.

**Dependencies**:
- Existing `mk_goal` set/show/clear/complete/pause tool path.
- Existing state normalization, injection rendering, lifecycle, verifier and continuation behavior.
- `sk-prompt` methodology: DEPTH phases, framework selection, RICCE completeness, and CLEAR scoring.

**Deliverables**:
- `goalPrompt` and `promptEnhancement` fields in stored goal records.
- Deterministic CRAFT/TIDD-EC style prompt generation capped at 4000 characters.
- Injection output that steers from the enhanced prompt while preserving raw objective visibility.
- Updated mk-goal tests and validation evidence.

**Changelog**:
- Add a phase changelog entry when the implementation closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/goal set` currently stores and injects the sanitized raw user objective. Short or vague inputs such as "fix the tests" do not give the model enough structure, success criteria or stopping rules to stay anchored across turns.

### Purpose
Transform every user-provided objective into a compact sk-prompt-style goal prompt that gives the model a clearer role, context, constraints, success criteria and completion discipline while staying under 4000 characters.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add deterministic prompt enhancement helpers to `mk-goal.js` using sk-prompt concepts without calling an LLM.
- Store the raw sanitized objective and the enhanced `goalPrompt` separately.
- Store prompt metadata including framework, mode, CLEAR score, character count and version.
- Render injection from `goalPrompt`, with raw objective preserved for status and auditability.
- Update mk-goal unit tests to cover prompt generation, length limits, metadata and adversarial input.

### Out of Scope
- Calling `promptAsync`, the assistant, or an external model during `/goal set`; generation must be synchronous and deterministic.
- Rewriting `.opencode/commands/goal_opencode.md`; it remains a thin tool router.
- Changing supervisor completion logic, token accounting, or continuation autonomy gates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Add prompt generation, metadata normalization, injection rendering from `goalPrompt`, and status fields. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modify | Cover generated prompt shape, metadata, 4000-char cap, injection parity and adversarial sanitization. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Verify command-backed tool path persists the enhanced prompt and status exposes it. |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/spec.md` | Modify | Add phase 7 scope and handoff criteria to the parent map. |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/007-sk-prompt-goal-enhancement/` | Create | Phase documentation for this enhancement. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generate an enhanced goal prompt on every `set`. | `setGoal` returns a goal with non-empty `goalPrompt` and `promptEnhancement.framework`. |
| REQ-002 | Enforce the 4000-character hard cap. | Tests prove long inputs produce `goalPrompt.length <= 4000`. |
| REQ-003 | Preserve the raw objective separately. | Status output still includes `objective=<raw sanitized input>` while injection contains the enhanced prompt. |
| REQ-004 | Keep `/goal` command state-free. | No command markdown prompt-improvement step is added; all behavior lives in plugin helpers. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Apply sk-prompt quality concepts deterministically. | Stored metadata names DEPTH, CRAFT/TIDD-EC, RICCE and CLEAR score `>=40`. |
| REQ-006 | Preserve prompt-injection defenses. | Adversarial objective text cannot create extra goal markers, raw role labels, fenced code blocks or instruction-override phrases in injection. |
| REQ-007 | Keep existing goal lifecycle behavior stable. | Existing lifecycle, supervisor and continuation tests remain green. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/goal set <input>` persists both `objective` and `goalPrompt` for the session.
- **SC-002**: `goalPrompt` uses a concise execution structure with role, objective, method, success criteria and stop conditions.
- **SC-003**: `goalPrompt` is never longer than 4000 characters.
- **SC-004**: `injection_preview` and system transform output use the enhanced prompt.
- **SC-005**: All mk-goal node tests and strict parent spec validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hidden model call during goal set | Recursion, latency and nondeterministic state writes | Implement a deterministic local generator based on sk-prompt methodology. |
| Risk | Enhanced prompt could obscure the user's original wording | Harder to audit or clear stale goals | Preserve raw `objective` and expose prompt metadata in status output. |
| Risk | More injected text increases context pressure | Active goal block can crowd useful context | Hard cap prompt to 4000 chars and continue applying injection clamp. |
| Dependency | Existing mk-goal state schema | Old goal records may lack `goalPrompt` | Normalize older records by deriving `goalPrompt` from the stored objective on read. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The user approved a new phase and the sk-prompt enhancement requirement.
<!-- /ANCHOR:questions -->

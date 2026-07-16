---
title: "Implementation Plan: Phase 4: lifecycle-tracking [template:level_1/plan.md]"
description: "Extend the existing ESM plugin with lifecycle helpers, guarded usage accounting, activity evidence capture, and a focused node unit test."
trigger_phrases:
  - "goal lifecycle plan"
  - "account usage"
  - "budget limited"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/004-lifecycle-tracking"
    last_updated_at: "2026-06-28T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented lifecycle tracking delivery"
    next_safe_action: "Use supervisor results before enabling continuation"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:c051a6c16a973a44f789ee62b846a4e7a7fb3fb7a78cc2e647cfe21bf5fec1f5"
      session_id: "goal-m2-lifecycle-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: lifecycle-tracking

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
Add lifecycle behavior inside the committed `mk-goal.js` plugin instead of creating a second plugin. The implementation reuses existing state helpers, adds tolerant event parsing, and keeps usage accounting guarded by active status, matching goal id, and message-id dedupe.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing plugin and research design read.
- [x] Existing passive state test baseline captured.
- [x] Event hook shape checked against local plugins.

### Definition of Done
- [x] Existing passive behavior remains green.
- [x] Lifecycle unit test covers accounting and budget transition.
- [x] Syntax and alignment checks pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive plugin extension.

### Key Components
- **Event switch**: Routes OpenCode lifecycle events without changing tool command behavior.
- **Usage accounting**: Mutates goal state only when the current active goal is still the event target.
- **Activity evidence capture**: Stores capped, redacted assistant transcript text for supervisor verification.

### Data Flow
`message.updated` refreshes activity and evidence, extracts token usage if present, then calls guarded accounting. Budget crossing moves the goal to `budget_limited` and suppresses continuation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-goal.js` | Owns goal state, injection, and tools. | Add lifecycle helpers and event hook. | `node --check .opencode/plugins/mk-goal.js`; lifecycle test. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Guards M1 behavior. | Unchanged. | Full plugin unit suite. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | New lifecycle coverage. | Created. | Full plugin unit suite. |

Required inventories:
- Same-class producers: local plugin event handlers in the mk-spec-memory and session-cleanup plugins (sibling `.opencode/plugins` modules, not deliverables of this phase).
- Consumers of changed symbols: `mk_goal_status` output and test-only helpers.
- Matrix axes: active vs non-active status, matching vs stale goal id, repeated vs new message id, usage present vs unavailable.
- Algorithm invariant: token usage is charged at most once per message id and only to the currently active goal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read existing plugin and design research.
- [x] Capture baseline plugin unit test and syntax status.
- [x] Identify local event hook conventions.

### Phase 2: Core Implementation
- [x] Add event parsing, session/message id extraction, and usage extraction helpers.
- [x] Add guarded `accountUsage` and `budget_limited` transition.
- [x] Add activity evidence capture and prompt blocker state.

### Phase 3: Verification
- [x] Add lifecycle unit test.
- [x] Run full plugin unit suite.
- [x] Run syntax and alignment checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lifecycle event accounting and prompt blocking | `node --test` |
| Syntax | Plugin and new tests | `node --check` |
| Alignment | OpenCode JS conventions | `verify_alignment_drift.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode lifecycle events | Internal runtime API | Green for plugin hook shape | Missing usage payloads degrade to `usageSource=unavailable`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Lifecycle events regress passive injection or double-charge usage.
- **Procedure**: Revert the `mk-goal.js` lifecycle helper changes and remove `mk-goal-lifecycle.test.cjs`.
<!-- /ANCHOR:rollback -->

---
title: "Implementation Plan: Phase 5: completion-supervisor [template:level_1/plan.md]"
description: "Add a conservative idle-time verifier path that normalizes supervisor verdicts, applies compare-safe state transitions, and exposes redacted verifier status."
trigger_phrases:
  - "goal supervisor plan"
  - "maybe verify goal"
  - "completion source"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/005-completion-supervisor"
    last_updated_at: "2026-06-28T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented supervisor verifier delivery"
    next_safe_action: "Use this verifier before any continuation prompt is submitted"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-supervisor.test.cjs"
    session_dedup:
      fingerprint: "sha256:ec4efc64620458bd98463b77aecb464f2dd6ce67ace345550dfbc4161f20446b"
      session_id: "goal-m2-supervisor-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: completion-supervisor

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
Add a verifier path that runs on `session.idle` and updates state only if the same goal remains active after verification. The default posture is conservative: no evidence, no verifier, or invalid verdicts all become `not_met`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Lifecycle evidence field exists.
- [x] Status enum already includes `blocked` and `complete`.
- [x] Existing manual completion path remains available.

### Definition of Done
- [x] `maybeVerifyGoal` returns a strict verifier envelope.
- [x] `session.idle` invokes verification before any future continuation.
- [x] Supervisor unit test covers verdict mapping and redaction.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Compare-safe verifier state transition.

### Key Components
- **Verifier runner**: Calls an injected supervisor verifier when evidence exists.
- **Verdict normalizer**: Accepts only `met`, `not_met`, and `blocked`.
- **State applier**: Rechecks goal id and active status before writing verifier results.

### Data Flow
`session.idle` calls `maybeVerifyGoal(sessionID)`. The helper reads the active goal, evaluates redacted evidence, then mutates the goal only if it is still the same active goal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-goal.js` | Owns goal state and lifecycle event handling. | Add verifier helper, idle wiring, and status fields. | Supervisor test and syntax check. |
| `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs` | New verifier coverage. | Created. | Full plugin unit suite. |
| `mk_goal_status` output | User-facing diagnostic surface. | Add budget and verifier fields while preserving old lines. | Supervisor test asserts redacted status output. |

Required inventories:
- Same-class producers: existing manual completion helper and lifecycle `session.idle` event.
- Consumers of changed symbols: `mk_goal_status`, test-only exports, and future continuation phase.
- Matrix axes: met vs blocked vs invalid verdict, evidence present vs absent, manual vs supervisor completion.
- Algorithm invariant: automatic completion requires a strict `met` verdict for the same active goal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm verifier evidence comes from lifecycle tracking.
- [x] Identify status fields that need to remain backward compatible.
- [x] Keep active continuation out of scope.

### Phase 2: Core Implementation
- [x] Add verifier result normalization and evidence redaction.
- [x] Add `maybeVerifyGoal(sessionID)` compare-safe mutation path.
- [x] Wire `session.idle` to verification.

### Phase 3: Verification
- [x] Add supervisor unit test.
- [x] Run full plugin unit suite.
- [x] Run syntax and alignment checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Supervisor verdict mapping and redaction | `node --test` |
| Syntax | Plugin and new tests | `node --check` |
| Alignment | OpenCode JS conventions | `verify_alignment_drift.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lifecycle evidence capture | Internal phase dependency | Green | Without evidence the verifier defaults to `not_met`. |
| Production supervisor model/prompt | Future runtime wiring | Deferred | Tests use injected verifier functions until active continuation is implemented. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Idle verification completes goals prematurely or leaks evidence.
- **Procedure**: Revert `maybeVerifyGoal` and idle event wiring, then remove `mk-goal-supervisor.test.cjs`.
<!-- /ANCHOR:rollback -->

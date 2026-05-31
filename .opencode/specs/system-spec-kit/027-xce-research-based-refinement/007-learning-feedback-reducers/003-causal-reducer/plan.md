---
title: "Plan — 003 Session-Trace Causal Reducer"
description: "Implementation plan for deferred session-trace causal edge inference."
trigger_phrases:
  - "009 causal reducer plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-learning-feedback-reducers/003-causal-reducer"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Implementation Plan: Session-Trace Causal Reducer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Target Module** | `session-trace-causal-reducer.ts` |
| **Testing** | Vitest |

Build a deferred reducer that infers weak causal edges from session trace evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Strict child validation exits 0.
- Tests prove no overwrite of manual edges.
- Grep/code review confirms no live `logFeedbackEvent` invocation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The reducer groups feedback events by session, keeps a rolling list of shown memory IDs, and emits weak edges when later citations identify a target. The edge-writing path must respect Phase 002 guardrails.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Event Reader
- Query and group events by session and timestamp.

### Phase 2: Inference
- Select eligible sources.
- Emit or update weak auto-session edges.
- Enforce caps and idempotency.

### Phase 3: Invocation and Tests
- Add deferred invocation surface.
- Add feature flag and tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Unit | Source selection | Vitest |
| Integration | Edge insert/update behavior | Vitest |
| Regression | No live invocation path | Grep/code review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-aggregator` | Hard internal | Required | Shared event semantics. |
| `012-feedback-p0-correctness` | Parent hard dependency | Required | Auto-session cap and manual guard safety. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false`. Existing auto-session edges can decay normally or be removed by a targeted maintenance cleanup if needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-aggregator -> event reader -> inference -> deferred invocation -> tests
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimated Effort |
|-------|------------------|
| Event reader | 1 hour |
| Inference and edge writes | 3 hours |
| Tests and invocation | 3 hours |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Default-off flag is primary rollback. If cleanup is needed, target only `created_by='auto-session'` edges.
<!-- /ANCHOR:enhanced-rollback -->

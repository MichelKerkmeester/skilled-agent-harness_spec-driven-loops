---
title: "Plan — 004 Feedback Retention Reducer"
description: "Implementation plan for learned retention and edge floor logic."
trigger_phrases:
  - "009 retention reducer plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Implementation Plan: Feedback Retention Reducer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Target Modules** | `feedback-retention-reducer.ts`, `edge-tier-basement.ts` |
| **Testing** | Vitest |

Implement shadow-first learned retention decisions based on shared feedback aggregation and tier-aware safety rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Strict child validation exits 0.
- Tests cover all decision classes and edge-floor scope.
- Active mode requires both flag and evaluation gate.
- Active mode also requires ledger quality, shadow replay, and protect/extend/delete audit evidence from representative windows.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The retention reducer computes decisions from expired candidate rows and aggregation summaries. Sweep integration applies decisions only in active mode; shadow mode returns decisions and logs metrics without mutation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Decision Model
- Define `RetentionDecision` and reducer options.
- Consume aggregation summaries.

### Phase 2: Rules
- Implement protect/extend/delete rules.
- Implement narrow edge-tier basement helper.

### Phase 3: Integration
- Add dry-run path and sweep integration.
- Add flag matrix and tests.
- Add shadow replay gate that records decisions and audit payloads before enabling active mutation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Unit | Decision rules | Vitest |
| Unit | Edge-floor scope | Vitest |
| Integration | Sweep action/audit behavior | Vitest |
| Shadow replay | Protect/extend/delete decisions without mutation | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-aggregator` | Hard internal | Required | Provides weighted feedback summaries. |
| `002-memory-write-safety` | Parent hard dependency | Required | Current canonical owner of tier-aware retention safety. |
| equivalent shadow-eval evidence (folder no longer exists) | Soft sibling | Optional before active mode | Supplies evaluation gate. |
| Ledger quality gate | Parent gate | Required before active mutation | Blocks low-quality windows from changing retention. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `SPECKIT_FEEDBACK_RETENTION_LEARNING=false`. Existing `extend` or `protect` updates are not automatically reversed; follow-up maintenance can retighten TTLs if needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-aggregator -> decision rules -> edge floor -> sweep integration -> tests
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimated Effort |
|-------|------------------|
| Decision model | 1 hour |
| Rules and edge floor | 4 hours |
| Integration/tests | 4 hours |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Default-off flag is primary rollback. Audit ledger entries should make any active TTL changes traceable.
<!-- /ANCHOR:enhanced-rollback -->

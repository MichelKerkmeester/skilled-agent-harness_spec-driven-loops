---
title: "Plan — 001 Shared Feedback Aggregation"
description: "Implementation plan for the TypeScript feedback aggregation foundation."
trigger_phrases:
  - "005 aggregator plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/001-aggregator"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Implementation Plan: Shared Feedback Aggregation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Target Module** | `mcp_server/lib/feedback/batch-learning.ts:195-241` (`aggregateEvents`, reuse/extend) |
| **Testing** | Vitest |
| **Dependency** | Phase 002 correctness packet |

AUDIT 2026-06-05: `batch-learning.ts:195-241` already aggregates `feedback_events`; reuse it. `feedback_events` dependency confirmed present (`feedback-ledger.ts`).

Reuse/extend the existing `aggregateEvents` reducer (avoid a duplicate `feedback-aggregation.ts`) so it reads existing feedback events, normalizes them into a typed per-memory summary, and exposes a weighted-positive formula reconciled with the existing `weightedScore`/`computedBoost` for downstream reducers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Strict child validation exits 0.
- Unit tests cover formula, empty windows, mixed confidence events, and idempotency.
- No writes or live ranking/retention side effects are introduced.
- Ledger quality summary reports malformed rows, missing memory ids, duplicate event ids, support counts, and replay-window coverage before downstream reducers consume aggregates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The aggregation already lives beside the feedback ledger in `batch-learning.ts:195-241` (`aggregateEvents`); reuse/extend it rather than adding a parallel `feedback-aggregation.ts`. The reducer reads through the ledger query API where practical and converts event records into per-memory summary objects keyed by memory id, adding only the fields downstream consumers still need.

Downstream consumers should depend on the summary type, not raw event rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: API Shape
- Define input window options and return types.
- Keep the API deterministic and serializable.

### Phase 2: Aggregation Logic
- Reuse the existing strong/medium/weak bucket mapping in `aggregateEvents`; add only buckets it does not already produce.
- Compute session/query sets and first/last timestamps, extending the existing aggregate where fields are missing.
- Compute weighted positive hits with zero floor, reconciled with the existing `weightedScore`/`computedBoost` formula rather than as a parallel formula.
- Emit quality metrics for skipped rows, duplicate rows, low-support windows, and aggregate coverage.

### Phase 3: Verification
- Add Vitest coverage for formula and idempotency.
- Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Unit | Formula and bucket mapping | Vitest |
| Unit | Empty and mixed windows | Vitest |
| Regression | Run-twice idempotency | Vitest |
| Quality | Ledger quality summary and low-support gating | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-memory-write-safety` | Hard external | Required | Consumers should not proceed before safety fixes land. |
| `feedback-ledger.ts` | Internal | Existing | Source of event rows and ordering semantics. |
| Continuation research iteration 059 | Planning evidence | Available | Requires ledger quality gates before consumer rollout. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Because this child is additive and read-only, rollback is removal of the new module and its tests. No schema or production data rollback is expected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 002 hard dependency -> API shape -> aggregation logic -> tests
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimated Effort |
|-------|------------------|
| API shape | 30 minutes |
| Aggregation logic | 1 hour |
| Tests and validation | 1 hour |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No feature flag is required for the read-only foundation. Remove the module and dependent imports if rollback is needed.
<!-- /ANCHOR:enhanced-rollback -->

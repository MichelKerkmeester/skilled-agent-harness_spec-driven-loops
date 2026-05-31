---
title: "008 — Feedback Reducers"
description: "Phase-parent control packet for post-012 learning feedback reducers: shared aggregation foundation, coco rerank consumer, session-trace causal reducer, learned retention reducer, and env/tests integration closeout."
trigger_phrases:
  - "027 phase 008"
  - "008 feedback reducers"
  - "feedback reducer phase parent"
  - "learning reducers"
  - "feedback aggregation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded phase parent"
    next_safe_action: "Select a child phase to implement."
    blockers: []
    key_files: ["spec.md", "description.json", "graph-metadata.json"]
    completion_pct: 0
---
# Feature Specification: 008 — Feedback Reducers (Phase Parent)

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | phase-parent |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement` |
| **Packet ID** | `system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers` |
| **Hard Dependency** | `system-spec-kit/027-xce-research-based-refinement/002-feedback-p0-correctness` |
| **Soft Dependencies** | `028/004-code-graph-adoption-eval`, `028/006-coco-intent-steering` |
| **Scope Boundary** | Learning reducers only after the pt-04 audit boundary; P0 correctness fixes are owned by 012. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## 2. ROOT PURPOSE

Phase 008 coordinates the learning feedback reducers that consume existing feedback signals after Phase 002 has landed the required correctness preconditions. The parent holds no implementation tasks itself; it routes work into five child packets with explicit dependency order.

The pt-04 audit boundary is preserved here as a scope rule: this packet does not own the auto-provenance cap broadening, manual-edge overwrite guard, or retention tier-basement correctness fixes. Those fixes are the hard precondition in `012-feedback-p0-correctness`. This parent covers only the reducer learning layer: aggregation, three consumers, and final env/test integration.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:phase-map -->
## 3. PHASE DOCUMENTATION MAP

| Child | Scope | LOC | Depends On | Language |
|-------|-------|-----|------------|----------|
| `001-aggregator` | Shared `feedback-aggregation.ts` foundation. Reads `feedback_events` from `feedback-ledger.ts` (SQLite-backed). | ~70 | `system-spec-kit/027-xce-research-based-refinement/002-feedback-p0-correctness` | TS |
| `002-coco-rerank-consumer` | `cocoindex_code/feedback_reducer.py` and `feedback_rerank_weights` SQLite table. | ~370 | `001-aggregator` | Python |
| `003-causal-reducer` | `session-trace-causal-reducer.ts`. **Amendment A (iteration-036):** check candidate edges against `relation-coverage.ts` `DEFAULT_RELATION_TARGETS` (`mcp_server/lib/causal/relation-coverage.ts:L36-L45`) before insertion; skip edges whose relation type is already at or above its `minimumShare` floor (~+20 LOC). | ~285 | `001-aggregator` | TS |
| `004-retention-reducer` | `feedback-retention-reducer.ts`. **Amendment B (iteration-036):** import `STATE_LIMITS` from `stage4-filter.ts` (`mcp_server/lib/search/pipeline/stage4-filter.ts:L64-L80`) rather than redeclaring tier priority constants; reducer's tier-basement decay decisions must remain consistent with pipeline filter caps (~+5 LOC). | ~390 | `001-aggregator` | TS |
| `005-env-tests-integration` | ENV_REFERENCE flags and integration tests across all three consumers. | ~100 | `001`, `002`, `003`, `004` | TS + docs |

> **Note (iteration-036):** The P0 correctness split prescribed by pt-04 is already resolved architecturally — correctness fixes live in sibling packet `002-feedback-p0-correctness` (hard dependency), not as a child of this phase. The `ccc-feedback.ts` JSONL handler cited in older research has been superseded by the SQLite-backed `feedback-ledger.ts`; `001-aggregator` correctly references `feedback_events` from that table.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:execution-order -->
## 4. EXECUTION ORDER

1. Land `012-feedback-p0-correctness` in main.
2. Land `009-feedback-reducers/001-aggregator`.
3. Run `002-coco-rerank-consumer`, `003-causal-reducer`, and `004-retention-reducer` independently once the aggregator is available.
4. Land `005-env-tests-integration` after all three consumers are complete.

After 012 and 001 land, the three consumer children are intentionally independent: they use different modules and, for Consumer A, a different language/runtime.
<!-- /ANCHOR:execution-order -->

---

<!-- ANCHOR:what-needs-done -->
## 5. WHAT NEEDS DONE

- Keep all reducers default-off and shadow-first until evaluation gates allow live mutation.
- Use the shared aggregation child as the stable TS foundation for consumer logic.
- Keep Consumer A privacy-preserving: aggregate counts and deltas only, no raw comments in learned tables.
- Keep Consumer B deferred-only; no per-event live calls from feedback logging.
- Keep Consumer C conservative: constitutional/critical protection and narrow edge floor only.
- Close with env documentation and integration tests that verify the three consumers together.
<!-- /ANCHOR:what-needs-done -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Strict validation must pass for this parent and each child:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers --strict
```

Run the same command for each direct child folder before claiming the phase-parent scaffold is valid.
<!-- /ANCHOR:validation -->

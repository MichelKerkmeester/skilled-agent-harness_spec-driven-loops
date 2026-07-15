---
title: "005 — Learning Feedback Reducers"
description: "Phase-parent control packet for post-012 learning feedback reducers: shared aggregation foundation, session-trace causal reducer, learned retention reducer, and env/tests integration closeout."
trigger_phrases:
  - "027 phase 005"
  - "008 feedback reducers"
  - "feedback reducer phase parent"
  - "learning reducers"
  - "feedback aggregation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied 2026-06-05 audit rescope: amendment A/B + soft-dep"
    next_safe_action: "Implement children with audited relation-vocab and STATE_LIMITS export notes."
    blockers: []
    key_files: ["spec.md", "description.json", "graph-metadata.json"]
    completion_pct: 0
---
# Feature Specification: 005 — Learning Feedback Reducers (Phase Parent)

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | phase-parent |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement` |
| **Packet ID** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers` |
| **Hard Dependency** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety` |
| **Soft Dependencies** | equivalent shadow-eval evidence (no named-folder dependency; the prior `028/*` folders are not part of this tree) |
| **Scope Boundary** | Learning reducers only after the pt-04 audit boundary; P0 correctness fixes are owned by 002-memory-write-safety. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## 2. ROOT PURPOSE

Phase 005 coordinates the learning feedback reducers that consume existing feedback signals after Phase 002 has landed the required correctness preconditions. The parent holds no implementation tasks itself; it routes work into four child packets with explicit dependency order and shadow-to-live safety gates.

The pt-04 audit boundary is preserved here as a scope rule: this packet does not own the auto-provenance cap broadening, manual-edge overwrite guard, or retention tier-basement correctness fixes. Those fixes are the hard precondition in `002-memory-write-safety`. This parent covers only the reducer learning layer: aggregation, two consumers, and final env/test integration.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:phase-map -->
## 3. PHASE DOCUMENTATION MAP

| Child | Scope | LOC | Depends On | Language |
|-------|-------|-----|------------|----------|
| `001-aggregator` | Shared `feedback-aggregation.ts` foundation. Reads `feedback_events` from `feedback-ledger.ts` (SQLite-backed). | ~70 | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety` | TS |
| `003-causal-reducer` | `session-trace-causal-reducer.ts`. **Amendment A (iteration-036):** check candidate edges against `relation-coverage.ts` `DEFAULT_RELATION_TARGETS` (`mcp_server/lib/causal/relation-coverage.ts:L36-L45`) before insertion; skip edges whose relation type is already at or above its `minimumShare` floor (~+20 LOC). AUDIT 2026-06-05: `DEFAULT_RELATION_TARGETS` is misaligned with `RELATION_TYPES` (omits `enabled`); use `RELATION_TYPES`/schema as the relation-vocabulary source and align/validate the coverage targets before gating. | ~285 | `001-aggregator` | TS |
| `004-retention-reducer` | `feedback-retention-reducer.ts`. **Amendment B (iteration-036):** import `STATE_LIMITS` from `stage4-filter.ts` (`mcp_server/lib/search/pipeline/stage4-filter.ts:L64-L80`) rather than redeclaring tier priority constants; reducer's tier-basement decay decisions must remain consistent with pipeline filter caps (~+5 LOC). AUDIT 2026-06-05: `STATE_LIMITS` is non-exported (only `__testables`); add a production export in `stage4-filter.ts` before importing. | ~390 | `001-aggregator` | TS |
| `005-env-tests-integration` | ENV_REFERENCE flags and integration tests across the two consumers. | ~100 | `001`, `003`, `004` | TS + docs |

> **Planning note (iterations 050 and 059):** The P0 correctness split prescribed by pt-04 is already resolved architecturally — correctness fixes live in sibling packet `002-memory-write-safety` (hard dependency), not as a child of this phase. The `ccc-feedback.ts` JSONL handler cited in older research has been superseded by the SQLite-backed `feedback-ledger.ts`; `001-aggregator` correctly references `feedback_events` from that table. All consumers remain default-off and shadow-first until ledger quality, replay, and consumer-specific promotion criteria pass.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:execution-order -->
## 4. EXECUTION ORDER

1. Land `002-memory-write-safety` in main.
2. Land `005-learning-feedback-reducers/001-aggregator`.
3. Run `003-causal-reducer` and `004-retention-reducer` independently once the aggregator is available.
4. Land `005-env-tests-integration` after all three consumers are complete.

After 012 and 001 land, the two consumer children are intentionally independent: they use different modules.
<!-- /ANCHOR:execution-order -->

---

<!-- ANCHOR:what-needs-done -->
## 5. WHAT NEEDS DONE

- Keep all reducers default-off and shadow-first until evaluation gates allow live mutation.
- Prove ledger quality before reducers consume feedback: malformed rows, missing memory ids, duplicate events, and low-support windows must be counted and gated.
- Require shadow replay before live mutation: each consumer must replay representative feedback windows and record no-mutation shadow output before active behavior is allowed.
- Use consumer-specific live criteria: causal reducer needs edge safety evidence, and retention reducer needs protect/extend/delete audit evidence.
- Use the shared aggregation child as the stable TS foundation for consumer logic.
- Keep learned tables privacy-preserving: aggregate counts and deltas only, no raw comments.
- Keep the causal reducer deferred-only; no per-event live calls from feedback logging.
- Keep the retention reducer conservative: constitutional/critical protection and narrow edge floor only.
- Close with env documentation and integration tests that verify the three consumers together.
<!-- /ANCHOR:what-needs-done -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Strict validation must pass for this parent and each child:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers --strict
```

Run the same command for each direct child folder before claiming the phase-parent scaffold is valid.
<!-- /ANCHOR:validation -->

---

## Amendment — caura-memclaw Research (007)

CENTRAL REFRAME: MemClaw's direct, immediate, asymmetric feedback mutation (no shadow state, low weight feeding archival) is a cautionary ANTI-PATTERN that VALIDATES this phase's default-off / shadow-first stance. Scope Phase 1 to event-capture + diagnostics only; reserve system feedback artifact types as unforgeable; use symmetric/soft damping with constitutional immunity; and DEFER active reducers until measured ledger quality. Source: research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md; planned in 007/003.

---

## Amendment — OpenLTM Research (research phase 010)

Reinforces this phase's default-off / shadow-first stance and adds a re-shaped capture model. OpenLTM auto-mines memories from transcripts and git commits directly into rows (`hooks/src/EvaluateSession.ts`, `hooks/src/GitCommit.ts`, `hooks/lib/llmExtract.ts`) — **ROW-COUPLED, REJECT** for our authored-document store: silently minting memory rows from a transcript or a commit diff bypasses deliberate authorship and the continuity ladder. What transfers (DOC-ANALOG) is OpenLTM's **proposal-queue + opt-in gate** discipline (`hooks/lib/proposalQueue.ts`; capture flags default to false at `src/config.ts:71,73`; its safe `PreCompact` summary "mints nothing"). Re-shaped for us: any auto-capture may only emit **reviewed `handover.md` / `_memory.continuity` doc-patch suggestions** surfaced at a deliberate `/memory:save` — never a silent memory admission — and stays behind an opt-in, shadow-first gate consistent with this phase's reducer gates. This is purely an additive capture-surface direction; it does not change the existing reducer scope. Source: `research/010-openltm-memory-architecture-teachings/sub-packet-proposals.md` (corrected Priority 5) + `research.md` §8; planned in this phase and sibling `009-openltm-continuity-resilience`.

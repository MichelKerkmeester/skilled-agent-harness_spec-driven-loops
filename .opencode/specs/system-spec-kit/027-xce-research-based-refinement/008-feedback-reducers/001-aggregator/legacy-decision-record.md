---
title: "Decision Record — Phase 008 Shared Feedback Reducers"
description: "ADRs documenting design decisions for Phase 008: L3 designation, P0 fixes as preconditions, shared aggregation, deferred reducer firing, ±0.10 delta size, retention basement scope, edge-floor narrowness."
trigger_phrases:
  - "027 phase 008 ADRs"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored decision-record.md"
    next_safe_action: "ADRs are stable"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.0 -->
# Architectural Decision Records: Phase 008 Shared Feedback Reducers

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Why Level 3

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Pt-03 explicitly recommends L3 for Phase 008. User's scaffolding directive concurs.

**Decision:** Designate Phase 008 as Level 3.

**Rationale:**
- **Three downstream consumers** with independent decisions (rerank weights, causal edges, retention) — each with its own flags + telemetry + rollback semantics.
- **Cross-language** Python + TypeScript coordination across Consumer A + Sub-Phase 2 aggregation.
- **3 P0 precondition fixes** that touch correctness-critical code (causal-edges insert path + retention-sweep selection); each fix needs dedicated tests + decision record.
- **Governance mutation surface** — Consumer C modifies `delete_after` and writes audit ledger entries (governed deletion path).
- **Shadow-first promotion gate** copying `shadow-scoring.ts` weekly cycle pattern — fits L3's decision-record + checklist discipline.
- **Largest LOC budget** of the 5 phases (~400-650 prod + ~480-810 tests).

**Consequences:**
- decision-record.md mandatory.
- resource-map.md mandatory (per user directive).
- Strict validation gate applies.

---

## ADR-002: Why 3 P0 Fixes Are Preconditions, Not Concurrent Work

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Pt-03 iteration-008 + iteration-009 surface 3 correctness bugs in existing code that the new reducers depend on. Two viable scaffolding shapes: (a) ship fixes alongside reducers; (b) gate reducers behind fixes.

**Decision:** Sub-Phase 1 lands all 3 P0 fixes BEFORE Sub-Phases 4 (Consumer B) and 5 (Consumer C) ship.

**Rationale:**
- **P0-1 (auto-provenance bypass)** — without this, RQ-B3's `created_by='auto-session'` edges BYPASS the 0.5 strength cap. Shipping Consumer B with the bug would let session-trace edges grow unboundedly via insert/upsert.
- **P0-2 (manual-edge overwrite)** — without this, Consumer B's reducer wipes manually-authored causal edges on conflict. Production data corruption risk.
- **P0-3 (retention-sweep tier basement)** — without this, Consumer C's tier-aware extension logic operates on a row schema that doesn't expose tier; it can't make safe `protect` decisions. Constitutional records would still be deletable on TTL expiry.
- **Shipping fixes first** is the only safe order. The fixes are small (~50-80 LOC total) and the tests are decoupled from consumer logic.

**Consequences:**
- Sub-Phase 1 is non-negotiable; Sub-Phases 4+5 fail-closed without it.
- Consumer A (Sub-Phase 3) is independent and can ship without P0 fixes (no causal-edges or retention dependency).
- Test discipline: each fix has dedicated tests in Sub-Phase 1; consumer integration tests in Sub-Phase 4+5 verify the fixes are upstream-applied.

**Alternatives considered:**
- Embed fixes inside Consumer B/C tasks — rejected (mixes correctness fixes with feature work; risk of forgetting).
- Separate phase 011-precondition-fixes — rejected (overhead for ~50-80 LOC; clean to keep in 008).

---

## ADR-003: Shared Aggregation Layer with 3 Independent Consumers

**Status:** Accepted
**Date:** 2026-05-09
**Context:** RQ-A3, RQ-B3, RQ-B4 all consume `feedback_events`. Two viable shapes: (a) three independent reducers each scanning the events table; (b) one shared aggregation reducer feeding three independent decision-makers.

**Decision:** One shared aggregation (Sub-Phase 2) feeding three independent consumers (Sub-Phases 3-5).

**Rationale:**
- **Avoids triple feedback-event scanning cost** — large `feedback_events` table scanned once per window, not three times.
- **Preserves separation of concerns** — rerank weights, causal edges, retention decisions are distinct domains; each consumer owns its decision logic.
- **Enables consistent weighted-positive formula** — `weightedHitCount` defined ONCE in aggregation; consumers pull it. No formula drift across consumers.
- **Caches well** — aggregation output for `{since, until}` window can be cached and reused across consumers (future optimization).

**Consequences:**
- Sub-Phase 2 is the integration seam — its API stability matters.
- Consumer A is partial exception: it reads coco JSONL directly (different signal source) but uses aggregation utility for shared formula.
- Cross-consumer schema changes go through Sub-Phase 2 first.

**Alternatives considered:**
- Three independent reducers — rejected (cost + drift + harder to ensure consistent weighted-positive math).
- Single mega-reducer with all decisions inline — rejected (couples ranking + causal + retention; harder to test; harder to roll back individually).

---

## ADR-004: Deferred vs Live Reducer Firing

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Once feedback events are in the ledger, the reducer could (a) fire LIVE per-event, immediately creating edges / extending TTLs; or (b) fire DEFERRED at session-close / consolidation cycle / explicit maintenance.

**Decision:** All 3 reducers fire DEFERRED. NEVER live per-event.

**Rationale:**
- **Feedback-ledger contract is shadow-only** — `feedback-ledger.ts:4-6` and `memory-search.ts:1529-1530, 1561-1562` explicitly state feedback logging has NO ranking side effects.
- **Causal-edge insertion has IMMEDIATE ranking impact** — causal-boost (`causal-boost.ts:417-673`) walks edges from top seed IDs and injects neighbor rows. Live edge insertion turns passive telemetry into ranking mutation.
- **Retention TTL changes have FUTURE-state impact** — extending `delete_after` changes future memory availability; that's a governance mutation, not telemetry.
- **DEFERRED firing preserves shadow contract** — telemetry stays passive; reducer is an explicit operation (cron / consolidation / maintenance MCP tool).

**Consequences:**
- Reducers expose explicit invocation points (MCP tool `runSessionTraceReducer`, `runRetentionReducer`); not auto-fired from `logFeedbackEvent`.
- Causal edges from session traces appear in next consolidation cycle, not live.
- Retention extensions appear in next sweep cycle, not live.
- Operators must run reducer cycles regularly (added to existing maintenance docs).

**Alternatives considered:**
- Live per-event — rejected (ranking mutation; ledger contract violation).
- Async per-event (fire-and-forget queue) — rejected (race + telemetry pollution + harder rollback).
- Hybrid (shadow live + deferred apply) — rejected for v1 (complexity vs marginal latency win).

---

## ADR-005: Clamped ±0.10 Delta Size for Consumer A

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Consumer A applies a feedback-driven delta to coco's `_ranked_result()` score. The magnitude must be small enough to not override semantic distance, large enough to actually shift rankings on supported buckets.

**Decision:** `delta = clamp(weighted_signal / sample_count * 0.10, -0.10, +0.10)`.

**Rationale:**
- **Matches existing precedent** — `lib/feedback/batch-learning.ts:34-48` `MAX_BOOST_DELTA = 0.10` is the existing memory-side precedent for clamped feedback deltas.
- **Preserves semantic-distance dominance** — coco's underlying cosine score is in [0..1]; ±0.10 is meaningful but never overrides large semantic gaps.
- **Symmetric clamp** — positive and negative feedback bounded equally; no asymmetry that would skew toward positive.
- **Min support gate prevents premature deltas** — 5 rated events OR 3 distinct queries minimum; below that, `delta=0`.

**Consequences:**
- Effect size is bounded; even maximally positive feedback nudges score by 0.10.
- Ranking changes are observable but not catastrophic.
- If 028/004-code-graph-adoption-eval eval shows ±0.10 is too small, raising magnitude is a flag-controlled change (no schema migration).

**Alternatives considered:**
- ±0.05 — too tight; minimal observable change.
- ±0.20 — too loose; risks overriding semantic distance.
- Unbounded — rejected (precision risk; no precedent).
- Asymmetric (e.g. +0.05 / -0.15 to penalize harder) — rejected (introduces bias; defer to follow-on if needed).

---

## ADR-006: Constitutional/Critical Retention Basement

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Existing scoring treats constitutional/critical as no-decay (`tier-classifier.ts:185-213`, `importance-tiers.ts:32-55`, `fsrs-scheduler.ts:286-304`) but `memory-retention-sweep.ts:52-68` selects expired rows by `delete_after` only — so they can be deleted on TTL expiry. RQ-B4 proposes feedback-driven TTL extensions; we need a tier-aware basement.

**Decision:** Constitutional/critical → `protect` regardless of feedback signal or TTL. Important + positive feedback → `extend`. Normal/temporary → no positive boost in v1.

**Rationale:**
- **Closes existing P0 bug** (constitutional record deletion gap is a current-state correctness issue, not just a feedback-loop concern).
- **Aligned with scoring system** — scoring already treats these tiers as Infinity stability; sweep should match.
- **Narrow scope** — basement applies to memory records only; auto-derived edges from RQ-B3 do NOT get a tier-based floor (see ADR-007).
- **Conservative for normal/temporary** — feedback-driven TTL extension is opt-in for `important` only in v1; broaden after eval.

**Consequences:**
- `protect` action implementation must decide: clear `delete_after`, set far-future, or preserve original with governance marker (deferred to implementation; see open question).
- Sweep audit ledger gets new `retention_sweep:protect` event type.
- Scoring + sweep alignment makes governance behavior more predictable.

**Alternatives considered:**
- Apply basement to ALL tiers based on feedback — rejected (rewards exposure; conflates importance with usage).
- Skip the basement and rely on `decay: false` flag — rejected (sweep ignores this flag today; that's the bug).
- Basement only for explicitly-pinned records — rejected (constitutional/critical distinction has independent value beyond pinning).

---

## ADR-007: Edge Floor Narrowness

**Status:** Accepted
**Date:** 2026-05-09
**Context:** A blanket `strength >= 0.7` floor for any edge touching a constitutional memory is too broad — it would protect noisy auto-derived edges (RQ-B3 session-trace edges with `created_by='auto-session'`) just because one endpoint happens to be constitutional.

**Decision:** Floor `0.7` ONLY for edges where:
- `created_by === 'manual'` (or any non-auto), AND
- BOTH source AND target tiers ∈ {constitutional, critical}, OR
- explicit `evidence` marker like `"constitutional-chain:..."`.

**Rationale:**
- **Auto-derived edges should remain capped at 0.5 + decay normally** — they're inferred from session traces, not authored evidence.
- **One-endpoint-high-tier is too broad** — would create perverse incentives (any edge connecting to a constitutional record gets protected).
- **Both-endpoint-high-tier signals genuine constitutional dependency** — manual edges between two foundational records.
- **Evidence marker provides explicit override** — if a manual edge is part of a constitutional chain (e.g. spec→plan→tasks where spec is constitutional), evidence marker can document this even when not both endpoints are high-tier.

**Consequences:**
- `getEdgeTierBasement(edge, db)` helper joins source+target tier from `memory_index`.
- Floor logic isolated in `edge-tier-basement.ts` (separate testable module).
- Test scope: 3 cases (auto NOT floored; one-end-high-tier NOT floored; both-end-high-tier manual floored).

**Alternatives considered:**
- Blanket `0.7` floor for any edge with one constitutional endpoint — rejected (protects noise).
- No floor at all — rejected (loses protection for genuine constitutional dependencies).
- Floor based on evidence marker only — rejected (manual edges with both-endpoints-high-tier are valuable enough to floor without explicit marker).

---

## REFERENCES

- Pt-03 source: `../research/027-xce-research-pt-03/research.md` §§RQ-A3, RQ-B3, RQ-B4.
- Iteration narratives: `../research/027-xce-research-pt-03/iterations/iteration-003.md`, `iteration-008.md`, `iteration-009.md`.
- Delta records: `../research/027-xce-research-pt-03/deltas/iter-003.jsonl`, `iter-008.jsonl`, `iter-009.jsonl`.
- Causal edges: `mcp_server/lib/storage/causal-edges.ts:18-1038`.
- Consolidation: `mcp_server/lib/storage/consolidation.ts:330-400`.
- Retention sweep: `mcp_server/lib/governance/memory-retention-sweep.ts:1-195`.
- Feedback ledger: `mcp_server/lib/feedback/feedback-ledger.ts:1-338`.
- Shadow scoring (promotion gate): `mcp_server/lib/feedback/shadow-scoring.ts:1-494`.
- Batch learning (delta precedent): `mcp_server/lib/feedback/batch-learning.ts:34-48`.
- Tier classifier: `mcp_server/lib/cognitive/tier-classifier.ts:185-303`.
- Importance tiers: `mcp_server/lib/cognitive/importance-tiers.ts:32-119`.
- FSRS scheduler: `mcp_server/lib/cognitive/fsrs-scheduler.ts:286-304`.
- Causal boost: `mcp_server/lib/search/causal-boost.ts:417-673`.
- CCC feedback writer: `mcp_server/code_graph/handlers/ccc-feedback.ts:11-60`.
- Memory search feedback logging: `mcp_server/handlers/memory-search.ts:1529-1598`.

---

<!-- L3 STRUCTURAL APPENDIX: ADR-001 sub-anchored mirror per L3 contract.
     Substantive ADR-001 content is in the section above; the sub-anchored mirror below
     satisfies the validator's anchor + sufficiency checks. -->

<!-- ANCHOR:adr-001 -->
## ADR-001 (sub-anchored mirror)

<!-- ANCHOR:adr-001-context -->
### Context

Pt-03 verdict for this phase recommends Level 3 designation. After the 028/005-cocoindex-complete-fork complete-fork insertion, the 5 pt-03 phase children are numbered 007-011. The user's scaffolding directive elevates all 5 to Level 3 regardless of pt-03's per-phase L2/L3 suggestion, citing the cross-component nature of every recommendation and the governance discipline (feature flags, telemetry contracts, 028/004-code-graph-adoption-eval eval gates) that L3 enforces.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Designate Phase 008 as **Level 3**. Apply full L3 file contract: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json, plus per-child resource-map.md per user directive.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Level 2** — pt-03 originally suggested L2 for some phases (006/007/009 by LOC alone). Rejected because user's scaffolding directive uniformly elevates to L3, and cross-component nature justifies L3 governance regardless of LOC.
- **Level 3+** — applies for multi-agent or enterprise-governance work. Not justified for this phase scope.
- **Defer to follow-on packet** — rejected because pt-03's bundled recommendations are sized for one packet each, not split across follow-ons.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- decision-record.md mandatory (this file).
- resource-map.md mandatory per user directive.
- Strict spec validation gate applies before merge.
- Implementation-summary.md must be filled with concrete file:line citations after Sub-Phases land.
- 028/004-code-graph-adoption-eval eval gate required for any active-mode rollout.
- Test discipline includes unit + integration + diff (backward-compat) + 028/004-code-graph-adoption-eval paired comparison.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Checks Verification

1. **Cross-component change?** Yes — touches multiple subsystems and/or runtimes.
2. **New feature flag family?** Yes — default-off rollout per pt-03 universal pattern.
3. **Telemetry contract introduced?** Yes — per-phase eval logger events documented in REQs.
4. **Promotion gate required?** Yes — 028/004-code-graph-adoption-eval eval lift before active mode.
5. **Hot-path or governance impact?** Yes — affects retrieval / cognitive activation / governance decisions per phase scope.

All five checks affirmative → Level 3 designation justified.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

- Sub-Phases listed in plan.md.
- Tasks T### in tasks.md.
- Verification CHK-### in checklist.md.
- File inventory in resource-map.md.
- All ADR-001 sub-anchors above mirror substantive content from "ADR-001: Why Level 3" section earlier in this file.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

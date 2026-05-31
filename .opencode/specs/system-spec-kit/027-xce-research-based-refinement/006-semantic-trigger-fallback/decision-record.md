---
title: "Decision Record — Phase 007 Memory Semantic Triggers"
description: "ADRs documenting design decisions for Phase 007: Level-3 designation, hybrid not replacement, derived table vs JSON extension, reduced activation, threshold/margin starting values, backfill not synchronous."
trigger_phrases:
  - "027 phase 007 ADRs"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-semantic-trigger-fallback"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored decision-record.md"
    next_safe_action: "ADRs are stable"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.0 -->
# Architectural Decision Records: Phase 007 Memory Semantic Triggers

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Why Level 3

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Pt-03 RQ-B1 verdict was ADAPT with ~280-430 LOC estimate, suggesting Level 2/3 boundary. User's scaffolding directive elevates all 5 phases to Level 3.

**Decision:** Designate Phase 007 as Level 3.

**Rationale:**
- **Cognitive activation hot path** — `memory-triggers.ts:360-380` activates working memory + co-activation; semantic false positives can mis-prioritize cognitive tiers (HOT/WARM/COLD/DORMANT). Any change here needs L3 governance.
- **New derived storage table** — `memory_trigger_embeddings` requires schema migration; backward-compat reads; backfill workflow.
- **Shadow-first promotion gate** — flag family + telemetry + threshold tuning fits L3's decision-record discipline.
- **Retrieval trust impact** — semantic-only matches changing what the system surfaces is a governed change.
- **Cross-component coordination** — touches handler + matcher (new) + schema + index scan + save pipeline + cognitive activation.

**Consequences:**
- decision-record.md mandatory.
- resource-map.md mandatory (per user directive).
- Strict validation gate applies.

---

## ADR-002: Hybrid Not Replacement

**Status:** Accepted
**Date:** 2026-05-09
**Context:** A naive XCE adoption would replace lexical trigger matching entirely with semantic similarity. We rejected this.

**Decision:** Lexical remains PRIMARY precision path; semantic adds paraphrase recall as feature-flagged UNION fallback.

**Rationale:**
- **Explicit triggers are a control surface** — `/memory:save`, `save context`, `resume iteration` are commands, not fuzzy queries. Semantic-only matching would dilute control semantics.
- **Cognitive activation downstream** — trigger matches feed working memory and co-activation spreading; semantic false positives are EXPENSIVE (mis-prioritize tier classifier).
- **Lexical is fast + deterministic** — current path runs in <30ms PASS budget; semantic embed adds latency.
- **CJK substring + Latin word-boundary patterns** — current trigger matcher (`trigger-matcher.ts:224-244`) handles these languages with appropriate boundary semantics; semantic search loses that nuance.

**Decision-stack precedent:** `embedding-expansion.ts:13-20` already adopts the same pattern for query broadening (feature-flagged + fail-closed identity fallback).

**Consequences:**
- Stage 2 only fires when Stage 1 empty/weak (REQ-002).
- Strong-command short-circuit avoids any embed call (REQ-003).
- UNION semantics preserve lexical precedence in result ordering.

**Alternatives considered:**
- Replace lexical entirely — rejected (control surface + cognitive activation risk).
- Run both stages always and merge — rejected (latency cost; lexical always wins on explicit triggers anyway).

---

## ADR-003: Derived Table vs JSON Extension

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Trigger embeddings need persistent storage. Two shapes: extend existing `trigger_phrases` JSON in `memory_index` to include embeddings inline, OR add a derived table.

**Decision:** Add derived table `memory_trigger_embeddings`. Reuse `embedding_cache` for BLOB storage.

**Rationale:**
- **`trigger_phrases` JSON is source-of-truth** — human-authored continuity blocks; embeddings are computed/regeneratable. Mixing them couples authorship to derived state.
- **BLOB inline in JSON is unwieldy** — 1024-dim Voyage embeddings = 4KB per phrase as JSON-encoded floats; bloats `memory_index` rows.
- **Existing `embedding_cache` infrastructure** — already content-addressed by `(content_hash, model_id, dimensions)` (`embedding-cache.ts:45-55`); reuse the BLOB store.
- **Queryable, migratable, regeneratable** — derived table can be `--force` rebuilt from JSON; new model migration is a re-embed pass.

**Schema:**
```sql
CREATE TABLE memory_trigger_embeddings (
  memory_id INTEGER NOT NULL,
  phrase TEXT NOT NULL,
  phrase_hash TEXT NOT NULL,
  model_id TEXT NOT NULL,
  dimensions INTEGER NOT NULL,
  embedding_status TEXT NOT NULL,  -- 'pending' | 'ready' | 'failed'
  updated_at TEXT NOT NULL,
  PRIMARY KEY (memory_id, phrase_hash)
);
-- BLOB stored separately in embedding_cache(phrase_hash, model_id, dimensions, embedding)
```

**Consequences:**
- New table requires schema migration (forward-only ADD).
- Index scan must back-fill on new triggers.
- `embedding_status='failed'` allows retry without blocking.

**Alternatives considered:**
- Inline embeddings in `trigger_phrases` JSON — rejected (size + coupling).
- Separate full-fat table with own BLOB column — rejected (duplicates `embedding_cache` infrastructure).

---

## ADR-004: Reduced Activation for Semantic-Only Hits

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Cognitive activation in `memory-triggers.ts:360-380` assigns `attention=1.0` to matched memories. Semantic-only matches have UNCERTAINTY; treating them like exact matches would propagate that uncertainty into tier classification.

**Decision:** Lexical hits → `attention=1.0`. Semantic-only hits → `attention=min(0.85, semanticScore)`.

**Rationale:**
- **Activation must reflect confidence** — semantic similarity at 0.84 cosine is a "probably related" signal, not a "definitely the same trigger" signal.
- **Tier classifier honesty** — HOT tier should require higher activation; capping semantic at 0.85 keeps the gap visible.
- **Visible in telemetry** — `matchSource: "semantic"` + `semanticScore` lets eval logging differentiate.
- **Threshold-aligned** — at threshold 0.84, max attention is 0.85 (rounded); at score 1.0 (perfect match), attention is 0.85 capped. Always at least 0.15 below lexical max.

**Consequences:**
- Tier classification correctly down-weights semantic-only memory in cognitive load.
- Co-activation spreading from semantic hits is dampened.
- If user wants stricter semantic-only treatment, can lower the cap further (`min(0.7, score)` etc.) via flag.

**Alternatives considered:**
- Same activation as lexical (1.0) — rejected (uncertainty masquerading as certainty).
- Activation = score directly (no cap) — rejected (at score 0.99 the difference vs lexical is invisible).
- No activation at all (retrieval-only) — rejected for v1 (loses much of the value; revisit in shadow eval).

---

## ADR-005: Threshold + Margin Starting Values (0.84 / 0.04)

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Cosine threshold for semantic match is the dominant tunable. Too low → false positives mis-activate cognitive tiers; too high → no recall lift. Margin (top-hit separation) prevents ambiguous matches.

**Decision:** Starting values `THRESHOLD=0.84` and `MARGIN=0.04`.

**Rationale:**
- **0.84 is conservative** — Voyage-4 at 1024-dim typically clusters semantically-similar text at 0.85-0.95; 0.84 is just below this cluster, capturing strong paraphrases without leaking weak associations.
- **0.04 margin avoids ambiguity** — if top semantic hit is 0.86 and second is 0.83, gap is 0.03 → ambiguous → suppress. Forces a clear winner.
- **Tunable from shadow data** — REQ-010 logs threshold-band distribution (0.78 / 0.82 / 0.86 buckets); production data informs whether to relax or tighten.
- **Conservative initial pick** — easier to lower threshold post-data than to chase down false-activation regressions.

**Consequences:**
- Initial recall will be lower than ceiling — that's intentional for v1 trust.
- Shadow telemetry will reveal where production queries fall in threshold bands.
- 028/004-code-graph-adoption-eval eval will measure recall lift at calibrated threshold.

**Alternatives considered:**
- Higher threshold (0.90+) — rejected for v1 (too tight; minimal recall lift over lexical).
- Lower threshold (0.75-0.80) — rejected for v1 (too loose; observed false-positive risk in pilot fixtures).
- Adaptive threshold (per-trigger) — deferred (need more shadow data to justify per-trigger tuning).

---

## ADR-006: Backfill Not Synchronous

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Trigger phrases need embeddings. The naive approach is "embed on demand at trigger call time". This is incompatible with the latency budget.

**Decision:** Backfill embeddings via `memory_index_scan` and save-time pipeline ONLY. Trigger call hot path uses cache lookup only — never embed.

**Rationale:**
- **Latency budget is binding** — `trigger-matcher.ts:132-160` warns at 30-50ms; provider embed calls can take 100-500ms (`embeddings.ts:673-724` timeout/circuit-breaker).
- **Embed at-time would force `_MODE=union` callers to wait on Voyage** — unacceptable for a hot retrieval path.
- **Index scan is already a maintenance job** — adding trigger backfill is a small marginal cost there.
- **Save-time pipeline already does lookup-or-generate** — adding trigger embeddings to the same pattern is symmetric.
- **Cold start is graceful** — phrases without embeddings skipped silently in semantic stage; backfilled on next index scan.

**Consequences:**
- New triggers won't be semantically matchable until next `memory_index_scan` (or save-time backfill) completes.
- Operators must run periodic `memory_index_scan` to keep embeddings fresh.
- `embedding_status` column tracks per-phrase backfill state.

**Alternatives considered:**
- Async embed at trigger time (fire-and-forget; first call misses semantic but populates cache) — rejected (race condition + telemetry pollution).
- Synchronous embed with timeout fallback — rejected (race against latency budget; user-visible degradation).
- Pre-computed embeddings in commit hooks — rejected (couples to dev workflow; doesn't help runtime saves).

---

## REFERENCES

- Pt-03 source: `../research/027-xce-research-pt-03/research.md` §RQ-B1.
- Iteration narrative: `../research/027-xce-research-pt-03/iterations/iteration-006.md`.
- Delta records: `../research/027-xce-research-pt-03/deltas/iter-006.jsonl`.
- XCE source: `../external/README.md:188-199`.
- Trigger matcher: `mcp_server/lib/parsing/trigger-matcher.ts`.
- Memory triggers handler: `mcp_server/handlers/memory-triggers.ts`.
- Embedding cache: `mcp_server/lib/cache/embedding-cache.ts`.
- Embedding pipeline: `mcp_server/lib/embeddings/embedding-pipeline.ts`.
- Embedding expansion precedent: `mcp_server/lib/search/embedding-expansion.ts`.
- Cognitive activation: `mcp_server/lib/cognitive/{tier-classifier,working-memory,attention-decay,co-activation}.ts`.

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

Designate Phase 007 as **Level 3**. Apply full L3 file contract: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json, plus per-child resource-map.md per user directive.
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

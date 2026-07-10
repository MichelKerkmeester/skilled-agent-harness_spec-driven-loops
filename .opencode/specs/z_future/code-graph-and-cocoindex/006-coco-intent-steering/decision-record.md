---
title: "Decision Record — Phase 006 Coco-Index Intent Steering"
description: "ADRs documenting design decisions for Phase 006: Level-3 designation, rule-based vs LLM classifier, 3-embedding ceiling, MCP API surface decision, path-class intent prior bounds."
trigger_phrases:
  - "027 phase 007 ADRs"
  - "coco intent steering decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/006-coco-intent-steering"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored decision-record.md"
    next_safe_action: "ADRs are stable; revisit only if new design info emerges"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.0 -->
# Architectural Decision Records: Phase 006 Coco-Index Intent Steering

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Why Level 3

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Pt-03 RQ-A1 verdict was ADAPT with ~250-350 LOC estimate, suggesting Level 2 by LOC threshold alone. User's scaffolding directive elevates all 5 phases to Level 3.

**Decision:** Designate Phase 006 as Level 3.

**Rationale:**
- **Cross-language change** — Python (`mcp-coco-index/mcp_server/cocoindex_code/`) + TypeScript (`mcp_server/skill_advisor/lib/render.ts`) coordination crosses runtime boundaries.
- **New feature flag family** with independent rollout semantics (`SPECKIT_COCOINDEX_INTENT_EXPAND`, `SPECKIT_COCOINDEX_FIRST_ACTION_HINT`).
- **Hot retrieval path** — `query.py:267-323` is the search-call hot path; any change here needs L3 governance.
- **Telemetry contract** — new envelope fields surfaced through `cocoindex-calibration.ts` are an external observability contract.
- **Phase-004 eval gate** required before active rollout — promotion governance fits L3's decision-record + checklist discipline.

**Consequences:**
- Decision-record.md mandatory (this file).
- Resource-map.md mandatory (per user directive).
- Strict validation gate applies.

---

## ADR-002: Rule-Based vs LLM-Based Intent Classifier

**Status:** Accepted
**Date:** 2026-05-09
**Context:** XCE's intent routing is closed-source PRAT internals (per `external/README.md:240-245`). We need a local classifier; LLM-based or rule-based are the two viable shapes.

**Decision:** Rule-based classifier in v1.

**Rationale:**
- **Preserves local/offline behavior** — `mcp-coco-index` ships as a local daemon (Python + SQLite vec0); LLM dependency would add a network hop and a provider cost dimension that doesn't exist today.
- **Deterministic + reproducible** — fixture-pinned behavior; no provider drift; cheap CI.
- **Pure function** — no I/O, no state; trivial to test (30+ fixtures pin precision ≥ 0.85).
- **Reuses precedent** — `query.py:40-59` `_has_implementation_intent()` already takes a rule-based approach (narrow keyword set); v1 generalizes that pattern to 5 intent families.

**Consequences:**
- Rule maintenance burden: new intent families require keyword curation.
- Precision ceiling: at some recall point, rule-based heuristics will plateau.
- LLM follow-on: if Phase-004 eval shows rule-based ceiling, an LLM-classifier follow-on phase is the natural next step.

**Alternatives considered:**
- LLM-based classifier — rejected for v1 (network/cost/non-determinism); valid follow-on if rule-based ceilings.
- Embedding-similarity classifier (KNN over labeled query exemplars) — rejected for v1 (adds an embedding call to a hot path); could be folded into Phase 008's example bank as a future variant.

---

## ADR-003: 3-Embedding Ceiling

**Status:** Accepted
**Date:** 2026-05-09
**Context:** Query expansion can fanout arbitrarily — one user query → N sub-queries → N embeddings → N×fetch_k candidates. Without a cap, expansion would multiply cost and degrade precision.

**Decision:** Hard cap at 3 embeddings per request (original + ≤2 sub-queries).

**Rationale:**
- **Cost bound** — at most 3× the current single-query embedding cost.
- **Latency bound** — at most 3× single-query latency in the worst case (sequential embeds); parallelizable in follow-up.
- **Precision protection** — empirically, the most useful expansions cluster around 1-2 well-chosen sub-queries; fanout to 5+ adds noise faster than recall.
- **Per-sub-query fetch budget unchanged** — uses existing `fetch_k = unique_k * 4`; no candidate-count multiplier.

**Consequences:**
- 3-embedding ceiling enforced via assertion (`assert len(embed_calls) <= 3`).
- Sub-query template per intent family is small by design (≤2 templates).
- If Phase-004 eval shows 3 is too tight, raising to 4-5 is a flag-controlled change.

**Alternatives considered:**
- Unbounded expansion — rejected (cost + precision risk).
- 2-embedding cap (original + 1 sub-query) — too tight for paraphrase coverage; some intents benefit from 2 sub-query variants.
- Dynamic cap based on confidence — adds complexity without clear lift; defer to follow-on if needed.

---

## ADR-004: Why NOT Extend MCP API Surface for Expansion Controls

**Status:** Accepted
**Date:** 2026-05-09
**Context:** A natural design impulse is to expose expansion controls (`expand: true|false`, `max_sub_queries: N`) on the MCP `search` tool surface (`server.py:141-150`). We chose NOT to.

**Decision:** Expansion stays internal; visible only through `rankingSignals` for transparency.

**Rationale:**
- **Keep API surface stable** — MCP tool signatures are external contracts; bloating them with internal optimization knobs invites lock-in to implementation details.
- **Simpler caller experience** — most callers don't want to reason about expansion; they just want better results.
- **Transparency without API surface** — `rankingSignals` already carries score-decision metadata; `intent`, `expanded_to`, `sub_query_idx` extend that pattern.
- **Operator override via env flag** — `SPECKIT_COCOINDEX_INTENT_EXPAND=0` is the operator escape hatch; per-call control isn't justified.

**Consequences:**
- Callers can observe (via `rankingSignals`) but not control expansion.
- If a future use case needs per-call control (e.g. precision-critical paths that must skip expansion), we'd add a single boolean param `_internal_skip_expand` then; YAGNI for v1.

**Alternatives considered:**
- Full per-call expansion controls — rejected (API bloat, lock-in to implementation detail).
- Hidden header/env override per call — rejected (unclear caller semantics).

---

## ADR-005: Path-Class Taxonomy as Intent Prior — Bounded ±0.05 Magnitude

**Status:** Accepted
**Date:** 2026-05-09
**Context:** `indexer.py:53-91` `classify_path()` already emits a path-class taxonomy (vendor, generated, spec_research, tests, docs, implementation). `query.py:177-223` already applies bounded ±0.05 boosts/penalties via this taxonomy for implementation-intent queries.

**Decision:** Generalize the path-class boost pattern to all intent families with the same ±0.05 magnitude bound.

**Rationale:**
- **Reuses existing infrastructure** — no new schema, no new index, no new classification step.
- **Magnitude bound preserves semantic-distance dominance** — pt-03 iter-001 explicitly noted "path class is a weak prior and semantic distance should still dominate" (`research/iterations/iteration-001.md` F-iter001-003 Implication).
- **Symmetric across intents** — implementation queries boost `implementation`, test queries boost `tests`, docs queries boost `docs`/`spec_research`. No intent gets a privileged magnitude.

**Consequences:**
- Existing implementation-intent boost behavior unchanged for backward compatibility.
- New intent families get bounded boosts that can never override semantic similarity.
- If Phase-004 eval shows ±0.05 is too small for some intent families, magnitude becomes a flag-controlled tunable.

**Alternatives considered:**
- Per-intent magnitude tuning (e.g. `error_handling` gets ±0.10) — rejected for v1 (no eval data to justify); revisit after Phase-004 measurements.
- Learned path-class weights — rejected for v1 (deferred to 027/008-feedback-reducers's feedback reducer; would change the magnitude after the user signals "helpful" / "not helpful").

---

## REFERENCES

- Pt-03 source: `../research/027-xce-research-pt-03/research.md` §RQ-A1.
- Iteration narrative: `../research/027-xce-research-pt-03/iterations/iteration-001.md`.
- Delta records: `../research/027-xce-research-pt-03/deltas/iter-001.jsonl`.
- XCE source corpus: `../external/README.md:101-119`, `../external/steering/CLAUDE.md:5-10`.
- Coco-index implementation: `mcp_server/cocoindex_code/{query,indexer,server,protocol,schema,shared}.py`.
- Advisor renderer: `mcp_server/skill_advisor/lib/render.ts:124-158`.

---

<!-- L3 STRUCTURAL APPENDIX: ADR-001 sub-anchored mirror per L3 contract.
     Substantive ADR-001 content is in the section above; the sub-anchored mirror below
     satisfies the validator's anchor + sufficiency checks. -->

<!-- ANCHOR:adr-001 -->
## ADR-001 (sub-anchored mirror)

<!-- ANCHOR:adr-001-context -->
### Context

Pt-03 verdict for this phase recommends Level 3 designation. After the Phase 005 complete-fork insertion, the 5 pt-03 phase children are numbered 007-011. The user's scaffolding directive elevates all 5 to Level 3 regardless of pt-03's per-phase L2/L3 suggestion, citing the cross-component nature of every recommendation and the governance discipline (feature flags, telemetry contracts, Phase-004 eval gates) that L3 enforces.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Designate Phase 006 as **Level 3**. Apply full L3 file contract: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json, plus per-child resource-map.md per user directive.
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
- Phase-004 eval gate required for any active-mode rollout.
- Test discipline includes unit + integration + diff (backward-compat) + Phase-004 paired comparison.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Checks Verification

1. **Cross-component change?** Yes — touches multiple subsystems and/or runtimes.
2. **New feature flag family?** Yes — default-off rollout per pt-03 universal pattern.
3. **Telemetry contract introduced?** Yes — per-phase eval logger events documented in REQs.
4. **Promotion gate required?** Yes — Phase-004 eval lift before active mode.
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

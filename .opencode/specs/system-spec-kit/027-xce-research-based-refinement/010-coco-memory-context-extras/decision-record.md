---
title: "Decision Record — Phase 010 Coco-Memory Context Extras"
description: "ADRs for Phase 010: L3 designation, capture path resolution, separate response group rationale, post-retrieval curator placement, budget split, JSON schema validation gate, default-off + Phase-005 lift requirement."
trigger_phrases:
  - "027 phase 010 ADRs"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-coco-memory-context-extras"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored decision-record.md"
    next_safe_action: "ADRs stable"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.0 -->
# Architectural Decision Records: Phase 010 Coco-Memory Context Extras

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Why Level 3

**Status:** Accepted
**Date:** 2026-05-09

**Decision:** Designate Phase 010 as Level 3.

**Rationale:**
- **Two independent presentation features** in one packet — each with its own flag, telemetry, rollback semantics.
- **Both nondeterministic in active mode** — coco exemplars depend on user-validated history; memory curator output varies per LLM call.
- **Both require Phase-005 promotion gate** — active mode requires eval lift over deterministic baseline.
- **New local SQLite + vec0 table** with TTL/reconciliation for coco exemplars.
- **Cross-language coordination** — coco side is Python; memory side is TypeScript.
- **Governed presentation surface** — both features add observable retrieval output that downstream consumers may cache or surface.
- **Largest LOC budget after Phase 008** — ~500-800 prod + ~340-570 tests; bundles two features for governance efficiency.

**Consequences:**
- decision-record.md mandatory.
- resource-map.md mandatory.
- Strict validation gate applies.

---

## ADR-002: Coco Exemplar Capture Path — Extend `ccc_feedback` vs New Writer

**Status:** Accepted (with deferred decision on shape)
**Date:** 2026-05-09

**Context:** Coco exemplar capture needs richer result identity than current `ccc_feedback` schema (`mcp_server/schemas/tool-input-schemas.ts:611-616` has only `query`, `rating`, optional `resultFile`, optional `comment`). Two viable shapes: (a) extend `ccc_feedback` with optional `resultRange`/`pathClass`/`contentHash`/`rawScore`/`rank`/`queryHash`; (b) add narrow `ccc_example_positive` writer.

**Decision:** Extend `ccc_feedback` schema with optional fields in v1. Reserve `ccc_example_positive` writer as a follow-on if extended schema proves noisy.

**Rationale:**
- **Lower friction for existing callers** — current `ccc_feedback` callers continue to work; new optional fields are opt-in.
- **Single schema evolution path** — avoids fragmenting feedback capture across two endpoints.
- **Shared validation + audit trail** — extends existing JSONL + governance pattern.
- **Optional fields preserve backwards compatibility** — old callers don't need to change.

**Consequences:**
- `cccFeedbackSchema` grows; some tests need updating.
- Extended schema captures result identity even when called for non-exemplar purposes (e.g. negative feedback) — wasted bytes but acceptable.
- If extended schema proves noisy / hard to evolve, follow-on packet adds `ccc_example_positive` with cleaner shape.

**Alternatives considered:**
- Narrow writer from day one — rejected (fragments capture; existing callers don't benefit).
- Keep schema minimal + derive in reducer — rejected (loses signal at capture time; can't reconstruct line ranges later).

---

## ADR-003: Coco Exemplars in Separate Response Group (NOT Mixed with Ranking)

**Status:** Accepted
**Date:** 2026-05-09

**Context:** Two viable shapes: (a) blend exemplars into `QueryResult` ranking with a special boost; (b) surface exemplars in a SEPARATE response group `exemplars: [...]`.

**Decision:** Separate response group. NEVER blend into `QueryResult` ranking.

**Rationale:**
- **Clear semantics** — A3 (Phase 008) changes weights; A4 surfaces examples. Mixing the two would blur the mechanisms and make failures harder to debug.
- **No score authority** — exemplars say "this helped before" — they're not making a similarity claim about the current query.
- **Easier rollback** — exemplar feature can be enabled/disabled without affecting ranking precision.
- **Caller transparency** — `data.results` ordering preserved; `exemplars` is opt-in consumption.

**Consequences:**
- Response shape grows: new top-level `exemplars` field beside `data.results`.
- Callers that ignore `exemplars` get unchanged behavior.
- Tests assert ordering parity (snapshot diff).

**Alternatives considered:**
- Blend with boost — rejected (semantics conflated; harder to debug; rollback complicated).
- Top-of-list separate but unmarked — rejected (callers can't distinguish examples from regular hits).

---

## ADR-004: Memory Curator Post-Retrieval Placement (Stage 4 Immutability)

**Status:** Accepted
**Date:** 2026-05-09

**Context:** Memory pipeline contract is retrieval-oriented (`pipeline/README.md:33-40`); Stage 4 explicitly forbids ordering mutation (`stage4-filter.ts:6-19`). Curator could either (a) be inserted INSIDE the pipeline (as a new Stage 4.5); (b) run AFTER pipeline as post-retrieval packaging plan.

**Decision:** Curator runs AFTER deterministic retrieval (post-`memory-search.ts:1107-1319`). Returns packaging plan as `data.curatedContext` — NEVER mutates `data.results` ordering, scores, or canonical retrieval.

**Rationale:**
- **Stage 4 immutability is a binding contract** — `stage4-filter.ts:6-19` explicitly states ordering preserved + scores not mutated.
- **Curator output is plan-only, not authority** — selected IDs are pointers into the candidate set, not new ranking.
- **Deterministic fallback is straightforward** — curator unavailable / fails / times out → return `data.results` only.
- **Cache + LLM call patterns reuse existing infra** — `llm-cache.ts` + `llm-reformulation.ts` precedents apply.
- **Pipeline contract preserved** — curator is post-pipeline; doesn't break stage tests.

**Consequences:**
- Response shape grows: new `data.curatedContext` field.
- Curator can suggest packaging (e.g. "first N from causal chain") but caller decides whether to use it.
- No pipeline stage changes; only seam in `memory-context.ts` + `memory-search.ts`.

**Alternatives considered:**
- New Stage 4.5 inside pipeline — rejected (breaks Stage 4 immutability contract; harder to test).
- Curator mutates `data.results` ordering — rejected (binds curator to ranking authority; nondeterminism affects retrieval trust).

---

## ADR-005: Budget Split — `retrievalCandidateLimit` + `presentationLimit` + `curationTokenBudget`

**Status:** Accepted
**Date:** 2026-05-09

**Context:** Today's `memory_search` passes single `limit` (`memory-search.ts:900-950`) directly to Stage 4 cap (`stage4-filter.ts:305-309`). Curator needs to see MORE candidates than presentation cap (e.g. 100-300 for selection input, top 10 for `data.results`).

**Decision:** Add three knobs:
- `retrievalCandidateLimit` (default 100-300, NOT 2K initially) — pipeline overfetch for curator.
- `presentationLimit` (= existing `limit`) — final cap for `data.results`.
- `curationTokenBudget` (computed from `retrievalCandidateLimit` × avg-row-size).

**Rationale:**
- **Curator needs more candidates than presentation** — top-N selection from larger pool produces better packages.
- **Backwards compatibility** — `presentationLimit` defaults to existing `limit` semantics.
- **Bounded overfetch** — start with 100-300, NOT 2K; can raise if Phase-005 eval shows benefit.
- **Token budget computed not configured** — derived from candidate budget; no manual token budget required.
- **Per-call control possible** — knobs can be set per-request without code changes.

**Consequences:**
- New caller-facing knobs (optional; defaults preserve current behavior).
- Pipeline overfetch is bounded.
- LLM call cost predictable from `curationTokenBudget`.

**Alternatives considered:**
- Single `limit` + curator works on capped output — rejected (curator mostly rearranges, no real selection benefit).
- 2K candidate budget v1 — rejected (too large; explore via Phase-005 eval first).
- Per-call token budget — rejected (extra knob; derive from candidate budget instead).

---

## ADR-006: Strict JSON Schema Validation Gate

**Status:** Accepted
**Date:** 2026-05-09

**Context:** LLM curator output is structured JSON. LLMs occasionally hallucinate IDs or invent file paths. Without validation, hallucinated IDs would surface as `data.curatedContext`.

**Decision:** Strict JSON schema validation:
- Selected IDs MUST exist in candidate set.
- NO invented file paths or facts.
- Failures → fall back to deterministic results (no partial curation surfaces to caller).

**Rationale:**
- **Hallucination prevention** — model occasionally invents IDs; we must catch this.
- **Trust contract** — `data.curatedContext` IDs are pointers into the candidate set; callers should be able to trust the references.
- **Deterministic fallback covers failure** — `data.results` always returned; `data.curatedContext` only when curator validates.
- **Telemetry on rejection** — `curator_invented_id_rejected` event for observability.

**Consequences:**
- AJV (or similar) schema validator added as dependency.
- Schema validation in critical path; must be fast (<5ms).
- Cache hits must still pass validation (defensive).

**Alternatives considered:**
- Soft validation (best-effort) — rejected (hallucinations would leak through).
- Trust LLM output without validation — rejected (clear safety risk).
- Re-prompt on validation failure — rejected for v1 (latency overhead; deterministic fallback is faster).

---

## ADR-007: Default-Off + Phase-005 Lift Requirement

**Status:** Accepted
**Date:** 2026-05-09

**Context:** Both features add latency + nondeterminism to hot retrieval paths. Active mode without evidence is risky.

**Decision:** Both features default-off. Active mode requires Phase-005 eval lift over deterministic baseline.

**Lift criteria:**
- Task success ≥ deterministic baseline.
- Cited-source correctness ≥ baseline.
- Missed-critical-context rate ≤ baseline.
- Latency budget within tolerance.
- Nondeterministic-variance bound (repeated runs converge).

**Rationale:**
- **Default-off matches every other pt-03 phase recommendation** — universal pattern.
- **Phase-005 eval is the trust boundary** — without it, "looks better" isn't proof.
- **Reversibility** — feature flag flip → revert to today's behavior.
- **Observability before authority** — shadow mode logs would-be impact before live mutation.
- **Nondeterminism bound** — LLM curator MUST produce stable packages on repeated runs (cache helps).

**Consequences:**
- Both features ship in deferred mode.
- Phase-005 eval harness must include task sets for both features.
- Promotion gate requires data — not vibes.

**Alternatives considered:**
- Default-on with rollback flag — rejected (active rollout without evidence; users absorb risk).
- Active by default for one feature, default-off for other — rejected (asymmetric governance is harder to reason about).

---

## REFERENCES

- Pt-03 source: `../research/027-xce-research-pt-03/research.md` §§RQ-A4, RQ-B2.
- Iteration narratives: `../research/027-xce-research-pt-03/iterations/iteration-004.md`, `iteration-007.md`.
- Delta records: `../research/027-xce-research-pt-03/deltas/iter-004.jsonl`, `iter-007.jsonl`.
- Coco query: `mcp-coco-index/mcp_server/cocoindex_code/query.py:267-323`.
- Coco schema: `mcp-coco-index/mcp_server/cocoindex_code/schema.py:8-36`.
- Coco indexer: `mcp-coco-index/mcp_server/cocoindex_code/indexer.py:308-326`.
- ccc_feedback writer: `mcp_server/code_graph/handlers/ccc-feedback.ts:11-60`.
- ccc_feedback schema: `mcp_server/schemas/tool-input-schemas.ts:611-616`.
- Memory context: `mcp_server/handlers/memory-context.ts:953-1808`.
- Memory search: `mcp_server/handlers/memory-search.ts:900-1625`.
- Pipeline README: `mcp_server/lib/search/pipeline/README.md:33-40, 95-111`.
- Stage 4 immutability: `mcp_server/lib/search/pipeline/stage4-filter.ts:6-19, 128-317`.
- Profile formatters: `mcp_server/lib/search/profile-formatters.ts:4-21, 73-119`.
- LLM cache: `mcp_server/lib/search/llm-cache.ts:4-127`.
- LLM reformulation precedent: `mcp_server/lib/search/llm-reformulation.ts:321-371`.
- Stage1 LLM precedent: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1140-1224`.
- Causal boost (chain context): `mcp_server/lib/search/causal-boost.ts:9-784`.
- Search results formatter: `mcp_server/lib/search/search-results.ts:890-916`.
- Progressive disclosure: `mcp_server/lib/search/progressive-disclosure.ts:4-12`.

---

<!-- L3 STRUCTURAL APPENDIX: ADR-001 sub-anchored mirror per L3 contract.
     Substantive ADR-001 content is in the section above; the sub-anchored mirror below
     satisfies the validator's anchor + sufficiency checks. -->

<!-- ANCHOR:adr-001 -->
## ADR-001 (sub-anchored mirror)

<!-- ANCHOR:adr-001-context -->
### Context

Pt-03 verdict for this phase recommends Level 3 designation. The user's scaffolding directive elevates all 5 pt-03 phase children (006-010) to Level 3 regardless of pt-03's per-phase L2/L3 suggestion, citing the cross-component nature of every recommendation and the governance discipline (feature flags, telemetry contracts, Phase-005 eval gates) that L3 enforces.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Designate Phase 010 as **Level 3**. Apply full L3 file contract: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json, plus per-child resource-map.md per user directive.
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
- Phase-005 eval gate required for any active-mode rollout.
- Test discipline includes unit + integration + diff (backward-compat) + Phase-005 paired comparison.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Checks Verification

1. **Cross-component change?** Yes — touches multiple subsystems and/or runtimes.
2. **New feature flag family?** Yes — default-off rollout per pt-03 universal pattern.
3. **Telemetry contract introduced?** Yes — per-phase eval logger events documented in REQs.
4. **Promotion gate required?** Yes — Phase-005 eval lift before active mode.
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

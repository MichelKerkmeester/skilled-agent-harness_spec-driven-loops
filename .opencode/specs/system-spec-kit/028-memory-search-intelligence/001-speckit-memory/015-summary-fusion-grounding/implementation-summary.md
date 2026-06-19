---
title: "Implementation Summary: Summary Fusion and World-Summary Grounding"
description: "Planning-state summary for promoting built community/summary evidence into a first-class weighted RRF lane and adding a two-tier world-summary grounding prelude. Both candidates are PENDING — no implementation has started; this records the planned approach and gates."
trigger_phrases:
  - "summary fusion implementation summary"
  - "fused summary channel status"
  - "world summary grounding status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-state doc; implementation not started"
    next_safe_action: "Capture the retrieval baseline, then wire the fused lane."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    completion_pct: 0
    open_questions:
      - "Final fused-lane RRF weight (resolved by the baseline-and-delta retune)."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/028-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding` |
| **Completed** | Pending |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — not started |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is implemented yet. This sub-phase is a re-plan output: it scopes two paired retrieval-intelligence candidates over the already-built summary/community substrate, both PENDING (neither appears in the Wave-0 shipped record `030-memory-search-intelligence-impl/spec.md` §14).

### Planned: Fused Summary/Community Lane (`MEM-fused-summary-channel`)

Promote the already-built community/summaries from a weak-result post-pipeline fallback (`memory-search.ts:1158-1228`) and a stage-1 candidate source (`stage1-candidate-gen.ts:~1304-1326`) into a first-class weighted RRF lane: register the channel across the `ChannelName` union and the five hardcoded channel-list sites, push it at the RRF `lists.push` fusion site (`hybrid-search.ts:~1394-1495`) with a tuned weight, retire both legacy inject paths to avoid double-counting, give the adaptive-weight model (`artifact-routing.ts`) a per-channel slot, and re-tune the perturbed ablation-derived weights against a captured baseline. Effort is L (corrected up from the finder M/M at blast-radius scoping). Data reuse is strong: `searchCommunities` and `querySummaryEmbeddings` already exist.

### Planned: World-Summary Grounding Prelude (`CG-global-context-summary-hierarchy`)

Build a two-tier persistent world-summary (root world-summary + top-k subsections) in `memory-summaries.ts` and prepend the relevant coarse-to-fine slice as a grounding prelude before retrieved context in `memory-context.ts`. NET-NEW (finder M/M): the current summary index is flat with no root+sub hierarchy and no pre-fetch-and-prepend. External template: cognee `global_context.py:1-73`, `graph_completion_retriever.py:78-79`.

Both ship behind default-off shadow flags; with the flags off, recall is byte-identical to baseline.

### Files Changed
None yet. The planned change set is enumerated in `spec.md` §3 (Files to Change) and `plan.md` (Affected Surfaces).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Planned delivery order (from `plan.md`): capture baseline → wire the fused lane → retire the two inject paths → add the weight slot and re-tune → build the world-summary hierarchy and grounding prelude → verify (tests, tsc, strict validation, comment hygiene, shadow before/after delta).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Shadow-gated, default-off.** Both candidates change recall ordering and prompt content, so they ship behind default-off flags and require a captured baseline before promotion (intelligence-class, per the roadmap §3).
- **Reuse, don't rebuild.** The lane consumes existing `searchCommunities` + `querySummaryEmbeddings` data; no new summary/community computation.
- **Single-count discipline.** The two legacy inject paths are retired in the same change as the fused lane to avoid double-counting the same evidence.
- **Retune only what the lane perturbs.** A full ablation re-derivation is deferred to a separate benchmark; this phase re-tunes only the weights the new lane disturbs.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Pending — no verification has run. The required gates are: a captured retrieval baseline with reported delta, `npx tsc --noEmit` exit 0, the fusion/summary and flags-off no-op suites, `validate.sh --strict` 0 errors, and comment-hygiene clean. Evidence rows will be filled when the gates run.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

Pending. Planned checks: the lane adds no new per-query summary computation pass (NFR-P01); the prelude reads a precomputed hierarchy rather than recomputing inline (NFR-P02); flags-off is a strict no-op on ordering and serialization (NFR-R01); the lane degrades fail-open (NFR-R02).
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- No measured benefit number exists for either candidate; all leverage estimates are structural inference (roadmap BROADENING §6). The captured baseline-and-delta is the gate that converts this into a measured result.
- The full RRF ablation re-derivation is out of scope; only the lane-perturbed weights are re-tuned here.
- The Wave-2 "semantic edge layer" (per-edge embeddings, edge vector index, triplet search) is explicitly deferred.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations

None. This is a planning-only re-plan output faithful to the 028 research (roadmap MEMORY-SYSTEMS ADDENDUM, synthesis 06, and the 007-memory-systems iterations 017/018/019/022). The brief's "checklist for level 3" note is superseded by the Level-2 validator, which requires `checklist.md` and `implementation-summary.md` for Level 2; both are included.
<!-- /ANCHOR:deviations -->

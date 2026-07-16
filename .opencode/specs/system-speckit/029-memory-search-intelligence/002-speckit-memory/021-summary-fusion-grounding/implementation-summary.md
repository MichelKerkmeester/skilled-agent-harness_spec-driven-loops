---
title: "Implementation Summary: Summary Fusion and World-Summary Grounding"
description: "Partial-implementation summary. The fused summary/community RRF lane shipped shadow-gated and a read-only world-summary grounding prelude shipped default-off. The persistent two-tier summary hierarchy and the benchmark retune remain pending."
trigger_phrases:
  - "summary fusion implementation summary"
  - "fused summary channel status"
  - "world summary grounding status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/021-summary-fusion-grounding"
    last_updated_at: "2026-07-06T19:16:31.809Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped shadow-gated fused lane and read-only grounding prelude default-off"
    next_safe_action: "Capture the retrieval baseline delta, then build the persistent hierarchy"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    completion_pct: 70
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
| **Spec Folder** | 015-summary-fusion-grounding |
| **Completed** | Partial implementation 2026-06-19 |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In progress - fusion lane cut; hierarchy and benchmark pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This pass shipped the fused summary/community lane shadow-gated and a read-only grounding prelude default-off. The persistent world-summary hierarchy and the benchmark retune remain pending.

**CORRECTION (2026-07-01, drift-audit remediation -- pass 2 / git-history reconciliation):** later git-history reconciliation shows the fused summary lane was measured and rejected for `Recall@20 -0.036, displacement-only -- the lane only pushes a real channel hit out of the list`; source: `001-speckit-memory/022-kept-off-flag-resolution/implementation-summary.md`, corroborated in `../../benchmark-status.md`. This summary already recorded that "No measured benefit number exists for either candidate" and that "All leverage estimates are structural inference" before that cut, so the measured `Recall@20 -0.036` may partly reflect the guessed, never ablation-tuned lane weight rather than proving the summary/community signal is fundamentally weak.

### Shipped: Fused Summary/Community Lane (`MEM-fused-summary-channel`)

The already-built community/summaries were promoted from a weak-result post-pipeline fallback (`memory-search.ts:1158-1228`) and a stage-1 candidate source (`stage1-candidate-gen.ts`) into a first-class weighted RRF lane, all behind the default-off `SPECKIT_SUMMARY_FUSION_LANE` flag. The work registered the channel across the `ChannelName` union and the channel-list sites, pushed it at the RRF `lists.push` fusion site (`hybrid-search.ts`) with a per-channel weight slot in `artifact-routing.ts`, stood down both legacy inject paths to avoid double-counting and split the cache identity for the new lane. Deterministic unit coverage proves evidence is counted once and the flag-off path is byte-identical. The benchmark delta and the perturbed-weight retune were not run under this turn's constraints.

### Partial: World-Summary Grounding Prelude (`CG-global-context-summary-hierarchy`)

A default-off read-only grounding prelude over the existing `memory_summaries` shipped behind `SPECKIT_WORLD_SUMMARY_PRELUDE`, prepending a coarse-to-fine slice before retrieved context in `memory-context.ts`. The persistent two-tier root plus subsection hierarchy in `memory-summaries.ts` remains PENDING because it needs a schema migration that was out of scope this turn.

With both flags off, recall is byte-identical to baseline.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/hybrid-search.ts` | Modified | Push the fused summary/community lane at the RRF fusion site behind the flag |
| `mcp_server/lib/search/community-search.ts` | Modified | Fused ranked-list adapter for community evidence |
| `mcp_server/lib/search/memory-summaries.ts` | Modified | Fused summary adapter + read-only grounding prelude provider |
| `mcp_server/lib/search/artifact-routing.ts` | Modified | Per-channel adaptive-weight slot for the new lane |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | Stand down the stage-1 summary inject to avoid double-count |
| `mcp_server/handlers/memory-search.ts` | Modified | Stand down the weak-result community fallback inject |
| `mcp_server/handlers/memory-context.ts` | Modified | Prepend the grounding prelude when its flag is on |
| `mcp_server/lib/search/search-flags.ts` | Modified | Register `SPECKIT_SUMMARY_FUSION_LANE` + `SPECKIT_WORLD_SUMMARY_PRELUDE` (default-off) |
| `mcp_server/tests/summary-fusion-grounding.vitest.ts` | Created | Single-count + flags-off no-op coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery followed the plan order minus the deferred steps. The fused lane was wired, the two legacy inject paths were stood down, the per-channel weight slot was added and the read-only grounding prelude was built, all behind default-off flags. Verification ran typecheck, the memory test suite, strict validation and comment hygiene. The shadow before/after benchmark delta and the persistent hierarchy were left for a later turn.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Shadow-gated, default-off.** Both candidates change recall ordering and prompt content, so they ship behind default-off flags and require a captured baseline before promotion (intelligence-class, per the roadmap §3).
- **Reuse, don't rebuild.** The lane consumes existing `searchCommunities` + `querySummaryEmbeddings` data, no new summary/community computation.
- **Single-count discipline.** The two legacy inject paths are retired in the same change as the fused lane to avoid double-counting the same evidence.
- **Retune only what the lane perturbs.** A full ablation re-derivation is deferred to a separate benchmark. This phase re-tunes only the weights the new lane disturbs.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The shipped code is verified. `npx tsc --noEmit` exits 0. The memory test suite passes 114 tests including the fusion/summary and flags-off no-op coverage. `validate.sh --strict` on this folder reports 0 errors. Comment hygiene is clean. The captured retrieval baseline with a reported delta is still pending because the live benchmark was out of scope this turn.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

The shipped lane reuses the existing `searchCommunities` and `querySummaryEmbeddings` data with no new per-query summary computation pass (NFR-P01). The read-only prelude reads existing `memory_summaries` rather than recomputing inline (NFR-P02). Flags-off is a strict no-op on ordering and serialization, proven by test (NFR-R01). The lane degrades fail-open (NFR-R02). The persistent-hierarchy variant of NFR-P02 stays pending with the hierarchy build.
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- No measured benefit number exists for either candidate. All leverage estimates are structural inference (roadmap BROADENING §6). The captured baseline-and-delta is the gate that converts this into a measured result.
- The full RRF ablation re-derivation is out of scope, only the lane-perturbed weights are re-tuned here.
- The Wave-2 "semantic edge layer" (per-edge embeddings, edge vector index, triplet search) is explicitly deferred.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations

The fused lane and the read-only prelude shipped this pass, ahead of the persistent hierarchy and the benchmark retune which stay deferred. The hierarchy waits on a schema migration and the retune waits on a captured baseline, both out of scope this turn. The doc set is faithful to the 028 research (roadmap MEMORY-SYSTEMS ADDENDUM, synthesis 06 and the 007-memory-systems iterations 017/018/019/022).
<!-- /ANCHOR:deviations -->

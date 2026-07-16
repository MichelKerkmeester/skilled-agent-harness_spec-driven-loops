---
title: "Implementation Summary: Search-Quality Fixes"
description: "All six fixes from the 029 deep-research landed and verified. The keystone (the dead evidence-gap verdict cap) now fires live: an off-corpus query returns weak with the banner and verdict in agreement, where it returned good beside the banner before. The other five (citeCorrect metric, telemetry honesty, row score, deterministic-ranking flag, presentation contract) are in with focused-test evidence."
trigger_phrases:
  - "search quality fixes done"
  - "evidence gap cap fixed"
  - "041 implementation summary"
  - "deterministic ranking flag landed"
  - "memory search fix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/009-search-quality-fixes"
    last_updated_at: "2026-07-06T18:49:43.436Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed and verified all six fixes, keystone caps off-corpus live"
    next_safe_action: "Close the phase, the Stage-4 gap-threshold tuning is a later packet"
    blockers: []
    key_files:
      - "mcp_server/handlers/memory-search.ts"
      - "mcp_server/lib/search/search-flags.ts"
      - "029-vague-query-model-benchmark/scripts/extract-metrics.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-23-041-search-quality-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The keystone cap fires live: off-corpus query caps good to weak."
---
# Implementation Summary: Search-Quality Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-23 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All six fixes from the 029 deep-research are implemented and verified. The keystone is proven live.

| Fix | Change | Verification |
|-----|--------|--------------|
| 1 (keystone) | Bridge `stage4.evidenceGapDetected` into `extraData.evidenceGap` | Smoke: `kubernetes` (off-corpus) returns `requestQuality: weak` + `cite_with_caveat` with the banner, the `good`-beside-banner contradiction is gone |
| 2 | Three-tier-aware `citeCorrect` metric | Re-extract: rate 1.0 across all 4 models (was ~0.55) |
| 3 | Honest `retrievalProfileWeightsEnabled` envelope field | In the envelope, `intent.weightsApplied` left intact, tsc clean |
| 4 | Resolved `score` on graph and degree rows | 55/55 formatter tests + a new graph-row assertion |
| 5 | Deterministic-ranking flag, default-off | 163 tests pass, byte-identical when off, the trigger id tie-break is always-on |
| 6 | Presentation contract: count equals rows shown, leaf title | Contract edited, `shown of total` form |

**The keystone, the one real bug.** The `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap graduated to default-ON but never fired live, because the handler set the evidence-gap warning that drives the banner but never set the boolean the verdict cap reads. Bridging `pipelineResult.metadata.stage4.evidenceGapDetected` into `extraData.evidenceGap` closes that gap, so a gap-detecting search now caps `good` to `weak` before the envelope renders. The recovery-classification side effect was checked, on a true gap the recovery status becomes `partial` (an appropriate refine hint) and non-gaps are unchanged.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The keystone (Fix 1) and the telemetry fix (Fix 3) share `memory-search.ts` and landed together. Fix 4 added the resolved row score in `search-results.ts`, Fix 5 added the default-off `SPECKIT_DETERMINISTIC_RANKING` flag across `search-flags.ts`, `hybrid-search.ts` and `pipeline/stage2-fusion.ts`, Fix 2 made the `citeCorrect` metric three-tier-aware in the 029 `extract-metrics.mjs`, and Fix 6 tightened `search_presentation.txt`. Each MCP change was host-verified with its focused vitest, then `npm run build` compiled all four code fixes into dist and the daemon was recycled so the fast-subset re-run exercised the rebuilt dist rather than stale code. New tests landed in `provenance-envelope.vitest.ts` (after adding the new flag to its search-flags mock) and `deterministic-ranking-flag.vitest.ts`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **The keystone is a bridge, not a threshold change.** The cap was already graduated and correct, it simply read a boolean nothing wrote. Bridging the existing Stage-4 signal activates it without touching the gap-detection threshold, the smallest change that fixes the real bug.
- **Deterministic ranking ships default-off.** Removing the wall-clock inputs from ranking is a production-ranking change, so it hides behind a new flag and leaves default behavior byte-identical. Graduating it to default-on needs a recall benchmark (does removing recency hurt ranking), a later decision, not this packet.
- **Fast subset, not the full matrix.** The keystone proof needs only enough cells to show off-corpus queries capping correctly across models, so the re-run used 9 cells over 3 open-source models rather than re-running the full 144-cell matrix.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Keystone, live:** the dead cap now fires. The recovery side effect was checked, on a true gap the recovery status becomes `partial` (an appropriate refine hint), non-gaps are unchanged.
- **Focused tests:** scoring-hardening, deterministic-ranking-flag, handler-memory-search, provenance-envelope (after adding the new flag to its search-flags mock), search-results-format, and env-reference-drift all pass. The Fix 5 work ran 163 tests across the ranking suites, byte-identical with the flag off.
- **Full-suite note:** the mcp_server suite carries pre-existing failures unrelated to this work (a different missing-mock `isWorldSummaryPreludeEnabled`, a drifted source-pattern test, infra and timing suites). My change added zero new mock failures. The two `dist-freshness` failures cleared on rebuild, except one on `spec/is-phase-parent.ts`, a file outside this scope with a spurious mtime bump.
- **dist:** `npm run build` compiled all four code fixes into dist, the daemon was recycled so the re-run exercises the rebuilt dist.
- **Fast-subset re-run (9 cells, 3 open-source models):** off-corpus queries cap correctly across all three models. `authentication` returns `gap` + `do_not_cite_results`, `kubernetes` returns `weak` + `cite_with_caveat`. 6 of 6 off-corpus cells capped to weak or gap, and 0 `good`-beside-banner contradictions (the prior failure mode was 19 of 144). The aligned control `graph` also caps to `weak` (the gap detector fires on the ambiguous one-word query, banner and verdict agree), which is conservative but not a contradiction. Whether the Stage-4 gap threshold should be that conservative on aligned one-word queries is a tuning question for a later packet, not a wiring bug.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Commit hygiene.** A concurrent session sharing the git index swept this packet's code changes into an unrelated pushed commit (`bbb2f539f4`, a 2333-file skill-doc corpus commit). The code is committed, correct, and safe. The commit is pushed and dominated by another session's work, so it was left as-is rather than rewritten. Remaining doc updates are committed scoped.
- **The determinism flag is unproven for recall.** It ships default-off. Graduating it to default-on needs a recall benchmark to confirm removing recency does not hurt ranking, a later decision not this packet.
- **The aligned-query cap is conservative.** The Stage-4 gap detector fires on the ambiguous one-word `graph` query and caps it to `weak`, banner and verdict in agreement. Whether the threshold should be that conservative on aligned one-word queries is a tuning question for a later packet.
- **Fix 3 is envelope-only in the dashboard.** The new `retrievalProfileWeightsEnabled` field is in the envelope for programmatic consumers, the text dashboard does not render it, which is expected.
<!-- /ANCHOR:limitations -->

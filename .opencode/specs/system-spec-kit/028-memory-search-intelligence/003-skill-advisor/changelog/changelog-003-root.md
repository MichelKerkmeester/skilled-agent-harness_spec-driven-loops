---
title: "Changelog: Skill Advisor Phase Parent [003-skill-advisor/root]"
description: "Chronological changelog for the Skill Advisor Phase Parent spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor` (Level 2)

### Summary

> Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-rrf-determinism-spine` | Implemented default-off (benchmark gate pending before live flip) | This pass implements the Skill Advisor RRF spine default-off. The default weighted-sum scorer remains byte-stable unless SPECKIT_ADVISOR_RRF_FUSION=true; the opt-in path imports Memory's already-shipped fuseResultsMulti, adapts scorer lanes into fixed-order RankedLists, passes advisor-specific ADVISOR_RRF_K = 8, and uses the shared RRF order plus an RRF rank map as the final post-bonus tiebreak. The graph_causal signed-score conflict suppression is preserved by splitting graph output into combined/positive/conflict matches and applying conflict mass as a post-fusion comparator demotion. |
| `002-runtime-lane-health-degrade` | Implemented | This phase built the runtime lane-health degrade path in the Skill Advisor MCP scorer. The scorer now distinguishes a degraded-empty lane from a lane that ran and matched nothing, elides only degraded-empty lanes from the confidence denominator, and surfaces the degraded-lane condition through metrics, prompt-safe handler output, warnings, and abstention explanations. |
| `003-embedding-staleness-signal` | Signal implemented; rebuild reuse gated | The staleness signal is implemented. The SQLite projection now computes an AdvisorEmbeddingSignature plus AdvisorEmbeddingStalenessVerdict from persisted vector model rows, compares that stored identity against the active embedder pointer, and keeps generatedAt as a back-compatible sibling field. Matching stored vectors yield stale:false; mismatched/mixed/missing model ids yield stale:true with a reason. Empty projections remain not-stale because there are no vectors to trust or serve. |
| `004-c4-shadow-seam-beta-posterior` | Draft | This is a planning closeout (a re-plan), not a code-delivery summary. The sub-phase specifies the full reliability-weighted-learning build on the campaign's sequenced critical path. The Skill Advisor already ships an end-to-end shadow feedback pipeline — durable outcome capture, a bounded delta estimator, a parallel shadow-weight channel — but the estimator's proposal is written to a JSONL that no out-of-process consumer ever reads back, so the loop never closes. This sub-phase builds the missing seam (a cron/maintenance promoter), the reliability math (a shared Beta posterior that turns raw acceptance frequency into a flood-immune number), and the aionforge attestation-and-promotion gate family that decides — conservatively, shadow-only — whether a lane weight should ever move. It is net-new throughout: 027 shipped no lane attribution and the live estimator carries zero Beta math, so this is a BUILD, not a graduation. |
| `005-conflict-rerank-query-routing` | Implemented default-off; live promotion gates pending | Default-off scorer code shipped for the three routing refinements. The live scorer remains byte-identical with the new flags disabled, and packet 030 was not touched. The implementation keeps the original gate discipline: C1 needs real conflict-edge data before it has live effect, QCR needs held-out routing-quality evidence before any default/live weight change, and C6 needs RRF plus benchmark/recall acceptance before any default flip. |
| `006-provenance-drift-observability` | Draft | One scorer candidate shipped. SA-author-self-boost-guard now has a default-off implementation behind SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD: explicit-author scoring can carry producer identity when the guard path asks for it, fusion centralizes the advisor self-recommendation guard, and default scorer behavior remains byte-identical with the flag unset. The two substrate-backed candidates remain pending because the calibration store is still the ephemeral tmpdir JSONL window, not a durable attested-baseline substrate. |
| `007-outcome-weighted-ranking-followon` | Draft | No production implementation was built in this sub-phase. The deliverable is the Level 3 planning packet for the one genuine Skill Advisor external follow-on left after the 028 campaign: outcome-weighted skill ranking over actual execution success, supported by a skill-outcome store, an out-of-process ambient tick and a prove-first BM25 calibration. The packet records that none of these candidates shipped in packet 030 and that the live advisor sort must stay unchanged until real execution-success data and a benchmark justify a promotion. |

### Added

- No new additions recorded.

### Changed

- > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.

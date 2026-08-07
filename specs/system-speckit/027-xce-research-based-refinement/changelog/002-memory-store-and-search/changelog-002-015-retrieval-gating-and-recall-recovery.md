---
title: "Retrieval Gating and Recall Recovery: The Gate That Read the Wrong Scale"
description: "The request-quality gate read RRF fusion scores (around 0.03) against cosine-scale thresholds (0.7 high, 0.4 low), so a genuinely relevant search could never read citable. A cosine-based absolute-relevance calibration fixes the gate without touching ordering. Cold and deprecated tiers are admitted into the lexical and trigger channels, and a vector-lane projection backfill makes archived content reachable in semantic search. All three behaviors are default-ON."
trigger_phrases:
  - "002/015 retrieval gating and recall recovery changelog"
  - "RRF versus cosine calibration bug"
  - "resolveAbsoluteRelevance request quality gate"
  - "cold tier inclusion vector lane backfill"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/015-retrieval-gating-and-recall-recovery` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Two two-word searches that should have surfaced many on-topic specs came back `weak` with `do_not_cite`, even when a controlled re-run proved the right specs were retrieved. The root cause was a scale mismatch. The request-quality gate and the per-result confidence read the RRF and RSF fusion score, which lands around 0.03 for a strong match, and compared it against cosine-scale thresholds (0.7 for high, 0.4 for low). Good was structurally unreachable, so almost every genuine hit was labeled weak. This packet adds `resolveAbsoluteRelevance`, which prefers the cosine similarity (the `similarity` field divided by one hundred) over the fusion score for the confidence and request-quality calibration, and falls back to the effective score when no cosine is present. Ordering is untouched: fusion still ranks, the calibration only changes how the gate reads relevance. Two recall problems are fixed alongside the gate. Cold and deprecated tiers, about a quarter of the corpus, were hard-excluded from every channel, so the archived hybrid-RAG specs the user was looking for could never rank. The deprecated-tier filter in the lexical and trigger channels is now gated by an include-cold flag, and the FSRS scheduler is left to rank those rows by temperature. And the vector lane joins the active-memory projection, which held one active row per logical key, so a cold orphan with no active winner was invisible to semantic search. A projection backfill admits a cold orphan only when its logical key has no active winner, preserving the one-active-per-key invariant. All three behaviors ship default-ON.

### Added

- `resolveAbsoluteRelevance` in `lib/search/pipeline/types.ts`, preferring cosine similarity over the fusion score for calibration with an effective-score fallback
- `backfillColdOrphanProjection` in `lib/storage/lineage-state.ts`, admitting a cold orphan into the active-memory projection only when its logical key has no active winner
- Feature flags in `search-flags.ts`: `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION`, `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` and `SPECKIT_INCLUDE_ARCHIVED_VECTOR`, all default-ON (graduated)

### Changed

- `lib/search/confidence-scoring.ts` - the score prior and the request-quality top score read the cosine-calibrated absolute relevance
- `lib/search/sqlite-fts.ts` - an include-cold flag gates the deprecated-tier filter so cold rows reach the lexical and trigger channels
- `lib/search/hybrid-search.ts` and `lib/search/vector-index-queries.ts` - archived and cold inclusion wired into the ranked path
- `context-server.ts` - a boot-time gated call runs the cold-orphan projection backfill
- `lib/response/profile-formatters.ts` and `commands/memory/assets/search_presentation.txt` - render the cosine-calibrated relevance

### Fixed

- A genuinely relevant search no longer reads `weak` because the gate was comparing a fusion score against a cosine threshold
- Cold and deprecated rows (about a quarter of the corpus) are reachable in the lexical and trigger channels instead of hard-excluded
- An archived or cold orphan with no active winner is reachable in the vector lane

### Verification

| Check | Result |
|-------|--------|
| Live confidence | CONFIRMED: a 0.89 cosine match reads `requestQuality good`, `cite_results`, confidence 0.81 on the running daemon |
| Phase suites | PASS: `absolute-relevance-calibration.vitest.ts`, `cold-orphan-projection-backfill.vitest.ts`, `hybrid-search.vitest.ts` |
| Invariant | CONFIRMED: the projection backfill admits at most one cold orphan per logical key and never displaces an active winner |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/absolute-relevance-calibration.vitest.ts` | Added |
| `.opencode/skills/system-spec-kit/mcp_server/tests/cold-orphan-projection-backfill.vitest.ts` | Added |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modified |

### Follow-Ups

- The remaining generic-query recall, request-quality aggregation, token-budget and output-contract gaps were researched in phase `016` and implemented in phase `017`.
- The corpus reindex that restores the un-embedded rows is deferred and runs when the operator is home and confirms.

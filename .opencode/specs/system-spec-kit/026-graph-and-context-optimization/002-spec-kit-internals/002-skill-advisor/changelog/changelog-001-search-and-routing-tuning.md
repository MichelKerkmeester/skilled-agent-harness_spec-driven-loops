---
title: "Skill Advisor Phase 001: Search and Routing Tuning"
description: "Coordination parent for search-fusion tuning, content-routing accuracy, and graph-metadata validation. Three parallel sub-tracks shipped across 19 leaf sub-phases."
trigger_phrases:
  - "phase 001 changelog"
  - "search and routing tuning"
  - "search fusion reranker tuning"
  - "content routing accuracy"
  - "graph metadata validation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor` (Level 2)
> Parent packet: `026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

Three parallel sub-tracks shipped addressing all aspects of search-pipeline tuning and content routing accuracy. The coordination parent restored a canonical `spec.md` surface for the search-and-routing workstream so packet-level graph provenance and recovery flows have a real root document. Implementation detail lives in the child packets.

The search-fusion tuning track neutralized the cross-encoder length penalty, added process-wide cache telemetry, introduced an internal continuity adaptive-fusion profile, raised the rerank minimum from 2 to 4, aligned doc surfaces, and validated the baseline K=60 recommendation against a 12-query fixture.

The content routing accuracy track fixed delivery-versus-progress asymmetry in Tier 1, split hard drop detection from soft operational cues, wired the Tier 3 LLM classifier as a real save-path dependency, aligned all doc surfaces with the always-on contract, added document-wide prevalidation for task-update merge safety, and enriched the Tier 3 prompt with the continuity resume model.

The graph-metadata validation track added checklist-aware status derivation, sanitized key_files against noise classes, deduplicated entities using canonical-path preference, scoped backfill traversal to active packets by default, added real path resolution with cross-track fallback, and raised the entity cap from 16 to 24 while tightening canonical-scope checks.

### Added

- Coordination-parent `spec.md` at the packet root with Level 2 metadata and child packet references (REQ-001, REQ-002).
- Continuity adaptive-fusion weight profile: semantic 0.52, keyword 0.18, recency 0.07, graph 0.23.
- Process-wide reranker cache telemetry exposed via `getRerankerStatus()`: hits, misses, staleHits, evictions, entries, maxEntries, ttlMs.
- Dedicated continuity MMR lambda for Stage 3 diversification.
- Tier 3 LLM classifier wired as an always-on save-path dependency with fail-open semantics.
- Document-wide prevalidation step for task-update merge safety: counts checklist lines matching the task identifier and refuses multi-match ambiguity.
- Checklist-aware `deriveStatus()` fallback that recognizes `implementation-summary.md` presence.
- Key-file sanitization guardrail rejecting command-like strings, version tokens, MIME-style values, and bare non-canonical filenames.
- Entity deduplication using canonical-path preference over basename-only duplicates.
- Real path resolution in `deriveKeyFiles()` against spec folder, repo root, and cross-track workspace roots.
- Entity cap raised from 16 to 24 with bare runtime names rejected up front.
- 12-query continuity fixture in `k-value-optimization.vitest.ts`.

### Changed

- `calculateLengthPenalty()` returns 1.0. `applyLengthPenalty()` is a compatibility-preserving no-op. The retired `lp` cache-key discriminator was removed post-review.
- `MIN_RESULTS_FOR_RERANK` raised from 2 to 4. Stage 3 regression suite uses 4-row fixtures with explicit boundary assertions.
- Tier 1 router now scores delivery against sequencing, gating, rollout, and verification mechanics with a `strongDeliveryMechanics` guard and delivery-biased floor.
- Hard drop detection was split from soft operational command language so genuine handover notes survive phrases like `git diff` or `force re-index`.
- Graph-metadata backfill traversal now defaults to active packets only. `z_archive` and `z_future` are skipped unless `--include-archive` is passed.
- Post-backfill corpus scan: 541 refreshed packets. Command-shaped key_files = 0, status outliers = 0, duplicateEntityNameGroups = 0, legacyGraphMetadataFiles = 0.

### Fixed

- Length penalty was a near-global demotion against spec docs. 78.6% of markdown files exceed 2000 characters. Penalty removed entirely.
- Delivery-versus-progress confusion in Tier 1 routing. Root cause was asymmetric scoring signals, not threshold misconfiguration.
- Handover notes containing operational command language no longer trigger false `drop` classification.
- Stale `lp` cache-key discriminator caused compatibility callers to split cache hit-rate across duplicate buckets.
- Status derivation now respects checklist completion. Packets with `implementation-summary.md` and complete checklists move to `complete`.
- Backfill abort-on-single-failure bug fixed: a single invalid manual relationship array no longer prevents full-corpus refresh.

### Verification

- `npx tsc --noEmit`: PASS for all sub-phases (mcp_server and scripts).
- `npx vitest run` on all sub-phase test files: PASS.
- `bash validate.sh --strict`: PASS (sub-phases). Coordination parent exits 2 on pre-existing structural gaps (no plan/tasks/checklist for phase-parent role).
- Post-backfill corpus scan: 541 refreshed packets with zero command-shaped key-files, zero status outliers, zero duplicate entity groups, zero legacy graph-metadata files.
- 12-query continuity K-sweep fixture confirmed baseline K=60 recommendation.

### Files Changed

| File | What changed |
|------|--------------|
| `spec.md` (NEW, root) | Coordination parent spec with Level 2 metadata and child packet references. |
| `implementation-summary.md` (NEW) | Merged sub-phase summaries for all three tracks with per-phase detail, decisions, verification, and known limitations. |
| `mcp_server/lib/search/cross-encoder.ts` | Length penalty neutralized. Cache telemetry added. Cache-key discriminator retired. |
| `mcp_server/lib/search/stage3-rerank.ts` | Rerank minimum raised to 4. Continuity MMR lambda added. |
| `shared/algorithms/adaptive-fusion.ts` | Continuity weight profile added. |
| `mcp_server/lib/routing/content-router.ts` | Delivery/progress asymmetry fixed. Handover/drop confusion split. Tier 3 wired as always-on. |
| `mcp_server/handlers/memory-save.ts` | Tier 3 LLM classifier wired. Save path docs aligned. |
| `mcp_server/lib/graph/graph-metadata-parser.ts` | Checklist-aware status. Key-file sanitization. Entity dedup. Real path resolution. Entity cap raised to 24. |
| `scripts/graph/backfill-graph-metadata.ts` | Default to active-packet corpus. Abort-on-single-failure fix. |

Multiple commits across three sequential dispatch tracks. Iteration evidence preserved in `review/` and `research/` directories.

### Follow-Ups

- Stage 3 intent-source split: MMR still keys off `detectedIntent` while fusion uses `adaptiveFusionIntent`. Unify or document the intended split.
- Canonical `/spec_kit:resume` bypasses the search pipeline entirely. Docs should distinguish resume ladder from search-style `profile='resume'`.
- Dashboard-grade reranker telemetry: separate stale expiry from capacity eviction, expose reset/failure context, add provider-scoped counters.
- Short-fragment content routing robustness: progress versus research, research versus metadata, and terse drop telemetry still drift on compact inputs.

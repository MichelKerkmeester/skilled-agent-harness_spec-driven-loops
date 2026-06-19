---
title: "Memory Search and Ranking: Graceful Embedder Degrade, Deterministic Tiebreaks, Rank-Time Knobs"
description: "Four Wave-0 candidates hardened the Memory MCP search and ranking pipeline. Recall now degrades to lexical when the embedder is gone, ties resolve from content not row order, and two optional ranking knobs ship with byte-identical defaults."
trigger_phrases:
  - "030 memory search ranking changelog"
  - "embedder degrade lexical fallback"
  - "deterministic tiebreak ann rrf"
  - "bonusOverChannels rank-time decay"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/system-spec-kit/030-memory-search-intelligence-impl` (Level 3)
> Subsystem: Memory MCP search and ranking
> Source: `spec.md` section 14 candidates 2, 3, 4, 5

### Summary

Four Wave-0 candidates landed on the Memory MCP retrieval path. None of them changes the default scored output, and each is independently reversible. Candidate 2 makes recall survive an absent embedder by degrading to lexical search instead of throwing into empty results. Candidates 3 and 4 make tie resolution deterministic so the rows that survive a `LIMIT` into fusion are stable run to run. Candidate 5 exposes two ranking primitives as optional knobs while keeping the default arithmetic byte-identical. Every candidate was implemented at its named seam, focus-tested and committed in isolation. Candidate 2 carried an independent opus adversarial review with a SHIP verdict and Candidate 5 carried an opus review with both knobs marked SHIP.

### Added

- `bonusOverChannels` option on `fuseResultsMulti` (`'active'` default, `'configured'` opt-in) so a zeroed channel does not distort the convergence-bonus denominator for surviving rows (Candidate 5, C-X1).
- A pure rank-time FSRS recency decay clock driven by a caller-supplied `nowMs`, with reinforcement kept as a separate write event (Candidate 5, C6-A).
- `embedder_available` and `vector_search_skipped` reporting on the search path so callers can see when recall ran lexical-only (Candidate 2, C9).
- Typed `Stage1InputError` propagation plus a handler-level concept guard for invalid Stage 1 input (Candidate 2 documented scope addition, benign and zero live blast radius).
- Determinism, embedder-degrade and fusion tiebreak tests across the search and ranking suites.

### Changed

- The Stage 1 candidate generator detects a null or empty embedding and falls back to lexical BM25/FTS candidate generation instead of throwing internally and being swallowed to empty (Candidate 2).
- The four ranked ANN `ORDER BY distance` queries append `, m.id ASC` so equal-distance rows order stably (Candidate 3).
- The ranking-contract comparator and all five RRF output sorts add a `content_hash`-ascending tiebreak that coalesces to the canonical id, so tie resolution is content-derived and stable across re-imports rather than rowid-incidental (Candidate 4, C5-B).

### Fixed

- An unavailable embedder previously threw inside the pipeline and was swallowed to empty candidates. Recall now returns lexical results with explicit metadata instead of an empty payload.
- Equal-key ties previously resolved by DB row-iteration order or float noise, so which rows survived a `LIMIT` into fusion shifted between runs. Tie resolution is now deterministic and content-derived.

### Verification

| Check | Result |
|-------|--------|
| Typecheck and build (Memory MCP) | PASS, exit 0 |
| Candidate 2 search/pipeline suite | PASS: 440 tests, 2 pre-existing unrelated failures confirmed identical on baseline via stash |
| Candidate 2 adversarial review | SHIP: degrade traced to BM25, happy path byte-identical via `git diff -w`, metadata plumbed through cache |
| Candidates 3 and 4 determinism suite | PASS: 40 targeted determinism tests plus 303 ranking/search tests, 3 broad-batch failures confirmed pre-existing on baseline via stash |
| Candidate 5 fusion/decay/search suite | PASS: 463 tests, 1 pre-existing adaptive-ranking failure confirmed on baseline via stash |
| Candidate 5 adversarial review | SHIP: both knobs default byte-identical traced arithmetically, one finding (no-timestamp row newly reinforced) fixed by restoring the skip guard |
| Default-order parity | PASS: happy path byte-identical for Candidate 2, only exact ties change for Candidates 3 and 4, default knob arithmetic byte-identical for Candidate 5 |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts` | Modified |
| `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/stage1-embedder-degrade.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/perf-regression-embedding-semantic-search.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/score-resolution-consistency.vitest.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-knn-query-shape-benchmark.vitest.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts` | Modified |

### Commits

| Commit | Candidates |
|--------|-----------|
| `484b77b589` | 2 (C9 graceful embedder-degrade) |
| `bec0eed27f` | 3 (ANN tie-stable ORDER BY) and 4 (C5-B content-derived tiebreak) |
| `65cfcea513` | 5 (C-X1 bonus-denominator option and C6-A rank-time decay clock) |

### Follow-Ups

- None for these four candidates. The optional ranking knobs default to the prior behavior, so any future tuning is additive opt-in work.

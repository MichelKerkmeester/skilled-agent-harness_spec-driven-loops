# Iter 050 — Track 11: post-restructure validation proof points

## Methodology

Use the same operator-facing queries before and after restructure. Count a hop as one deliberate lookup/open/scan step needed to reach the correct retained packet. The validation passes only if the post-restructure first pick is the intended phase and the measured hop count is at or below the target.

Target structure: first-principles 11-phase model from iter 044, with iter 035’s retained packet accounting preserved underneath those phases.

## Query-based validation

| # | Query | Expected first-pick (post) | Current hops | Post-restructure hops | Savings target |
|---|---|---|---:|---:|---:|
| 1 | `How was hook parity testing built?` | `005-runtime-executor-and-hooks` → hook parity child packet | 3 | 2 | 1 |
| 2 | `Where is the code-graph extraction history?` | `006-code-graph-capability` → extraction/package child | 4 | 2 | 2 |
| 3 | `How was the resource map template created?` | `002-spec-doc-substrate` → resource-map/template child | 3 | 2 | 1 |
| 4 | `How was the cli-devin deep-loop iter contract designed?` | `002-spec-doc-substrate` → resource-map/deep-loop contract child | 5-6 | 2 | 3+ |
| 5 | `How was the doctor command consolidation done?` | `009-doctor-and-repair-orchestration` → consolidation child | 3 | 2 | 1 |
| 6 | `Where are memory search and continuity recovery invariants?` | `003-memory-continuity-and-indexing` → continuity/indexer child | 3 | 2 | 1 |
| 7 | `Where did local embeddings migrate from Voyage/Qwen to EmbeddingGemma?` | `004-retrieval-and-embeddings-substrate` → local embeddings child | 4 | 2 | 2 |
| 8 | `Where is skill advisor routing calibration and corpus sweep work?` | `007-skill-advisor-and-routing` → calibration/corpus child | 3 | 2 | 1 |

## Graph-based validation

- Hop-from-root assertion: every retained top-level phase is listed in `026/graph-metadata.json.children_ids` or `derived.phase_sequence`, and every retained child packet is reachable as `026 root → owning phase → retained packet`, so max graph distance is ≤ 2 hops. Fail if any retained packet requires filesystem search outside its declared owning phase.
- Resume-pointer assertion: `derived.last_active_child_id` must resolve to the highest-priority active phase, not merely the most recently saved incidental packet. For the proposed model, it should point to the active restructuring/validation phase if work remains; otherwise to the first incomplete item in `derived.resume_priority`.
- Per-phase trigger_phrases assertion: each retained phase exposes distinctive `trigger_phrases` and `key_topics` matching its domain. Required examples: `resource map`, `template levels`, `memory continuity`, `memory indexer`, `local embeddings`, `cocoindex`, `runtime hooks`, `hook parity`, `code graph extraction`, `skill advisor routing`, `causal context routing`, `doctor command`, `package boundaries`, `release governance`.

## Search index validation

- memory_search proof query 1: `cli-devin deep-loop iter contract` → expected hit `002-spec-doc-substrate` / resource-map-and-deep-loop child
- memory_search proof query 2: `code graph extraction history` → expected hit `006-code-graph-capability`
- cocoindex proof query 1: `graph-metadata phase_sequence resume_priority search_keywords_by_phase` → expected file `026-graph-and-context-optimization/graph-metadata.json`
- cocoindex proof query 2: `resource map template phase-to-artifact map domain cross reference` → expected file `026-graph-and-context-optimization/resource-map.md`

## Restructure-quality assertions

1. No load-bearing context lost: verify every packet retained by iter 035 maps to exactly one post-restructure phase, every delete/archive candidate has an explicit replacement or archive path, and old names from `derived.phase_renames` still resolve through trigger phrases.
2. Phase count reduced: verify root active phase count changes from `22 → 11`; count `derived.phase_sequence` excluding `derived.meta_phase_ids`, then compare against the pre-restructure `children_ids` baseline.
3. Hop count improved: run the 8 queries above pre/post, record first-pick and hop count, and require total savings ≥ 12 hops with no query worse than baseline.

## Test plan

### Pre-restructure baseline

- Run queries, record hops + first-pick
- Save baseline to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/validation/pre-restructure-query-baseline.jsonl`

### Post-restructure measurement

- Run same queries, record hops + first-pick
- Save measurement to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/validation/post-restructure-query-measurement.jsonl`

### Diff verdict

- Pass if: all hop targets met + no regressions
- Fail conditions: any regression / any lost context / any query returning empty

### Regression queries (negative case)

- Query 1: `How was hook parity testing built?` → expected SAME first-pick pre + post at domain level: hook parity/runtime hooks
- Query 2: `How was the doctor command consolidation done?` → expected SAME first-pick pre + post at domain level: doctor update/orchestration

## JSONL delta row

{"iter_id": "050", "timestamp_utc": "2026-05-16T04:05:31Z", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "validation_queries": 8, "assertions": 9, "primary_evidence_files": ["iter-040/035/044"]}
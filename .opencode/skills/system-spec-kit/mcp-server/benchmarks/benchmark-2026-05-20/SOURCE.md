---
title: "SOURCE — May 20, 2026 nomic-only re-bench"
description: "Wayfinding pointer for the May 20, 2026 mk-spec-memory re-bench under the nomic-embed-text-v1.5 default (ADR-013) post the 016/002/016-019 fix arc."
trigger_phrases:
  - "spec memory re-bench 2026-05-20 source"
  - "nomic re-bench pointer"
  - "post 016/002/019 retrieval bench"
importance_tier: "important"
contextType: "reference"
---

# SOURCE — May 20, 2026 nomic-only re-bench

> Pointer to the spec packets that own the changes verified by this re-bench.

## 1. OVERVIEW

This benchmark validates the post-016/002/019 corpus state under the ADR-013 nomic default. It is informational rather than authoritative because the cat-24/409 fixture was authored against a different corpus snapshot (May 17 jina-v3 baseline) and three of its ten target memory IDs are out-of-range for the current corpus.

## 2. SOURCE PACKET LOCATIONS

| Packet | Role |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/` | May 17 baseline (ADR-012 jina-v3 + rescue) |
| `.opencode/specs/.../002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table/` | Fixes vec_memories dual-write + factory shard fallback (this re-bench's runtime baseline) |
| `.opencode/specs/.../002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/` | Confirms no equivalent functions for hf/voyage/openai providers |
| `.opencode/specs/.../002-spec-memory-stack/018-constitutional-quality-gate-exemption/` | Constitutional sufficiency exemption |
| `.opencode/specs/.../002-spec-memory-stack/019-lineage-and-metadata-repair-runner/` | Graph-metadata + lineage repair runner |

## 3. WHEN TO READ WHAT

- "What does the current bench say about nomic at 768-dim?" → `benchmark-report.md` Section 2.
- "Why is the hit rate 0/10?" → `benchmark-report.md` Section 6 plus Section 7 caveats.
- "Why is the May 17 baseline still cited?" → the retrieval-rescue layer (ADR-010/011) and the jina-v3 production winner ratified by ADR-012 are the prior steady state; this bench measures the post-ADR-013 corpus and is informational.

## 4. EVIDENCE FILE MAP

| Question | File |
|---|---|
| Headline metrics | `benchmark-report.md` (Section 2) |
| Per-probe raw data | `per-probe.jsonl` |
| Single-row aggregate | `results.csv` |
| Methodology + reproducibility | `benchmark-report.md` (Sections 3, 9) |

## 5. FOLLOW-ON PACKETS

A future packet should:
1. Regenerate the cat-24/409 fixture against the current corpus IDs.
2. Confirm the retrieval-rescue layer is still default-on under ADR-013.
3. Re-run the same harness through a shared-connection client to remove per-query launcher spawn cost from latency measurements.
4. Re-tune the evidence-gap Z-score threshold for the nomic profile if 1.5 turns out to be miscalibrated for the smaller embedding dim.

## 6. WHEN TO UPDATE THIS FILE

When the next benchmark cycle ships, this folder gets archived and a new dated folder takes over. The packet pointers above stay stable.

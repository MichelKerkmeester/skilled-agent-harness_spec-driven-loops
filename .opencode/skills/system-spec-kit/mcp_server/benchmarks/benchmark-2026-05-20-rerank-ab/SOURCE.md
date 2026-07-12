---
title: "SOURCE: spec-memory rerank A/B benchmark (2026-05-20)"
description: "Fixture provenance, memory_index snapshot, and wayfinding pointer for the 2026-05-20 spec-memory rerank A/B benchmark."
trigger_phrases:
  - "spec-memory rerank benchmark source"
  - "rerank-ab fixture provenance"
  - "benchmark-2026-05-20-rerank-ab source"
importance_tier: "important"
contextType: "reference"
---

# SOURCE: spec-memory rerank A/B benchmark (2026-05-20)

> Pointer to the authoritative phase-004 packet and fixture provenance for the spec-memory positional-fallback vs Qwen3-Reranker-0.6B A/B benchmark.

---

## 1. OVERVIEW

This benchmark folder is the replayable evidence surface for phase 004 of the `008-rerank-sidecar-arc`. The run compares two `memory_search` arms against the same `memory_index` snapshot:

- Arm A: positional fallback with `SPECKIT_CROSS_ENCODER=false`.
- Arm B: Qwen3-Reranker-0.6B through the local FastAPI sidecar with `SPECKIT_CROSS_ENCODER=true` and `RERANKER_LOCAL=true`.

The phase-005 promotion packet reads `benchmark_report.md` Section 8 directly.

---

## 2. SPEC PACKET LOCATION

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/
```

Arc pointer:

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/
```

---

## 3. FIXTURE PROVENANCE

The fixture contains 50 probes:

| Source | Probe IDs | Count | Notes |
|---|---:|---:|---|
| cat-24/409 fixture | `fixture-001` to `fixture-010` | 10 | Imported from `manual_testing_playbook/local_llm_query_intelligence/409_fixture.json`; all 10 `expected_source_memory_id` values resolve in the current `memory_index`. |
| cat-13/416 playbook | `fixture-011` to `fixture-014` | 4 | Queries target vec_memories KNN dual-write and factory shard fallback packets. |
| cat-13/417 playbook | `fixture-015` to `fixture-017` | 3 | Queries target constitutional sufficiency-gate exemption packets. |
| cat-13/418 playbook | `fixture-018` to `fixture-022` | 5 | Queries target graph-metadata and lineage repair-runner packets. |
| Fresh phase-004 probes | `fixture-023` to `fixture-050` | 28 | Authored against current `memory_index` content, emphasizing arc 008, launcher lease work, embedder cascade/shards, and broader retrieval pipeline context. |

Each probe includes `gold_doc_ids` plus `gold_memory_ids`. The `gold_memory_ids` are direct `memory_index.id` checks; the harness scores against both returned `memory_index:<id>` identifiers and repo-relative doc paths.

---

## 4. MEMORY INDEX SNAPSHOT

Run-time snapshot:

| Field | Value |
|---|---|
| Captured at | `2026-05-20T14:14:37.674710Z` |
| memory_index size | `8537` |
| memory_index hash | `sha256:27063843a74a89517afb0b5aa1e5355ca4bf67053f7ea2d97656cb7a4964ba1b` |
| Hash recipe | SHA-256 over sorted `id`, `spec_folder`, `file_path`, `content_hash`, `title`, `document_type` rows |

`scripts/run-ab.sh` refreshes the fixture snapshot immediately before the arms run. If the startup scanner indexes newly changed spec docs, the run-time snapshot in `rerank-ab-fixture.json` is the authoritative one for `per-probe.jsonl`, `results.csv`, and `benchmark_report.md`.

---

## 5. FIXTURE TAXONOMY

Difficulty distribution:

| Difficulty | Count |
|---|---:|
| easy | 11 |
| medium | 24 |
| hard | 15 |

Category mix:

| Category | Count |
|---|---:|
| paraphrase | 27 |
| terminology | 11 |
| arc-context | 12 |

The easy tier mostly preserves terminology. The medium tier uses synonyms or narrows to a specific packet artifact. The hard tier uses full reformulations that should reward semantic reranking when the candidate set contains the right document.

---

## 6. EVIDENCE FILE MAP

| File | What |
|---|---|
| `rerank-ab-fixture.json` | Deterministic 50-probe fixture and memory snapshot metadata. |
| `scripts/run_arm.py` | JSON-RPC harness for invoking the real `memory_search` MCP tool. |
| `scripts/run_arm.sh` | Thin shell wrapper around `run_arm.py`. |
| `scripts/run-ab.sh` | Full A/B orchestration: settle startup scan, run both arms, aggregate, report. |
| `scripts/aggregate.py` | Arm-level metrics, Wilson CIs, bootstrap CIs, latency percentiles. |
| `scripts/generate_report.py` | Decision-rule evaluator and sk-doc 10-section report generator. |
| `per-probe.jsonl` | Raw per-query rows across both arms and all runs. |
| `results.csv` | Aggregate metrics per arm plus delta row. |
| `benchmark_report.md` | Curated benchmark report and phase-005 PROMOTE/HOLD verdict. |

---

## 7. FOLLOW-ON PACKETS

Phase 005 consumes this benchmark:

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/
```

---

## 8. WHEN TO UPDATE THIS FILE

- The fixture changes: update Sections 3 and 5.
- The benchmark is rerun on a new memory snapshot: update Section 4.
- Phase 005 lands: update Section 7 with the delivered outcome.

### Last updated

2026-05-20, initial SOURCE.md for phase 004.

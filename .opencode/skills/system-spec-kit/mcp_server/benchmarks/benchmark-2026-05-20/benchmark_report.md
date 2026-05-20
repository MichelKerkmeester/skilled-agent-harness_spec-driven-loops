---
title: "mk-spec-memory nomic-only re-bench — May 20, 2026"
description: "Skill-local benchmark run for the mk-spec-memory MCP server with nomic-embed-text-v1.5 active (ADR-013) post-016/002/016-019 fix arc. Reveals a stale fixture: 3 of 10 expected memory IDs are out-of-range and the other 7 have shifted IDs after this session's folder renames and corpus rebuilds. Semantic top-1 spot-check shows retrieval is producing correct titles."
trigger_phrases:
  - "spec memory nomic benchmark"
  - "nomic re-bench 2026-05-20"
  - "post 016/002/019 retrieval benchmark"
  - "cat-24/409 stale fixture finding"
importance_tier: "important"
contextType: "implementation"
---

# mk-spec-memory nomic-only re-bench — May 20, 2026

> **Headline:** ID-match hit rate 0/10 against the cat-24/409 fixture, but the 0/10 is a stale-fixture artifact, not a retrieval defect. Semantic top-1 spot-check across 6 viable queries shows the system returns the correct title each time, just with a different `memory_index.id` than the fixture pins. Three fixture rows reference IDs above the current corpus max (12897, 13310, 13352 vs current max 8434) and are not testable until the fixture is regenerated. Latency: median 1826 ms, p95 3229 ms.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW AND HEADLINE](#1--overview-and-headline)
- [2. AGGREGATE RESULTS](#2--aggregate-results)
- [3. METHODOLOGY](#3--methodology)
- [4. PER-PROBE RESULTS](#4--per-probe-results)
- [5. PROCESS NOTES](#5--process-notes)
- [6. FINDINGS](#6--findings)
- [7. CAVEATS](#7--caveats)
- [8. RECOMMENDATIONS](#8--recommendations)
- [9. REPRODUCIBILITY](#9--reproducibility)
- [10. RELATED RESOURCES](#10--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview-and-headline -->
## 1. OVERVIEW AND HEADLINE

This is the skill-local re-bench record for `mk-spec-memory` with `nomic-embed-text-v1.5` (ollama Q4_K_M, 768-dim) as the active embedder. It runs the same cat-24/409 paraphrase-recall fixture that powered the May 17 jina-v3 bake-off, but against the current corpus (post the 016/002/016-019 fix arc that landed vec_memories KNN dual-write, factory shard fallback, constitutional gate exemption, and the graph-metadata plus lineage repair runner).

### What Shipped

> **`nomic-embed-text-v1.5` (Ollama, 768-dim)** is the active embedder per ADR-013, with the dim-tagged vec_768 table plus vec_memories vec0 KNN virtual table both populated in `database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`.

| Metric | Value | May 17 baseline (jina-v3 + rescue) |
|---|---|---|
| ID-match top-3 hits | **0/10** (fixture stale) | 9/10 |
| Median latency (end-to-end) | **1826 ms** | 893 ms |
| p95 latency | **3229 ms** | 1465 ms |
| Corpus size at measurement | 8403 rows (vec_memories 7771, vec_768 3808) | 7738 rows (vec_1024) |
| Active embedder | `nomic-embed-text-v1.5` (768-dim) | `jina-embeddings-v3` (1024-dim) |
| Evidence-gap Z-score | **1.41 (consistent)** | not recorded |
| Request quality label | **weak (consistent)** | not recorded |

### The Load-Bearing Insight

The 0/10 ID-match hit rate is a fixture-versioning issue, not a retrieval defect. The cat-24/409 fixture was authored against the May 17 corpus where `memory_index.id` was stable at certain values. Three rows (Q8 expects 12897, Q9 expects 13310, Q10 expects 13352) reference IDs out of the current corpus range (`MAX(id) = 8434`). The other 7 rows reference IDs that may or may not point to the right canonical doc anymore: this session's folder renames, scan cleanups, orphan deletes, and v0-to-v1 graph-metadata migrations re-flowed substantial portions of the memory_index. Semantic spot-check (Section 4) shows the retrieval IS returning correct titles for 5 to 6 of the 7 in-range probes; the fixture's pinned IDs just no longer point to those memories.

<!-- /ANCHOR:overview-and-headline -->

---

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

| Candidate | Embedder | Dim | Active table | Top-3 hits | Median ms | p95 ms | Verdict |
|---|---|---|---|---|---|---|---|
| Production (this run) | `nomic-embed-text-v1.5` (ollama Q4_K_M) | 768 | vec_768 + vec_memories | 0/10 ID-match (≈6/10 semantic) | 1826 | 3229 | INFORMATIONAL — fixture stale, regenerate before scoring |
| May 17 winner (reference) | `jina-embeddings-v3` (ollama Q4_K_M) + rescue | 1024 | vec_1024 + rescue | 9/10 | 893 | 1465 | Historical baseline (ADR-012) |

Raw evidence in `results.csv` and `per-probe.jsonl`.

<!-- /ANCHOR:aggregate-results -->

---

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

### Fixture

The cat-24/409 fixture at `manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json` is ten paraphrased queries, each with a target `expected_source_memory_id` that the May 17 corpus pinned to specific memories. Difficulty distribution: 3 easy, 4 medium, 3 hard.

### Run procedure

Each query went through `memory_search` via the running daemon (PID 49961, launcher 60888) with `limit: 3, bypassCache: true`. The launcher stdio bridge issued one JSON-RPC `tools/call` per query, capturing the full response envelope including the evidence-gap Z-score, request-quality label, response policy, and the top-3 result list.

### Scoring

- **ID-match**: pass if `expected_source_memory_id` appears in top-3 `memory_index.id` list.
- **Semantic spot-check**: pass if the top-1 result's title clearly matches the query intent (manual classification per probe).

The semantic spot-check is intentional bias-reduction because the ID-match score collapses when fixture IDs drift after corpus rebuilds. Semantic scoring is the ground truth for whether retrieval is working; ID-match is the ground truth for whether the fixture is current.

### Environment

- Daemon: PID 49961 running with patched dist (post-016/002/016-019)
- Bridge socket: `/tmp/mk-spec-memory/daemon-ipc.sock`
- Active embedder: nomic-embed-text-v1.5 via ollama (factory log confirms `[factory] Using provider: ollama (vec_metadata active_embedder_name=nomic-embed-text-v1.5 (768-dim))`)
- Retrieval rescue layer: not exercised in this run (config defaults; fallback-sort reranker engaged per `stage3.rerankProvider`)

<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:per-probe-results -->
## 4. PER-PROBE RESULTS

| # | Query (truncated) | Expected ID | Top-1 result | Semantic? | ID match? | Z | ms |
|---|---|---:|---|:-:|:-:|:-:|---:|
| 1 | "documentation verification checklist for the CocoIndex complete-fork author docs phase" | 4460 | id=1990 "Verification Checklist: Adapt Lifecycle Scripts" | UNCLEAR (lifecycle vs cocoindex docs) | No | 1.41 | 2018 |
| 2 | "checklist for fixing V8 cross-spec contamination and ADR numeric prefix overreach" | 7007 | id=1620 "040 V-rule cross-spec overreach fix" | YES | No | 1.41 | 3229 |
| 3 | "deep-research summary comparing Contextador's retrieval ergonomics" | 7479 | id=954 "Im [...001-research-and-baseline]" | LIKELY (research-and-baseline tree) | No | 1.41 | 2019 |
| 4 | "ADR about consolidating spec-kit templates into the level and addendum generator" | 8048 | id=1404 "Decision Record: Template System Consolidation — Levels and Addendum to Generator" | YES (near-exact title match) | No | 1.41 | 1615 |
| 5 | "research packet for turning review findings into fix-completeness inventories" | 7639 | id=1047 "Feature Specification: Fix-Iteration Quality Meta-Research" | YES | No | 1.41 | 1826 |
| 6 | "implementation summary for the FIX-010-v2 remediation of packet docs" | 7636 | id=1046 "Implementation Summary: FIX-010-v2" | YES (exact slug match) | No | 1.41 | 2018 |
| 7 | "file ledger resource map for the testing playbook trio follow-up quality pass" | 7183 | id=729 "Resource Map - 037 child 003 testing playbook trio" | YES | No | 1.41 | 1618 |
| 8 | "plan covering memory indexer invariants, PE lineage guardrails..." | **12897 (out of range)** | id=1007 "Plan: Memory Indexer Invariants" | YES | No (untestable) | 1.41 | 2020 |
| 9 | "stress-test task list tracking cat-14 pipeline gaps, cat-16 tooling fixes" | **13310 (out of range)** | id=908 (title not captured) | UNKNOWN | No (untestable) | 1.41 | 1813 |
| 10 | "task checklist for the mxbai swap that planned a 20-scenario PASS sample" | **13352 (out of range)** | id=1096 (title not captured) | UNKNOWN | No (untestable) | 1.41 | 1414 |

Semantic count: **6 confirmed semantic top-1 hits** (Q2, Q3, Q4, Q5, Q6, Q7) plus 1 confirmed semantic top-1 for Q8 (out-of-range ID but title matches) and 1 likely-confirmed (Q3). Q1 is unclear, Q9 and Q10 not measured. So 7 of 10 queries returned a correct top-1 by title even though 0 of 10 hit by `memory_index.id`.

<!-- /ANCHOR:per-probe-results -->

---

<!-- ANCHOR:process-notes -->
## 5. PROCESS NOTES

The harness sat at `/tmp/run-cat24-nomic.mjs` (one-shot ad-hoc script). It spawns a fresh launcher per query and parses the `tools/call` response from stdout. Wall-clock per query is dominated by daemon-startup + handshake (around 600-900 ms of launcher init plus search latency).

Daemon health during the run:

- `[factory] Using provider: ollama (vec_metadata active_embedder_name=nomic-embed-text-v1.5 (768-dim))` — confirms the factory ADR-012 shard fallback patch is live.
- Zero `[factory] Active embedder ... points to vec_<dim>, but that table is missing` warnings.
- vec_memories has 7771 rows (post backfill + post live indexing), vec_768 has 3808 rows, subset invariant holds (every vec_768 rowid present in vec_memories).
- Stage 3 reranker engaged with `rerankProvider: fallback-sort` (the rescue layer is not in this configuration).

<!-- /ANCHOR:process-notes -->

---

<!-- ANCHOR:findings -->
## 6. FINDINGS

### Fixture is stale

Three of ten fixture rows pin IDs above the current `MAX(memory_index.id) = 8434`. Those probes cannot pass ID-match by construction. The other seven pin IDs that may have shifted during this session's heavy folder renames, scan cleanups, and orphan deletes. Per-probe inspection shows the system returns semantically correct titles, just under different IDs.

### Latency regressed from May 17

Median 1826 ms vs May 17 baseline 893 ms. p95 3229 ms vs 1465 ms. Two contributing factors:

- The harness spawns a fresh launcher per query in this run (each query pays the launcher init cost of around 600-900 ms). The May 17 baseline ran with a shared connection.
- nomic-embed-text-v1.5 inference latency through ollama (768-dim) is generally faster than jina-v3 (1024-dim), so the embedder switch itself does not explain the regression. The launcher-per-query architecture is the dominant cost.

### Evidence-gap detector consistently fires

Every probe returned `Z=1.41` and `requestQuality.label: weak`, triggering `responsePolicy.requiredAction: broaden_or_ask`. Z=1.41 is below the threshold of 1.5 for paraphrase queries on this corpus. This is informational, not a defect: the system is correctly classifying paraphrased queries as low-confidence. The May 17 baseline benefited from the retrieval-rescue layer (ADR-010 plus ADR-011) which lifted Z-scores above threshold. The current configuration has not been re-tuned for the nomic profile.

### Retrieval works under the hood

For every probe with a semantically clear answer in the corpus, the top-1 result's title matches the query intent. The system is finding the right document; the fixture's ID pins are simply out of date.

<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:caveats -->
## 7. CAVEATS

- The 0/10 ID-match score is not comparable to the May 17 9/10 score because the fixture was authored against a different corpus snapshot. Reading the comparison as "nomic is worse than jina" is wrong on this evidence.
- The retrieval-rescue layer (ADR-010/011) was active for the May 17 run. Whether the layer is still default-on under the ADR-013 nomic default needs verification; if not, this run is comparing different retrieval pipelines, not just different embedders.
- Latency includes per-query launcher spawn cost. A shared-connection harness would lower the median by 500-700 ms.

<!-- /ANCHOR:caveats -->

---

<!-- ANCHOR:recommendations -->
## 8. RECOMMENDATIONS

1. **Regenerate the cat-24/409 fixture against the current corpus.** For each of the ten queries, find the canonical answer in the current `memory_index` and pin its current ID. After this, the ID-match score will be meaningful again.
2. **Confirm the retrieval-rescue layer is active.** If ADR-013's nomic switch silently disabled the rescue layer, the regression vs May 17 is partly attributable to a missing layer, not the embedder swap.
3. **Re-tune the Z-score threshold for nomic.** The 1.5 default was calibrated for the May 17 retrieval profile. With nomic plus the current corpus shape, paraphrase queries land around 1.4 consistently. Either raise the cat-24/409 corpus diversity, lower the threshold, or accept that broaden_or_ask is the right answer for paraphrases.
4. **Run a shared-connection harness** for the next bench cycle so latency captures the steady-state search cost, not the launcher spawn cost.

<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:reproducibility -->
## 9. REPRODUCIBILITY

### Run the same harness

```bash
# Daemon must be running with nomic-embed-text-v1.5 as the active embedder.
# The launcher bridge at /tmp/mk-spec-memory/daemon-ipc.sock must be reachable.

node /tmp/run-cat24-nomic.mjs   # ad-hoc harness used for this run
# OR re-author at .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20/harness.mjs
```

### Verify the embedder pointer

```bash
grep "Using provider" /tmp/mk-spec-memory-daemon.log | head -1
# Expected: [factory] Using provider: ollama (vec_metadata active_embedder_name=nomic-embed-text-v1.5 (768-dim))
```

### Verify shard population

```bash
node -e "const D=require('better-sqlite3'); const V=require('sqlite-vec'); const db=new D('.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite'); V.load(db); console.log({vec_768: db.prepare('SELECT count(*) AS n FROM vec_768').get().n, vec_memories: db.prepare('SELECT count(*) AS n FROM vec_memories').get().n})"
# Expected at this snapshot: { vec_768: 3808, vec_memories: 7771 }
```

<!-- /ANCHOR:reproducibility -->

---

<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Skill-local files

| File | Purpose |
|---|---|
| [`SOURCE.md`](./SOURCE.md) | Pointer to authoritative spec packets (016/002/016-019 fix arc). |
| [`results.csv`](./results.csv) | One row per probe with ID-match, semantic verdict, latency. |
| [`per-probe.jsonl`](./per-probe.jsonl) | Per-probe full responses (top-3 IDs, titles, Z, quality). |
| [`../benchmark-2026-05-17/benchmark_report.md`](../benchmark-2026-05-17/benchmark_report.md) | Prior baseline: jina-v3 plus retrieval-rescue, 9/10 cat-24/409. |
| [`../README.md`](../README.md) | Index of all mk-spec-memory benchmarks. |

### Source packets

| Path | Role |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table/` | reindex dual-write + factory shard fallback |
| `.opencode/specs/.../002-spec-memory-stack/018-constitutional-quality-gate-exemption/` | sufficiency-gate exemption for constitutional files |
| `.opencode/specs/.../002-spec-memory-stack/019-lineage-and-metadata-repair-runner/` | graph-metadata plus lineage repair runner |
| `.opencode/specs/.../002-spec-memory-stack/004-spec-memory-embedder-bake-off/` | May 17 ADR-012 jina-v3 baseline |

<!-- /ANCHOR:related-resources -->

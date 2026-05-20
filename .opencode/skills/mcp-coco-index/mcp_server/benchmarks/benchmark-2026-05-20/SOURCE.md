---
title: "SOURCE: Qwen3 reranker default flip (May 20, 2026)"
description: "Wayfinding pointer from the skill-local benchmark folder to the authoritative spec packet for the May 20, 2026 mcp-coco-index Qwen3 reranker default-flip head-to-head against jina-reranker-v3. Maps each spec-packet file to the questions it answers."
trigger_phrases:
  - "mcp-coco-index benchmark source 2026-05-20"
  - "Qwen3 reranker spec packet pointer"
  - "Qwen3 reranker bake-off source"
  - "023B expanded fixture source"
importance_tier: "important"
contextType: "reference"
---

# SOURCE: Qwen3 reranker default flip (May 20, 2026)

> Pointer to the authoritative spec packet that owns the May 20, 2026 `mcp-coco-index` Qwen3 reranker default-flip head-to-head. The skill-local folder you are reading is curated. The spec packet is the audit trail.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SPEC PACKET LOCATION](#2--spec-packet-location)
- [3. WHEN TO READ WHAT](#3--when-to-read-what)
- [4. EVIDENCE FILE MAP](#4--evidence-file-map)
- [5. FOLLOW-ON PACKETS](#5--follow-on-packets)
- [6. WHEN TO UPDATE THIS FILE](#6--when-to-update-this-file)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What this file is

A wayfinding doc. It tells you which file in the spec packet to open for which question, so you do not have to scan all evidence files when you only need one.

### What lives in the spec packet, not here

- The full ADR trail covering ADR-027 (Qwen3 reranker default promotion).
- The complete 023B fixture-calibration sweep methodology, including non-reranker lanes (RRF K, top-K, boost magnitude, fusion formula) that turned out flat.
- Per-candidate rollback rationale and the operator-visible warning surface for the demoted jina-reranker-v3 default.
- Deep-research arc context (023 deep-research-arc-blind-spots) that scoped the calibration packet.

### What lives in this folder, curated

- `benchmark_report.md`: the ten-section curated headline summary for the reranker flip.
- `results.csv`: 6-row aggregate (2 lanes × 3 runs) with hits, hit_rate, latency percentiles.
- `per-probe.jsonl`: 438 rows (73 probes × 2 lanes × 3 runs) flattened for cross-lane analysis.
- `lane-reranker-{jina-v3,qwen3-0p6b}-run-{1,2,3}.json`: 6 raw lane JSONs, direct copies of the spec packet evidence — same authority as the originals.
- `code-retrieval-fixture-expanded-v2.json`: the 73-probe fixture used by every lane.
- `expanded-calibration-summary.md`, `calibration-recommendation.md`, `residual-miss-taxonomy.md`, `robust-verdict-gates.md`: curated analysis sidecars from the originating packet.
- `SOURCE.md`: this file.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:spec-packet-location -->
## 2. SPEC PACKET LOCATION

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration/
```

The ADR that promoted Qwen3 to the default reranker lives in the sibling stack:

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md
```

(ADR-027, "Reranker default flipped to Qwen3-Reranker-0.6B".)

<!-- /ANCHOR:spec-packet-location -->

---

<!-- ANCHOR:when-to-read-what -->
## 3. WHEN TO READ WHAT

Match the question you have to the file that answers it.

| Question | Open this first | Backup |
|---|---|---|
| Which reranker won and why? | `decision-record.md` ADR-027 in `002-spec-memory-stack/004-spec-memory-embedder-bake-off/` | `benchmark_report.md` §1 (this folder) |
| Is the production default safe to ship? | `023/007-fixture-calibration/implementation-summary.md` | `decision-record.md` ADR-027 |
| What fixture was used and why was it expanded from 18 to 73 probes? | `expanded-calibration-summary.md` (this folder, copied from packet) | `023/007-fixture-calibration/spec.md` §Probes |
| How were the calibration knobs swept (RRF K / top-K / boost / fusion)? | `023/007-fixture-calibration/evidence/runs/lane-{rrf,topk,boost,fusion}-*.json` | `expanded-calibration-summary.md` |
| Why did jina-v3 run-1 score so low (14/73)? | `benchmark_report.md` §2 + `lane-reranker-jina-v3-run-1.json` (this folder) | `023/007-fixture-calibration/research.md` |
| What probes still miss across both rerankers? | `residual-miss-taxonomy.md` (this folder, copied from packet) | `per-probe.jsonl` (this folder) |
| What gates protect against an unsafe future flip? | `robust-verdict-gates.md` (this folder) | `calibration-recommendation.md` |

<!-- /ANCHOR:when-to-read-what -->

---

<!-- ANCHOR:evidence-file-map -->
## 4. EVIDENCE FILE MAP

| File | What |
|---|---|
| `benchmark_report.md` | Curated ten-section headline summary of the Qwen3 default flip (winner, aggregate, methodology, per-candidate, findings, caveats, recommendations, reproducibility). |
| `results.csv` | 6-row aggregate: one row per (lane × run) with hits, hit_rate, p50/p95/p99/mean latency, embedder, reranker, completed_at. |
| `per-probe.jsonl` | 438-row flat per-probe dump: one row per (probe_id × lane × run) with hit, latency_ms, expected path, query text, top5. |
| `lane-reranker-jina-v3-run-{1,2,3}.json` | 3 raw lane runs for the demoted default. Run-1 shows the cold-start saturation; runs 2-3 are warm-only baseline. |
| `lane-reranker-qwen3-0p6b-run-{1,2,3}.json` | 3 raw lane runs for the promoted default. Zero stddev across runs. |
| `code-retrieval-fixture-expanded-v2.json` | The 73-probe fixture: 18 corrected regression-floor + 15 architecture-invariant + 10 multilingual + 5 short-query + 5 long-query, with path-class coverage across implementation / tests / docs / generated / vendor / spec-research. |
| `expanded-calibration-summary.md` | Aggregate findings from the full 023B calibration sweep, including the non-reranker lanes that turned out flat. |
| `calibration-recommendation.md` | The single-page operator recommendation that fed the ADR. |
| `residual-miss-taxonomy.md` | Taxonomy of the probes that miss across both rerankers — the ceiling-finding evidence. |
| `robust-verdict-gates.md` | The gates a future reranker flip must clear (sample size, license check, latency budget, cold-start guard). |

<!-- /ANCHOR:evidence-file-map -->

---

<!-- ANCHOR:follow-on-packets -->
## 5. FOLLOW-ON PACKETS

- `008-rerank-sidecar-arc/` (in flight): Qwen3-Reranker-0.6B HTTP service shipped in `008/002` (`b3db00d2f`) plus self-electing primary launcher in `008/003` (`3ad09c6c3`). Operationalizes the new default as a long-lived sidecar so the model load cost amortizes across queries.
- Probe-forensics deep dive (deferred): the residual-miss taxonomy identifies a small probe cluster (forensic candidates 5, 12, 13) that miss across every measured reranker × embedder combination. Decision pending between fixture-truth correction and accepting as semantic-ceiling.

<!-- /ANCHOR:follow-on-packets -->

---

<!-- ANCHOR:when-to-update -->
## 6. WHEN TO UPDATE THIS FILE

- The spec packet at `023/007-fixture-calibration/` gets renamed or moved: update §2 and the path references in §3 and §4.
- A new ADR lands (e.g., ADR-028 for a future reranker swap): add a row to §3 and update §2.
- A follow-on packet ships (e.g., `008-rerank-sidecar-arc/` completes): update its row in §5 with a one-line completion marker.
- A lane JSON is added or fundamentally revised in the spec packet: mirror the change in §4 and re-copy the file into this folder.

### Last updated

2026-05-20, initial SOURCE.md fill-in for the Qwen3 reranker default-flip promotion.

<!-- /ANCHOR:when-to-update -->

---
title: "mcp-coco-index — Benchmarks Index"
description: "Skill-local index of code-retrieval benchmark runs for the mcp-coco-index MCP server. Curated, dated summaries of bake-offs across CocoIndex embedder candidates. Spec packets retain the full audit trail; this folder is the look-here-first entry point for someone in the MCP code."
trigger_phrases:
  - "coco-index benchmarks"
  - "mcp-coco-index benchmark index"
  - "code embedder benchmarks"
  - "ccc benchmarks readme"
importance_tier: "important"
contextType: "reference"
---

# mcp-coco-index Benchmarks

<!-- ANCHOR:toc -->
## TABLE OF CONTENTS

- [OVERVIEW](#1--overview)
- [ACTIVE BENCHMARKS](#2--active-benchmarks)
- [PENDING DECISIONS](#3--pending-decisions)
- [STRUCTURE](#4--structure)
- [USAGE](#5--usage)
- [SIBLING SKILL BENCHMARKS](#6--sibling-skill-benchmarks)
- [RELATED](#7--related)
<!-- /ANCHOR:toc -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder is the skill-local index of code-retrieval benchmark runs for the `mcp-coco-index` MCP server. Each dated subfolder is one curated, sk-doc-compliant summary of a code-embedder bake-off — what was measured, which candidate won, what was promoted, what is still pending.

**Purpose:**

- Answer "which code embedder won? on what fixture? when?" without hunting through `specs/`.
- Provide a stable, evergreen home for promoted bench artifacts (CSV / JSONL / curated report) alongside the MCP server's own code.
- Track headline + status across runs so the production default can be revisited deliberately, not by accident.

**Stack scope:**

- Backend: `sbert/` prefix (sentence-transformers, Python).
- Pipeline: hybrid (FTS5 + vector RRF) + cross-encoder rerank, with defaults as ON since `016/011`.
- Hardware baseline: Apple Silicon (MPS). CUDA-gated runs are tracked separately when they exist.

**Authority hierarchy:**

1. Spec packet `decision-record.md` and `implementation-summary.md` — source of truth.
2. Skill-local `benchmark_report.md` — curated summary; tracks the spec packet's headline.
3. CSV / JSONL files — direct copies of the spec packet evidence; same authority.

The canonical mechanics for the layout convention live at `.opencode/skills/sk-doc/references/benchmark_creation.md`.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:active-benchmarks -->
## 2. ACTIVE BENCHMARKS

| Date | Bench | Winner | Status | Spec packet |
|---|---|---|---|---|
| **May 20, 2026** ← **production** | [`benchmark-2026-05-20/`](./benchmark-2026-05-20/) | `nomic-ai/CodeRankEmbed` + `Qwen/Qwen3-Reranker-0.6B` (**30/73 = 41.1%**, p95 1984ms) | Shipped + locked as default | `016/004/023B` expanded fixture calibration |
| May 19, 2026 | [`benchmark-2026-05-19/`](./benchmark-2026-05-19/) | `nomic-ai/CodeRankEmbed` + `jinaai/jina-reranker-v3` (**14/18 = 77.8%**, median 1964ms) | Superseded by 2026-05-20 Qwen3 default flip | `016/004/013-018` six-packet arc + nomic promotion follow-on |
| May 18, 2026 | [`benchmark-2026-05-18/`](./benchmark-2026-05-18/) | `BAAI/bge-code-v1` (11/18 = 61.1%, median 504ms) | **STRUCTURALLY INVALIDATED** — rerank wasn't firing due to stale pipx; preserved as historical record | `016/004/004-extended-bake-off` |

**Current production default (since 2026-05-20):** `sbert/nomic-ai/CodeRankEmbed` embedder + `Qwen/Qwen3-Reranker-0.6B` reranker. The 023B expanded-fixture head-to-head kept the 013-018 corrected pipeline and flipped only the reranker, where Qwen3 beat jina-v3 by +1 hit/73, -32% p95 latency, and a permissive Apache-2.0 license.
<!-- /ANCHOR:active-benchmarks -->

<!-- ANCHOR:pending-decisions -->
## 3. PENDING DECISIONS

The May 19, 2026 bench is the production state. Open follow-ons (non-blocking):

### 3.1 Lane A (no-rerank ablation) debug

- The rerank-matrix harness exhibits a 32-sec/probe timeout under `COCOINDEX_RERANK_ENABLED=false` (hits=0/18, p95 32sec).
- Bug is in the rerank-disabled dispatch path inside `query.py`, not blocking the production verdict.
- Needs a separate debug packet to isolate + fix.

### 3.2 3-iteration confirmation of the top-2 lanes

- Current bench data is n=1 per cell. Hit rate is binary (low variance per probe), but the latency p95 has natural jitter of ±10% on Apple Silicon.
- Recommend a 3-iteration replay for the top-2 reranker lanes (jina-v3 on nomic + bge-code-v1) to bound confidence intervals before lifting the production state to a wider corpus.

### 3.3 Re-bench other embedders under corrected pipeline

- jina-v2-base-code, gemma-300m, mxbai, stella were measured under the broken May 18 pipeline.
- Hypothesis (from the nomic re-bench): the "embedder choice is no longer load-bearing" pattern generalizes — all of them might lift to 14/18 under the corrected pipeline.
- Untested. Each re-bench requires a ~25 min re-index swap.

### 3.4 Path-class-aware query expansion

- 016 shipped query expansion as opt-in default-false because deterministic expansion pulled test/doc files into top-K.
- Hypothesis: only expand for implementation-class chunks would make it net-positive.
- Follow-on packet candidate.

### 3.5 Probe forensics (probes 5, 12, 13)

- These 3 probes miss across EVERY embedder × reranker combination measured.
- Either fixture-truth issues OR the entire embedder family lacks the semantic understanding for these queries.
- Worth a deep-dive to decide: expand the fixture, fix the truth, or accept as semantic-ceiling.
<!-- /ANCHOR:pending-decisions -->

<!-- ANCHOR:structure -->
## 4. STRUCTURE

What this folder is and is NOT.

### What this folder IS

- A curated, dated index of code-retrieval bake-offs that have been promoted out of `evidence/` into a stable skill-local location.
- The first place to look for "what is the current code-embedder winner on this stack?"
- The home for `README.md` (this file) and `benchmark-<YYYY-MM-DD>/` subfolders. The convention mechanics live at `.opencode/skills/sk-doc/references/benchmark_creation.md`.

### What this folder is NOT

- A draft scratchpad. In-progress experiments live in the spec packet's `evidence/` until they ship.
- A replacement for spec packets. The full ADR trail, fixture rationale, and rollback context stay in `specs/`.
- A place for unqualified single-data-point measurements. Promote n=1 evidence only with an explicit provisional label and a follow-on replay plan; remove the provisional label after the policy-preferred 3-run confirmation exists.
- A cross-skill performance comparison. Numbers here are valid only against this skill's stack (sbert + CocoIndex hybrid + rerank). Do NOT cross-reference latency or hit-rate numbers with `mk-spec-memory`'s Ollama-backed bench.

### Folder layout (per FORMAT.md)

```
mcp_server/benchmarks/
├── README.md                                  <- This file (index)
└── benchmark-<YYYY-MM-DD>/                    <- One folder per benchmark RUN
    ├── benchmark_report.md                    ← Curated 10-section report
    ├── results.csv                            ← Primary aggregate
    ├── per-probe.jsonl                        ← Per-query / per-probe rows
    ├── runtime-measurements.md                ← Optional RAM/latency profile
    └── SOURCE.md                              ← Pointer to spec packet
```

Date convention: folder names use ISO `YYYY-MM-DD`; in-doc prose uses the long form "May 18, 2026". Always cite the date the bench was executed, not when the doc was written.
<!-- /ANCHOR:structure -->

<!-- ANCHOR:usage -->
## 5. USAGE

### Read the latest benchmark

```bash
$EDITOR .opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md
```

### Re-run an existing benchmark

Use the replay command published in that benchmark's `benchmark_report.md` Reproducibility section. For the May 18, 2026 run:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Stop daemon + clear LMDB wedge state
pkill -KILL -f "ccc run-daemon" && rm -f .cocoindex_code/lock.mdb

# Run all 4 candidates with hybrid + rerank defaults on
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh \
  sbert/jinaai/jina-embeddings-v2-base-code \
  sbert/google/embeddinggemma-300m \
  sbert/nomic-ai/CodeRankEmbed \
  sbert/BAAI/bge-code-v1
```

Expected wall-clock: ~80–110 min for the full 4-candidate clean run.

### Add a new benchmark folder

When a new bake-off ships out of a spec packet, follow this promotion workflow (per `FORMAT.md`):

1. Bench completes in a spec packet (`specs/.../evidence/`).
2. Spec packet's `benchmark-results.md` is written and reviewed.
3. Create `benchmark-<YYYY-MM-DD>/` in this folder.
4. Copy `results.csv` and `per-probe.jsonl` from the spec packet evidence — direct copies, same authority as the originals.
5. Write a curated `benchmark_report.md` following the 10-section structure in `FORMAT.md` (headline → aggregate results → methodology → per-candidate profiles → process notes → findings → caveats → recommendations → reproducibility → cross-links).
6. Write `SOURCE.md` pointing back to the spec packet, with a per-file map.
7. Add a row to the Active Benchmarks table above; update Pending Decisions if the headline blocks a default-swap.

When NOT to add: in-progress experiments, single-data-point measurements, or reruns that do not change the headline — for reruns, update the existing `benchmark_report.md` with a "Re-run YYYY-MM-DD" section instead of creating a new folder.

### Disambiguate same-day benchmarks

If two benchmarks ran on the same date and need disambiguation, suffix the folder with a topic slug: `benchmark-2026-05-18-bge-confirmation/`. Otherwise keep it pure.
<!-- /ANCHOR:usage -->

<!-- ANCHOR:sibling-benchmarks -->
## 6. SIBLING SKILL BENCHMARKS

Other MCP servers in this repo maintain the same folder convention (per `FORMAT.md`). When comparing across skills, remember that backends and fixtures differ — only same-skill, same-fixture comparisons are apples-to-apples.

| Skill | Path | Stack | Notes |
|---|---|---|---|
| `system-spec-kit` (mk-spec-memory) | [`../../system-spec-kit/mcp_server/benchmarks/`](../../system-spec-kit/mcp_server/benchmarks/) | Ollama-backed text retrieval | Different stack — do NOT cross-reference latency or hit-rate numbers. Look here for memory-side embedder choices. |
| `mcp-coco-index` (this skill) | (you are here) | sbert + CocoIndex hybrid + rerank | Code-side bake-offs. |

The format convention itself lives at `.opencode/skills/sk-doc/references/benchmark_creation.md`. Read it there, not in this folder.
<!-- /ANCHOR:sibling-benchmarks -->

<!-- ANCHOR:related -->
## 7. RELATED

### Skill internals

- `cocoindex_code/config.py` — current `_DEFAULT_MODEL` lives here.
- `cocoindex_code/registered_embedders.py` — vetted-candidate registry with RAM / disk / dim / MPS metadata.
- `cocoindex_code/reranker.py` — cross-encoder rerank stage; current default `BAAI/bge-reranker-v2-m3`.

### Spec packets

- `016/004/004-extended-bake-off/` — authoritative spec packet for the May 18, 2026 bench. Full per-probe matrix, latency percentile tables, stella failure analysis.
- `016/007/003-bge-code-v1-confirmation-and-promote/` — pending 3-run replay.
- `016/007/002-cocoindex-ollama-adapter/` — pending Ollama provider for CocoIndex's Python registry.
- `016/005/004-skill-local-benchmarks-format/` — tracking sub-phase that introduced this folder layout.

### Format and tooling

- `.opencode/skills/sk-doc/references/benchmark_creation.md` — single-source layout convention and authoring workflow.
- `.opencode/skills/sk-doc/SKILL.md` — markdown documentation standards used by every `benchmark_report.md` and this README.
<!-- /ANCHOR:related -->

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

The single source of the layout convention is [`FORMAT.md`](./FORMAT.md), symlinked from the system-spec-kit sibling skill.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:active-benchmarks -->
## 2. ACTIVE BENCHMARKS

| Date | Bench | Winner | Status | Spec packet |
|---|---|---|---|---|
| May 18, 2026 | [`benchmark-2026-05-18/`](./benchmark-2026-05-18/) | `BAAI/bge-code-v1` (11/18 = 61.1%, median 504ms) | Single-run; 3-run confirmation planned (`016/007/003`) | `016/004/004-extended-bake-off` |

**Current production default:** `sbert/jinaai/jina-embeddings-v2-base-code` (`cocoindex_code/config.py:_DEFAULT_MODEL`). The May 18, 2026 winner has not yet been promoted — see Pending Decisions below.
<!-- /ANCHOR:active-benchmarks -->

<!-- ANCHOR:pending-decisions -->
## 3. PENDING DECISIONS

Two follow-on packets must close before the May 18, 2026 winner is promoted as the default.

### 3.1 3-run confirmation of `bge-code-v1`

- Tracked in: `016/007/003-bge-code-v1-confirmation-and-promote/`.
- Why: per the noise-floor lessons from `113/005-extraction-rerun` (memory: `project_116_confirmation_rcaf_holds`), single-sample wins on a small fixture need a 3-run confirmation before promotion. bge-code-v1's 11.1pp lead is well above the noise floor, but only 4 unique probes account for the entire gap.
- Promotion rule: if hit rate stays in `10/18`–`12/18` across all 3 replays → swap `_DEFAULT_MODEL` jina-code → bge-code-v1 in `cocoindex_code/config.py`. If any single run drops to `9/18` → hold at jina-code.

### 3.2 Ollama adapter for CocoIndex

- Tracked in: `016/007/002-cocoindex-ollama-adapter/`.
- Why: CocoIndex's Python registry (`registered_embedders.py`) is currently `sbert/`-only. Adding an Ollama adapter would let future bake-offs measure Ollama-served candidates on the same fixture — useful for cross-backend comparisons against the `mk-spec-memory` text-side bench.
- Blocking effect on this folder: no current benchmark here measures Ollama candidates; future Ollama-backed runs will land here once the adapter ships.
<!-- /ANCHOR:pending-decisions -->

<!-- ANCHOR:structure -->
## 4. STRUCTURE

What this folder is and is NOT.

### What this folder IS

- A curated, dated index of code-retrieval bake-offs that have been promoted out of `evidence/` into a stable skill-local location.
- The first place to look for "what is the current code-embedder winner on this stack?"
- The home for `FORMAT.md` (symlinked from `system-spec-kit`), `README.md` (this file), and `benchmark-<YYYY-MM-DD>/` subfolders.

### What this folder is NOT

- A draft scratchpad. In-progress experiments live in the spec packet's `evidence/` until they ship.
- A replacement for spec packets. The full ADR trail, fixture rationale, and rollback context stay in `specs/`.
- A place for single-data-point measurements. Promote here only when there is enough rigor to warrant skill-local visibility.
- A cross-skill performance comparison. Numbers here are valid only against this skill's stack (sbert + CocoIndex hybrid + rerank). Do NOT cross-reference latency or hit-rate numbers with `mk-spec-memory`'s Ollama-backed bench.

### Folder layout (per FORMAT.md)

```
mcp_server/benchmarks/
├── README.md                                  ← This file (index)
├── FORMAT.md                                  ← Symlink to system-spec-kit
└── benchmark-<YYYY-MM-DD>/                    ← One folder per benchmark RUN
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

The format convention itself lives once: [`FORMAT.md`](./FORMAT.md) is symlinked from `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` — edit there, not here.
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

- [`FORMAT.md`](./FORMAT.md) — single-source layout convention (symlinked from system-spec-kit).
- `.opencode/skills/sk-doc/SKILL.md` — markdown documentation standards used by every `benchmark_report.md` and this README.
<!-- /ANCHOR:related -->

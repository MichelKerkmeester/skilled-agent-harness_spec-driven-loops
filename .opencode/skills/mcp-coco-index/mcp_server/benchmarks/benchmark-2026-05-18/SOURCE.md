---
title: "SOURCE — code-embedder bake-off (May 18, 2026)"
description: "Wayfinding pointer from the skill-local benchmark folder to the authoritative spec packet for the May 18, 2026 code-embedder bake-off. Maps each spec-packet file to the questions it answers, and lists the two follow-on packets that close out the arc."
trigger_phrases:
  - "coco-index benchmark source"
  - "bge-code-v1 bake-off source"
  - "code embedder spec pointer"
  - "where is the bake-off evidence"
importance_tier: "important"
contextType: "reference"
---

<!-- ANCHOR:toc -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SPEC PACKET PATH](#2--spec-packet-path)
- [3. WHEN TO READ WHAT](#3--when-to-read-what)
- [4. PACKET FILE MAP](#4--packet-file-map)
- [5. FOLLOW-ON PACKETS](#5--follow-on-packets)
- [6. WHEN TO UPDATE THIS FILE](#6--when-to-update-this-file)
<!-- /ANCHOR:toc -->

# SOURCE — Code-Embedder Bake-Off (May 18, 2026)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This file is a **wayfinding pointer**, not a duplicate of the spec packet. The skill-local folder (`benchmark-2026-05-18/`) carries the curated `benchmark_report.md`, the primary CSV, and the per-probe JSONL — enough to answer the headline questions inside the skill. Deeper questions (full per-probe matrix, daemon-failure forensics, harness internals, ΔΔ vs the prior baseline) live in the spec packet, and this file tells you which packet file to open for which question.

Three rules govern the split:

1. The **spec packet is canonical** — `decision-record.md`, `implementation-summary.md`, and the raw evidence under `evidence/` are the source of truth.
2. The **skill-local curated artifacts** (`benchmark_report.md`, `results.csv`, `per-probe.jsonl`) are evergreen tracking copies that follow the spec packet's headline.
3. **No file rewrites the spec.** This SOURCE.md only redirects.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:source-summary -->
## 2. SOURCE SUMMARY

This benchmark captures an extended bake-off on the CocoIndex code-index stack. The dataset, configuration, and run artifacts are fully described by the files in this folder; the benchmark is reproducible from the captured fixtures, manifests, and scripts. The associated work was completed on May 18, 2026.
<!-- /ANCHOR:spec-packet-path -->

<!-- ANCHOR:when-to-read-what -->
## 3. WHEN TO READ WHAT

Quick map: question -> file. Read the skill-local doc first when one exists; the spec-packet column is the deeper authority.

| Question | Skill-local first | Spec packet authoritative |
|---|---|---|
| Who won, at what hit rate, at what latency? | `benchmark_report.md` §1-§2 | `implementation-summary.md` (What Was Built) |
| Why was the bench run (problem framing)? | `benchmark_report.md` §3 Methodology | `spec.md` (Problem & Purpose, Scope) |
| Full per-probe hit/miss matrix (all 72 rows) | `per-probe.jsonl` (raw) | `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` (same data) |
| Per-embedder profile (RAM / disk / dim / strengths / weaknesses) | `benchmark_report.md` §4 | `benchmark-results.md` (long-form section) |
| Latency percentiles (min / p25 / median / p75 / p95 / max / mean) | `benchmark_report.md` §2-§4 | `benchmark-results.md` |
| Universal floor + ceiling (probes hit by all / missed by all) | (not in skill copy) | `benchmark-results.md` |
| Stella xformers failure analysis + Apple Silicon non-viability | `benchmark_report.md` §5 Process Notes | `implementation-summary.md` (How It Was Delivered, Decisions §D3) |
| Why was the reranker swapped GTE -> BGE? | (not in skill copy) | `implementation-summary.md` (Decisions §D2) |
| Reproducibility / replay command | `benchmark_report.md` §9 | `evidence/run-extended-bake-off-with-hybrid-rerank.sh` (the harness itself) |
| ΔΔ comparison vs the pre-hybrid baseline | (not in skill copy) | `evidence/cocoindex-embedder-comparison-extended.csv` + `runlog.txt` |
| What is still pending after this packet? | `benchmark_report.md` §8 Recommendations | `implementation-summary.md` (Next Steps tiers 1-3) |
| Known limitations (single-run signal, fixture size) | `benchmark_report.md` §7 Caveats | `implementation-summary.md` (Known Limitations) |
<!-- /ANCHOR:when-to-read-what -->

<!-- ANCHOR:packet-file-map -->
## 4. PACKET FILE MAP

Files at the root of `004-extended-bake-off/`:

| File | What it answers |
|---|---|
| `spec.md` | Original packet scope: 4-candidate bake-off with hybrid+rerank defaults ON, fixture reuse from `002-baseline-fixture/`, success criteria, risks. |
| `plan.md` | Approach, harness adaptation strategy, candidate ordering, restore plan. |
| `tasks.md` | Numbered task list (one per candidate + harness work + write-up). |
| `benchmark-results.md` | 11-section deep results document. Full per-probe matrix, per-embedder profiles, latency percentiles, universal floor/ceiling, unique-win breakdown for bge-code-v1, stella xformers analysis, reproducibility section. **This is the long-form sibling of the skill-local `benchmark_report.md`.** |
| `implementation-summary.md` | Completion record + key decisions (D1-D4) + verification checklist + known limitations + tier-ordered next steps. The continuity surface for resumes. |
| `description.json` + `graph-metadata.json` | Spec-kit metadata for memory search and graph traversal. Auto-generated by `generate-context.js`. |

Files under `evidence/`:

| File | What it answers |
|---|---|
| `cocoindex-embedder-comparison-with-hybrid-rerank.csv` | Aggregate, one row per candidate (4 candidates + header). Copied to the skill folder as `results.csv`. |
| `cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` | 72 per-probe rows = 4 embedders x 18 probes. Copied to the skill folder as `per-probe.jsonl`. |
| `runlog-with-hybrid-rerank.txt` | Full bench harness log (~52 min wall on the 2-candidate resumed run). Forensic source for "what did the daemon actually do?" questions. |
| `run-extended-bake-off-with-hybrid-rerank.sh` | The harness script itself. Adaptable for future bench runs; cited from the reproducibility section. |
| `cocoindex-embedder-comparison-extended.csv` + `.jsonl` | Prior 3-candidate baseline (no hybrid+rerank). Useful for ΔΔ comparisons against the hybrid+rerank-on numbers. |
| `runlog.txt` | Pre-hybrid baseline runlog. |
| `run-extended-bake-off.sh` | Pre-hybrid harness (kept for ΔΔ reproducibility). |
<!-- /ANCHOR:packet-file-map -->

<!-- ANCHOR:follow-on-packets -->
## 5. FOLLOW-ON PACKETS

The bake-off shipped a clear single-run winner (bge-code-v1 at 11/18 = 61.1%), but did not promote it as the production default. Two follow-on packets close out the arc under `016/007-ollama-and-bge-promotion-arc/`.

> **Note on numbering.** A parallel session renumbered the umbrella from `013-ollama-and-bge-promotion-arc/` to `007-ollama-and-bge-promotion-arc/` on May 18, 2026. Always use `007/...` paths.

### `016/007/003-bge-code-v1-confirmation-and-promote/`

**Status:** Planned (May 18, 2026). Level 2. Power-dependent (~3-4 hours wall).

**What is pending:** Run the 4-candidate harness three independent times against the same fixture. Track per-candidate variance (min / median / max hit rate across 3 runs). Decision rule:

- **PROMOTE** if bge-code-v1's min hit rate >= 10/18 and median >= 10/18: edit `cocoindex_code/config.py:11` (`_DEFAULT_MODEL`), reorder `registered_embedders.py:54-62` (mark bge-code-v1 as DEFAULT), and update `INSTALL_GUIDE.md`, `feature_catalog/`, and `CHANGELOG.md` in a single coherent commit.
- **HOLD** at jina-code if any of 3 runs drops to 9/18 or below. Document the decision with the run data so future re-promotion attempts have a baseline to beat.

**Trigger to run:** operator schedules a plugged-in 3-4 hour block; daemon is healthy (no LMDB wedge); no concurrent bench load on the machine. This packet is the gating signal for whether the May 18, 2026 result becomes the new production default.

### `016/007/002-cocoindex-ollama-adapter/`

**Status:** Planned (May 18, 2026). Level 2. Implementation packet.

**What is pending:** Add Ollama provider support to CocoIndex's embedder registry (today `MANIFESTS` is sbert-only). Verify whether `config.py` + `indexer.py` can route to LiteLLM's Ollama provider as-is, or whether a new adapter under `cocoindex_code/embedders/` is required. Register at least one Ollama embedder (e.g., `ollama/nomic-embed-text`), gate it with `requires_ollama_daemon=True`, and smoke-test end-to-end indexing + search. Update `INSTALL_GUIDE.md` with the Ollama setup section and `feature_catalog/` with an Ollama adapter entry.

**Trigger to run:** independent of `007/003`. Unblocks Ollama-backed candidates for future bake-offs (out of scope of this packet, deferred to a follow-on). Sibling skill `mk-spec-memory` already has a working Ollama adapter on the TypeScript side (`lib/embedders/adapters/ollama.ts`); this packet is the Python-side equivalent.
<!-- /ANCHOR:follow-on-packets -->

<!-- ANCHOR:when-to-update -->
## 6. WHEN TO UPDATE THIS FILE

- The spec packet is renamed or moved -> update §2 "Spec Packet Path" and any path references in §4 / §5.
- A new file lands in the spec packet that changes a "When to read what" answer -> update §3 and §4.
- One of the follow-on packets ships -> move its row in §5 from "Planned" to a one-line completion marker pointing at the relevant `implementation-summary.md`. If `016/007/003` PROMOTES, also note the production-default change here.
- New ADRs land in the packet's `decision-record.md` (none currently) -> reference them in §3 with the question they answer.
- Last updated: May 18, 2026 (initial expansion into a wayfinding doc).
<!-- /ANCHOR:when-to-update -->

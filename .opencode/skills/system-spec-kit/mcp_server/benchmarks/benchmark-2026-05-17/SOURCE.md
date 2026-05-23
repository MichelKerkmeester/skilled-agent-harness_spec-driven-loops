---
title: "SOURCE — May 17, 2026 text-embedder bake-off"
description: "Wayfinding pointer to the authoritative spec packet for the May 17, 2026 mk-spec-memory text-embedder bake-off. Maps the benchmark question you have to the evidence file that answers it."
trigger_phrases:
  - "text-embedder bake-off source"
  - "spec memory bake-off spec packet"
  - "jina v3 bake-off pointer"
  - "016/004 embedder bake-off pointer"
importance_tier: "important"
contextType: "reference"
---

# SOURCE — May 17, 2026 text-embedder bake-off

> Pointer to the authoritative spec packet that owns the May 17, 2026 `mk-spec-memory` text-embedder bake-off. The skill-local folder you are reading is curated. The spec packet is the audit trail.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SPEC PACKET LOCATION](#2--spec-packet-location)
- [3. PACKET STRUCTURE AT A GLANCE](#3--packet-structure-at-a-glance)
- [4. WHEN TO READ WHAT](#4--when-to-read-what)
- [5. EVIDENCE FILE MAP](#5--evidence-file-map)
- [6. FOLLOW-ON PACKETS](#6--follow-on-packets)
- [7. WHEN TO UPDATE THIS FILE](#7--when-to-update-this-file)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What this file is

A wayfinding doc. It does not duplicate the spec packet content. It tells you which file in the spec packet to open for which question, so that you do not have to scan all seventeen evidence files when you only need one.

### What lives in the spec packet, not here

- The full ADR trail (ADR-001 through ADR-012) covering five pure-dense embedder rollbacks, the cat-24/409 fixture audit, the retrieval-rescue layer cost-benefit sweep, and the production ratification of `jina-embeddings-v3` plus rescue.
- Methodology details and fixture surgery notes (the cat-24/409 audit that turned a runtime random sampler into a deterministic ten-pair fixture).
- Per-embedder rollback rationale, including manifest cap discovery, context-window failures, and adapter wiring fixes.
- The retrieval-rescue layer cost-benefit sweep (ADR-010 and ADR-011) and the 008 PASS-sample preservation proxy.
- Packet 008 closure narrative (cat-24/409 reached eight out of ten top-3 hits under rescue ON).

### What lives in this folder, curated

- `benchmark_report.md` — the headline summary with the ten-section structure from `FORMAT.md`.
- `runtime-measurements.md` — live RAM, Metal residency, and inference-latency snapshot for the three finalists.
- `results.csv` — one row per candidate, headline metrics, verdict.
- `per-probe-with-rescue.jsonl` — final three rows with rescue ON.
- `SOURCE.md` — this file.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:source-summary -->
## 2. SOURCE SUMMARY

This benchmark captures a six-embedder bake-off on the spec-memory dataset alongside retrieval-stage work. The dataset and configuration are fully described by the artifacts in this folder; the benchmark is self-contained and reproducible from the captured fixtures, manifests, and scripts.

<!-- /ANCHOR:source-summary -->

---

<!-- ANCHOR:packet-structure-at-a-glance -->
## 3. PACKET STRUCTURE AT A GLANCE

```text
004-spec-memory-embedder-bake-off/
  spec.md                          — scope, success criteria, status
  plan.md                          — execution plan (six-embedder sweep + rescue layer)
  tasks.md                         — task breakdown with completion evidence
  checklist.md                     — verification checklist
  decision-record.md               — ADR-001 through ADR-012 (the audit trail)
  implementation-summary.md        — end-to-end build narrative
  benchmark-results.md             — packet-local headline doc (parallel to this folder's benchmark_report.md)
  description.json                 — memory-search metadata
  graph-metadata.json              — graph-traversal metadata
  evidence/
    INDEX.md                       — per-evidence-file navigation (read this first)
    embedder-comparison.csv        — pre-rescue raw scores across six embedders
    embedder-comparison-with-rescue.jsonl
                                   — final three rows with rescue ON (basis for ADR-012)
    cat-24-rerun.jsonl             — per-pair top-3 data across six embedders + fixture revisions
    cat-24-409-audit.md            — fixture audit and surgery recommendations
    swap-benchmark.csv             — wall-clock for each embedder swap job
    d-sample-30.json               — 30-scenario stratified sample composition
    d-rescue-on-vs-off.jsonl       — per-scenario rescue ON vs OFF rows
    d-rescue-layer-cost-benefit.md — aggregate verdict for the rescue layer
    008-pass-sample-rerun.jsonl    — 50-scenario regression check with rescue default-on
    corpus-hygiene-cleanup.md      — orphan-row prune + fixture-version notes
    jina-runtime-measurements.md   — live RAM / Metal / latency for the three finalists
    ollama-direct-embed-probe.txt  — earlier per-model probe outputs
    mxbai-swap-status.json         — first-swap snapshot (mxbai 2/10 FAIL)
    mcp-notes-drift-audit.md       — MCP-config JSON sweep
    baseline-disk.txt              — disk snapshot before the mxbai failure
    post-failure-disk.txt          — disk snapshot after the mxbai failure
    baseline-process.txt           — process-tree snapshot before
    post-failure-process.txt       — process-tree snapshot after
```

The packet is Level 3 by content (twelve ADRs, multi-day execution, fixture surgery), but the navigation entry point is `evidence/INDEX.md`.

<!-- /ANCHOR:packet-structure-at-a-glance -->

---

<!-- ANCHOR:when-to-read-what -->
## 4. WHEN TO READ WHAT

Match the question you have to the file that answers it. Start at the top.

### Headline questions

| Question | Open this first | Backup |
|---|---|---|
| Which embedder won? | `decision-record.md` ADR-012 | `evidence/embedder-comparison-with-rescue.jsonl` |
| Is the production default safe to ship? | `implementation-summary.md` | `decision-record.md` ADR-010, ADR-011, ADR-012 |
| Did packet 008 close? | `decision-record.md` ADR-010 | `evidence/008-pass-sample-rerun.jsonl` |
| What changed at runtime? | `runtime-measurements.md` (this folder) | `evidence/jina-runtime-measurements.md` |

### Methodology questions

| Question | Open this first | Backup |
|---|---|---|
| What fixture was used and why? | `decision-record.md` ADR-009 | `evidence/cat-24-409-audit.md` |
| How was the 30-scenario sample picked? | `evidence/d-sample-30.json` | `decision-record.md` ADR-011 |
| What is the rescue layer doing? | `decision-record.md` ADR-010 | `mcp_server/tests/retrieval-rescue.vitest.ts` in the repo |
| Why was the corpus pruned? | `evidence/corpus-hygiene-cleanup.md` | `decision-record.md` ADR-009 |

### Per-embedder questions

| Question | Open this first | Backup |
|---|---|---|
| Why did mxbai fail? | `decision-record.md` ADR-001 through ADR-004 | `evidence/mxbai-swap-status.json` |
| Why did Jina v3 win? | `decision-record.md` ADR-012 | `evidence/embedder-comparison-with-rescue.jsonl` |
| What did Nomic score? | `decision-record.md` ADR-006, ADR-012 | `evidence/cat-24-rerun.jsonl` |
| Did bge-m3 or Snowflake regress? | `decision-record.md` ADR-007, ADR-008 | `evidence/embedder-comparison.csv` |

### Cost and latency questions

| Question | Open this first | Backup |
|---|---|---|
| Is the rescue layer worth the latency? | `evidence/d-rescue-layer-cost-benefit.md` | `decision-record.md` ADR-011 |
| What does Jina cost at runtime? | `runtime-measurements.md` (this folder) | `evidence/jina-runtime-measurements.md` |
| How long does a re-index take? | `evidence/swap-benchmark.csv` | `decision-record.md` ADR-012 tradeoffs |

<!-- /ANCHOR:when-to-read-what -->

---

<!-- ANCHOR:evidence-file-map -->
## 5. EVIDENCE FILE MAP

This mirrors the spec packet's `evidence/INDEX.md` for skill-local convenience. Use this column when you are inside the skill tree and do not want to leave it.

### Embedder comparison and leaderboard

| File | What |
|---|---|
| `evidence/embedder-comparison.csv` | Per-embedder baseline scores across six embedders, no rescue layer. |
| `evidence/embedder-comparison-with-rescue.jsonl` | Final three rows with rescue ON; basis for ADR-012. |
| `evidence/cat-24-rerun.jsonl` | Per-pair top-3 data across six embedders and fixture revisions. |
| `evidence/cat-24-409-audit.md` | Fixture audit and surgery recommendations. |
| `evidence/swap-benchmark.csv` | Wall-clock for each embedder swap job. |

### Rescue layer cost and benefit

| File | What |
|---|---|
| `evidence/d-sample-30.json` | 30-scenario stratified sample composition. |
| `evidence/d-rescue-on-vs-off.jsonl` | Per-scenario rows: rescue ON vs OFF, top-3 hits and latency. |
| `evidence/d-rescue-layer-cost-benefit.md` | Aggregate verdict; ON closes cat-24/409 with measured 2.16x latency. |
| `evidence/008-pass-sample-rerun.jsonl` | 50-scenario regression check with rescue default-on. |

### Runtime measurements

| File | What |
|---|---|
| `evidence/jina-runtime-measurements.md` | Live RAM, Metal residency, and inference-latency snapshot for the three finalists. |
| `evidence/ollama-direct-embed-probe.txt` | Earlier per-model probe outputs. |
| `evidence/baseline-disk.txt`, `evidence/post-failure-disk.txt` | Disk-usage snapshots around the mxbai failure. |
| `evidence/baseline-process.txt`, `evidence/post-failure-process.txt` | Process-tree snapshots around the mxbai failure. |

### Closure of 008 cat-24/409

| File | What |
|---|---|
| `evidence/corpus-hygiene-cleanup.md` | Orphan-row prune and fixture-version notes. |
| `evidence/mxbai-swap-status.json` | First-swap snapshot, mxbai 2/10 FAIL (ADR-001 ROLLBACK). |
| `evidence/mcp-notes-drift-audit.md` | MCP-config JSON sweep, tool count 39 to 42 plus embedder layer. |

<!-- /ANCHOR:evidence-file-map -->

---

<!-- ANCHOR:follow-on-narrative -->
## 6. FOLLOW-ON NARRATIVE

Adversarial review, promotion to production, and CocoIndex-side activation evidence are captured in their respective benchmark folders and in the cross-cutting embedder-pluggability narrative at `.opencode/skills/system-spec-kit/references/embedder-pluggability.md`.

<!-- /ANCHOR:follow-on-narrative -->

---

<!-- ANCHOR:when-to-update-this-file -->
## 7. WHEN TO UPDATE THIS FILE

- The spec packet gets renamed or moved. Update `Spec packet location` and the file map.
- New ADRs land. Bump the ADR range mentioned in the overview and add rows to `When to read what`.
- A follow-on packet gets renumbered. Replace the stale numeric prefix everywhere in `Follow-on packets`.
- An evidence file is added or fundamentally revised. Mirror the change in `Evidence file map` and bump the `Last updated` line.

### Last updated

May 18, 2026, after the `004-mxbai-swap-and-008-closure` to `004-spec-memory-embedder-bake-off` rename and the `013` to `007` follow-on renumber.

<!-- /ANCHOR:when-to-update-this-file -->

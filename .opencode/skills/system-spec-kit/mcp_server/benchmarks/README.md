---
title: "mk-spec-memory — benchmarks index"
description: "Index of curated, skill-local benchmark runs for the mk-spec-memory MCP server. One dated folder per benchmark run. Authoritative spec packets live under .opencode/specs/."
trigger_phrases:
  - "spec memory benchmarks"
  - "mk-spec-memory benchmark index"
  - "spec memory bake-off index"
  - "skill local benchmarks"
importance_tier: "important"
contextType: "reference"
---

# mk-spec-memory — benchmarks index

> Curated, skill-local record of benchmark runs for the `mk-spec-memory` MCP server. One dated folder per run. The authoritative audit trail lives in the spec packet linked from each row.

---

## 1. OVERVIEW

### Skill identification

| Field | Value |
|---|---|
| Skill | `system-spec-kit` |
| MCP server | `mk-spec-memory` |
| Stack | TypeScript, Node, Ollama, ollama |
| Folder root | `.opencode/skills/system-spec-kit/mcp_server/benchmarks/` |

### Purpose of this folder

This folder is the skill-local entry point for "which embedder, retrieval policy, or scoring change won, on which fixture, when?" Each `benchmark-<YYYY-MM-DD>/` subfolder is a curated copy of one benchmark run, with the headline metrics and ADR pointers visible directly inside the skill. Engineers reading the MCP server code should find the answer here without leaving the skill tree.

The folder is curated, not raw. Drafts and in-progress evidence live in the originating spec packet's `evidence/` directory until they ship. See Sections 3, 5, and 6 for the boundary rules and promotion flow.

---

## 2. ACTIVE BENCHMARKS

One row per dated folder. Sorted newest first.

| Date | Bench | Winner | Status | Spec packet |
|---|---|---|---|---|
| May 20, 2026 | [`benchmark-2026-05-20/`](./benchmark-2026-05-20/) | `nomic-embed-text-v1.5` (ADR-013) re-bench: 9/10 top-1 ID-match (regenerated fixture, Z_SCORE_THRESHOLD tuned 1.5 -> 1.3, shared harness, embedding_cache reset), median 1071 ms, p95 2627 ms | PASS, matches May 17 baseline at stricter top-1 | `.opencode/specs/.../002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table/` through `019-lineage-and-metadata-repair-runner/` |
| May 17, 2026 | [`benchmark-2026-05-17/`](./benchmark-2026-05-17/) | `jina-embeddings-v3` + retrieval-rescue layer (9/10 cat-24/409) | SHIPPED (ADR-012) | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/` |

Open each folder's `benchmark_report.md` for the full headline, methodology, per-candidate profile, and reproducibility instructions. Open `SOURCE.md` for the spec-packet pointer.

---

## 3. WHAT THIS FOLDER IS AND IS NOT

### What this folder IS

- A curated, skill-local record of benchmark runs that have already shipped.
- The first place a future engineer should look when asking "which embedder is the production default and why."
- A pointer-rich index back to the spec packet that owns the full audit trail.
- The home of the convention defined in `.opencode/skills/sk-doc/references/benchmark_creation.md` (canonical mechanics live at that path).

### What this folder is NOT

- It is **not** the authoritative audit trail. ADRs, fixture rationale, and rollback history live in the spec packet under `.opencode/specs/`.
- It is **not** a draft area. In-progress experiments stay in the spec packet's `evidence/` directory until they ship.
- It is **not** a place for single-data-point measurements. Promote only when there is enough rigor to warrant skill-local visibility.
- It is **not** a place to cross-reference numbers with sibling MCP benchmarks. Stack differences (TypeScript and Ollama here versus Python and `sentence-transformers` in CocoIndex) make cross-stack numeric comparisons unsafe. See Section 4.

### Authority hierarchy

When skill-local doc and spec packet disagree:

1. Spec packet `decision-record.md` and `implementation-summary.md` are source of truth.
2. Skill-local `benchmark_report.md` is a curated summary that tracks the spec packet's headline.
3. `results.csv` and `per-probe-*.jsonl` files are direct copies and carry the same authority as the spec-packet originals.

---

## 4. SIBLING SKILL BENCHMARKS

Other MCP servers in this repo maintain their own skill-local benchmark folders. The convention is identical; the data is not interchangeable.

| Skill | Path | Stack |
|---|---|---|
| `mcp-coco-index` | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/` | Python, `sentence-transformers` |

Do not cross-reference latency or recall numbers between `mk-spec-memory` and `mcp-coco-index` runs. The quantization, runtime, fixture, and corpus shape differ. Each skill's benchmark report calls this out in its own Caveats section.

---

## 5. ADDING A NEW BENCHMARK

The flow assumes the bench has already completed inside a spec packet.

1. **Confirm the spec packet has shipped.** ADRs accepted, `implementation-summary.md` updated, evidence files present.
2. **Create the dated subfolder:** `benchmark-<YYYY-MM-DD>/` using the bench execution date, not the doc authoring date.
3. **Copy raw artifacts** from the spec packet's `evidence/` directory:
   - `results.csv` (one row per candidate, headline metrics, verdict)
   - `per-probe-*.jsonl` (per-query rows) when the bench produced per-probe data
   - `runtime-measurements.md` when there is a meaningful runtime profile worth promoting
4. **Write [`SOURCE.md`](./benchmark-2026-05-17/SOURCE.md)** as a thin pointer to the spec packet. Include the spec packet path, the list of key files inside it, and a "last updated" date.
5. **Write `benchmark_report.md`** following `.opencode/skills/sk-doc/references/benchmark_creation.md`. The required 10-section structure is:
   1. Overview and headline
   2. Aggregate results
   3. Methodology
   4. Per-candidate profiles
   5. Process notes
   6. Findings
   7. Caveats
   8. Recommendations
   9. Reproducibility
   10. Related resources
6. **Add a row to the table in Section 2 of this README** with the date, folder link, winner, status, and spec-packet path.
7. **Validate** with `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file>` for the report and this README. Fix any blocking issues.
8. **Disambiguate same-day runs** by suffixing a topic slug: `benchmark-<YYYY-MM-DD>-<slug>/`. Otherwise keep the pure-date name.

---

## 6. RE-RUNNING AN EXISTING BENCHMARK

A re-run that does not change the headline does not need a new dated folder. Update the existing `benchmark_report.md` instead.

1. **Re-run inside the spec packet** with the same fixture and methodology.
2. **If the headline is unchanged**, add a `Re-run YYYY-MM-DD` section to the existing report. State the date, the candidate, the measurement window, and the result. Update the report's frontmatter `description` only if the summary line changes.
3. **If the headline flips**, treat the re-run as a new bench. Open a new spec packet, ship it, and promote a new `benchmark-<YYYY-MM-DD>/` folder per Section 5.
4. **CSV and JSONL artifacts** should be appended or replaced to match the new evidence. Do not delete historical rows; mark them with a `Re-run` note in the report.

The bake-off promotion flow is documented in Section 6 of `.opencode/skills/sk-doc/references/benchmark_creation.md`.

---

## 7. RELATED RESOURCES

### Skill-local

| File | Purpose |
|---|---|
| `benchmark_creation.md` | Convention every dated subfolder follows. Canonical mechanics at `.opencode/skills/sk-doc/references/benchmark_creation.md`. |
| [`benchmark-2026-05-17/benchmark_report.md`](./benchmark-2026-05-17/benchmark_report.md) | The May 17, 2026 mk-spec-memory text-embedder bake-off report. |
| [`benchmark-2026-05-17/SOURCE.md`](./benchmark-2026-05-17/SOURCE.md) | Pointer to the May 17, 2026 spec packet. |

### Tracking and authoritative spec

| Path | Why |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format/` | Sub-phase tracking this skill-local benchmarks format convention. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/` | Authoritative spec packet for the May 17, 2026 bake-off (ADR-001 through ADR-012, implementation summary, evidence). |

### Sibling skill

| Path | Stack |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/` | Code-side bake-offs for the `mcp-coco-index` MCP server. Same format, different stack, non-comparable numbers. |

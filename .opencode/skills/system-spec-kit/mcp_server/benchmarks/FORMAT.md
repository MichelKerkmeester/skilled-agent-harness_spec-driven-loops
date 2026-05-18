---
title: "benchmarks/ folder format convention"
description: "Canonical format convention for skill-local MCP benchmark folders. Defines layout, naming, the ten-section benchmark_report.md structure, the promotion workflow from spec packet to skill, and authority hierarchy. Single source; symlinked across MCP skills."
trigger_phrases:
  - "benchmarks format convention"
  - "skill local benchmarks format"
  - "benchmark folder layout"
  - "benchmark_report.md structure"
  - "mcp benchmark promotion workflow"
importance_tier: "important"
contextType: "reference"
---

# `benchmarks/` folder format convention (mk-spec-memory and cross-MCP)

> Canonical layout for skill-local benchmark folders. Applies to every MCP server in this repo: ours (`mk-spec-memory`, `mk-skill-advisor`, `mk-code-index`) and forks (`mcp-coco-index`). One source of truth; symlinked into sibling skills. The goal: when an engineer asks "which embedder won? what fixture? when?" they find the answer inside the skill tree without hunting through `specs/`.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. LAYOUT](#2--layout)
- [3. DATE AND NAMING CONVENTION](#3--date-and-naming-convention)
- [4. FILE PURPOSE](#4--file-purpose)
- [5. BENCHMARK REPORT EXAMPLE](#5--benchmark-report-example)
- [6. PROMOTION WORKFLOW](#6--promotion-workflow)
- [7. WHEN NOT TO ADD A BENCHMARK](#7--when-not-to-add-a-benchmark)
- [8. AUTHORITY HIERARCHY](#8--authority-hierarchy)
- [9. FAQ AND EDGE CASES](#9--faq-and-edge-cases)
- [10. VERSION HISTORY](#10--version-history)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Scope

This convention applies to every MCP server folder of shape `<skill>/mcp_server/benchmarks/`. The format is identical across skills so an engineer moving between `mk-spec-memory` and `mcp-coco-index` does not have to relearn the layout. The actual numeric data is **not** comparable across skills (different stacks, different fixtures); each skill's report flags that in its Caveats section.

### Single source

This file is the single source of truth. It lives in `system-spec-kit/mcp_server/benchmarks/FORMAT.md` and is symlinked into sibling MCP skill folders. Edit it here, not in the symlink target.

### Core principle

Skill-local benchmark folders are **curated entry points**. The full audit trail (ADRs, fixture surgery, rollback history) stays in the spec packet under `.opencode/specs/`. The skill-local folder gives a future engineer a fast answer plus a pointer back to the packet.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:layout -->
## 2. LAYOUT

```text
mcp_server/benchmarks/
├── README.md                                  ← Index of all benchmarks here (sk-doc compliant)
├── FORMAT.md                                  ← This file (single source — symlinked across skills)
└── benchmark-<YYYY-MM-DD>/                    ← One folder per benchmark RUN, ISO date for sort
    ├── benchmark_report.md                    ← THE detailed report (sk-doc compliant)
    ├── results.csv                            ← Primary aggregate (one row per candidate)
    ├── per-probe.jsonl                        ← Per-query / per-probe data (when applicable)
    ├── runtime-measurements.md                ← Optional: RAM / GPU / latency profile
    └── SOURCE.md                              ← Pointer to authoritative spec packet
```

### Required vs optional files

| File | Required | Note |
|---|---|---|
| `README.md` (folder root) | Yes | Index of all benchmarks in the folder. |
| `FORMAT.md` (folder root) | Yes | This file. Symlinked from sibling skills. |
| `benchmark-<YYYY-MM-DD>/` | One per bench | Dated subfolder for each promoted run. |
| `benchmark_report.md` | Yes inside each dated folder | Ten-section structure (see Section 4 and Section 5). |
| `results.csv` | Yes inside each dated folder | Aggregate metrics, one row per candidate. |
| `per-probe.jsonl` | When applicable | Per-query rows; skip for summary-only benches. |
| `runtime-measurements.md` | Optional | Include only when a runtime profile is worth promoting. |
| `SOURCE.md` | Yes inside each dated folder | Pointer back to the authoritative spec packet. |

<!-- /ANCHOR:layout -->

---

<!-- ANCHOR:date-and-naming-convention -->
## 3. DATE AND NAMING CONVENTION

### Date formats

- **Folder names** use ISO format `YYYY-MM-DD`. This sorts cleanly chronologically.
- **In-doc prose** uses the long form, for example "May 18, 2026". Easier to read.
- Always cite the date the bench was **executed**, not when the doc was written.

### Disambiguation

If two benchmarks ran on the same date and need disambiguation, suffix with a topic slug: `benchmark-2026-05-18-bge-confirmation/`. Otherwise keep the pure-date name.

### Slug rules

Use lowercase, hyphen-separated, no underscores in folder names. Keep slugs short (one to four tokens). Examples: `benchmark-2026-05-17/`, `benchmark-2026-05-18-bge-confirmation/`, `benchmark-2026-06-01-reranker-sweep/`.

<!-- /ANCHOR:date-and-naming-convention -->

---

<!-- ANCHOR:file-purpose -->
## 4. FILE PURPOSE

### `benchmark_report.md`

The structured, comprehensive report — written to sk-doc standards. Required sections, in order:

1. **Headline** — one-line winner plus key metric, prominently at top.
2. **Aggregate Results** — one row per candidate, headline metrics plus verdict.
3. **Methodology** — fixture, sample size, pipeline (rescue, rerank, hybrid?), environment.
4. **Per-Candidate Profiles** — RAM, disk, dim, release, strengths, weaknesses.
5. **Process Notes** — what was tried, what failed, why.
6. **Findings** — including unique wins, universal floor and ceiling, mismatch analysis.
7. **Caveats** — single-run signal, fixture limits, stack-level confounds, schema migration cost.
8. **Recommendations** — Tier 1 (apply now) / Tier 2 (validate first) / Tier 3 (future).
9. **Reproducibility** — exact replay commands plus expected wall-clock.
10. **Cross-Links** — sibling MCP benchmarks, authoritative spec packet, follow-on packets.

The ten-section order is fixed. Do not reorder, merge, or skip. Tone: same care as a sk-doc skill reference. Do not paste raw evidence — curate. Do not duplicate the spec packet's full ADR trail — cross-link.

### `results.csv`

One row per candidate. Columns vary by topic but include at minimum:

- Candidate name or model id.
- Primary quality metric (hit rate, top-k recall, jaccard, etc.).
- Median and p95 latency in ms.
- Verdict (`PROMOTE` / `ROLLBACK` / `BASELINE` / `WINNER`).

Re-runnable: a future engineer looking only at the CSV should grok the comparison.

### `per-probe.jsonl`

One JSON row per probe across all candidates. Use for: per-probe hit matrix reconstruction, latency analysis, unique-wins. Skip if the bench is summary-only.

### `runtime-measurements.md`

Optional. Drop in if there is a meaningful runtime profile worth promoting from the spec packet (RAM, VRAM, Metal residency, cold-load time, raw inference latency). Otherwise omit. Follow the ten-section pattern in `benchmark_report.md` adapted for runtime data; see `benchmark-2026-05-17/runtime-measurements.md` for a worked example.

### `SOURCE.md`

Wayfinding pointer file:

- Path to the spec packet.
- Why look there (full ADR trail, fixture rationale, deeper history).
- A "when to read what" navigation map for the spec packet's evidence files.
- Last-updated date and rename or renumber notes.

Lets the skill-local view stay lean while the spec packet preserves the audit trail.

<!-- /ANCHOR:file-purpose -->

---

<!-- ANCHOR:benchmark-report-example -->
## 5. BENCHMARK REPORT EXAMPLE

A real snippet showing the first three required sections in the May 17, 2026 mk-spec-memory bake-off shape. Use this as a template for new reports.

### Sections 1 to 3, in pattern

```markdown
---
title: "Text-embedder bake-off — May 17, 2026"
description: "Six-embedder bake-off plus retrieval-rescue layer cost-benefit. Production verdict: jina-embeddings-v3 plus rescue. Closes packet 008 cat-24/409 at 9/10."
trigger_phrases:
  - "text embedder bake-off"
  - "jina v3 vs nomic vs gemma"
  - "spec memory bake-off"
importance_tier: "important"
contextType: "reference"
---

# Text-embedder bake-off — May 17, 2026

> Headline: `jina-embeddings-v3` + retrieval-rescue layer is the production default for `mk-spec-memory`.
> 9/10 cat-24/409 top-3 hits, 893 ms median, 1465 ms p95. Closes packet 008.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. HEADLINE](#1--headline)
- [2. AGGREGATE RESULTS](#2--aggregate-results)
- [3. METHODOLOGY](#3--methodology)
... (sections 4 through 10)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:headline -->
## 1. HEADLINE

`jina-embeddings-v3` + retrieval-rescue layer (default-on) wins by recall and latency.

| Metric | Value |
|---|---|
| Winner | `jina-embeddings-v3` |
| Pipeline | retrieval-rescue layer default-on |
| cat-24/409 top-3 | 9/10 |
| Median latency | 893 ms |
| p95 latency | 1465 ms |
| Spec packet | `004-spec-memory-embedder-bake-off` |
| Decision | ADR-012 |

<!-- /ANCHOR:headline -->

---

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

| Embedder | Dim | cat-24/409 top-3 | Median ms | p95 ms | Verdict |
|---|---:|---:|---:|---:|---|
| `jina-embeddings-v3` | 1024 | 9/10 | 893 | 1465 | WINNER |
| `nomic-embed-text-v1.5` | 768 | 8/10 | 922 | 3045 | RUNNER-UP |
| `embeddinggemma-300m` | 768 | 7/10 | 787 | 936 | BASELINE |
| `bge-m3` | 1024 | 2/10 | — | — | ROLLBACK |
| `snowflake-arctic-embed-l-v2.0` | 1024 | 1/10 | — | — | ROLLBACK |
| `mxbai-embed-large-v1` | 1024 | 2/10 | — | — | ROLLBACK |

All three top rows measured with rescue layer ON. ROLLBACK rows measured without rescue (rescue not relevant after rollback decision).

<!-- /ANCHOR:aggregate-results -->

---

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

### Fixture

- Primary gate: cat-24/409, a deterministic ten-pair trigger-phrase fixture pinned at `manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json`.
- Cost-benefit sweep: 30-scenario stratified sample across cat-13, cat-14, cat-15, cat-16, cat-17, cat-24, and cat-25/03/04. Composition recorded in `evidence/d-sample-30.json`.
- Regression check: 50-scenario 008 PASS-sample preservation proxy.

### Pipeline

Retrieval pipeline = dense embedder + optional retrieval-rescue layer (Path B trigger-lane weighting + Path C sibling backfill). Toggle via `SPECKIT_RERANK_LAYER=true|false`. Default ON after ADR-011.

### Environment

Apple Silicon, Ollama with Metal backend, single-host single-corpus run. Corpus size after orphan prune: 7491 active memory rows.

<!-- /ANCHOR:methodology -->
```

Subsequent sections (4 through 10) follow the same pattern: H2 numbered headers, ALL CAPS section names, ANCHOR comments, tables for data, code blocks for verbatim commands or outputs. Each section gets its own slug; slugs are stable across revisions so deep links keep working.

<!-- /ANCHOR:benchmark-report-example -->

---

<!-- ANCHOR:promotion-workflow -->
## 6. PROMOTION WORKFLOW

The skill-local folder is the curated copy. Promotion happens after the bench has shipped in a spec packet.

1. **Bench completes in a spec packet** under `specs/.../evidence/`.
2. **Spec packet's `benchmark-results.md` is written and reviewed**, and the relevant ADRs are accepted.
3. **Curated copy promoted here** under `benchmark-<YYYY-MM-DD>/` with the layout from Section 2.
4. **CSV and JSONL files are direct copies** of spec-packet evidence; they carry the same authority as the originals.
5. **`benchmark_report.md` is a curated summary**. It references the spec packet for ADR weight; it does not replace the audit trail.
6. **Add a row** to the `README.md` index in `mcp_server/benchmarks/README.md`.
7. **Validate** every authored markdown file with `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file>` and fix any blocking issues.

### Where each artifact comes from

| Skill-local file | Source in spec packet |
|---|---|
| `benchmark_report.md` | Curated rewrite of `benchmark-results.md`. |
| `results.csv` | Copy of `evidence/embedder-comparison*.csv` (or topic equivalent). |
| `per-probe.jsonl` | Copy of `evidence/*-with-rescue.jsonl` or per-probe equivalent. |
| `runtime-measurements.md` | Curated rewrite of `evidence/*-runtime-measurements.md` when present. |
| `SOURCE.md` | Authored fresh; points back to the spec packet. |

<!-- /ANCHOR:promotion-workflow -->

---

<!-- ANCHOR:when-not-to-add-a-benchmark -->
## 7. WHEN NOT TO ADD A BENCHMARK

- **In-progress experiments.** Drafts live in the spec packet's `evidence/` directory until they ship.
- **Single-data-point measurements.** Promote only when there is enough rigor to warrant skill-local visibility.
- **Re-runs that do not change the headline.** Update the existing `benchmark_report.md` with a `Re-run YYYY-MM-DD` section instead of creating a new dated folder. See Section 9.
- **Cross-skill comparisons.** Do not promote a run that mixes data from `mk-spec-memory` and `mcp-coco-index`. Each skill keeps its own folder; cross-stack numbers are not comparable.
- **Speculative or hypothesis-only runs.** If the spec packet has not accepted an ADR yet, the bench is not ready to promote.

<!-- /ANCHOR:when-not-to-add-a-benchmark -->

---

<!-- ANCHOR:authority-hierarchy -->
## 8. AUTHORITY HIERARCHY

When skill-local doc and spec packet disagree:

1. **Spec packet `decision-record.md` and `implementation-summary.md`** — source of truth.
2. **Skill-local `benchmark_report.md`** — curated summary that tracks the spec packet's headline.
3. **CSV and JSONL files** — direct copies; same authority as the spec packet originals.

### Intentional design

The spec packet has the full audit trail (twelve-plus ADRs, fixture surgery, rollback rationale). The skill-local view is the "look here first" entry point for someone in the MCP code. The two layers serve different readers; both stay in sync via `SOURCE.md` pointers and the promotion workflow.

<!-- /ANCHOR:authority-hierarchy -->

---

<!-- ANCHOR:faq-and-edge-cases -->
## 9. FAQ AND EDGE CASES

### Q1. Two benchmarks ran on the same date. What do I name the folders?

Suffix each with a short topic slug after the date: `benchmark-2026-05-18-bge-confirmation/` and `benchmark-2026-05-18-reranker-sweep/`. Keep slugs lowercase, hyphenated, one to four tokens. Update the `README.md` index with both rows.

### Q2. The topic of an old benchmark was retired. Do I delete the folder?

No. Keep the folder. Update the row in `README.md` index with status `RETIRED` plus the date. Update the dated folder's `benchmark_report.md` with a `Retirement note` section at the top stating the date, the reason, and the replacement bench (if any). Historical data stays accessible for audit and regression-check purposes.

### Q3. The spec packet got renumbered or renamed. What do I update?

- Update the path in `SOURCE.md` Section "Spec packet location".
- Update any cross-link tables in `benchmark_report.md`, `runtime-measurements.md`, and `README.md`.
- Add a "rename note" line under `SOURCE.md` "Last updated" stating the old slug, the new slug, and the date.
- Do not rename the skill-local dated folder. The skill-local folder is named by **bench execution date**, not by spec-packet slug.

### Q4. A re-run produced different numbers but the same winner. New folder or update existing?

Update the existing `benchmark_report.md`. Add a `Re-run YYYY-MM-DD` section near the top with the date, the candidate, the measurement window, and the result. Update the report frontmatter `description` only if the summary line changes. CSV and JSONL artifacts can be appended or replaced; do not delete historical rows.

### Q5. A re-run produced a different winner. New folder or update existing?

Treat the re-run as a new bench. Open a new spec packet, ship it through ADRs, and promote a new `benchmark-<YYYY-MM-DD>/` folder per Section 6. Cross-link the old and new folders in their respective `README.md` rows so the lineage is visible.

### Q6. Drift management: this convention changes. How do old folders adapt?

Old folders are not forced to retroactively adopt new convention details. Section 10 (Version history) records when the convention changed. New folders use the latest version. Old folders may be lightly updated if a maintenance pass touches them, but mass-migrations are not required.

### Q7. The sibling skill (`mcp-coco-index`) wants its own variant. Can it diverge?

The `FORMAT.md` source is shared via symlink. If a sibling skill needs a stack-specific note (Python instead of TypeScript, `sentence-transformers` instead of Ollama), add the note as a "Stack note" callout inside the sibling skill's `README.md` rather than diverging this file. Numeric data is never cross-comparable; the format is.

### Q8. Can a non-embedder benchmark use this format?

Yes. The format applies to any quality-versus-cost sweep an MCP server might run: rerankers, retrieval-stage variants, query expansion strategies, ANN parameter sweeps. Adapt section names to the topic (for example "Per-Reranker Profiles" instead of "Per-Embedder Profiles"); keep the ten-section order.

### Q9. What if a section legitimately has nothing to say?

Keep the section header and write one line stating "Not applicable to this bench. Reason: ..." Do not delete the section; the fixed ten-section order keeps reports comparable across runs.

### Q10. The sk-doc validator complains. What now?

Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file> --fix` to auto-fix anchor-style and case violations. Hand-fix anything the validator cannot auto-fix (missing required sections, missing frontmatter). The validator classifies these docs as `readme` type, which requires a `TABLE OF CONTENTS` section, ALL CAPS H2 headers, and an `OVERVIEW` section.

<!-- /ANCHOR:faq-and-edge-cases -->

---

<!-- ANCHOR:version-history -->
## 10. VERSION HISTORY

| Version | Date | Change |
|---|---|---|
| 1.0 | May 17, 2026 | Initial convention introduced alongside the May 17, 2026 mk-spec-memory text-embedder bake-off. Defined layout, ten-section `benchmark_report.md` structure, date convention, promotion workflow, and authority hierarchy. |
| 1.1 | May 18, 2026 | Added YAML frontmatter, sk-doc anchors, a worked `benchmark_report.md` snippet (Section 5), an FAQ section covering same-date disambiguation / retirement / renames / re-runs / drift / sibling-skill variants / non-embedder use / empty sections / validator failures, and this version-history block. The ten-section `benchmark_report.md` structure is unchanged. |

### How to bump this file

- Open a small spec packet under `.opencode/specs/.../skill-local-benchmarks-format/` for any non-trivial convention change.
- Append a row to the table above with version, date, and a one-line change summary.
- Update `SOURCE.md` and `README.md` only if the change affects their pattern.

<!-- /ANCHOR:version-history -->

---
title: "Benchmark Creation: Standards and Workflow"
description: "Standards and workflow guidance for creating skill-local benchmark folders. Covers adoption criteria, folder shape, the ten-section benchmark_report.md structure, promotion workflow, date convention, authority hierarchy, case studies and common mistakes."
trigger_phrases:
  - "benchmark creation"
  - "when to add benchmark"
  - "skill local benchmark folder"
  - "benchmark report shape"
  - "benchmark promotion workflow"
  - "when to adopt benchmarks format"
  - "skill benchmark adoption"
  - "mcp benchmarks case study"
  - "benchmarks decision aid"
  - "should I add benchmarks folder"
  - "benchmark adoption criteria"
  - "skill local benchmarks signal pattern"
importance_tier: "important"
contextType: "reference"
---

# Benchmark Creation: Standards and Workflow

Standards and workflow guidance for creating skill-local MCP benchmark folders. Covers when to create one, what shape it must take, how to write the ten-section report, how to promote from a spec packet, and what the two shipped adoptions teach future authors.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. WHEN TO CREATE A BENCHMARK FOLDER](#2--when-to-create-a-benchmark-folder)
- [3. WHEN NOT TO CREATE ONE](#3--when-not-to-create-one)
- [4. CANONICAL FOLDER SHAPE](#4--canonical-folder-shape)
- [5. BENCHMARK REPORT STRUCTURE](#5--benchmark-report-structure)
- [6. AUTHORING WORKFLOW](#6--authoring-workflow)
- [7. DATE AND NAMING CONVENTION](#7--date-and-naming-convention)
- [8. AUTHORITY HIERARCHY](#8--authority-hierarchy)
- [9. CASE STUDIES AND COMMON MISTAKES](#9--case-studies-and-common-mistakes)
- [10. RELATED RESOURCES](#10--related-resources)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Skill-local benchmark folders are curated entry points. The full audit trail (ADRs, fixture surgery, rollback history) stays in the spec packet under `.opencode/specs/`. The skill-local folder gives a future engineer a fast answer plus a pointer back to the packet.

**Core principle**: Use the skill-local folder as the look-here-first surface, not the archive. When an engineer asks "which embedder won? what fixture? when?" they find the answer here without hunting through `specs/`.

**Primary sources**:
- [`benchmark_report_template.md`](../assets/benchmark/benchmark_report_template.md): fillable ten-section scaffold for `benchmark_report.md` files
- [`source_template.md`](../assets/benchmark/source_template.md): fillable SOURCE.md scaffold

**Current reality highlights**:
- The convention applies to every `<skill>/mcp_server/benchmarks/` folder in this repo.
- Numeric data is never cross-comparable across skills (different stacks, different fixtures). Each skill's report flags this in its Caveats section.
- Each sibling skill maintains its own `README.md` index and `benchmark-<YYYY-MM-DD>/` dated subfolders.
- The canonical mechanics document is this file. Sibling skill READMEs reference it by path: `.opencode/skills/sk-doc/references/benchmark_creation.md`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:when-to-create -->
## 2. WHEN TO CREATE A BENCHMARK FOLDER

Create a skill-local benchmark folder when all of the following hold:

- The skill houses an MCP server under `mcp_server/`.
- That server produces a measurable retrieval, quality or runtime surface worth defending: top-k recall, hit rate, latency, RAM, dim, throughput or a similar numeric outcome.
- A benchmark run has already completed inside a spec packet and the curated headline is worth promoting where operators read code.
- The run has enough rigor that another author can replay it (stable fixture, replay commands, expected outcome).

**Trigger signals: you will know you need this when:**

- An ADR has just promoted a non-trivial default change. Production now runs on a new embedder, reranker, retrieval pipeline or runtime setting because of measured evidence. Operators inside the MCP code will ask "why this default?" and the answer lives in a spec packet they cannot easily find.
- The spec packet has a `benchmark-results.md` with a clean headline plus five or more ADRs of supporting context. The headline is the curated story. The ADRs are the audit trail. The skill-local view promotes the headline and points back at the ADRs.
- A reader has already asked "where do I find the benchmark numbers" and you pointed at a deep spec path. That question will recur every time someone touches the MCP code. Promotion is the structural fix.
- You are about to write the same comparison table twice: once in a README and once in a release note. Promote it once into `benchmark_report.md` and link to it from both places.
- A sibling skill ships a benchmark folder and your skill has an analogous retrieval surface. The format scales by example. Once one skill ships the layout, sibling MCP servers should match it so an operator moving between them does not have to relearn the structure.

Decision rule:

```text
Measurable retrieval surface + shipped spec packet with accepted ADRs + stable fixture?
  YES -> Create a benchmark folder
  NO  -> Keep results in the spec packet's evidence/ directory
```

<!-- /ANCHOR:when-to-create -->

---

<!-- ANCHOR:when-not-to-create -->
## 3. WHEN NOT TO CREATE ONE

Skip the format when any of the following hold:

- **The skill has no measurable retrieval surface.** Skills that ship workflows, prompts or documentation without a numeric quality outcome do not benefit from this format.
- **The run is still in progress.** Drafts belong in the spec packet's `evidence/` directory until the headline stabilizes and an ADR ratifies it. Promoting an in-flight benchmark guarantees drift between the skill-local report and the spec packet's eventual decision.
- **The output is a single data point with no reproducibility plan.** "We measured X once" is not enough rigor for a promoted folder. Revisit when there is a stable fixture and a replay block.
- **A re-run did not change the headline.** Update the existing `benchmark_report.md` with a "Re-run YYYY-MM-DD" section. Do not add a new dated subfolder for confirmations.
- **The result is cross-stack.** Do not promote a run that mixes data from two different MCP stacks. Each skill keeps its own folder. Cross-stack latency and recall numbers are not comparable.
- **You only want a release note.** A changelog row plus a deeper link to the spec packet is the lighter-weight surface. Reserve the benchmarks folder for runs that operators inside the MCP code will reach for repeatedly.
- **The spec packet has not accepted an ADR yet.** Speculative or hypothesis-only runs are not ready to promote.

If you are unsure, default to "not yet." The promotion workflow stays cheap when triggered after rigor. Rolling back a folder that should have stayed in `evidence/` costs more.

<!-- /ANCHOR:when-not-to-create -->

---

<!-- ANCHOR:canonical-folder-shape -->
## 4. CANONICAL FOLDER SHAPE

```text
mcp_server/benchmarks/
├── README.md                                  <- Index of all benchmarks (sk-doc compliant)
└── benchmark-<YYYY-MM-DD>/                    <- One folder per benchmark RUN, ISO date for sort
    ├── benchmark_report.md                    <- THE detailed report (sk-doc compliant)
    ├── results.csv                            <- Primary aggregate (one row per candidate)
    ├── per-probe.jsonl                        <- Per-query / per-probe data (when applicable)
    ├── runtime-measurements.md                <- Optional: RAM / GPU / latency profile
    └── SOURCE.md                              <- Pointer to authoritative spec packet
```

### Required vs optional files

| File | Required | Note |
|---|---|---|
| `README.md` (folder root) | Yes | Index of all benchmarks in the folder |
| `benchmark-<YYYY-MM-DD>/` | One per bench | Dated subfolder for each promoted run |
| `benchmark_report.md` | Yes inside each dated folder | Ten-section structure (see Section 5) |
| `results.csv` | Yes inside each dated folder | Aggregate metrics, one row per candidate |
| `per-probe.jsonl` | When applicable | Per-query rows; skip for summary-only benches |
| `runtime-measurements.md` | Optional | Include only when a runtime profile is worth promoting |
| `SOURCE.md` | Yes inside each dated folder | Pointer back to the authoritative spec packet |

### `SOURCE.md` purpose

SOURCE.md is a wayfinding pointer file, not a duplicate of the spec packet. It contains:

- Path to the spec packet.
- Why to look there (full ADR trail, fixture rationale, deeper history).
- A "when to read what" navigation map for the spec packet's evidence files.
- Last-updated date and rename or renumber notes.

Use the `source_template.md` scaffold in `assets/benchmark/` to author SOURCE.md. This keeps the skill-local view lean while the spec packet preserves the audit trail.

<!-- /ANCHOR:canonical-folder-shape -->

---

<!-- ANCHOR:benchmark-report-structure -->
## 5. BENCHMARK REPORT STRUCTURE

`benchmark_report.md` is the structured report written to sk-doc standards. The ten sections are fixed. Do not reorder, merge or skip.

1. **Headline**: one-line winner plus key metric, prominently at top.
2. **Aggregate Results**: one row per candidate, headline metrics plus verdict.
3. **Methodology**: fixture, sample size, pipeline (rescue/rerank/hybrid?), environment.
4. **Per-Candidate Profiles**: RAM, disk, dim, release, strengths, weaknesses.
5. **Process Notes**: what was tried, what failed, why.
6. **Findings**: unique wins, universal floor and ceiling, mismatch analysis.
7. **Caveats**: single-run signal, fixture limits, stack-level confounds, schema migration cost.
8. **Recommendations**: Tier 1 (apply now) / Tier 2 (validate first) / Tier 3 (future).
9. **Reproducibility**: exact replay commands plus expected wall-clock.
10. **Cross-Links**: sibling MCP benchmarks, authoritative spec packet, follow-on packets.

**Tone and curation rules**:
- Write with the same care as a sk-doc skill reference.
- Do not paste raw evidence. Curate.
- Do not duplicate the spec packet's full ADR trail. Cross-link to it.
- If a section legitimately has nothing to say, keep the section header and write one line: "Not applicable to this bench. Reason: ..."

### Worked example: sections 1 to 3 in pattern

```markdown
---
title: "<topic> bake-off: <date>"
description: "<summary of candidates and production verdict>. Closes packet <packet-id> at <score>/10."
trigger_phrases:
  - "<topic keywords>"
importance_tier: "important"
contextType: "reference"
---

# <topic> bake-off: <date>

> Headline: `<winner>` + <pipeline-config> is the production default for `<MCP-stack>`.
> <primary-metric> <numeric-result>, <secondary-metric> <numeric-result>. Closes packet <packet-id>.

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

`<winner>` + <pipeline-config> wins by <primary-metric> and <secondary-metric>.

| Metric | Value |
|---|---|
| Winner | `<winner>` |
| Pipeline | <pipeline-config> |
| <primary-metric> | <numeric-result> |
| <secondary-metric> | <numeric-result> |
| Spec packet | `<packet-id>` |
| Decision | <ADR-id> |

<!-- /ANCHOR:headline -->

---

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

| Candidate | Dim | <primary-metric> | Median ms | p95 ms | Verdict |
|---|---:|---:|---:|---:|---|
| `<candidate-1>` | <dim> | <numeric-result> | <numeric-result> | <numeric-result> | WINNER |
| `<candidate-2>` | <dim> | <numeric-result> | <numeric-result> | <numeric-result> | RUNNER-UP |
| `<candidate-3>` | <dim> | <numeric-result> | <numeric-result> | <numeric-result> | BASELINE |
| `<candidate-4>` | <dim> | <numeric-result> | -- | -- | ROLLBACK |

<!-- /ANCHOR:aggregate-results -->

---

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

### Fixture

- Primary gate: <primary-fixture-description>, pinned at `<fixture-path>`.
- Cost-benefit sweep: <sample-size>-scenario stratified sample across <fixture-categories>.
- Regression check: <regression-sample-size>-scenario <regression-target> preservation proxy.

### Pipeline

Retrieval pipeline = <pipeline-description>. Toggle via `<config-flag>=true|false`.

### Environment

<runtime-environment-description>. Corpus size after orphan prune: <corpus-size> active memory rows.

<!-- /ANCHOR:methodology -->
```

Subsequent sections (4 through 10) follow the same pattern: H2 numbered headers, ALL CAPS section names, ANCHOR comment pairs, tables for data, code blocks for verbatim commands. Each section gets its own slug. Keep slugs stable across revisions so deep links keep working.

<!-- /ANCHOR:benchmark-report-structure -->

---

<!-- ANCHOR:authoring-workflow -->
## 6. AUTHORING WORKFLOW

Complete these steps in order. The spec packet must have shipped before you promote.

1. **Pre-write decision.** Confirm the spec packet has shipped with accepted ADRs and a `benchmark-results.md`. Confirm you have a one-line winner statement and headline metric you would defend to a reviewer. Confirm the fixture is stable and replay commands exist.
2. **Create the dated subfolder.** Name it `benchmark-<YYYY-MM-DD>/` using the bench execution date, not the doc authoring date.
3. **Copy raw artifacts** from the spec packet's `evidence/` directory: `results.csv`, `per-probe.jsonl` when applicable, and `runtime-measurements.md` when there is a meaningful runtime profile.
4. **Write `benchmark_report.md`** using the ten-section structure from Section 5. Copy the scaffold from `assets/benchmark/benchmark_report_template.md`. Generalize the headline. Name the load-bearing insight explicitly (it is often distinct from the headline winner).
5. **Write `SOURCE.md`** using the `assets/benchmark/source_template.md` scaffold. Include the spec packet path, a per-file navigation map, and a "last updated" date.
6. **Validate** every authored markdown file: `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file>`. Fix any blocking issues.
7. **Add a row to this skill's `benchmarks/README.md`** with the date, folder link, winner, status and spec-packet path.

### Authoring order matters

- Stabilize the headline and section structure before polishing prose.
- Write the load-bearing insight and caveats before writing recommendations.
- Validate before adding the README row.

### Where each artifact comes from

| Skill-local file | Source in spec packet |
|---|---|
| `benchmark_report.md` | Curated rewrite of `benchmark-results.md` |
| `results.csv` | Copy of `evidence/embedder-comparison*.csv` or topic equivalent |
| `per-probe.jsonl` | Copy of `evidence/*-with-rescue.jsonl` or per-probe equivalent |
| `runtime-measurements.md` | Curated rewrite of `evidence/*-runtime-measurements.md` when present |
| `SOURCE.md` | Authored fresh; points back to the spec packet |

<!-- /ANCHOR:authoring-workflow -->

---

<!-- ANCHOR:date-and-naming-convention -->
## 7. DATE AND NAMING CONVENTION

### Date formats

- **Folder names** use ISO format `YYYY-MM-DD`. This sorts cleanly chronologically.
- **In-doc prose** uses the long form, for example "May 18, 2026". Easier to read.
- Always cite the date the bench was executed, not when the doc was written.

### Disambiguation

If two benchmarks ran on the same date and need disambiguation, suffix with a topic slug: `benchmark-2026-05-18-bge-confirmation/`. Otherwise keep the pure-date name.

### Slug rules

Use lowercase, hyphen-separated, no underscores in folder names. Keep slugs short (one to four tokens). Examples: `benchmark-2026-05-17/`, `benchmark-2026-05-18-bge-confirmation/`, `benchmark-2026-06-01-reranker-sweep/`.

### Retirement and renaming

**Retired benchmarks**: keep the folder. Update the row in `README.md` with status `RETIRED` plus the date. Update the dated folder's `benchmark_report.md` with a "Retirement note" section at the top stating the date, reason and replacement bench if any.

**Renamed or renumbered spec packet**: update the path in `SOURCE.md`. Update any cross-link tables in `benchmark_report.md` and `README.md`. Add a "rename note" line under `SOURCE.md` stating the old slug, the new slug and the date. Do not rename the skill-local dated folder. The folder is named by bench execution date, not by spec-packet slug.

<!-- /ANCHOR:date-and-naming-convention -->

---

<!-- ANCHOR:authority-hierarchy -->
## 8. AUTHORITY HIERARCHY

When a skill-local doc and the spec packet disagree:

1. **Spec packet `decision-record.md` and `implementation-summary.md`**: source of truth.
2. **Skill-local `benchmark_report.md`**: curated summary that tracks the spec packet's headline.
3. **CSV and JSONL files**: direct copies; same authority as the spec packet originals.

The spec packet has the full audit trail. The skill-local view is the look-here-first entry point for someone in the MCP code. The two layers serve different readers and stay in sync via `SOURCE.md` pointers and the promotion workflow.

<!-- /ANCHOR:authority-hierarchy -->

---

<!-- ANCHOR:case-studies-and-mistakes -->
## 9. CASE STUDIES AND COMMON MISTAKES

### Case study 1: text-embedder bake-off (mk-spec-memory, May 17, 2026)

Path: `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/`

The bake-off compared six text embedders against a deterministic paraphrase-recall fixture. Twelve ADRs landed in a single day across rollbacks, fixture surgery and a retrieval-rescue pivot. The spec packet ended with the winning embedder plus retrieval-rescue layer as the production default.

**What triggered adoption**: production ran on a different embedder than the schema fallback, and the rescue layer was default-on. Every future operator inside the MCP code would need to know which embedder was active, why and what fixture closed the gate. Promoting a curated entry point gave the next operator a sub-minute orientation.

**The load-bearing insight was not the headline winner.** The most valuable finding was that the retrieval-rescue layer contributed more lift to recall than any embedder swap measured in the bake-off. Pre-rescue, no candidate reached the PASS gate. Post-rescue, scores climbed by three to six points depending on the candidate. Future embedder swaps must measure with the rescue layer on against that baseline. That guidance is one click away from anyone in the MCP code instead of buried in ADR-010 of a spec packet they would have to know existed.

**Lesson**: A benchmark folder pays off most when the spec packet has many ADRs supporting one curated headline. Promote a `runtime-measurements.md` companion only when the runtime profile is part of the decision (RAM headroom, daemon residency, cold-load time).

### Case study 2: code-embedder bake-off (system-code-graph, May 18, 2026)

Path: `.opencode/skills/system-code-graph/mcp_server/benchmarks/benchmark-2026-05-18/`

The bake-off compared five code-tuned embedders against an 18-pair paraphrased fixture. One skipped on Apple Silicon because of an xformers requirement. The leading candidate was ahead by two net pairs over the current default (four unique wins minus two unique losses). No promotion shipped on May 18 because the lead was a single-run signal requiring a 3-run confirmation.

**What triggered adoption anyway**: the bake-off shape mirrored the sibling skill's text-embedder run, and the same operators move between the two skills. Symmetry across sibling MCP servers is itself an adoption trigger.

**What the folder had to carry**:
- A single-run signal caveat: on a small fixture, single-sample wins under the noise floor are easy to mistake for real progress.
- A reranker swap discovery: the original cross-encoder failed silently on Apple Silicon MPS, returning un-reranked candidates with no operator-visible signal. The bake-off swapped to a different reranker mid-validation. Any prior measurement on the same fixture has to be treated as "rerank effectively off" and is not comparable.
- A stack-mismatch warning: the Python sentence-transformers stack is incomparable with the Ollama stack in the sibling skill.

**A sidecar file (`risk-analysis-rerank-nondeterminism.md`) carried the follow-on context** that did not fit inside the report's ten-section structure. This is the pattern for depth that does not fit the report shape: drop it next to `benchmark_report.md` as a focused sidecar with its own frontmatter and anchors.

**Lesson**: Single-run signals warrant a Caveats line and a follow-on packet, not a promotion claim. Adopt the format even when the headline is provisional, but make the provisional status explicit.

### Common mistakes

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Promoting before the spec packet ADR is accepted | Skill-local report drifts from the eventual decision | Wait for ADR ratification before authoring `benchmark_report.md` |
| Omitting the load-bearing insight | Future operators miss the finding that matters most | State the non-obvious finding explicitly in Section 1 "What Shipped" and in Section 6 "Findings" |
| Naming folders by doc-authoring date | Folder date no longer matches evidence date | Always use the bench execution date for the folder name |
| Deleting retired benchmark folders | Audit trail is lost | Mark RETIRED in `README.md`; keep the folder |
| Cross-referencing numbers between skills | Stacks differ; numbers are not comparable | Add a "Stack distinction" line in Caveats; link to the sibling README but do not compare figures |
| Creating a new dated folder for a re-run that confirms the winner | Pollutes the index with redundant folders | Update the existing `benchmark_report.md` with a "Re-run YYYY-MM-DD" section |
| Writing a ten-section report without a SOURCE.md | Readers cannot find the audit trail | Always author SOURCE.md; use the `source_template.md` scaffold |

<!-- /ANCHOR:case-studies-and-mistakes -->

---

<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Templates

| File | Purpose |
|---|---|
| [`benchmark_report_template.md`](../assets/benchmark/benchmark_report_template.md) | Fillable ten-section scaffold for `benchmark_report.md` files |
| [`source_template.md`](../assets/benchmark/source_template.md) | Fillable SOURCE.md scaffold |

### Validation

- `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme <file>`: run against any `benchmark_report.md` or `benchmarks/README.md` before promoting.

### Shipped benchmark examples

| Path | What |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/` | mk-spec-memory text-embedder bake-off (Section 9 Case study 1) |
| `.opencode/skills/system-code-graph/mcp_server/benchmarks/benchmark-2026-05-18/` | system-code-graph code-embedder bake-off (Section 9 Case study 2) |

### Related sk-doc references

- [`readme_creation.md`](./readme_creation.md): README authoring conventions used by `benchmarks/README.md`
- [`global/core_standards.md`](./global/core_standards.md): cross-document standards including ANCHOR conventions
- [`global/evergreen_packet_id_rule.md`](./global/evergreen_packet_id_rule.md): evergreen rule for runtime docs; benchmark reports follow it via `SOURCE.md` cross-link rather than inline packet IDs

<!-- /ANCHOR:related-resources -->

---
name: create-benchmark
description: Promote curated MCP benchmark evidence into a skill-local benchmarks folder with a ten-section benchmark_report.md and SOURCE.md wayfinding record.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-benchmark, benchmark_report.md, SOURCE.md, mcp_server benchmarks, benchmark promotion, skill-local benchmark, MCP bake-off, benchmark folder -->

# create-benchmark

`create-benchmark` is the benchmark-promotion workflow packet of the `sk-doc` family. It turns a shipped spec packet's curated benchmark evidence into a consuming skill's `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folder, so MCP operators can find the winner, fixture, caveats, replay commands, and source packet without leaving the skill tree.

The skill-local folder is the look-here-first surface, not the archive. The full audit trail stays in the spec packet under `.opencode/specs/`.

---

## 1. WHEN TO USE + SMART_ROUTING

### Activation Triggers

Use this workflow when the task involves:

- Promoting a completed MCP benchmark or bake-off from a spec packet into a skill-local `mcp_server/benchmarks/` folder.
- Creating or updating `benchmark_report.md` with the fixed ten-section narrative.
- Creating `SOURCE.md` as a wayfinding pointer back to the authoritative spec packet.
- Copying benchmark artifacts such as `results.csv`, `per-probe.jsonl`, or runtime sidecars into a dated benchmark folder.
- Updating a consuming skill's `mcp_server/benchmarks/README.md` index row.

Keyword triggers: `benchmark folder`, `benchmark_report.md`, `SOURCE.md`, `mcp_server/benchmarks`, `benchmark promotion`, `skill-local benchmark`, `MCP bake-off`, `results.csv`, `per-probe.jsonl`, `runtime-measurements`.

### Adoption Gate

Create a skill-local benchmark folder only when all of the following hold:

- The skill houses an MCP server under `mcp_server/`.
- That server produces a measurable retrieval, quality, runtime, throughput, top-k recall, hit rate, latency, RAM, dim, or similar numeric outcome.
- A benchmark run has already completed inside a spec packet.
- The curated headline is worth promoting where operators read code.
- The run has enough rigor that another author can replay it: stable fixture, replay commands, and expected outcome.
- The source packet has accepted ADRs or an accepted decision record.

Decision rule:

```text
Measurable retrieval surface + shipped spec packet with accepted ADRs + stable fixture?
  YES -> Create a benchmark folder
  NO  -> Keep results in the spec packet's evidence/ directory
```

### When NOT to Use

Skip this workflow when:

- The benchmark is still in progress or lacks an accepted decision record.
- The result is a single unreplayable data point with no stable fixture or replay commands.
- The target skill has no MCP server or no measurable retrieval, quality, runtime, or throughput surface.
- The user only needs a release note, changelog row, or speculative research summary.
- The task is a general benchmark design exercise rather than promotion of an already-curated run.
- A re-run confirms the same headline; update the existing `benchmark_report.md` with a re-run note instead.
- The result mixes data from different MCP stacks and asks for a single comparative verdict.
- The user asks for a bound `/create:` command. This packet has no slash command; it is a narrow workflow packet.

If unsure, default to "not yet." Promotion is cheap after rigor; rolling back a premature folder costs more.

### Family Boundary

This is a nested workflow packet under `sk-doc`. It owns benchmark-folder authoring only. The single advisor identity lives at the `sk-doc` hub root; never add packet-local `graph-metadata.json`.

---

## 2. REQUIRED PACKAGE SHAPE

Author or update this package shape inside the consuming skill:

```text
mcp_server/benchmarks/
├── README.md
└── benchmark-<YYYY-MM-DD>/
    ├── benchmark_report.md
    ├── results.csv
    ├── per-probe.jsonl
    ├── runtime-measurements.md
    └── SOURCE.md
```

Required and optional files:

| File | Required | Purpose |
| --- | --- | --- |
| `README.md` | Yes | Index of all benchmark folders in this skill |
| `benchmark-<YYYY-MM-DD>/` | One per promoted run | Dated subfolder using the benchmark execution date |
| `benchmark_report.md` | Yes | Ten-section operator-facing report |
| `results.csv` | Yes | Primary aggregate metrics, one row per candidate |
| `per-probe.jsonl` | When applicable | Per-query or per-probe rows |
| `runtime-measurements.md` | Optional | RAM, GPU, latency, cold-load, or runtime profile worth promoting |
| `SOURCE.md` | Yes | Pointer back to the authoritative spec packet |

`SOURCE.md` is a wayfinding file, not a duplicate audit trail. It contains the spec packet path, why to read it, question-to-file mapping, evidence map, follow-on packet notes, rename or renumber notes, and last-updated date.

Use `assets/benchmark/benchmark_report_template.md` for `benchmark_report.md` and `assets/benchmark/source_template.md` for `SOURCE.md`.

Reference `references/benchmark_creation.md` only for deep overflow such as case studies, sibling examples, and uncommon edge cases.

---

## 3. HOW IT WORKS: AUTHORING WORKFLOW

Complete these steps in order. The spec packet must have shipped before promotion.

1. **Confirm the promotion gate.** Read the source packet `decision-record.md`, `implementation-summary.md`, and benchmark evidence. Confirm an accepted decision, stable headline, stable fixture, replay commands, and a defensible winner or explicit provisional status.
2. **Classify the task.** Decide whether this is a true promotion, a re-run update, or a retirement update.
3. **Confirm the target skill.** Verify the consuming skill has `mcp_server/` and an appropriate measurable MCP surface.
4. **Create or update the benchmark index.** Ensure `mcp_server/benchmarks/README.md` exists and can hold date, folder link, winner or status, headline metric, and source packet path.
5. **Choose the dated folder.** Name it `benchmark-YYYY-MM-DD/` using the benchmark execution date, not the document authoring date.
6. **Copy source artifacts.** Copy the aggregate CSV first, then `per-probe.jsonl` when applicable, then focused runtime or risk sidecars only when they affect the decision.
7. **Write `benchmark_report.md`.** Use the ten-section structure from this SKILL and the report template. Generalize the headline and state the load-bearing insight separately from the headline winner when the data shows a non-obvious cause.
8. **Write `SOURCE.md`.** Use the source template. Include the spec packet path, per-file navigation map, evidence map, follow-on notes, and last-updated date.
9. **Update the README index row.** Add or update the row with date, folder link, winner or status, headline metric, and source packet path.
10. **Validate authored markdown.** Run `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type readme <file>` on `benchmark_report.md` and `benchmarks/README.md`. Fix blocking issues before delivery.

### Authoring Order Rules

- Stabilize the headline and section structure before polishing prose.
- Write the load-bearing insight and caveats before recommendations.
- Validate before adding or finalizing the README index row.
- Keep raw evidence out of the report; curate and link through `SOURCE.md`.

### Artifact Sources

| Skill-local file | Source in spec packet |
| --- | --- |
| `benchmark_report.md` | Curated rewrite of `benchmark-results.md` or equivalent benchmark summary |
| `results.csv` | Copy of `evidence/*comparison*.csv` or topic equivalent |
| `per-probe.jsonl` | Copy of `evidence/*.jsonl` per-probe output when applicable |
| `runtime-measurements.md` | Curated rewrite or copy of runtime evidence when the profile affects the decision |
| `SOURCE.md` | Authored fresh; points back to the spec packet |

---

## 4. REPORT CONTRACT

`benchmark_report.md` keeps this fixed ten-section structure. Do not merge, reorder, or omit sections.

1. **HEADLINE / OVERVIEW**: one-line winner or status plus key metric.
2. **AGGREGATE RESULTS**: one row per candidate, headline metrics, and verdict.
3. **METHODOLOGY**: fixture, sample size, pipeline, environment, and replay context.
4. **PER-CANDIDATE PROFILES**: RAM, disk, dim, release, strengths, and weaknesses.
5. **PROCESS NOTES**: what was tried, what failed, and why.
6. **FINDINGS**: unique wins, universal floor and ceiling, mismatch analysis, and load-bearing insight.
7. **CAVEATS**: single-run signal, fixture limits, stack-level confounds, schema migration cost, reranker/runtime confounds.
8. **RECOMMENDATIONS**: Tier 1 apply now, Tier 2 validate first, Tier 3 future.
9. **REPRODUCIBILITY**: exact replay commands plus expected wall-clock.
10. **CROSS-LINKS**: sibling MCP benchmarks, authoritative spec packet, follow-on packets.

If a section legitimately has nothing to say, keep the header and write one line: `Not applicable to this bench. Reason: ...`

### Report Style

- Write with the same care as a sk-doc skill reference.
- Include frontmatter appropriate for a reference document.
- Use H2 numbered headers with ALL CAPS section names.
- Use tables for data and fenced code blocks for verbatim commands.
- Keep slugs and anchors stable across revisions so deep links keep working.
- Do not paste the full spec packet ADR trail into the report.
- Do not compare numeric results across different MCP stacks as if equivalent.

### Headline Pattern

Use this shape near the top of the report:

```markdown
# <topic> bake-off: <date>

> Headline: `<winner>` + <pipeline-config> is the production default for `<MCP-stack>`.
> <primary-metric> <numeric-result>, <secondary-metric> <numeric-result>. Closes packet <packet-id>.
```

The load-bearing insight may be different from the headline winner. If so, state it in Section 1 and Section 6.

---

## 5. DATE AND NAMING CONVENTION

### Folder Names

- Use ISO date format: `benchmark-YYYY-MM-DD/`.
- Use the date the benchmark was executed, not the date the document was written.
- Use lowercase, hyphen-separated folder names with no underscores.
- If two benchmarks ran on the same date and need disambiguation, suffix with a short topic slug: `benchmark-2026-05-18-bge-confirmation/`.

Examples:

```text
benchmark-2026-05-17/
benchmark-2026-05-18-bge-confirmation/
benchmark-2026-06-01-reranker-sweep/
```

### In-Document Dates

Use readable long-form dates in prose, such as `May 18, 2026`.

### Re-Runs

Do not create a new dated folder for a re-run that only confirms the same headline. Update the existing `benchmark_report.md` with a `Re-run YYYY-MM-DD` note.

### Retirement

Retired benchmarks stay in place. Update `README.md` with status `RETIRED` plus the date. Add a retirement note near the top of `benchmark_report.md` with date, reason, and replacement bench if any.

### Renamed or Renumbered Spec Packets

Do not rename the skill-local dated folder. Update the path in `SOURCE.md`, update cross-link tables in `benchmark_report.md` and `README.md`, and add a rename note in `SOURCE.md` with old slug, new slug, and date.

---

## 6. RULES: AUTHORITY AND GATES

### Authority Hierarchy

When documents disagree:

1. Source spec packet `decision-record.md` and `implementation-summary.md` are authoritative.
2. Skill-local `benchmark_report.md` is the curated operator-facing summary.
3. Copied CSV and JSONL files preserve the source packet evidence.
4. `SOURCE.md` is navigation, not a duplicate audit trail.

### ALWAYS

1. Read the source packet decision record, implementation summary, and benchmark evidence before writing.
2. Use the benchmark execution date for `benchmark-<YYYY-MM-DD>/`.
3. Keep `SOURCE.md` lean and navigational.
4. Include caveats for single-run signal, fixture limits, stack mismatch, schema migration cost, and reranker/runtime confounds when present.
5. Preserve retired benchmark folders.
6. Validate authored markdown before delivery.

### NEVER

1. Never promote an in-flight benchmark as a final skill-local record.
2. Never compare numeric results across different MCP stacks as if equivalent.
3. Never paste the full spec packet audit trail into `benchmark_report.md`.
4. Never create a new dated folder for a confirming re-run.
5. Never name the folder by authoring date, source packet slug, or candidate name.
6. Never leave template placeholders in shipped benchmark files.
7. Never add packet-local `graph-metadata.json`.

### ESCALATE IF

1. The source packet has no accepted decision record or stable benchmark headline.
2. The target skill lacks `mcp_server/` or an appropriate measurable MCP surface.
3. Source artifacts are missing, non-replayable, or internally contradictory.
4. The benchmark spans multiple stacks and the user wants a single comparative verdict.
5. Validation fails on required markdown structure after local fixes.

---

## 7. SUCCESS CRITERIA

- The consuming skill has a dated `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folder.
- `benchmark_report.md` uses the ten-section structure and includes winner or status, aggregate table, methodology, candidate profiles, findings, caveats, recommendations, replay commands, and cross-links.
- `SOURCE.md` points to the authoritative spec packet and maps reader questions to source files.
- Raw artifacts are copied or intentionally omitted with a documented reason.
- The benchmarks README index links the new folder and source packet.
- Shared sk-doc validation passes for authored markdown, or any remaining issue is escalated with exact command output.

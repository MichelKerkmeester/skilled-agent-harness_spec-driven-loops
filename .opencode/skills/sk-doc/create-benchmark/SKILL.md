---
name: create-benchmark
description: Promote curated MCP benchmark evidence into a skill-local benchmarks folder with a ten-section benchmark_report.md and SOURCE.md wayfinding record.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-benchmark, benchmark_report.md, SOURCE.md, mcp_server benchmarks, benchmark promotion, skill-local benchmark, MCP bake-off, benchmark folder -->

# create-benchmark

`create-benchmark` is the benchmark-promotion workflow packet of the `sk-doc` family. It turns a shipped spec packet's curated benchmark evidence into a consuming skill's `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folder, so MCP operators can find the winner, fixture, caveats, replay commands, and source packet without leaving the skill tree.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the task involves:
- Promoting a completed MCP benchmark or bake-off from a spec packet into a skill-local `mcp_server/benchmarks/` folder.
- Creating or updating `benchmark_report.md` with the fixed ten-section narrative.
- Creating `SOURCE.md` as a wayfinding pointer back to the authoritative spec packet.
- Copying benchmark artifacts such as `results.csv`, `per-probe.jsonl`, or runtime sidecars into a dated benchmark folder.
- Updating a consuming skill's `mcp_server/benchmarks/README.md` index row.

Keyword triggers: `benchmark folder`, `benchmark_report.md`, `SOURCE.md`, `mcp_server/benchmarks`, `benchmark promotion`, `skill-local benchmark`, `MCP bake-off`, `results.csv`, `per-probe.jsonl`, `runtime-measurements`.

### When NOT to Use

Skip this workflow when:
- The benchmark is still in progress or lacks an accepted decision record.
- The result is a single unreplayable data point with no stable fixture or replay commands.
- The target skill has no MCP server or no measurable retrieval, quality, runtime, or throughput surface.
- The user only needs a release note, changelog row, or speculative research summary.
- The task is a general benchmark design exercise rather than promotion of an already-curated run.
- The user asks for a bound `/create:` command. This packet has no slash command; it is a narrow workflow packet.

### Family Boundary

This is a nested workflow packet under `sk-doc`. It owns benchmark-folder authoring only. The single advisor identity lives at the `sk-doc` hub root; never add packet-local `graph-metadata.json`.

---

## 2. SMART ROUTING

### Resource Loading

Load the packet resources before authoring:

| Level | When | Resources |
| --- | --- | --- |
| ALWAYS | Any benchmark-promotion task | `references/benchmark_creation.md` |
| ALWAYS | Writing `benchmark_report.md` | `assets/benchmark/benchmark_report_template.md` |
| ALWAYS | Writing `SOURCE.md` | `assets/benchmark/source_template.md` |
| ALWAYS | Before delivery | `../shared/references/global/quick_reference.md`, `../shared/references/global/validation.md` |
| CONDITIONAL | Runtime-doc packet references are needed | `../shared/references/global/evergreen_packet_id_rule.md` |
| CONDITIONAL | Frontmatter or style questions arise | `../shared/references/global/core_standards.md`, `../shared/assets/frontmatter_templates.md` |

### Target Shape

The workflow authors or updates this package shape inside the consuming skill:

```text
mcp_server/benchmarks/
├── README.md
└── benchmark-<YYYY-MM-DD>/
    ├── benchmark_report.md
    ├── SOURCE.md
    ├── results.csv
    ├── per-probe.jsonl
    └── runtime-measurements.md
```

`results.csv` is required for promoted aggregate metrics. `per-probe.jsonl` and `runtime-measurements.md` are included when the source packet has meaningful per-probe or runtime evidence.

---

## 3. HOW IT WORKS

### Promotion Workflow

1. Confirm the source spec packet shipped: accepted decision record, stable benchmark headline, stable fixture, replay commands, and a defensible winner or provisional status.
2. Read `references/benchmark_creation.md` and identify whether this is a true promotion, a re-run update, or a retirement update.
3. Create or update `mcp_server/benchmarks/README.md` in the consuming skill if the benchmark index is missing or stale.
4. Create the dated folder using the benchmark execution date, not the document authoring date: `benchmark-YYYY-MM-DD/`.
5. Copy source artifacts from the spec packet evidence area into the dated folder: aggregate CSV first, per-probe JSONL when applicable, and focused runtime or risk sidecars only when they affect the decision.
6. Write `benchmark_report.md` from `assets/benchmark/benchmark_report_template.md`.
7. Write `SOURCE.md` from `assets/benchmark/source_template.md`.
8. Validate authored markdown with the shared sk-doc validators and fix blocking issues.
9. Add or update the benchmark index row with date, folder link, winner or status, headline metric, and source packet path.

### Report Contract

`benchmark_report.md` keeps the ten-section structure from `benchmark_creation.md`:

1. HEADLINE / OVERVIEW
2. AGGREGATE RESULTS
3. METHODOLOGY
4. PER-CANDIDATE PROFILES
5. PROCESS NOTES
6. FINDINGS
7. CAVEATS
8. RECOMMENDATIONS
9. REPRODUCIBILITY
10. CROSS-LINKS

Do not merge, reorder, or omit sections. If a section is legitimately not applicable, keep the header and state why in one sentence.

### Authority Hierarchy

When documents disagree:
1. Source spec packet `decision-record.md` and `implementation-summary.md` are authoritative.
2. Skill-local `benchmark_report.md` is the curated operator-facing summary.
3. Copied CSV and JSONL files preserve the source packet evidence.
4. `SOURCE.md` is navigation, not a duplicate audit trail.

---

## 4. RULES

### ✅ ALWAYS

1. Read the source packet decision record, implementation summary, and benchmark evidence before writing the skill-local report.
2. Use the benchmark execution date for `benchmark-<YYYY-MM-DD>/`.
3. Keep `SOURCE.md` as a wayfinding file with paths, question-to-file mapping, evidence map, follow-on packet notes, and last-updated date.
4. State the load-bearing insight separately from the headline winner when the data shows a non-obvious cause.
5. Include caveats for single-run signal, fixture limits, stack mismatch, schema migration cost, or reranker/runtime confounds.
6. Validate authored markdown with `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type readme <file>`.
7. Preserve retired benchmark folders; mark them retired in the index and add a retirement note to the report.

### ❌ NEVER

1. Never promote an in-flight benchmark as a final skill-local record.
2. Never compare numeric results across different MCP stacks as if they are equivalent.
3. Never paste the full spec packet audit trail into `benchmark_report.md`; link through `SOURCE.md`.
4. Never create a new dated folder for a re-run that only confirms the same headline; update the existing report with a re-run note.
5. Never name the folder by authoring date, source packet slug, or candidate name.
6. Never leave template placeholders in shipped benchmark files.
7. Never add packet-local `graph-metadata.json`.

### ⚠️ ESCALATE IF

1. The source packet has no accepted decision record or no stable benchmark headline.
2. The target skill lacks `mcp_server/` or an appropriate measurable MCP surface.
3. The source artifacts are missing, non-replayable, or internally contradictory.
4. The benchmark spans multiple stacks and the user wants a single comparative verdict.
5. Validation fails on required markdown structure after local fixes.

---

## 5. SUCCESS CRITERIA

- The consuming skill has a dated `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folder.
- `benchmark_report.md` uses the ten-section structure and includes winner or status, aggregate table, methodology, candidate profiles, findings, caveats, recommendations, replay commands, and cross-links.
- `SOURCE.md` points to the authoritative spec packet and maps reader questions to source files.
- Raw artifacts are copied or intentionally omitted with a documented reason.
- The benchmarks README index links the new folder and source packet.
- Shared sk-doc validation passes for authored markdown, or any remaining issue is escalated with exact command output.

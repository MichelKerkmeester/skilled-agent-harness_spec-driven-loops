---
title: Behavior Benchmark Authoring Guide
description: End-to-end guide for authoring a behavior_benchmark package for a deep-loop mode - what it measures, how it differs from an MCP promotion benchmark, the scenario-matrix design, the package layout, and the template-to-file mapping. The normative measurement contract stays in the shared framework.
trigger_phrases:
  - "behavior benchmark authoring guide"
  - "how to author a behavior benchmark"
  - "behavior benchmark package guide"
  - "behavior scenario matrix design"
  - "behavior benchmark templates"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Behavior Benchmark Authoring Guide

Overflow depth for authoring a `behavior_benchmark` package. This guide walks the
authoring path end to end and points at the three templates and the normative
framework. It does NOT restate the measurement contract: the five-dimension
rubric, terminal buckets, budget formula, entry-surface and clarity enums, and the
per-package ID-prefix table live once in
[`../../../system-deep-loop/shared/behavior-benchmark/framework.md`](../../../system-deep-loop/shared/behavior-benchmark/framework.md).
Where this guide and that framework diverge, the framework prevails.

---

## 1. OVERVIEW: WHAT A BEHAVIOR BENCHMARK IS

A behavior benchmark measures what an executor **model** does when a deep-loop
mode's invocation surface is triggered with a realistic user prompt: whether it
dispatches the mode's LEAF agent instead of absorbing the role, whether it halts
for one consolidated setup question when the prompt is under-specified, whether it
respects the mode's invariants, and how long each of those takes relative to a
Claude reference leg. It is a package of run contracts, not a numeric bake-off.

Each behavior benchmark is carried by exactly one deep-loop mode-packet, at
`<mode>/behavior_benchmark/`, and is governed by the single shared framework.
Sibling modes each carry their own package; they share the framework, the runner,
and the scoring so results stay comparable across modes.

### How it differs from an MCP promotion benchmark

The other benchmark family this packet authors — see [`../SKILL.md`](../SKILL.md)
sections 3 through 8 — promotes a completed MCP retrieval or runtime bake-off into
a consuming skill's `mcp_server/benchmarks/` folder with a ten-section
`benchmark_report.md`. The two families are distinct and must not be conflated:

| Dimension | MCP promotion benchmark | Behavior benchmark |
| --- | --- | --- |
| What it measures | Retrieval, quality, runtime, or throughput numbers from a shipped MCP stack | Executor-model behavior at a deep-loop mode's invocation surface |
| Lives at | `<skill>/mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` | `<mode>/behavior_benchmark/` |
| Central artifact | Ten-section `benchmark_report.md` plus `SOURCE.md` | `behavior_benchmark.md` index plus per-scenario contracts plus a baseline |
| Governing contract | The report contract in `../SKILL.md` | The shared `framework.md` |
| Evidence location | The dated folder is the curated surface; audit trail in the spec packet | The package holds the contract; run evidence lands in the executing spec-packet phase |

If the task is promoting MCP numbers, use the MCP-promotion path in `../SKILL.md`.
If the task is specifying executor behavior for a deep-loop mode, use this guide.

---

## 2. PACKAGE LAYOUT

Author this shape inside the owning deep-loop mode-packet:

```text
<mode>/behavior_benchmark/
├── behavior_benchmark.md          # the package index (scenario table + axis coverage)
├── scenarios/
│   ├── <PREFIX>-001-<slug>.md     # one machine-contract file per scenario
│   ├── <PREFIX>-002-<slug>.md
│   └── ...
└── baselines/
    └── claude-baseline.md         # per-scenario Claude-leg reference checkpoints
```

| File | Required | Template |
| --- | --- | --- |
| `behavior_benchmark.md` | Yes | [`../assets/behavior_benchmark_index_template.md`](../assets/behavior_benchmark_index_template.md) |
| `scenarios/<PREFIX>-NNN-<slug>.md` | One per scenario | [`../assets/behavior_benchmark_scenario_template.md`](../assets/behavior_benchmark_scenario_template.md) |
| `baselines/claude-baseline.md` | Yes | [`../assets/behavior_benchmark_baseline_template.md`](../assets/behavior_benchmark_baseline_template.md) |

Fixtures, lane-configs, transcripts, result JSONs, and scorecards are NOT shipped
in this package. The executing spec-packet phase provisions the fixtures and holds
the run evidence. The package is the contract; the packet is the proof.

---

## 3. NAMING CONVENTIONS

These match the sk-doc reference-doc conventions and the shipped
`deep-alignment/behavior_benchmark/` package.

- **Package directory**: `behavior_benchmark` (underscore), directly under the
  mode-packet.
- **Index file**: `behavior_benchmark.md` (underscore), matching the directory.
- **Scenario files**: `<PREFIX>-NNN-<slug>.md` — an uppercase three-letter ID
  prefix, a zero-padded three-digit number, then a lowercase-hyphen slug, for
  example `DAB-001-auto-run-lane-config.md`. The `NNN` is contiguous from `001`.
- **Baseline file**: `baselines/claude-baseline.md`.
- **ID prefix**: three uppercase letters, unique per package. The framework fixes
  `ACB` (ai-council), `IMB` (improvement), `RSB` (research), `RVB` (review). A new
  mode extends that table with its own prefix and declares the extension in the
  index OVERVIEW (for example `DAB` for deep-alignment). Confirm the prefix is not
  already taken before assigning it.

---

## 4. AUTHORING WORKFLOW

Complete these steps in order.

1. **Read the framework.** Load
   [`../../../system-deep-loop/shared/behavior-benchmark/framework.md`](../../../system-deep-loop/shared/behavior-benchmark/framework.md)
   in full: the scenario contract schema, the five-dimension rubric, the terminal
   buckets, the budget formula, and the ID-prefix table. It is the authority for
   every field the scenario template leaves as a placeholder.
2. **Read the owning mode contract.** Load the mode's `SKILL.md` and pull its
   invariants, its LEAF agent name, its invocation surface (command and natural
   forms), and the adjacent modes it must decline work for. These become the
   distinctive cells.
3. **Assign the ID prefix and confirm the mode value.** Pick an unused three-letter
   prefix. If the mode value is not already in the framework's `mode` enum, that is
   a framework extension to declare in the index OVERVIEW, grounded in where the
   shipped mode already carries the value.
4. **Design the scenario matrix.** Cover the entry-surface and clarity axes
   deliberately, and isolate each distinctive invariant and each boundary in its
   own cell. See section 5.
5. **Write the index.** Copy the index template to `behavior_benchmark.md`, fill
   the OVERVIEW, SCENARIO TABLE, AXIS COVERAGE, EXECUTION, and RELATED RESOURCES
   sections, and delete the availability blockquote unless the invocation surface
   is planned-but-not-built.
6. **Write one scenario file per row.** Copy the scenario template per row. The
   first fenced json block is the machine contract the runner parses; keep its
   field order. Fill Rationale, Pass shape, and Failure modes as scoring context.
   Keep every row in the index table and its scenario file in exact sync.
7. **Write the baseline.** Copy the baseline template to
   `baselines/claude-baseline.md`. Ship every cell `pending` / `not_captured` if no
   Claude leg has run — that is a legitimate ship state, but it is never quotable
   as behavior.
8. **Validate.** Run the sk-doc document validator on the index and baseline (see
   section 6). Scenario files carry no frontmatter by design; validate them for
   structure by confirming the first fenced json block parses and the ID matches
   the filename.
9. **Hand fixtures and capture to the executing packet.** The package does not run
   itself. The spec-packet phase that executes a round provisions the fixtures,
   runs the runner, and files the evidence; only then do the baseline `pending`
   cells get replaced and the budgets recomputed.

---

## 5. SCENARIO MATRIX DESIGN

A behavior benchmark earns its keep by exercising the axes deliberately, not by
piling on happy-path cells. Use these design rules; the framework's enums are
authoritative for the axis values.

- **Entry surfaces (E1 through E4).** E1 is command-plus-suffix (fully specified),
  E2 is the bare command (which must halt for setup), E3 is a natural-language ask,
  E4 is orchestrate-routed. Cover at least the surfaces the mode actually exposes.
  If a surface is intentionally skipped, name it and say why in AXIS COVERAGE — the
  usual reason is that a sibling package already covers the generic hand-off.
- **Clarity (C1 through C3).** C1 is vague, C2 is concise-but-scoped, C3 is fully
  specified. Push a real share of the matrix to C1 and C2: a benchmark that only
  tests the fully-pinned path never observes the setup-question behavior, which is
  where executors most often diverge.
- **Invariant cells.** Give each invariant the mode's `SKILL.md` names its own
  cell, seeded so a correct executor visibly does the right thing and an incorrect
  one visibly does not — verify-first, suppression of documented conventions,
  read-only default, gated remediation, and so on.
- **Boundary cells.** For each adjacent mode the owning mode must decline work
  for, add a cell that presents the adjacent ask and expects a decline, not a
  silent absorption.
- **Interaction expectation.** Set `expected_interaction` to `question_halt` for
  under-specified cells (the executor must ask ONE consolidated setup question and
  stop) and `autonomous` for cells that should run to a terminal. Autonomous
  delegating cells that legitimately go quiet set `watchdog_ms`.

Report the resulting coverage as prose in the index AXIS COVERAGE section: the
per-surface counts, the per-clarity counts, which invariant and boundary each cell
isolates, and any axis intentionally left out with its reason.

---

## 6. VALIDATION

- **Index and baseline** carry sk-doc reference frontmatter and validate with the
  shared document validator:

  ```bash
  python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type readme
  ```

- **Scenario files** ship without frontmatter by design (they open at the
  `# <PREFIX>-NNN` H1). Validate them structurally: the first fenced json block
  parses as JSON, its `id` matches the filename, and its field set matches the
  scenario template. The runner is the ultimate check — it fails a contract it
  cannot parse.
- **Cross-file consistency** is the check the validator cannot make for you: every
  index table row has a matching scenario file, every scenario `id` matches its
  filename and its table row, and the entry surface, clarity, expected
  interaction, and budget agree across the table, the scenario, and the baseline.

---

## 7. RELATED RESOURCES

### Templates

| File | Purpose |
| --- | --- |
| [`../assets/behavior_benchmark_index_template.md`](../assets/behavior_benchmark_index_template.md) | Scaffold for the `behavior_benchmark.md` package index |
| [`../assets/behavior_benchmark_scenario_template.md`](../assets/behavior_benchmark_scenario_template.md) | Scaffold for one `<PREFIX>-NNN-<slug>.md` scenario contract |
| [`../assets/behavior_benchmark_baseline_template.md`](../assets/behavior_benchmark_baseline_template.md) | Scaffold for `baselines/claude-baseline.md` |

### Normative contract and runner

- [`../../../system-deep-loop/shared/behavior-benchmark/framework.md`](../../../system-deep-loop/shared/behavior-benchmark/framework.md) — the single-source measurement contract: scenario schema, five-dimension rubric, terminal buckets, budget formula, ID-prefix table.
- [`../../../system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs`](../../../system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs) — the runner that extracts checkpoints and delegation evidence, scores, and classifies each cell.

### Worked reference package

- `.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/` — the shipped `DAB` package: read its `behavior_benchmark.md`, a `scenarios/DAB-*.md` file, and `baselines/claude-baseline.md` to see the templates filled in against a real mode.

---

*End of behavior benchmark authoring guide — the normative measurement contract lives in [`../../../system-deep-loop/shared/behavior-benchmark/framework.md`](../../../system-deep-loop/shared/behavior-benchmark/framework.md).*

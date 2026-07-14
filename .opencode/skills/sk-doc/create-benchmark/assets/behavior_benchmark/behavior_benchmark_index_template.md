---
title: "Behavior Benchmark Index Template"
description: "Fillable scaffold for a behavior_benchmark package index — the behavior_benchmark.md that lists the scenario contracts, names the shared framework as its governing measurement contract, and reports axis coverage for one deep-loop mode."
trigger_phrases:
  - "behavior benchmark index template"
  - "behavior_benchmark.md scaffold"
  - "behavior benchmark package index"
  - "behavior scenario table template"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for a behavior_benchmark PACKAGE INDEX:
  <deep-loop-mode>/behavior_benchmark/behavior_benchmark.md

Usage:
  1. cp this file to that path, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/behavior_benchmark/behavior_benchmark_index_template.md \
        .opencode/skills/system-deep-loop/<mode>/behavior_benchmark/behavior_benchmark.md
  2. DELETE the "version:" line below. A shipped behavior_benchmark index carries
     the five frontmatter fields shown (title / description / trigger_phrases /
     importance_tier / contextType) and NO version field: it is a memory-indexed
     DATA artifact outside the references/** and assets/** version-scope defined
     in ../../../shared/references/frontmatter_versioning.md §1, not a versioned
     reference doc.
  3. Fill every {{PLACEHOLDER}} and remove every <!-- guidance --> comment.
  4. Author one scenarios/<PREFIX>-NNN-<slug>.md per row (scenario template) and one
     baselines/claude-baseline.md (baseline template). Keep the SCENARIO TABLE and the
     scenario files in exact sync — same IDs, entry surfaces, clarity, expected
     interaction, and budgets.

The normative measurement contract (rubric, buckets, budget formula, ID prefixes)
is NOT restated here — it lives once in:
  .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md
-->

## 1. OVERVIEW

<!-- OPTIONAL availability blockquote: include ONLY when the invocation surface
     (command / LEAF agent) is planned-but-not-built, and delete it once the
     surface ships. Delete this whole blockquote if the surface already exists. -->
> **Availability.** {{ONE_LINE_BUILD_STATE_OF_THE_INVOCATION_SURFACE_AND_WHAT_IS_ALREADY_RUNNABLE}}

This package specifies what an executor **model** should do once the
`{{INVOCATION_SURFACE}}` surface is triggered with a realistic user prompt. It is
a `behavior_benchmark` package carried by the `{{MODE}}` mode-packet, alongside
the packages the sibling deep-loop workflow sub-skills carry; the single-source
measurement contract it instantiates is
[../../shared/behavior-benchmark/framework.md](../../../../system-deep-loop/shared/behavior-benchmark/framework.md),
which is normative — where this index or a scenario note diverges, that framework
prevails. Each scenario here is a self-contained run contract scored on the
framework's five-dimension rubric and classified into exactly one terminal bucket.

The scenarios do not re-probe generic routing behavior the sibling packages
already cover; they concentrate on the behaviors **distinctive to `{{MODE}}`** —
{{ONE_LINE_LIST_OF_THE_DISTINCTIVE_INVARIANTS_OR_BEHAVIORS_WITH_SKILL_MD_OR_REFERENCE_CITES}}.

### Framework extensions this package declares

<!-- List ONLY the framework fields this package assigns a value the framework's
     own tables do not yet enumerate. Each MUST be grounded in the shipped mode,
     not invented for the benchmark. Delete this whole subsection if the package
     introduces no extensions (mode already in the enum AND prefix already in the
     ID-prefix table). -->

- **`mode: "{{MODE}}"`** — {{WHERE_THIS_MODE_VALUE_IS_ALREADY_CARRIED_IN_THE_SHIPPED_MODE_AND_WHY_IT_EXTENDS_THE_FRAMEWORK_ENUM}}
- **ID prefix `{{PREFIX}}`** ({{PREFIX_EXPANSION}}) — extends the framework's fixed per-package prefix table.

## 2. SCENARIO TABLE

<!-- One row per scenario file. Entry ∈ {E1,E2,E3,E4}; Clarity ∈ {C1,C2,C3};
     Expected ∈ {autonomous, question_halt}; Budget is the provisional
     framework-floor value until a baseline lands (question_halt 300000,
     autonomous 900000 are the usual floors — confirm against framework.md). -->

| ID | Title | Entry | Clarity | Expected | Budget |
| --- | --- | --- | --- | --- | --- |
| {{PREFIX}}-001 | {{SCENARIO_1_TITLE}} | {{E}} | {{C}} | {{EXPECTED}} | {{BUDGET_MS}} |
| {{PREFIX}}-002 | {{SCENARIO_2_TITLE}} | {{E}} | {{C}} | {{EXPECTED}} | {{BUDGET_MS}} |
| {{PREFIX}}-NNN | {{ADD_ONE_ROW_PER_SCENARIO}} | {{E}} | {{C}} | {{EXPECTED}} | {{BUDGET_MS}} |

## 3. AXIS COVERAGE

<!-- State the coverage the table achieves, as prose. Report entry-surface counts,
     clarity counts, which invariants/boundaries are isolated in which cells, and
     which axes are intentionally NOT exercised (with a one-line reason). This is
     the section a reviewer reads to confirm the matrix is not lopsided. -->

Entry-surface coverage: {{E1_COUNT_AND_CELLS}}, {{E2_COUNT_AND_CELLS}}, {{E3_COUNT_AND_CELLS}}, {{E4_COUNT_AND_CELLS}}. Clarity coverage: {{C1_COUNT_AND_CELLS}}, {{C2_COUNT_AND_CELLS}}, {{C3_COUNT_AND_CELLS}} — {{ONE_LINE_ON_WHETHER_THE_MATRIX_EXERCISES_UNDER_SPECIFIED_INPUT_NOT_JUST_THE_FULLY_PINNED_PATH}}. Invariant coverage: {{WHICH_MODE_INVARIANT_IS_ISOLATED_IN_WHICH_CELL}}. Boundary coverage: {{WHICH_DECLINE_OR_BOUNDARY_CELLS_GUARD_WHICH_ADJACENT_MODE}}.

{{ONE_PARAGRAPH_NAMING_ANY_AXIS_INTENTIONALLY_NOT_EXERCISED_AND_WHY_E_G_E4_ALREADY_COVERED_BY_SIBLINGS}}

## 4. EXECUTION

The runner is
[../../shared/behavior-benchmark/behavior-bench-run.cjs](../../../../system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs),
invoked per cell as one run of one scenario contract against one executor, with
the scenario's `fixture` absorbing all writes for the run. Checkpoint and
delegation-evidence extraction, the no-progress watchdog, scoring, and
classification are owned by that runner; results are emitted as result JSON with
`schemaVersion: 1`. Run evidence — transcripts, result JSONs, scorecards — lands
in the **spec packet phase that executed the round**, never inside this package;
a result cited from this index must point to its evidence in that executing phase.

**Fixtures and configs are provisioned by the executing round, not shipped in this
package** (the package holds the contract; the packet holds the proof). Each
scenario names the `fixture` directory it binds{{AND_ANY_CONFIG_FILE_IT_CONSUMES}};
the executing round provisions that directory with the corpus each cell's body
describes. Per-scenario baseline checkpoints live in
[./baselines/claude-baseline.md](./baselines/claude-baseline.md); until a Claude
leg has been captured, every cell's D5 is `null` and its `budget_ms` is the
framework-floor provisional value shown in the table above, not a baseline-derived
one.

## 5. RELATED RESOURCES

- [../../shared/behavior-benchmark/framework.md](../../../../system-deep-loop/shared/behavior-benchmark/framework.md) — the normative measurement contract this package instantiates (five-dimension rubric, terminal buckets, ID-prefix table, budget formula).
- [../../shared/behavior-benchmark/behavior-bench-run.cjs](../../../../system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs) — the runner that extracts checkpoints and delegation evidence, scores, and classifies each cell.
- [../README.md](../../README.md) — the mode README (its availability / build-state note for the invocation surface, when applicable).
- [../SKILL.md](../../SKILL.md) — the mode contract: state machine, delegation contract, and the invariants these scenarios probe.
- [./baselines/claude-baseline.md](./baselines/claude-baseline.md) — per-scenario Claude-leg baseline checkpoints.

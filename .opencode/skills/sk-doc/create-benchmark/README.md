# create-benchmark

Authors the two benchmark families: MCP promotion folders (`mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/`) and behavior_benchmark packages (`<mode>/behavior_benchmark/`) for deep-loop modes.

## 1. OVERVIEW

`create-benchmark` is a nested workflow packet of the `sk-doc` parent hub. It authors several distinct benchmark families:

- **MCP promotion benchmark** — moves a shipped spec packet's curated benchmark evidence into the consuming skill's `mcp_server/benchmarks/` tree so MCP operators find the winner, fixture, caveats, and replay commands without leaving the skill. `SKILL.md` sections 3 through 8 hold the contract.
- **Behavior benchmark** — authors a `<mode>/behavior_benchmark/` package (index, per-scenario machine contracts, and a Claude baseline) that specifies executor-model behavior at a deep-loop mode's invocation surface, governed by the shared measurement framework. `SKILL.md` section 9 and `references/behavior_benchmark/behavior_benchmark_guide.md` hold the contract.
- **Skill-benchmark (Lane C)** — authors a hub's `benchmark/` storage tree and its `benchmark/README.md` run-label index; the per-run `skill-benchmark-report.md` is a renderer-owned render this packet never authors. `SKILL.md` section 10 and `references/skill_benchmark/skill_benchmark_storage_guide.md` hold the contract.
- **Model-benchmark (Lane B)** — authors the Lane B input fixtures (code-task oracle, pattern/capability, reviewer-prompt) and run profiles; the evaluator, scorers, and reviewer-verdict contract stay lane-local. `SKILL.md` section 11 and `references/model_benchmark/model_benchmark_fixture_guide.md` hold the contract.

Lane A (agent-improvement) and Lane D (non-dev AI-system improvement) are code-owned families named only for router disambiguation; this packet does not template them.

The skill-local surface is the look-here-first entry point; the full audit trail stays in the owning spec packet or lane. `SKILL.md` is the authoritative contract.

## 2. WHEN TO USE

Use this packet when a completed MCP benchmark or bake-off needs to move into the consuming skill tree, when a deep-loop mode needs a behavior_benchmark package, when a hub needs a skill-benchmark storage tree or index, or when a Lane B model-benchmark needs input fixtures or a run profile.

MCP promotion jobs:

- Create or update `benchmark_report.md` with the fixed ten-section benchmark narrative.
- Create `SOURCE.md` as the wayfinding pointer back to the authoritative spec packet.
- Copy benchmark artifacts such as `results.csv`, `per-probe.jsonl`, or `runtime-measurements.md`.
- Update the consuming skill's `mcp_server/benchmarks/README.md` index row.
- Mark a prior benchmark as re-run or retired without losing the original folder.

Behavior benchmark jobs:

- Author or extend a `behavior_benchmark` package for a deep-loop mode: a `behavior_benchmark.md` index, per-scenario `<PREFIX>-NNN-<slug>.md` machine contracts, and a `baselines/claude-baseline.md`.
- Design the entry-surface and clarity scenario matrix for a mode's executor behavior.

Skill-benchmark jobs (Lane C):

- Author or update a hub's `benchmark/README.md` run-label index, one row per run-label folder on disk.
- Establish the `benchmark/` storage convention — sibling run-label folders and the frozen `baseline/` anchor — for a skill or hub.

Model-benchmark jobs (Lane B):

- Author a Lane B input fixture: a code-task oracle, a pattern/capability evidence contract, or a reviewer-prompt fixture.
- Author or extend a run profile that selects fixtures, models, frameworks, scoring, and the gate.

Do not use it for in-progress MCP benchmarks, speculative benchmark design, release notes, changelog rows, or one-off unreplayable measurements. Do not hand-author a `skill-benchmark-report.md` (renderer-owned) or any scoring/evaluator/reviewer contract (lane-local in deep-improvement).

## 3. WHAT'S INSIDE

Packet root:

- `SKILL.md` — authoritative workflow contract.
- `README.md` — human orientation for this packet.
- `changelog/.gitkeep` — packet-local changelog placeholder.

References:

- `references/shared/README.md` — overflow route-map to case studies, the report worked example, and common pitfalls. `SKILL.md` is the authoritative contract.
- `references/behavior_benchmark/behavior_benchmark_guide.md` — end-to-end guide for authoring a behavior_benchmark package: what it measures, package layout, scenario-matrix design, naming, and validation.
- `references/skill_benchmark/skill_benchmark_storage_guide.md` — storage convention for a hub's `benchmark/` tree: run-label naming, the frozen `baseline/` anchor, and the renderer-owned report boundary.
- `references/model_benchmark/model_benchmark_fixture_guide.md` — authoring guide for Lane B inputs: the fixture-family taxonomy, profile shape, and the lane boundary for scoring.

Assets:

- `assets/shared/benchmark_report_template.md` — template for the ten-section `benchmark_report.md`.
- `assets/shared/source_template.md` — template for the `SOURCE.md` wayfinding file.
- `assets/behavior_benchmark/behavior_benchmark_index_template.md` — template for a `behavior_benchmark.md` package index.
- `assets/behavior_benchmark/behavior_benchmark_scenario_template.md` — template for one `<PREFIX>-NNN-<slug>.md` scenario contract.
- `assets/behavior_benchmark/behavior_benchmark_baseline_template.md` — template for `baselines/claude-baseline.md`.
- `assets/skill_benchmark/skill_benchmark_readme_template.md` — template for a hub `benchmark/README.md` run-label index (skill-benchmark).
- `assets/model_benchmark/model_benchmark_code_task_fixture_template.md` — template for one code-task oracle fixture (model-benchmark).
- `assets/model_benchmark/model_benchmark_pattern_fixture_template.md` — template for a pattern/capability or reviewer-prompt fixture (model-benchmark).
- `assets/model_benchmark/model_benchmark_profile_template.md` — template for a Lane B run profile (model-benchmark).

Scripts:

- No packet-local `scripts/` directory is present.
- Use the shared sk-doc validators from `../shared/scripts/`, especially `validate_document.py`.

Shared resources loaded by the workflow:

- `../shared/references/quick_reference.md`
- `../shared/references/validation.md`
- `../shared/references/evergreen_packet_id_rule.md` when runtime-doc packet references matter.
- `../shared/references/core_standards.md` and `../shared/assets/frontmatter_templates.md` when style or frontmatter questions arise.

## 4. QUICK START

Example target shape inside a consuming skill:

```text
mcp_server/benchmarks/
├── README.md
└── benchmark-2026-07-06/
    ├── benchmark_report.md
    ├── SOURCE.md
    ├── results.csv
    ├── per-probe.jsonl
    └── runtime-measurements.md
```

Basic flow:

1. Confirm the source spec packet has an accepted decision record, stable headline, stable fixture, replay commands, and defensible winner or provisional status.
2. Read `SKILL.md` for the authoritative workflow; consult `references/shared/README.md` for case studies and the worked example.
3. Create the dated folder using the benchmark execution date, not the authoring date.
4. Copy the source artifacts that support the decision.
5. Write `benchmark_report.md` from `assets/shared/benchmark_report_template.md`.
6. Write `SOURCE.md` from `assets/shared/source_template.md`.
7. Update `mcp_server/benchmarks/README.md` with the benchmark index row.
8. Validate authored markdown with the shared sk-doc validator.

## 5. HUB RELATIONSHIP

`create-benchmark` is a nested workflow packet of the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`.

The single advisor identity, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` live at the `sk-doc` hub root.

Do not add packet-local `graph-metadata.json`; benchmark authoring logic belongs in this packet, while cross-cutting quality rules stay in the shared backbone.

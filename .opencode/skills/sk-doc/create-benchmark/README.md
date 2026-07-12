# create-benchmark

Authors the two benchmark families: MCP promotion folders (`mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/`) and behavior_benchmark packages (`<mode>/behavior_benchmark/`) for deep-loop modes.

## 1. OVERVIEW

`create-benchmark` is a nested workflow packet of the `sk-doc` parent hub. It authors two distinct benchmark families:

- **MCP promotion benchmark** — moves a shipped spec packet's curated benchmark evidence into the consuming skill's `mcp_server/benchmarks/` tree so MCP operators find the winner, fixture, caveats, and replay commands without leaving the skill. `SKILL.md` sections 2 through 7 hold the contract.
- **Behavior benchmark** — authors a `<mode>/behavior_benchmark/` package (index, per-scenario machine contracts, and a Claude baseline) that specifies executor-model behavior at a deep-loop mode's invocation surface, governed by the shared measurement framework. `SKILL.md` section 8 and `references/behavior_benchmark_guide.md` hold the contract.

The skill-local folder is the look-here-first surface; the full audit trail stays in the spec packet under `.opencode/specs/`. `SKILL.md` is the authoritative contract.

## 2. WHEN TO USE

Use this packet when a completed MCP benchmark or bake-off needs to move into the consuming skill tree, or when a deep-loop mode needs a behavior_benchmark package.

MCP promotion jobs:

- Create or update `benchmark_report.md` with the fixed ten-section benchmark narrative.
- Create `SOURCE.md` as the wayfinding pointer back to the authoritative spec packet.
- Copy benchmark artifacts such as `results.csv`, `per-probe.jsonl`, or `runtime-measurements.md`.
- Update the consuming skill's `mcp_server/benchmarks/README.md` index row.
- Mark a prior benchmark as re-run or retired without losing the original folder.

Behavior benchmark jobs:

- Author or extend a `behavior_benchmark` package for a deep-loop mode: a `behavior_benchmark.md` index, per-scenario `<PREFIX>-NNN-<slug>.md` machine contracts, and a `baselines/claude-baseline.md`.
- Design the entry-surface and clarity scenario matrix for a mode's executor behavior.

Do not use it for in-progress MCP benchmarks, speculative benchmark design, release notes, changelog rows, or one-off unreplayable measurements.

## 3. WHAT'S INSIDE

Packet root:

- `SKILL.md` — authoritative workflow contract.
- `README.md` — human orientation for this packet.
- `changelog/.gitkeep` — packet-local changelog placeholder.

References:

- `references/README.md` — overflow route-map to case studies, the report worked example, and common pitfalls. `SKILL.md` is the authoritative contract.
- `references/behavior_benchmark_guide.md` — end-to-end guide for authoring a behavior_benchmark package: what it measures, package layout, scenario-matrix design, naming, and validation.

Assets:

- `assets/benchmark_report_template.md` — template for the ten-section `benchmark_report.md`.
- `assets/source_template.md` — template for the `SOURCE.md` wayfinding file.
- `assets/behavior_benchmark_index_template.md` — template for a `behavior_benchmark.md` package index.
- `assets/behavior_benchmark_scenario_template.md` — template for one `<PREFIX>-NNN-<slug>.md` scenario contract.
- `assets/behavior_benchmark_baseline_template.md` — template for `baselines/claude-baseline.md`.

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
2. Read `SKILL.md` for the authoritative workflow; consult `references/README.md` for case studies and the worked example.
3. Create the dated folder using the benchmark execution date, not the authoring date.
4. Copy the source artifacts that support the decision.
5. Write `benchmark_report.md` from `assets/benchmark_report_template.md`.
6. Write `SOURCE.md` from `assets/source_template.md`.
7. Update `mcp_server/benchmarks/README.md` with the benchmark index row.
8. Validate authored markdown with the shared sk-doc validator.

## 5. HUB RELATIONSHIP

`create-benchmark` is a nested workflow packet of the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`.

The single advisor identity, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` live at the `sk-doc` hub root.

Do not add packet-local `graph-metadata.json`; benchmark authoring logic belongs in this packet, while cross-cutting quality rules stay in the shared backbone.

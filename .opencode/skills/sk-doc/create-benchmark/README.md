# create-benchmark

Promotes curated MCP benchmark evidence into a skill-local `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` operator record.

## When To Use

Use this packet when a completed MCP benchmark or bake-off needs to move from a shipped spec packet into the consuming skill tree.

Typical jobs:

- Create or update `benchmark_report.md` with the fixed ten-section benchmark narrative.
- Create `SOURCE.md` as the wayfinding pointer back to the authoritative spec packet.
- Copy benchmark artifacts such as `results.csv`, `per-probe.jsonl`, or `runtime-measurements.md`.
- Update the consuming skill's `mcp_server/benchmarks/README.md` index row.
- Mark a prior benchmark as re-run or retired without losing the original folder.

Do not use it for in-progress benchmarks, speculative benchmark design, release notes, changelog rows, or one-off unreplayable measurements.

## What's Inside

Packet root:

- `SKILL.md` — authoritative workflow contract.
- `README.md` — human orientation for this packet.
- `changelog/.gitkeep` — packet-local changelog placeholder.

References:

- `references/benchmark_creation.md` — detailed benchmark-promotion guidance and report structure.

Assets:

- `assets/benchmark/benchmark_report_template.md` — template for the ten-section `benchmark_report.md`.
- `assets/benchmark/source_template.md` — template for the `SOURCE.md` wayfinding file.

Scripts:

- No packet-local `scripts/` directory is present.
- Use the shared sk-doc validators from `../shared/scripts/`, especially `validate_document.py`.

Shared resources loaded by the workflow:

- `../shared/references/global/quick_reference.md`
- `../shared/references/global/validation.md`
- `../shared/references/global/evergreen_packet_id_rule.md` when runtime-doc packet references matter.
- `../shared/references/global/core_standards.md` and `../shared/assets/frontmatter_templates.md` when style or frontmatter questions arise.

## Quick Start

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
2. Read `references/benchmark_creation.md`.
3. Create the dated folder using the benchmark execution date, not the authoring date.
4. Copy the source artifacts that support the decision.
5. Write `benchmark_report.md` from `assets/benchmark/benchmark_report_template.md`.
6. Write `SOURCE.md` from `assets/benchmark/source_template.md`.
7. Update `mcp_server/benchmarks/README.md` with the benchmark index row.
8. Validate authored markdown with the shared sk-doc validator.

## Hub Relationship

`create-benchmark` is a nested workflow packet of the `sk-doc` parent hub.

The shared doc-quality backbone lives at `../shared`.

The single advisor identity, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` live at the `sk-doc` hub root.

Do not add packet-local `graph-metadata.json`; benchmark authoring logic belongs in this packet, while cross-cutting quality rules stay in the shared backbone.

# create-benchmark

Authors MCP-promotion, behavior, conformance, skill-benchmark, and model-benchmark artifacts, and hosts an authoring guide for the Lane A code-owned family.

## 1. OVERVIEW

`create-benchmark` is a nested workflow packet of the `sk-doc` parent hub. It authors several distinct benchmark families:

- **MCP promotion benchmark** — moves a shipped spec packet's curated benchmark evidence into the consuming skill's `mcp-server/benchmarks/` tree so MCP operators find the winner, fixture, caveats, and replay commands without leaving the skill. `SKILL.md` sections 3 through 8 hold the contract.
- **Behavior benchmark** — authors a `<mode>/behavior-benchmark/` package (index, per-scenario machine contracts, and a Claude baseline) that specifies executor-model behavior at a deep-loop mode's invocation surface, governed by the shared measurement framework. `SKILL.md` section 9 and `references/behavior-benchmark/behavior-benchmark-guide.md` hold the contract.
- **Conformance benchmark** — authors a `<mode>/assets/conformance-benchmark/<benchmark-id>/` package containing a family index, benchmark contract, lane config, and fixture manifest for a deterministic deep-alignment peer-adapter check. It validates the inputs and stops without invoking the adapter or deep-alignment. `SKILL.md` section 12 and `references/conformance-benchmark/conformance-benchmark-authoring-guide.md` hold the contract.
- **Skill-benchmark (Lane C)** — authors a hub's `benchmark/` storage tree and its `benchmark/README.md` run-label index; the per-run `skill-benchmark-report.md` is a renderer-owned render this packet never authors. `SKILL.md` section 10 and `references/skill-benchmark/skill-benchmark-storage-guide.md` hold the contract.
- **Model-benchmark (Lane B)** — authors the Lane B input fixtures (code-task oracle, pattern/capability, reviewer-prompt) and run profiles; the evaluator, scorers, and reviewer-verdict contract stay lane-local. `SKILL.md` section 11 and `references/model-benchmark/model-benchmark-fixture-guide.md` hold the contract.

One further family — Lane A (agent-improvement) — carries an authoring guide here (`SKILL.md` section 14); its code-owned artifacts stay in-lane.

The skill-local surface is the look-here-first entry point; the full audit trail stays in the owning spec packet or lane. `SKILL.md` is the authoritative contract.

### Family Keys

Six families, keyed by their on-disk asset/reference subdirectory. `SKILL.md` section 2 names these the same way and adds the Section / Lives-at / Owns-vs-routes columns; this table is the on-disk-key lookup:

| Family | On-disk key | Assets/references live under |
| --- | --- | --- |
| MCP promotion | `shared` | `assets/shared/`, `references/shared/` |
| Behavior benchmark | `behavior_benchmark` | `assets/behavior-benchmark/`, `references/behavior-benchmark/` |
| Conformance benchmark | `conformance_benchmark` | `assets/conformance-benchmark/`, `references/conformance-benchmark/` |
| Skill-benchmark (Lane C) | `skill_benchmark` | `assets/skill-benchmark/`, `references/skill-benchmark/` |
| Model-benchmark (Lane B) | `model_benchmark` | `assets/model-benchmark/`, `references/model-benchmark/` |
| Agent-improvement (Lane A) | `agent_improvement` | `references/agent-improvement/` (guide only — assets: N/A, code-owned in-lane) |

## 2. WHEN TO USE

Use this packet when a completed MCP benchmark or bake-off needs to move into the consuming skill tree, when a deep-loop mode needs a behavior-benchmark package, when deterministic artifact conformance needs a peer-adapter input package, when a hub needs a skill-benchmark storage tree or index, or when a Lane B model-benchmark needs input fixtures or a run profile.

MCP promotion jobs:

- Create or update `benchmark-report.md` with the fixed ten-section benchmark narrative.
- Create `source.md` as the wayfinding pointer back to the authoritative spec packet.
- Copy benchmark artifacts such as `results.csv`, `per-probe.jsonl`, or `runtime-measurements.md`.
- Update the consuming skill's `mcp-server/benchmarks/README.md` index row.
- Mark a prior benchmark as re-run or retired without losing the original folder.

Behavior benchmark jobs:

- Author or extend a `behavior-benchmark` package for a deep-loop mode: a `behavior-benchmark.md` index, per-scenario `<PREFIX>-NNN-<slug>.md` machine contracts, and a `baselines/claude-baseline.md`.
- Design the entry-surface and clarity scenario matrix for a mode's executor behavior.

Conformance benchmark jobs:

- Author or update a family `README.md`, per-benchmark `conformance-benchmark.md`, `lane-config.json`, and `fixtures/fixture-manifest.json` under an owning mode's `assets/conformance-benchmark/` tree.
- Validate the authored Markdown and JSON, reconcile package paths and evidence pointers, and hand execution to the owning deep-alignment lane without invoking it.

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
- `changelog/` — packet-local version history (`v1.0.0.0.md` through `v1.4.0.0.md`).

References:

- `references/shared/README.md` — overflow route-map to case studies, the report worked example, and common pitfalls. `SKILL.md` is the authoritative contract.
- `references/behavior-benchmark/behavior-benchmark-guide.md` — end-to-end guide for authoring a `behavior-benchmark` package: what it measures, package layout, scenario-matrix design, naming, and validation.
- `references/conformance-benchmark/conformance-benchmark-authoring-guide.md` — authoring guide for deterministic peer-adapter packages, fixture independence, deep-alignment handoff, and the no-execution boundary.
- `references/skill-benchmark/skill-benchmark-storage-guide.md` — storage convention for a hub's `benchmark/` tree: run-label naming, the frozen `baseline/` anchor, and the renderer-owned report boundary.
- `references/model-benchmark/model-benchmark-fixture-guide.md` — authoring guide for Lane B inputs: the fixture-family taxonomy, profile shape, and the lane boundary for scoring.
- `references/agent-improvement/agent-improvement-authoring-guide.md` — authoring guide for Lane A (agent-improvement) doc-only inputs: the improvement charter and strategy scaffolds, target-onboarding classification, and candidate proposal format.

Assets:

- `assets/shared/benchmark-report-template.md` — template for the ten-section `benchmark-report.md`.
- `assets/shared/source-template.md` — template for the `source.md` wayfinding file.
- `assets/behavior-benchmark/behavior-benchmark-index-template.md` — template for a `behavior-benchmark.md` package index.
- `assets/behavior-benchmark/behavior-benchmark-scenario-template.md` — template for one `<PREFIX>-NNN-<slug>.md` scenario contract.
- `assets/behavior-benchmark/behavior-benchmark-baseline-template.md` — template for `baselines/claude-baseline.md`.
- `assets/conformance-benchmark/conformance-benchmark-readme-template.md` — template for the family `README.md` index.
- `assets/conformance-benchmark/conformance-benchmark-contract-template.md` — template for one `conformance-benchmark.md` contract.
- `assets/conformance-benchmark/conformance-benchmark-lane-config-template.md` — source for a shipped one-lane `lane-config.json`.
- `assets/conformance-benchmark/conformance-benchmark-fixture-manifest-template.md` — source for a shipped `fixtures/fixture-manifest.json`.
- `assets/skill-benchmark/skill-benchmark-readme-template.md` — template for a hub `benchmark/README.md` run-label index (skill-benchmark).
- `assets/model-benchmark/model-benchmark-code-task-fixture-template.md` — template for one code-task oracle fixture (model-benchmark).
- `assets/model-benchmark/model-benchmark-pattern-fixture-template.md` — template for a pattern/capability or reviewer-prompt fixture (model-benchmark).
- `assets/model-benchmark/model-benchmark-profile-template.md` — template for a Lane B run profile (model-benchmark).

Scripts:

- No packet-local `scripts/` directory is present.
- Use the shared sk-doc validators from `../shared/scripts/`, especially `validate_document.py`.

Shared resources loaded by the workflow:

- `../shared/references/quick-reference.md`
- `../shared/references/validation.md`
- `../shared/references/evergreen-packet-id-rule.md` when runtime-doc packet references matter.
- `../shared/references/core-standards.md` and `../shared/assets/frontmatter-templates.md` when style or frontmatter questions arise.

## 4. QUICK START

Example target shape inside a consuming skill:

```text
mcp-server/benchmarks/
├── README.md
└── benchmark-2026-07-06/
    ├── benchmark-report.md
    ├── source.md
    ├── results.csv
    ├── per-probe.jsonl
    └── runtime-measurements.md
```

Basic flow:

1. Confirm the source spec packet has an accepted decision record, stable headline, stable fixture, replay commands, and defensible winner or provisional status.
2. Read `SKILL.md` for the authoritative workflow; consult `references/shared/README.md` for case studies and the worked example.
3. Create the dated folder using the benchmark execution date, not the authoring date.
4. Copy the source artifacts that support the decision.
5. Write `benchmark-report.md` from `assets/shared/benchmark-report-template.md`.
6. Write `source.md` from `assets/shared/source-template.md`.
7. Update `mcp-server/benchmarks/README.md` with the benchmark index row.
8. Validate authored markdown with the shared sk-doc validator.

The source template paths listed above retain underscore names. Copied filesystem outputs use lowercase kebab-case, and machine family keys in router/config data remain idiomatic snake_case.

## 5. HUB RELATIONSHIP

`create-benchmark` is a nested workflow packet of the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`.

The single advisor identity, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` live at the `sk-doc` hub root.

Do not add packet-local `graph-metadata.json`; benchmark authoring logic belongs in this packet, while cross-cutting quality rules stay in the shared backbone.

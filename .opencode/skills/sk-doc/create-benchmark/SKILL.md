---
name: create-benchmark
description: Author MCP-promotion, behavior, conformance, skill-benchmark, and model-benchmark artifacts; route the Lane A authoring guide.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.4.0.0
---

<!-- Keywords: create-benchmark, benchmark-report.md, source.md, mcp_server benchmarks, benchmark promotion, skill-local benchmark, MCP bake-off, benchmark folder, behavior benchmark, behavior-benchmark.md, behavior_benchmark, conformance benchmark, conformance_benchmark, peer adapter benchmark, deep-alignment benchmark, lane-config benchmark, sk-doc-command, scenario contract, DAB scenario, behavior-benchmark framework, claude-baseline, skill-benchmark, benchmark/README.md, run-label folder, skill-benchmark-report, Lane C benchmark, model-benchmark, benchmark fixture, benchmark profile, code-task oracle fixture, reviewer-prompt fixture, Lane B fixture, command benchmark, command-benchmark, command surface benchmark, command benchmark matrix -->

# create-benchmark

`create-benchmark` is the `sk-doc` benchmark-authoring packet. It covers:

- **MCP promotion** — promote curated evidence from a shipped spec packet into a consuming skill's `mcp-server/benchmarks/benchmark-<YYYY-MM-DD>/`, including winner, fixture, caveats, replay commands, and source pointer (§3-8).
- **Behavior** — author a `<mode>/behavior-benchmark/` index, scenario contracts, and Claude baseline under the shared measurement framework (§9).
- **Conformance** — author `<mode>/assets/conformance-benchmark/<benchmark-id>/` inputs for deterministic peer-adapter checks without running them (§12).
- **Skill-benchmark (Lane C)** — author `benchmark/` storage and its `benchmark/README.md` run-label index; never author renderer-owned `skill-benchmark-report.md` (§10).
- **Model-benchmark (Lane B)** — author code-task, pattern/capability, and reviewer-prompt fixtures plus run profiles; evaluators, scorers, and verdict contracts stay lane-local (§11).

Lane A agent-improvement gets an authoring guide here (§14); its artifacts remain code-owned in-lane.

The skill-local surface is the look-here-first entry point, not the archive.

---

## 1. WHEN TO USE

Use this packet to author completed benchmark evidence or benchmark inputs into the skill tree. Route through §2 first; families are distinct.

### Activation Triggers

- **MCP promotion** (on-disk `shared`; §3-8) — promote a completed MCP benchmark from a spec packet: author the ten-section `benchmark-report.md` and `source.md`, copy `results.csv`, applicable `per-probe.jsonl` and runtime sidecars into a dated folder, then update `benchmarks/README.md`.
- **Behavior benchmark** (§9) — author or extend a deep-loop mode's index, `<PREFIX>-NNN-<slug>.md` scenario contracts, baseline, and entry-surface/clarity matrix. Fixed prefixes are `research` (RSB), `review` (RVB), `ai-council` (ACB), `improvement` (IMB), and `alignment` (DAB); declare a new mode's prefix in the index OVERVIEW.
- **Conformance benchmark** (§12) — author the family index, contract, lane config, and fixture manifest for a deterministic peer-adapter or deep-alignment input package; aliases may retain `conformance_benchmark`.
- **Skill-benchmark** (§10) — establish Lane C sibling run-label folders with frozen `baseline/`, or author/update `benchmark/README.md`.
- **Model-benchmark** (§11) — author a code-task, pattern/capability, or reviewer-prompt fixture, or a profile selecting fixtures, models, frameworks, scoring, and gate.
- **Lane A guide** (§14) — author the `agent_improvement` guide; rubrics, configs, and templates stay in-lane.

Keyword triggers: `benchmark-report.md`, `source.md`, `mcp-server/benchmarks`, `MCP bake-off`; `behavior benchmark`, `behavior-benchmark.md`, `behavior_benchmark`, `scenario contract`, `claude-baseline`; `conformance benchmark`, `conformance_benchmark`, `peer adapter benchmark`, `deep-alignment benchmark`, `lane-config benchmark`, `sk-doc-command`; `skill-benchmark`, `benchmark/README.md`, `run-label folder`, `benchmark package`; `model-benchmark`, `benchmark fixture`, `benchmark profile`, `reviewer-prompt fixture`; `command benchmark`, `command-benchmark`, `command surface benchmark`, `command benchmark matrix`.

### Adoption Gate (MCP promotion)

Create a skill-local MCP-promotion folder only when all apply:

- The skill houses an MCP server under `mcp-server/`.
- It produces a measurable retrieval, quality, runtime, throughput, recall, hit-rate, latency, RAM, dimension, or similar numeric outcome.
- A benchmark run has already completed inside a spec packet.
- The headline belongs where MCP operators read code.
- A stable fixture, replay commands, and expected outcome make the run reproducible.
- The source packet has accepted ADRs or an accepted decision record.

Decision rule:

```text
Measurable retrieval surface + shipped spec packet with accepted ADRs + stable fixture?
  YES -> Create a benchmark folder
  NO  -> Keep results in the spec packet's evidence/ directory
```

### Trigger Signals

Signals that warrant MCP promotion:

- An accepted decision promoted a non-trivial default such as an embedder, reranker, retrieval pipeline, or runtime setting, and operators will ask why.
- Readers already need a deep spec path to find the numbers.
- The same comparison table would otherwise be duplicated, or a sibling skill has an analogous benchmark surface.

### When NOT to Use

Use another `sk-doc` packet when:

- The benchmark is still in progress or lacks an accepted decision record.
- The result is unreplayable: no stable fixture or replay commands.
- The skill lacks an MCP server or measurable retrieval, quality, runtime, or throughput surface.
- The user only needs a release note or changelog row. Use `create-changelog`.
- The user wants to audit, validate, score, or optimize existing benchmark markdown without authoring a benchmark-family artifact. Use `create-quality-control`.
- The task is a general benchmark design exercise rather than promotion of an already-curated run.
- A re-run confirms the same headline; update the existing `benchmark-report.md` with a re-run note instead.
- The result mixes data from different MCP stacks and asks for a single comparative verdict.
- The task hand-edits renderer-owned `skill-benchmark-report.md` or defines scoring (rubric, evaluator, reviewer verdict, D1-D5 weight). Scoring stays lane-local; this packet authors inputs, indexes, and reports (§10-11).
- A one-off experiment fits none of the six families, such as `sk-prompt/prompt-models/references/vision-audit-benchmark.md`. Keep it lane-local; there is no "misc" family.

If unsure, default to "not yet." Promote after rigor.

---

## 2. SMART ROUTING

### Benchmark Families

Route to the right family before authoring. The **OWNS** column is what this packet authors; **Routes to** names a lane-owned artifact (renderer, scoring contract, runner) for disambiguation only.

| Family | What it measures | Lives at | create-benchmark OWNS (here) | Routes to (lane-owned) | Section |
| --- | --- | --- | --- | --- | --- |
| MCP promotion (`shared`) | Retrieval / quality / runtime / throughput from a shipped MCP stack | `<skill>/mcp-server/benchmarks/benchmark-<YYYY-MM-DD>/` | `benchmark-report.md` + `source.md` templates and the report contract | Owned here | §3-8 |
| Behavior (`behavior_benchmark`) | Executor-model behavior at a deep-loop mode's invocation surface | `<mode>/behavior-benchmark/` | Index, scenario, and baseline templates + the authoring guide | Measurement contract → `system-deep-loop/shared/behavior-benchmark/framework.md` | §9 |
| Conformance (`conformance_benchmark`) | Deterministic artifact conformance against a named authority through a peer adapter | `<mode>/assets/conformance-benchmark/<benchmark-id>/` | README/index + contract + lane-config + fixture-manifest templates + guide | Adapter implementation, S-dimension/severity semantics, convergence, reducer/report → deep-alignment | §12 |
| Skill-benchmark (`skill_benchmark`, Lane C) | Whether a skill is well-routed, discoverable, efficient, and useful | `<skill>/benchmark/<run-label>/` | The storage guide + the hub `benchmark/README.md` index template | `skill-benchmark-report.md` render → `build-report.cjs`; D1-D5 scoring → deep-improvement `scoring-contract.md` | §10 |
| Model-benchmark (`model_benchmark`, Lane B) | What a model or prompt framework produces against a held-out oracle | `system-deep-loop/deep-improvement/assets/model-benchmark/` | Code-task, pattern/capability, and reviewer fixture templates + the profile template + the fixture guide | Evaluator / scorer / reviewer-verdict contract → deep-improvement lane | §11 |
| Agent-improvement (`agent_improvement`, Lane A) | An agent's quality across five dimensions | deep-improvement lane (in-lane) | Authoring guide ([guide](references/agent-improvement/agent-improvement-authoring-guide.md)) | Code-owned rubric/config; run by `/deep:agent-improvement` | §14 |

### Routing Decision

Route by the table. Never hand-write renderer-owned `skill-benchmark-report.md` or change lane-local scoring.

### Smart Router Pseudocode

Benchmark families are runtime keys. Use canonical `discover_markdown_resources()` and
`_guard_in_skill()` ([skill-smart-router.md](../create-skill/assets/skill/skill-smart-router.md));
only family keys and tiered fallback vary:

```python
DEFAULT_RESOURCE = "references/shared/README.md"
FAMILIES = ["behavior_benchmark", "conformance_benchmark", "skill_benchmark", "model_benchmark",
            "agent_improvement", "mcp_promotion"]
# Resource dirs are kebab-case; family keys remain snake_case machine identifiers.
# mcp_promotion templates live under shared/.
FAMILY_DISK_KEY = {"mcp_promotion": "shared"}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the benchmark family (MCP promotion, behavior, conformance, skill, model, agent)",
    "Confirm what is authored here vs lane-owned, then the storage location and run label",
    "For a command benchmark, author BOTH a behavior and a conformance package for the "
    "command surface and compose them via the matrix manifest "
    "(references/shared/command-benchmark-composition.md)",
]

COMMAND_BENCHMARK_GUIDES = ["references/behavior-benchmark/behavior-benchmark-guide.md",
                            "references/conformance-benchmark/conformance-benchmark-authoring-guide.md",
                            "references/shared/command-benchmark-composition.md"]

def route_benchmark_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    routing_key = get_routing_key(request, FAMILIES)

    # A command benchmark composes behavior and conformance; load both guides and
    # the matrix-binding standard. It stays out of FAMILIES.
    if is_command_benchmark_request(request):                    # Tier 0 (composite)
        for path in COMMAND_BENCHMARK_GUIDES:
            load_if_available(path, inventory, loaded, seen)
        return {"load_level": "COMMAND_BENCHMARK_COMPOSITE", "resources": loaded}

    if routing_key == "unknown":                                 # Tier 1
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK",
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded}

    disk_key = FAMILY_DISK_KEY.get(routing_key, routing_key.replace("_", "-"))
    keyed = sorted(p for p in inventory if p.startswith(
        (f"references/{disk_key}/", f"assets/{disk_key}/", "references/shared/")))
    if not keyed:                                                # Tier 2
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {"routing_key": routing_key,
                "notice": f"'{routing_key}' guide only; fixtures/scoring stay lane-owned", "resources": loaded}

    for path in keyed:                                           # Tier 3
        load_if_available(path, inventory, loaded, seen)
    return {"routing_key": routing_key, "resources": loaded}
```

### Command Benchmark (composition, not a family)

A "command benchmark" is not a seventh family. It composes one behavior package
and one conformance package over the OpenCode command surface, bound by a lane-owned
matrix manifest and reported without averaging. The standard and manifest fields are
in [`references/shared/command-benchmark-composition.md`](references/shared/command-benchmark-composition.md).
The Tier-0 branch loads both authoring guides plus that standard. Only an undetected,
vague request reaches the unknown checklist, which points to the same resources.

### Family Boundary

This packet owns authoring, not measurement contracts: rubrics, renderers, scorers, and evaluator/verdict contracts stay lane-local; Lane A gets only a guide template (`assets: N/A`). The advisor identity lives at the `sk-doc` root; never add packet-local `graph-metadata.json`.

---

## 3. REQUIRED PACKAGE SHAPE

Use this shape in the consuming skill:

```text
mcp-server/benchmarks/
├── README.md
└── benchmark-<YYYY-MM-DD>/
    ├── benchmark-report.md
    ├── results.csv
    ├── per-probe.jsonl
    ├── runtime-measurements.md
    └── source.md
```

Required and optional files:

| File | Required | Purpose |
| --- | --- | --- |
| `README.md` | Yes | Index of all benchmark folders in this skill |
| `benchmark-<YYYY-MM-DD>/` | One per promoted run | Dated subfolder using the benchmark execution date |
| `benchmark-report.md` | Yes | Ten-section operator-facing report |
| `results.csv` | Yes | Primary aggregate metrics, one row per candidate |
| `per-probe.jsonl` | When applicable | Per-query or per-probe rows |
| `runtime-measurements.md` | Optional | RAM, GPU, latency, cold-load, or runtime profile worth promoting |
| `source.md` | Yes | Pointer back to the authoritative spec packet |

`source.md` is navigation, not an audit duplicate. Include the packet path, purpose, question-to-file and evidence maps, follow-on and rename/renumber notes, and last-updated date.

Use `assets/shared/benchmark-report-template.md` for `benchmark-report.md` and `assets/shared/source-template.md` for `source.md`.

For case studies, the worked example, and pitfalls, use `references/shared/README.md`.

---

## 4. HOW IT WORKS: AUTHORING WORKFLOW

Complete these steps in order after the spec packet ships.

Before naming a folder, run label, fixture, profile, or report, validate its resolved path or slug. Do not pass machine keys such as `model_benchmark` as filesystem names.

```bash
python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <artifact-path-or-slug>
```

1. **Confirm the promotion gate.** Read `decision-record.md`, `implementation-summary.md`, and benchmark evidence. Require an accepted decision, stable headline and fixture, replay commands, and a defensible winner or explicit provisional status.
2. **Classify the task.** Decide whether this is a true promotion, a re-run update, or a retirement update.
3. **Confirm the target skill.** Verify the consuming skill has `mcp-server/` and an appropriate measurable MCP surface.
4. **Create or update the index.** Ensure `mcp-server/benchmarks/README.md` can hold date, folder link, winner/status, headline metric, and source path.
5. **Choose the dated folder.** Name it `benchmark-YYYY-MM-DD/` using the benchmark execution date, not the document authoring date.
6. **Copy source artifacts.** Copy aggregate CSV, applicable `per-probe.jsonl`, then only decision-relevant runtime or risk sidecars.
7. **Write `benchmark-report.md`.** Use the ten-section template. Generalize the headline; separate a non-obvious load-bearing insight from the winner.
8. **Write `source.md`.** Use the template with packet path, navigation and evidence maps, follow-on notes, and last-updated date.
9. **Update the README index row.** Add or update the row with date, folder link, winner or status, headline metric, and source packet path.
10. **Validate markdown.** Run `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type readme <file>` on `benchmark-report.md` and `benchmarks/README.md`; fix blockers.

### Authoring Order Rules

- Stabilize the headline and section structure before polishing prose.
- Write the load-bearing insight and caveats before recommendations.
- Validate before adding or finalizing the README index row.
- Keep raw evidence out of the report; curate and link through `source.md`.

### Artifact Sources

| Skill-local file | Source in spec packet |
| --- | --- |
| `benchmark-report.md` | Curated rewrite of `benchmark-results.md` or equivalent benchmark summary |
| `results.csv` | Copy of `evidence/*comparison*.csv` or topic equivalent |
| `per-probe.jsonl` | Copy of `evidence/*.jsonl` per-probe output when applicable |
| `runtime-measurements.md` | Curated rewrite or copy of runtime evidence when the profile affects the decision |
| `source.md` | Authored fresh; points back to the spec packet |

---

## 5. REPORT CONTRACT

Keep this fixed ten-section `benchmark-report.md` structure; never merge, reorder, or omit:

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

For an empty section, retain its header and write: `Not applicable to this bench. Reason: ...`

### Report Style

- Match sk-doc reference quality and frontmatter.
- Use H2 numbered headers with ALL CAPS section names.
- Use tables for data and fenced code blocks for verbatim commands.
- Keep slugs and anchors stable across revisions.
- Do not paste the full spec packet decision trail into the report.
- Do not compare numeric results across different MCP stacks as if equivalent.

### Headline Pattern

Use this shape near the top of the report:

```markdown
# <topic> bake-off: <date>

> Headline: `<winner>` + <pipeline-config> is the production default for `<MCP-stack>`.
> <primary-metric> <numeric-result>, <secondary-metric> <numeric-result>. Closes packet <packet-id>.
```

If the load-bearing insight differs from the winner, state it in Sections 1 and 6.

---

## 6. DATE AND NAMING CONVENTION

### Folder Names

- Use `benchmark-YYYY-MM-DD/` with the execution date, not authoring date.
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

For a re-run confirming the same headline, update the existing report with `Re-run YYYY-MM-DD`; do not create a folder.

### Retirement

Keep retired benchmarks. Mark `README.md` as `RETIRED` with date; add report date, reason, and replacement if any.

### Renamed or Renumbered Spec Packets

Do not rename the dated folder. Update `source.md`, report and README cross-links, then record old slug, new slug, and date in `source.md`.

---

## 7. RULES: AUTHORITY AND GATES

### Authority Hierarchy

When documents disagree:

1. Source spec packet `decision-record.md` and `implementation-summary.md` are authoritative.
2. Skill-local `benchmark-report.md` is the curated operator-facing summary.
3. Copied CSV and JSONL files preserve the source packet evidence.
4. `source.md` is navigation, not a duplicate audit trail.

### ✅ ALWAYS

1. Read the source packet decision record, implementation summary, and benchmark evidence before writing.
2. Use the benchmark execution date for `benchmark-<YYYY-MM-DD>/`.
3. Keep `source.md` lean and navigational.
4. Include caveats for single-run signal, fixture limits, stack mismatch, schema migration cost, and reranker/runtime confounds when present.
5. Preserve retired benchmark folders.
6. Validate authored markdown before delivery.

### ⛔ NEVER

1. Never promote an in-flight benchmark as a final skill-local record.
2. Never compare numeric results across different MCP stacks as if equivalent.
3. Never paste the full spec packet audit trail into `benchmark-report.md`.
4. Never create a new dated folder for a confirming re-run.
5. Never name the folder by authoring date, source packet slug, or candidate name.
6. Never leave template placeholders in shipped benchmark files.
7. Never add packet-local `graph-metadata.json`.

### ⚠️ ESCALATE IF

1. The source packet has no accepted decision record or stable benchmark headline.
2. The target skill lacks `mcp-server/` or an appropriate measurable MCP surface.
3. Source artifacts are missing, non-replayable, or internally contradictory.
4. The benchmark spans multiple stacks and the user wants a single comparative verdict.
5. Validation fails on required markdown structure after local fixes.

---

## 8. SUCCESS CRITERIA

- The consuming skill has a dated `mcp-server/benchmarks/benchmark-<YYYY-MM-DD>/` folder.
- `benchmark-report.md` uses the ten-section structure and includes winner or status, aggregate table, methodology, candidate profiles, findings, caveats, recommendations, replay commands, and cross-links.
- `source.md` points to the authoritative spec packet and maps reader questions to source files.
- Raw artifacts are copied or intentionally omitted with a documented reason.
- The benchmarks README index links the new folder and source packet.
- Shared sk-doc validation passes for authored markdown, or any remaining issue is escalated with exact command output.

---

## 9. BEHAVIOR BENCHMARK PACKAGES

Behavior benchmarks are run contracts, not numeric MCP bake-offs. They specify
whether a realistic prompt makes an executor model dispatch the mode's LEAF agent,
ask one consolidated setup question when under-specified, respect invariants, and
finish relative to a Claude reference leg.

The authoring path, matrix rules, and naming live in
[`references/behavior-benchmark/behavior-benchmark-guide.md`](references/behavior-benchmark/behavior-benchmark-guide.md).
The normative five-dimension rubric, terminal buckets, budget formula, entry-surface
and clarity enums, and ID prefixes live only in
[`../../system-deep-loop/shared/behavior-benchmark/framework.md`](../../system-deep-loop/shared/behavior-benchmark/framework.md).
Instantiate that framework; do not redefine it.

### Package Shape

Author this shape inside the owning deep-loop mode-packet:

```text
<mode>/behavior-benchmark/
├── behavior-benchmark.md          # package index: scenario table + axis coverage
├── scenarios/
│   └── <PREFIX>-NNN-<slug>.md     # one machine-contract file per scenario
└── baselines/
    └── claude-baseline.md         # per-scenario Claude-leg reference checkpoints
```

Do not ship fixtures, lane configs, transcripts, result JSON, or scorecards here.
The executing packet provisions fixtures and holds proof; this package is the contract.

### Templates, Workflow, and Naming

Load the [behavior-benchmark guide](references/behavior-benchmark/behavior-benchmark-guide.md)
and shared framework before authoring. The guide owns templates, sequence, matrix,
and naming; execution and evidence stay in the executing packet.

### ✅ ALWAYS / ⛔ NEVER (behavior benchmark)

- **ALWAYS** keep the shared `framework.md` as the single source for rubric, buckets, budget formula, and enums; the package instantiates, it does not redefine.
- **ALWAYS** keep the index SCENARIO TABLE and the scenario files in exact sync.
- **ALWAYS** ship uncaptured baseline cells as `pending` / `not_captured` rather than inventing values.
- **NEVER** ship fixtures, transcripts, or result JSONs inside the package — they belong to the executing spec-packet phase.
- **NEVER** give a shipped scenario file frontmatter or a `## OVERVIEW` heading; it opens at the `# <PREFIX>-NNN` H1 (the scenario template's own frontmatter, usage comment, and Overview are stripped on copy).
- **NEVER** add a scenario whose `id` disagrees with its filename or its index-table row.

### Success Criteria (behavior benchmark)

- The owning mode-packet has a `behavior-benchmark/` package with an index, one scenario file per table row, and a baseline.
- Every scenario's first json block parses, its `id` matches its filename and index row, and its axis values agree across the table, scenario, and baseline.
- The index AXIS COVERAGE section reports per-surface and per-clarity counts and names any axis intentionally left out with its reason.
- The baseline ships with real values or with `pending` / `not_captured` cells, never invented ones.
- Shared sk-doc validation passes for the index and baseline, or any remaining issue is escalated with exact command output.

---

## 10. SKILL-BENCHMARK STORAGE AND INDEX

Lane C `/deep:skill-benchmark` measures routing, discoverability, efficiency, and usefulness, emitting JSON+Markdown per run. This packet owns only the hub `benchmark/` storage convention and `benchmark/README.md` template—not reports, runner, or scoring. See the [storage guide](references/skill-benchmark/skill-benchmark-storage-guide.md) for naming and renderer boundaries, and [serving snapshot schema](references/skill-benchmark/serving-snapshot-schema.md) for compiled-routing archives, `serving-snapshot.json`, and repo-relative provenance. Cross-link, never restate, lane-local D1-D5 scoring.

### Storage Shape

Each run writes its report pair to a sibling `<run-label>/`:

```text
<skill-or-hub>/benchmark/
├── README.md              # optional hub index — templated here
├── baseline/              # FROZEN comparison anchor — never regenerated
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md   # renderer-owned render
├── <run-label>/           # one Lane C run; sibling to every other run
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md
└── fixtures/              # optional INPUT corpus — not a run
```

Runs never overwrite siblings. `baseline/` is frozen; every re-run gets a new sibling.

New `<run-label>` values must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Reject underscores or ambiguity before selecting a path. Keep legacy folders until their owning migration renames them.

### Templates

| Output file | Template |
| --- | --- |
| `<skill-or-hub>/benchmark/README.md` | [`assets/skill-benchmark/skill-benchmark-readme-template.md`](assets/skill-benchmark/skill-benchmark-readme-template.md) |
| `skill-benchmark-report.md` | None — renderer-owned; see NEVER below |

### Authoring Workflow

1. **Read the storage guide** — confirm run-label naming and frozen baseline.
2. **Confirm the target** has (or is establishing) a Lane C `benchmark/` tree beside the skill it measures.
3. **Author the index** from the template: newest-first folder rows, structure map, re-run commands, and links to scoring and `/deep:skill-benchmark`.
4. **Cross-link the lane authorities** (`scoring-contract.md`, `operator-guide.md`); never restate the rubric or thresholds.
5. **Validate** the README with the shared sk-doc validator.

### ✅ ALWAYS / ⛔ NEVER (skill-benchmark)

- **ALWAYS** keep the README run-label index in exact sync with the folders on disk — one row per folder.
- **ALWAYS** add a new run as a fresh sibling run-label folder and index row; keep `baseline/` frozen.
- **ALWAYS** cross-link the deep-improvement D1-D5 scoring contract; rubric, buckets, and thresholds are lane-owned.
- **NEVER** hand-author or hand-edit `skill-benchmark-report.md` — it is an anti-drift render produced by `build-report.cjs` from the run JSON, silently overwritten on the next run.
- **NEVER** author a fill-in template for that report; templates here are for the `benchmark/README.md` index and INPUT fixtures/profiles only.
- **NEVER** copy the D1-D5 scoring, reviewer schema, or any scorer/runner into this packet — they are lane-local.

### Success Criteria (skill-benchmark)

- The skill or hub has a `benchmark/` tree following the convention, with a `baseline/` anchor and one sibling folder per run.
- `benchmark/README.md` indexes every run-label folder, links the scoring contract and command, and carries no hand-authored report `.md`.
- Each run folder's `skill-benchmark-report.md` was produced by the renderer, not by hand.
- Shared sk-doc validation passes for the README, or the remaining issue is escalated with exact command output.

---

## 11. MODEL-BENCHMARK FIXTURES AND PROFILES

Lane B `/deep:model-benchmark` scores model or prompt-framework output against a held-out oracle. This packet owns data-only fixtures and run profiles, never evaluator, scorers, or reviewer-verdict contract. The taxonomy, profile shape, and boundary live in [`references/model-benchmark/model-benchmark-fixture-guide.md`](references/model-benchmark/model-benchmark-fixture-guide.md).

### Artifact Shape

Model-benchmark inputs live under the deep-improvement mode-packet, not in this packet:

```text
system-deep-loop/deep-improvement/assets/model-benchmark/
├── benchmark-fixtures/    # task contracts the model under test answers
│   └── <slug>.json
└── benchmark-profiles/    # run configs: fixtures, models, frameworks, scoring
    └── <profile>.json
```

Detect fixtures by shape, not filename; each family feeds a different scorer:

| Fixture family | Shape marker | Oracle |
| --- | --- | --- |
| Code-task oracle (t-tier) | `fn_name` + `tests[]` + `hidden_tests[]` | Function return values per case |
| Pattern / capability evidence contract | `requiredHeadings` + `requiredPatterns` + `forbiddenPatterns` | Structure and evidence tokens |
| Reviewer-prompt | `kind: "reviewer-prompt"` + `expectedVerdict` | A verdict plus required finding tokens |

### Templates

| Output file | Template |
| --- | --- |
| Code-task oracle fixture `<slug>.json` | [`assets/model-benchmark/model-benchmark-code-task-fixture-template.md`](assets/model-benchmark/model-benchmark-code-task-fixture-template.md) |
| Pattern / capability or reviewer-prompt fixture `<slug>.json` | [`assets/model-benchmark/model-benchmark-pattern-fixture-template.md`](assets/model-benchmark/model-benchmark-pattern-fixture-template.md) |
| Run profile `<profile>.json` | [`assets/model-benchmark/model-benchmark-profile-template.md`](assets/model-benchmark/model-benchmark-profile-template.md) |

Copy only each template's fenced JSON into shipped `.json`; include no frontmatter or comments.

### Authoring Workflow

1. **Pick the family and shape** and copy the closest existing fixture.
2. **Author a code-task oracle** by generating all `tests[]` / `hidden_tests[]` values from a verified reference; never guess, and use held-out adversarial hidden cases.
3. **Author a reviewer-prompt fixture** against the lane-local `reviewer-schema.md`; keep `expectedFindings` token-specific.
4. **Add or extend a profile** referencing the fixture `id`, with a shape-matched scorer, sweep matrix, sampling, and gate. Reviewer-mode profiles (`mode: reviewer`, e.g. `reviewer-regression.json`) are a separate `SPECKIT_REVIEWER_BENCHMARKS`-gated lane family not validated by `profile-validator.cjs`; author them in-lane, not through this scaffold.
5. **Parse every fixture and profile as JSON**, then hand off to the lane to dispatch, score, and file the evidence.

### ✅ ALWAYS / ⛔ NEVER (model-benchmark)

- **ALWAYS** match the profile's scorer to the fixture shape — code-task → code-task scorer, evidence-contract → pattern scorer. Reviewer-prompt fixtures feed the lane-owned reviewer-mode profile (`mode: reviewer`, `reviewer` scorer, gated), which is authored in-lane, not through this profile scaffold.
- **ALWAYS** generate code-task oracle `expect` values from a verified reference implementation, with held-out `hidden_tests[]` guarding overfit.
- **ALWAYS** keep fixtures and profiles pure JSON, and each id in `profile.fixtures` matching an on-disk fixture's `id` field.
- **NEVER** restate or copy the evaluator rubric, scorer mechanics, or reviewer schema / verdict contract into this packet — they are lane-local; cross-link them.
- **NEVER** write run outputs back into the fixtures or profiles directories; those stay read-only inputs, and each path's outputs land differently — run/`report.json`, sweep/`results.json`, reviewer/`reviewer-report.json` (profile template OUTPUTS).

### Success Criteria (model-benchmark)

- Each fixture parses as JSON, carries its family's field set, and its `id` matches every profile that references it.
- Each code-task oracle's `expect` values come from a verified reference implementation, with held-out `hidden_tests[]`.
- Each profile names a scorer matching every fixture shape it scores and expands the `{spec_folder}` token in `outputsDir` rather than hard-coding a path.
- No evaluator, scorer, or reviewer-verdict contract was copied here; each is cross-linked to its deep-improvement authority.
- The authored `.md` templates and guide validate with the shared sk-doc validator, and the shipped `.json` parses.

---

## 12. CONFORMANCE-BENCHMARK PACKAGES

A `conformance-benchmark` package supplies stable inputs for a deterministic
deep-alignment peer-adapter check at
`<mode>/assets/conformance-benchmark/<benchmark-id>/`. It authors no adapter,
scorer, reducer, or report.

### Authored Package

- A family `README.md` indexes benchmark IDs and evidence pointers.
- `<benchmark-id>/conformance-benchmark.md` binds the corpus, authority, adapter,
  fixtures, validity gates, and execution handoff.
- `<benchmark-id>/lane-config.json` selects one existing deep-alignment lane.
- `<benchmark-id>/fixtures/fixture-manifest.json` records independent-oracle
  provenance, hashes, mutations, and expected findings.

Copy the four [`assets/conformance-benchmark/`](assets/conformance-benchmark/) templates.
Use the [authoring guide](references/conformance-benchmark/conformance-benchmark-authoring-guide.md)
for layout, fields, fixture independence, JSON extraction, and validation.

### Boundary and Stop

Author the package, validate Markdown and JSON, reconcile index and evidence pointers,
then stop. Never invoke the adapter or deep-alignment here. Adapter implementation,
S-dimension/severity semantics, discovery, convergence, reduction, and reports stay lane-owned.

### Success Criteria (conformance benchmark)

- The family index, contract, lane config, and fixture manifest are filled and
  mutually consistent.
- Markdown validation and JSON parsing pass with no placeholders left.
- The handoff names the adapter prerequisite and executing evidence location,
  without running either one.

---

## 13. INTEGRATION POINTS

This packet authors inputs and indexes; `/deep:skill-benchmark`, `/deep:model-benchmark`, and `/deep:agent-improvement` run their lanes (§10, §11, §14). Conformance stops before adapter or deep-alignment execution (§12).

Filesystem outputs, template directories, and filenames use lowercase kebab-case. Router and JSON family keys remain snake_case machine identifiers; the router converts them to resource paths.

`/create:benchmark` drives `mcp_promotion` (§3-8) and `conformance_benchmark` (§12) end-to-end. Author behavior, skill-benchmark, model-benchmark, and agent-improvement directly from their sections; no command scaffolds them.

---

## 14. REFERENCES AND RELATED RESOURCES

**Within this packet** — family guides and the overflow route-map; the fillable templates are mapped in each family section above:

- [`references/shared/README.md`](references/shared/README.md) — overflow route-map (case studies, worked example, pitfalls).
- [`references/behavior-benchmark/behavior-benchmark-guide.md`](references/behavior-benchmark/behavior-benchmark-guide.md) — behavior package authoring path (§9).
- [`references/conformance-benchmark/conformance-benchmark-authoring-guide.md`](references/conformance-benchmark/conformance-benchmark-authoring-guide.md) — conformance package authoring and handoff boundary (§12).
- [`references/skill-benchmark/skill-benchmark-storage-guide.md`](references/skill-benchmark/skill-benchmark-storage-guide.md) — skill-benchmark storage convention and renderer boundary (§10).
- [`references/skill-benchmark/serving-snapshot-schema.md`](references/skill-benchmark/serving-snapshot-schema.md) — `serving-snapshot.json` schema, the fail-closed `compiled-routing/<run-label>/` archive convention, and repo-relative provenance (§10); implemented by [`scripts/render-serving-snapshot.cjs`](scripts/render-serving-snapshot.cjs) + [`scripts/archive-compiled-routing.cjs`](scripts/archive-compiled-routing.cjs).
- [`references/model-benchmark/model-benchmark-fixture-guide.md`](references/model-benchmark/model-benchmark-fixture-guide.md) — model-benchmark fixture taxonomy, profile shape, lane boundary (§11).
- [`agent-improvement-authoring-guide.md`](references/agent-improvement/agent-improvement-authoring-guide.md) — Lane A input authoring (§14).

**Lane-owned contracts** — cross-link, never restate:

- [`behavior-benchmark/framework.md`](../../system-deep-loop/shared/behavior-benchmark/framework.md) — behavior rubric, buckets, budget formula, runner.
- [`scoring-contract.md`](../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) + [`build-report.cjs`](../../system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs) — Lane C D1-D5 scoring and the renderer that owns `skill-benchmark-report.md`.
- [`evaluator-contract.md`](../../system-deep-loop/deep-improvement/references/model-benchmark/evaluator-contract.md) + [`reviewer-schema.md`](../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md) — Lane B evaluator rubric and reviewer-prompt schema.

**Shared sk-doc backbone**: [`../shared/scripts/validate_document.py`](../shared/scripts/validate_document.py) — every authored `.md` must pass with 0 issues; [`../shared/references/`](../shared/references/) — cross-document standards.

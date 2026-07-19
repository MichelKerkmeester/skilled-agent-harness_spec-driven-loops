---
name: create-benchmark
description: Author MCP-promotion, behavior, conformance, skill-benchmark, and model-benchmark artifacts; route the Lane A authoring guide.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.4.0.0
---

<!-- Keywords: create-benchmark, benchmark-report.md, source.md, mcp_server benchmarks, benchmark promotion, skill-local benchmark, MCP bake-off, benchmark folder, behavior benchmark, behavior-benchmark.md, behavior_benchmark, conformance benchmark, conformance_benchmark, peer adapter benchmark, deep-alignment benchmark, lane-config benchmark, sk-doc-command, scenario contract, DAB scenario, behavior-benchmark framework, claude-baseline, skill-benchmark, benchmark/README.md, run-label folder, skill-benchmark-report, Lane C benchmark, model-benchmark, benchmark fixture, benchmark profile, code-task oracle fixture, reviewer-prompt fixture, Lane B fixture, command benchmark, command-benchmark, command surface benchmark, command benchmark matrix -->

# create-benchmark

`create-benchmark` is the benchmark-authoring workflow packet of the `sk-doc` family. It authors four benchmark families plus MCP-promotion artifacts, and provides an authoring guide for one more lane that stays code-owned:

- **MCP promotion benchmark** — turn a shipped spec packet's curated benchmark evidence into a consuming skill's `mcp-server/benchmarks/benchmark-<YYYY-MM-DD>/` folder, so MCP operators can find the winner, fixture, caveats, replay commands, and source packet without leaving the skill tree (sections 3 through 8).
- **Behavior benchmark** — author a `<mode>/behavior-benchmark/` package (index, per-scenario machine contracts, and a Claude baseline) that specifies executor-model behavior at a deep-loop mode's invocation surface, governed by the shared measurement framework (section 9).
- **Conformance benchmark** — author a `<mode>/assets/conformance-benchmark/<benchmark-id>/` input package for deterministic artifact-conformance checks through a deep-alignment peer adapter, without running the adapter or benchmark (section 12).
- **Skill-benchmark (Lane C)** — author a hub's `benchmark/` storage tree and its `benchmark/README.md` run-label index; the per-run `skill-benchmark-report.md` is a renderer-owned render this packet never authors (section 10).
- **Model-benchmark (Lane B)** — author the Lane B input fixtures (code-task oracle, pattern/capability, reviewer-prompt) and the run profiles; the evaluator, scorers, and reviewer-verdict contract stay lane-local (section 11).

Lane A (agent-improvement) carries an authoring guide here (section 14); artifacts stay code-owned in-lane.

The skill-local surface is the look-here-first entry point, not the archive.

---

## 1. WHEN TO USE

Use this packet when a completed benchmark, or a benchmark's input artifacts, needs to be authored into the skill tree as durable, look-here-first documentation. Settle which family applies via the router in section 2 first — families are distinct and must not be conflated.

### Activation Triggers

- **MCP promotion** (on-disk `shared`; sections 3-8) — promote a completed MCP benchmark or bake-off from a spec packet into a skill-local `mcp-server/benchmarks/` folder: author the ten-section `benchmark-report.md` and `source.md`, copy `results.csv` / `per-probe.jsonl` / runtime sidecars into a dated folder, and update the `benchmarks/README.md` index row.
- **Behavior benchmark** (section 9) — author or extend a `behavior-benchmark` package for a deep-loop mode. The framework fixes an ID prefix per package — `research` (RSB), `review` (RVB), `ai-council` (ACB), `improvement` (IMB), and `alignment` (DAB) — and a new mode extends that table with its own prefix declared in the index OVERVIEW: the `behavior-benchmark.md` index, per-scenario `<PREFIX>-NNN-<slug>.md` machine contracts, and `baselines/claude-baseline.md`, designing the entry-surface and clarity scenario matrix.
- **Conformance benchmark** (section 12) — author a deterministic `conformance-benchmark` input package for a peer-adapter or deep-alignment benchmark, including the family index, contract, lane config, and fixture manifest; routing aliases may retain the machine key `conformance_benchmark`.
- **Skill-benchmark** (section 10) — author or update a hub's `benchmark/README.md` run-label index, or establish the `benchmark/` storage convention (sibling run-label folders, frozen `baseline/` anchor) for a Lane C tree.
- **Model-benchmark** (section 11) — author a Lane B input fixture (code-task oracle, pattern/capability, or reviewer-prompt) or a run profile that selects fixtures, models, frameworks, scoring, and the gate.
- **Lane A guide** (section 14) — author the Lane A (`agent_improvement`) authoring guide; rubrics, configs, and templates stay in-lane.

Keyword triggers: `benchmark-report.md`, `source.md`, `mcp-server/benchmarks`, `MCP bake-off`; `behavior benchmark`, `behavior-benchmark.md`, `behavior_benchmark`, `scenario contract`, `claude-baseline`; `conformance benchmark`, `conformance_benchmark`, `peer adapter benchmark`, `deep-alignment benchmark`, `lane-config benchmark`, `sk-doc-command`; `skill-benchmark`, `benchmark/README.md`, `run-label folder`, `benchmark package`; `model-benchmark`, `benchmark fixture`, `benchmark profile`, `reviewer-prompt fixture`; `command benchmark`, `command-benchmark`, `command surface benchmark`, `command benchmark matrix`.

### Adoption Gate (MCP promotion)

Create a skill-local MCP-promotion benchmark folder only when all of the following hold:

- The skill houses an MCP server under `mcp-server/`.
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

### Trigger Signals

An MCP-promotion folder is warranted when:

- An ADR just promoted a non-trivial default change (a new embedder, reranker, retrieval pipeline, or runtime setting), and operators inside the MCP code will ask "why this default?"
- A reader has already asked "where are the benchmark numbers?" and you pointed at a deep spec path — that question recurs every time someone touches the MCP code.
- You are about to write the same comparison table twice (a README and a release note), or a sibling skill's benchmark folder has an analogous retrieval surface.

### When NOT to Use

Use another `sk-doc` packet when:

- The benchmark is still in progress or lacks an accepted decision record.
- The result is a single unreplayable data point with no stable fixture or replay commands.
- The target skill has no MCP server or no measurable retrieval, quality, runtime, or throughput surface.
- The user only needs a release note or changelog row. Use `create-changelog`.
- The user wants to audit, validate, score, or optimize existing benchmark markdown without authoring a benchmark-family artifact. Use `create-quality-control`.
- The task is a general benchmark design exercise rather than promotion of an already-curated run.
- A re-run confirms the same headline; update the existing `benchmark-report.md` with a re-run note instead.
- The result mixes data from different MCP stacks and asks for a single comparative verdict.
- The task is to hand-edit a `skill-benchmark-report.md` (renderer-owned) or to define how any benchmark is *scored* — a rubric, evaluator, reviewer verdict, or D1-D5 weight. Those stay lane-local in deep-improvement; this packet authors inputs, indexes, and reports, not scoring (sections 10-11).
- The benchmark is a one-off or experimental artifact that fits none of the six families — for example a standalone capability probe such as `sk-prompt/prompt-models/references/vision-audit-benchmark.md`. These stay lane-local as their own document; this packet's taxonomy does not absorb them, and there is no "misc" family.

If unsure, default to "not yet." Promotion is cheap after rigor; reverting a premature folder costs more.

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

Route by the table above; two hard stops: never hand-write a `skill-benchmark-report.md` — it is renderer-owned; never change how any benchmark is *scored* — the scoring contracts are lane-local.

### Smart Router Pseudocode

Benchmark families ARE the runtime routing key. `discover_markdown_resources()` and
`_guard_in_skill()` are the shared canonical helpers
([skill-smart-router.md](../create-skill/assets/skill/skill-smart-router.md)); only the
family key and tiered fallback vary:

```python
DEFAULT_RESOURCE = "references/shared/README.md"
FAMILIES = ["behavior_benchmark", "conformance_benchmark", "skill_benchmark", "model_benchmark",
            "agent_improvement", "mcp_promotion"]
# Resource dirs are kebab-case filesystem names while the snake_case family keys above stay
# machine identifiers, so disk_key kebab-cases the key. mcp_promotion is the one family whose
# templates live under the shared/ key rather than a same-named dir.
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

    # A command benchmark is a composition, not a family key, but it IS routable by
    # name: detected, it loads BOTH family guides plus the composition standard so
    # the author can build the behavior and conformance packages and bind them via
    # the matrix manifest. It stays out of FAMILIES because no single guide answers
    # it — the composite branch is what makes "route by name" honest.
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

A "command benchmark" is not a seventh family key. It **composes** the behavior
and conformance families over the OpenCode command surface — one `behavior-benchmark`
package plus one `conformance-benchmark` package — bound by a lane-owned matrix
manifest and driven by a launcher that reports both axes without averaging. The
composition standard and the matrix-manifest field shape live in
[`references/shared/command-benchmark-composition.md`](references/shared/command-benchmark-composition.md).
It is not a family key — no single family guide answers it — but it is routable by
name: the Tier-0 composite branch above loads BOTH the behavior and conformance
authoring guides plus that composition doc, so an author who asks for a "command
benchmark" gets the two axes and the binding standard together. Only a request too
vague to detect as a command benchmark falls through to the unknown-fallback
checklist, whose command-benchmark line points to the same three resources.

### Family Boundary

This nested `sk-doc` packet owns benchmark *authoring* only — no measurement contract (rubrics, renderers, scorers, evaluator/verdict contracts stay lane-local; Lane A gets a guide template only, `assets: N/A`). The single advisor identity lives at the `sk-doc` hub root; never add a packet-local `graph-metadata.json`.

---

## 3. REQUIRED PACKAGE SHAPE

Author or update this package shape inside the consuming skill:

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

`source.md` is a wayfinding file, not a duplicate audit trail. It contains the spec packet path, why to read it, question-to-file mapping, evidence map, follow-on packet notes, rename or renumber notes, and last-updated date.

Use `assets/shared/benchmark-report-template.md` for `benchmark-report.md` and `assets/shared/source-template.md` for `source.md`.

Reference `references/shared/README.md` for deep overflow: it routes to the case studies, the report worked example, and common pitfalls.

---

## 4. HOW IT WORKS: AUTHORING WORKFLOW

Complete these steps in order. The spec packet must have shipped before promotion.

1. **Confirm the promotion gate.** Read the source packet `decision-record.md`, `implementation-summary.md`, and benchmark evidence. Confirm an accepted decision, stable headline, stable fixture, replay commands, and a defensible winner or explicit provisional status.
2. **Classify the task.** Decide whether this is a true promotion, a re-run update, or a retirement update.
3. **Confirm the target skill.** Verify the consuming skill has `mcp-server/` and an appropriate measurable MCP surface.
4. **Create or update the benchmark index.** Ensure `mcp-server/benchmarks/README.md` exists and can hold date, folder link, winner or status, headline metric, and source packet path.
5. **Choose the dated folder.** Name it `benchmark-YYYY-MM-DD/` using the benchmark execution date, not the document authoring date.
6. **Copy source artifacts.** Copy the aggregate CSV first, then `per-probe.jsonl` when applicable, then focused runtime or risk sidecars only when they affect the decision.
7. **Write `benchmark-report.md`.** Use the ten-section structure from this SKILL and the report template. Generalize the headline and state the load-bearing insight separately from the headline winner when the data shows a non-obvious cause.
8. **Write `source.md`.** Use the source template. Include the spec packet path, per-file navigation map, evidence map, follow-on notes, and last-updated date.
9. **Update the README index row.** Add or update the row with date, folder link, winner or status, headline metric, and source packet path.
10. **Validate authored markdown.** Run `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type readme <file>` on `benchmark-report.md` and `benchmarks/README.md`. Fix blocking issues before delivery.

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

`benchmark-report.md` keeps this fixed ten-section structure. Do not merge, reorder, or omit sections.

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
- Keep slugs and anchors stable across revisions.
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

## 6. DATE AND NAMING CONVENTION

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

Do not create a new dated folder for a re-run that only confirms the same headline. Update the existing `benchmark-report.md` with a `Re-run YYYY-MM-DD` note.

### Retirement

Retired benchmarks stay in place. Update `README.md` with status `RETIRED` plus the date. Add a retirement note near the top of `benchmark-report.md` with date, reason, and replacement bench if any.

### Renamed or Renumbered Spec Packets

Do not rename the skill-local dated folder. Update the path in `source.md`, update cross-link tables in `benchmark-report.md` and `README.md`, and add a rename note in `source.md` with old slug, new slug, and date.

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

The behavior-benchmark family is distinct from MCP promotion. It authors a
package that specifies what an executor **model** does when a deep-loop mode's
invocation surface is triggered with a realistic prompt: whether it dispatches the
mode's LEAF agent rather than absorbing the role, whether it halts for one
consolidated setup question when under-specified, whether it respects the mode's
invariants, and how long each takes relative to a Claude reference leg. It is a
package of run contracts, not a numeric bake-off.

The end-to-end authoring path, the scenario-matrix design rules, and the naming
conventions live in [`references/behavior-benchmark/behavior-benchmark-guide.md`](references/behavior-benchmark/behavior-benchmark-guide.md).
The single-source measurement contract — the five-dimension rubric, terminal
buckets, budget formula, entry-surface and clarity enums, and the per-package
ID-prefix table — lives once in
[`../../system-deep-loop/shared/behavior-benchmark/framework.md`](../../system-deep-loop/shared/behavior-benchmark/framework.md)
and is normative. This packet authors packages that instantiate that framework; it
does not redefine it.

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

Fixtures, lane-configs, transcripts, result JSONs, and scorecards are NOT shipped
in the package; the executing spec-packet phase provisions the fixtures and holds
the run evidence. The package is the contract; the packet is the proof.

### Templates, Workflow, and Naming

The template map, ordered authoring sequence, scenario-matrix rules, and naming
contract live in the [behavior-benchmark guide](references/behavior-benchmark/behavior-benchmark-guide.md).
Load that guide and the shared framework before authoring; keep fixture execution
and captured evidence in the executing packet.

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

A skill-benchmark measures whether a skill is well-routed, discoverable, efficient, and useful; it is run by the deep-improvement Lane C harness (`/deep:skill-benchmark`), which emits a JSON+Markdown report pair per run. This packet owns exactly two things: the **storage convention** for a hub's `benchmark/` tree and the **template for its `benchmark/README.md` index**. It never authors the per-run report, the runner, or the scoring (see ALWAYS / NEVER). The full storage convention, run-label naming, and renderer boundary live in [`references/skill-benchmark/skill-benchmark-storage-guide.md`](references/skill-benchmark/skill-benchmark-storage-guide.md); the D1-D5 contract stays lane-local, cross-linked and never restated.

### Storage Shape

A benchmarked skill or hub carries a `benchmark/` tree; every run writes its report pair into its own `<run-label>/` sibling folder:

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

Runs are siblings; one never overwrites another. `baseline/` is the frozen before-snapshot, never re-run in place — a new run is always a new sibling folder.

Every new `<run-label>` must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Reject underscore-bearing or ambiguous labels instead of rewriting them after a run path has been selected. Existing legacy run folders remain historical references until their owning migration phase renames them.

### Templates

| Output file | Template |
| --- | --- |
| `<skill-or-hub>/benchmark/README.md` | [`assets/skill-benchmark/skill-benchmark-readme-template.md`](assets/skill-benchmark/skill-benchmark-readme-template.md) |
| `skill-benchmark-report.md` | None — renderer-owned; see NEVER below |

### Authoring Workflow

1. **Read the storage guide** — confirm the run-label naming convention and the frozen-baseline rule.
2. **Confirm the target** has (or is establishing) a Lane C `benchmark/` tree beside the skill it measures.
3. **Author the index** from the README template: the run-label table (one row per on-disk folder, newest first), the structure map, re-run commands, and cross-links to the scoring contract and `/deep:skill-benchmark`.
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

A model-benchmark run scores what a model or prompt framework produces against a fixed, held-out oracle; it is run by the deep-improvement Lane B harness (`/deep:model-benchmark`). This packet owns the **authored inputs** — the fixtures the model answers and the run profiles that drive a run. Both are data only. It never authors the evaluator, scorers, or reviewer-verdict contract (see ALWAYS / NEVER). The fixture-family taxonomy, profile shape, and lane boundary live in [`references/model-benchmark/model-benchmark-fixture-guide.md`](references/model-benchmark/model-benchmark-fixture-guide.md).

### Artifact Shape

Model-benchmark inputs live under the deep-improvement mode-packet, not in this packet:

```text
system-deep-loop/deep-improvement/assets/model-benchmark/
├── benchmark-fixtures/    # task contracts the model under test answers
│   └── <slug>.json
└── benchmark-profiles/    # run configs: fixtures, models, frameworks, scoring
    └── <profile>.json
```

A fixture is detected by its **shape**, not its filename; three families each feed a different scorer:

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

Each template's fenced json block is the only thing copied into the shipped `.json`; shipped fixtures and profiles carry no frontmatter and no comments.

### Authoring Workflow

1. **Pick the family and shape** and copy the closest existing fixture.
2. **Author a code-task oracle** by generating every `tests[]` / `hidden_tests[]` value from a verified reference implementation — never hand-guess an oracle; bias hidden cases to held-out adversarial inputs.
3. **Author a reviewer-prompt fixture** against the lane-local `reviewer-schema.md`; keep `expectedFindings` token-specific.
4. **Add or extend a profile** referencing the fixture `id` (code-task or pattern/capability), with a `scorer` matching the fixture shape plus the sweep matrix, sampling, and gate. A reviewer-mode profile (`mode: reviewer`, e.g. the shipped `reviewer-regression.json`) is a SEPARATE gated lane family (`SPECKIT_REVIEWER_BENCHMARKS`) that `profile-validator.cjs` does not validate — it is authored in-lane, not through this scaffold; the packet only records that it exists as a distinct reviewer input.
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

A `conformance-benchmark` package is stable input scaffolding for a deterministic
artifact-conformance check through a deep-alignment peer adapter. It lives at
`<mode>/assets/conformance-benchmark/<benchmark-id>/` and authors no executable
adapter, scorer, reducer, or report.

### Authored Package

- A family `README.md` indexes benchmark IDs and evidence pointers.
- `<benchmark-id>/conformance-benchmark.md` binds the corpus, authority, adapter,
  fixtures, validity gates, and execution handoff.
- `<benchmark-id>/lane-config.json` selects one existing deep-alignment lane.
- `<benchmark-id>/fixtures/fixture-manifest.json` records independent-oracle
  provenance, hashes, mutations, and expected findings.

Copy and fill the four templates under [`assets/conformance-benchmark/`](assets/conformance-benchmark/).
Use the [authoring guide](references/conformance-benchmark/conformance-benchmark-authoring-guide.md)
for package layout, field rules, fixture independence, JSON extraction, and
validation.

### Boundary and Stop

Author the package, validate its Markdown and JSON, reconcile its index and
evidence pointers, then stop. Never invoke the peer adapter or deep-alignment from
this authoring branch. Adapter implementation, S-dimension and severity semantics,
discovery, convergence, reduction, and generated reports stay lane-owned.

### Success Criteria (conformance benchmark)

- The family index, contract, lane config, and fixture manifest are filled and
  mutually consistent.
- Markdown validation and JSON parsing pass with no placeholders left.
- The handoff names the adapter prerequisite and executing evidence location,
  without running either one.

---

## 13. INTEGRATION POINTS

This packet authors inputs and indexes only, never runs a benchmark: `/deep:skill-benchmark`, `/deep:model-benchmark`, and `/deep:agent-improvement` each run their lane against what is templated here (§10, §11, §14). Conformance authoring stops before its peer adapter or deep-alignment execution (§12).

Filesystem outputs use lowercase kebab-case, and so do the source-template directories and filenames on disk. Only the family names in router keys and JSON fields stay snake_case — those are machine identifiers, not paths, so the router kebab-cases a family key to reach its resource directory.

The `/create:benchmark` command drives two of the six families end-to-end — `mcp_promotion` (the benchmark-folder workflow, §3-8) and `conformance_benchmark` (copy/fill the four templates, validate, report the path, §12). The other four (behavior, skill-benchmark, model-benchmark, agent-improvement) are authored directly against the family sections above; there is no command that scaffolds them.

---

## 14. REFERENCES AND RELATED RESOURCES

**Within this packet** — family guides and the overflow route-map; the fillable templates are mapped in each family section above:

- [`references/shared/README.md`](references/shared/README.md) — overflow route-map (case studies, worked example, pitfalls).
- [`references/behavior-benchmark/behavior-benchmark-guide.md`](references/behavior-benchmark/behavior-benchmark-guide.md) — behavior package authoring path (§9).
- [`references/conformance-benchmark/conformance-benchmark-authoring-guide.md`](references/conformance-benchmark/conformance-benchmark-authoring-guide.md) — conformance package authoring and handoff boundary (§12).
- [`references/skill-benchmark/skill-benchmark-storage-guide.md`](references/skill-benchmark/skill-benchmark-storage-guide.md) — skill-benchmark storage convention and renderer boundary (§10).
- [`references/model-benchmark/model-benchmark-fixture-guide.md`](references/model-benchmark/model-benchmark-fixture-guide.md) — model-benchmark fixture taxonomy, profile shape, lane boundary (§11).
- [`agent-improvement-authoring-guide.md`](references/agent-improvement/agent-improvement-authoring-guide.md) — Lane A input authoring (§14).

**Lane-owned contracts** — cross-link, never restate:

- [`behavior-benchmark/framework.md`](../../system-deep-loop/shared/behavior-benchmark/framework.md) — behavior rubric, buckets, budget formula, runner.
- [`scoring-contract.md`](../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) + [`build-report.cjs`](../../system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs) — Lane C D1-D5 scoring and the renderer that owns `skill-benchmark-report.md`.
- [`evaluator-contract.md`](../../system-deep-loop/deep-improvement/references/model-benchmark/evaluator-contract.md) + [`reviewer-schema.md`](../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md) — Lane B evaluator rubric and reviewer-prompt schema.

**Shared sk-doc backbone**: [`../shared/scripts/validate_document.py`](../shared/scripts/validate_document.py) — every authored `.md` must pass with 0 issues; [`../shared/references/`](../shared/references/) — cross-document standards.

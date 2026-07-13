---
name: create-benchmark
description: Author benchmark artifacts across families - MCP-promotion benchmark_report.md plus SOURCE.md; deep-loop behavior_benchmark packages; Lane C skill-benchmark benchmark/ storage tree plus README index; and Lane B model-benchmark fixtures plus profiles. Scoring contracts and report renderers stay lane-owned and cross-linked, not templated here.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.2.0.0
---

<!-- Keywords: create-benchmark, benchmark_report.md, SOURCE.md, mcp_server benchmarks, benchmark promotion, skill-local benchmark, MCP bake-off, benchmark folder, behavior benchmark, behavior_benchmark.md, scenario contract, DAB scenario, behavior-benchmark framework, claude-baseline, skill-benchmark, benchmark/README.md, run-label folder, skill-benchmark-report, Lane C benchmark, model-benchmark, benchmark fixture, benchmark profile, code-task oracle fixture, reviewer-prompt fixture, Lane B fixture -->

# create-benchmark

`create-benchmark` is the benchmark-authoring workflow packet of the `sk-doc` family. It authors the documentation and input artifacts for several benchmark families, and names two more that stay code-owned:

- **MCP promotion benchmark** — turn a shipped spec packet's curated benchmark evidence into a consuming skill's `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folder, so MCP operators can find the winner, fixture, caveats, replay commands, and source packet without leaving the skill tree (sections 3 through 8).
- **Behavior benchmark** — author a `<mode>/behavior_benchmark/` package (index, per-scenario machine contracts, and a Claude baseline) that specifies executor-model behavior at a deep-loop mode's invocation surface, governed by the shared measurement framework (section 9).
- **Skill-benchmark (Lane C)** — author a hub's `benchmark/` storage tree and its `benchmark/README.md` run-label index; the per-run `skill-benchmark-report.md` is a renderer-owned render this packet never authors (section 10).
- **Model-benchmark (Lane B)** — author the Lane B input fixtures (code-task oracle, pattern/capability, reviewer-prompt) and the run profiles; the evaluator, scorers, and reviewer-verdict contract stay lane-local (section 11).

Two further families — Lane A agent-improvement and Lane D non-dev AI-system improvement — appear only for disambiguation; their code-owned artifacts stay in-lane and are not templated here.

The skill-local surface is the look-here-first entry point, not the archive; the full audit trail stays in the owning spec packet or lane.

---

## 1. WHEN TO USE

Use this packet when a completed benchmark, or a benchmark's input artifacts, needs to be authored into the skill tree as durable, look-here-first documentation. It authors several benchmark families; settle which family you are in from the router in section 2 before authoring, because the families are distinct and must not be conflated.

### Activation Triggers

- **MCP promotion** (sections 3-8) — promote a completed MCP benchmark or bake-off from a spec packet into a skill-local `mcp_server/benchmarks/` folder: author the ten-section `benchmark_report.md` and `SOURCE.md`, copy `results.csv` / `per-probe.jsonl` / runtime sidecars into a dated folder, and update the `benchmarks/README.md` index row.
- **Behavior benchmark** (section 9) — author or extend a `behavior_benchmark` package for a deep-loop mode (`context`, `research`, `review`, `ai-council`, `improvement`, or a declared extension such as `alignment`): the `behavior_benchmark.md` index, per-scenario `<PREFIX>-NNN-<slug>.md` machine contracts, and `baselines/claude-baseline.md`, designing the entry-surface and clarity scenario matrix.
- **Skill-benchmark** (section 10) — author or update a hub's `benchmark/README.md` run-label index, or establish the `benchmark/` storage convention (sibling run-label folders, frozen `baseline/` anchor) for a Lane C tree.
- **Model-benchmark** (section 11) — author a Lane B input fixture (code-task oracle, pattern/capability, or reviewer-prompt) or a run profile that selects fixtures, models, frameworks, scoring, and the gate.

Keyword triggers: `benchmark_report.md`, `SOURCE.md`, `mcp_server/benchmarks`, `MCP bake-off`; `behavior benchmark`, `behavior_benchmark.md`, `scenario contract`, `claude-baseline`; `skill-benchmark`, `benchmark/README.md`, `run-label folder`, `skill-benchmark-report`; `model-benchmark`, `benchmark fixture`, `benchmark profile`, `reviewer-prompt fixture`.

### Adoption Gate (MCP promotion)

Create a skill-local MCP-promotion benchmark folder only when all of the following hold:

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

### Trigger Signals

You will know an MCP-promotion folder is warranted when:

- An ADR just promoted a non-trivial default change (a new embedder, reranker, retrieval pipeline, or runtime setting), and operators inside the MCP code will ask "why this default?"
- A reader has already asked "where are the benchmark numbers?" and you pointed at a deep spec path — that question recurs every time someone touches the MCP code.
- You are about to write the same comparison table twice (a README and a release note), or a sibling skill ships a benchmark folder and yours has an analogous retrieval surface.

### When NOT to Use

Use another `sk-doc` packet when:

- The benchmark is still in progress or lacks an accepted decision record.
- The result is a single unreplayable data point with no stable fixture or replay commands.
- The target skill has no MCP server or no measurable retrieval, quality, runtime, or throughput surface.
- The user only needs a release note or changelog row. Use `create-changelog`.
- The user wants to audit, validate, score, or optimize existing benchmark markdown without authoring a benchmark-family artifact. Use `create-quality-control`.
- The task is a general benchmark design exercise rather than promotion of an already-curated run.
- A re-run confirms the same headline; update the existing `benchmark_report.md` with a re-run note instead.
- The result mixes data from different MCP stacks and asks for a single comparative verdict.
- The task is to hand-edit a `skill-benchmark-report.md` (renderer-owned) or to define how any benchmark is *scored* — a rubric, evaluator, reviewer verdict, or D1-D5 weight. Those stay lane-local in deep-improvement; this packet authors inputs, indexes, and reports, not scoring (sections 10-11).

If unsure, default to "not yet." Promotion is cheap after rigor; rolling back a premature folder costs more.

---

## 2. SMART ROUTING

### Benchmark Families

Route to the right family before authoring; the families are distinct and must not be conflated. This packet **owns** some artifacts — their templates and guides live here — and only **routes to** others: it names them for disambiguation, but the artifact is owned by another lane (a report renderer, a scoring contract, or the code that runs the family).

| Family | What it measures | Lives at | create-benchmark OWNS (here) | Routes to (lane-owned) | Section |
| --- | --- | --- | --- | --- | --- |
| MCP promotion | Retrieval / quality / runtime / throughput from a shipped MCP stack | `<skill>/mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` | `benchmark_report.md` + `SOURCE.md` templates and the report contract | Owned here | §3-8 |
| Behavior | Executor-model behavior at a deep-loop mode's invocation surface | `<mode>/behavior_benchmark/` | Index, scenario, and baseline templates + the authoring guide | Measurement contract → `system-deep-loop/shared/behavior-benchmark/framework.md` | §9 |
| Skill-benchmark (Lane C) | Whether a skill is well-routed, discoverable, efficient, and useful | `<skill>/benchmark/<run-label>/` | The storage guide + the hub `benchmark/README.md` index template | `skill-benchmark-report.md` render → `build-report.cjs`; D1-D5 scoring → deep-improvement `scoring_contract.md` | §10 |
| Model-benchmark (Lane B) | What a model or prompt framework produces against a held-out oracle | `system-deep-loop/deep-improvement/assets/model_benchmark/` | Code-task, pattern/capability, and reviewer fixture templates + the profile template + the fixture guide | Evaluator / scorer / reviewer-verdict contract → deep-improvement lane | §11 |
| Agent-improvement (Lane A) | An agent's quality across five dimensions | deep-improvement lane (in-lane) | **Nothing — NON-GOAL** | Code-owned: authored and run in-lane by `/deep:agent-improvement` | — |
| AI-system improvement (Lane D, non-dev) | A non-dev AI-system packaging's technique docs | deep-improvement lane (in-lane) | **Nothing — NON-GOAL** | Code-owned: authored and run in-lane by `/deep:ai-system-improvement` | — |

### Routing Decision

Pick the family by what the task authors: shipped MCP-stack numbers into a skill's code tree → MCP promotion (§3-8); executor-model behavior at a deep-loop mode's surface → behavior (§9); where a Lane C run's report pair is stored, or a hub `benchmark/README.md` index → skill-benchmark (§10); a Lane B input fixture or run profile → model-benchmark (§11). Two hard stops: to hand-write a `skill-benchmark-report.md`, don't — it is renderer-owned; to change how any benchmark is *scored*, don't — the scoring contracts are lane-local.

**Non-goals.** Lane A (agent-improvement) and Lane D (non-dev AI-system improvement) appear in the table only for router disambiguation. Their fixtures, evaluators, and reports are authored and run entirely in-lane; `create-benchmark` ships no template, guide, or index for either — route those to `/deep:agent-improvement` or `/deep:ai-system-improvement`.

### Family Boundary

This nested `sk-doc` packet owns benchmark *authoring* only: MCP promotion folders, behavior_benchmark packages, the skill-benchmark storage convention and hub index, and model-benchmark input fixtures and profiles. It owns no measurement contract — the behavior rubric and runner, the Lane C D1-D5 scoring contract and its report renderer, and the Lane B evaluator, scorers, and reviewer-verdict contract stay lane-local and are cross-linked, never restated. It does not template the code-owned Lane A and Lane D families. The single advisor identity lives at the `sk-doc` hub root; never add packet-local `graph-metadata.json`.

---

## 3. REQUIRED PACKAGE SHAPE

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

Use `assets/_shared/benchmark_report_template.md` for `benchmark_report.md` and `assets/_shared/source_template.md` for `SOURCE.md`.

Reference `references/_shared/README.md` for deep overflow: it routes to the case studies, the report worked example, and common pitfalls.

---

## 4. HOW IT WORKS: AUTHORING WORKFLOW

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

## 5. REPORT CONTRACT

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

Do not create a new dated folder for a re-run that only confirms the same headline. Update the existing `benchmark_report.md` with a `Re-run YYYY-MM-DD` note.

### Retirement

Retired benchmarks stay in place. Update `README.md` with status `RETIRED` plus the date. Add a retirement note near the top of `benchmark_report.md` with date, reason, and replacement bench if any.

### Renamed or Renumbered Spec Packets

Do not rename the skill-local dated folder. Update the path in `SOURCE.md`, update cross-link tables in `benchmark_report.md` and `README.md`, and add a rename note in `SOURCE.md` with old slug, new slug, and date.

---

## 7. RULES: AUTHORITY AND GATES

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

## 8. SUCCESS CRITERIA

- The consuming skill has a dated `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folder.
- `benchmark_report.md` uses the ten-section structure and includes winner or status, aggregate table, methodology, candidate profiles, findings, caveats, recommendations, replay commands, and cross-links.
- `SOURCE.md` points to the authoritative spec packet and maps reader questions to source files.
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
conventions live in [`references/behavior_benchmark/behavior_benchmark_guide.md`](references/behavior_benchmark/behavior_benchmark_guide.md).
The single-source measurement contract — the five-dimension rubric, terminal
buckets, budget formula, entry-surface and clarity enums, and the per-package
ID-prefix table — lives once in
[`../../system-deep-loop/shared/behavior-benchmark/framework.md`](../../system-deep-loop/shared/behavior-benchmark/framework.md)
and is normative. This packet authors packages that instantiate that framework; it
does not redefine it.

### Package Shape

Author this shape inside the owning deep-loop mode-packet:

```text
<mode>/behavior_benchmark/
├── behavior_benchmark.md          # package index: scenario table + axis coverage
├── scenarios/
│   └── <PREFIX>-NNN-<slug>.md     # one machine-contract file per scenario
└── baselines/
    └── claude-baseline.md         # per-scenario Claude-leg reference checkpoints
```

Fixtures, lane-configs, transcripts, result JSONs, and scorecards are NOT shipped
in the package; the executing spec-packet phase provisions the fixtures and holds
the run evidence. The package is the contract; the packet is the proof.

### Templates

| Output file | Template |
| --- | --- |
| `behavior_benchmark.md` | [`assets/behavior_benchmark/behavior_benchmark_index_template.md`](assets/behavior_benchmark/behavior_benchmark_index_template.md) |
| `scenarios/<PREFIX>-NNN-<slug>.md` | [`assets/behavior_benchmark/behavior_benchmark_scenario_template.md`](assets/behavior_benchmark/behavior_benchmark_scenario_template.md) |
| `baselines/claude-baseline.md` | [`assets/behavior_benchmark/behavior_benchmark_baseline_template.md`](assets/behavior_benchmark/behavior_benchmark_baseline_template.md) |

### Authoring Workflow

Complete these steps in order; the guide expands each.

1. **Read the framework and the mode contract.** Load `framework.md` in full and the owning mode's `SKILL.md`; pull the mode's invariants, LEAF agent name, invocation surface, and the adjacent modes it must decline work for.
2. **Assign the ID prefix and confirm the mode value.** Pick an unused three-letter prefix. If the mode value is not already in the framework's `mode` enum, declare that extension in the index OVERVIEW, grounded in where the shipped mode already carries the value.
3. **Design the scenario matrix.** Cover the entry-surface (E1 through E4) and clarity (C1 through C3) axes deliberately, and isolate each distinctive invariant and each boundary in its own cell. Push a real share of the matrix to C1/C2 so the setup-question behavior is exercised, not just the fully-pinned path.
4. **Write the index** from the index template — OVERVIEW, SCENARIO TABLE, AXIS COVERAGE, EXECUTION, RELATED RESOURCES. Delete the availability blockquote unless the invocation surface is planned-but-not-built.
5. **Write one scenario file per row** from the scenario template. The first fenced json block is the runner-parsed machine contract; keep its field order. Fill Rationale, Pass shape, and Failure modes as scoring context.
6. **Write the baseline** from the baseline template. Ship every cell `pending` / `not_captured` if no Claude leg has run — a legitimate ship state, but never quotable as behavior.
7. **Validate and reconcile.** Validate the index and baseline with the shared document validator (`validate_document.py --type asset` or auto-detect). Confirm every table row has a matching scenario file, every scenario `id` matches its filename and row, and entry surface / clarity / expected interaction / budget agree across the table, the scenario, and the baseline.
8. **Hand fixtures and capture to the executing packet.** The package does not run itself; the spec-packet phase that executes a round provisions the fixtures, runs `behavior-bench-run.cjs`, and files the evidence.

### Naming

- Package directory `behavior_benchmark/` and index `behavior_benchmark.md` (underscore), directly under the mode-packet.
- Scenario files `<PREFIX>-NNN-<slug>.md`: uppercase three-letter prefix, zero-padded contiguous three-digit number from `001`, lowercase-hyphen slug.
- ID prefix is three uppercase letters, unique per package. The framework fixes `ACB`, `IMB`, `RSB`, `RVB`; a new mode extends that table (for example `DAB` for deep-alignment) and declares the extension in the index.

### ALWAYS / NEVER (behavior benchmark)

- **ALWAYS** keep the shared `framework.md` as the single source for rubric, buckets, budget formula, and enums; the package instantiates, it does not redefine.
- **ALWAYS** keep the index SCENARIO TABLE and the scenario files in exact sync.
- **ALWAYS** ship uncaptured baseline cells as `pending` / `not_captured` rather than inventing values.
- **NEVER** ship fixtures, transcripts, or result JSONs inside the package — they belong to the executing spec-packet phase.
- **NEVER** give a shipped scenario file frontmatter or a `## OVERVIEW` heading; it opens at the `# <PREFIX>-NNN` H1 (the scenario template's own frontmatter, usage comment, and Overview are stripped on copy).
- **NEVER** add a scenario whose `id` disagrees with its filename or its index-table row.

### Success Criteria (behavior benchmark)

- The owning mode-packet has a `behavior_benchmark/` package with an index, one scenario file per table row, and a baseline.
- Every scenario's first json block parses, its `id` matches its filename and index row, and its axis values agree across the table, scenario, and baseline.
- The index AXIS COVERAGE section reports per-surface and per-clarity counts and names any axis intentionally left out with its reason.
- The baseline ships with real values or with `pending` / `not_captured` cells, never invented ones.
- Shared sk-doc validation passes for the index and baseline, or any remaining issue is escalated with exact command output.

---

## 10. SKILL-BENCHMARK STORAGE AND INDEX

A skill-benchmark measures whether a skill is well-routed, discoverable, efficient, and useful; it is run by the deep-improvement Lane C harness (`/deep:skill-benchmark`), which emits a JSON+Markdown report pair per run. This packet owns exactly two things: the **storage convention** for a hub's `benchmark/` tree and the **template for its `benchmark/README.md` index**. It never authors the per-run report, the runner, or the scoring (see ALWAYS / NEVER). The full storage convention, run-label naming, and renderer boundary live in [`references/skill_benchmark/skill_benchmark_storage_guide.md`](references/skill_benchmark/skill_benchmark_storage_guide.md); the D1-D5 contract stays lane-local, cross-linked and never restated.

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

### Templates

| Output file | Template |
| --- | --- |
| `<skill-or-hub>/benchmark/README.md` | [`assets/skill_benchmark/skill_benchmark_readme_template.md`](assets/skill_benchmark/skill_benchmark_readme_template.md) |
| `skill-benchmark-report.md` | None — renderer-owned; see NEVER below |

### Authoring Workflow

1. **Read the storage guide** — confirm the run-label naming convention and the frozen-baseline rule.
2. **Confirm the target** has (or is establishing) a Lane C `benchmark/` tree beside the skill it measures.
3. **Author the index** from the README template: the run-label table (one row per on-disk folder, newest first), the structure map, re-run commands, and cross-links to the scoring contract and `/deep:skill-benchmark`.
4. **Cross-link the lane authorities** (`scoring_contract.md`, `operator_guide.md`); never restate the rubric or thresholds.
5. **Validate** the README with the shared sk-doc validator.

### ALWAYS / NEVER (skill-benchmark)

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

A model-benchmark run scores what a model or prompt framework produces against a fixed, held-out oracle; it is run by the deep-improvement Lane B harness (`/deep:model-benchmark`). This packet owns the **authored inputs** — the fixtures the model answers and the run profiles that drive a run. Both are data only; nothing in those directories executes. It never authors the evaluator, scorers, or reviewer-verdict contract (see ALWAYS / NEVER). The fixture-family taxonomy, profile shape, and lane boundary live in [`references/model_benchmark/model_benchmark_fixture_guide.md`](references/model_benchmark/model_benchmark_fixture_guide.md).

### Artifact Shape

Model-benchmark inputs live under the deep-improvement mode-packet, not in this packet:

```text
system-deep-loop/deep-improvement/assets/model_benchmark/
├── benchmark_fixtures/    # task contracts the model under test answers
│   └── <slug>.json
└── benchmark_profiles/    # run configs: fixtures, models, frameworks, scoring
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
| Code-task oracle fixture `<slug>.json` | [`assets/model_benchmark/model_benchmark_code_task_fixture_template.md`](assets/model_benchmark/model_benchmark_code_task_fixture_template.md) |
| Pattern / capability or reviewer-prompt fixture `<slug>.json` | [`assets/model_benchmark/model_benchmark_pattern_fixture_template.md`](assets/model_benchmark/model_benchmark_pattern_fixture_template.md) |
| Run profile `<profile>.json` | [`assets/model_benchmark/model_benchmark_profile_template.md`](assets/model_benchmark/model_benchmark_profile_template.md) |

Each template's fenced json block is the only thing copied into the shipped `.json`; shipped fixtures and profiles carry no frontmatter and no comments.

### Authoring Workflow

1. **Pick the family and shape**, and copy the closest existing fixture of that shape.
2. **Author a code-task oracle** by generating every `tests[]` / `hidden_tests[]` value from a verified reference implementation — never hand-guess an oracle; bias hidden cases to held-out adversarial inputs.
3. **Author a reviewer-prompt fixture** against the lane-local `reviewer_schema.md`; keep `expectedFindings` token-specific.
4. **Add or extend a profile** referencing the fixture `id`, with a `scorer` matching the fixture shape plus the sweep matrix, sampling, and gate.
5. **Parse every fixture and profile as JSON**, then hand off to the lane to dispatch, score, and file the evidence.

### ALWAYS / NEVER (model-benchmark)

- **ALWAYS** match the profile's scorer to the fixture shape — code-task → code-task scorer, evidence-contract → pattern scorer, reviewer-prompt → reviewer scorer.
- **ALWAYS** generate code-task oracle `expect` values from a verified reference implementation, with held-out `hidden_tests[]` guarding overfit.
- **ALWAYS** keep fixtures and profiles pure JSON, and each id in `profile.fixtures` matching an on-disk fixture's `id` field.
- **NEVER** restate or copy the evaluator rubric, scorer mechanics, or reviewer schema / verdict contract into this packet — they are lane-local; cross-link them.
- **NEVER** write run outputs back into the fixtures or profiles directories; those stay read-only inputs, and outputs land in each profile's `outputsDir`.

### Success Criteria (model-benchmark)

- Each fixture parses as JSON, carries its family's field set, and its `id` matches every profile that references it.
- Each code-task oracle's `expect` values come from a verified reference implementation, with held-out `hidden_tests[]`.
- Each profile names a scorer matching every fixture shape it scores and expands the `{spec_folder}` token in `outputsDir` rather than hard-coding a path.
- No evaluator, scorer, or reviewer-verdict contract was copied here; each is cross-linked to its deep-improvement authority.
- The authored `.md` templates and guide validate with the shared sk-doc validator, and the shipped `.json` parses.

---

## 12. REFERENCES

**Within this packet** — family guides and the overflow route-map; the fillable templates are mapped in each family section above:

- [`references/_shared/README.md`](references/_shared/README.md) — overflow route-map (case studies, worked example, pitfalls).
- [`references/behavior_benchmark/behavior_benchmark_guide.md`](references/behavior_benchmark/behavior_benchmark_guide.md) — behavior package authoring path (§9).
- [`references/skill_benchmark/skill_benchmark_storage_guide.md`](references/skill_benchmark/skill_benchmark_storage_guide.md) — skill-benchmark storage convention and renderer boundary (§10).
- [`references/model_benchmark/model_benchmark_fixture_guide.md`](references/model_benchmark/model_benchmark_fixture_guide.md) — model-benchmark fixture taxonomy, profile shape, lane boundary (§11).

**Lane-owned contracts** — cross-link, never restate:

- [`behavior-benchmark/framework.md`](../../system-deep-loop/shared/behavior-benchmark/framework.md) — behavior rubric, buckets, budget formula, runner.
- [`scoring_contract.md`](../../system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md) + [`build-report.cjs`](../../system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs) — Lane C D1-D5 scoring and the renderer that owns `skill-benchmark-report.md`.
- [`evaluator_contract.md`](../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) + [`reviewer_schema.md`](../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/reviewer_schema.md) — Lane B evaluator rubric and reviewer-prompt schema.

**Shared sk-doc backbone**: [`../shared/scripts/validate_document.py`](../shared/scripts/validate_document.py) — every authored `.md` must pass with 0 issues; [`../shared/references/`](../shared/references/) — cross-document standards.

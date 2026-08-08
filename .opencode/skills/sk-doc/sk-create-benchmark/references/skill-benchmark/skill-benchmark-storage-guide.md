---
title: Skill-Benchmark Storage Guide
description: Storage-convention standard for a hub's benchmark/ tree - the dated run folders a Lane C skill-benchmark run writes under reports/, the run-label naming seen in the wild, what lands in each run-label dir, and the hard boundary that the rendered report .md is renderer-owned and must never be hand-authored. The normative D1-D5 scoring contract stays owned by deep-improvement and is linked, not restated.
trigger_phrases:
  - "skill benchmark storage guide"
  - "hub benchmark folder convention"
  - "skill-benchmark-report storage"
  - "benchmark run-label naming"
  - "where do skill-benchmark reports live"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Skill-Benchmark Storage Guide

Where a Lane C skill-benchmark run's artifacts live, how the run-label folders
are named, and which of those artifacts is machine-owned. This is a storage and
naming standard only. It does NOT restate the measurement contract: the
five-dimension (D1-D5) computation, point weights, verdict bands, funnel, and
advisory signals live once in the deep-improvement scoring authority, linked in
section 1 and section 7. Where this guide and that contract diverge, the contract
prevails.

---

## 1. OVERVIEW

A **skill-benchmark** measures whether a skill is well-routed, discoverable,
efficient, and useful in practice. It is run by the deep-improvement **Lane C**
harness (`/deep:skill-benchmark`) and emits a dual JSON+Markdown report per run.
This guide governs one thing: **where those reports are stored and how the folders
are named**, so a future engineer can find every run for a skill beside the skill
it measures.

The convention is: each benchmarked skill or hub carries a `benchmark/` directory,
and every run of the Lane C harness writes its output into its own
**`<run-label>/`** folder under **`benchmark/reports/`**. Runs are siblings of each
other inside that tree; one run never overwrites another. One label — `baseline/` —
is the **frozen** comparison anchor and is never regenerated.

Everything a run produces lives under `reports/`, including the frozen anchor and the
compiled-routing archive lane. `benchmark/` itself holds only the layout README and
the optional input corpus, so the split is between what a run wrote and what a run
read.

This guide is normative for storage and naming only. Two deep-improvement-owned
documents remain the authority for everything the reports contain:

| Concern | Authority (owned by deep-improvement) |
| --- | --- |
| D1-D5 computation, point weights, Mode A/B scoring, advisory signals, funnel/bottleneck ranking | [`scoring-contract.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) |
| How to run Lane C, invocation flags, dimension coverage, verdict bands, target eligibility | [`operator-guide.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/operator-guide.md) |

Do not copy either contract into this packet. Cross-link them.

### Live examples in the wild

Read these two shipped hub trees to see the convention filled in against real
skills:

- [`system-deep-loop/benchmark/README.md`](../../../../system-deep-loop/benchmark/README.md) — a hub benchmarking itself with the harness that lives inside it.
- [`sk-code/benchmark/README.md`](../../../../sk-code/benchmark/README.md) — a hub with the fullest set of run-label folders, its structure and reading guide.

---

## 2. THE HUB BENCHMARK/ TREE

A hub `benchmark/reports/` tree holds one folder per run:

```text
<skill-or-hub>/benchmark/reports/
├── baseline/                     # FROZEN anchor — the before-snapshot, never regenerated
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md
├── <run-label>/                  # a regular run-label folder (one Lane C run)
│   ├── skill-benchmark-report.json
│   ├── skill-benchmark-report.md
│   ├── results.csv
│   ├── README.md
│   ├── failed-runs.md
│   ├── findings-and-recommendations.md
│   └── source.md
└── compiled-routing/             # fail-closed compiled-routing archive lane
```

| Entry | What it is |
| --- | --- |
| `benchmark/` | The per-skill benchmark root, kept beside the skill it measures |
| `benchmark/README.md` | Optional hub index — the look-here-first surface: current verdict, folder map, and re-run command. A `benchmark/` root README is a `readme`-type doc and may be templated |
| `benchmark/reports/` | Every result the skill has produced, indexed by its own README |
| `benchmark/reports/<run-label>/` | One Lane C run. Sibling to every other run; never overwrites another |
| `benchmark/reports/baseline/` | The frozen comparison anchor. Do not regenerate or overwrite it — a new run is always a new sibling folder |
| `benchmark/reports/compiled-routing/` | The compiled-routing archive lane, written by its own archiver rather than the Lane C harness |
| `benchmark/fixtures/` | Optional input corpus (public/private fixture pairs). An input, not a run — it holds no `skill-benchmark-report.*` pair |

**The frozen-baseline rule.** `baseline/` is the pre-optimization snapshot every
later run is compared against. Regenerating it destroys the anchor, so it is
never re-run in place. Add each new run as a sibling under `reports/`, named by the
dated grammar in the owning skill.

---

## 3. RUN-LABEL NAMING

Run folders are named by the fleet-wide grammar, `<YYYY-MM-DD>--<subject>--<variant>/`,
and match `^[a-z0-9]+(?:-{1,2}[a-z0-9]+)*$`: lowercase alphanumerics, single
hyphens inside a field, a double hyphen between fields. Dots, underscores and
capitals are rejected. The full rule, including subject and variant vocabulary,
lives in the owning skill's naming section.

The date is the run's **execution** date. The label is a human convenience; the
run's authoritative parameters live inside its `skill-benchmark-report.json`.

| Field | Value |
| --- | --- |
| `<YYYY-MM-DD>` | Execution date, so a directory listing sorts chronologically. |
| `<subject>` | The corpus measured: `skill-benchmark`, `manual-testing-playbook`, `mcp-retrieval`, `model-eval`, `command-surface`. |
| `<variant>` | What most distinguishes the run: the **feature or scenario group** for a feature-scoped run (e.g. `goal-hook`, with the model recorded inside the report), the **executor identity** `<runtime>-<model>-<effort>` when the point is which model ran it, `model-comparison`, or a topic slug naming the change measured. |

Examples, with the older label each replaces:

| Run folder | Replaces |
| --- | --- |
| `2026-07-21--skill-benchmark--router-final/` | legacy `router-final/` label |
| `2026-07-21--skill-benchmark--live-mode-b/` | `live-mode-b/` |
| `2026-07-21--skill-benchmark--luna-high/` | `luna-high-verify-20260721-120348/` |
| `2026-07-26--manual-testing-playbook--devin-glm-5-2/` | had no home before |

`baseline/` is the single exception and keeps its name. It is the frozen
comparison anchor rather than a run, and the archiver refuses it as a run label
for that reason.

Model versions flatten their dots, so `live-glm-5.2-high/` becomes
`<date>--skill-benchmark--glm-5-2-high/`. A dot fails the validator.

Trace-mode semantics (router vs live) and the flags that produce each run are
owned by [`operator-guide.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/operator-guide.md);
this guide only fixes how the resulting folder is named and where it sits.

---

## 4. WHAT LANDS IN A RUN-LABEL DIR

Every Lane C or manual playbook run writes the same **seven-file benchmark record**
into its run-label directory. There is no separate `d4-ablation.json` or
`d5-connectivity-detail.json` artifact: an opt-in `--d4` (D4-R task-outcome) run
rewrites the same report JSON and renderer output, and D5's structural-connectivity
result is a field inside `skill-benchmark-report.json`, not a standalone detail file
(verify against `run-skill-benchmark.cjs`).

| File | Required | Content |
| --- | --- | --- |
| `skill-benchmark-report.json` | Yes | The machine report: verdict, D1-D5 dimension scores, funnel, ranked bottlenecks, and per-scenario rows. The canonical artifact. An opt-in `--d4` D4-R run rewrites this same file in place. |
| `skill-benchmark-report.md` | Yes | The same report rendered for reading, generated FROM the JSON. Renderer-owned — see section 5. |
| `results.csv` | Yes | The machine-readable per-scenario result table rendered from the report record. |
| `README.md` | Yes | The per-run entry point with the headline verdict and run snapshot. |
| `failed-runs.md` | Yes | Renderer-owned failure details captured by the run. |
| `findings-and-recommendations.md` | Yes | Renderer-owned cross-run findings and remediation guidance. |
| `source.md` | Yes | Renderer-owned provenance pointer to the authoritative evidence packet. |

Read order: open `skill-benchmark-report.md` for the verdict and the ranked
bottlenecks; open `skill-benchmark-report.json` for per-scenario detail and for
any diff against `baseline/skill-benchmark-report.json`.

---

## 5. BOUNDARY: THE REPORT .MD IS RENDERER-OWNED

**`skill-benchmark-report.md` is a machine render. Never hand-author or hand-edit
it.** It is produced solely by the deep-improvement renderer
[`build-report.cjs`](../../../../system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs),
which renders the Markdown FROM `skill-benchmark-report.json` specifically so the
two artifacts cannot drift. That renderer is the ONLY writer of the report `.md`;
it takes the report object, not score arguments.

The consequences of this boundary:

| Rule | Why |
| --- | --- |
| Do not edit `skill-benchmark-report.md` by hand | It is an anti-drift render of the JSON. A hand edit desynchronizes it from its source of truth and is silently overwritten on the next run. |
| Do not author a fill-in template for `skill-benchmark-report.md` | There is no authoring template for a rendered report. To change the report, change the JSON the run emits or the renderer, both owned by deep-improvement. Templates in this packet are for the hub `benchmark/README.md` index and for INPUT fixtures/profiles only. |
| Do not copy the D1-D5 scoring, reviewer schema, or any scorer/runner into this packet | The scoring contract, reviewer schema, and the runner/renderer scripts are lane-local to deep-improvement. Cross-link them; never relocate them. |

To correct a report: fix the input (fixtures/router/scenario gold) or the scorer,
then re-run Lane C so the renderer regenerates the pair. Never patch the `.md`.

---

## 6. COMPILED-ROUTING ARCHIVE CONVENTION

A compiled-routing parity run gets its own durable, fail-closed sub-tree beside
the hub's other run-labels, plus a joined `serving-snapshot.json` describing the
hub's live serving state. The full schema and archiver contract live in
[`serving-snapshot-schema.md`](serving-snapshot-schema.md); the essentials that
belong in this storage standard:

```text
<hub>/benchmark/reports/compiled-routing/
├── router-compiled-parity-baseline/     # immutable parity before-anchor
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md
└── router-compiled-parity-final/        # immutable parity after-anchor
    ├── skill-benchmark-report.json
    └── skill-benchmark-report.md
```

| Rule | Behavior |
| --- | --- |
| Fail-closed on collision | An existing `<run-label>/` or either half of a prior pair is treated as occupied; the archiver writes nothing and leaves no partial directory. A run never overwrites another — the same frozen-baseline discipline as section 2, applied to every compiled-routing label. |
| Active-manifest gated | Every archive reads the active `010-live-activation/activation/<hub>/manifest.json` and aborts if that manifest's digest changes mid-archive. A `006-parent-hub-rollout` shadow candidate is refused. |
| `baseline` never repurposed | The frozen `baseline` label is never written by this convention. Compiled-routing parity is an additive sibling family — conventionally `router-compiled-parity-baseline` / `router-compiled-parity-final`. |
| Repo-relative provenance | On archive, the absolute `targetSkill.root` is dropped for a repo-relative `rootRel`, and `provenance` + `executionContext` blocks are added so the pair stays valid when copied off the machine that produced it. Historical reports are not retrofitted. |

The `.md` half stays renderer-owned (section 5): the archiver renders it from the
provenance-rewritten JSON via `build-report.cjs`, which grew a **Provenance &
execution context** section that appears only for archived pairs. The
`serving-snapshot.md` view is likewise rendered from `serving-snapshot.json`, not
hand-authored.

---

## 7. RELATED RESOURCES

### Normative contract (owned by deep-improvement — link, do not restate)

- [`scoring-contract.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) — the authoritative D1-D5 computation: point weights, Mode A deterministic scoring, the opt-in advisor probe, live-mode dimensions, advisory signals, and funnel/bottleneck ranking.
- [`operator-guide.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/operator-guide.md) — how to run Lane C: invocation, flags, dimension coverage, verdict bands, and target eligibility.
- [`scenario-authoring.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/scenario-authoring.md) — how to author the Lane C scenarios and fixture corpus a run scores; the doctrine for the optional `benchmark/fixtures/` input pairs.
- [`build-report.cjs`](../../../../system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs) — the renderer that owns `skill-benchmark-report.md` (see section 5).
- [`/deep:skill-benchmark`](../../../../../commands/deep/skill-benchmark.md) — the command that drives a Lane C run.

### Shipped hub trees to model against

- [`system-deep-loop/benchmark/README.md`](../../../../system-deep-loop/benchmark/README.md) — a hub benchmark index and run-label set.
- [`sk-code/benchmark/README.md`](../../../../sk-code/benchmark/README.md) — the fullest run-label set with a structure and reading guide.

### Within this packet

- [`serving-snapshot-schema.md`](serving-snapshot-schema.md) — the `serving-snapshot.json` schema, the fail-closed `compiled-routing/<run-label>/` convention, and repo-relative provenance (section 6).
- [`../SKILL.md`](../../SKILL.md) — the create-benchmark workflow and report contracts.
- [`README.md`](../shared/README.md) — the benchmark-creation reference map.
- [`behavior-benchmark-guide.md`](../behavior-benchmark/behavior-benchmark-guide.md) — authoring guide for the distinct behavior-benchmark family (executor behavior at a deep-loop mode's invocation surface), not the Lane C skill-benchmark storage covered here.
- [`create-manual-testing-playbook`](../../../sk-create-manual-testing-playbook/SKILL.md) — the sibling sk-doc skill that authors a manual-testing scenario corpus; hand its corpus into the optional `benchmark/fixtures/` input pairs when a Lane C run scores against curated scenarios rather than live discovery.

---

*End of skill-benchmark storage guide — the normative D1-D5 measurement contract lives in [`scoring-contract.md`](../../../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md), owned by deep-improvement.*

---
title: Deep-Alignment Behavior Benchmark
description: >-
  Behavior benchmark package for deep-alignment: eleven scenario contracts that
  specify executor-model behavior at the /deep:alignment command surface, built
  and verified in phase 009, under realistic prompting. Instantiates the shared
  framework as its governing contract and probes the mode's four alignment
  invariants.
trigger_phrases:
  - deep-alignment behavior benchmark
  - alignment executor behavior scenarios
  - DAB scenario contract
importance_tier: high
contextType: implementation
version: 1.0.0.1
---

## 1. OVERVIEW

> **Availability.** The `/deep:alignment` command and its `@deep-alignment` LEAF
> agent are the invocation surface, built and verified in phase 009 with both
> cutover gates green. The engine the scenarios exercise (scoping, the five
> adapters, the convergence and reducer scripts) is shipped and independently
> runnable today via each script's own CLI. Every scenario contract below
> therefore specifies *expected* behavior at that surface, and every
> `deep-alignment` LEAF-agent reference names the built agent. The Claude leg
> has been captured — all 11 DAB cells, 2026-07-12, single-sample on
> `claude-opus-4-8` via `claude-cli`, skeptic-verified by three independent GPT
> passes (9 confirm / 2 dispute) (see
> [./baselines/claude-baseline.md](./baselines/claude-baseline.md)).

This package specifies what an executor **model** should do once the
`/deep:alignment` command surface is triggered with a realistic user prompt. It
is a `behavior_benchmark` package carried by the `deep-alignment` mode-packet,
alongside the packages the other deep-loop workflow sub-skills carry; the
single-source measurement contract it instantiates is
[../../shared/behavior-benchmark/framework.md](../../shared/behavior-benchmark/framework.md),
which is normative — where this index or a scenario note diverges, that
framework prevails. Each scenario here is a self-contained run contract scored
on the framework's five-dimension rubric and classified into exactly one
terminal bucket.

The scenarios do not re-probe generic routing behavior the other packages
already cover; they concentrate on the behaviors that are **distinctive to
deep-alignment** — lane-first scoping (`SKILL.md` §2, `references/scoping_protocol.md`),
the config-file non-interactive path (`scripts/scoping.cjs` `parseLaneConfigFile`),
one report per lane (`runtime/scripts/reduce-alignment-state.cjs`
`renderAlignmentReport`), and the four alignment invariants the engine enforces:
verify-first, known-deviation suppression, read-only default, and gated
remediation (`SKILL.md` §2 "The Alignment Contract").

### Framework extensions this package declares

Two framework fields carry package-specific values not yet enumerated in the
framework's own tables; both are grounded in the shipped mode, not invented for
this benchmark:

- **`mode: "alignment"`** — the value the shipped `assets/deep_alignment_config_template.json`
  (`"mode": "alignment"`) carries today and the `/deep:alignment` command, built
  and verified in phase 009, consumes. This extends the framework's `mode` enum
  (`context | research | review | ai-council | improvement`) with the mode this
  package measures.
- **ID prefix `DAB`** (Deep Alignment Behavior) — extends the framework's
  fixed per-package prefix table (`ACB | IMB | RSB | RVB`).

## 2. SCENARIO TABLE

| ID | Title | Entry | Clarity | Expected | Budget |
| --- | --- | --- | --- | --- | --- |
| DAB-001 | Fully-specified :auto run with --lane-config | E1 | C3 | autonomous | 900000 |
| DAB-002 | Bare command must halt with ONE consolidated scoping + setup question | E2 | C2 | question_halt | 522129 |
| DAB-003 | Vague natural ask with no authority and no scope | E3 | C1 | question_halt | 180000 |
| DAB-004 | Concise natural ask naming authority + target but not mode | E3 | C2 | question_halt | 739986 |
| DAB-005 | Verify-first: re-probe live ground truth before asserting a finding | E1 | C3 | autonomous | 900000 |
| DAB-006 | Known-deviation suppression: must NOT flag a documented convention | E1 | C3 | autonomous | 900000 |
| DAB-007 | Read-only default: must NOT modify an audited artifact | E1 | C3 | autonomous | 900000 |
| DAB-008 | Per-lane report emission across a multi-authority run | E1 | C3 | autonomous | 900000 |
| DAB-009 | Boundary vs deep-review: decline a general-correctness ask | E3 | C2 | question_halt | 459000 |
| DAB-010 | Boundary vs parent-skill-check: decline a hub-structure check | E3 | C2 | question_halt | 603000 |
| DAB-011 | Clean pass: a fully-conformant lane converges to zero findings | E1 | C3 | autonomous | 900000 |

## 3. AXIS COVERAGE

Entry-surface coverage: E1 x6 (DAB-001, DAB-005, DAB-006, DAB-007, DAB-008,
DAB-011), E2 x1 (DAB-002), E3 x4 (DAB-003, DAB-004, DAB-009, DAB-010). Clarity
coverage: C1 x1 (DAB-003), C2 x4 (DAB-002, DAB-004, DAB-009, DAB-010), C3 x6
(DAB-001, DAB-005, DAB-006, DAB-007, DAB-008, DAB-011) — 5 of 11 cells sit at
C1/C2, so nearly half the matrix exercises under-specified input rather than
the fully-pinned config-driven path. Invariant coverage: verify-first
(DAB-005), known-deviation suppression (DAB-006), read-only default (DAB-007),
gated remediation (DAB-007 secondary), and per-lane report emission (DAB-008)
are each isolated in at least one cell. Findings-outcome coverage: a lane that
resolves real, non-suppressed findings after a live re-probe (DAB-005's
secondary genuine-finding check, DAB-006's secondary genuine-P0 check), a lane
that converges to a genuinely clean zero-findings PASS with no suppression or
re-probe involved (DAB-011), and a multi-lane, multi-authority run reported as
distinct per-lane sections (DAB-008) are each isolated in at least one cell.
Boundary coverage: the two crisp boundaries `SKILL.md` §1 draws — against
`deep-review` (general correctness) and against `parent-skill-check.cjs` (hub
structure) — each get a decline cell (DAB-009, DAB-010).

The `E4` orchestrate surface is intentionally not exercised: deep-alignment's
distinctive behaviors are scoping- and invariant-driven, not routing-driven, and
the generic orchestrate hand-off contract is already covered by the sibling
packages that share this hub's dispatch path.

## 4. EXECUTION

The runner is `../../shared/behavior-benchmark/behavior-bench-run.cjs`, invoked
per cell as one run of one scenario contract against one executor, with the
scenario's `fixture` absorbing all writes for the run (the `alignment/`
sub-directory the loop writes into). Checkpoint and delegation-evidence
extraction, the no-progress watchdog, scoring, and classification are owned by
that runner; results are emitted as result JSON with `schemaVersion: 1`. Run
evidence — transcripts, result JSONs, scorecards — lands in the **spec packet
phase that executed the round**, never inside this package; a result cited from
this index must point to its evidence in that executing phase.

**Fixtures and lane-configs are provisioned by the executing round, not shipped
in this package** (mirroring the framework's evidence-location rule that the
package holds the contract while the packet holds the proof). Each scenario names
the `fixture` directory it binds and, where the run is config-driven, the
`--lane-config` JSON it consumes; the executing round provisions that directory
with the corpus each cell's body describes (a small `docs/` markdown corpus, a
`src/` code file for the multi-authority cell, and the per-cell lane-config
files). Per-scenario baseline checkpoints live in
[./baselines/claude-baseline.md](./baselines/claude-baseline.md); the Claude
leg has been captured (11/11 cells, 2026-07-12, skeptic-verified), so the
`budget_ms` values in the table above are the baseline-recomputed values
(`max(3 * tTerminal, 180000)`, cap `900000`), not framework-floor provisional
ones — DAB-001/005/011 and the three `timeout_latency` cells (DAB-006/007/008)
recompute to the `900000` cap itself, so their table value is unchanged. D5
stays `null` for every cell here: D5 scores an executor leg's `tTerminal`
*against* this baseline, and no non-baseline executor leg has been captured
yet.

## 5. RELATED RESOURCES

- [../../shared/behavior-benchmark/framework.md](../../shared/behavior-benchmark/framework.md) — the normative measurement contract this package instantiates (five-dimension rubric, terminal buckets, ID-prefix table, budget formula).
- [../../shared/behavior-benchmark/behavior-bench-run.cjs](../../shared/behavior-benchmark/behavior-bench-run.cjs) — the runner that extracts checkpoints and delegation evidence, scores, and classifies each cell.
- [../README.md](../README.md) — the mode README, whose §5 carries the authoritative availability / build-state note for the `/deep:alignment` surface and its `@deep-alignment` LEAF agent.
- [../SKILL.md](../SKILL.md) — the mode contract: state machine, adapter contract, and the four alignment invariants these scenarios probe.
- [./baselines/claude-baseline.md](./baselines/claude-baseline.md) — per-scenario Claude-leg baseline checkpoints (11/11 captured 2026-07-12, skeptic-verified).
- [Authoring: ../../../sk-doc/create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md](../../../sk-doc/create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md) — the behavior-benchmark authoring guide (create-benchmark §9): how to author this package's index, scenarios, and baseline. Templates and authoring standards live there; this package instantiates the framework above.

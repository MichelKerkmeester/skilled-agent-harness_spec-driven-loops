---
title: Deep-Alignment Behavior Benchmark
description: >-
  Behavior benchmark package for deep-alignment: eleven captured alignment
  scenarios plus four pending schema-v2 command-topology pilots. The package
  instantiates the shared framework as its governing contract and probes both
  alignment invariants and command execution ownership.
trigger_phrases:
  - deep-alignment behavior benchmark
  - alignment executor behavior scenarios
  - DAB scenario contract
importance_tier: high
contextType: implementation
---

## 1. OVERVIEW

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
remediation ([SKILL.md §3 "The Alignment Contract"](../SKILL.md#the-alignment-contract)).

DAB-012 through DAB-015 add one schema-v2 pilot per frozen command topology.
They measure workflow handoff, semantic subaction binding, direct MCP dispatch,
and inline monolithic ownership without changing the shared framework or runner.
Their baseline cells remain pending until operator-gated live capture occurs.

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
| DAB-012 | Workflow router: bounded deep-review dispatch | E1 | C3 | autonomous | 900000 |
| DAB-013 | Subaction router: parent-skill diagnostic binding | E1 | C3 | autonomous | 180000 |
| DAB-014 | Direct-tool router: bounded memory retrieval | E1 | C3 | autonomous | 180000 |
| DAB-015 | Monolithic command: consolidated prompt-improve setup | E1 | C2 | question_halt | 180000 |

## 3. AXIS COVERAGE

Entry-surface coverage: E1 x10 (DAB-001, DAB-005, DAB-006, DAB-007, DAB-008,
DAB-011, DAB-012, DAB-013, DAB-014, DAB-015), E2 x1 (DAB-002), E3 x4
(DAB-003, DAB-004, DAB-009, DAB-010). Clarity coverage: C1 x1 (DAB-003), C2 x5
(DAB-002, DAB-004, DAB-009, DAB-010, DAB-015), C3 x9 (DAB-001, DAB-005,
DAB-006, DAB-007, DAB-008, DAB-011, DAB-012, DAB-013, DAB-014) — 6 of 15
cells sit at C1/C2. Invariant coverage: verify-first
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

Command-topology coverage is exactly one pilot per shape: workflow router
(DAB-012), subaction router (DAB-013), direct-tool/plugin router (DAB-014), and
monolithic (DAB-015). DAB-012 uses LEAF task-dispatch evidence; DAB-013 binds its
semantic target through setup probes; DAB-014 requires direct memory-tool target
evidence while forbidding LEAF and workflow-YAML signals; DAB-015 expects the
command-owned consolidated setup procedure with no external workflow.

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
that runner. DAB-001 through DAB-011 emit `schemaVersion: 1`; DAB-012 through
DAB-015 opt into `schemaVersion: 2` with postcondition, direct-dispatch, and
boundary evidence. Run
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
leg has been captured for the original set (11/11 cells, 2026-07-12,
skeptic-verified). The four command-topology pilots bind dedicated phase-owned
fixture directories and remain `pending (deferred live capture)`, so their
budgets are provisional framework-floor or bounded-workflow values. For the
captured set, the
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
- [./baselines/claude-baseline.md](./baselines/claude-baseline.md) — per-scenario Claude-leg baseline checkpoints (11 captured; four command-topology pilot rows pending deferred live capture).
- [Authoring: ../../../sk-doc/create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md](../../../sk-doc/create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md) — the behavior-benchmark authoring guide (create-benchmark §9): how to author this package's index, scenarios, and baseline. Templates and authoring standards live there; this package instantiates the framework above.

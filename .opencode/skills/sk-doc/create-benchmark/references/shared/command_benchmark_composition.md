---
title: Command Benchmark Composition Guide
description: How a command benchmark composes the behavior and conformance axes over the OpenCode command surface through a bounded matrix manifest and a launcher command. Documents the matrix-manifest field shape as an authoring standard; the manifest, scheduler, launcher, and runner stay lane-owned in system-deep-loop.
trigger_phrases:
  - "command benchmark composition"
  - "command benchmark matrix manifest"
  - "command surface benchmark launcher"
  - "compose behavior and conformance benchmark"
  - "command benchmark fanout gap"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Command Benchmark Composition Guide

## 1. OVERVIEW: WHAT A COMMAND BENCHMARK IS

A **command benchmark** is not a standalone benchmark family. It is a
**composition** of two families that create-benchmark already owns, run over the
OpenCode command surface:

- the **behavior** axis — how executor models handle each command at its invocation
  surface (section 9 and the behavior worked mapping in
  [`../behavior_benchmark/behavior_benchmark_guide.md`](../behavior_benchmark/behavior_benchmark_guide.md) section 7); and
- the **conformance** axis — whether the command artifacts deterministically conform
  to the sk-doc standard through the `sk-doc-command` peer adapter (section 12 and
  the conformance worked mapping in
  [`../conformance_benchmark/conformance_benchmark_authoring_guide.md`](../conformance_benchmark/conformance_benchmark_authoring_guide.md) section 8).

A launcher composes both axes and reports them side by side **without averaging**:
a clean behavioral score never masks a conformance failure, and the reverse.
Because the command benchmark reuses the two families' templates and standards, it
adds no seventh family key to the smart router — it is authored by producing one
`behavior_benchmark` package and one `conformance_benchmark` package for the
command surface, then binding them with the matrix manifest below.

## 2. THE MATRIX MANIFEST (COMPOSITION LAYER)

The composition layer is a **bounded matrix manifest** that enumerates every
required cell — one scenario against one executor leg — so the run plan is fully
reconcilable without a model. The manifest, its scheduler, and the launcher are
**lane-owned** in `system-deep-loop`; create-benchmark documents the field shape
here only as an authoring standard so a future command benchmark stays consistent.

Authoritative top-level fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `schemaVersion` | int | Manifest schema version. |
| `matrixId` | string | Stable identifier for this matrix run plan. |
| `runnerPath` | string | The frozen shared behavior runner every cell is scheduled against; the matrix never introduces a private runner. |
| `bounds` | object | The declared bounds of the fan-out (see below). |
| `fanoutGap` | object | `{ source, declaration, consequence }` — records a deliberately bounded fan-out axis so the bound is explicit, never a silent truncation. |
| `fixtures` | object | Per-scenario fixture references, keyed by scenario id. |
| `requiredCells` | array | One entry per required cell (see below). |

`bounds` fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `scenarioIds` | array | The scenario ids in scope for the matrix. |
| `scenarioCount` | int | The count of `scenarioIds`, kept in the manifest for a fast reconcile. |
| `driverLegs` | array | Executor legs, each `{ legName, role }` — one baseline leg plus the driver legs under comparison. |
| `leafSentinelScenarioIds` | array | Scenarios that also carry a delegation-leaf sentinel cell. |
| `defaultSamples` | int | Samples per production cell. |
| `contestedSamples` | int | Reserved sample count for a cell that real evidence makes contested. |
| `requiredCellCount` | int | Total required cells; the run must satisfy exactly this many. |

Each `requiredCells[]` entry carries `{ id, cellKind, role, scenarioId,
scenarioPath, legName, samples, fixtureRef }` plus **exactly one of** `resultPointer`
or `skip`: its scenario and leg, its sample count, a fixture-hash reference, and
either a result pointer or a machine-readable `skip`. A cell is either produced
(with a `resultPointer`) or explicitly skipped — never silently dropped.

## 3. AUTHORING ORDER

1. Author the command-surface **behavior** package (behavior_benchmark guide) — the
   per-scenario machine contracts (schema-v2 for direct-dispatch command cells) and
   the Claude baseline.
2. Author the command-surface **conformance** package (conformance_benchmark guide)
   — the family index, contract, lane config, and fixture manifest.
3. Bind both axes with the **matrix manifest** (lane-owned) and drive them with the
   **launcher** (lane-owned). create-benchmark's role ends at the two input
   packages plus this standard; scheduling, running, scoring, and reporting stay
   lane-local.

## 4. RELATED RESOURCES

- [`../behavior_benchmark/behavior_benchmark_guide.md`](../behavior_benchmark/behavior_benchmark_guide.md) — the behavior axis and its packet-066 worked mapping (section 7).
- [`../conformance_benchmark/conformance_benchmark_authoring_guide.md`](../conformance_benchmark/conformance_benchmark_authoring_guide.md) — the conformance axis and its packet-066 worked mapping (section 8).
- [`README.md`](README.md) — the create-benchmark reference map.
- `.opencode/skills/system-deep-loop/deep-alignment/assets/command_benchmark/command_benchmark_matrix.json` — the shipped, lane-owned matrix manifest this shape documents.
- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/` — the source packet: behavior evaluator, fixtures/oracle, bounded matrix, and launcher.

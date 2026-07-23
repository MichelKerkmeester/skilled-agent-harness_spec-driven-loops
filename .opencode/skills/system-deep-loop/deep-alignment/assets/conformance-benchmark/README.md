---
title: "Deep Alignment Conformance Benchmarks"
description: "Package index for the deep-alignment conformance_benchmark family: each benchmark-id directory binds a canonical corpus to a named authority and peer adapter, with its lane config, independent fixtures, status, source packet, execution command, and run-evidence location. Currently indexes the command-surface benchmark (sk-doc authority, sk-doc-command adapter)."
trigger_phrases:
  - "deep alignment conformance benchmark index"
  - "conformance_benchmark package index"
  - "command surface conformance benchmark family"
  - "peer adapter benchmark readme"
importance_tier: "important"
contextType: "general"
---

# Deep Alignment Conformance Benchmarks

> Deterministic artifact-conformance contracts and fixtures for `Deep Alignment`, executed through deep-alignment peer adapters against named authorities. This package holds stable inputs; the executing spec phase holds run evidence.

## 1. OVERVIEW

This `conformance_benchmark` package indexes deterministic checks of
`the OpenCode command surface — canonical command sources, their declared workflow
and presentation assets, and their generated .codex/prompts mirrors`. Each
benchmark-id directory binds one canonical corpus to one existing deep-alignment
authority and artifact class, selects its peer adapter, and records where the
resulting evidence is written. The package does not execute, score, or reduce a
run.

**Package status:** Authored and runnable — the `command-surface` inputs
(contract, lane-config, fixtures) are complete and validated. The executing phase
(`004-command-lane-integration`) already holds a completed live convergence run
over the command surface (overall verdict FAIL, with open findings); a formally
accepted, frozen fixture-corpus benchmark run identity is not yet recorded.
**Owning mode:** `deep-alignment`.
**Source specification:** `.opencode/specs/system-deep-loop/035-command-surface-benchmark/`.

## 2. BENCHMARK-ID INDEX

<!-- Add one row per benchmark-id directory. The Authority and Adapter columns
     are distinct: authority selects the standard; adapter selects the allowlisted
     peer implementation for that authority. Status is authored package state,
     not a generated run verdict. -->

| Benchmark ID | Authority | Adapter | Corpus | Status | Source spec packet | Execution | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [`command-surface`](./command-surface/conformance-benchmark.md) | `sk-doc` | `sk-doc-command` | `.opencode/commands` tree (public + held-out fixtures) | Live convergence run complete (FAIL); fixture-run identity pending | `system-deep-loop/035-command-surface-benchmark` | [command](#exec-command-surface) | [`004/alignment/`](../../../../../specs/system-deep-loop/035-command-surface-benchmark/004-command-lane-integration/alignment) |

## 3. CORPUS

| Benchmark ID | Canonical corpus source | Inclusion boundary | Fixture manifest |
| --- | --- | --- | --- |
| `command-surface` | `.opencode/commands` | Canonical command sources plus their generated mirrors and declared workflow/presentation assets, discovered under the lane scope; excludes runtime behavior and parameterized targets | [`fixture-manifest.json`](./command-surface/fixtures/fixture-manifest.json) |

The canonical source, not a copied count in this README, decides corpus
membership. If the source inventory changes, regenerate or re-verify the corpus,
refresh its recorded hash, and update the affected index row before execution.

## 4. EXECUTION

<a id="exec-command-surface"></a>
### exec-command-surface — `command-surface`

Run from the repository root after `sk-doc-command` is registered for
`sk-doc` in deep-alignment's `AUTHORITY_ADAPTERS` allowlist:

```bash
/deep:alignment :auto --lane-config .opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/lane-config.json --spec-folder .opencode/specs/system-deep-loop/035-command-surface-benchmark/004-command-lane-integration
```

Expected stable inputs:

- Contract: [`command-surface/conformance-benchmark.md`](./command-surface/conformance-benchmark.md)
- Lane config: [`command-surface/lane-config.json`](./command-surface/lane-config.json)
- Fixture manifest: [`command-surface/fixtures/fixture-manifest.json`](./command-surface/fixtures/fixture-manifest.json)

## 5. EVIDENCE LOCATION

The package is the stable authoring surface; it is not the audit trail. Evidence
for `command-surface` lands at
[`004-command-lane-integration/alignment/`](../../../../../specs/system-deep-loop/035-command-surface-benchmark/004-command-lane-integration/alignment)
in the executing spec phase. That location owns transcripts, deep-alignment state
and deltas, reduced reports, and any generated scorecard. Update the pointer after
each accepted run; do not copy those generated artifacts into this package.

## 6. RELATED RESOURCES

- [`command-surface/conformance-benchmark.md`](./command-surface/conformance-benchmark.md) — the per-benchmark purpose, scope, inputs, validity gates, and ownership boundary.
- [`command-surface/lane-config.json`](./command-surface/lane-config.json) — the deep-alignment lane selection.
- [`command-surface/fixtures/fixture-manifest.json`](./command-surface/fixtures/fixture-manifest.json) — independent oracle provenance and fixture expectations.
- [`sk-doc-command-adapter.md`](../../references/adapters/sk-doc-command-adapter.md) — adapter-owned dimensions, severities, finding codes, and known-deviation boundary.
- [`Autonomous Deep Alignment Loop`](../../SKILL.md) — the engine contract that owns discovery, partitioning, convergence, reduction, and reporting.

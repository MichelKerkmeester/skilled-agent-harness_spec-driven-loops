---
title: "Command Surface Conformance Benchmark"
description: "Deterministic artifact-conformance contract binding the OpenCode command surface to the sk-doc authority through the sk-doc-command peer adapter: canonical corpus, lane binding, adapter-owned S1-S5 dimensions, independent fixtures, validity gates, and the executing-phase evidence location."
trigger_phrases:
  - "command surface conformance benchmark"
  - "sk-doc-command conformance contract"
  - "command mirror identity route graph benchmark"
  - "opencode command surface validity gates"
importance_tier: "important"
contextType: "general"
---

# Command Surface Conformance Benchmark

## 1. OVERVIEW

### Purpose

This benchmark deterministically checks `the OpenCode command surface — canonical
.opencode/commands/** sources, their declared workflow and presentation assets, and
their generated .codex/prompts/** mirrors` against the named `sk-doc` authority
through the `sk-doc-command` peer adapter. Its purpose is to decide whether the
command surface conforms to the sk-doc command-authoring standard along mirror
identity, target reachability, route-graph integrity, capability-and-safety
consistency, and presentation ownership, deterministically enough to gate command
changes. The contract fixes inputs and interpretation boundaries; it does not
implement or run the check.

## 2. SCOPE AND CANONICAL CORPUS

| Field | Value |
| --- | --- |
| Benchmark ID | `command-surface` |
| In scope | Canonical command sources under `.opencode/commands/`, their declared workflow YAML and presentation assets, and the generated `.codex/prompts/` mirrors that must stay identical to their canonical source. |
| Out of scope | Command runtime behavior, natural-language router prose (which never triggers S5), parameterized targets that resolve only at run time, and non-command skill or agent artifacts. |
| Canonical corpus source | `.opencode/commands/` (the live command tree, discovered by the adapter) |
| Corpus selection rule | Every command source the adapter's `discover(scope)` resolves under the lane scope, together with the generated mirrors and declared workflow/presentation assets each source references. Membership is decided by discovery, never by a fixed count. |
| Corpus refresh / verification command | `node .opencode/specs/system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs --verify --manifest .opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/fixtures/fixture-manifest.json` |
| Expected corpus state | Fixture root hash `sha256:0d1e6ab84ad9214a0ad6eabeb5147e99499cfea640326aeeb66503f24e537bf8`, with every per-fixture hash recorded in the manifest. |

The canonical source and selection rule decide membership. A copied artifact
count is evidence about one revision, not a substitute source of truth.

## 3. LANE BINDING

| Lane field | Value |
| --- | --- |
| Authority | `sk-doc` |
| Artifact class | `docs` |
| Adapter | `sk-doc-command` |
| Scope | `paths: [".opencode/commands"]` |
| Lane config | [`lane-config.json`](./lane-config.json) |
| Adapter source | [`sk-doc-command.cjs`](../../../scripts/adapters/sk-doc-command.cjs) |
| Adapter contract | [`sk_doc_command_adapter.md`](../../../references/adapters/sk_doc_command_adapter.md) |

The adapter is a peer selector under an existing authority and artifact class.
It does not create a new deep-alignment authority or artifact-class value.

## 4. ADAPTER-OWNED DIMENSIONS AND SEVERITIES

The selected adapter owns the definitions below. These rows are cross-links only;
this benchmark contract deliberately does not paraphrase or redefine their
semantics.

| Dimension ID | Normative definition |
| --- | --- |
| S1 | [`S1`](../../../references/adapters/sk_doc_command_adapter.md#s1-mirror-identity) |
| S2 | [`S2`](../../../references/adapters/sk_doc_command_adapter.md#s2-target-reachability) |
| S3 | [`S3`](../../../references/adapters/sk_doc_command_adapter.md#s3-route-graph-integrity) |
| S4 | [`S4`](../../../references/adapters/sk_doc_command_adapter.md#s4-capability-and-safety-consistency) |
| S5 | [`S5`](../../../references/adapters/sk_doc_command_adapter.md#s5-presentation-ownership) |

| Severity ID | Normative definition |
| --- | --- |
| P0 | [`P0`](../../../references/adapters/sk_doc_command_adapter.md#5-dimensions-and-finding-codes) |
| P1 | [`P1`](../../../references/adapters/sk_doc_command_adapter.md#5-dimensions-and-finding-codes) |
| P2 | [`P2`](../../../references/adapters/sk_doc_command_adapter.md#5-dimensions-and-finding-codes) |

Finding codes, dimension assignment, severity assignment, and known-deviation
semantics remain adapter-owned; the engine owns the cross-adapter severity
doctrine that P0/P1/P2 encode. The adapter contract's section 5 is where each
command finding code is bound to its dimension and severity. A package update may
refresh these links but may not substitute local definitions.

## 5. FIXTURE POLICY

- **Manifest:** [`fixtures/fixture-manifest.json`](./fixtures/fixture-manifest.json).
- **Oracle independence:** `command-surface-independent-reference-oracle` is
  authored and verified independently of `sk-doc-command`; the production adapter
  MUST NOT import or invoke oracle logic (`productionAdapterImportProhibited: true`
  in the manifest).
- **Clean control:** `clean-control` must produce exactly zero findings when the
  instrument is valid.
- **Public calibration fixtures:** the `public-*` fixtures exercise one defect each
  across S1-S5 — mirror drift, missing mirror, missing workflow target, missing
  presentation target, route cycle, capability mismatch, destructive-without-
  confirmation, and duplicated presentation owner — as the visible calibration set.
- **Held-out fixtures:** the `held-out-*` fixtures — orphan mirror, wrong subaction
  mapping, destructive boundary contradiction, and a compound multi-defect cell —
  are reserved to detect overfitting; do not disclose their specifics beyond what
  the manifest records.
- **Mutation provenance:** every mutation and expected finding is recorded in the
  manifest with a fixture hash, code, severity, dimension, and location.
- **Immutability:** a fixture hash change creates a new evidence identity; never
  compare runs as equivalent across unrecorded fixture changes.

Expected outcomes come from the independent oracle, never from a production
adapter run. The stable package may carry oracle provenance and expected outcomes;
the oracle implementation remains spec- or lane-owned.

## 6. EXECUTION INPUTS

| Input | Location | Required state |
| --- | --- | --- |
| Contract | `.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/conformance_benchmark.md` | Filled, validated, and linked from the family README |
| Lane config | [`lane-config.json`](./lane-config.json) | Valid JSON; peer adapter allowlisted for the named authority |
| Fixture manifest | [`fixtures/fixture-manifest.json`](./fixtures/fixture-manifest.json) | Valid JSON; root and fixture hashes verified |
| Fixture root | `.opencode/specs/system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle/fixtures/corpus` | Clean control plus declared public and held-out fixtures present |
| Canonical corpus source | `.opencode/commands` | Refresh / verification command exits 0 |
| Executing spec phase | `.opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration` | Writable evidence location and deep-alignment state directory available |

Execution command:

```bash
/deep:alignment :auto --lane-config .opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/lane-config.json --spec-folder .opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration
```

## 7. VALIDITY GATES

Instrument validity and subject outcome are independent states. Record both; never
turn an instrument failure into a subject failure.

### Instrument-valid gate

The run is `instrument-valid` only when all of the following are true:

1. Lane-config JSON parses and deep-alignment scoping resolves `sk-doc` / `docs` /
   `sk-doc-command` without an input-validation error.
2. The selected adapter loads and its `discover`, `standardSource`, and `check`
   calls complete without unresolved adapter or oracle errors.
3. The discovered corpus matches every declared command source, its generated
   mirrors, and its declared workflow/presentation assets, and the clean control
   yields zero findings.
4. Raw finding deltas are parseable and agree with the reduced evidence under
   `.opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration/alignment/`
   according to the reducer's delta-to-reduced agreement in
   `reduce-alignment-state.cjs`.
5. Fixture and corpus hashes match the recorded execution inputs.

If any condition fails, record `instrument-valid: false`, preserve the diagnostic
evidence, and issue no subject conformance verdict.

### Subject pass / fail gate

Evaluate subject conformance only after `instrument-valid: true`. A subject fail is
one or more unsuppressed adapter findings under the adapter-owned S1-S5 and
P0/P1/P2 contracts. A subject pass is no such findings over the complete declared
corpus. `adapter-error`, incomplete coverage, corrupt evidence, or an oracle
mismatch is an instrument failure, never a subject finding.

## 8. EVIDENCE LOCATION

Stable inputs live in this mode-owned package. Run evidence lives at
[`004-command-lane-integration/alignment/`](../../../../../../specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration/alignment)
inside the executing spec phase, including transcripts, state, raw deltas, reduced
reports, and generated scorecards. The accepted run identity is `pending` (no
accepted live conformance run captured yet); its input hash is `pending`.

## 9. OWNERSHIP BOUNDARY

This authored package owns only the index, this contract, lane-config input,
fixture manifest and stable fixtures, oracle provenance, and evidence pointers.
It does **not** own or template:

- adapter code or the three-method adapter implementation;
- S1-S5 semantics, P0/P1/P2 semantics, finding-code mapping, or known-deviation semantics;
- discovery, partitioning, iteration, convergence, reduction, or remediation;
- the oracle implementation or its verifier;
- a runner, rubric, scorer, generated report, or scorecard.

Those remain with the selected adapter, deep-alignment engine, independent oracle,
or executing spec phase. Cross-link them; do not copy their implementation or
measurement contracts here.

## 10. RELATED RESOURCES

- [`../README.md`](../README.md) — the conformance-benchmark family index.
- [`lane-config.json`](./lane-config.json) — the exact lane input for this benchmark.
- [`fixtures/fixture-manifest.json`](./fixtures/fixture-manifest.json) — oracle provenance, fixture classes, hashes, mutations, and expected findings.
- [`sk_doc_command_adapter.md`](../../../references/adapters/sk_doc_command_adapter.md) — adapter-owned dimensions, severities, finding codes, and known-deviation boundary.
- [`Autonomous Deep Alignment Loop`](../../../SKILL.md) — engine-owned discovery through reduction.
- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/` — source requirements and the executing evidence phase.

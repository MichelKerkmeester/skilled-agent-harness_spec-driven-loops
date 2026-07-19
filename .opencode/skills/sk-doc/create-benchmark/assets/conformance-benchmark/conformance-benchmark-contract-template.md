---
title: "Conformance Benchmark Contract Template"
description: "Fillable scaffold for one deterministic artifact-conformance benchmark contract, the conformance-benchmark.md that binds a canonical corpus to a deep-alignment authority, artifact class, peer adapter, independent fixtures, validity gates and an executing-spec evidence location without redefining adapter-owned dimensions or severities."
trigger_phrases:
  - "conformance benchmark contract template"
  - "conformance-benchmark.md scaffold"
  - "peer adapter benchmark contract"
  - "artifact conformance validity gates"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for ONE conformance-benchmark CONTRACT:
  <deep-loop-mode>/assets/conformance-benchmark/<benchmark-id>/conformance-benchmark.md

Usage:
  1. cp this file to the benchmark-id directory, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/conformance-benchmark/conformance-benchmark-contract-template.md \
        .opencode/skills/system-deep-loop/<mode>/assets/conformance-benchmark/<benchmark-id>/conformance-benchmark.md
  2. DELETE the "version:" line above. A shipped contract carries the five
     frontmatter fields shown and NO version field. Replace the template title,
     description, and trigger phrases with benchmark-specific values.
  3. Fill every {{PLACEHOLDER}} and remove every <!-- guidance --> comment.
  4. Cross-link S1-S5 and P0/P1/P2 to the selected adapter's own reference.
     Never define their semantics in this package.
  5. Keep instrument validity separate from subject conformance. An adapter or
     evidence failure invalidates the instrument; it is not a subject finding.
-->

# {{BENCHMARK_TITLE}} Conformance Benchmark

## 1. OVERVIEW

### Purpose

This benchmark deterministically checks `{{SUBJECT_DESCRIPTION}}` against the
named `{{AUTHORITY}}` authority through the `{{ADAPTER}}` peer adapter. Its purpose
is {{PURPOSE_AND_DECISION_THIS_BENCHMARK_SUPPORTS}}. The contract fixes inputs and
interpretation boundaries; it does not implement or run the check.

## 2. SCOPE AND CANONICAL CORPUS

| Field | Value |
| --- | --- |
| Benchmark ID | `{{BENCHMARK_ID}}` |
| In scope | {{IN_SCOPE_ARTIFACTS_AND_BOUNDARY}} |
| Out of scope | {{OUT_OF_SCOPE_ARTIFACTS_AND_BOUNDARY}} |
| Canonical corpus source | [`{{CANONICAL_CORPUS_SOURCE_LABEL}}`]({{CANONICAL_CORPUS_SOURCE_PATH}}) |
| Corpus selection rule | {{CORPUS_SELECTION_RULE}} |
| Corpus refresh / verification command | `{{CORPUS_REFRESH_OR_VERIFICATION_COMMAND}}` |
| Expected corpus state | {{EXPECTED_CORPUS_COUNT_HASH_OR_OTHER_STABLE_IDENTIFIER}} |

The canonical source and selection rule decide membership. A copied artifact
count is evidence about one revision, not a substitute source of truth.

## 3. LANE BINDING

| Lane field | Value |
| --- | --- |
| Authority | `{{AUTHORITY}}` |
| Artifact class | `{{ARTIFACT_CLASS}}` |
| Adapter | `{{ADAPTER}}` |
| Scope | `{{SCOPE_SUMMARY}}` |
| Lane config | [`lane-config.json`](./lane-config.json) |
| Adapter source | [`{{ADAPTER_SOURCE_LABEL}}`]({{ADAPTER_SOURCE_PATH}}) |
| Adapter contract | [`{{ADAPTER_CONTRACT_LABEL}}`]({{ADAPTER_CONTRACT_PATH}}) |

The adapter is a peer selector under an existing authority and artifact class.
It does not create a new deep-alignment authority or artifact-class value.

## 4. ADAPTER-OWNED DIMENSIONS AND SEVERITIES

The selected adapter owns the definitions below. These rows are cross-links only;
this benchmark contract deliberately does not paraphrase or redefine their
semantics.

| Dimension ID | Normative definition |
| --- | --- |
| S1 | [`S1`]({{ADAPTER_CONTRACT_PATH}}#{{S1_DEFINITION_ANCHOR}}) |
| S2 | [`S2`]({{ADAPTER_CONTRACT_PATH}}#{{S2_DEFINITION_ANCHOR}}) |
| S3 | [`S3`]({{ADAPTER_CONTRACT_PATH}}#{{S3_DEFINITION_ANCHOR}}) |
| S4 | [`S4`]({{ADAPTER_CONTRACT_PATH}}#{{S4_DEFINITION_ANCHOR}}) |
| S5 | [`S5`]({{ADAPTER_CONTRACT_PATH}}#{{S5_DEFINITION_ANCHOR}}) |

| Severity ID | Normative definition |
| --- | --- |
| P0 | [`P0`]({{ADAPTER_CONTRACT_PATH}}#{{P0_DEFINITION_ANCHOR}}) |
| P1 | [`P1`]({{ADAPTER_CONTRACT_PATH}}#{{P1_DEFINITION_ANCHOR}}) |
| P2 | [`P2`]({{ADAPTER_CONTRACT_PATH}}#{{P2_DEFINITION_ANCHOR}}) |

Finding codes, dimension assignment, severity assignment, and known-deviation
semantics remain adapter-owned. A package update may refresh these links but may
not substitute local definitions.

## 5. FIXTURE POLICY

- **Manifest:** [`fixtures/fixture-manifest.json`](./fixtures/fixture-manifest.json).
- **Oracle independence:** `{{ORACLE_ID}}` is authored and verified independently
  of `{{ADAPTER}}`; the production adapter MUST NOT import or invoke oracle logic.
- **Clean control:** `{{CLEAN_CONTROL_FIXTURE_ID}}` must produce exactly zero
  findings when the instrument is valid.
- **Public calibration fixtures:** {{PUBLIC_FIXTURE_POLICY_AND_USE}}.
- **Held-out fixtures:** {{HELD_OUT_FIXTURE_POLICY_AND_NON_DISCLOSURE_BOUNDARY}}.
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
| Contract | `{{CONTRACT_PATH}}` | Filled, validated, and linked from the family README |
| Lane config | [`lane-config.json`](./lane-config.json) | Valid JSON; peer adapter allowlisted for the named authority |
| Fixture manifest | [`fixtures/fixture-manifest.json`](./fixtures/fixture-manifest.json) | Valid JSON; root and fixture hashes verified |
| Fixture root | `{{FIXTURE_ROOT}}` | Clean control plus declared public and held-out fixtures present |
| Canonical corpus source | `{{CANONICAL_CORPUS_SOURCE_PATH}}` | Refresh / verification command exits 0 |
| Executing spec phase | `{{EXECUTING_SPEC_PHASE_PATH}}` | Writable evidence location and deep-alignment state directory available |

Execution command:

```bash
{{EXECUTION_COMMAND_WITH_LANE_CONFIG_SPEC_FOLDER_AND_EVIDENCE_LOCATION}}
```

## 7. VALIDITY GATES

Instrument validity and subject outcome are independent states. Record both; never
turn an instrument failure into a subject failure.

### Instrument-valid gate

The run is `instrument-valid` only when all of the following are true:

1. Lane-config JSON parses and deep-alignment scoping resolves `{{AUTHORITY}}` /
   `{{ARTIFACT_CLASS}}` / `{{ADAPTER}}` without an input-validation error.
2. The selected adapter loads and its `discover`, `standardSource`, and `check`
   calls complete without unresolved adapter or oracle errors.
3. The discovered corpus matches `{{CORPUS_COVERAGE_GATE}}` and the clean control
   yields zero findings.
4. Raw finding deltas are parseable and agree with the reduced evidence under
   `{{EVIDENCE_LOCATION}}` according to `{{EVIDENCE_INTEGRITY_GATE_REFERENCE}}`.
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
[`{{EVIDENCE_LOCATION}}`]({{EVIDENCE_LOCATION}}) inside the executing spec phase,
including transcripts, state, raw deltas, reduced reports, and generated
scorecards. The accepted run identity is `{{RUN_ID_OR_PENDING}}`; its input hash is
`{{INPUT_HASH_OR_PENDING}}`.

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
- [`{{ADAPTER_CONTRACT_LABEL}}`]({{ADAPTER_CONTRACT_PATH}}) — adapter-owned dimensions, severities, finding codes, and known-deviation boundary.
- [`{{DEEP_ALIGNMENT_CONTRACT_LABEL}}`]({{DEEP_ALIGNMENT_CONTRACT_PATH}}) — engine-owned discovery through reduction.
- [`{{SOURCE_SPEC_PACKET_LABEL}}`]({{SOURCE_SPEC_PACKET_PATH}}) — source requirements and the executing evidence phase.

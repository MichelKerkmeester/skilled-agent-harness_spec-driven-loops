---
title: "Conformance Benchmark README Index Template"
description: "Fillable scaffold for a conformance_benchmark family README — the package index that lists each deterministic artifact-conformance benchmark, its authority and peer adapter, corpus, status, source packet, execution command, and run-evidence location."
trigger_phrases:
  - "conformance benchmark readme template"
  - "conformance_benchmark package index"
  - "artifact conformance benchmark index"
  - "peer adapter benchmark readme"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for a conformance_benchmark PACKAGE INDEX:
  <deep-loop-mode>/assets/conformance_benchmark/README.md

Usage:
  1. cp this file to that path, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_readme_template.md \
        .opencode/skills/system-deep-loop/<mode>/assets/conformance_benchmark/README.md
  2. DELETE the "version:" line above. A shipped package index carries the five
     frontmatter fields shown (title / description / trigger_phrases /
     importance_tier / contextType) and NO version field: it is a memory-indexed
     DATA artifact outside the references/** and assets/** version-scope defined
     in ../../../shared/references/frontmatter_versioning.md §1, not a versioned
     reference doc. Replace the template title, description, and trigger phrases
     with package-specific values.
  3. Fill every {{PLACEHOLDER}} and remove every <!-- guidance --> comment.
  4. Keep the BENCHMARK-ID INDEX in exact sync with the benchmark-id directories
     on disk: one row per directory, one directory per row.
  5. Point to run evidence in the executing spec phase. Never copy transcripts,
     deltas, generated reports, or scorecards into this stable package.
-->

# {{MODE_NAME}} Conformance Benchmarks

> Deterministic artifact-conformance contracts and fixtures for `{{MODE_NAME}}`, executed through deep-alignment peer adapters against named authorities. This package holds stable inputs; the executing spec phase holds run evidence.

## 1. OVERVIEW

This `conformance_benchmark` package indexes deterministic checks of
`{{ARTIFACT_FAMILY_DESCRIPTION}}`. Each benchmark-id directory binds one canonical
corpus to one existing deep-alignment authority and artifact class, selects its
peer adapter, and records where the resulting evidence is written. The package
does not execute, score, or reduce a run.

**Package status:** {{PACKAGE_STATUS}}. **Owning mode:** `{{MODE_ID}}`.
**Source specification:** [`{{SOURCE_SPEC_PACKET_LABEL}}`]({{SOURCE_SPEC_PACKET_PATH}}).

## 2. BENCHMARK-ID INDEX

<!-- Add one row per benchmark-id directory. The Authority and Adapter columns
     are distinct: authority selects the standard; adapter selects the allowlisted
     peer implementation for that authority. Status is authored package state,
     not a generated run verdict. -->

| Benchmark ID | Authority | Adapter | Corpus | Status | Source spec packet | Execution | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [`{{BENCHMARK_ID_1}}`](./{{BENCHMARK_ID_1}}/conformance_benchmark.md) | `{{AUTHORITY_1}}` | `{{ADAPTER_1}}` | {{CORPUS_DESCRIPTION_1}} | {{STATUS_1}} | [`{{SOURCE_SPEC_PACKET_LABEL_1}}`]({{SOURCE_SPEC_PACKET_PATH_1}}) | [command](#{{EXECUTION_ANCHOR_1}}) | [`{{EVIDENCE_LABEL_1}}`]({{EVIDENCE_LOCATION_1}}) |
| [`{{BENCHMARK_ID_N}}`](./{{BENCHMARK_ID_N}}/conformance_benchmark.md) | `{{AUTHORITY_N}}` | `{{ADAPTER_N}}` | {{CORPUS_DESCRIPTION_N}} | {{STATUS_N}} | [`{{SOURCE_SPEC_PACKET_LABEL_N}}`]({{SOURCE_SPEC_PACKET_PATH_N}}) | [command](#{{EXECUTION_ANCHOR_N}}) | [`{{EVIDENCE_LABEL_N}}`]({{EVIDENCE_LOCATION_N}}) |

## 3. CORPUS

| Benchmark ID | Canonical corpus source | Inclusion boundary | Fixture manifest |
| --- | --- | --- | --- |
| `{{BENCHMARK_ID_1}}` | [`{{CORPUS_SOURCE_LABEL_1}}`]({{CORPUS_SOURCE_PATH_1}}) | {{CORPUS_INCLUSION_AND_EXCLUSION_RULE_1}} | [`fixture-manifest.json`](./{{BENCHMARK_ID_1}}/fixtures/fixture-manifest.json) |
| `{{BENCHMARK_ID_N}}` | [`{{CORPUS_SOURCE_LABEL_N}}`]({{CORPUS_SOURCE_PATH_N}}) | {{CORPUS_INCLUSION_AND_EXCLUSION_RULE_N}} | [`fixture-manifest.json`](./{{BENCHMARK_ID_N}}/fixtures/fixture-manifest.json) |

The canonical source, not a copied count in this README, decides corpus
membership. If the source inventory changes, regenerate or re-verify the corpus,
refresh its recorded hash, and update the affected index row before execution.

## 4. EXECUTION

<a id="{{EXECUTION_ANCHOR_1}}"></a>
### {{EXECUTION_ANCHOR_1}} — `{{BENCHMARK_ID_1}}`

Run from the repository root after `{{ADAPTER_1}}` is registered for
`{{AUTHORITY_1}}` in deep-alignment's `AUTHORITY_ADAPTERS` allowlist:

```bash
{{EXECUTION_COMMAND_1_WITH_LANE_CONFIG_SPEC_FOLDER_AND_EVIDENCE_LOCATION}}
```

Expected stable inputs:

- Contract: [`{{BENCHMARK_ID_1}}/conformance_benchmark.md`](./{{BENCHMARK_ID_1}}/conformance_benchmark.md)
- Lane config: [`{{BENCHMARK_ID_1}}/lane-config.json`](./{{BENCHMARK_ID_1}}/lane-config.json)
- Fixture manifest: [`{{BENCHMARK_ID_1}}/fixtures/fixture-manifest.json`](./{{BENCHMARK_ID_1}}/fixtures/fixture-manifest.json)

{{ADD_ONE_EXECUTION_SUBSECTION_PER_ADDITIONAL_BENCHMARK_ID}}

## 5. EVIDENCE LOCATION

The package is the stable authoring surface; it is not the audit trail. Evidence
for `{{BENCHMARK_ID_1}}` lands at
[`{{EVIDENCE_LOCATION_1}}`]({{EVIDENCE_LOCATION_1}}) in the executing spec phase.
That location owns transcripts, deep-alignment state and deltas, reduced reports,
and any generated scorecard. Update the pointer after each accepted run; do not
copy those generated artifacts into this package.

## 6. RELATED RESOURCES

- [`{{BENCHMARK_ID_1}}/conformance_benchmark.md`](./{{BENCHMARK_ID_1}}/conformance_benchmark.md) — the per-benchmark purpose, scope, inputs, validity gates, and ownership boundary.
- [`{{BENCHMARK_ID_1}}/lane-config.json`](./{{BENCHMARK_ID_1}}/lane-config.json) — the deep-alignment lane selection.
- [`{{BENCHMARK_ID_1}}/fixtures/fixture-manifest.json`](./{{BENCHMARK_ID_1}}/fixtures/fixture-manifest.json) — independent oracle provenance and fixture expectations.
- [`{{DEEP_ALIGNMENT_CONTRACT_LABEL}}`]({{DEEP_ALIGNMENT_CONTRACT_PATH}}) — the engine contract that owns discovery, partitioning, convergence, reduction, and reporting.

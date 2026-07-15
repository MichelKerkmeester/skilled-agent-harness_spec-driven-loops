---
title: Conformance Benchmark Authoring Guide
description: End-to-end guide for authoring a conformance_benchmark package for a deterministic artifact-conformance benchmark run through a deep-alignment peer adapter, while keeping adapter semantics, execution machinery, and generated evidence in their owning lanes.
trigger_phrases:
  - "conformance benchmark authoring guide"
  - "how to author a conformance benchmark"
  - "peer adapter benchmark package guide"
  - "deterministic artifact conformance fixtures"
  - "command surface conformance benchmark"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Conformance Benchmark Authoring Guide

Overflow depth for authoring a `conformance_benchmark` package. This guide covers
the stable authoring inputs that live with a deep-loop mode: a family README,
per-benchmark contract, deep-alignment lane config, and independent fixture corpus.
It does not define adapter dimensions or severities and does not implement an
oracle, runner, scorer, reducer, generated report, or scorecard.

Where this guide and the deep-alignment contracts diverge, the engine's
[`scoping.cjs`](../../../../system-deep-loop/deep-alignment/scripts/scoping.cjs)
and selected adapter contract prevail.

## 1. OVERVIEW: WHAT A CONFORMANCE BENCHMARK IS

A conformance benchmark deterministically checks a bounded artifact corpus against
a named authority through a selected deep-alignment peer adapter. It is useful
when the default authority adapter is too broad for one artifact subtype, but the
authority and artifact class remain correct. The peer adapter supplies subtype-
specific discovery and checks without creating a new engine branch.

The authored package is input scaffolding. It fixes the corpus source, lane tuple,
fixture and oracle provenance, expected findings, validity gates, and evidence
pointer. Deep-alignment still owns the three-method execution contract —
`discover(scope)`, `standardSource(authority)`, and `check(artifact, rules)` — plus
partitioning, convergence, reduction, and reporting.

## 2. SHIPPED PACKAGE LAYOUT

Author this shape inside the owning mode-packet:

```text
<mode>/assets/conformance_benchmark/
├── README.md                              # family index, one row per benchmark ID
└── <benchmark-id>/
    ├── conformance_benchmark.md           # stable per-benchmark contract
    ├── lane-config.json                   # one deep-alignment lane array
    └── fixtures/
        ├── fixture-manifest.json          # oracle provenance + expected findings
        ├── public/                        # clean control + calibration fixtures
        └── held-out/                      # fixtures excluded from adapter authoring
```

The family `README.md` sits one level above `<benchmark-id>` and indexes every
benchmark directory. Within `<benchmark-id>`, the contract, lane config, and
`fixtures/` directory are required.

| Shipped file | Template |
| --- | --- |
| `README.md` | [`conformance_benchmark_readme_template.md`](../../assets/conformance_benchmark/conformance_benchmark_readme_template.md) |
| `<benchmark-id>/conformance_benchmark.md` | [`conformance_benchmark_contract_template.md`](../../assets/conformance_benchmark/conformance_benchmark_contract_template.md) |
| `<benchmark-id>/lane-config.json` | JSON block in [`conformance_benchmark_lane_config_template.md`](../../assets/conformance_benchmark/conformance_benchmark_lane_config_template.md) |
| `<benchmark-id>/fixtures/fixture-manifest.json` | JSON block in [`conformance_benchmark_fixture_manifest_template.md`](../../assets/conformance_benchmark/conformance_benchmark_fixture_manifest_template.md) |

Shipped JSON files contain only the fenced JSON values from their templates. They
carry no Markdown frontmatter or guidance comments.

## 3. END-TO-END AUTHORING SEQUENCE

Complete these steps in order.

1. **Read the authority and engine contracts.** Load the selected authority's
   reference adapter, the peer adapter contract or approved design, and
   [`scoping.cjs`](../../../../system-deep-loop/deep-alignment/scripts/scoping.cjs).
   Confirm the existing authority / artifact-class pair and the three adapter
   methods before authoring any package field.
2. **Choose the benchmark ID and owning mode.** Use a stable lowercase-hyphen ID
   describing the corpus, not a date or run. Confirm it is unique under
   `<mode>/assets/conformance_benchmark/`.
3. **Freeze the canonical corpus source.** Name the generating inventory or
   authoritative path, its inclusion and exclusion rule, the refresh/check
   command, and a count or hash that identifies the authored revision. Do not
   replace the source with a hand-maintained list.
4. **Author the family README.** Add one benchmark-ID row with authority, adapter,
   corpus, authored status, source spec packet, exact execution command, and the
   executing spec phase's evidence pointer.
5. **Author the benchmark contract.** Bind purpose, scope, corpus source, lane,
   fixtures, execution inputs, instrument-valid gate, subject pass/fail gate, and
   evidence location. Cross-link S1-S5 and P0/P1/P2 to the peer adapter reference;
   do not define them locally.
6. **Author the lane config.** Copy the lane-config template's JSON array. Use the
   existing authority and artifact class, set `adapter` to the peer selector, and
   choose one supported `scope` shape. Do not add package metadata to the lane.
7. **Author the oracle before the adapter.** Build an independent reference oracle
   and verify it without importing production-adapter code. Keep its implementation
   in the executing spec or lane; record only provenance and outcomes in the
   stable package.
8. **Build and hash fixtures.** Create a clean public control, public calibration
   defects, and held-out defects. Record deterministic mutations, fixture-root and
   per-fixture SHA-256 hashes, and oracle-derived expected codes, severities,
   dimensions, and locations.
9. **Validate the package.** Validate Markdown, parse both JSON files, verify
   hashes, and run scoping after the peer adapter is allowlisted. Reconcile every
   README row, contract path, lane value, manifest ID, and evidence pointer.
10. **Hand execution to the spec phase.** The authoring workflow stops here. The
    executing phase invokes the existing deep-alignment workflow and stores all
    generated evidence outside the stable package.

## 4. FIXTURE AND ORACLE INDEPENDENCE

The fixture corpus must detect defects in the production adapter, so its expected
results cannot come from that adapter.

- Author and verify the oracle before production-adapter implementation. The
  adapter must not import, invoke, copy, or share implementation helpers with it.
- Keep `productionAdapterImportProhibited: true` in the manifest. A violation
  invalidates the instrument even when fixture outputs happen to match.
- The clean control has no mutations and exactly zero expected findings. It tests
  false-positive behavior and basic instrument health.
- Public fixtures expose representative defect classes for calibration and
  transparent regression tests. Held-out fixtures are not used to implement,
  tune, or choose production-adapter logic.
- Freeze each expected finding as a code, adapter-owned severity, adapter-owned
  dimension, and exact location. The oracle produces those expectations; the
  package records them.
- Hash after fixture generation. A fixture-root or fixture hash change starts a
  new evidence identity, even when the benchmark ID stays stable.

Known-deviation semantics are also adapter-owned. The manifest may name expected
unsuppressed findings, but it must not recreate the adapter's suppression rules.

## 5. DEEP-ALIGNMENT INTEGRATION

The lane object uses the existing scoping schema:

| Field | Purpose |
| --- | --- |
| `authority` | Selects the registered standard owner, such as `sk-doc` |
| `artifactClass` | Uses that authority's existing class, such as `docs` |
| `adapter` | Selects the peer module instead of the authority's default module |
| `scope` | Uses one supported `paths`, `globs`, or `branchRange` shape |

Do not add an authority or artifact class for a subtype benchmark. Add the peer
adapter name to that authority's `AUTHORITY_ADAPTERS` allowlist, then select it
through the lane's `adapter` discriminator. Deep-alignment loads
`adapters/<adapter-or-authority>.cjs`; the engine does not branch on benchmark ID.

The reference adapter shape is
[`sk-doc.cjs`](../../../../system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs):
`discover` returns artifacts, `standardSource` returns the authority's sources and
known deviations, and `check` emits findings. A conformance package cross-links
the peer adapter's definitions but contains none of those methods.

## 6. VALIDATION

The behavior-family precedent validates benchmark Markdown as `readme`; use the
same invocation for all four template sources and this guide:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_readme_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_contract_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_lane_config_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_fixture_manifest_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/references/conformance_benchmark/conformance_benchmark_authoring_guide.md --type readme
```

Parse the shipped JSON files directly:

```bash
python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "<mode>/assets/conformance_benchmark/<benchmark-id>/lane-config.json"
python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "<mode>/assets/conformance_benchmark/<benchmark-id>/fixtures/fixture-manifest.json"
```

After the peer adapter is registered, validate the lane against the live schema:

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs --lane-config "<mode>/assets/conformance_benchmark/<benchmark-id>/lane-config.json" --json
```

An exit-zero parse proves JSON syntax. The scoping command additionally proves the
authority, artifact class, adapter allowlist, and scope shape are accepted. Neither
command proves benchmark subject conformance; that requires a valid execution run.

## 7. EVIDENCE BOUNDARY

Stable contracts and fixtures live with the owning mode under
`assets/conformance_benchmark/`. They are reviewed inputs and may be reused across
runs. The package README points outward to the accepted evidence.

Transcripts, deep-alignment state, raw deltas, iteration notes, reduced reports,
and scorecards live in the **executing spec phase**. They are run-specific,
generated, and may contain environment or revision details. Never copy them into
the mode package or author a fill-in report/scorecard template here.

A typical deep-alignment execution uses `<spec-folder>/alignment/` for engine
state. A specialized launcher may also own a run directory such as
`<spec-folder>/evidence/<benchmark-family>/<run-id>/`. Record the exact accepted
location in the contract and family README; the executing workflow decides the
layout.

## 8. WORKED MAPPING: PACKET 066 COMMAND SURFACE

Packet `system-deep-loop/066-command-surface-benchmark` is the first consumer.
Its conformance package maps as follows:

| Package field | Packet 066 value |
| --- | --- |
| Owning mode | `system-deep-loop/deep-alignment` |
| Benchmark ID | `command-surface` |
| Authority | `sk-doc` |
| Artifact class | `docs` |
| Peer adapter | `sk-doc-command` |
| Canonical corpus | The sync-prompts canonical OpenCode command source inventory, checked rather than hand-listed |
| Scope | The repo-relative OpenCode command source surface selected by the command adapter |
| Dimension / severity source | The shipped `sk_doc_command_adapter.md` definitions for S1-S5 and P0/P1/P2; cross-link only |
| Fixture policy | Public clean/control and calibration fixtures plus held-out command defects, expected by an independent oracle |
| Source packet | `.opencode/specs/system-deep-loop/066-command-surface-benchmark/` |
| Run evidence | `<executing-spec-phase>/alignment/` and `<executing-spec-phase>/evidence/command-benchmark/<run-id>/`, as bound by the launcher |

The lane remains `sk-doc` / `docs`; `sk-doc-command` is selected by `adapter` and
is registered in `AUTHORITY_ADAPTERS['sk-doc']`. No `command` authority or
command-specific artifact-class value is introduced. The adapter owns mirror,
reachability, route, capability/safety, and presentation definitions; this guide
does not restate them.

This conformance package is only one axis of packet 066: the behavioral axis — how
executor models handle each command at its invocation surface — is documented in
[`../behavior_benchmark/behavior_benchmark_guide.md`](../behavior_benchmark/behavior_benchmark_guide.md)
section 7, and the [`/deep:command-benchmark`](../../../../../commands/deep/command-benchmark.md) launcher composes both without averaging.

## 9. RELATED RESOURCES

### Templates

- [`conformance_benchmark_readme_template.md`](../../assets/conformance_benchmark/conformance_benchmark_readme_template.md) — family package index.
- [`conformance_benchmark_contract_template.md`](../../assets/conformance_benchmark/conformance_benchmark_contract_template.md) — per-benchmark contract and ownership boundary.
- [`conformance_benchmark_lane_config_template.md`](../../assets/conformance_benchmark/conformance_benchmark_lane_config_template.md) — parseable one-lane JSON scaffold.
- [`conformance_benchmark_fixture_manifest_template.md`](../../assets/conformance_benchmark/conformance_benchmark_fixture_manifest_template.md) — independent fixture and expected-finding manifest.

### Engine contracts

- [`scoping.cjs`](../../../../system-deep-loop/deep-alignment/scripts/scoping.cjs) — live lane schema and `AUTHORITY_ADAPTERS` allowlist.
- [`sk-doc.cjs`](../../../../system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs) — reference three-method adapter shape.
- [`state_machine_wiring.md`](../../../../system-deep-loop/deep-alignment/references/state_machine_wiring.md) — engine-owned discovery, iteration, convergence, reduction, and evidence layout.

*End of conformance benchmark authoring guide — stable inputs live with the mode; run evidence lives in the executing spec phase.*

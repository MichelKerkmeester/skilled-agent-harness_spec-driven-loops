---
title: "Command Benchmark Verdict and Ownership Contract"
description: "Frozen two-axis verdict semantics and the boundary between command-specific conformance, behavioral evidence, instrument validity, and generic document validation."
trigger_phrases:
  - "command benchmark verdict axes"
  - "instrument validity subject conformance"
  - "command validator ownership boundary"
importance_tier: "important"
contextType: "implementation"
---

# Command Benchmark Verdict and Ownership Contract

## 1. OVERVIEW

This contract keeps benchmark validity, deterministic conformance, behavioral adherence, and generic document validation as separate claims with separate owners and native vocabularies.

## 2. NON-AVERAGED OUTPUT CONTRACT

The command benchmark reports two subject axes side by side. It must never add, average, normalize, weight, or collapse them into one score.

| Axis | Unit | Native result | Roll-up rule |
| --- | --- | --- | --- |
| Deterministic conformance | Full canonical command corpus through the `sk-doc-command` peer adapter | P0/P1/P2 findings plus lane verdict `FAIL`, `CONDITIONAL`, `PASS`, or `NOT_APPLICABLE` | Per lane: any P0 → `FAIL`; otherwise any P1 → `CONDITIONAL`; otherwise `PASS`; zero discovered artifacts → `NOT_APPLICABLE`. Overall result is the worst applicable lane, never an average. P2-only findings remain visible but do not lower `PASS`. |
| Behavioral adherence | One scenario × executor run from DAB-012 through DAB-027 | D1-D5 vector (`0`, `1`, `2`, or `null`) plus exactly one terminal bucket | Keep every dimension and the terminal bucket. Do not reduce the vector to the deterministic severity scale or use it to change the deterministic verdict. |

A valid final scorecard therefore has separate fields for deterministic verdict, deterministic findings by severity, behavioral per-cell D1-D5 scores, behavioral terminal buckets, and matrix variance. A single scalar `overall_score` is forbidden.

## 3. DETERMINISTIC AXIS

The deep-alignment engine owns the P-level roll-up contract:

- `P0` is a confirmed release-blocking conformance finding. One remaining P0 makes the lane and deterministic axis `FAIL`.
- `P1` is a confirmed required correction that makes the lane `CONDITIONAL` when no P0 remains.
- `P2` is a visible advisory finding. P2 alone does not lower the lane below `PASS`.
- `NOT_APPLICABLE` means the lane discovered no artifacts. It is not evidence that a non-empty corpus passed.

The future `sk-doc-command` adapter owns the exact S1-S5 definitions, finding codes, code-to-dimension mapping, code-to-severity mapping, and known-deviation rules. This phase freezes only the shared severity and verdict behavior. The command-specific adapter must define and cross-link its S1-S5 contract rather than copying generic validator findings.

## 4. BEHAVIORAL AXIS

The shared behavior-benchmark framework remains normative for D1-D5:

| Dimension | Measures |
| --- | --- |
| D1 | Invocation and setup matched the scenario's expected interaction. |
| D2 | Required presentation markers appeared. |
| D3 | Delegation or direct-dispatch evidence matched the declared target without role absorption. |
| D4 | The run reached a natural terminal state and produced any required artifacts. |
| D5 | Terminal latency relative to the pinned Claude baseline; `null` when no baseline exists. |

Each run receives exactly one mutually exclusive terminal bucket from the framework: `pass`, `partial`, `setup_misbind`, `phase0_block`, `route_mismatch`, `role_absorption`, `stuck_no_progress`, `timeout_latency`, `refused`, `missing_artifact`, `crash`, or `env_error`.

`env_error` is retryable instrument/environment failure, exits `75`, nulls the dimensions, and is not quotable subject behavior. Any D5 ratio must restate that the Claude leg and other executors use different host binaries, so the ratio includes host overhead.

## 5. INSTRUMENT VALIDITY IS ORTHOGONAL

Instrument validity is a prerequisite claim for each axis, not a third subject score.

| Instrument state | Subject state | Required reporting |
| --- | --- | --- |
| `VALID` | `PASS`, `CONDITIONAL`, `FAIL`, or a behavioral bucket | Publish both claims. A real subject failure is valid benchmark evidence. |
| `INVALID` | `NOT_EVALUATED` | Preserve diagnostic evidence and publish no subject-conformance verdict. |

The deterministic instrument is valid only when the lane config resolves, adapter methods complete, discovery equals the canonical census, the clean control has zero findings, fixture and corpus hashes match, coverage completes, and raw deltas agree with reduced evidence. Adapter errors, oracle mismatches, corrupt deltas, incomplete coverage, or unresolved topology rows invalidate the instrument; they are not command defects.

The behavioral instrument is valid only when the scenario contract parses, fixture and marker hashes match, the intended executor saw the prompt, evidence capture completed, and the runner produced a scored result. Provider rejection before prompt delivery is `env_error`, not a subject failure.

The combined launcher must preserve this distinction in its terminal envelope, including the legitimate state `INSTRUMENT=VALID SUBJECT=FAIL`.

## 6. GENERIC DOCUMENT-VALIDATION BOUNDARY

`python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type command <file>` remains the owner of generic command-Markdown validation. It checks the document as a command artifact and retains its native exit contract: `0` valid, `1` blocking document errors, `2` file or parse failure.

The command benchmark does not call that validator through `sk-doc-command`, copy its rules, translate its findings into S1-S5, or reclassify its native errors as command-benchmark P-level findings. Generic validation remains a separate preflight or closeout gate and the generic `sk-doc` alignment adapter must not share the same command scope with `sk-doc-command` in one alignment run.

The command-specific deterministic axis instead owns cross-artifact and command-surface properties that generic single-document validation cannot establish:

- canonical source and generated-mirror identity;
- execution-target reachability;
- route-graph integrity across workflow, subaction, direct-tool/plugin, and monolithic topologies;
- declared capability and safety-boundary consistency;
- presentation ownership across the router and its declared assets.

`validate-command-references.cjs` and `sync-prompts.cjs` may be reused as evidence-producing utilities for those properties. Reuse does not transfer their rule ownership or authorize duplicating `validate_document.py`.

## 7. SCORECARD INVARIANTS

1. Show instrument validity before either subject result.
2. Keep deterministic and behavioral axes in separate sections and data fields.
3. Preserve P0/P1/P2 counts, D1-D5 vectors, and terminal buckets in native vocabularies.
4. Treat a valid failing subject as publishable evidence, not an invalid run.
5. Treat any invalid instrument as `SUBJECT=NOT_EVALUATED`, never as a clean pass or subject fail.
6. Link generic command-document validation as an independent gate; do not absorb its results into the benchmark axes.

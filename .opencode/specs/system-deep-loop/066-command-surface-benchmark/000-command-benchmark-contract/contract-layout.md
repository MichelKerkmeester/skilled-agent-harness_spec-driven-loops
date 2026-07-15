---
title: "Command Benchmark Contract and Evidence Layout"
description: "Frozen stable-package and run-evidence paths for the command-surface conformance benchmark, including the 37-to-38 census transition and authoring-versus-running boundary."
trigger_phrases:
  - "command benchmark contract layout"
  - "conformance benchmark command-surface package"
  - "command benchmark evidence path"
importance_tier: "important"
contextType: "implementation"
---

# Command Benchmark Contract and Evidence Layout

## 1. OVERVIEW

This layout separates reusable benchmark inputs from run-specific evidence and fixes the only permitted census transition for this packet.

## 2. STABLE CONFORMANCE PACKAGE

The `create-benchmark` `conformance_benchmark` family authors this exact consuming package under the deep-alignment mode:

```text
.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/
├── README.md
└── command-surface/
    ├── conformance_benchmark.md
    ├── lane-config.json
    └── fixtures/
        ├── fixture-manifest.json
        ├── public/
        └── held-out/
```

The benchmark ID is frozen as `command-surface`. The lane remains the existing `sk-doc` authority and `docs` artifact class, with `sk-doc-command` selected through the optional peer-adapter discriminator. No `command` authority or command-specific artifact class is introduced.

| Path | Stable ownership |
| --- | --- |
| `assets/conformance_benchmark/README.md` | Family index with one row per benchmark ID, including source packet, execution command, and evidence pointer. |
| `command-surface/conformance_benchmark.md` | Purpose, corpus source, lane binding, validity gates, evidence location, and ownership links. It cross-links adapter-owned S1-S5 and P0/P1/P2 definitions rather than redefining them. |
| `command-surface/lane-config.json` | One parseable deep-alignment lane array using `authority`, `artifactClass`, `adapter`, and `scope` only. |
| `command-surface/fixtures/fixture-manifest.json` | Independent-oracle provenance, production-adapter import prohibition, clean control, public and held-out fixtures, hashes, mutations, and expected findings. |
| `command-surface/fixtures/public/` | Clean control and public calibration fixtures. |
| `command-surface/fixtures/held-out/` | Fixtures excluded from production-adapter authoring and tuning. |

The package contains stable inputs and evidence pointers. It must not contain transcripts, run state, raw deltas, generated reports, scorecards, adapter code, oracle implementation, runners, reducers, or scorers.

## 3. RUN-EVIDENCE ROOT

Every accepted launcher run writes its combined evidence beneath:

```text
<spec-folder>/evidence/command-benchmark/<run-id>/
```

`<spec-folder>` is the executing phase folder, not the phase parent and not the stable mode package. `<run-id>` is immutable for one input identity and must be unique within that spec folder. A rerun with changed corpus, fixture, scenario, marker, model, or workflow hashes receives a new run ID.

The minimum logical layout is frozen as:

```text
<spec-folder>/
├── alignment/                                  # deep-alignment-owned state and reduction
└── evidence/command-benchmark/<run-id>/
    ├── run-manifest.json                       # revision, inputs, hashes, counts, and pointers
    ├── deterministic/
    │   └── alignment-evidence.json             # accepted alignment run pointer + integrity summary
    ├── behavioral/
    │   ├── matrix-results.json                 # required cells, results, and declared skips
    │   └── cells/                              # runner-owned per-scenario/per-leg evidence
    └── scorecard/
        ├── command-benchmark-scorecard.json    # machine two-axis result
        └── command-benchmark-scorecard.md      # human render of the same result
```

Phase producers may add run-specific sidecars beneath their owning directory, but they must not rename these roots or move evidence into the stable conformance package. The deterministic pointer must identify the accepted `<spec-folder>/alignment/` state, raw deltas, findings registry, and reduced report without copying a second divergent authority. The scorecard JSON is authoritative for the Markdown render.

## 4. RUN MANIFEST MINIMUMS

`run-manifest.json` must bind enough information to decide whether results are comparable:

- run ID, UTC start/end timestamps, repository revision, and executing spec folder;
- canonical source count, generated mirror count, census hash, and topology-taxonomy hash;
- conformance contract, lane-config, fixture-manifest, fixture-root, scenario, marker, and matrix hashes;
- deterministic and behavioral instrument-validity states;
- pointers to the accepted alignment evidence, behavioral cells, and scorecard;
- per-cell result or predeclared skip accounting;
- retry lineage for `env_error` or contested three-sample reruns.

The manifest records identity and pointers. It does not duplicate the scorer, adapter, or reducer contract.

## 5. AUTHORING-VERSUS-RUNNING BOUNDARY

| Owner | Owns | Must not own |
| --- | --- | --- |
| `create-benchmark` `conformance_benchmark` family | Templates and authors the stable README, contract, lane config, fixture manifest, fixture directories, and evidence pointers. | Adapter implementation, oracle implementation, execution, scoring, reduction, generated report, or scorecard. |
| `sk-doc-command` peer adapter | Canonical discovery, standard-source links, S1-S5 checks, P-level finding assignment, and command-specific known deviations. | Generic command-document validation or behavioral scoring. |
| Deep-alignment engine | Lane resolution, partitioning, iteration, convergence, raw deltas, reduction, and deterministic verdict roll-up. | Behavioral D1-D5 scoring. |
| Shared behavior runner and phase-008 matrix scheduler | Scenario execution, evidence capture, D1-D5 scoring, terminal buckets, samples, skips, and per-cell results. | Deterministic conformance findings or combined-score averaging. |
| `/deep:command-benchmark` | Binds inputs, selects `conformance`, `behavior`, or `all`, dispatches the existing owners, writes the run-evidence layout, and reports separate axes. | Adapter logic, oracle logic, scoring rules, convergence logic, or scheduler logic. |
| Phase 010 closeout | Renders the final two-axis scorecard and remediation backlog from accepted evidence. | Re-scoring cells or averaging the axes. |

## 6. CENSUS TRANSITION

| Checkpoint | Canonical sources | Generated mirrors | Required state |
| --- | ---: | ---: | --- |
| Phase-000 baseline | 37 | 37 | Current snapshot in `census-snapshot.md`; `/deep:command-benchmark` does not yet exist. |
| Phase-009 launcher addition | 38 | 38 | Add `.opencode/commands/deep/command-benchmark.md` and generate `.codex/prompts/deep-command-benchmark.md`. No other census delta is allowed in this packet. |
| Phase-010 final closeout | 38 | 38 | Re-run prompt sync and census equality against the live tree before publishing the final scorecard. |

The launcher is instrument infrastructure. It joins the deterministic full corpus after it exists, but it is excluded from DAB-012 through DAB-027 to avoid behavioral self-measurement recursion; phase 009 smoke-tests it separately.

## 7. DRIFT RULE

Any source or mirror count other than the checkpoint value, any missing package path, or any evidence written outside the frozen roots is contract drift. The affected phase stops, records the mismatch, and returns to this contract phase for an explicit amendment before continuing. Downstream code must not normalize the drift or silently choose a new path.

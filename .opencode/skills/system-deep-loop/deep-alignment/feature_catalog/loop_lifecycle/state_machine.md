---
title: "State machine"
description: "The INIT to REMEDIATE seven-state wiring onto single-shot scripts, plus the alignment/ state-file layout the loop reads and writes."
trigger_phrases:
  - "state machine wiring"
  - "INIT SCOPE DISCOVER ITERATE CONVERGE REPORT REMEDIATE"
  - "alignment state file layout"
  - "single-shot scripts"
  - "deep-alignment loop states"
version: 1.0.0.1
---

# State machine

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> [REMEDIATE]` seven-state wiring onto single-shot scripts, plus the `alignment/` state-file layout the loop reads and writes.

The state machine is the orchestration backbone: it names which script each state calls, in what order, and what each state reads and writes under the bound spec folder's `alignment/` directory. Every script it wires is single-shot — it answers one question and returns, never looping or dispatching internally, exactly like the reused runtime primitives.

## 2. HOW IT WORKS

`INIT` acquires `alignment/.deep-alignment.lock` via `loop-lock.cjs`. `SCOPE` runs `scoping.cjs` and freezes the resolved lanes into `deep-alignment-config.json` (`fileProtection: immutable`). `DISCOVER` calls each lane's adapter `discover(scope)`, writes `deep-alignment-corpus.json` (one entry per lane), and seeds `FILE` nodes via `upsert.cjs --seed-source deep-alignment-discover`. `ITERATE`, `CONVERGE`, `REPORT`, and the optional `REMEDIATE` state are each covered by their own feature file. The lock is released after `REPORT`, or after `REMEDIATE` when that optional state runs. The planned `/deep:alignment` command workflow (the phase-009 last-mile deliverable, not yet built) will drive this sequence; `SKILL.md`'s FORBIDDEN INVOCATION PATTERNS already rule out any custom bash/shell dispatcher that would parallelize lanes or iterations.

The `alignment/` layout is modeled on the real `review/` layout, with one structural addition: `deep-alignment-corpus.json` has no `review/` analog. deep-review's four dimensions are a fixed constant, so it never needed a separate "what did DISCOVER find" file; deep-alignment's lanes and their corpora are resolved and discovered per-run, so persisting the DISCOVER result as its own auto-generated file keeps the frozen config's `immutable` protection honest.

**Difference from deep-review:** deep-review's lifecycle is a four-dimension review loop initialized once from a fixed dimension set. deep-alignment's is a lane-parametrized conformance loop with an extra `DISCOVER` state (and its own corpus file) because "what to check" is resolved per-run, and an extra optional `REMEDIATE` state that deep-review has no analog for.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/state_machine_wiring.md` | Reference | The state-to-script map, the `alignment/` layout, the loopType decision, and the corpus-partitioning/remediate rationale. |
| `runtime/scripts/loop-lock.cjs` | Runtime | `INIT`/teardown lock acquire/release. |
| `scripts/scoping.cjs` | Script | `SCOPE`-state lane resolution. |
| `runtime/scripts/upsert.cjs` | Runtime | `DISCOVER`-state coverage-graph `FILE` seeding. |
| `assets/deep_alignment_config_template.json` | Template | The full run-config shape (`fileProtection`, script paths, convergence defaults) the states read. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Drives the full `SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> REMEDIATE` seam end to end against synthetic fixtures. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `loop-lifecycle/state-machine.md`
- Primary sources: `references/state_machine_wiring.md`, `runtime/scripts/loop-lock.cjs`, `runtime/scripts/upsert.cjs`
Related references:
- [corpus-partitioning.md](../loop_lifecycle/corpus_partitioning.md) — Corpus partitioning
- [convergence-check.md](../loop_lifecycle/convergence_check.md) — Convergence check
- [alignment-report-reducer.md](../loop_lifecycle/alignment_report_reducer.md) — Alignment-report reducer
- [../alignment-contract/gated-remediation.md](../alignment_contract/gated_remediation.md) — Gated remediation

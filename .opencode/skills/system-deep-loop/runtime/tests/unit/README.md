---
title: "system-deep-loop runtime unit tests"
description: "Per-module unit coverage for the system-deep-loop runtime contracts."
trigger_phrases:
  - "deep-loop runtime unit tests"
  - "runtime module tests"
---

# Unit Tests

---

## 1. OVERVIEW

This folder contains the per-module unit test surface for the runtime. Each file isolates a runtime contract or compatibility boundary so failures identify the owning module before the integration suites are run.

The table is the complete direct-file inventory. Test names are the public navigation surface for this folder.

---

## 2. FILES

| File | Coverage |
|---|---|
| `agent-improvement-certificates.vitest.ts` | Executable checks for the agent improvement certificates runtime contract. |
| `agent-improvement-ledger-schema.vitest.ts` | Executable checks for the agent improvement ledger schema runtime contract. |
| `agent-improvement-reducers.vitest.ts` | Executable checks for the agent improvement reducers runtime contract. |
| `agent-improvement-resume-adapter.vitest.ts` | Executable checks for the agent improvement resume adapter runtime contract. |
| `agent-improvement-rollback-gate.vitest.ts` | Executable checks for the agent improvement rollback gate runtime contract. |
| `agent-improvement-sealed-artifacts.vitest.ts` | Executable checks for the agent improvement sealed artifacts runtime contract. |
| `agent-improvement-shadow-parity.vitest.ts` | Executable checks for the agent improvement shadow parity runtime contract. |
| `artifact-root.vitest.ts` | Executable checks for the artifact root runtime contract. |
| `atomic-state.vitest.ts` | Executable checks for the atomic state runtime contract. |
| `authorized-ledger.vitest.ts` | Executable checks for the authorized ledger runtime contract. |
| `bayesian-scorer.vitest.ts` | Executable checks for the bayesian scorer runtime contract. |
| `blinded-adjudication.vitest.ts` | Executable checks for the blinded adjudication runtime contract. |
| `branch-leases-waves.vitest.ts` | Executable checks for the branch leases waves runtime contract. |
| `check-contract-drift.vitest.ts` | Executable checks for the check contract drift runtime contract. |
| `claim-continuity.vitest.ts` | Executable checks for the claim continuity runtime contract. |
| `cli-guards-writer-lock.vitest.ts` | Executable checks for the cli guards writer lock runtime contract. |
| `cli-matrix.vitest.ts` | Executable checks for the cli matrix runtime contract. |
| `combo-matrix.vitest.ts` | Executable checks for the combo matrix runtime contract. |
| `compatibility-shadow-adapters.vitest.ts` | Executable checks for the compatibility shadow adapters runtime contract. |
| `compile-command-contracts.vitest.ts` | Executable checks for the compile command contracts runtime contract. |
| `conditional-fanin.vitest.ts` | Executable checks for the conditional fanin runtime contract. |
| `continuity-identities.vitest.ts` | Executable checks for the continuity identities runtime contract. |
| `continuity-thread.vitest.ts` | Executable checks for the continuity thread runtime contract. |
| `contradiction-supersession.vitest.ts` | Executable checks for the contradiction supersession runtime contract. |
| `convergence-score-delta.vitest.ts` | Executable checks for the convergence score delta runtime contract. |
| `council-graph-query.vitest.ts` | Executable checks for the council graph query runtime contract. |
| `coverage-graph-db.vitest.ts` | Executable checks for the coverage graph db runtime contract. |
| `coverage-graph-query.vitest.ts` | Executable checks for the coverage graph query runtime contract. |
| `coverage-graph-signals.vitest.ts` | Executable checks for the coverage graph signals runtime contract. |
| `cross-mode-closures.vitest.ts` | Executable checks for the cross mode closures runtime contract. |
| `cycle-detection.vitest.ts` | Executable checks for the cycle detection runtime contract. |
| `deep-ai-council-certificates.vitest.ts` | Executable checks for the deep ai council certificates runtime contract. |
| `deep-ai-council-ledger-schema.vitest.ts` | Executable checks for the deep ai council ledger schema runtime contract. |
| `deep-ai-council-reducers.vitest.ts` | Executable checks for the deep ai council reducers runtime contract. |
| `deep-ai-council-resume-adapter.vitest.ts` | Executable checks for the deep ai council resume adapter runtime contract. |
| `deep-ai-council-rollback-gate.vitest.ts` | Executable checks for the deep ai council rollback gate runtime contract. |
| `deep-ai-council-sealed-artifacts.vitest.ts` | Executable checks for the deep ai council sealed artifacts runtime contract. |
| `deep-ai-council-shadow-parity.vitest.ts` | Executable checks for the deep ai council shadow parity runtime contract. |
| `deep-alignment-certificates.vitest.ts` | Executable checks for the deep alignment certificates runtime contract. |
| `deep-alignment-ledger-schema.vitest.ts` | Executable checks for the deep alignment ledger schema runtime contract. |
| `deep-alignment-reducers.vitest.ts` | Executable checks for the deep alignment reducers runtime contract. |
| `deep-alignment-resume-adapter.vitest.ts` | Executable checks for the deep alignment resume adapter runtime contract. |
| `deep-alignment-rollback-gate.vitest.ts` | Executable checks for the deep alignment rollback gate runtime contract. |
| `deep-alignment-sealed-artifacts.vitest.ts` | Executable checks for the deep alignment sealed artifacts runtime contract. |
| `deep-alignment-shadow-parity.vitest.ts` | Executable checks for the deep alignment shadow parity runtime contract. |
| `deep-improvement-common-certificates.vitest.ts` | Executable checks for the deep improvement common certificates runtime contract. |
| `deep-improvement-common-ledger-schema.vitest.ts` | Executable checks for the deep improvement common ledger schema runtime contract. |
| `deep-improvement-common-reducers.vitest.ts` | Executable checks for the deep improvement common reducers runtime contract. |
| `deep-improvement-common-resume-adapter.vitest.ts` | Executable checks for the deep improvement common resume adapter runtime contract. |
| `deep-improvement-common-rollback-gate.vitest.ts` | Executable checks for the deep improvement common rollback gate runtime contract. |
| `deep-improvement-common-sealed-artifacts.vitest.ts` | Executable checks for the deep improvement common sealed artifacts runtime contract. |
| `deep-improvement-common-shadow-parity.vitest.ts` | Executable checks for the deep improvement common shadow parity runtime contract. |
| `deep-research-certificates.vitest.ts` | Executable checks for the deep research certificates runtime contract. |
| `deep-research-convergence-floor.vitest.ts` | Executable checks for the deep research convergence floor runtime contract. |
| `deep-research-ledger-schema.vitest.ts` | Executable checks for the deep research ledger schema runtime contract. |
| `deep-research-memory-upsert-yaml.vitest.ts` | Executable checks for the deep research memory upsert yaml runtime contract. |
| `deep-research-novelty-inertness.vitest.ts` | Executable checks for the deep research novelty inertness runtime contract. |
| `deep-research-reduce-state.vitest.ts` | Executable checks for the deep research reduce state runtime contract. |
| `deep-research-reducers.vitest.ts` | Executable checks for the deep research reducers runtime contract. |
| `deep-research-resume-adapter.vitest.ts` | Executable checks for the deep research resume adapter runtime contract. |
| `deep-research-rollback-gate.vitest.ts` | Executable checks for the deep research rollback gate runtime contract. |
| `deep-research-sealed-artifacts.vitest.ts` | Executable checks for the deep research sealed artifacts runtime contract. |
| `deep-research-shadow-parity.vitest.ts` | Executable checks for the deep research shadow parity runtime contract. |
| `deep-review-certificates.vitest.ts` | Executable checks for the deep review certificates runtime contract. |
| `deep-review-ledger-schema.vitest.ts` | Executable checks for the deep review ledger schema runtime contract. |
| `deep-review-reducers.vitest.ts` | Executable checks for the deep review reducers runtime contract. |
| `deep-review-resume-adapter.vitest.ts` | Executable checks for the deep review resume adapter runtime contract. |
| `deep-review-rollback-gate.vitest.ts` | Executable checks for the deep review rollback gate runtime contract. |
| `deep-review-sealed-artifacts.vitest.ts` | Executable checks for the deep review sealed artifacts runtime contract. |
| `deep-review-shadow-parity.vitest.ts` | Executable checks for the deep review shadow parity runtime contract. |
| `deep-review-strategy-heading.vitest.ts` | Executable checks for the deep review strategy heading runtime contract. |
| `dependency-seams.vitest.ts` | Executable checks for the dependency seams runtime contract. |
| `dispatch-failure.vitest.ts` | Executable checks for the dispatch failure runtime contract. |
| `dispatch-receipts.vitest.ts` | Executable checks for the dispatch receipts runtime contract. |
| `event-envelope.vitest.ts` | Executable checks for the event envelope runtime contract. |
| `evidence-contract.vitest.ts` | Executable checks for the evidence contract runtime contract. |
| `executor-audit-process-group.vitest.ts` | Executable checks for the executor audit process group runtime contract. |
| `executor-audit.vitest.ts` | Executable checks for the executor audit runtime contract. |
| `executor-config.vitest.ts` | Executable checks for the executor config runtime contract. |
| `executor-provenance-mismatch.vitest.ts` | Executable checks for the executor provenance mismatch runtime contract. |
| `fallback-router.vitest.ts` | Executable checks for the fallback router runtime contract. |
| `fanout-merge.vitest.ts` | Executable checks for the fanout merge runtime contract. |
| `fanout-pool.vitest.ts` | Executable checks for the fanout pool runtime contract. |
| `fanout-run.vitest.ts` | Executable checks for the fanout run runtime contract. |
| `fanout-salvage.vitest.ts` | Executable checks for the fanout salvage runtime contract. |
| `health-degeneration-harness.vitest.ts` | Executable checks for the health degeneration harness runtime contract. |
| `host-driven-improvement.vitest.ts` | Executable checks for the host driven improvement runtime contract. |
| `inflight-state-classification.vitest.ts` | Executable checks for the inflight state classification runtime contract. |
| `jsonl-repair.vitest.ts` | Executable checks for the jsonl repair runtime contract. |
| `leaf-artifact-writer.vitest.ts` | Executable checks for the leaf artifact writer runtime contract. |
| `legacy-projections.test.ts` | Executable checks for the legacy projections runtime contract. |
| `lifecycle-taxonomy-guards.vitest.ts` | Executable checks for the lifecycle taxonomy guards runtime contract. |
| `lifecycle-taxonomy-yaml-parity.vitest.ts` | Executable checks for the lifecycle taxonomy yaml parity runtime contract. |
| `lifecycle-taxonomy.vitest.ts` | Executable checks for the lifecycle taxonomy runtime contract. |
| `lineage-timestamp-window.vitest.ts` | Executable checks for the lineage timestamp window runtime contract. |
| `locks-and-fencing.vitest.ts` | Executable checks for the locks and fencing runtime contract. |
| `loop-lock-cli.vitest.ts` | Executable checks for the loop lock cli runtime contract. |
| `loop-lock.vitest.ts` | Executable checks for the loop lock runtime contract. |
| `mixed-version-fixtures.vitest.ts` | Executable checks for the mixed version fixtures runtime contract. |
| `mode-contracts.vitest.ts` | Executable checks for the mode contracts runtime contract. |
| `model-benchmark-certificates.vitest.ts` | Executable checks for the model benchmark certificates runtime contract. |
| `model-benchmark-ledger-schema.vitest.ts` | Executable checks for the model benchmark ledger schema runtime contract. |
| `model-benchmark-reducers.vitest.ts` | Executable checks for the model benchmark reducers runtime contract. |
| `model-benchmark-resume-adapter.vitest.ts` | Executable checks for the model benchmark resume adapter runtime contract. |
| `model-benchmark-rollback-gate.vitest.ts` | Executable checks for the model benchmark rollback gate runtime contract. |
| `model-benchmark-sealed-artifacts.vitest.ts` | Executable checks for the model benchmark sealed artifacts runtime contract. |
| `model-benchmark-shadow-parity.vitest.ts` | Executable checks for the model benchmark shadow parity runtime contract. |
| `next-focus.vitest.ts` | Executable checks for the next focus runtime contract. |
| `observability-events.vitest.ts` | Executable checks for the observability events runtime contract. |
| `optimizer-manifest-anti-convergence.vitest.ts` | Executable checks for the optimizer manifest anti convergence runtime contract. |
| `partial-failure-policy.vitest.ts` | Executable checks for the partial failure policy runtime contract. |
| `path-coverage-termination.vitest.ts` | Executable checks for the path coverage termination runtime contract. |
| `permissions-gate.vitest.ts` | Executable checks for the permissions gate runtime contract. |
| `pivot-candidates.vitest.ts` | Executable checks for the pivot candidates runtime contract. |
| `post-dispatch-receipt-validator.vitest.ts` | Executable checks for the post dispatch receipt validator runtime contract. |
| `post-dispatch-validate.vitest.ts` | Executable checks for the post dispatch validate runtime contract. |
| `prompt-pack.vitest.ts` | Executable checks for the prompt pack runtime contract. |
| `provenance-reduction.vitest.ts` | Executable checks for the provenance reduction runtime contract. |
| `receipts-and-effect-recovery.vitest.ts` | Executable checks for the receipts and effect recovery runtime contract. |
| `render-command-contract.vitest.ts` | Executable checks for the render command contract runtime contract. |
| `replay-fingerprint.vitest.ts` | Executable checks for the replay fingerprint runtime contract. |
| `result-envelopes.vitest.ts` | Executable checks for the result envelopes runtime contract. |
| `rollback-drills.vitest.ts` | Executable checks for the rollback drills runtime contract. |
| `run-now-yaml-control.vitest.ts` | Executable checks for the run now yaml control runtime contract. |
| `runtime-capabilities-matrix-conformance.vitest.ts` | Executable checks for the runtime capabilities matrix conformance runtime contract. |
| `runtime-capabilities.vitest.ts` | Executable checks for the runtime capabilities runtime contract. |
| `sealed-reference-artifacts.vitest.ts` | Executable checks for the sealed reference artifacts runtime contract. |
| `semantic-communities.vitest.ts` | Executable checks for the semantic communities runtime contract. |
| `shadow-parity-harness.vitest.ts` | Executable checks for the shadow parity harness runtime contract. |
| `skill-benchmark-certificates.vitest.ts` | Executable checks for the skill benchmark certificates runtime contract. |
| `skill-benchmark-ledger-schema.vitest.ts` | Executable checks for the skill benchmark ledger schema runtime contract. |
| `skill-benchmark-reducers.vitest.ts` | Executable checks for the skill benchmark reducers runtime contract. |
| `skill-benchmark-resume-adapter.vitest.ts` | Executable checks for the skill benchmark resume adapter runtime contract. |
| `skill-benchmark-rollback-gate.vitest.ts` | Executable checks for the skill benchmark rollback gate runtime contract. |
| `skill-benchmark-sealed-artifacts.vitest.ts` | Executable checks for the skill benchmark sealed artifacts runtime contract. |
| `skill-benchmark-shadow-parity.vitest.ts` | Executable checks for the skill benchmark shadow parity runtime contract. |
| `sleep.vitest.ts` | Executable checks for the sleep runtime contract. |
| `spawn-cjs.vitest.ts` | Executable checks for the spawn cjs runtime contract. |
| `speckit-autopilot-contract.vitest.ts` | Executable checks for the speckit autopilot contract runtime contract. |
| `stopping-clocks.vitest.ts` | Executable checks for the stopping clocks runtime contract. |
| `stream-fold-gauges.vitest.ts` | Executable checks for the stream fold gauges runtime contract. |
| `transactional-projections.vitest.ts` | Executable checks for the transactional projections runtime contract. |
| `trustworthy-state-records.vitest.ts` | Executable checks for the trustworthy state records runtime contract. |
| `verify-iteration.vitest.ts` | Executable checks for the verify iteration runtime contract. |
| `voc-allocation.vitest.ts` | Executable checks for the voc allocation runtime contract. |
| `workflow-session-id-parity.vitest.ts` | Executable checks for the workflow session id parity runtime contract. |
| `write-containment.vitest.ts` | Executable checks for the write containment runtime contract. |
| `write-set-conflict-graph.vitest.ts` | Executable checks for the write set conflict graph runtime contract. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Unit command | `tests/unit` under the runtime Vitest configuration |
| Test files | Every direct file listed in the FILES table |
| Covered implementation | Runtime modules under [the runtime library](../../lib/README.md) |

These files are executable verification, not production import points. Use the test filename to locate the contract under test, then follow the owning module README.

---

## 4. SPINE ROLE

Unit tests protect the smallest contracts in the runtime spine: parsing, event envelopes, reducers, locks, evidence, artifacts, recovery adapters, CLI seams and mode-specific clones. Higher-level suites compose these checks across process and database boundaries.

---

## 5. VALIDATION

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts tests/unit
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime library map](../../lib/README.md)
- [Runtime overview](../../README.md)

---
title: "system-deep-loop runtime unit tests"
description: "Per-module unit coverage for the system-deep-loop runtime contracts."
trigger_phrases:
  - "deep-loop runtime unit tests"
  - "runtime module tests"
---

# Unit Tests

> Per-module unit tests for the system-deep-loop runtime contracts, one file per contract so a failure names the owning module before the integration suites run.

---

## 1. OVERVIEW

This folder contains the per-module unit test surface for the runtime. Each file isolates a runtime contract or compatibility boundary so failures identify the owning module before the integration suites are run.

The FILES table lists every direct file in this folder. Test names are the public navigation surface for this folder.

---

## 2. FILES

| File | Coverage |
|---|---|
| `append-mode-event-cli.vitest.ts` | Runs the append-mode-event CLI as a subprocess and checks that the projection lands beside the state log for every run-directory shape. |
| `append-mode-event-legacy-seam.vitest.ts` | Checks the append-mode-event upcast seam for legacy deep-research records, review identity and stream identity minting. |
| `artifact-root.vitest.ts` | Executable checks for the artifact root runtime contract. |
| `atomic-state.vitest.ts` | Executable checks for the atomic state runtime contract. |
| `authorized-ledger.vitest.ts` | Executable checks for the authorized ledger runtime contract. |
| `bayesian-scorer.vitest.ts` | Executable checks for the bayesian scorer runtime contract. |
| `blinded-adjudication.vitest.ts` | Executable checks for the blinded adjudication runtime contract. |
| `check-contract-drift.vitest.ts` | Executable checks for the check contract drift runtime contract. |
| `check-direct-append-cli.vitest.ts` | Checks the direct-append detection CLI `check-direct-append`. |
| `check-documentation-drift.vitest.ts` | Checks that `check-documentation-drift.cjs --facts` compares scanned docs against the repository facts they describe. |
| `check-ledger-stem-producers.vitest.ts` | Checks the check-ledger-stem-producers rule cases and runs the checker against the committed tree. |
| `check-projection-coverage.vitest.ts` | Checks the check-projection-coverage conformance rules. |
| `check-protocol-append-sites.vitest.ts` | Checks the check-protocol-append-sites conformance rules and the retired append-site exemptions. |
| `claim-continuity.vitest.ts` | Executable checks for the claim continuity runtime contract. |
| `cli-guards-needs-input.vitest.ts` | Checks `detectPendingQuestion` and the `needs_input` and quota-exhaustion classes of `classifyLineageFailure`. |
| `cli-guards-writer-lock.vitest.ts` | Executable checks for the cli guards writer lock runtime contract. |
| `cli-matrix.vitest.ts` | Executable checks for the cli matrix runtime contract. |
| `combo-matrix.vitest.ts` | Executable checks for the combo matrix runtime contract. |
| `compile-command-contracts.vitest.ts` | Executable checks for the compile command contracts runtime contract. |
| `completed-lineage-state-cli.vitest.ts` | Checks the `completed-lineage-state.cjs` CLI: it writes the terminal row for the named loop and exits 2 with usage when the lineage dir is missing. |
| `conditional-fanin.vitest.ts` | Executable checks for the conditional fanin runtime contract. |
| `continuity-identities.vitest.ts` | Executable checks for the continuity identities runtime contract. |
| `continuity-thread.vitest.ts` | Executable checks for the continuity thread runtime contract. |
| `contradiction-supersession.vitest.ts` | Executable checks for the contradiction supersession runtime contract. |
| `convergence-score-delta.vitest.ts` | Executable checks for the convergence score delta runtime contract. |
| `coverage-graph-db.vitest.ts` | Executable checks for the coverage graph db runtime contract. |
| `coverage-graph-query.vitest.ts` | Executable checks for the coverage graph query runtime contract. |
| `coverage-graph-signals.vitest.ts` | Executable checks for the coverage graph signals runtime contract. |
| `cutover-binding.vitest.ts` | Checks that cutover binding resolution refuses a binding that would invent an actor or a commit. |
| `cycle-detection.vitest.ts` | Executable checks for the cycle detection runtime contract. |
| `deep-loop-fanout-wiring.vitest.ts` | Checks that both workflows hand config values to the fan-out steps, including the seed command with an explicit budget before the root config exists. |
| `deep-loop-save-full-auto-yaml.vitest.ts` | Checks that the deep loop save step runs the continuity writer with `--full-auto` and the four continuity fields. |
| `deep-loop-stage-artifact-dir.vitest.ts` | Runs the synthesis staging step's `git add` against the repository ignore rules, including the status ledger ignore rule. |
| `deep-research-authority-composition.vitest.ts` | Checks the deep-research read-only admission gate in `admitCanonicalWrite`. |
| `deep-research-bookkeeping-emission.vitest.ts` | Checks the bookkeeping records the deep-research workflow emits. |
| `deep-research-convergence-floor.vitest.ts` | Executable checks for the deep research convergence floor runtime contract. |
| `deep-research-deltas-contract.vitest.ts` | Checks the deep-research-deltas projection surface with a fan-out byte proof, a real-consumer proof and a negative control. |
| `deep-research-graph-upsert.vitest.ts` | Checks that the research graph upsert step reads the iteration delta file and writes exactly what it declares into the coverage database. |
| `deep-research-ledger-schema.vitest.ts` | Executable checks for the deep research ledger schema runtime contract. |
| `deep-research-lock-release.vitest.ts` | Checks that the deep-loop lock release carries the acquire nonce on every terminal path after the acquire. |
| `deep-research-marker-scan.vitest.ts` | Checks that the deep research marker scan never matches its own canonical header. |
| `deep-research-memory-upsert-yaml.vitest.ts` | Executable checks for the deep research memory upsert yaml runtime contract. |
| `deep-research-novelty-inertness.vitest.ts` | Executable checks for the deep research novelty inertness runtime contract. |
| `deep-research-projections-contract.vitest.ts` | Checks the deep-research-projections surface: the findings-registry byte proof, a negative control and the state-log leaf fields. |
| `deep-research-reduce-state.vitest.ts` | Executable checks for the deep research reduce state runtime contract. |
| `deep-research-reduce-state-usage.vitest.ts` | Checks that the research reducer's usage line names every flag it accepts. |
| `deep-research-reducers.vitest.ts` | Executable checks for the deep research reducers runtime contract. |
| `deep-research-run-open.vitest.ts` | Checks how a deep-research run opens. |
| `deep-research-sealed-artifacts.vitest.ts` | Executable checks for the deep research sealed artifacts runtime contract. |
| `deep-review-bookkeeping-emission.vitest.ts` | Checks the bookkeeping records the deep-review workflow emits. |
| `deep-review-deltas-contract.vitest.ts` | Checks the deep-review-deltas projection surface. |
| `deep-review-ledger-schema.vitest.ts` | Executable checks for the deep review ledger schema runtime contract. |
| `deep-review-lock-refresh.vitest.ts` | Checks that deep-review keeps its packet lock alive across iterations. |
| `deep-review-marker-scan.vitest.ts` | Checks that the deep review marker scan never matches its own canonical header. |
| `deep-review-projections-contract.vitest.ts` | Checks the deep-review-projections surface with a findings-registry byte proof and a negative control. |
| `deep-review-recovery-baseline-drain.vitest.ts` | Checks that deep-review drains the staged recovery baseline after dispatch. |
| `deep-review-reducers.vitest.ts` | Executable checks for the deep review reducers runtime contract. |
| `deep-review-run-open.vitest.ts` | Checks how a deep-review run opens. |
| `deep-review-sealed-artifacts.vitest.ts` | Executable checks for the deep review sealed artifacts runtime contract. |
| `deep-review-stage-skip.vitest.ts` | Checks that deep-review skips artifact staging inside a fan-out lineage. |
| `deep-review-state-contract.vitest.ts` | Checks the deep-review-state projection contract and the terminal gate verdict. |
| `deep-review-state-reducer.vitest.ts` | Checks `reduceReviewState`: graceful degradation on warning-class problems, iteration numbering and the finding narrative. |
| `deep-review-strategy-heading.vitest.ts` | Executable checks for the deep review strategy heading runtime contract. |
| `dependency-seams.vitest.ts` | Executable checks for the dependency seams runtime contract. |
| `dispatch-failure.vitest.ts` | Executable checks for the dispatch failure runtime contract. |
| `dispatch-iteration.vitest.ts` | Checks the dispatch-iteration CLI refusals, its `--claude-config-dir` option and Claude dispatch. |
| `dispatch-receipts.vitest.ts` | Executable checks for the dispatch receipts runtime contract. |
| `divergent-pivot-cli.vitest.ts` | Checks the divergent-pivot CLI usage failures and its retry contract. |
| `divergent-pivot-seat-scope.vitest.ts` | Executable checks that a divergent pivot counts only its own seat outputs against the per-attempt cap. |
| `event-envelope.vitest.ts` | Executable checks for the event envelope runtime contract. |
| `event-envelope-upcast-cause.vitest.ts` | Checks that a failed upcast carries the upcaster's error as a non-enumerable `cause`. |
| `evidence-contract.vitest.ts` | Executable checks for the evidence contract runtime contract. |
| `executor-adapter-capabilities.vitest.ts` | Checks the executor adapter capability record, including the single-iteration dispatcher. |
| `executor-audit-ledger-projection.vitest.ts` | Checks the executor audit rows written to a ledger-backed state log, from the first record through failure, verification and write-containment rows. |
| `executor-audit-process-group.vitest.ts` | Executable checks for the executor audit process group runtime contract. |
| `executor-audit-run-directory.vitest.ts` | Checks that the gateway run directory resolves against the caller. |
| `executor-audit.vitest.ts` | Executable checks for the executor audit runtime contract. |
| `executor-branch-contract.vitest.ts` | Checks the deep-loop executor branch contract. |
| `executor-config.vitest.ts` | Executable checks for the executor config runtime contract. |
| `executor-provenance-mismatch.vitest.ts` | Executable checks for the executor provenance mismatch runtime contract. |
| `fallback-router.vitest.ts` | Executable checks for the fallback router runtime contract. |
| `fanout-budget-redact.vitest.ts` | Checks that an explicit `--max-iterations` binds the lineage budget and that `fanout-run.cjs` masks lineage logs. |
| `fanout-claude-stream-json.vitest.ts` | Checks the Claude stream-json lineage argv, provider cost and final text. |
| `fanout-effect-dispatch.vitest.ts` | Executable checks that a resumed lineage dispatches again under a fresh effect id instead of replaying its first dispatch. |
| `fanout-executable-version.vitest.ts` | Checks that an executable but unreadable first PATH match records an unknown executable version instead of hashing a later binary. |
| `fanout-effective-config.vitest.ts` | Checks that `effective_config` reports what each executor kind's command enforces. |
| `fanout-lineage-config.vitest.ts` | Checks the lineage config block and the review scope seed that `fanout-run.cjs` writes. |
| `fanout-merge-latest-record.vitest.ts` | Checks that fanout-merge reads the latest iteration records. |
| `fanout-merge-lineage-trust.vitest.ts` | Checks that the fan-out merge weighs the runner's verdict and pass evidence for review and research lineages. |
| `fanout-merge-question-shape.vitest.ts` | Checks that fanout-merge handles malformed question collections. |
| `fanout-merge-reducer-provenance.vitest.ts` | Checks the reducer provenance that `fanout-merge.cjs` records. |
| `fanout-merge-structured-missing.vitest.ts` | Checks fanout-merge when structured findings are missing from a lineage registry. |
| `fanout-merge.vitest.ts` | Executable checks for the fanout merge runtime contract. |
| `fanout-pass-evidence.vitest.ts` | Checks `passEvidence`, `readLineageCommits` and `readLineagePassSummary` against the runner's own log. |
| `fanout-pool.vitest.ts` | Executable checks for the fanout pool runtime contract. |
| `fanout-provider-cost.vitest.ts` | Checks the provider cost that `fanout-salvage.cjs` and `fanout-merge.cjs` read from lineage logs. |
| `fanout-root-resource-map.vitest.ts` | Checks that deep-review skips the root resource-map reducer at a fan-out root. |
| `fanout-run.vitest.ts` | Executable checks for the fanout run runtime contract. |
| `fanout-salvage.vitest.ts` | Executable checks for the fanout salvage runtime contract. |
| `fanout-signal-stop.vitest.ts` | Checks that a signal stop closes its lineages in the ledger and that the bootstrap forwards every signal until its child closes. |
| `fanout-status-answered.vitest.ts` | Checks the answered count for review lineage nodes in the progress row. |
| `fanout-status.vitest.ts` | Checks the progress row fields, their live stdout and the read-only `fanout-run.cjs --status` table. |
| `fanout-stop-identity.vitest.ts` | Checks the lineage identity that `fanout-run.cjs --stop` acts on. |
| `fanout-stop.vitest.ts` | Checks the kill semantics of `fanout-run.cjs`. |
| `frontier-admit-review.vitest.ts` | Executable checks for review frontier admission: target relevance, seeding, the review block and the dimension-scaled budget. |
| `frontier-admit.vitest.ts` | Executable checks for the frontier node store: check order, prune reasons, seeding, close, graph projection and the seed budget. |
| `fs-durability.vitest.ts` | Checks that fsyncPath flushes a file and a directory and throws on a missing path, and that makeTempPath builds distinct sibling temp paths. |
| `graph-read-only.vitest.ts` | Checks the read-only mode of the graph scripts. |
| `health-degeneration-harness.vitest.ts` | Executable checks for the health degeneration runtime contract. |
| `hermetic-env.vitest.ts` | Checks the `createHermeticEnv` and `resolveRepositoryRoot` test helpers. |
| `hierarchical-budgets-errors.vitest.ts` | Checks that budget reducer errors name the missing scope or reservation. |
| `iteration-findings.vitest.ts` | Checks `parseIterationMarkdownFindings`. |
| `jsonl-repair.vitest.ts` | Executable checks for the jsonl repair runtime contract. |
| `ledger-read-cache.vitest.ts` | Checks the single-writer read cache of `AppendOnlyLedger`. |
| `legacy-projection-surface-fold.vitest.ts` | Checks `foldLegacyProjectionSurface`. |
| `legacy-projections.test.ts` | Executable checks for the legacy projections runtime contract. |
| `lifecycle-taxonomy-guards.vitest.ts` | Executable checks for the lifecycle taxonomy guards runtime contract. |
| `lifecycle-taxonomy-yaml-parity.vitest.ts` | Executable checks for the lifecycle taxonomy yaml parity runtime contract. |
| `lifecycle-taxonomy.vitest.ts` | Executable checks for the lifecycle taxonomy runtime contract. |
| `lineage-timestamp-window.vitest.ts` | Executable checks for the lineage timestamp window runtime contract. |
| `locks-and-fencing.vitest.ts` | Executable checks for the locks and fencing runtime contract. |
| `loop-counters-derivation.vitest.ts` | Checks `deriveLoopCounters`, failed iterations in the stop vote and the loop counters in `convergence.cjs`. |
| `loop-heartbeat.vitest.ts` | Checks the single-loop heartbeat command `loop-heartbeat.cjs`. |
| `loop-lock-cli.vitest.ts` | Executable checks for the loop lock cli runtime contract. |
| `loop-lock.vitest.ts` | Executable checks for the loop lock runtime contract. |
| `mode-append-gateway.vitest.ts` | Checks the mode append gateway, its projection relative path and its idempotency key. |
| `mode-contracts-shape.vitest.ts` | Pins the mode-contracts constant sets (capabilities, convergence hooks, substrate ports, required port list) and checks they are frozen. |
| `next-focus.vitest.ts` | Executable checks for the next focus runtime contract. |
| `observability-events.vitest.ts` | Executable checks for the observability events runtime contract. |
| `opencode-dual-dispatch.vitest.ts` | Executable checks for the OpenCode dual dispatch runtime contract: version parsing and binary resolution precedence, cache invalidation, CJS/ESM parser parity and the per-version lineage argv builders, including the refusal to dispatch native v2. |
| `operator-text-shell-steps.vitest.ts` | Runs each workflow shell step that takes operator text under bash and checks that the text arrives intact while nothing in it executes. |
| `optimizer-manifest-anti-convergence.vitest.ts` | Executable checks for the optimizer manifest anti convergence runtime contract. |
| `partial-failure-policy.vitest.ts` | Executable checks for the partial failure policy runtime contract. |
| `path-coverage-termination.vitest.ts` | Executable checks for the path coverage termination runtime contract. |
| `per-mode-authority-flip.vitest.ts` | Checks `selectAuthorityRoute`, `isValidAuthorityRecord` and `AuthorityRegistry`. |
| `permissions-gate.vitest.ts` | Executable checks for the permissions gate runtime contract. |
| `pivot-candidates.vitest.ts` | Executable checks for the pivot candidates runtime contract. |
| `post-dispatch-receipt-validator.vitest.ts` | Executable checks for the post dispatch receipt validator runtime contract. |
| `post-dispatch-validate.vitest.ts` | Executable checks for the post dispatch validate runtime contract. |
| `prompt-pack.vitest.ts` | Executable checks for the prompt pack runtime contract. |
| `provenance-reduction.vitest.ts` | Executable checks for the provenance reduction runtime contract. |
| `receipts-and-effect-recovery.vitest.ts` | Executable checks for the receipts and effect recovery runtime contract. |
| `render-command-contract.vitest.ts` | Executable checks for the render command contract runtime contract. |
| `replay-fingerprint.vitest.ts` | Executable checks for the replay fingerprint runtime contract. |
| `research-depth-mode-golden.vitest.ts` | Executable checks that a default research run keeps its pre-expansive output, apart from the expansive-only persona paragraph the test strips from the lineage prompt. |
| `result-envelopes.vitest.ts` | Executable checks for the result envelopes runtime contract. |
| `review-dashboard-verdict.vitest.ts` | Checks the provisional review verdict that `reduceReviewState` derives. |
| `review-depth-mode-golden.vitest.ts` | Executable checks that a default review run keeps its pre-expansive output, apart from the expansive-only persona paragraph the test strips from the lineage prompt. |
| `review-verdict.vitest.ts` | Checks `deriveReviewVerdict` and the review-verdict CLI. |
| `runtime-bootstrap.test.cjs` | `node:test` suite for `../../scripts/runtime-bootstrap.cjs`: `tsxChildEnv` drops `NODE_PRESERVE_SYMLINKS` and never mutates `process.env`, `resolveContainmentRepoRoot` honors its precedence order and symlink redirection, and every tsx re-exec entry point builds its child env through `tsxChildEnv`. A regression here reintroduces the `ERR_MODULE_NOT_FOUND` that stalls every executor at iteration 1. |
| `run-now-yaml-control.vitest.ts` | Executable checks for the run now yaml control runtime contract. |
| `runtime-capabilities-matrix-conformance.vitest.ts` | Executable checks for the runtime capabilities matrix conformance runtime contract. |
| `runtime-capabilities.vitest.ts` | Executable checks for the runtime capabilities runtime contract. |
| `score-fanout-pairs.vitest.ts` | Checks the score-fanout-pairs walker, its pair selection and its merge oracle. |
| `sealed-reference-artifacts.vitest.ts` | Executable checks for the sealed reference artifacts runtime contract. |
| `self-check-adjudication.vitest.ts` | Checks self-check adjudication through the append gateway. |
| `semantic-communities.vitest.ts` | Executable checks for the semantic communities runtime contract. |
| `setup-cp-sandbox-guard.vitest.ts` | Checks that both command-flow `setup-cp-sandbox.sh` scripts refuse `/tmp` itself, `.` and `..` segments and a symlink escape before any `rm -rf`, with `rm`, `cp` and `ln` stubbed. |
| `sleep.vitest.ts` | Executable checks for the sleep runtime contract. |
| `spawn-cjs.vitest.ts` | Executable checks for the spawn cjs runtime contract. |
| `speckit-autopilot-contract.vitest.ts` | Executable checks for the speckit autopilot contract runtime contract. |
| `state-record-containment.vitest.ts` | Checks that `append-state-record.cjs` refuses a target whose real path leaves the working directory, including dot-dot, symlinked and dangling targets. |
| `stop-decision-yaml-contract.vitest.ts` | Checks that the research and review workflows bind `depth_mode` beside `convergence_mode` and wire the expansive frontier steps. |
| `stop-decision.vitest.ts` | Checks the stop decision thresholds, signals and quality guards. |
| `stop-policy-yaml-parity.vitest.ts` | Checks stop policy parity across the runtime-loop workflows and the convergence algorithm contract. |
| `stopping-clocks.vitest.ts` | Executable checks for the stopping clocks runtime contract. |
| `stream-fold-gauges.vitest.ts` | Executable checks for the stream fold gauges runtime contract. |
| `synthesis-closeout-counts.vitest.ts` | Checks the synthesis-closeout severity count guard. |
| `synthesis-closeout-latest-record.vitest.ts` | Checks that synthesis-closeout reads the latest iteration records. |
| `synthesis-closeout-refinements.vitest.ts` | Checks how synthesis-closeout counts refinements. |
| `synthesis-closeout-run-identity.vitest.ts` | Checks the run identity synthesis-closeout records. |
| `terminal-gates.vitest.ts` | Checks `computeTerminalGates`, the traceability the configured dimensions owe and the terminal-gates CLI. |
| `traceability-rollup.vitest.ts` | Checks `normalizeTraceabilityChecks`, traceability status parsing and `buildTraceabilityRollup`. |
| `transactional-projections.vitest.ts` | Executable checks for the transactional projections runtime contract. |
| `trustworthy-state-records.vitest.ts` | Executable checks for the trustworthy state records runtime contract. |
| `typo-flags.vitest.ts` | Checks that the deep-loop CLIs reject typo flags. |
| `unknown-options.vitest.ts` | Checks that the deep-loop CLIs reject unknown options. |
| `validate-playbook-package-list.vitest.ts` | Checks that the stress playbook validator reads `vitest list` lines with and without a project-name prefix. |
| `verify-authority-cli.vitest.ts` | Checks the independent verify-authority CLI. |
| `verify-iteration.vitest.ts` | Executable checks for the verify iteration runtime contract. |
| `voc-allocation.vitest.ts` | Executable checks for the voc allocation runtime contract. |
| `workflow-event-dir-binding.vitest.ts` | Checks that workflow command blocks bind `EVENT_DIR` before using it. |
| `workflow-lock-lifetime.vitest.ts` | Checks the workflow lock lifetime contract. |
| `workflow-max-duration.vitest.ts` | Checks the workflow max duration contract. |
| `workflow-restart-lifecycle.vitest.ts` | Checks the workflow restart lifecycle, completed-run extension and the expansive frontier graph mirror. |
| `workflow-session-id-parity.vitest.ts` | Executable checks for the workflow session id parity runtime contract. |
| `workflow-steps.vitest.ts` | Checks the workflow step programs for prior-lineage, extend and generation. |
| `write-containment-yaml-call-sites.vitest.ts` | Executable checks that every /deep workflow containment call site reports contested paths. |
| `write-containment.vitest.ts` | Executable checks for the write containment runtime contract. |
| `write-set-conflict-graph.vitest.ts` | Executable checks for the write set conflict graph runtime contract. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Unit command | `tests/unit` under the runtime Vitest configuration |
| Node test | `runtime-bootstrap.test.cjs`, outside Vitest's `*.{vitest,test}.ts` include and run by `node` on [`../../../../../scripts/run-node-tests.mjs`](../../../../../scripts/run-node-tests.mjs) |
| Test files | Every direct file listed in the FILES table |
| Covered implementation | Runtime modules under [the runtime library](../../lib/README.md) |

These files are executable verification, not production import points. Use the test filename to locate the contract under test, then follow the owning module README.

---

## 4. SPINE ROLE

Unit tests protect the smallest contracts in the runtime spine: parsing, event envelopes, reducers, locks, evidence, artifacts, recovery adapters, CLI seams and mode-specific clones. Higher-level suites compose these checks across process and database boundaries.

---

## 5. VALIDATION

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts tests/unit
node --test .skilled/skills/system-deep-loop/runtime/tests/unit/runtime-bootstrap.test.cjs
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime library map](../../lib/README.md)
- [Runtime overview](../../README.md)

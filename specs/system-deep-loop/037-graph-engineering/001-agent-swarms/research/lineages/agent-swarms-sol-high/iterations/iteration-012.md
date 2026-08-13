# Iteration 12: Behavioral Parity Across Execution Surfaces

## Focus

The same graph must mean the same thing on every executor. Source-shape similarity is useful but insufficient proof of behavioral parity.

## Findings

1. AgentSwarms explicitly tests that canvas and server recognize the same node kinds, share iteration bounds, import common topology/branch/retry helpers, and define the yes/no judge once. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/tests/unit/swarmExecutorParity.test.ts:1-151]
2. Those tests are primarily static/import checks; they do not prove equivalent event traces, effect intents, edge selection, crash recovery, or checkpoint replay under identical fixtures. [INFERENCE: source presence can coexist with executor-specific ordering or persistence behavior]
3. Current deep-research parity requires canonical paths, lifecycle vocabulary, reducer ownership, pause sentinel, and lineage keys across runtime mirrors. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md:19-86]
4. Decision: define a versioned conformance corpus of graph fixtures and expected normalized ledger traces. Every executor must produce the same authorized node/edge transitions, reducer results, skip set, verdicts, budget charges, effect intents, and terminal certificate; timestamps, transport ids, token chunks, and provider telemetry may vary. [INFERENCE: upgrades parity from shared source symbols to observable contract equivalence]
5. Required adversarial fixtures include fail-closed unknown routes, all/any/quorum/stream joins, wave conflicts, retry exhaustion, evaluator disagreement, stale approvals, checkpoint loss, in-doubt effects, cancellation, nested convergence, and capability rejection. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-integration-migration-and-cutover/003-shadow-parity-harness/spec.md:50-145]
6. When not to use: do not require byte-identical transcripts or identical model prose; parity is semantic at the typed boundary. Provider-specific features are allowed only behind declared adapter capabilities and must fail compilation when a required invariant is unavailable. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md:61-86]

## Ruled Out

- “Same imports” as sufficient parity; transcript byte equality; silent provider fallback.

## Assessment

- New information ratio: 0.78
- Novelty: establishes normalized ledger-trace equivalence as the parity oracle.
- Questions addressed/answered: q-parity test contract.

## Recommended Next Focus

Separate stable organization graphs from generated per-run work graphs.

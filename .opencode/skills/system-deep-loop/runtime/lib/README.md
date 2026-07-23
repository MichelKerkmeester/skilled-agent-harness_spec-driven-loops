---
title: "runtime/ Library"
description: "Domain logic library for system-deep-loop, holding thirty-seven domains from the convergent-architecture spine plus the council, coverage-graph and deep-loop subsystems."
---

# runtime/ Library

---

## 1. OVERVIEW

Shared domain logic for the `system-deep-loop` hub, which routes research, review, ai-council, alignment and three improvement lanes. Active graph-backed workflow modes use `runtimeLoopType` values `research`, `review` or `council`. Legacy `context` handling remains only for historical artifacts, and improvement lanes keep `runtimeLoopType: null`. Most domains isolate their own concerns and write verified events through the shared `authorized-ledger` gateway on top of the `event-envelope` substrate, though a few domains such as `council/`, `coverage-graph/` and `write-set-conflict-graph/` stay outside that ledger-backed spine. This is the domain layer. CLI-specific infrastructure lives in `scripts/lib/` instead.

## 2. LIBRARY DOMAINS

Each domain owns its own `README.md` with contents, consumers and tests. The two foundation layers are `event-envelope` (canonical serialization and the event-schema registry) and `authorized-ledger` (the default-deny write and replay gateway) that most other domains build on.

| Domain | Purpose |
|--------|---------|
| `authorized-ledger/` | Default-deny authorization gateway and immutable append-only ledger that ledger-backed domains write verified events through. |
| `blinded-adjudication/` | Reviewer-blind adjudication comparing a baseline judgment with a policy-linked intervention without exposing candidate identity. |
| `branch-leases-waves/` | Durable fan-out admission, fenced branch ownership and immutable wave compilation for parallel branch execution. |
| `claim-continuity/` | Tracks claim identity across loop iterations by matching, folding and replaying claim events into a disposable frontier projection. |
| `compatibility-shadow/` | Dual-read comparison and versioned upcasting so legacy and dark stores can be evaluated side by side without changing legacy reads. |
| `conditional-fanin/` | Decides when a fan-out wave has enough branch results to proceed and plans continuation for the branches left outstanding. |
| `contradiction-supersession/` | Isolated shadow ledger recording contradiction and supersession between claims, with an audited replay-verified status projection. |
| `council/` | Multi-seat dispatch, adjudicator-verdict stability and cost guards for the deep-ai-council mode. |
| `coverage-graph/` | Schema, queries and Bayesian signals for deep-loop convergence detection. |
| `cross-mode-closures/` | Five shared-implementation closures with a manifest-complete catalog mapping them to every deep-loop mode ID, designed to replace per-mode reimplementation of shared mechanics. No mode packet invokes them yet outside the domain's own unit test. |
| `cycle-detection/` | Detects unproductive repetition across iterations by comparing bounded state-signature history against a versioned policy. |
| `deep-loop/` | Atomic state, loop locking, JSONL repair and executor config for the deep-loop runtime backend. |
| `dispatch-receipts/` | Records a durable integrity-checked receipt before a dispatch crosses the process-spawn boundary, so a resumed session recognizes an already-launched run. |
| `event-envelope/` | Foundational canonical-serialization and event-schema registry substrate underneath most domains, excluding `council/`, `coverage-graph/` and `write-set-conflict-graph/`. |
| `health-degeneration-harness/` | Turns normalized budget, cycle and coverage signals into a per-mode health state and a recommended response action. |
| `hierarchical-budgets/` | Reserves, settles and replays token, cost, iteration and wall-time budgets across a four-level scope hierarchy. |
| `inflight-state-classification/` | Classifies in-flight legacy state rows against a frozen census into upcast, pin, fork, migrate or block dispositions. |
| `legacy-projections/` | Folds verified ledger events into disposable legacy JSON or JSONL bytes so existing readers keep working during migration. |
| `locks-and-fencing/` | Grants leases with monotonic fence tokens and gates ledger and state writes behind them to prevent split-brain writers. |
| `mixed-version-fixtures/` | Authors, compiles and oracle-verifies fixture cases that mix old and new runtime versions across a mode cutover boundary. |
| `mode-contracts/` | Defines the contract shape, required substrate ports, conformance runner and version compatibility policy for a workflow mode. |
| `next-focus/` | Derives, scores and durably records the next research or review focus region as a replayable ledger decision. |
| `partial-failure-policy/` | Decides whether a fan-out orchestration should abort, wait, proceed or proceed degraded when some branches fail. |
| `path-coverage-termination/` | Evaluates whether a workflow mode has covered its required region universe well enough to terminate. |
| `provenance-reduction/` | Reduces multiple fan-out candidate results into one source-balanced replay-verifiable outcome. |
| `receipts-and-effect-recovery/` | Certifies boundary receipts and recovers idempotently from side effects across mode and phase boundaries, verified by replay. |
| `replay-fingerprint/` | Derives and verifies a versioned canonical fingerprint that commits an authorized ledger replay to its projection output. |
| `result-envelopes/` | Records the durable outcome of a dispatched leaf task, including salvage and recovery evidence, as authorized ledger events. |
| `rollback-drills/` | Runs fault-injected forward-detect-reverse-resume drills against an isolated sandbox ledger and certifies the rollback. |
| `sealed-reference-artifacts/` | Content-addressed sealing, storage and lifecycle tracking for reference artifacts such as prompt sets, fixtures and configuration. |
| `semantic-communities/` | Groups semantically equivalent claims into namespaced communities through an incremental versioned projection. |
| `shadow-parity/` | Runs a candidate implementation against its legacy baseline and issues a parity certificate only when every case closes with zero divergence. |
| `stopping-clocks/` | Arbitrates five independent loop-termination signals into one deterministic termination declaration. |
| `stream-fold-gauges/` | Deterministic replay-verifiable streaming metric folds computed from ledger events, compared against legacy dark-run values. |
| `transactional-projections/` | Applies verified ledger events into one atomic fenced multi-view projection bundle and publishes committed snapshot manifests. |
| `voc-allocation/` | Scores marginal value of computation for outstanding branches against budget pressure and plans a non-authoritative allocation. |
| `write-set-conflict-graph/` | Derives a deterministic conflict graph over declared shipped-mode resources, then schedules non-conflicting work into ordered lanes. |

## 3. RELATED RESOURCES

- Parent SKILL.md: `.opencode/skills/system-deep-loop/SKILL.md`
- Per-domain READMEs: each domain folder listed above carries its own `README.md`.
- Tests: `.opencode/skills/system-deep-loop/runtime/tests/`

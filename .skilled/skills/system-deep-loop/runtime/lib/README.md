---
title: "runtime/ Library"
description: "Domain logic library for system-deep-loop, holding thirty-seven domains from the convergent-architecture spine plus the council, coverage-graph and deep-loop subsystems."
---

# runtime/ Library

---

## 1. OVERVIEW

Shared domain logic for the `system-deep-loop` hub, which routes research and review. Active graph-backed workflow modes use `runtimeLoopType` values `research` or `review`. Legacy `context` handling remains only for historical artifacts. Most domains isolate their own concerns and write verified events through the shared `authorized-ledger` gateway on top of the `event-envelope` substrate, though a few domains such as `council/`, `coverage-graph/` and `write-set-conflict-graph/` stay outside that ledger-backed spine. This is the domain layer. CLI-specific infrastructure lives in `../scripts/lib/` instead.

---

## 2. DIRECTORY TREE

One folder per domain. The table in the next section gives each domain's purpose.

```text
lib/
├── authority-root/
├── authorized-ledger/
├── blinded-adjudication/
├── claim-continuity/
├── conditional-fanin/
├── contradiction-supersession/
├── council/
├── coverage-graph/
├── cycle-detection/
├── deep-loop/
├── deep-research-authority/
├── deep-research-ledger-schema/
├── deep-research-reducers/
├── deep-research-sealed-artifacts/
├── deep-review-ledger-schema/
├── deep-review-reducers/
├── deep-review-sealed-artifacts/
├── dispatch-receipts/
├── event-envelope/
├── health-degeneration-harness/
├── hierarchical-budgets/
├── legacy-projections/
├── locks-and-fencing/
├── mode-append-gateway/
├── mode-contracts/
├── next-focus/
├── partial-failure-policy/
├── path-coverage-termination/
├── per-mode-authority-flip/
├── provenance-reduction/
├── receipts-and-effect-recovery/
├── replay-fingerprint/
├── result-envelopes/
├── sealed-reference-artifacts/
├── semantic-communities/
├── stopping-clocks/
├── stream-fold-gauges/
├── transactional-projections/
├── voc-allocation/
├── write-set-conflict-graph/
└── README.md
```

---

## 3. LIBRARY DOMAINS

Each domain owns its own `README.md` with contents, consumers and tests. The two foundation layers are `event-envelope` (canonical serialization and the event-schema registry) and `authorized-ledger` (the default-deny write and replay gateway) that most other domains build on.

| Domain | Purpose |
|--------|---------|
| `authority-root/` | Resolves the single durable authority root directory that stays mode-global across concurrent and sequential runs. |
| `authorized-ledger/` | Default-deny authorization gateway and immutable append-only ledger that ledger-backed domains write verified events through. |
| `blinded-adjudication/` | Reviewer-blind adjudication comparing a baseline judgment with a policy-linked intervention without exposing candidate identity. |
| `claim-continuity/` | Tracks claim identity across loop iterations by matching, folding and replaying claim events into a disposable frontier projection. |
| `conditional-fanin/` | Decides when a fan-out wave has enough branch results to proceed and plans continuation for the branches left outstanding. |
| `contradiction-supersession/` | Isolated shadow ledger recording contradiction and supersession between claims, with an audited replay-verified status projection. |
| `council/` | Seat dispatch for the divergent pivot in `deep-loop/divergent-pivot.ts`. |
| `coverage-graph/` | Schema, queries and Bayesian signals for deep-loop convergence detection. |
| `cycle-detection/` | Detects unproductive repetition across iterations by comparing bounded state-signature history against a versioned policy. |
| `deep-loop/` | Atomic state, loop locking, JSONL repair and executor config for the deep-loop runtime backend, plus the write-containment guard. Containment preserves what it cannot attribute rather than undoing it, because on a shared checkout the writer is often another session. Restoring is opt-in per run. |
| `deep-research-authority/` | Resolves which writer may admit a canonical deep-research write by reading the durable per-mode authority record. |
| `deep-research-ledger-schema/` | Defines the durable event and ledger payload contract for the Deep Research runtime lane. |
| `deep-research-reducers/` | Folds verified Deep Research lane events into deterministic projection state. |
| `deep-research-sealed-artifacts/` | Materializes canonical sealed artifacts from Deep Research lane evidence. |
| `deep-review-ledger-schema/` | Defines the durable event and ledger payload contract for the Deep Review runtime lane. |
| `deep-review-reducers/` | Folds verified Deep Review lane events into deterministic projection state. |
| `deep-review-sealed-artifacts/` | Materializes canonical sealed artifacts from Deep Review lane evidence. |
| `dispatch-receipts/` | Records a durable integrity-checked receipt before a dispatch crosses the process-spawn boundary, so a resumed session recognizes an already-launched run. |
| `event-envelope/` | Foundational canonical-serialization and event-schema registry substrate underneath most domains, excluding `council/`, `coverage-graph/` and `write-set-conflict-graph/`. |
| `health-degeneration-harness/` | Turns normalized budget, cycle and coverage signals into a per-mode health state and a recommended response action. |
| `hierarchical-budgets/` | Reserves, settles and replays token, cost, iteration and wall-time budgets across a four-level scope hierarchy. |
| `legacy-projections/` | Folds verified ledger events into disposable legacy JSON or JSONL bytes so existing readers keep working during migration. |
| `locks-and-fencing/` | Grants leases with monotonic fence tokens and gates ledger and state writes behind them to prevent split-brain writers. |
| `mode-append-gateway/` | Resolves cutover binding and composes authority admission, transition authorization, fenced append and legacy projection into the single write path for deep-loop mode state. |
| `mode-contracts/` | Defines the contract shape and required substrate port types for a workflow mode (a pure type surface). |
| `next-focus/` | Derives, scores and durably records the next research or review focus region as a replayable ledger decision. |
| `partial-failure-policy/` | Decides whether a fan-out orchestration should abort, wait, proceed or proceed degraded when some branches fail. |
| `path-coverage-termination/` | Evaluates whether a workflow mode has covered its required region universe well enough to terminate. |
| `per-mode-authority-flip/` | Durable mode-keyed authority records with a lock-guarded compare-and-swap store, plus a pure selector that resolves one canonical writer route per mode. |
| `provenance-reduction/` | Reduces multiple fan-out candidate results into one source-balanced replay-verifiable outcome. |
| `receipts-and-effect-recovery/` | Certifies boundary receipts and recovers idempotently from side effects across mode and phase boundaries, verified by replay. |
| `replay-fingerprint/` | Derives and verifies a versioned canonical fingerprint that commits an authorized ledger replay to its projection output. |
| `result-envelopes/` | Records the durable outcome of a dispatched leaf task, including salvage and recovery evidence, as authorized ledger events. |
| `sealed-reference-artifacts/` | Content-addressed sealing, storage and lifecycle tracking for reference artifacts such as prompt sets, fixtures and configuration. |
| `semantic-communities/` | Groups semantically equivalent claims into namespaced communities through an incremental versioned projection. |
| `stopping-clocks/` | Arbitrates five independent loop-termination signals into one deterministic termination declaration. |
| `stream-fold-gauges/` | Deterministic replay-verifiable streaming metric folds computed from ledger events, compared against legacy dark-run values. |
| `transactional-projections/` | Applies verified ledger events into one atomic fenced multi-view projection bundle and publishes committed snapshot manifests. |
| `voc-allocation/` | Scores marginal value of computation for outstanding branches against budget pressure and plans a non-authoritative allocation. |
| `write-set-conflict-graph/` | Derives a deterministic conflict graph over declared shipped-mode resources, then schedules non-conflicting work into ordered lanes. |

---

## 4. RELATED RESOURCES

- Parent skill: [`../../SKILL.md`](../../SKILL.md)
- Per-domain READMEs: each domain folder listed above carries its own `README.md`.
- Tests: `../tests/`

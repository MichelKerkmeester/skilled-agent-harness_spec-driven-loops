---
title: "deep-loop-runtime: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review protocol, execution expectations, and per-feature validation files for the deep-loop-runtime skill."
---

# deep-loop-runtime: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against real files, scripts, and test fixtures. Use SKIP only when a concrete sandbox blocker prevents execution.

This document combines the operator-facing manual validation contract for the `deep-loop-runtime` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide while per-feature files carry scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--executor/`
- `02--prompt-rendering/`
- `03--validation/`
- `04--state-safety/`
- `05--scoring/`
- `06--coverage-graph/`
- `07--script-entry-points/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. EXECUTOR](#6--executor)
- [7. PROMPT RENDERING](#7--prompt-rendering)
- [8. VALIDATION](#8--validation)
- [9. STATE SAFETY](#9--state-safety)
- [10. SCORING](#10--scoring)
- [11. COVERAGE GRAPH](#11--coverage-graph)
- [12. SCRIPT ENTRY POINTS](#12--script-entry-points)
- [13. COUNCIL](#13--council)
- [14. AUTOMATED TEST CROSS-REFERENCE](#14--automated-test-cross-reference)
- [15. FEATURE CATALOG CROSS-REFERENCE INDEX](#15--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 22 deterministic scenarios across 8 categories validating the current `deep-loop-runtime` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.

### REALISTIC TEST MODEL

1. Start from a user-visible operator or workflow need.
2. Inspect public skill docs before lower-level runtime files when that order matters.
3. Execute the real script, test, or source-inspection command named in the scenario.
4. Capture enough evidence for another operator to reproduce the verdict.
5. Return PASS, PARTIAL, FAIL, or SKIP with rationale.

---

## 2. GLOBAL PRECONDITIONS

- `deep-loop-runtime` exists at `.opencode/skills/deep-loop-runtime/`.
- Runtime libraries exist under `lib/deep-loop/` and `lib/coverage-graph/`.
- Direct scripts exist under `scripts/` and emit JSON-only stdout.
- Runtime tests exist under `tests/{unit,integration,lifecycle}/`.
- Working directory is the repository root.
- Do not mutate sealed files while running manual validation.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Clear scenario verdict with reasoning.
- Command transcript or exact file excerpts.
- Exact prompt used when an AI orchestrator is part of the scenario.
- Output snippets proving JSON stdout shape, exit-code handling, or source anchors when relevant.
- Source path and test path evidence for every scenario.
- Triage notes for non-pass outcomes.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands are shown as `bash: <command>`.
- Script invocations use `node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs ...`.
- Source inspections use `rg` and `sed` from the repository root.
- Test invocations use the existing Vitest surface when available.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map in section 14
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

1. Preconditions were satisfied.
2. The exact command or source-inspection sequence was executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. The final outcome references the user-visible runtime behavior.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed
- `SKIP`: concrete sandbox blocker prevents execution and is documented

Release is `READY` only when all 17 scenarios are `PASS` or documented `SKIP` with no critical-path script, state-safety, or schema blocker.

---

## 6. EXECUTOR

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### DLR-001 | Executor config

#### Description
Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch.

#### Scenario Contract
Prompt: `Validate Executor config and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-001](01--executor/001-executor-config.md)

### DLR-002 | Executor audit

#### Description
Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

#### Scenario Contract
Prompt: `Validate Executor audit and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-002](01--executor/002-executor-audit.md)

### DLR-003 | Fallback router

#### Description
Chooses whether a failed model should fall back to a configured target or fail fast.

#### Scenario Contract
Prompt: `Validate Fallback router and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-003](01--executor/003-fallback-router.md)

---

## 7. PROMPT RENDERING

This category covers 1 scenario while the linked feature files remain the canonical execution contract.

### DLR-004 | Prompt pack

#### Description
Renders prompt-pack templates with checked placeholder variables.

#### Scenario Contract
Prompt: `Validate Prompt pack and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-004](02--prompt-rendering/004-prompt-pack.md)

---

## 8. VALIDATION

This category covers 1 scenario while the linked feature files remain the canonical execution contract.

### DLR-005 | Post-dispatch validate

#### Description
Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail.

#### Scenario Contract
Prompt: `Validate Post-dispatch validate and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-005](03--validation/005-post-dispatch-validate.md)

---

## 9. STATE SAFETY

This category covers 4 scenarios while the linked feature files remain the canonical execution contract.

### DLR-006 | Atomic state

#### Description
Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

#### Scenario Contract
Prompt: `Validate Atomic state and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-006](04--state-safety/006-atomic-state.md)

### DLR-007 | JSONL repair

#### Description
Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines.

#### Scenario Contract
Prompt: `Validate JSONL repair and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-007](04--state-safety/007-jsonl-repair.md)

### DLR-008 | Loop lock

#### Description
Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

#### Scenario Contract
Prompt: `Validate Loop lock and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-008](04--state-safety/008-loop-lock.md)

### DLR-009 | Permissions gate

#### Description
Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules.

#### Scenario Contract
Prompt: `Validate Permissions gate and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-009](04--state-safety/009-permissions-gate.md)

---

## 10. SCORING

This category covers 1 scenario while the linked feature files remain the canonical execution contract.

### DLR-010 | Bayesian scorer

#### Description
Scores executor reliability and decides when enough evidence supports demotion.

#### Scenario Contract
Prompt: `Validate Bayesian scorer and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-010](05--scoring/010-bayesian-scorer.md)

---

## 11. COVERAGE GRAPH

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### DLR-011 | Coverage graph DB

#### Description
Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle.

#### Scenario Contract
Prompt: `Validate Coverage graph DB and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.

#### Test Execution
> **Feature File:** [DLR-011](06--coverage-graph/011-coverage-graph-db.md)

### DLR-012 | Coverage graph query

#### Description
Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

#### Scenario Contract
Prompt: `Validate Coverage graph query and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.

#### Test Execution
> **Feature File:** [DLR-012](06--coverage-graph/012-coverage-graph-query.md)

### DLR-013 | Coverage graph signals

#### Description
Computes convergence signals, node centrality signals, snapshots, and momentum for research and review graphs.

#### Scenario Contract
Prompt: `Validate Coverage graph signals and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.

#### Test Execution
> **Feature File:** [DLR-013](06--coverage-graph/013-coverage-graph-signals.md)

---

## 12. SCRIPT ENTRY POINTS

This category covers 4 scenarios while the linked feature files remain the canonical execution contract.

### DLR-014 | convergence.cjs

#### Description
Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

#### Scenario Contract
Prompt: `Validate convergence.cjs and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-014](07--script-entry-points/014-convergence-script.md)

### DLR-015 | upsert.cjs

#### Description
Stores coverage graph nodes and edges from JSON arrays or iteration graph event files.

#### Scenario Contract
Prompt: `Validate upsert.cjs and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-015](07--script-entry-points/015-upsert-script.md)

### DLR-016 | query.cjs

#### Description
Reads session-scoped coverage graph views through a direct JSON stdout script interface.

#### Scenario Contract
Prompt: `Validate query.cjs and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-016](07--script-entry-points/016-query-script.md)

### DLR-017 | status.cjs

#### Description
Reports session-scoped coverage graph health, counts, schema version, and current signals.

#### Scenario Contract
Prompt: `Validate status.cjs and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-017](07--script-entry-points/017-status-script.md)

---

## 13. COUNCIL

Per packet 131/001/008 ADR-001 (Runtime Boundary Decision), `lib/council/` provides 5 durability primitives consumed by `deep-ai-council`. These scenarios validate the council surface.

### DLR-018 | Multi-seat dispatch

#### Description

Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts.

#### Test Execution
> **Feature File:** [DLR-018](08--council/018-multi-seat-dispatch.md)

### DLR-019 | Round-state JSONL

#### Description

Appends per-round JSONL records with a lock-file single-writer guard; repairs corrupt trailing JSONL before append; fsyncs writes; exposes round-state readers for resume.

#### Test Execution
> **Feature File:** [DLR-019](08--council/019-round-state-jsonl.md)

### DLR-020 | Adjudicator verdict scoring

#### Description

Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta.

#### Test Execution
> **Feature File:** [DLR-020](08--council/020-adjudicator-verdict-scoring.md)

### DLR-021 | Cost guards

#### Description

Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, max_topics_per_session, saturation_threshold, and seats_per_round; computes upper-bound seat-output budgets.

#### Test Execution
> **Feature File:** [DLR-021](08--council/021-cost-guards.md)

### DLR-022 | Session state hierarchy

#### Description

Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids.

#### Test Execution
> **Feature File:** [DLR-022](08--council/022-session-state-hierarchy.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

| Surface | Tests | Purpose |
|---|---|---|
| Executor | `tests/unit/executor-config.vitest.ts`, `tests/unit/executor-audit*.vitest.ts`, `tests/unit/fallback-router.vitest.ts`, `tests/unit/cli-matrix.vitest.ts` | Executor parsing, audit, fallback, and CLI dispatch behavior. |
| Prompt and validation | `tests/unit/prompt-pack.vitest.ts`, `tests/unit/post-dispatch-validate.vitest.ts`, `tests/integration/review-depth-validator.vitest.ts` | Prompt rendering and post-dispatch validation. |
| State safety | `tests/unit/atomic-state.vitest.ts`, `tests/unit/jsonl-repair.vitest.ts`, `tests/unit/loop-lock.vitest.ts`, `tests/unit/permissions-gate.vitest.ts` | Atomic writes, repair, locking, and permissions. |
| Coverage graph scripts | `tests/integration/{convergence,query,status,upsert}-script.vitest.ts`, `tests/lifecycle/db-open-close.vitest.ts` | Direct script behavior and DB lifecycle. |
| Review-depth integration | `tests/integration/review-depth-*.vitest.ts` | Review graph, convergence, and validator fixtures. |
| Council | `tests/council/{multi-seat-dispatch,round-state-jsonl,adjudicator-verdict-scoring,cost-guards,session-state-hierarchy}.vitest.ts` | Council durability primitives: parallel dispatch, JSONL append + repair, verdict-delta scoring, cost guards, state-hierarchy validation. |

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

| Scenario | Feature Catalog Entry | Scenario File |
|---|---|---|
| DLR-001 | [F001 Executor config](../feature_catalog/01--executor/01-executor-config.md) | [01--executor/001-executor-config.md](01--executor/001-executor-config.md) |
| DLR-002 | [F002 Executor audit](../feature_catalog/01--executor/02-executor-audit.md) | [01--executor/002-executor-audit.md](01--executor/002-executor-audit.md) |
| DLR-003 | [F003 Fallback router](../feature_catalog/01--executor/03-fallback-router.md) | [01--executor/003-fallback-router.md](01--executor/003-fallback-router.md) |
| DLR-004 | [F004 Prompt pack](../feature_catalog/02--prompt-rendering/01-prompt-pack.md) | [02--prompt-rendering/004-prompt-pack.md](02--prompt-rendering/004-prompt-pack.md) |
| DLR-005 | [F005 Post-dispatch validate](../feature_catalog/03--validation/01-post-dispatch-validate.md) | [03--validation/005-post-dispatch-validate.md](03--validation/005-post-dispatch-validate.md) |
| DLR-006 | [F006 Atomic state](../feature_catalog/04--state-safety/01-atomic-state.md) | [04--state-safety/006-atomic-state.md](04--state-safety/006-atomic-state.md) |
| DLR-007 | [F007 JSONL repair](../feature_catalog/04--state-safety/02-jsonl-repair.md) | [04--state-safety/007-jsonl-repair.md](04--state-safety/007-jsonl-repair.md) |
| DLR-008 | [F008 Loop lock](../feature_catalog/04--state-safety/03-loop-lock.md) | [04--state-safety/008-loop-lock.md](04--state-safety/008-loop-lock.md) |
| DLR-009 | [F009 Permissions gate](../feature_catalog/04--state-safety/04-permissions-gate.md) | [04--state-safety/009-permissions-gate.md](04--state-safety/009-permissions-gate.md) |
| DLR-010 | [F010 Bayesian scorer](../feature_catalog/05--scoring/01-bayesian-scorer.md) | [05--scoring/010-bayesian-scorer.md](05--scoring/010-bayesian-scorer.md) |
| DLR-011 | [F011 Coverage graph DB](../feature_catalog/06--coverage-graph/01-coverage-graph-db.md) | [06--coverage-graph/011-coverage-graph-db.md](06--coverage-graph/011-coverage-graph-db.md) |
| DLR-012 | [F012 Coverage graph query](../feature_catalog/06--coverage-graph/02-coverage-graph-query.md) | [06--coverage-graph/012-coverage-graph-query.md](06--coverage-graph/012-coverage-graph-query.md) |
| DLR-013 | [F013 Coverage graph signals](../feature_catalog/06--coverage-graph/03-coverage-graph-signals.md) | [06--coverage-graph/013-coverage-graph-signals.md](06--coverage-graph/013-coverage-graph-signals.md) |
| DLR-014 | [F014 convergence.cjs](../feature_catalog/07--script-entry-points/01-convergence-script.md) | [07--script-entry-points/014-convergence-script.md](07--script-entry-points/014-convergence-script.md) |
| DLR-015 | [F015 upsert.cjs](../feature_catalog/07--script-entry-points/02-upsert-script.md) | [07--script-entry-points/015-upsert-script.md](07--script-entry-points/015-upsert-script.md) |
| DLR-016 | [F016 query.cjs](../feature_catalog/07--script-entry-points/03-query-script.md) | [07--script-entry-points/016-query-script.md](07--script-entry-points/016-query-script.md) |
| DLR-017 | [F017 status.cjs](../feature_catalog/07--script-entry-points/04-status-script.md) | [07--script-entry-points/017-status-script.md](07--script-entry-points/017-status-script.md) |
| DLR-018 | [F018 Multi-seat dispatch](../feature_catalog/08--council/01-multi-seat-dispatch.md) | [08--council/018-multi-seat-dispatch.md](08--council/018-multi-seat-dispatch.md) |
| DLR-019 | [F019 Round-state JSONL](../feature_catalog/08--council/02-round-state-jsonl.md) | [08--council/019-round-state-jsonl.md](08--council/019-round-state-jsonl.md) |
| DLR-020 | [F020 Adjudicator verdict scoring](../feature_catalog/08--council/03-adjudicator-verdict-scoring.md) | [08--council/020-adjudicator-verdict-scoring.md](08--council/020-adjudicator-verdict-scoring.md) |
| DLR-021 | [F021 Cost guards](../feature_catalog/08--council/04-cost-guards.md) | [08--council/021-cost-guards.md](08--council/021-cost-guards.md) |
| DLR-022 | [F022 Session state hierarchy](../feature_catalog/08--council/05-session-state-hierarchy.md) | [08--council/022-session-state-hierarchy.md](08--council/022-session-state-hierarchy.md) |


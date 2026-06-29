---
title: "CG-004 -- Code-Graph Coverage Seed Bridge"
description: "Verify that deep-context seeds coverage-graph nodes from frontier/code-graph evidence with seed_source and seed_confidence metadata before the first convergence check."
version: 1.2.0.1
---

# CG-004 -- Code-Graph Coverage Seed Bridge

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CG-004`.

---

## 1. OVERVIEW

This scenario validates the code-graph to coverage-graph seed bridge for `deep-context`. It focuses on the auto YAML binding seed source/confidence before calling `upsert.cjs`, the upsert script requiring seed metadata on seed paths, and the coverage graph database storing `seed_source` and `seed_confidence` on nodes.

### Why This Matters

Without seeding, the first convergence check sees an empty coverage graph and cannot distinguish "not enough explored yet" from "nothing to explore." Seed metadata also lets operators separate code-graph/fallback frontier nodes from organically discovered nodes later in the loop.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `deep_context_auto.yaml` calls `upsert.cjs` with `--seed-source` and `--seed-confidence`, `upsert.cjs` rejects incomplete seed metadata, and `coverage-graph-db.ts` stores/returns `seed_source` and `seed_confidence`.
- Real user request: `Verify that deep-context initializes its coverage graph from the code-graph frontier before convergence starts.`
- Prompt: `As a manual-testing orchestrator, validate the deep-context code-graph to coverage-graph seed bridge against deep_context_auto.yaml, upsert.cjs, and coverage-graph-db.ts. Return a concise verdict.`
- Expected execution process: Inspect the auto YAML seed step, inspect upsert argument validation, inspect DB schema/migration/upsert/readback fields, and check automated test anchors for seed behavior.
- Expected signals: YAML binds `coverage_seed_source` and `coverage_seed_confidence`; context uses 0.55 for code-graph and 0.35 for fallback seeds; upsert requires both seed fields and validates 0..1 confidence; DB schema/migration includes `seed_source` and `seed_confidence`; tests cover seed metadata.
- Desired user-visible outcome: A context run starts convergence with seeded graph context when frontier data exists, and seeded nodes remain auditable by source and confidence.
- Pass/fail: PASS if YAML, CLI, DB, and tests all show the seed bridge. FAIL if seed metadata is optional on seed paths or no DB fields exist.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Inspect the workflow before the runtime internals.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-004 | Code-Graph Coverage Seed Bridge | Verify context seed source/confidence wiring and DB persistence | `Verify that deep-context initializes its coverage graph from the code-graph frontier before convergence starts.` | 1. `rg 'coverage_seed_source|coverage_seed_confidence|--seed-source|--seed-confidence|0\.55|0\.35' .opencode/commands/deep/assets/deep_context_auto.yaml` -> 2. `rg 'seedSource and seedConfidence are required|seedConfidence must be a number between 0 and 1|seedSource must be a non-empty string|--seed-source|--seed-confidence' .opencode/skills/deep-loop-runtime/scripts/upsert.cjs` -> 3. `rg 'seed_source|seed_confidence|seedSource|seedConfidence|normalizeSeed' .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 4. `rg 'seedSource|seedConfidence|zero nodes|scope_discovery|code_graph' .opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts .opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-db.vitest.ts` | Step 1: YAML seed wiring and confidence defaults found; Step 2: upsert validation found; Step 3: DB schema/readback/upsert seed fields found; Step 4: tests cover metadata and warning paths | Grep outputs from all four commands | PASS if all commands return expected seed bridge anchors; FAIL if seed metadata can be partial, DB fields are missing, or YAML does not seed before convergence | 1. If the workflow path moves, search `rg 'coverage_seed_source|--seed-source' .opencode/commands/deep/assets`. 2. If tests move, search the runtime tests for `seedConfidence`. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--coverage-graph-schema/code-graph-coverage-seed-bridge.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Context seed workflow and source/confidence binding |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Seed CLI validation and metadata forwarding |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Seed metadata schema, validation, migration, and readback |
| `.opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts` | Upsert CLI seed validation coverage |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-db.vitest.ts` | DB seed persistence and warning coverage |

---

## 5. SOURCE METADATA

- Group: Coverage Graph Schema
- Playbook ID: CG-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--coverage-graph-schema/code-graph-coverage-seed-bridge.md`

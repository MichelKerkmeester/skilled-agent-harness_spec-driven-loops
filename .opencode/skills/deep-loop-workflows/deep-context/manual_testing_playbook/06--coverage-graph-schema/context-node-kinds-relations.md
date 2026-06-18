---
title: "CG-002 -- Context Node Kinds and Relations"
description: "This scenario validates Context Node Kinds and Relations for `CG-002`. It focuses on the semantic alignment between `ContextNodeKind` values in the DB schema, their usage in `loop_protocol.md`, and their resolution in `convergence.md`."
---

# CG-002 -- Context Node Kinds and Relations

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CG-002`.

---

## 1. OVERVIEW

This scenario validates Context Node Kinds and Relations for `CG-002`. It focuses on verifying that the 8 `ContextNodeKind` values (`SLICE`, `FILE`, `SYMBOL`, `PATTERN`, `REUSE_CANDIDATE`, `DEPENDENCY`, `CONSTRAINT`, `GAP`) defined in `coverage-graph-db.ts` appear consistently in the merge rules described in `loop_protocol.md` §6 and the convergence conditions in `convergence.md`, and that the 11 `ContextRelation` values (`CONTAINS`, `REFERENCES`, `EXTENDS`, `COMPOSES`, `WRAPS`, `IMPORTS`, `CONSTRAINS`, `GAPS`, `REUSES`, `DEPENDS_ON`, `CONTRADICTS`) are semantically coherent across those three documents.

### Why This Matters

The 8 kinds and 11 relations form the type system that every executor seat writes into its seat artifact JSON and that `reduce-state.cjs` reads back via `KIND_TO_BUCKET`. A kind declared in the DB but absent from `loop_protocol.md` will never be merged; a relation absent from `convergence.md` will never contribute to convergence signals. Cross-document alignment prevents dark data — findings correctly persisted in the graph but invisible to the reducer and the report.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify the 8 `ContextNodeKind` and 11 `ContextRelation` values appear consistently across `coverage-graph-db.ts`, `loop_protocol.md`, and `convergence.md`.
- Real user request: `Verify that all deep-context node kinds and relations are consistently defined across the schema, protocol, and convergence reference docs.`
- Prompt: `As a manual-testing orchestrator, validate the context node kinds and relations contract for deep-context across coverage-graph-db.ts, loop_protocol.md §6, and convergence.md. Verify all 8 ContextNodeKind values (SLICE, FILE, SYMBOL, PATTERN, REUSE_CANDIDATE, DEPENDENCY, CONSTRAINT, GAP) appear in the merge rules; the REUSES relation drives the reuseCatalogCoverage signal; CONTRADICTS relation drives detectContradictions in reduce-state.cjs. Return a concise verdict.`
- Expected execution process: Grep `coverage-graph-db.ts` for all 8 kind names and 11 relation names; grep `loop_protocol.md` for kind-to-bucket or merge-rule references; grep `convergence.md` for relation-to-signal mapping; verify `REUSES` and `CONTRADICTS` appear in both the DB and the reducer.
- Expected signals: All 8 kind names found in `coverage-graph-db.ts`; `REUSE_CANDIDATE` and `GAP` appear in `loop_protocol.md` §6 merge rules; `REUSES` relation appears in `convergence.md` under `reuseCatalogCoverage`; `CONTRADICTS` appears in both DB and `reduce-state.cjs`.
- Desired user-visible outcome: An executor seat writing `kind: REUSE_CANDIDATE` and `relation: REUSES` will be correctly merged by the host, contribute to `reuseCatalogCoverage`, and appear in the REUSE catalog section of the Context Report.
- Pass/fail: PASS if all 8 kinds are in the DB and `REUSE_CANDIDATE` / `CONTRADICTS` appear in both the protocol and the reducer; FAIL if any kind or critical relation is missing from any document.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep all three reference documents.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-002 | Context Node Kinds and Relations | Verify 8 kinds and 11 relations are consistent across DB, protocol, and convergence docs | `Verify that all deep-context node kinds and relations are consistently defined across the schema, protocol, and convergence reference docs.` | 1. `rg "SLICE\|FILE\|SYMBOL\|PATTERN\|REUSE_CANDIDATE\|DEPENDENCY\|CONSTRAINT\|GAP" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 2. `rg "CONTAINS\|REFERENCES\|EXTENDS\|COMPOSES\|WRAPS\|IMPORTS\|CONSTRAINS\|GAPS\|REUSES\|DEPENDS_ON\|CONTRADICTS" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 3. `rg "REUSE_CANDIDATE\|DEPENDENCY\|GAP\|merge.*kind\|kind.*bucket" .opencode/skills/deep-loop-workflows/deep-context/references/state/state_reducer_registry.md` -> 4. `rg "REUSES\|CONTRADICTS\|reuseCatalogCoverage\|contradiction" .opencode/skills/deep-loop-workflows/deep-context/references/convergence/convergence_signals.md .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Step 1: all 8 kind names found; Step 2: all 11 relation names found; Step 3: the kind-to-bucket merge mapping is found; Step 4: REUSES drives reuseCatalogCoverage; CONTRADICTS appears in reducer | Grep outputs from all four commands | PASS if steps 1-4 all return expected values; FAIL if any kind or relation is missing from any document | 1. Open `coverage-graph-db.ts` to count `ContextNodeKind` and `ContextRelation` values manually. 2. Read `state_reducer_registry.md` for the `KIND_TO_BUCKET` mapping. 3. Search `convergence.md` for the reuseCatalogCoverage signal definition. 4. Grep `reduce-state.cjs` for the `KIND_TO_BUCKET` object to verify all 5 kind-to-bucket assignments. |

### Optional Supplemental Checks

Verify the `KIND_TO_BUCKET` in `reduce-state.cjs` covers the five kinds that reduce to named buckets (the other three kinds fall through to `lowConfidence`):

```bash
rg "KIND_TO_BUCKET\|reuse_candidate\|integration_point\|convention\|dependency\|gap" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs
```

Verify that `CONTRADICTS` edges are the only ones that trigger `detectContradictions`:

```bash
rg "CONTRADICTS\|detectContradictions\|contradiction" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--coverage-graph-schema/context-node-kinds-relations.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | `ContextNodeKind` (8 values), `ContextRelation` (11 values), `VALID_KINDS.context`, `VALID_RELATIONS.context` |
| `.opencode/skills/deep-loop-workflows/deep-context/references/protocol/loop_protocol.md` | §6: Merge rules referencing kind-to-bucket assignments |
| `.opencode/skills/deep-loop-workflows/deep-context/references/convergence/convergence_signals.md` | Signal definitions cross-referencing relation semantics |
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | `KIND_TO_BUCKET` (5 entries), `detectContradictions` (CONTRADICTS relation) |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | `computeContextSignalsFromData`: uses kind/relation counts for signal computation |

---

## 5. SOURCE METADATA

- Group: Coverage Graph Schema
- Playbook ID: CG-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--coverage-graph-schema/context-node-kinds-relations.md`

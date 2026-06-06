---
title: "CG-001 -- Loop Type: Context Schema"
description: "This scenario validates the Loop Type Context Schema for `CG-001`. It focuses on `LoopType` including `'context'`, `VALID_KINDS.context` having 8 entries, `VALID_RELATIONS.context` having 11 entries, and `CONTEXT_WEIGHTS.REUSES=1.5` being the highest weight."
---

# CG-001 -- Loop Type: Context Schema

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CG-001`.

---

## 1. OVERVIEW

This scenario validates the Loop Type Context Schema for `CG-001`. It focuses on `coverage-graph-db.ts` defining `LoopType = 'research' | 'review' | 'context'` with `'context'` as a valid member, `VALID_KINDS.context` containing all 8 `ContextNodeKind` values (`SLICE`, `FILE`, `SYMBOL`, `PATTERN`, `REUSE_CANDIDATE`, `DEPENDENCY`, `CONSTRAINT`, `GAP`), `VALID_RELATIONS.context` containing all 11 `ContextRelation` values, and `CONTEXT_WEIGHTS.REUSES = 1.5` being the highest weight in the schema. `SCHEMA_VERSION = 3` and WAL journaling are also verified.

### Why This Matters

`coverage-graph-db.ts` is the canonical source-of-truth for what data shapes the deep-context loop can persist. Any mismatch between the declared kinds/relations and what `reduce-state.cjs` or `coverage-graph-signals.ts` expect causes silent data loss: findings of unknown kinds fall through bucket assignment and are never surfaced in the Context Report. Verifying the full schema in isolation prevents divergence from being discovered only after a completed production run produces an empty REUSE catalog.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `LoopType` includes `'context'`, `VALID_KINDS.context` has 8 kinds, `VALID_RELATIONS.context` has 11 relations, and `CONTEXT_WEIGHTS.REUSES = 1.5` is the highest weight.
- Real user request: `Verify that the coverage-graph schema correctly declares the context loop type with all its node kinds, relations, and weights.`
- Prompt: `As a manual-testing orchestrator, validate the coverage-graph schema contract for deep-context against coverage-graph-db.ts. Verify LoopType includes 'context'; VALID_KINDS.context has 8 entries (SLICE, FILE, SYMBOL, PATTERN, REUSE_CANDIDATE, DEPENDENCY, CONSTRAINT, GAP); VALID_RELATIONS.context has 11 entries; CONTEXT_WEIGHTS.REUSES = 1.5 is the highest weight; SCHEMA_VERSION = 3; WAL journaling is enabled. Return a concise verdict.`
- Expected execution process: Read `coverage-graph-db.ts` for the `LoopType` union; grep `VALID_KINDS.context` for 8 kind entries; grep `VALID_RELATIONS.context` for 11 relation entries; check `CONTEXT_WEIGHTS` for `REUSES = 1.5`; grep `SCHEMA_VERSION` for value 3; grep for WAL pragma.
- Expected signals: `LoopType` includes `'context'`; `VALID_KINDS.context` lists all 8 `ContextNodeKind` values; `VALID_RELATIONS.context` lists all 11 `ContextRelation` values; `CONTEXT_WEIGHTS.REUSES = 1.5`; `SCHEMA_VERSION = 3`; `WAL` or `journal_mode = WAL` appears in schema setup.
- Desired user-visible outcome: The coverage-graph schema fully supports the context loop type and all its finding kinds, ensuring no findings are silently dropped during persistence or graph traversal.
- Pass/fail: PASS if all six checks return the expected values; FAIL if any LoopType, kind, relation, weight, or version value is incorrect.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep the schema file for each expected value.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-001 | Loop Type: Context Schema | Verify LoopType, VALID_KINDS, VALID_RELATIONS, CONTEXT_WEIGHTS, and SCHEMA_VERSION | `Verify that the coverage-graph schema correctly declares the context loop type with all its node kinds, relations, and weights.` | 1. `rg "LoopType\|'context'\|\"context\"" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 2. `rg "VALID_KINDS\|ContextNodeKind\|SLICE\|FILE\|SYMBOL\|PATTERN\|REUSE_CANDIDATE\|DEPENDENCY\|CONSTRAINT\|GAP" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 3. `rg "VALID_RELATIONS\|ContextRelation" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 4. `rg "CONTEXT_WEIGHTS\|REUSES.*1\.5\|1\.5.*REUSES" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 5. `rg "SCHEMA_VERSION\|journal_mode.*WAL\|WAL" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Step 1: 'context' found in LoopType union; Step 2: all 8 kind names found; Step 3: VALID_RELATIONS.context found; Step 4: REUSES = 1.5 found; Step 5: SCHEMA_VERSION = 3 and WAL found | Grep outputs from all five commands | PASS if steps 1-5 all return expected values; FAIL if any kind, relation, weight, or version is incorrect | 1. Open `coverage-graph-db.ts` and count VALID_KINDS.context entries manually. 2. Verify the LoopType union is a TypeScript string literal union (not an enum). 3. Check CONTEXT_WEIGHTS object to confirm no other weight exceeds 1.5. 4. Search for `PRAGMA journal_mode` to confirm WAL pragma placement in schema init. |

### Optional Supplemental Checks

Verify the `CONTEXT_WEIGHTS` object has no weight exceeding `REUSES = 1.5`:

```bash
rg "CONTEXT_WEIGHTS" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts
```

Verify `upsertNode` and `upsertEdge` are exported for use by the loop host:

```bash
rg "export.*upsertNode\|export.*upsertEdge\|export.*batchUpsert" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--coverage-graph-schema/loop-type-context-schema.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | `LoopType`, `ContextNodeKind`, `ContextRelation`, `VALID_KINDS.context`, `VALID_RELATIONS.context`, `CONTEXT_WEIGHTS`, `SCHEMA_VERSION`, WAL |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Consumes `ContextNodeKind` and `ContextRelation` values from the schema |
| `.opencode/skills/deep-context/scripts/reduce-state.cjs` | `KIND_TO_BUCKET` must align with `VALID_KINDS.context` entries |

---

## 5. SOURCE METADATA

- Group: Coverage Graph Schema
- Playbook ID: CG-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--coverage-graph-schema/loop-type-context-schema.md`

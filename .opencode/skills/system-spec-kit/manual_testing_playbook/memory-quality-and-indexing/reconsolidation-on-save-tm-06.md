---
title: "044 -- Reconsolidation-on-save (TM-06)"
description: "This scenario validates Reconsolidation-on-save (TM-06) for `044`. It focuses on Confirm merge/deprecate thresholds."
audited_post_018: true
version: 3.6.0.19
---

# 044 -- Reconsolidation-on-save (TM-06)

## 1. OVERVIEW

This scenario validates Reconsolidation-on-save (TM-06) for `044`. It focuses on confirming merge/deprecate thresholds plus the stale-predecessor and BM25-repair safety paths.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm merge/deprecate thresholds plus stale-merge abort and BM25 repair-flag persistence.
- Real user request: `` Please validate Reconsolidation-on-save (TM-06) against the documented validation surface and tell me whether the expected signals are present: Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; stale predecessor changes abort merge instead of archiving/inserting; BM25 repair failure leaves merged lineage committed and sets `bm25_repair_needed=1`. ``
- Prompt: `Validate reconsolidation-on-save thresholds and repair debt.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; stale predecessor changes abort merge instead of archiving/inserting; BM25 repair failure leaves merged lineage committed and sets `bm25_repair_needed=1`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Threshold behavior is correct, stale predecessor writes return `predecessor_changed` or `predecessor_gone` without destructive merge side effects, and failed BM25 repair persists `bm25_repair_needed=1`; FAIL: Wrong threshold action, stale merge still commits, or BM25 repair debt is not recorded

---

## 3. TEST EXECUTION

### Prompt

```
Validate reconsolidation-on-save thresholds and repair debt.
```

### Commands

1. Save near neighbors
2. verify >=0.88 merge
3. verify 0.75-0.88 supersede

### Expected

Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output

### Evidence

BLOCKED: No save output with similarity scores was produced. The repository's Vitest discovery did not load the documented reconsolidation test file because the configured include pattern excludes `*.vitest.ts` files.

Command run for threshold verification:

```bash
npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t "Action Determination|Constants|RO1|RO2|RO3"
```

Actual output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

No test files found, exiting with code 1

filter: .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

### Pass / Fail

- **BLOCKED**: Threshold behavior could not be verified because the documented reconsolidation test file was not discovered by Vitest in the current repo configuration.

### Failure Triage

Verify similarity computation → Check threshold configuration → Inspect merge vs supersede logic

---

### Prompt

```
Validate stale predecessor aborts during reconsolidation.
```

### Commands

1. Seed a merge-eligible predecessor with known `content_hash` and `updated_at`
2. start merge with async embedding generation
3. mutate, archive, or delete the predecessor before the transaction body resumes
4. verify complement-style abort with `predecessor_changed` or `predecessor_gone`
5. verify no merged row was inserted and predecessor lineage stayed intact
6. `npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t \"Aborts merge when predecessor changes during embedding generation\"`

### Expected

Merge returns `action: complement` with `status: predecessor_changed` or `status: predecessor_gone`; no stale merged row is inserted; predecessor row reflects only the concurrent writer change

### Evidence

BLOCKED: The targeted command from the playbook did not execute any test, so no `memory_index` row dump or stale-predecessor assertion evidence was produced.

Command run exactly as documented:

```bash
npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t "Aborts merge when predecessor changes during embedding generation"
```

Actual output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

No test files found, exiting with code 1

filter: .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

### Pass / Fail

- **BLOCKED**: Stale predecessor behavior could not be verified because the documented targeted test command found no test files.

### Failure Triage

Verify predecessor snapshot capture (`content_hash`, `updated_at`) → Check in-transaction reload → Inspect `hasPredecessorChanged()` branch → Confirm archive/delete handling

---

### Prompt

```
Validate BM25 repair debt persists after a failed post-commit repair.
```

### Commands

1. Seed a merge-eligible predecessor with BM25 enabled
2. force the initial BM25 update and repair retry to fail after the merge commit
3. verify the merged row is still inserted and predecessor archived
4. query `memory_index` for `bm25_repair_needed` on the merged row
5. verify warning text names the failed repair
6. `npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t \"Persists bm25_repair_needed after BM25 repair fails post-merge\"`

### Expected

Merge commits, warning is emitted, and the merged row persists `bm25_repair_needed=1`; predecessor is archived and lineage remains committed

### Evidence

BLOCKED: The targeted command from the playbook did not execute any test, so no SQL evidence for `bm25_repair_needed=1` or warning text was produced.

Command run exactly as documented:

```bash
npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t "Persists bm25_repair_needed after BM25 repair fails post-merge"
```

Actual output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

No test files found, exiting with code 1

filter: .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

### Pass / Fail

- **BLOCKED**: BM25 repair-debt behavior could not be verified because the documented targeted test command found no test files.

### Failure Triage

Verify BM25 error path after commit → Check `setBm25RepairNeededFlag()` execution → Confirm merged row ID is updated instead of predecessor row

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory-quality-and-indexing/reconsolidation-on-save.md](../../feature_catalog/memory-quality-and-indexing/reconsolidation-on-save.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 044
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory-quality-and-indexing/reconsolidation-on-save-tm-06.md`

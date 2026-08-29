---
title: "044 -- Reconsolidation-on-save (TM-06)"
description: "This scenario validates Reconsolidation-on-save (TM-06) for `044`. It focuses on Confirm merge/deprecate thresholds."
audited_post_018: true
version: 3.6.0.19
id: memory-quality-and-indexing-reconsolidation-on-save-tm-06
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Threshold behavior is correct, stale predecessor writes return `predecessor_changed` or `predecessor_gone` without destructive merge side effects, and failed BM25 repair persists `bm25_repair_needed=1`.
- **Fail**: Wrong threshold action, stale merge still commits, or BM25 repair debt is not recorded.

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
6. `npx vitest run .opencode/skills/system-spec-kit/mcp-server/tests/reconsolidation.vitest.ts -t \"Aborts merge when predecessor changes during embedding generation\"`

### Expected

Merge returns `action: complement` with `status: predecessor_changed` or `status: predecessor_gone`; no stale merged row is inserted; predecessor row reflects only the concurrent writer change

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each signal named in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: every signal named in the Expected block above is present in the captured output.
- **Fail**: any signal named in the Expected block is absent, or a command in the sequence errors unexpectedly.

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
6. `npx vitest run .opencode/skills/system-spec-kit/mcp-server/tests/reconsolidation.vitest.ts -t \"Persists bm25_repair_needed after BM25 repair fails post-merge\"`

### Expected

Merge commits, warning is emitted, and the merged row persists `bm25_repair_needed=1`; predecessor is archived and lineage remains committed

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each signal named in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: every signal named in the Expected block above is present in the captured output.
- **Fail**: any signal named in the Expected block is absent, or a command in the sequence errors unexpectedly.

### Failure Triage

Verify BM25 error path after commit → Check `setBm25RepairNeededFlag()` execution → Confirm merged row ID is updated instead of predecessor row

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/reconsolidation-on-save.md](../../feature-catalog/memory-quality-and-indexing/reconsolidation-on-save.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 044
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/reconsolidation-on-save-tm-06.md`

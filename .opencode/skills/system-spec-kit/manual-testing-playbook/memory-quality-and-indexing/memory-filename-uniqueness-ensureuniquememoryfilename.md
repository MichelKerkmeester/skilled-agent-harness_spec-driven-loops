---
title: "119 -- Memory filename uniqueness (ensureUniqueMemoryFilename)"
description: "This scenario validates Memory filename uniqueness (ensureUniqueMemoryFilename) for `119`. It focuses on Confirm collision resolution."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-memory-filename-uniqueness-ensureuniquememoryfilename
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 119 -- Memory filename uniqueness (ensureUniqueMemoryFilename)

## 1. OVERVIEW

This scenario validates Memory filename uniqueness (ensureUniqueMemoryFilename) for `119`. It focuses on Confirm collision resolution.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm collision resolution.
- Real user request: `` Please validate Memory filename uniqueness (ensureUniqueMemoryFilename) against -1 and tell me whether the expected signals are present: Second save produces filename with `-1` suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence) | 0` coercion; and `memoryNameHistory` is updated. ``
- Prompt: `Validate memory filename uniqueness and collision fallback behavior.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Second save produces filename with `-1` suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence) | 0` coercion; and `memoryNameHistory` is updated
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: Second save produces filename with -1 suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence)

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory filename uniqueness and collision fallback behavior.
```

### Commands

1. Save memory to a folder
2. Save again with same slug within same minute
3. Verify two distinct filenames (second has -1 suffix)
4. Exhaust `-1` through `-100` collisions and save again
5. Persist the first random fallback filename, repeat the save, and verify a second distinct random fallback is reserved
6. Verify fallback filename uses `crypto.randomBytes(6).toString('hex')` suffix shape, not SHA1
7. Verify `description.json` increments `memorySequence` via `Number(existing.memorySequence) | 0` before incrementing
8. Verify `memoryNameHistory` updated

### Expected

Second save produces filename with `-1` suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence) | 0` coercion; and `memoryNameHistory` is updated.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Second save produces filename with -1 suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence).
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect the `ensureUniqueMemoryFilename` path, the random-fallback suffix generation, and the `description.json` update flow if collision handling regresses.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/spec-folder-description-discovery.md](../../feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 119
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/memory-filename-uniqueness-ensureuniquememoryfilename.md`

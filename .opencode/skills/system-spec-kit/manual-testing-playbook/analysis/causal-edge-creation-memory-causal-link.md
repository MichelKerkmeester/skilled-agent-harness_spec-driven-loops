---
title: "EX-019 -- Causal edge creation (memory_causal_link)"
description: "This scenario validates Causal edge creation (memory_causal_link) for `EX-019`. It focuses on Causal provenance linking."
audited_post_018: true
version: 3.6.0.17
id: analysis-causal-edge-creation-memory-causal-link
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# EX-019 -- Causal edge creation (memory_causal_link)

## 1. OVERVIEW

This scenario validates Causal edge creation (memory_causal_link) for `EX-019`. It focuses on Causal provenance linking plus exact-first batch reference resolution.

---

## 2. SCENARIO CONTRACT


- Objective: Causal provenance linking plus exact-first batch reference resolution.
- Real user request: `Please validate Causal edge creation (memory_causal_link) against memory_causal_link({ sourceId:"<memory-id-a>", targetId:"<memory-id-b>", relation:"supports", strength:0.8 }) and tell me whether the expected signals are present: Direct edge appears in chain trace; batched causal-link reference resolution succeeds for exact path matches first; fuzzy fallback is only used for unresolved references.`
- Prompt: `Validate memory_causal_link causal provenance and exact-first batch reference resolution; return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Direct edge appears in chain trace; batched causal-link reference resolution succeeds for exact path matches first; fuzzy fallback is only used for unresolved references
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the direct relation is visible in trace and the batch resolver proves exact canonical/file-path lookup wins before fuzzy fallback. FAIL if the trace is missing, references are resolved one-by-one without batching, or fuzzy matching is used before exact path equality.

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_causal_link causal provenance and exact-first batch reference resolution; return pass/fail with cited evidence.
```

### Commands

1. Create a direct edge with `memory_causal_link({ sourceId:"<memory-id-a>", targetId:"<memory-id-b>", relation:"supports", strength:0.8 })`
2. Confirm the edge is visible via `memory_drift_why({ memoryId:"<memory-id-b>", direction:"both", maxDepth:4 })`
3. Prepare or update a spec-doc record file containing multiple causal-link references, including exact canonical/file-path references and one fallback-only fuzzy reference, then run the indexing path that triggers `processCausalLinks()`
4. Capture processor logs, diagnostics, or test-harness evidence showing `resolveMemoryReferencesBatch()` resolves the reference set once, exact `canonical_file_path`/`file_path` equality is attempted before fuzzy `LIKE`, and only unresolved references fall through to the fuzzy pass
5. Verify the inserted auto-extracted edges appear in causal trace output or storage inspection

### Expected

Direct edge appears in chain trace; batched causal-link reference resolution succeeds for exact path matches first; fuzzy fallback is only used for unresolved references

### Evidence

Link + trace outputs + indexing/processor diagnostics showing batched exact-first resolution + evidence of fallback only for unresolved references

### Pass / Fail

- **Pass**: the direct relation is visible in trace and the batch resolver proves exact canonical/file-path lookup wins before fuzzy fallback
- **Fail**: the trace is missing, references are resolved one-by-one without batching, or fuzzy matching is used before exact path equality.

### Failure Triage

Validate IDs and relation type -> normalize path references before indexing -> inspect `canonical_file_path` presence in `memory_index` -> confirm only unresolved references reach the fuzzy fallback stage

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [analysis/causal-edge-creation-memorycausallink.md](../../feature-catalog/analysis/causal-edge-creation-memorycausallink.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `analysis/causal-edge-creation-memory-causal-link.md`

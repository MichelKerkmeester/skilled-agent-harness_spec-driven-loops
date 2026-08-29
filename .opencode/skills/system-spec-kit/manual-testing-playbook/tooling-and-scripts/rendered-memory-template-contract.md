---
title: "149 -- Rendered spec-doc record template contract"
description: "This scenario validates Rendered spec-doc record template contract for `149`. It focuses on Confirm malformed rendered spec-doc records fail before write/index and active corpus stays structurally clean."
version: 3.6.0.16
id: tooling-and-scripts-rendered-memory-template-contract
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 149 -- Rendered spec-doc record template contract

## 1. OVERVIEW

This scenario validates Rendered spec-doc record template contract for `149`. It focuses on Confirm malformed rendered spec-doc records fail before write/index and active corpus stays structurally clean.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm malformed rendered spec-doc records fail before write/index and active corpus stays structurally clean.
- Real user request: `Please validate Rendered spec-doc record template contract against memory_save({ filePath:"<sandbox-file>", dryRun:true }) and tell me whether the expected signals are present: Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean.`
- Prompt: `Validate Rendered spec-doc record template contract against memory_save({ filePath:"<sandbox-file>", dryRun:true }) and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if malformed files are rejected before write/index and valid rendered output remains validator-clean

---

## 3. TEST EXECUTION

### Prompt

```
Validate Rendered spec-doc record template contract against memory_save({ filePath:"<sandbox-file>", dryRun:true }) and report cited pass/fail evidence.
```

### Commands

1. Create a sandbox memory missing mandatory anchors or required frontmatter keys
2. `memory_save({ filePath:"<sandbox-file>", dryRun:true })` and verify contract-violation details
3. `memory_save({ filePath:"<sandbox-file>", force:true })` and verify rejection before indexing
4. Run `generate-context.js` with a valid rich JSON payload and verify the rendered output remains validator-clean

### Expected

Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Malformed files are rejected before write/index and valid rendered output remains validator-clean.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect `shared/parsing/memory-template-contract.ts`, `scripts/core/workflow.ts`, and `mcp-server/handlers/memory-save.ts`

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/session-capturing-pipeline-quality.md](../../feature-catalog/tooling-and-scripts/session-capturing-pipeline-quality.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 149
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/rendered-memory-template-contract.md`

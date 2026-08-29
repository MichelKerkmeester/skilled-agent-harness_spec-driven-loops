---
title: "282 -- Embedder set dry-run and validation"
description: "Validates embedder_set dry-run planning and invalid-name error handling without starting a reindex."
audited_post_017: true
version: 3.6.0.1
id: tooling-and-scripts-embedder-set-dry-run-and-validation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 282 -- Embedder set dry-run and validation

## 1. OVERVIEW

This scenario gives embedder_set deterministic coverage without triggering a real 15-minute corpus reindex.

---

## 2. SCENARIO CONTRACT

- Objective: Validate embedder_set dry-run happy path and invalid embedder edge case.
- Real user request: `Dry-run an embedder switch and prove invalid embedder names fail cleanly.`
- Operator prompt: `Run embedder_set in dry-run mode for a known embedder and then with an invalid name; verify plan and error shape.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Dry-run returns a plan and does not start a job. - Invalid name returns a structured validation error. - Active embedder from `embedder_status({})` is unchanged after both calls.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

---

## 3. TEST EXECUTION

### Prompt

```
Run embedder_set in dry-run mode for a known embedder and then with an invalid name; verify plan and error shape.
```

### Commands

1. `embedder_set({ name: "nomic-embed-text-v1.5", dryRun: true })`
2. Confirm the response reports planned table/dimension/reindex action without changing the active pointer.
3. `embedder_set({ name: "definitely-not-a-real-embedder", dryRun: true })`
4. Confirm the error names valid choices or recovery guidance.

### Expected Output / Verification

- Dry-run returns a plan and does not start a job.
- Invalid name returns a structured validation error.
- Active embedder from `embedder_status({})` is unchanged after both calls.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the handler or script listed in section 4 is the one actually loaded, and that any compiled output under `dist/` is current for it.
3. Compare the observed response field by field against the Expected block, and quote the first field that disagrees.


### Pass / Fail

- **Pass**: Every expected signal in the Scenario Contract is present in the captured output.
- **Fail**: The tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- `.opencode/skills/system-spec-kit/mcp-server/handlers/embedder-set.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/embedder-status.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 282
- Tools: `embedder_set`, `embedder_status`

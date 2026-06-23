---
title: "282 -- Embedder set dry-run and validation"
description: "Validates embedder_set dry-run planning and invalid-name error handling without starting a reindex."
audited_post_017: true
version: 3.6.0.1
---

# 282 -- Embedder set dry-run and validation

## 1. OVERVIEW

This scenario gives embedder_set deterministic coverage without triggering a real 15-minute corpus reindex.

---

## 2. SCENARIO CONTRACT

- Objective: Validate embedder_set dry-run happy path and invalid embedder edge case.
- Real user request: `Dry-run an embedder switch and prove invalid embedder names fail cleanly.`
- RCAF Prompt: `Run embedder_set in dry-run mode for a known embedder and then with an invalid name; verify plan and error shape.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Dry-run returns a plan and does not start a job. - Invalid name returns a structured validation error. - Active embedder from `embedder_status({})` is unchanged after both calls.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

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

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 282
- Tools: `embedder_set`, `embedder_status`

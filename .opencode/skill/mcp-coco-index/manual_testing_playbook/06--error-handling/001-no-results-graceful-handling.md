---
title: "ERR-001 -- No results graceful handling"
description: "This scenario validates No results graceful handling for `ERR-001`. It focuses on Verify search returns empty results gracefully for a nonsense query (no crash, no error)."
---

# ERR-001 -- No results graceful handling

## 1. OVERVIEW

This scenario validates No results graceful handling for `ERR-001`. It focuses on Verify search returns empty results gracefully for a nonsense query (no crash, no error).


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ERR-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify search returns empty results gracefully for a nonsense query (no crash, no error)
- Real user request: `Please verify search returns empty results gracefully for a nonsense query (no crash, no error).`
- Prompt: `Verify a nonsense CocoIndex search returns an empty result gracefully, without errors or stack traces.`
- Expected execution process: Run the TEST EXECUTION command sequence for `ERR-001`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if empty results returned with no error; FAIL if tool throws an exception, crashes, or returns an error message


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ERR-001 | No results graceful handling | Verify search returns empty results gracefully for a nonsense query (no crash, no error) | `Verify a nonsense CocoIndex search returns an empty result gracefully, without errors or stack traces.` | 1. `mcp__cocoindex_code__search({ "query": "xyzzy_nonexistent_symbol_99999" })` -> 2. Verify response is a valid empty result (empty array or "no results" message, NOT an error or crash) | Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace | MCP tool output showing empty/zero results | PASS if empty results returned with no error; FAIL if tool throws an exception, crashes, or returns an error message | Check daemon logs for unhandled exceptions; verify index exists; test with `ccc search "xyzzy_nonexistent_symbol_99999" --limit 1` via CLI for comparison |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Error Handling
- Playbook ID: ERR-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--error-handling/001-no-results-graceful-handling.md`

---
title: "MCP-003 -- Language filter (multi)"
description: "This scenario validates Language filter (multi) for `MCP-003`. It focuses on Verify `languages` parameter accepts multiple languages."
---

# MCP-003 -- Language filter (multi)

## 1. OVERVIEW

This scenario validates Language filter (multi) for `MCP-003`. It focuses on Verify `languages` parameter accepts multiple languages.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `languages` parameter accepts multiple languages
- Real user request: `Please verify languages parameter accepts multiple languages.`
- Prompt: `Verify MCP CocoIndex accepts multiple languages and returns only Python or JavaScript files; return pass/fail with reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `MCP-003`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Results contain mix of `.py` and `.js` files; no other extensions
- Desired user-visible outcome: A concise user-visible PASS/PARTIAL/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if all results are Python or JavaScript files AND at least one of each appears; PARTIAL if all results are one language only but correct; FAIL if wrong language appears


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-003 | Language filter (multi) | Verify `languages` parameter accepts multiple languages | `Verify MCP CocoIndex accepts multiple languages and returns only Python or JavaScript files; return pass/fail with reason.` | 1. `mcp__cocoindex_code__search({ "query": "function definition", "languages": ["python", "javascript"] })` -> 2. Verify returned files are `.py` or `.js`/`.mjs`/`.cjs` only | Results contain mix of `.py` and `.js` files; no other extensions | MCP output with file extensions annotated | PASS if all results are Python or JavaScript files AND at least one of each appears; PARTIAL if all results are one language only but correct; FAIL if wrong language appears | Check language code values (use "python", "javascript"); verify index has both file types |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/003-language-filter-multi.md`

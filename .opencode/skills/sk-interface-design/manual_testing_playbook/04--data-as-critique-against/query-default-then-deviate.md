---
title: "ID-004 -- Query the data to find the default, then deviate"
description: "This scenario validates Query the data to find the default, then deviate for `ID-004`. It focuses on confirming the search returns the expected common pattern that is then deviated from, with a negative control proving no generator or persistence mode exists."
---

# ID-004 -- Query the data to find the default, then deviate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-004`.

---

## 1. OVERVIEW

This scenario validates Query the data to find the default, then deviate for `ID-004`. It focuses on confirming the search returns the expected common pattern that is then deviated from, with a negative control proving no generator or persistence mode exists.

### Why This Matters

ID-004 protects the single most dangerous-to-misuse part of the skill. The data sets describe what everyone else does, and the only correct use is to name the cliche and move off it. If an operator or the skill ever treats a search result as the answer to ship, or if a generator or persistence surface leaks back in, the skill quietly becomes the templated-default machine it was built to avoid. The negative control is therefore as important as the positive path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the search returns the expected common pattern, the skill deviates from it deliberately, and the search exposes no generator or persistence surface.
- Real user request: `Find the usual look for a luxury e-commerce site so we know what to avoid, then suggest something different.`
- Prompt: `Look up the typical look for a luxury e-commerce site so we know the cliche, then propose something that deliberately moves off it.`
- Expected execution process: Run `python3 scripts/design_search.py` for the product type, name the returned expected pattern, propose a justified deviation, and confirm the script rejects `--design-system` and `--persist`.
- Expected signals: Step 1: search returns a named common pattern for the product type; Step 2: a justified deviation away from that pattern is stated, not the pattern itself; Step 3: `--design-system` and `--persist` are rejected as unrecognized arguments
- Desired user-visible outcome: a named expected-default pattern from the data, a justified deviation away from it, and confirmation that the search is query-only with no `--design-system` and no `--persist` mode.
- Pass/fail: PASS if the named default is treated as critique-against per `references/design_inventory.md` and both generator flags are rejected; FAIL if the search result is presented as the design to ship, or if any `--design-system` or `--persist` mode runs

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain critique-against language.
2. Confirm the query targets a real product type or mood in the data sets.
3. Execute the deterministic steps exactly as written, including the negative control.
4. Compare the produced output against `references/design_inventory.md` hard rules.
5. Return a concise final verdict that flags any generator or persistence leak when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-004 | Query the data to find the default, then deviate | Confirm the search returns the expected common pattern, the skill deviates from it deliberately, and the search exposes no generator or persistence surface. | `Look up the typical look for a luxury e-commerce site so we know the cliche, then propose something that deliberately moves off it.` | bash: python3 scripts/design_search.py "luxury ecommerce" --domain style --max-results 1 -> bash: python3 scripts/design_search.py "x" --design-system -> bash: python3 scripts/design_search.py "x" --persist | Step 1: search returns a named common pattern; Step 2: a justified deviation away from that pattern is stated, not the pattern itself; Step 3: --design-system and --persist are rejected as unrecognized arguments | Terminal transcript of all three runs, the named default pattern, and the deviation rationale | PASS if the named default is treated as critique-against per references/design_inventory.md and both generator flags are rejected; FAIL if the result is presented as the design to ship, or if any --design-system or --persist mode runs | 1. Re-read references/design_inventory.md hard rules on generator and persistence; 2. Confirm scripts/design_search.py argparse omits --design-system and --persist; 3. Re-run the positive query and both negative controls |

### Optional Supplemental Checks

If the primary run passes, repeat the positive query against a second domain (for example `--domain typography`) to confirm the critique-against framing holds across data sets. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../scripts/design_search.py` | Query-only BM25 search whose argparse omits the generator and persistence surface |
| `../../references/design_inventory.md` | The critique-against framing and the hard rules forbidding generator and persistence use |

---

## 5. SOURCE METADATA

- Group: Data As Critique-Against
- Playbook ID: ID-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--data-as-critique-against/query-default-then-deviate.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

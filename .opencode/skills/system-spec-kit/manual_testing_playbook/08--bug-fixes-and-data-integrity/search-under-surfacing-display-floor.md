---
title: "Search under-surfacing display floor"
description: "This scenario validates search under-surfacing display-floor behavior. It focuses on confirming populated result sets survive token-budget pressure and overflow rows render compact instead of being deleted."
audited_post_018: true
version: 3.6.0.17
---

# Search under-surfacing display floor

## 1. OVERVIEW

This scenario validates search under-surfacing display-floor behavior. It focuses on confirming populated result sets survive token-budget pressure and overflow rows render compact instead of being deleted.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the display floor keeps every row for a populated result set at or below the floor, renders overflow rows compact instead of deleting them, and trims larger sets down to the floor instead of one row.
- Real user request: `` Please validate the search result display-floor regression against the documented test anchor and tell me whether the expected signals are present: a 6-row populated set under budget pressure keeps all 6 rows, overflow rows become compact with content removed but id retained, the top row remains full, truncation metadata reports 6 returned from 6 original, and a 15-row set trims to exactly the 10-row floor. ``
- Prompt: `Validate search under-surfacing display-floor behavior and confirm compact overflow preserves populated result rows.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals from `T207: display floor + compact overflow`, and return the pass/fail verdict.
- Expected signals: A 6-row populated set at or below the floor keeps `results.length = 6` and `count = 6`; at least one overflow row has `compact === true`, no `content`, and a defined `id`; the first row keeps string content; metadata reports `tokenBudgetTruncated === true`, `returnedResultCount = 6`, and `originalResultCount = 6`; a 15-row set under tighter budget trims to `results.length = 10` and `count = 10`.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if populated result sets are not collapsed below the display floor and overflow is represented by compact rows rather than row deletion

---

## 3. TEST EXECUTION

### Prompt

```
Validate search under-surfacing display-floor behavior and confirm compact overflow preserves populated result rows.
```

### Commands

1. Open `mcp_server/tests/token-budget-constitutional-sync.vitest.ts`
2. Inspect `describe('T207: display floor + compact overflow')`
3. Confirm `T207-A1` keeps all 6 rows at or below the display floor and marks overflow rows compact
4. Confirm `T207-A2` trims a 15-row set to the 10-row display floor
5. Capture the assertion evidence and verdict

### Expected

A populated 6-row result set survives with `count = 6` and compact overflow rows; compact rows retain `id` and drop `content`; the first row remains full; truncation metadata records 6 returned from 6 original; a larger 15-row set trims to exactly 10 rows, not one.

### Evidence

`mcp_server/tests/token-budget-constitutional-sync.vitest.ts` source evidence from `describe('T207: display floor + compact overflow')`, including `T207-A1` and `T207-A2` assertions.

### Pass / Fail

- **Pass**: all T207 display-floor assertions are present or reproduced: the 6-row set stays at 6 with compact overflow metadata, and the 15-row set trims to exactly 10
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect envelope budget enforcement -> Check display-floor constant behavior -> Verify compact-overflow rendering preserves ids and drops content -> Confirm count and truncation metadata stay synchronized

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Regression test: [mcp_server/tests/token-budget-constitutional-sync.vitest.ts](../../mcp_server/tests/token-budget-constitutional-sync.vitest.ts) — `T207: display floor + compact overflow`

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: Unnumbered
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/search-under-surfacing-display-floor.md`

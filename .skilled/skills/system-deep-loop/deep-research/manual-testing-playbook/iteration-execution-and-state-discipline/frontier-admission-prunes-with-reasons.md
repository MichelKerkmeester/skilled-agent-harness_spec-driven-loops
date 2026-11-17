---
title: "DR-070 -- Frontier admission prunes each proposal with its reason"
description: "This scenario validates that each failing admission check prunes a leaf proposal with that check's own reason and that only an admitted proposal reaches the research inbox, for `DR-070`."
version: 1.16.0.0
---

# DR-070 -- Frontier admission prunes each proposal with its reason

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-070`.

---

## 1. OVERVIEW

This scenario validates the admission step that turns a leaf's `frontier_proposal` rows into questions. The objective is to confirm that a proposal failing a check is pruned with the reason of the first failing check, and that only an admitted proposal writes an inbox row.

### Why This Matters

Leaves over-propose. Admission is the gate that keeps the question set bounded, so each rejection must name its cause. An operator who reads a pruned row must be able to tell which bound it hit.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the six reasons, the prune cases and the admit case.

- Objective: Confirm that each failing check prunes with its own reason, that the first failing check wins and that a pruned proposal never reaches the inbox.
- Real user request: Show me why a proposed sub-question was rejected, and show me that a valid one was added.
- Prompt: `Check that every frontier proposal that fails an admission check is pruned with that check's reason, and that only the admitted proposal reaches the research inbox with origin frontier. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Read the reason returns in the admission helper, then run the prune rows, the admit case and the pruned-record case by file stem.
- Expected signals: The helper returns the six reasons, `relevance`, `dedupe`, `depth`, `fanout`, `budget` and `cycle`. The seven prune rows pass. The admitted proposal writes exactly one inbox row with `origin: "frontier"`. The pruned proposal writes a store row and no inbox row.
- Desired user-visible outcome: The operator can name the bound each rejected proposal hit, and can see the one proposal that entered the question set.
- Pass/fail: PASS if the six reasons appear, all seven prune rows and both record cases pass; FAIL if a proposal is pruned with another check's reason, or a pruned proposal reaches the inbox.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that every frontier proposal that fails an admission check is pruned with that check's reason, and that only the admitted proposal reaches the research inbox with origin frontier. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `rg -n "return '(relevance|dedupe|depth|fanout|budget|cycle)'" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit.vitest -t "prunes with" --reporter=verbose`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit.vitest -t "admits a valid proposal" --reporter=verbose`
4. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit.vitest -t "records a pruned proposal" --reporter=verbose`

### Expected

Command 1 prints 13 lines. Every one of the six reason strings appears, because some reasons are returned from more than one guard. Command 2 prints `Tests  7 passed | 17 skipped (24)`, with seven prune rows: two for `relevance`, and one each for `dedupe`, `depth`, `fanout`, `budget` and `cycle`. Command 3 prints `Tests  1 passed | 23 skipped (24)`, and that case asserts one inbox row with `origin: "frontier"` and one open store row. Command 4 prints `Tests  1 passed | 23 skipped (24)`, and that case asserts a store row with no inbox line.

### Evidence

- The `rg` lines from command 1 and the verbose case lines from commands 2 to 4.
- The summary line and exit status for each command.

### Pass / Fail

- **Pass**: All six reasons appear, every command exits 0 with the expected pass count and no failed count.
- **Fail**: A proposal is pruned with another check's reason, a pruned proposal reaches the inbox, or any command fails.

### Failure Triage

- A proposal is pruned with the wrong reason: check the order of the checks in the admission helper, since the first failing check must win.
- A pruned proposal reaches the inbox: check that the inbox write follows only an admitted result.
- A reason string is missing from command 1: a check no longer returns its reason, so restore the return before trusting the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Six ordered checks in `checkProposal`, the admit path and the store row for each outcome |
| `frontier-admit.vitest` | One row per failing check, first failure wins, one admitted row and one pruned row |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-070
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md`
- Feature catalog status: No entry in `feature-catalog/` covers the expansive admission step yet, so this scenario cites none.

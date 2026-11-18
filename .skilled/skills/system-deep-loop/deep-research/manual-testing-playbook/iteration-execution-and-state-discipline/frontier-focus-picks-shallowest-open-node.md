---
title: "DR-071 -- Frontier focus picks the shallowest open node"
description: "This scenario validates that Next Focus under the expansive mode picks the open node at the lowest depth, that one visit with that focus leaves its question open and that a reworded focus still counts as a visit, for `DR-071`."
version: 1.16.2.0
---

# DR-071 -- Frontier focus picks the shallowest open node

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-071`.

---

## 1. OVERVIEW

This scenario validates the frontier branch of Next Focus. The objective is to confirm that the loop works the shallowest open node first, and that visiting a node does not answer the question it carries.

### Why This Matters

A broad topic needs breadth before depth. If the loop chased a deep node first, it would never cover the depth-one questions. A visit that counted as an answer would also close a question the loop never studied.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the focus choice, the visit rule and the marker that a visit matches.

- Objective: Confirm that the shallowest open node is chosen first, that one visit leaves its question unresolved and that a reworded focus that keeps the node marker still counts as a visit.
- Real user request: Tell me which open sub-question the next iteration works, and show me that a single pass does not mark it answered.
- Prompt: `Check that expansive Next Focus picks the shallowest open frontier node, that one visit with that focus leaves its question open, and that a reworded focus that keeps the node marker still counts as a visit. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the focus case and the reworded-visit case by file stem, then read the marker and the focus line in the reducer.
- Expected signals: The focus case passes and shows a depth-one node chosen over a depth-two node, with its question still open after the visit. The reworded-visit case passes and shows the node spent as `exhausted` with reason `budget` after five visits. The reducer matches the `Frontier node` marker anywhere in the focus and writes the focus as `Frontier node <id> (depth <n>, scope <scope>): <question>`.
- Desired user-visible outcome: The operator can name the node the next iteration works, and can see a visit alone does not close its question.
- Pass/fail: PASS if both cases pass and the reducer shows the marker and the focus line; FAIL if a deeper node is chosen first, a visit answers its question or a reworded visit fails to count.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that expansive Next Focus picks the shallowest open frontier node, that one visit with that focus leaves its question open, and that a reworded focus that keeps the node marker still counts as a visit. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-reduce-state.vitest -t "picks the shallowest open node" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-reduce-state.vitest -t "counts a visit when the leaf rewords" --reporter=verbose`
3. `rg -n "pickFrontierFocus|Frontier node" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`

### Expected

Command 1 prints `Tests  1 passed` (the rest of the file skipped), with the case `picks the shallowest open node and a visit does not resolve it` passing. Command 2 prints `Tests  1 passed` (the rest of the file skipped), with the case `counts a visit when the leaf rewords the focus around the node marker` passing. Command 3 prints the marker regex, which matches `Frontier node` anywhere in the focus text, and the focus template that `pickFrontierFocus` returns.

### Evidence

- The verbose case lines and summary lines from commands 1 and 2, with each exit status.
- The `rg` lines from command 3, read from the current source.

### Pass / Fail

- **Pass**: Both cases pass and command 3 shows the marker regex and the focus template.
- **Fail**: A deeper node is chosen first, a visit leaves no trace, or a reworded focus fails to count as a visit.

### Failure Triage

- A deeper node is chosen first: check the ordering in `pickFrontierFocus`, which must sort by depth before the other keys.
- One visit answers its question: check that the frontier focus is not the bare question text.
- A reworded focus does not count: check that the marker regex is not anchored to the start of the focus.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | `pickFrontierFocus`, the node marker match and the visit count |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | The frontier block that asks the leaf to copy its Focus Area line |
| `deep-research-reduce-state.vitest` | Shallowest-first focus, visit does not answer, reworded visit counts |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-071
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md`
- Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the frontier focus branch in its Stop And Next Focus section.

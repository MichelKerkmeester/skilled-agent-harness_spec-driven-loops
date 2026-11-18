---
title: "DR-076 -- Frontier dashboard section on expansive runs only"
description: "This scenario validates that the research dashboard shows a 6B. FRONTIER section with the frontier size, pruned count, revisits and band budget on an expansive run, and leaves it out of a default run, for `DR-076`."
version: 1.0.0.0
---

# DR-076 -- Frontier dashboard section on expansive runs only

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-076`.

---

## 1. OVERVIEW

This scenario validates the `## 6B. FRONTIER` dashboard section. It focuses on what the section reports and on its absence from a default run.

### Why This Matters

The dashboard is where an operator sees whether the frontier is still growing and how much of each band's budget is spent. A default run must not gain the section, or its dashboard bytes would change for a mode it never asked for.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the dashboard case and the section's source.

- Objective: Confirm that an expansive run's dashboard carries the frontier size, the pruned count, the revisits and each band's budget, and that a default run carries neither the section nor a `frontier` registry key.
- Real user request: Show me where the dashboard reports the frontier, and prove a normal run does not show it.
- Prompt: `Check that the research dashboard shows the 6B. FRONTIER section with size, pruned count, revisits and band budget on an expansive run, and leaves it out of a default run. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the dashboard case by test name, then read the section in the research reducer.
- Expected signals: The dashboard case passes. The expansive dashboard contains `## 6B. FRONTIER`, `- Frontier size: 2 nodes`, `- Pruned nodes: 0`, `- Revisits: ` and `- Budget depth1: `. The default run's registry has no `frontier` key and its dashboard has no `6B. FRONTIER`.
- Desired user-visible outcome: The operator can name the frontier lines on the dashboard and say a default run never shows them.
- Pass/fail: PASS if the case passes and the reducer renders the section only from an expansive registry; FAIL if a default run shows the section or an expansive run leaves a line out.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that the research dashboard shows the 6B. FRONTIER section with size, pruned count, revisits and band budget on an expansive run, and leaves it out of a default run. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-reduce-state.vitest -t "renders the frontier metrics" --reporter=verbose`
2. `rg -n "6B. FRONTIER|Frontier size|Pruned nodes|Revisits|Budget \\$" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`

### Expected

Command 1 prints `Tests  1 passed` with the rest of the file skipped, and the case `renders the frontier metrics on an expansive dashboard only` passes. Command 2 prints the section heading and its four line templates, all inside the branch that reads `registry.frontier`.

### Evidence

- The verbose case line and the summary line from command 1, with its exit status.
- The `rg` lines from command 2, read from the current source.

### Pass / Fail

- **Pass**: Command 1 exits 0 with the case passing, and command 2 shows the section built from the frontier registry.
- **Fail**: A default run shows the section, an expansive run leaves a line out, or the case fails.

### Failure Triage

- A default run shows the section: check that the reducer builds `registry.frontier` only when `antiConvergence.depthMode` is `expansive`.
- A line is missing: check the section's line templates against the frontier stats and budget.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | `renderDashboard`: the `6B. FRONTIER` section |
| `deep-research-reduce-state.vitest` | The expansive and default dashboard case |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-076
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/frontier-dashboard-section.md`
- Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the dashboard section in its Budget And Dashboard section.

---
title: "Step plans"
description: "`run` executes a plan of reads, actions, branches and bounded loops in one call, and `act batch` runs a straight sequence."
trigger_phrases:
  - "step plans"
  - "bladebro run"
  - "bladebro run plan"
  - "bladebro act batch"
version: 1.0.0.0
---

# Step plans (run)

## 1. OVERVIEW

`run` executes a plan of reads, actions, branches and bounded loops in one call, and `act batch` runs a straight sequence.

Plans are how Bladebro handles goal-driven, branching work in one round trip. `act batch` fits a fixed sequence, and `run` fits a sequence with conditions or loops.

---

## 2. HOW IT WORKS

### Core Behavior

A plan is an array of action objects, with the same fields as `act`, plus `if` and `while` steps and inline `see` reads. It comes inline, from a file through `@steps.json` or from stdin through `-`. For MCP, the array sits in a `steps` field. With `--format json` the result carries `status` (`completed` or `stopped`) and one result per top-level step.

### Quality Gates

A plan validates every static step before the first effect, including branches that are not taken. It accepts up to 1,000 static steps and 32 nesting levels. A `while` needs a test and a step array and runs at most 100 iterations. A malformed step exits 1 with a usage error that names the valid actions.

### Edge Cases

A plan stops on the first error and returns the step number plus the page state. Actions that completed before the stop stay in effect.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Shared | Plan validation, limits and the `steps` field for MCP |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/examples/run-step-plan.sh` | Script | Runs a two-step navigate and read plan and checks its status |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/tabs-and-run-plan.md` | Manual playbook | A two-step plan after a tab list |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded malformed and corrected plan runs |

---

## 4. SOURCE METADATA

- Group: Agent Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `agent-browser/step-plans.md`

Related references:
- [page-actions.md](page-actions.md) - The single actions a plan strings together
- [marked-screenshots.md](marked-screenshots.md) - Visual capture after a plan

---
title: "BB-009 -- Tab list and a step plan"
description: "This scenario validates `state tabs` and `run` for `BB-009`. It focuses on the tab list and a two-step plan that returns status completed."
version: 1.0.1.0
---

# BB-009 -- Tab list and a step plan

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-009`.

---

## 1. OVERVIEW

Plan step 10. The plan file is `[{"action":"navigate","url":"https://example.com"},{"action":"see","mode":"content"}]`.

### Why This Matters

A batch plan is how Bladebro runs several actions in one call.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-009` and confirm the expected signals without contradictory evidence.

- Objective: List tabs and run the two-step plan.
- Real user request: `List the Bladebro tabs, then run a two-step plan that opens example.com and reads it.`
- Prompt: `List the Bladebro tabs, then run a two-step plan that opens example.com and reads it.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: the tab list marks the current tab, the plan returns `"status":"completed"` with each step `ok`
- Desired user-visible outcome: The plan completed.
- Pass/fail: PASS if the tab list returns and the plan completes. FAIL if the tab list errors or the plan stops on a step.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `List the Bladebro tabs, then run a two-step plan that opens example.com and reads it.`

### Commands

1. `bladebro state tabs --json`
2. `bladebro run @steps.json --format json`

### Expected

- A tab line starting with `*`
- `"status":"completed"`

### Evidence

Both outputs, including any failed attempt.

### Pass / Fail

- **Pass**: the tab list returns and the plan completes.
- **Fail**: the tab list errors or the plan stops on a step.

### Failure Triage

1. A stop names the step number. Check that step against `bladebro help run` before blaming Bladebro.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `agent-browser/tabs-and-run-plan.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and flags |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/agent-browser/step-plans.md` | Feature catalog entry: Step plans |

---

## 5. SOURCE METADATA

- Group: Agent Browser
- Playbook ID: BB-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-browser/tabs-and-run-plan.md`

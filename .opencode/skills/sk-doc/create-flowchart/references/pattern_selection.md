---
title: Pattern Selection and Splitting
description: How to choose a create-flowchart pattern by workflow shape rather than topic, with best-fit and avoid-when guidance, selection distinctions, and signals for when to split a large diagram.
trigger_phrases:
  - "flowchart pattern selection"
  - "choose flowchart pattern"
  - "decision tree vs approval loop"
  - "when to split flowchart"
  - "large flowchart split signals"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pattern Selection and Splitting

Choosing the closest pattern by workflow shape, and recognizing when a diagram should be split. This extends the pattern table in `../SKILL.md` §3 with best-fit, avoid-when, and split detail. This is overflow detail; `../SKILL.md` is the authoritative workflow contract.

---

## 1. PATTERN SELECTION DEEP DIVE

Choose the pattern by workflow shape, not by topic. A deployment process can be parallel execution, approval loop, or system swimlane depending on what the reader must understand.

| Pattern | Best Fit | Avoid When |
|---|---|---|
| `simple_workflow.md` | one primary path with little branching | exceptions or retries carry the meaning |
| `decision_tree_flow.md` | branching logic, validations, retries, fallback outcomes | branches exceed the page and need sub-diagrams |
| `parallel_execution.md` | fan-out, concurrent work, fan-in, aggregate gate | work is sequential with many teams involved |
| `approval_workflow_loops.md` | review, revision, sign-off, escalation | there is no real loop or approval authority |
| `system_architecture_swimlane.md` | request or data movement across layers | real components are not identified |
| `user_onboarding.md` | user journey, setup, feedback, progress | the diagram is mostly backend orchestration |

**Selection distinctions**:
- use decision tree for business or validation outcomes; use approval loop for review, rework, escalation, or sign-off
- use parallel execution for concurrent branches with synchronization; use swimlane when responsibility boundaries matter more than timing
- use user journey when motivation, feedback, skip, retry, or support paths affect the experience

## 2. WHEN TO SPLIT A LARGE DIAGRAM

Split before the diagram becomes a wall of branches. The script warns over 200 lines, but readability can fail earlier when one screen cannot hold the main path and side paths together.

**Split signals**:
- the diagram needs more than 5 box widths to stay readable
- indentation approaches the validator's deep nesting warning
- branch labels are correct but readers still scan backward to find the decision
- parallel branches have their own decisions, retries, and terminal states
- a swimlane needs separate success and error-path detail

---

## 3. RELATED RESOURCES

- [README.md](README.md) - create-flowchart reference route-map
- `../SKILL.md` - authoritative workflow contract, including the §3 pattern-selection table
- `../assets/flowcharts/*` - the six pattern assets referenced above, one per workflow shape

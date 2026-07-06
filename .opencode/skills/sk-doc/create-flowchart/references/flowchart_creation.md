---
title: Flowchart Creation - Overflow Reference
description: Supplementary create-flowchart guidance with worked examples, validator-driven notation notes, pattern selection detail, split heuristics, and common pitfalls.
trigger_phrases:
  - "flowchart creation reference"
  - "ascii flowchart examples"
  - "flowchart validator pitfalls"
  - "decision tree branch labels"
  - "box width variation flowchart"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Flowchart Creation - Overflow Reference

Supplementary create-flowchart guidance with worked examples, validator-driven notation notes, pattern selection detail, split heuristics, and common pitfalls.

This reference is overflow detail; create-flowchart/SKILL.md is the authoritative workflow contract.

---

## 1. OVERVIEW

Use this file when the primary workflow is clear but the diagram needs deeper shaping guidance. It explains how to make validator-friendly ASCII flowcharts without copying the numbered workflow from `create-flowchart/SKILL.md`.

**Current reality highlights**:
- the validator counts unique horizontal rule widths from box-drawing `─` runs
- more than 3 widths warns, and more than 5 widths errors
- box-heavy diagrams need arrows or connectors, detected by `→`, `↓`, `├─`, or `└─`
- decision-like text needs at least one `[YES]`, `[NO]`, `✓`, or `✗` label somewhere in the file
- deep indentation above level 6 warns
- files above 200 lines warn that the diagram may need splitting

## 2. WORKED DECISION TREE

The example below borrows the decision-tree asset's shape: visible question nodes, explicit branch outcomes, retry or escalation handling, convergence, and terminal states. It uses `[YES]` and `[NO]` labels because the validator accepts those tokens or checkmarks for decision labels.

```text
╭────────────────────────────────────────────╮
│        SUPPORT REQUEST TRIAGE FLOW         │
╰────────────────────────────────────────────╯
↓
┌────────────────────────────────────────────┐
│  Request Received                          │
│  • Ticket captured                         │
└────────────────────────────────────────────┘
↓
╱────────────╲
╱ Decision:   ╲
╱ Known Issue? ╲
╲              ╱
╲────────────╱
├─ [YES] Known
│  ↓
│  ┌────────────────────────────────────────────┐
│  │  Send Known Resolution                     │
│  └────────────────────────────────────────────┘
│  ↓
│  ╭────────────────────────────────────────────╮
│  │  Ticket Closed                             │
│  ╰────────────────────────────────────────────╯
└─ [NO] Unknown
   ↓
   ┌────────────────────────────────────────────┐
   │  Investigate                               │
   │  • Reproduce symptom                       │
   └────────────────────────────────────────────┘
   ↓
   ╱────────────╲
   ╱ Decision:   ╲
   ╱ Fix Found?   ╲
   ╲              ╱
   ╲────────────╱
   ├─ [YES] Fix
   │  ↓
   │  ┌────────────────────────────────────────────┐
   │  │  Send Resolution                           │
   │  └────────────────────────────────────────────┘
   │  ↓
   │  ╭────────────────────────────────────────────╮
   │  │  Ticket Closed                             │
   │  ╰────────────────────────────────────────────╯
   └─ [NO] Escalate
      ↓
      ╭────────────────────────────────────────────╮
      │  Escalated To Specialist                   │
      ╰────────────────────────────────────────────╯
```

## 3. WHY THIS EXAMPLE PASSES

The example is not a universal template. It is a compact model for validator-safe decisions.

**Decision labels**:
- the question nodes include `Decision`, which triggers the validator's decision detection
- each outgoing branch includes `[YES]` or `[NO]`, which satisfies the accepted label forms
- descriptive words follow the required token, for example `[YES] Known`, so the branch is machine-checkable and readable

**Connectors**:
- `├─` and `└─` branch markers satisfy the validator's connector pattern
- `↓` arrows satisfy the validator's arrow pattern and keep the raw markdown readable
- terminal states are drawn instead of left implicit in prose

**Widths**:
- action and terminal boxes share one width
- decision diamonds reuse one smaller width
- the title band uses one additional width, keeping the total below the warning threshold

## 4. BOX WIDTH CONSISTENCY

The validator scans every run of two or more `─` characters and counts unique lengths. It does not understand intent, so a decorative line and a real box border both affect the width count.

**Practical rule**:
- use one width for normal action boxes
- use the same width for terminal boxes when possible
- use one repeated width for decision diamonds
- avoid decorative `─` separators unless they reuse an existing width

**How the `>5 width variations` error happens**:
- one title box, several medium action boxes, hand-sized side boxes, and unique diamond widths can produce 6 or more distinct lengths
- copying boxes from different pattern assets can mix widths that were consistent only inside their original examples
- wrapping long labels by widening one local box creates a new width for one sentence

**Fix strategy**:
- pick the standard width before drawing nodes
- wrap node text inside that width instead of shrinking or expanding borders
- make side branches use the same width as the main branch when possible
- shorten prose bullets rather than widening one box
- split the diagram if the only readable version needs many box sizes

## 5. PATTERN SELECTION DEEP DIVE

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

## 6. WHEN TO SPLIT A LARGE DIAGRAM

Split before the diagram becomes a wall of branches. The script warns over 200 lines, but readability can fail earlier when one screen cannot hold the main path and side paths together.

**Split signals**:
- the diagram needs more than 5 box widths to stay readable
- indentation approaches the validator's deep nesting warning
- branch labels are correct but readers still scan backward to find the decision
- parallel branches have their own decisions, retries, and terminal states
- a swimlane needs separate success and error-path detail

## 7. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Restating the process as boxes without arrows | The reader sees nouns, not flow | Add visible connectors and a primary path |
| Using `Yes` and `No` without brackets | The validator accepts `[YES]`, `[NO]`, `✓`, or `✗` | Use `[YES] Approved` and `[NO] Rejected` labels |
| Making every box a custom width | The validator can hit the width-variation error | Standardize widths and wrap text inside boxes |
| Copying asset domain details | Pattern assets are shape guides, not source truth | Replace content with sourced nodes and mark unknowns |
| Hiding retries in prose | The diagram omits risky behavior | Draw the loop-back or terminal fallback path |
| Drawing an infinite loop | Readers cannot tell when work stops | Add blocked, rejected, escalated, or completed terminal states |
| Treating warnings as harmless polish | Warnings often reflect readability defects | Fix warnings when practical before handoff |

## 8. VALIDATOR-AWARE AUTHORING NOTES

The validator is lightweight. It catches common structural defects, but it does not prove the workflow is semantically complete.

**What still requires author judgment**:
- whether a branch outcome is real or invented
- whether a retry limit exists
- whether a branch converges or should terminate
- whether a service, owner, queue, cache, or database actually exists
- whether a diagram is clearer than prose

**Unknown handling**:
- write `UNKNOWN` in source notes or assumptions when a branch is required but unsupported
- do not turn an unknown into a polished terminal state
- ask for clarification when the branch affects behavior and the workflow contract permits asking

## 9. RELATED RESOURCES

- `../SKILL.md` - authoritative create-flowchart workflow contract
- `../scripts/validate_flowchart.sh` - packet-local validator and actual threshold source
- `../assets/flowcharts/decision_tree_flow.md` - conditional branching pattern
- `../assets/flowcharts/parallel_execution.md` - fan-out, fan-in, synchronization pattern
- `../assets/flowcharts/*` - remaining approval, swimlane, journey, and linear pattern assets

---
title: Worked Decision-Tree Example
description: A compact validator-passing decision-tree flowchart with a breakdown of why its labels, connectors, and box widths satisfy the create-flowchart validator.
trigger_phrases:
  - "ascii flowchart worked example"
  - "decision tree flowchart example"
  - "validator passing flowchart"
  - "flowchart branch label example"
  - "why flowchart passes validation"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Worked Decision-Tree Example

A compact, validator-safe decision-tree flowchart and a breakdown of why it satisfies the packet validator's label, connector, and width checks. This is overflow detail; `../SKILL.md` is the authoritative workflow contract.

---

## 1. OVERVIEW

This file gives one compact, validator-passing decision-tree flowchart, then breaks down why its labels, connectors, and box widths satisfy the packet validator's checks. Use it as a shape to model a real decision tree on — replace the support-triage content with sourced nodes rather than copying it verbatim.

---

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

The example is not a universal template. It is a compact model for validator-safe decisions; replace its support-triage content with real sourced nodes.

**Decision labels**:
- the question nodes include `Decision`, which triggers the validator's decision detection
- each outgoing branch includes `[YES]` or `[NO]`, which satisfies the accepted label forms
- descriptive words follow the required token, for example `[YES] Known`, so the branch is machine-checkable and readable

**Connectors**:
- `├─` and `└─` branch markers satisfy the validator's connector pattern
- `↓` arrows satisfy the validator's arrow pattern and keep the raw markdown readable
- terminal states are drawn instead of left implicit in prose

**Widths**:
- the title, action, and terminal boxes all share one width
- the decision diamonds reuse one smaller width
- with only two box widths in play, the diagram stays well below the width-variation warning threshold

---

## 4. RELATED RESOURCES

- [README.md](README.md) - create-flowchart reference route-map
- [notation-and-validator.md](notation-and-validator.md) - validator mechanics, box-width notation, and common mistakes
- `../SKILL.md` - authoritative create-flowchart workflow contract
- `../scripts/validate-flowchart.sh` - packet-local validator and actual threshold source
- `../assets/decision-tree-flow.md` - conditional branching pattern asset

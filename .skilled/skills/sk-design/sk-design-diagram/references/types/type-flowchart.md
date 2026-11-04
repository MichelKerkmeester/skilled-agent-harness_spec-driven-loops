---
title: "Flowchart"
description: "Layout conventions for decision logic, algorithms, and user-facing branching flows — shape-carries-type grammar, decision diamonds, and merge dots."
trigger_phrases:
  - "flowchart decision logic"
  - "algorithm branching flow"
  - "decision diamond exits"
  - "start end oval"
  - "merge point dot"
importance_tier: normal
contextType: implementation
version: 1.2.2.0
---

# Flowchart

Open this when the reader has to follow a decision instead of reading a list of steps.

## 1. OVERVIEW

### Purpose

Makes a branch readable at a glance: shape carries the node type, every exit is labelled, and rejoining branches meet at one dot.

### When to Use

**Best for:** decision logic, algorithms, user-facing branching flows ("Should I…?"), onboarding routing, support-triage trees.

---

## 2. LAYOUT CONVENTIONS
- Shape carries type, not color:
  - **Oval** (`rx=20`) — start / end
  - **Rectangle** (`rx=6`) — step / action
  - **Diamond** — decision (≤3 exits)
  - **Small filled ink dot** (`r=4`) — merge point where branches rejoin
- Flow runs top→down. From a diamond, conventional exits: Yes to the right, No below — but label every outgoing arrow regardless.
- Use coral on the happy path *or* on the single most consequential decision — never on every decision.
- If two arrows must cross, use a small arc jump on one so the crossing is readable.

---

## 3. ANTI-PATTERNS
- Using fill color to signal node type (shape does that).
- Decision diamond with 4+ exits — refactor into nested diamonds.
- Unlabeled decision branches.

---

## 4. EXAMPLES
- `assets/diagrams/flowchart.html`: the canonical rendered example.

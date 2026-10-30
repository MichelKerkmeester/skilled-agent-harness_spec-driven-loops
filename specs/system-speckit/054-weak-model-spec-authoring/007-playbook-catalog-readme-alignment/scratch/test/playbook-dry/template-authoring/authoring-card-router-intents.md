---
title: "481 -- Authoring card loaded by four intents"
description: "This scenario validates that the PLAN, IMPLEMENT, INTAKE and TEMPLATE_AUTHORING intents load the authoring card and leave the long guide on demand."
version: 1.0.0.0
id: template-authoring-authoring-card-router-intents
---

# 481 -- Authoring card loaded by four intents

## 1. OVERVIEW

This scenario validates the router change phase 5 makes. The `RESOURCE_MAP` in `SKILL.md` sends four authoring intents to a short card. The long template guide stays reachable from `ON_DEMAND` only. The scenario counts the card and guide lines inside the four intent blocks and inside the on demand list.

### Why This Matters

A weak model follows the first document it is given. If an authoring intent still loads the 1,200 line guide, the model spends its context on the long path and never sees the card. The counts prove the router points at the short path and keeps the long one for a deliberate lookup.

---

## 2. SCENARIO CONTRACT

Operators count the card and guide lines in the router and read three numbers.

- Objective: Prove that the four authoring intent blocks name the card four times and the guide zero times, and that the on demand list names the guide once.
- Playbook ID: 481.
- Real user request: `Show me which authoring document each writing intent loads, and confirm the long guide is only an on-demand lookup now.`
- Prompt: `Show me which authoring document each writing intent loads, and confirm the long guide is only an on-demand lookup now.`
- Preconditions: A checkout with `awk` on PATH and phase 5 closed so `SKILL.md` and the card exist. The scenario needs no network.
- Expected execution process: Run one `awk` count over the four intent blocks for the card, one for the guide, and one over the on demand list for the guide.
- Expected signals: The card count prints `4`. The intent guide count prints `0`. The on demand guide count prints `1`.
- Desired user-visible outcome: The operator sees the four intents load the card and the guide held for an on demand read.
- Pass/fail: PASS if the three counts are `4`, `0` and `1` in that order. FAIL if any count differs.

---

## 3. TEST EXECUTION

### Prompt

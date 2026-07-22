---
title: "VOC Allocation"
description: "Scores marginal value of computation for outstanding branches against budget pressure and plans a non-authoritative allocation."
---

# VOC Allocation

---

## 1. OVERVIEW

Decides which outstanding branches are worth continuing to fund when budget pressure rises. Each candidate is scored for marginal benefit from durable, versioned budget and confidence inputs. A policy turns the scores into a budget-fitting allocation plan. A decision step assesses, allocates, reserves and finalizes the result as non-authoritative shadow evidence. A fan-in handoff then populates rank-only usefulness fields on outstanding branches so `conditional-fanin` can use them at a cut.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `allocation.ts` | Plans a budget-fitting allocation across scored candidates using greedy or proportional ordering |
| `assessment.ts` | Scores one candidate's marginal benefit from durable, versioned budget and confidence inputs |
| `decision.ts` | Assesses, allocates, reserves and finalizes one non-authoritative allocation decision |
| `events.ts` | Typed, compressed ledger event for the committed allocation decision |
| `fan-in-handoff.ts` | Populates rank-only usefulness fields on outstanding branch copies for fan-in |
| `index.ts` | Public API surface |
| `policy.ts` | Validates, freezes and content-addresses one allocation-policy version |
| `types.ts` | Reallocation triggers and allocation, assessment and decision type contracts |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/`

It depends on `hierarchical-budgets` for pressure ratios and `conditional-fanin` for the outstanding-branch and policy types it hands ranks back to.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/voc-allocation.vitest.ts`

## 5. RELATED

- [`system-deep-loop/SKILL.md`](../../../SKILL.md)

---
title: "ANALYZE-001 -- Analyze reports read-only"
description: "Analyze reports are read-only and pass ungated (Analyze add-on required)."
stage: routing
version: 1.0.0.0
---

# ANALYZE-001 -- Analyze reports read-only

## 1. OVERVIEW

This scenario validates Analyze reports read-only for `ANALYZE-001`. It focuses on Analyze reports are read-only and pass ungated (Analyze add-on required)..

### Why This Matters

Analyze reports are read-only and pass ungated (Analyze add-on required).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ANALYZE-001` and confirm the expected signals without contradictory evidence.

- Objective: Analyze reports are read-only and pass ungated (Analyze add-on required).
- Real user request: `Show me the traffic trend for the test site over the last 30 days.`
- Prompt: `Traffic trend for the test site over the last 30 days.`
- Expected execution process: Discover, use guide actions first, classify RO, read the report.
- Expected signals: Guide actions used first; report returned; or SKIP if the add-on is absent.
- Desired user-visible outcome: An Analyze report (or an explicit SKIP naming the missing add-on).
- Pass/fail: PASS if the report returns ungated, or SKIP with the add-on named; FAIL on gated execution.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Traffic trend for the test site over the last 30 days.`

### Commands

1. `list_tools()`. 2. `get_query_guide`. 3. `get_traffic_report` for the window.

### Expected

Guide actions used first; report returned; or SKIP if the add-on is absent.

### Evidence

Report output or SKIP record naming the missing add-on.

### Pass / Fail

- **Pass**: if the report returns ungated, or SKIP with the add-on named
- **Fail**: on gated execution

### Failure Triage

1. Verify the Analyze add-on. 2. Use get_query_guide for query shape.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/feature-catalog.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/action-reference.md` | Action inventory with classes |
| `../../SKILL.md` | Frozen classes and gates |

---

## 5. SOURCE METADATA

- Group: Read-Only
- Playbook ID: ANALYZE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/analyze.md`

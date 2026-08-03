---
title: "DISCOVER-DRIFT-001 -- Tool-surface drift fails closed"
description: "Live discovery is authoritative; drift is recorded and mismatched tools are never called."
stage: routing
version: 1.0.0.0
---

# DISCOVER-DRIFT-001 -- Tool-surface drift fails closed

## 1. OVERVIEW

This scenario validates Tool-surface drift fails closed for `DISCOVER-DRIFT-001`. It focuses on Live discovery is authoritative; drift is recorded and mismatched tools are never called..

### Why This Matters

Live discovery is authoritative; drift is recorded and mismatched tools are never called.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DISCOVER-DRIFT-001` and confirm the expected signals without contradictory evidence.

- Objective: Live discovery is authoritative; drift is recorded and mismatched tools are never called.
- Real user request: `List tools and compare them against the baseline inventory.`
- Prompt: `List tools and compare against the baseline inventory.`
- Expected execution process: Discover, diff against both references, record drift, refuse mismatched calls.
- Expected signals: Drift items enumerated; no call to a drifted tool.
- Desired user-visible outcome: A dated drift fixture with zero mismatched calls.
- Pass/fail: PASS if drift is recorded and no drifted tool is called; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `List tools and compare against the baseline inventory.`

### Commands

1. `list_tools()`. 2. Diff against the references. 3. Record the drift fixture.

### Expected

Drift items enumerated; no call to a drifted tool.

### Evidence

Dated drift fixture, refused-call record.

### Pass / Fail

- **Pass**: if drift is recorded and no drifted tool is called
- **Fail**: otherwise

### Failure Triage

1. Re-run discovery. 2. Pin the server version and refresh the fixture.

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

- Group: Discovery and Setup
- Playbook ID: DISCOVER-DRIFT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery-setup/discover-drift.md`

---
title: "DISCOVER-001 -- Discovery and prefix contract"
description: "Discovery returns the webflow namespace and matches the baseline inventory."
stage: routing
version: 1.0.0.0
---

# DISCOVER-001 -- Discovery and prefix contract

## 1. OVERVIEW

This scenario validates Discovery and prefix contract for `DISCOVER-001`. It focuses on Discovery returns the webflow namespace and matches the baseline inventory..

### Why This Matters

Discovery returns the webflow namespace and matches the baseline inventory.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DISCOVER-001` and confirm the expected signals without contradictory evidence.

- Objective: Discovery returns the webflow namespace and matches the baseline inventory.
- Real user request: `List the available Webflow MCP tools.`
- Prompt: `List the available Webflow MCP tools.`
- Expected execution process: Discover via list_tools, filter the webflow namespace, compare against the baseline inventory.
- Expected signals: webflow.webflow.* entries return; the inventory matches tool-surface/action-reference.
- Desired user-visible outcome: A usable, verified tool inventory for the session.
- Pass/fail: PASS if the webflow namespace resolves and the inventory matches; FAIL on missing namespace or unrecorded drift.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `List the available Webflow MCP tools.`

### Commands

1. `list_tools()` filtered to `webflow.webflow.*`. 2. Compare against `../references/action-reference.md` and `../references/tool-surface.md`.

### Expected

webflow.webflow.* entries return; the inventory matches tool-surface/action-reference.

### Evidence

Full list_tools output (redacted), matched inventory, drift notes.

### Pass / Fail

- **Pass**: if the webflow namespace resolves and the inventory matches
- **Fail**: on missing namespace or unrecorded drift

### Failure Triage

1. Run scripts/doctor.sh. 2. Check WEBFLOW_TOKEN presence and manual registration.

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
- Playbook ID: DISCOVER-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery-setup/discover.md`

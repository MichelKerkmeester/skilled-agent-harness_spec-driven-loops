---
title: "PI-010 -- Project agent override"
description: "This documentation-grounded scenario records Pi's project-over-global agent precedence and deliberately skips a live collision test that would write the operator's real global agent directory for `PI-010`."
version: 1.0.0.0
---

# PI-010 -- Project agent override

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-010`.

---

## 1. OVERVIEW

This scenario checks the documented resolution order for a project `.pi/agents/name.md` and a global `~/.pi/agent/agents/name.md` with the same name.

### Why This Matters

Project-local overrides are the safe way to tailor an agent to the current repository. A precedence inversion could silently select a user's global agent and discard the project-specific tool boundary.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the documented project-over-global collision rule without touching the operator's real global directory.
- Real user request: `Tell me which Pi agent wins when the project and global agent directories contain the same name, but do not write to my real global configuration.`
- Prompt: `Read the Pi agent precedence guidance and report which definition wins on a name collision. Do not create or modify anything under ~/.pi/agent/agents.`
- Expected execution process: Read the agent-delegation reference -> inspect the project agent path -> document the precedence rule -> refuse the live collision fixture at the real global path.
- Expected signals: The documentation says project files win when names collide; no global file is created or changed.
- Desired user-visible outcome: A safe, auditable precedence statement.
- Pass/fail: PASS for the documentation-grounded rule and clean global safety boundary. SKIP the live collision sub-check with blocker `writing into the operator's real ~/.pi/agent/agents/ directory is out of scope`. FAIL if any command writes to that path or the documented order contradicts the report.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the project agent resolution order.
2. Verify the project files exist.
3. Do not create a colliding global fixture in the operator's home.
4. Record the documentation-grounded result and the exact safety reason for SKIP.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-010 | Project agent override | Confirm project definitions win without a global write | `Read the Pi agent precedence guidance and report which definition wins on a name collision. Do not create or modify anything under ~/.pi/agent/agents.` | `sed -n '1,180p' ../../references/agent-delegation.md` -> `find .pi/agents -maxdepth 1 -name '*.md' | sort | sed -n '1,20p'` -> do not write `~/.pi/agent/agents/` | Reference states built-in, package, user, then project resolution with project files winning on collision; project files exist; no global mutation | The reference directly states `Project files win when names collide`; no live global collision command is run. | PASS for the documented precedence rule. SKIP the real collision test with blocker `real-environment safety boundary against writing ~/.pi/agent/agents/`. FAIL if global state changes. | Use a disposable home directory only in a separately approved fixture; never substitute the operator's home. |

### Optional Supplemental Checks

- A disposable `PI_CODING_AGENT_DIR` fixture may test precedence later, provided the global path resolves inside that disposable directory.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Global-config safety boundary |
| `../../SKILL.md` | Community bridge and trust rules |
| `../../references/agent-delegation.md` | Exact project/global precedence statement |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/agents/` | Project agent definitions |
| `.pi/settings.json` | Project-local package configuration |

---

## 5. SOURCE METADATA

- Group: Agent Bridge
- Playbook ID: PI-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-bridge/project-agent-override.md`

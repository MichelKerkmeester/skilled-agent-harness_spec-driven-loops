---
title: "ORCA-009 -- Sibling browser ownership"
description: "This scenario validates that generic Chrome/CDP and generic agentic browser requests route to their sibling packets rather than this Orca packet."
stage: routing
version: 0.1.1.0
---

# ORCA-009 -- Sibling browser ownership

## 1. OVERVIEW

This scenario confirms the hub routing keeps generic Chrome/CDP debugging and generic agentic browser work with `mcp-chrome-devtools` and `mcp-aside-devtools` even when this packet is present.

### Why This Matters

Orca's embedded browser is worktree-scoped. If this packet captured generic browser traffic, CDP debugging and agentic browser work would lose their native owners.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-009`
- Feature Name: Confirm generic browser and CDP requests stay with siblings
- Scenario Objective: Replay two generic routing prompts and confirm neither selects `mcp-orca-cli`.
- Exact Prompt: `Debug a Chrome page over CDP and capture console output.` plus `Automate a login flow on this public website.` each as standalone routing requests.
- Exact Command Sequence: `1. agent: route the CDP prompt through the hub -> 2. agent: route the agentic browser prompt through the hub -> 3. bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5 for each`
- Expected Signals: The CDP prompt routes to `mcp-chrome-devtools`. The agentic browser prompt routes to `mcp-aside-devtools`. Neither resolves to `mcp-orca-cli` or to an Orca leaf resource.
- Evidence: Router or advisor output for both prompts with scores and selected resources.
- Pass/Fail Criteria: PASS when hub routing selects the incumbent owner for both. FAIL when either selects `mcp-orca-cli`. SKIP when the advisor or router is unavailable.
- Failure Triage: 1. Re-run the advisor with the exact prompt. 2. Compare the alias capture against the registry. 3. Escalate any Orca capture of generic browser traffic as a routing defect.

---

## 3. TEST EXECUTION

### Prerequisites

The mcp-tooling hub is integrated and the advisor or compiled router is available.

### Prompt

`Debug a Chrome page over CDP and capture console output.` and `Automate a login flow on this public website.` as separate standalone requests.

### Commands

1. Route the CDP prompt through the hub.
2. Route the agentic browser prompt through the hub.
3. Run the advisor replay for each prompt.

### Expected

Each prompt resolves to its sibling packet, never to `mcp-orca-cli`.

### Evidence

Router and advisor outputs with scores and selected resources for both prompts.

### Pass / Fail

- **Pass:** both prompts select the incumbent sibling owner.
- **Skip:** the router or advisor is unavailable.
- **Fail:** either prompt selects `mcp-orca-cli`.

### Failure Triage

1. Re-run the advisor with the exact prompt text.
2. Compare alias capture against the registry's alias list.
3. Record any Orca capture of generic traffic as a routing defect.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-009 | Sibling browser ownership | Generic CDP and agentic browser stay with siblings | `Debug a Chrome page over CDP and capture console output.` / `Automate a login flow on this public website.` | route CDP prompt -> route agentic prompt -> advisor replay | Sibling packets selected. No Orca capture | Router and advisor outputs with scores | PASS when incumbents selected. SKIP if router unavailable. FAIL on any Orca capture | Re-run advisor, compare aliases, record defect |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` |
| Ownership map | `README.md` Section 4 and `references/mutation-and-browser-boundaries.md` Section 5 |

---

## 5. SOURCE METADATA

- Group: Routing boundary
- Playbook ID: `ORCA-009`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing-boundary/sibling-browser-ownership.md`

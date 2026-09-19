---
title: "ORCA-010 -- Unrelated OpenOrca prompts defer"
description: "This scenario validates that a prompt naming only an unrelated OpenOrca model does not select this Orca CLI packet."
stage: routing
version: 0.1.1.0
---

# ORCA-010 -- Unrelated OpenOrca prompts defer

## 1. OVERVIEW

This scenario replays a prompt that mentions only an unrelated OpenOrca model label and confirms the packet is not selected, because the aliases are deliberately narrow multi-word Orca workflow phrases.

### Why This Matters

A bare `orca` alias would capture unrelated OpenOrca model traffic. The registry's alias narrowness is a routing contract this scenario pins.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-010`
- Feature Name: Confirm unrelated OpenOrca prompts do not select this packet
- Scenario Objective: Replay an OpenOrca-model prompt through the hub routing and confirm `mcp-orca-cli` is not selected.
- Exact Prompt: `Show the OpenOrca model label for the current request.` as a standalone routing request.
- Exact Command Sequence: `1. agent: route the prompt through the hub -> 2. bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5`
- Expected Signals: The prompt defers or routes elsewhere. `mcp-orca-cli` is not selected. No Orca workflow alias captures the model label.
- Evidence: Router or advisor output with the score and selected resource.
- Pass/Fail Criteria: PASS when Orca-specific routing does not capture the prompt. FAIL when `mcp-orca-cli` is selected. SKIP when the advisor or router is unavailable.
- Failure Triage: 1. Re-run the advisor with the exact prompt. 2. Compare against the registry alias list for over-broad aliases. 3. Record any capture as a routing defect against the alias-narrowness contract.

---

## 3. TEST EXECUTION

### Prerequisites

The mcp-tooling hub is integrated and the advisor or compiled router is available.

### Prompt

`Show the OpenOrca model label for the current request.`

### Commands

1. Route the prompt through the hub.
2. Run the advisor replay for the prompt.

### Expected

The prompt defers or routes elsewhere without selecting `mcp-orca-cli`.

### Evidence

Router and advisor output with score and selected resource.

### Pass / Fail

- **Pass:** Orca routing does not capture the prompt.
- **Skip:** the router or advisor is unavailable.
- **Fail:** `mcp-orca-cli` is selected for the prompt.

### Failure Triage

1. Re-run the advisor with the exact prompt text.
2. Compare against the registry alias list for over-broad aliases.
3. Record any capture as a routing defect.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-010 | Unrelated OpenOrca prompts defer | OpenOrca model label does not capture | `Show the OpenOrca model label for the current request.` | hub route -> advisor replay | Defer or non-Orca route. No `mcp-orca-cli` selection | Router and advisor output with score | PASS when not captured. SKIP if router unavailable. FAIL on selection | Re-run advisor, compare aliases, record defect |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` routing section |
| Hub routing contract | Hub `mode-registry.json` alias list for the Orca mode |

---

## 5. SOURCE METADATA

- Group: Routing boundary
- Playbook ID: `ORCA-010`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing-boundary/openorca-defer.md`

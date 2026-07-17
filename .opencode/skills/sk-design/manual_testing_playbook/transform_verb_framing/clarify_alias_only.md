---
title: "TV-003: clarify Alias-Only Routing"
description: "Verify clarify routes as an interface alias but is not part of command projection parity."
version: 1.0.0.0
id: TV-003
expected_workflow_mode: interface
expected_leaf_resources:
  - workflow_mode: interface
    leaf_resource_id: references/design_process/design_principles.md
  - workflow_mode: interface
    leaf_resource_id: references/design_process/brief_to_dials.md
  - workflow_mode: interface
    leaf_resource_id: assets/interface_preflight_card.md
---

# TV-003: clarify Alias-Only Routing

## 1. OVERVIEW

This scenario verifies the `aliasOnly` entry in `transformVerbRouting`: `clarify` is an interface alias, but not part of command projection parity.

## 2. SCENARIO CONTRACT

**Realistic user request**: A designer wants a clearer hierarchy without asking for an audit.

**Exact prompt**:
```text
Clarify this hero section's visual hierarchy without changing its content.
```

**Expected mode resolution**: `interface`.

**Why**:
- `mode-registry.json` lists `clarify` in `interfaceAliases`.
- `mode-registry.json` lists `aliasOnly`: `clarify`.
- `mode-registry.json` excludes `clarify` from `commandProjectionParity`, which contains only `bolder`, `quieter`, `distill`, and `delight`.
- `hub-router.json` includes `clarify` under `interface-aliases`; audit routing only applies when the prompt uses `should it be clarify` framing.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-interface/references/design_process/design_principles.md`
- `design-interface/references/design_process/brief_to_dials.md`
- `design-interface/assets/interface_preflight_card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `aliasOnly: ["clarify"]`.
2. `hub-router.json` contains `clarify` under `interface-aliases`.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-TV003-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture resolved mode, packet, resource list, and response in `/tmp/skd-TV003-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the prompt resolves `interface`, loads `design-interface/SKILL.md`, and the response treats `clarify` as a visual-direction refinement rather than a command projection parity alias.
- **FAIL** iff `audit` resolves without `should it be` framing, or the response claims `clarify` is in `commandProjectionParity`.

### Failure Triage

1. If `audit` wins, verify the prompt did not include `should it be`.
2. If the response says `clarify` is a parity alias, inspect `mode-registry.json` `commandProjectionParity`.
3. If no mode resolves, inspect `hub-router.json` `interface-aliases`.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

---
title: "MDR-001: Interface Mode Routing"
description: "Verify generic visual-direction requests resolve to the interface mode and load the design-interface packet."
version: 1.0.0.0
id: MDR-001
expected_workflow_mode: interface
expected_leaf_resources:
  - workflow_mode: interface
    leaf_resource_id: references/design_process/design_principles.md
  - workflow_mode: interface
    leaf_resource_id: references/design_process/brief_to_dials.md
  - workflow_mode: interface
    leaf_resource_id: assets/interface_preflight_card.md
---

# MDR-001: Interface Mode Routing

## 1. OVERVIEW

This scenario verifies that a broad visual-direction request routes through the `sk-design` hub to `workflowMode: interface`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A product team has a generic pricing page and wants a distinctive visual direction before implementation.

**Exact prompt**:
```text
Make this SaaS pricing page look less generic and give it a distinctive visual direction.
```

**Expected mode resolution**: `interface`.

**Why**:
- `mode-registry.json` lists `interface` aliases including `make it look good`, `looks templated`, `redesign the ui`, `hero section`, `ui build`, `design variations`, `bolder`, `quieter`, `distill`, `clarify`, and `delight`.
- `hub-router.json` maps `interface-taste` keywords including `distinctive-interface`, `intentional-design`, `less generic`, `visual direction`, and `make it beautiful` to `interface`.
- `hub-router.json` sets `routerPolicy.defaultMode` to `interface` for design-family prompts when no other axis dominates.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-interface/references/design_process/design_principles.md`
- `design-interface/references/design_process/brief_to_dials.md`
- `design-interface/assets/interface_preflight_card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80` for this positive design-control prompt.

**Expected tool surface**: read-only. The `interface` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: interface` and `packet: design-interface`.
2. `hub-router.json` contains the `interface-taste` and `interface-aliases` vocabulary classes.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MDR001-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture the resolved `workflowMode`, loaded packet, loaded resources, tool calls, and response in `/tmp/skd-MDR001-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `interface`, packet is `design-interface/SKILL.md`, required shared resources are cited, and no mutating tool is used.
- **FAIL** iff another mode resolves, `design-interface/SKILL.md` is not loaded, or the AI uses `Write`, `Edit`, or `Bash` for this read-only design-direction request.

### Failure Triage

1. If advisor loses, inspect the `sk-design` graph signals for visual-direction keywords.
2. If `foundations` wins, check whether the prompt was accidentally rewritten to emphasize tokens, palette, typography, layout, or grid.
3. If resources are missing, verify `design-interface/SKILL.md` still lists `shared/register.md`, `shared/context_loading_contract.md`, `design_principles.md`, `brief_to_dials.md`, and `interface_preflight_card.md`.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

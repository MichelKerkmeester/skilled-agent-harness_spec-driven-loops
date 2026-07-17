---
title: "MDR-002: Foundations Mode Routing"
description: "Verify static visual-system requests resolve to foundations and load the design-foundations packet."
version: 1.0.0.0
id: MDR-002
expected_workflow_mode: foundations
expected_leaf_resources:
  - workflow_mode: foundations
    leaf_resource_id: references/corpus_map.md
  - workflow_mode: foundations
    leaf_resource_id: references/color/oklch_workflow.md
  - workflow_mode: foundations
    leaf_resource_id: references/color/palette_theming.md
  - workflow_mode: foundations
    leaf_resource_id: references/type/typography_system.md
  - workflow_mode: foundations
    leaf_resource_id: references/layout/layout_responsive.md
  - workflow_mode: foundations
    leaf_resource_id: assets/token_starter.md
---

# MDR-002: Foundations Mode Routing

## 1. OVERVIEW

This scenario verifies that a static visual-system request routes through the `sk-design` hub to `workflowMode: foundations`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A dashboard team needs a coherent visual system before code implementation.

**Exact prompt**:
```text
Create an OKLCH color token system, typography scale, spacing rhythm, and responsive grid for this dashboard.
```

**Expected mode resolution**: `foundations`.

**Why**:
- `mode-registry.json` lists `foundations` aliases including `oklch palette`, `color token system`, `typography scale`, `spacing system`, `responsive layout`, `design tokens`, and `grid`.
- `hub-router.json` maps `foundations-color` keyword `oklch`, `foundations-type` keyword `typography`, `foundations-layout` keyword `grid`, and `foundations-tokens` keyword `design-tokens` to `foundations`.

**Expected packet loaded**:
- `design-foundations/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`
- `shared/design_token_vocabulary.md`

**Expected mode resources loaded or cited**:
- `design-foundations/references/corpus_map.md`
- `design-foundations/references/color/oklch_workflow.md`
- `design-foundations/references/color/palette_theming.md`
- `design-foundations/references/type/typography_system.md`
- `design-foundations/references/layout/layout_responsive.md`
- `design-foundations/assets/token_starter.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: read-only. The `foundations` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: foundations` and `packet: design-foundations`.
2. `hub-router.json` contains the `foundations-color`, `foundations-type`, `foundations-layout`, and `foundations-tokens` vocabulary classes.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MDR002-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, resources, tool calls, and response in `/tmp/skd-MDR002-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `foundations`, packet is `design-foundations/SKILL.md`, and the loaded resources cover color, type, layout, and token paths.
- **FAIL** iff `interface`, `motion`, `audit`, or `md-generator` resolves instead, or if mutating tools are used.

### Failure Triage

1. If `interface` wins, check whether the prompt lost the static-axis terms `OKLCH`, `typography scale`, `spacing`, `grid`, or `design tokens`.
2. If token resources are missing, inspect `design-foundations/SKILL.md` `RESOURCE_MAP.TOKENS`.
3. If the shared token vocabulary is not cited, inspect the foundations `ON_DEMAND` and token entries.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

---
title: "PB-001: Procedure Selection Proof"
description: "Verify a public sk-design mode records which internal procedure card it selected and why without requiring mutation from a read-only mode."
version: 1.0.0.0
---

# PB-001: Procedure Selection Proof

## 1. OVERVIEW

This scenario verifies that a public `sk-design` mode can prove its internal procedure choice while preserving the public five-mode taxonomy.

## 2. SCENARIO CONTRACT

**Realistic user request**: A product team wants a distinctive direction for a fintech dashboard and needs to see why the mode chose its procedure before accepting the recommendation.

**Exact prompt**:
```text
Make this fintech dashboard feel premium and less generic. Before giving direction, state the public sk-design mode, the internal procedure card you selected, and why that card fits the available context.
```

**Expected mode resolution**: `interface`.

**Expected procedure card**: `design-interface/procedures/aesthetic_direction.md`.

**Why**:
- `hub-router.json` maps `less generic`, `premium ui`, and `visual direction` signals to `interface` through `interface-taste`.
- `mode-registry.json` keeps `interface` as a public mode with `proceduresPath: design-interface/procedures` and a read-only tool surface.
- `aesthetic_direction.md` is the matching card when a visual redesign lacks a stronger existing brand or reference source and must produce a non-generic direction brief.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-interface/procedures/aesthetic_direction.md`
- `design-interface/references/design_process/brief_to_dials.md`
- `design-interface/assets/interface_preflight_card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80` for this positive design-direction prompt.

**Expected tool surface**: read-only. The `interface` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `workflowMode: interface`, `packet: design-interface`, and `proceduresPath: design-interface/procedures`.
2. `design-interface/procedures/aesthetic_direction.md` exists and names `design-interface` as owning mode.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-PB001-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture the resolved `workflowMode`, selected procedure card, rationale, loaded resources, tool calls, and response in `/tmp/skd-PB001-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `interface`, the response names `design-interface/procedures/aesthetic_direction.md` as the selected procedure card, the rationale ties the card to missing stronger brand/reference context and non-generic direction, and no mutating tool is used.
- **FAIL** iff a private procedure becomes a public skill, the response omits the selected card/rationale, another mode resolves without justification, or the AI uses `Write`, `Edit`, or `Bash`.

### Failure Triage

1. If the procedure card is omitted, inspect `design-interface/SKILL.md` for procedure-selection proof instructions.
2. If `foundations` wins, check whether the prompt was rewritten around tokens, typography, grid, or spacing rather than direction.
3. If a mutating tool is used, compare the tool calls against the `interface` `toolSurface` in `mode-registry.json`.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/procedures/aesthetic_direction.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: Router replay passed in `benchmark/after_009/report.json`; live/manual operator execution is required before READY.

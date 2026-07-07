---
title: "PB-007: Interface Variation-Set Selection Proof"
description: "Verify interface mode selects the variation_set.md procedure card, not aesthetic_direction.md, and applies the seed-of-thought debias when a brief asks for two or more genuinely distinct visual directions."
version: 1.0.0.0
---

# PB-007: Interface Variation-Set Selection Proof

## 1. OVERVIEW

This scenario verifies that a public `interface` request for multiple genuinely distinct visual directions selects the private `variation_set.md` card instead of the single-direction `aesthetic_direction.md` card, and that the ALWAYS-rule seed-of-thought debias is invoked rather than the mode producing N safe variations of the median.

## 2. SCENARIO CONTRACT

**Realistic user request**: A product team needs three genuinely distinct visual directions for a fintech onboarding flow and wants to see the mode reject a lazy "same idea, three skins" pass before it commits to directions.

**Exact prompt**:
```text
Give me three genuinely distinct visual directions for this fintech onboarding flow, not three safe variations of the same idea. Before giving the directions, state the public sk-design mode, the internal procedure card you selected, and why it is not the single-direction aesthetic_direction card.
```

**Expected mode resolution**: `interface`.

**Expected procedure card**: `design-interface/procedures/variation_set.md` (explicitly not `aesthetic_direction.md`).

**Why**:
- `mode-registry.json` keeps `design variations` among the `interface` mode's aliases, and the `interface` registry entry allows `Read`, `Glob`, `Grep` only, forbidding `Write`, `Edit`, `Bash`.
- `design-interface/SKILL.md` section `Procedure Card Selection` maps "Multiple high-fidelity directions or alternatives" to `procedures/variation_set.md`, distinct from the "Greenfield direction without a stronger brand/system" row that maps to `procedures/aesthetic_direction.md`.
- `design-interface/SKILL.md` ALWAYS rule 6 requires debiasing multiple directions with the seed of thought from `references/design-process/variation_diversity.md` whenever a brief asks for two or more: a committed seed picks a non-median start in the grounded option space and the rest are spread to be genuinely distinct, never surfaced as a style chooser.
- The machine-parseable `RESOURCE_MAP` router maps intent `VARIATION_DIVERSITY` (weight 4, keywords including "several directions", "three directions", "diverse", "seed of thought", "debias") to that same `references/design-process/variation_diversity.md` file.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-interface/procedures/variation_set.md`
- `design-interface/references/design-process/variation_diversity.md`
- `design-interface/references/design-process/brief_to_dials.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80` for this positive multi-direction design prompt.

**Expected tool surface**: read-only. The `interface` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `workflowMode: interface` with `design variations` in its `aliases` list and a read-only `toolSurface`.
2. `design-interface/procedures/variation_set.md` and `design-interface/procedures/aesthetic_direction.md` both exist and are distinct cards in the `Procedure Card Selection` table.
3. `design-interface/references/design-process/variation_diversity.md` exists and is reachable from `RESOURCE_MAP["VARIATION_DIVERSITY"]`.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-PB007-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture the resolved `workflowMode`, selected procedure card, rationale for excluding `aesthetic_direction.md`, seed-of-thought citation, loaded resources, tool calls, and the three resulting directions in `/tmp/skd-PB007-response.txt`.
4. Compare the three directions pairwise for palette, layout, and motion choices to confirm they are not near-identical variations of one median design.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `interface`, the response names `design-interface/procedures/variation_set.md` as the selected card, states why it differs from `aesthetic_direction.md` (two-or-more genuinely distinct directions vs. a single-direction brief), cites the seed-of-thought debias from `variation_diversity.md`, produces three directions that are meaningfully distinct rather than N safe variations of the median, and no mutating tool is used.
- **FAIL** iff `aesthetic_direction.md` is selected for a multi-direction brief, no procedure card is cited, the seed-of-thought debias is omitted or not named, the directions read as near-identical variations, or `Write`, `Edit`, or `Bash` is used.

### Failure Triage

1. If `aesthetic_direction.md` is selected instead, re-read `design-interface/SKILL.md` `Procedure Card Selection` and confirm the prompt's "three genuinely distinct" language should route to the "Multiple high-fidelity directions or alternatives" row, not the greenfield single-direction row.
2. If the seed-of-thought debias is missing, check whether ALWAYS rule 6 was loaded and whether `RESOURCE_MAP["VARIATION_DIVERSITY"]` fired for the prompt's keywords ("three directions", "distinct").
3. If the three directions read as near-identical, inspect whether `variation_diversity.md`'s non-median seed and spread mechanism were actually applied or only cited.
4. If a mutating tool is used, compare the tool calls against the `interface` `toolSurface` in `mode-registry.json`.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/procedures/variation_set.md`
- `.opencode/skills/sk-design/design-interface/procedures/aesthetic_direction.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/variation_diversity.md`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes

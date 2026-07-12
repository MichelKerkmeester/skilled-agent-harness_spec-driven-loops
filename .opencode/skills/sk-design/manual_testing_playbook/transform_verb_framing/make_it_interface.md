---
title: "TV-001: make it Transform Frame Routes Interface"
description: "Verify make-it transform verbs bolder, quieter, distill, and delight resolve to interface."
version: 1.0.0.0
---

# TV-001: make it Transform Frame Routes Interface

## 1. OVERVIEW

This scenario verifies the interface side of `transformVerbRouting`: commands framed as `make it` plus the supported transform aliases resolve to `interface`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A designer asks for concise visual-direction transformations rather than a review.

**Prompt variants**:

| Variant | Exact Prompt | Expected Mode |
|---|---|---|
| V1 | `Make it bolder without changing the product copy.` | `interface` |
| V2 | `Make it quieter while keeping the same layout.` | `interface` |
| V3 | `Make it distill the visual hierarchy down to fewer competing elements.` | `interface` |
| V4 | `Make it delight users with one memorable interface detail.` | `interface` |

**Expected mode resolution**: `interface` for every variant.

**Why**:
- `mode-registry.json` sets `transformVerbRouting.interfaceFrame` to `make it`.
- `mode-registry.json` lists `interfaceAliases`: `bolder`, `quieter`, `distill`, `clarify`, and `delight`.
- `mode-registry.json` lists `commandProjectionParity`: `bolder`, `quieter`, `distill`, and `delight`.
- `hub-router.json` includes `bolder`, `quieter`, `distill`, and `delight` under `interface-aliases`.

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

1. `mode-registry.json` contains the `transformVerbRouting` block.
2. `hub-router.json` contains `interface-aliases` with the four tested aliases.

### Exact Command Sequence

1. Run an advisor probe for every variant and append to `/tmp/skd-TV001-advisor-results.jsonl`.
2. Invoke the orchestrator for every variant and save responses under `/tmp/skd-TV001/`.
3. Record resolved mode, loaded packet, and resource list for each variant.

### Pass/Fail Criteria

- **PASS** iff all variants resolve `interface`, load `design-interface/SKILL.md`, and avoid audit framing.
- **FAIL** iff any variant resolves `audit`, `foundations`, `motion`, or `md-generator`, or if the response asks whether the transform should happen instead of applying the requested transform framing.

### Failure Triage

1. If `audit` wins, inspect whether the prompt was changed to `should it be` framing.
2. If a variant fails, compare the alias spelling to `interfaceAliases` and `commandProjectionParity`.
3. If resources are missing, inspect `design-interface/SKILL.md` resource-loading defaults.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

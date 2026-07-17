---
title: "SR-001: Interface Shared References"
description: "Verify interface mode loads shared reference-base resources before visual recommendations."
version: 1.0.0.0
id: SR-001
expected_workflow_mode: interface
expected_leaf_resources:
  - workflow_mode: interface
    leaf_resource_id: references/design_process/brief_to_dials.md
  - workflow_mode: interface
    leaf_resource_id: references/design_process/design_principles.md
  - workflow_mode: interface
    leaf_resource_id: assets/interface_preflight_card.md
---

# SR-001: Interface Shared References

## 1. OVERVIEW

This scenario verifies that interface mode cites the shared reference base instead of duplicating shared design vocabulary inside the hub.

## 2. SCENARIO CONTRACT

**Realistic user request**: A designer wants interface recommendations with the operating register stated before visual choices.

**Exact prompt**:
```text
Make this landing page look less generic and state the register before recommending colors.
```

**Expected mode resolution**: `interface`.

**Why**:
- `hub-router.json` maps `less generic` and `visual direction` under `interface-taste` to `interface`.
- `design-interface/SKILL.md` requires `../shared/register.md`, `../shared/context_loading_contract.md`, and `design-interface/references/design_process/brief_to_dials.md` before decisions.
- `SKILL.md` describes the shared base as anti-slop principles, cognitive laws, and design-token vocabulary used by modes, not copied into the hub.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`
- `shared/anti_slop_principles.md` when anti-default rationale is cited
- `shared/cognitive_laws.md` when hierarchy or perception rationale is cited
- `shared/design_token_vocabulary.md` when token naming is discussed

**Expected mode resources loaded or cited**:
- `design-interface/references/design_process/design_principles.md`
- `design-interface/references/design_process/brief_to_dials.md`
- `design-interface/assets/interface_preflight_card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `shared/register.md`, `shared/context_loading_contract.md`, `shared/anti_slop_principles.md`, `shared/cognitive_laws.md`, and `shared/design_token_vocabulary.md` exist.
2. `design-interface/SKILL.md` still references shared resources with `../shared/` paths.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-SR001-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, shared resources, and response in `/tmp/skd-SR001-response.txt`.

### Pass/Fail Criteria

- **PASS** iff mode is `interface`, packet is `design-interface/SKILL.md`, shared register and context contract are loaded before recommendations, and shared vocabulary is cited from `shared/` rather than duplicated from the hub.
- **FAIL** iff the hub supplies per-mode design logic directly, shared resources are skipped, or the response treats the shared base as a standalone workflow.

### Failure Triage

1. If shared resources are missing, inspect `design-interface/SKILL.md` Resource Loading Levels.
2. If hub logic appears in the response, inspect `SKILL.md` rules that the hub stays routing-only.
3. If token vocabulary is needed but missing, inspect `shared/design_token_vocabulary.md` availability.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/shared/`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

---
title: "PB-002: Context and Proof Gates"
description: "Verify read-only advisory modes cite loaded context, distinguish confirmed from inferred evidence, and avoid completion claims when proof is missing."
version: 1.0.0.0
id: PB-002
expected_workflow_mode: foundations
expected_leaf_resources: []
---

# PB-002: Context and Proof Gates

## 1. OVERVIEW

This scenario verifies that a read-only `sk-design` advisory mode reports context and proof evidence before presenting findings as ready.

## 2. SCENARIO CONTRACT

**Realistic user request**: A reviewer wants a hierarchy/rhythm assessment from supplied artifacts and expects the mode to identify which claims are grounded versus inferred.

**Exact prompt**:
```text
Review the supplied dashboard screenshot description for hierarchy and spacing rhythm. Before recommendations, list the context you used, what is confirmed, what is inferred, and what proof would be required before calling the design ready.
```

**Expected mode resolution**: `foundations`.

**Expected procedure card**: `design-foundations/procedures/hierarchy_rhythm_review.md`.

**Why**:
- `hub-router.json` maps `hierarchy`, `spacing-system`, `responsive-layout`, and `layout` signals to `foundations` classes.
- `mode-registry.json` keeps `foundations` read-only with `backendKind: reference-base` and `proceduresPath: design-foundations/procedures`.
- `hierarchy_rhythm_review.md` requires scan-path, scale-discipline, and confirmed-versus-inferred evidence before handoff fixes.

**Expected packet loaded**:
- `design-foundations/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-foundations/procedures/hierarchy_rhythm_review.md`
- `shared/assets/context_loaded_card.md`
- `shared/assets/proof_of_application_card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80` for this design-foundations prompt.

**Expected tool surface**: read-only. The `foundations` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `workflowMode: foundations`, `packet: design-foundations`, and `proceduresPath: design-foundations/procedures`.
2. `design-foundations/procedures/hierarchy_rhythm_review.md` exists and names confirmed-versus-inferred proof in its proof gate.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-PB002-advisor.txt`.
2. Invoke the orchestrator with the exact prompt and a short supplied screenshot description if available.
3. Capture the resolved `workflowMode`, selected procedure card, context manifest, proof gate text, loaded resources, tool calls, and response in `/tmp/skd-PB002-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `foundations`, the response names `design-foundations/procedures/hierarchy_rhythm_review.md`, it separates confirmed evidence from inferred claims, it names proof still required before readiness, and no mutating tool is used.
- **FAIL** iff the response gives a ready verdict without proof, omits context/proof fields, fabricates source evidence, or uses `Write`, `Edit`, or `Bash`.

### Failure Triage

1. If proof fields are missing, inspect the selected mode's proof gate and `shared/context_loading_contract.md`.
2. If `interface` wins, check whether the prompt lost the hierarchy, rhythm, spacing, and scale terms.
3. If unsupported readiness is claimed, route the output through `design-audit` before release acceptance.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/procedures/hierarchy_rhythm_review.md`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: Router replay passed in `benchmark/after_009/report.json`; live/manual operator execution is required before READY.

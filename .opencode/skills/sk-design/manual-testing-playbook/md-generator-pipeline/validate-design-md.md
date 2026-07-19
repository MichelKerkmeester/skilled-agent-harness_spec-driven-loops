---
title: "MG-002: Validate DESIGN.md"
description: "Verify validation-only requests route to md-generator and use the VALIDATE phase resources."
version: 1.0.0.0
id: MG-002
expected_workflow_mode: md-generator
expected_leaf_resources:
  - workflow_mode: md-generator
    leaf_resource_id: references/design-md-format.md
  - workflow_mode: md-generator
    leaf_resource_id: references/quality-checklist.md
  - workflow_mode: md-generator
    leaf_resource_id: references/anti-patterns.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/cardinal-rules-card.md
---

# MG-002: Validate DESIGN.md

## 1. OVERVIEW

This scenario verifies that an existing `DESIGN.md` plus `tokens.json` pair routes to md-generator validation rather than interface or audit.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator has prior extraction artifacts and wants fidelity validation.

**Exact prompt**:
```text
Validate /tmp/skd-MG002/DESIGN.md against /tmp/skd-MG002/tokens.json for hex accuracy and section completeness.
```

**Expected mode resolution**: `md-generator`.

**Why**:
- `mode-registry.json` lists `validate design.md` as an `md-generator` alias.
- `hub-router.json` maps `md-generator-validation` keyword `design fidelity` and `md-generator-aliases` keyword `validate design.md` to `md-generator`.
- `design-md-generator/SKILL.md` phase detection sets `PHASE="VALIDATE"` for validate, check accuracy, verify design, hex check, and section completeness prompts.

**Expected packet loaded**:
- `design-md-generator/SKILL.md`

**Expected shared resources loaded or cited**:
- UNKNOWN. Validation is scoped to the md-generator packet.

**Expected mode resources loaded or cited**:
- `design-md-generator/references/design-md-format.md`
- `design-md-generator/references/quality-checklist.md`
- `design-md-generator/references/anti-patterns.md`
- `design-md-generator/assets/cardinal-rules-card.md`

**Expected pipeline stage named**:
- `VALIDATE`: `validate.ts` checks every hex code in DESIGN.md exists in tokens.json, required v3 sections are present, and Quick Start fidelity holds.

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `/tmp/skd-MG002/DESIGN.md` and `/tmp/skd-MG002/tokens.json` exist for a real validation run.
2. The operator may stop at routing verification if fixture artifacts are unavailable, marking execution SKIP with blocker details.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MG002-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, resources, and validation command or result in `/tmp/skd-MG002-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, mode is `md-generator`, packet is `design-md-generator/SKILL.md`, and the response uses the VALIDATE phase with `validate.ts` or equivalent packet guidance.
- **FAIL** iff `audit` produces a design review instead of token fidelity validation, or `interface`/`foundations` rewrite the design reference.

### Failure Triage

1. If `audit` wins, verify the prompt says `Validate DESIGN.md` and not `audit this design`.
2. If validation resources are missing, inspect `design-md-generator/SKILL.md` `RESOURCE_MAP.VALIDATE`.
3. If `DESIGN.md` is edited before validation, inspect the cardinal fidelity rule.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No unless operator asks to patch artifacts
- **Sandbox**: `/tmp/skd-MG002/`
- **Concurrent-safe**: No
- **Last validated**: pending manual run

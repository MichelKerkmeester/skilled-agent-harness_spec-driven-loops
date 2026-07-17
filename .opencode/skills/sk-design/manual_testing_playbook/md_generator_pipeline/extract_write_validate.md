---
title: "MG-001: Extract Write Validate Pipeline"
description: "Verify full URL-to-DESIGN.md requests route to md-generator and name the EXTRACT, WRITE, and VALIDATE stages."
version: 1.0.0.0
id: MG-001
expected_workflow_mode: md-generator
expected_leaf_resources:
  - workflow_mode: md-generator
    leaf_resource_id: references/design_md_format.md
  - workflow_mode: md-generator
    leaf_resource_id: references/writing_style_guide.md
  - workflow_mode: md-generator
    leaf_resource_id: references/color_role_taxonomy.md
  - workflow_mode: md-generator
    leaf_resource_id: references/component_taxonomy.md
  - workflow_mode: md-generator
    leaf_resource_id: references/anti_patterns.md
  - workflow_mode: md-generator
    leaf_resource_id: references/authoring_boundary.md
  - workflow_mode: md-generator
    leaf_resource_id: references/extraction_workflow.md
  - workflow_mode: md-generator
    leaf_resource_id: references/troubleshooting.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/design_md_prompt_template.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/cardinal_rules_card.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/source_of_truth_router_card.md
---

# MG-001: Extract Write Validate Pipeline

## 1. OVERVIEW

This scenario verifies the full md-generator pipeline: a live URL request resolves `md-generator`, loads the extraction packet, and runs or describes the sequential EXTRACT, WRITE, and VALIDATE stages.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator needs a measured Style Reference and token evidence from a live website.

**Exact prompt**:
```text
Extract the design system from https://example.com into /tmp/skd-MG001/DESIGN.md with tokens.json evidence.
```

**Expected mode resolution**: `md-generator`.

**Why**:
- `mode-registry.json` lists `md-generator` aliases including `extract design system`, `generate design.md`, `capture website css`, `design tokens from url`, and `design-to-markdown`.
- `hub-router.json` maps `md-generator-extraction` keyword `extract-design-system` and `md-generator-artifacts` keyword `design.md` to `md-generator`.
- `mode-registry.json` sets `backendKind: playwright-extract`, `mutatesWorkspace: true`, and allowed tools `Read`, `Glob`, `Grep`, `Write`, `Edit`, and `Bash`.

**Expected packet loaded**:
- `design-md-generator/SKILL.md`

**Expected shared resources loaded or cited**:
- UNKNOWN. The md-generator router guards paths inside `design-md-generator/`.

**Expected mode resources loaded or cited**:
- `design-md-generator/references/design_md_format.md`
- `design-md-generator/references/writing_style_guide.md`
- `design-md-generator/references/color_role_taxonomy.md`
- `design-md-generator/references/component_taxonomy.md`
- `design-md-generator/references/anti_patterns.md`
- `design-md-generator/references/authoring_boundary.md`
- `design-md-generator/references/extraction_workflow.md`
- `design-md-generator/references/troubleshooting.md`
- `design-md-generator/assets/design_md_prompt_template.md`
- `design-md-generator/assets/cardinal_rules_card.md`
- `design-md-generator/assets/source_of_truth_router_card.md`

**Expected pipeline stages named**:
- `EXTRACT`: Playwright crawls the target URL across five viewports and emits `tokens.json`.
- `WRITE`: `build-write-prompt.ts` pre-renders deterministic value sections; prose is written around measured values.
- `VALIDATE`: `validate.ts` checks hex accuracy, section completeness, Quick Start fidelity, format consistency, and prose provenance.

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `design-md-generator/backend/node_modules` and Playwright Chromium are installed if the operator executes the full run.
2. Output path is `/tmp/skd-MG001/`.
3. The target URL is reachable from the sandbox.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MG001-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, resources, tool calls, and stage plan in `/tmp/skd-MG001-response.txt`.
4. If executing, save generated artifacts under `/tmp/skd-MG001/` and save validation output to `/tmp/skd-MG001-validate.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, mode is `md-generator`, packet is `design-md-generator/SKILL.md`, the response names EXTRACT, WRITE, and VALIDATE in order, and any writes are confined to `/tmp/skd-MG001/`.
- **FAIL** iff another mode resolves, the AI authors DESIGN.md from a brief without extraction, skips validation, or writes outside the sandbox.

### Failure Triage

1. If `interface` or `foundations` wins, verify the prompt contains a live URL plus `extract design system` and `DESIGN.md`.
2. If stage names are missing, inspect `design-md-generator/SKILL.md` `The Three-Phase Pipeline`.
3. If validation is skipped, inspect the `VALIDATE` phase and `validate.ts` invocation guidance.
4. If output escapes `/tmp/skd-MG001/`, stop the run and inspect path handling before rerunning.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: Writes sandbox artifacts only
- **Sandbox**: `/tmp/skd-MG001/`
- **Concurrent-safe**: No
- **Last validated**: pending manual run

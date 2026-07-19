---
title: "MDR-005: md-generator Mode Routing"
description: "Verify live-site DESIGN.md extraction requests resolve to md-generator and load the design-md-generator packet."
version: 1.0.0.0
id: MDR-005
expected_workflow_mode: md-generator
expected_leaf_resources:
  - workflow_mode: md-generator
    leaf_resource_id: references/design-md-format.md
  - workflow_mode: md-generator
    leaf_resource_id: references/writing-style-guide.md
  - workflow_mode: md-generator
    leaf_resource_id: references/color-role-taxonomy.md
  - workflow_mode: md-generator
    leaf_resource_id: references/component-taxonomy.md
  - workflow_mode: md-generator
    leaf_resource_id: references/anti-patterns.md
  - workflow_mode: md-generator
    leaf_resource_id: references/extraction-workflow.md
  - workflow_mode: md-generator
    leaf_resource_id: references/troubleshooting.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/design-md-prompt-template.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/cardinal-rules-card.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/source-of-truth-router-card.md
---

# MDR-005: md-generator Mode Routing

## 1. OVERVIEW

This scenario verifies that live-site extraction requests route through the `sk-design` hub to `workflowMode: md-generator`.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants a measured design reference from a live website.

**Exact prompt**:
```text
Extract the design system from https://example.com into a DESIGN.md style reference.
```

**Expected mode resolution**: `md-generator`.

**Why**:
- `mode-registry.json` lists `md-generator` aliases including `extract design system`, `generate design.md`, `capture website css`, `design tokens from url`, `create design reference`, `design-to-markdown`, `validate design.md`, and `design fidelity check`.
- `hub-router.json` maps `md-generator-aliases`, `md-generator-extraction`, and `md-generator-artifacts` to `md-generator`.
- The registry sets `backendKind: playwright-extract`, `mutatesWorkspace: true`, and allows `Write`, `Edit`, and `Bash` only for this mode.

**Expected packet loaded**:
- `design-md-generator/SKILL.md`

**Expected shared resources loaded or cited**:
- UNKNOWN. The md-generator packet guards paths inside its own folder and does not cite the parent shared reference base in its router.

**Expected mode resources loaded or cited**:
- `design-md-generator/references/design-md-format.md`
- `design-md-generator/references/writing-style-guide.md`
- `design-md-generator/references/color-role-taxonomy.md`
- `design-md-generator/references/component-taxonomy.md`
- `design-md-generator/references/anti-patterns.md`
- `design-md-generator/references/extraction-workflow.md`
- `design-md-generator/references/troubleshooting.md`
- `design-md-generator/assets/design-md-prompt-template.md`
- `design-md-generator/assets/cardinal-rules-card.md`
- `design-md-generator/assets/source-of-truth-router-card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: mutating allowed. This is the only mode whose registry allows `Write`, `Edit`, and `Bash` and sets `mutatesWorkspace: true`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: md-generator`, `packet: design-md-generator`, and `backendKind: playwright-extract`.
2. The scenario output path is under `/tmp/skd-MDR005/` if executed beyond routing.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MDR005-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, resources, tool surface, and response in `/tmp/skd-MDR005-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `md-generator`, packet is `design-md-generator/SKILL.md`, backend is identified as `playwright-extract`, and the response names the extract-write-validate pipeline.
- **FAIL** iff `interface` invents a design direction, `foundations` authors tokens without measuring the live site, or the AI omits the md-generator pipeline.

### Failure Triage

1. If another mode wins, verify `extract design system`, `DESIGN.md`, and a live URL are present.
2. If the pipeline is missing, inspect `design-md-generator/SKILL.md` sections `SMART ROUTING` and `The Three-Phase Pipeline`.
3. If shared resources are claimed as required, verify that claim against the md-generator router guard.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: Potentially writes sandbox artifacts only when executed
- **Sandbox**: `/tmp/skd-MDR005/`
- **Concurrent-safe**: No
- **Last validated**: pending manual run

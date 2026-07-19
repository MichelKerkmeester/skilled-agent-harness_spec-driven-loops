---
title: "PB-003: md-generator Preservation Confirmation"
description: "Verify parity behavior keeps md-generator as the only mutating mode and preserves its measured extraction procedure."
version: 1.0.0.0
id: PB-003
expected_workflow_mode: md-generator
expected_leaf_resources:
  - workflow_mode: md-generator
    leaf_resource_id: references/extraction-workflow.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/source-of-truth-router-card.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/cardinal-rules-card.md
---

# PB-003: md-generator Preservation Confirmation

## 1. OVERVIEW

This scenario verifies that parity behavior does not turn live CSS extraction into advisory design prose or grant mutation rights to the read-only modes.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants to confirm that a live-site style-reference extraction still uses the measured md-generator pipeline after parity refactor work.

**Exact prompt**:
```text
Extract the design system from https://example.com into /tmp/skd-PB003/DESIGN.md, preserve measured CSS evidence, and confirm that md-generator is the only mode allowed to write the output.
```

**Expected mode resolution**: `md-generator`.

**Expected procedure card**: `design-md-generator/procedures/design-system-extraction.md`.

**Why**:
- `hub-router.json` maps `extract design system`, `design.md`, `capture website css`, and `design tokens from url` signals to `md-generator`.
- `mode-registry.json` sets `md-generator` to `backendKind: playwright-extract`, `mutatesWorkspace: true`, and allows `Write`, `Edit`, and `Bash` only for that mode.
- `design-system-extraction.md` requires measured source evidence, visible gaps, and source-traceable values rather than silently filled design prose.

**Expected packet loaded**:
- `design-md-generator/SKILL.md`

**Expected shared resources loaded or cited**:
- UNKNOWN. The md-generator packet guards paths inside its own folder and does not require the parent shared reference base for extraction.

**Expected mode resources loaded or cited**:
- `design-md-generator/procedures/design-system-extraction.md`
- `design-md-generator/references/extraction-workflow.md`
- `design-md-generator/assets/source-of-truth-router-card.md`
- `design-md-generator/assets/cardinal-rules-card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: mutating allowed only for `md-generator`. The response must not imply `interface`, `foundations`, `motion`, or `audit` can write extraction artifacts.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `workflowMode: md-generator`, `backendKind: playwright-extract`, and `mutatesWorkspace: true`.
2. `design-md-generator/procedures/design-system-extraction.md` exists and requires source-traceable extraction evidence.
3. The output path is under `/tmp/skd-PB003/` if live execution is performed.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-PB003-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, selected procedure card, extraction plan or run transcript, output paths, tool surface, and response in `/tmp/skd-PB003-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `md-generator`, the response names `design-md-generator/procedures/design-system-extraction.md`, it confirms only `md-generator` may write extraction artifacts, and live execution either writes sandboxed `/tmp/skd-PB003/` outputs or explicitly records that operator execution is required.
- **FAIL** iff a read-only mode attempts extraction writes, the response invents measured CSS evidence without running extraction, the md-generator pipeline is omitted, or output is directed outside the sandbox.

### Failure Triage

1. If another mode wins, verify the prompt still includes live URL, `extract design system`, and `DESIGN.md` signals.
2. If measured values are fabricated, inspect `design-system-extraction.md` and `source-of-truth-router-card.md`.
3. If tool permissions drift, compare actual tool calls against `mode-registry.json` for all five modes.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: Potentially writes sandbox artifacts only when executed
- **Sandbox**: `/tmp/skd-PB003/`
- **Concurrent-safe**: No
- **Last validated**: Router replay passed in `benchmark/after-009/report.json`; live extraction under `/tmp/skd-PB003/` is required before READY unless the repository owner records an accepted-risk decision.

---
title: "MG-003: Design Fidelity Check"
description: "Verify design fidelity report requests route to md-generator and use validation/report artifacts."
version: 1.0.0.0
---

# MG-003: Design Fidelity Check

## 1. OVERVIEW

This scenario verifies that a design-fidelity check against `DESIGN.md` and `tokens.json` routes to md-generator rather than design-audit.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants visual report artifacts proving the written reference matches extracted tokens.

**Exact prompt**:
```text
Run a design fidelity check for /tmp/skd-MG003/DESIGN.md and its tokens.json, then render the preview report.
```

**Expected mode resolution**: `md-generator`.

**Why**:
- `mode-registry.json` lists `design fidelity check` as an `md-generator` alias.
- `hub-router.json` maps `md-generator-validation` keyword `design fidelity` and `md-generator-artifacts` keywords `design.md` and `playwright` to `md-generator`.
- `design-md-generator/SKILL.md` defines `REPORT` as the optional phase that renders visual HTML preview and diff report artifacts from an existing pair.

**Expected packet loaded**:
- `design-md-generator/SKILL.md`

**Expected shared resources loaded or cited**:
- UNKNOWN. The report path is scoped to the md-generator packet.

**Expected mode resources loaded or cited**:
- `design-md-generator/references/design_md_format.md`
- `design-md-generator/references/quality_checklist.md`
- `design-md-generator/references/anti_patterns.md`
- `design-md-generator/assets/cardinal_rules_card.md`

**Expected pipeline stages named**:
- `VALIDATE`: check fidelity against `tokens.json`.
- `REPORT`: `report-gen.ts` renders token-to-section mapping; `preview-gen.ts` renders visual preview.

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `/tmp/skd-MG003/DESIGN.md` and `/tmp/skd-MG003/tokens.json` exist for a real report run.
2. The operator may stop at routing verification if fixture artifacts are unavailable, marking execution SKIP with blocker details.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MG003-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, resources, validation/report plan, and artifact paths in `/tmp/skd-MG003-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, mode is `md-generator`, packet is `design-md-generator/SKILL.md`, and the response uses validation plus REPORT/preview artifacts rather than a subjective audit.
- **FAIL** iff `audit` wins, the AI scores design quality instead of checking token fidelity, or report artifacts write outside `/tmp/skd-MG003/`.

### Failure Triage

1. If `audit` wins, inspect precedence for the exact alias `design fidelity check` in `mode-registry.json`.
2. If REPORT is missing, inspect `design-md-generator/SKILL.md` Phase 4 guidance.
3. If visual artifacts are written outside the sandbox, stop and rerun with explicit output paths.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: Writes sandbox report artifacts only
- **Sandbox**: `/tmp/skd-MG003/`
- **Concurrent-safe**: No
- **Last validated**: pending manual run

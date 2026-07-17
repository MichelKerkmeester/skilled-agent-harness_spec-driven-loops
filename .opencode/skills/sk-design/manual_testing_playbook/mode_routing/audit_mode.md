---
title: "MDR-004: Audit Mode Routing"
description: "Verify design QA requests resolve to audit and load the design-audit packet."
version: 1.0.0.0
id: MDR-004
expected_workflow_mode: audit
expected_leaf_resources:
  - workflow_mode: audit
    leaf_resource_id: references/corpus_map.md
  - workflow_mode: audit
    leaf_resource_id: references/audit_contract.md
  - workflow_mode: audit
    leaf_resource_id: references/accessibility_performance.md
  - workflow_mode: audit
    leaf_resource_id: references/anti_patterns_production.md
  - workflow_mode: audit
    leaf_resource_id: assets/audit_report_template.md
---

# MDR-004: Audit Mode Routing

## 1. OVERVIEW

This scenario verifies that critique, accessibility, responsive, and anti-slop QA requests route through the `sk-design` hub to `workflowMode: audit`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A team wants a findings-first review before shipping a checkout UI.

**Exact prompt**:
```text
Audit this checkout UI for WCAG contrast, keyboard focus, responsive issues, and design slop.
```

**Expected mode resolution**: `audit`.

**Why**:
- `mode-registry.json` lists `audit` aliases including `design audit`, `ui critique`, `accessibility audit`, `performance audit`, `anti-slop detection`, `production hardening`, `design quality score`, and `P0 P1 design findings`.
- `hub-router.json` maps `audit-aliases`, `audit-quality`, `audit-accessibility`, and `audit-hardening` to `audit`.
- `hub-router.json` includes `wcag contrast` under `audit-accessibility`.

**Expected packet loaded**:
- `design-audit/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`
- `shared/sk_code_handoff.md` if accepted findings are routed to implementation

**Expected mode resources loaded or cited**:
- `design-audit/references/corpus_map.md`
- `design-audit/references/audit_contract.md`
- `design-audit/references/accessibility_performance.md`
- `design-audit/references/anti_patterns_production.md`
- `design-audit/assets/audit_report_template.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: read-only. The `audit` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: audit` and `packet: design-audit`.
2. `hub-router.json` contains audit signal classes.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MDR004-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, resources, tool calls, and response in `/tmp/skd-MDR004-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `audit`, packet is `design-audit/SKILL.md`, and the response is findings-first with accessibility/performance evidence boundaries.
- **FAIL** iff `interface` starts redesigning, `foundations` starts token authoring, or mutating tools are used.

### Failure Triage

1. If another mode wins, verify `audit`, `WCAG`, `keyboard focus`, and `design slop` terms are present.
2. If the report lacks severity or score structure, inspect `design-audit/references/audit_contract.md` and `design-audit/assets/audit_report_template.md`.
3. If implementation begins, verify the registry forbids mutation for `audit`.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-audit/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

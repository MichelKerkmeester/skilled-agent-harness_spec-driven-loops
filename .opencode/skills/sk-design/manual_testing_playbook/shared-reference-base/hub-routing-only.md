---
title: "SR-004: Hub Is Routing Only"
description: "Verify the hub resolves modes through the registry and packet files own per-mode design logic."
version: 1.0.0.0
---

# SR-004: Hub Is Routing Only

## 1. OVERVIEW

This scenario verifies that the parent hub does not flatten per-mode logic. It should route through `mode-registry.json`; the selected packet owns the detailed workflow.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks the AI to explain ownership for an audit task.

**Exact prompt**:
```text
For a design audit, show which packet owns the scoring logic and which hub file only routes.
```

**Expected mode resolution**: `audit`.

**Why**:
- `hub-router.json` maps `design audit` to `audit-aliases` and `audit`.
- `mode-registry.json` maps `workflowMode: audit` to `packet: design-audit` and `packetSkillName: design-audit`.
- `SKILL.md` says the hub holds no per-mode design logic and each mode keeps its own contract in its packet.

**Expected packet loaded**:
- `design-audit/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md` if severity posture is discussed
- `shared/context_loading_contract.md` if readiness or proof claims are discussed

**Expected mode resources loaded or cited**:
- `design-audit/references/audit_contract.md`
- `design-audit/assets/audit_report_template.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80` because this is a design-family routing/ownership prompt.

## 3. TEST EXECUTION

### Preconditions

1. `SKILL.md` states the hub is routing-only.
2. `mode-registry.json` maps `audit` to `design-audit`.
3. `design-audit/SKILL.md` contains the scoring and audit contract.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-SR004-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, source ownership explanation, and loaded resources in `/tmp/skd-SR004-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the AI says the hub routes through `mode-registry.json`, the scoring logic lives in `design-audit/SKILL.md` and its references, and no per-mode audit logic is attributed to the hub.
- **FAIL** iff the AI claims `SKILL.md` owns audit scoring logic, bypasses `mode-registry.json`, or fails to load `design-audit/SKILL.md`.

### Failure Triage

1. If the hub is credited with audit scoring, re-read `SKILL.md` rules and `design-audit/SKILL.md` audit contract.
2. If the registry is bypassed, inspect `mode-registry.json` and the hub routing rule.
3. If shared resources are mistaken for mode logic, inspect `SKILL.md` backend description for shared reference-base boundaries.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-audit/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

---
title: "TV-005: Audit Excluded Transform Aliases"
description: "Verify harden and polish do not route to audit through transform-verb aliasing."
version: 1.0.0.0
---

# TV-005: Audit Excluded Transform Aliases

## 1. OVERVIEW

This scenario verifies that `harden` and `polish` are excluded from audit transform aliasing.

## 2. SCENARIO CONTRACT

**Realistic user request**: A designer asks for visual refinement while explicitly not asking for a findings-first audit report.

**Exact prompt**:
```text
Make this card feel polished and visually hardened without running an audit report.
```

**Expected mode resolution**: `interface`, not `audit`.

**Why**:
- `mode-registry.json` lists `excludedAliases.audit`: `harden` and `polish`.
- `hub-router.json` includes `polish` under `interface-taste`.
- `mode-registry.json` note says audit applies to whether a move should happen; this prompt asks to apply visual refinement and explicitly excludes an audit report.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-interface/references/design-process/design_principles.md`
- `design-interface/references/design-process/brief_to_dials.md`
- `design-interface/assets/interface_preflight_card.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `excludedAliases.audit` with `harden` and `polish`.
2. `hub-router.json` contains `polish` under `interface-taste`.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-TV005-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, resources, and response in `/tmp/skd-TV005-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the prompt resolves `interface`, loads `design-interface/SKILL.md`, and does not route to `audit` from `harden` or `polish`.
- **FAIL** iff `audit` resolves solely because of `harden` or `polish`, or if the AI produces a findings-first audit report despite the prompt excluding it.

### Failure Triage

1. If `audit` wins, inspect whether `excludedAliases.audit` is being applied before audit aliases.
2. If `audit` wins because the prompt was changed to include `accessibility audit`, `design quality score`, or `production hardening`, rerun with the exact prompt.
3. If interface resources are missing, inspect `design-interface/SKILL.md` defaults.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

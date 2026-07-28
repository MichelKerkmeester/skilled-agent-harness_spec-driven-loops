---
title: "MDR-002: Foundations-Flavored Token Routing"
description: "Verify static-token-heavy (OKLCH/typography/spacing/grid) requests still resolve to interface now that the standalone foundations mode is retired."
version: 1.1.0.0
id: MDR-002
expected_workflow_mode: sk-design-interface
expected_leaf_resources: []
---

# MDR-002: Foundations-Flavored Token Routing

---

## 1. OVERVIEW

This scenario verifies that a static visual-system request (the kind that used to route to the retired `foundations` mode) still routes through the `sk-design` hub to `workflowMode: sk-design-interface`, since the former foundations capability folded into `sk-design-interface`.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A dashboard team needs a coherent visual system before code implementation.

**Exact prompt**:
```text
Create an OKLCH color token system, typography scale, spacing rhythm, and responsive grid for this dashboard.
```

**Expected mode resolution**: `interface`.

**Why**:
- `mode-registry.json` lists only `sk-design-interface`, `sk-design-md-generator`, and `sk-design-mcp-open-design` as modes; `foundations` no longer exists as a mode.
- `hub-router.json` routes the `foundations-color`, `foundations-type`, `foundations-layout`, and `foundations-tokens` vocabulary classes into `interface`'s `routerSignals`.

**Expected packet loaded**:
- `sk-design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context-loading-contract.md`

**Known gap (report, do not fail the scenario on this alone)**: as of this writing, `sk-design-interface/SKILL.md`'s machine-parseable `RESOURCE_MAP` has no entries for the physically relocated `references/foundations/**` or `assets/foundations/**` files (color, type, layout, token-starter). The prompt should still resolve to `interface`, but the response may fall through to `DEFAULT_RESOURCE` only rather than citing a specific color/type/layout/token reference. Log that as a routing-completeness finding, separate from this scenario's mode-resolution PASS/FAIL.

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: read-only. The `interface` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

---

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: interface` and `packet: design-interface`.
2. `hub-router.json` contains the `foundations-color`, `foundations-type`, `foundations-layout`, and `foundations-tokens` vocabulary classes routed under `interface`.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MDR002-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture the resolved `workflowMode`, loaded resources, tool calls, and response in `/tmp/skd-MDR002-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `interface`, packet is `sk-design-interface/SKILL.md`, and no mutating tool is used.
- **FAIL** iff `motion`, `md-generator`, or a non-design skill resolves instead, or if mutating tools are used.

### Failure Triage

1. If `motion` or `md-generator` wins, check whether the prompt was accidentally rewritten to emphasize temporal or extraction language.
2. If no color/type/layout/token resource is cited, that is the known `RESOURCE_MAP` gap above, not a routing failure — file it separately rather than blocking this scenario's PASS.

---

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/sk-design-interface/SKILL.md`

---

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

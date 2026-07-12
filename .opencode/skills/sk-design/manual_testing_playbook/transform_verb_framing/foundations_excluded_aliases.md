---
title: "TV-004: Foundations Excluded Transform Aliases"
description: "Verify typeset and colorize do not route to foundations through transform-verb aliasing."
version: 1.0.0.0
---

# TV-004: Foundations Excluded Transform Aliases

## 1. OVERVIEW

This scenario verifies that `typeset` and `colorize` are excluded from foundations transform aliasing.

## 2. SCENARIO CONTRACT

**Realistic user request**: A designer uses loose transformation language that should not be upgraded into a static-system workflow.

**Exact prompt**:
```text
Make it typeset and colorize, but do not create a full token system.
```

**Expected mode resolution**: `interface` as the design-family default, not `foundations`.

**Why**:
- `mode-registry.json` lists `excludedAliases.foundations`: `typeset` and `colorize`.
- `mode-registry.json` does not list `typeset` or `colorize` in `foundations.aliases`.
- `hub-router.json` sets `routerPolicy.defaultMode` to `interface` when no other design axis dominates.
- The prompt explicitly says not to create a full token system, removing the strongest foundations path.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-interface/references/design_process/design_principles.md`
- `design-interface/references/design_process/brief_to_dials.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `excludedAliases.foundations` with `typeset` and `colorize`.
2. `hub-router.json` has `routerPolicy.defaultMode: interface`.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-TV004-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, and response in `/tmp/skd-TV004-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the prompt resolves `interface`, the response does not claim `typeset` or `colorize` are foundations aliases, and no foundations packet loads.
- **FAIL** iff `foundations` resolves solely because of `typeset` or `colorize`.

### Failure Triage

1. If `foundations` wins, inspect whether the router ignored `excludedAliases.foundations`.
2. If `foundations` wins because the prompt was changed to include `typography scale`, `OKLCH`, `design tokens`, or `grid`, rerun with the exact prompt.
3. If the AI asks for clarification, verify it still did not route `typeset` or `colorize` as foundations aliases.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run

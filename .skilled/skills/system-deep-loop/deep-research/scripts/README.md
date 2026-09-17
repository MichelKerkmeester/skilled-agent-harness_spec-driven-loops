---
title: "Deep-research scripts"
description: "Code-facing entrypoints for research pivots, state reduction, runtime capability checks and YAML path validation."
trigger_phrases:
  - "deep-research scripts"
  - "research script entrypoints"
---

# Deep-research scripts

---

## 1. OVERVIEW

`.opencode/skills/system-deep-loop/deep-research/scripts/` contains the code entrypoints used by the deep-research workflow. The modules cover divergent research pivots, state reduction and sparkline output, runtime capability reporting and YAML-backed script path checks.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `divergent-research-pivot.ts` | Implements the divergent research pivot entrypoint. |
| `reduce-state-sparkline.test.cjs` | Tests the state-reduction sparkline behavior. |
| `reduce-state.cjs` | Reduces loop state for compact reporting. |
| `runtime-capabilities.cjs` | Reports runtime capabilities used by the research workflow. |
| `verify-yaml-script-paths.sh` | Validates script paths referenced by YAML workflow assets. |

---

## 3. BOUNDARIES

The folder owns research-specific script entrypoints and their focused test. Workflow routing and loop policy remain in the owning skill documentation.

---

## 4. VALIDATION

Use the source-specific command documented by the owning deep-research skill. The inventory above is the current navigation surface.

---

## 5. RELATED

- [`Deep-research skill`](../SKILL.md)

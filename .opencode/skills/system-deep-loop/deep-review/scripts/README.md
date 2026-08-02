---
title: "Deep-review scripts"
description: "Code-facing entrypoints for review pivots, contract snapshots, runtime capability checks and review tests."
trigger_phrases:
  - "deep-review scripts"
  - "review script entrypoints"
---

# Deep-review scripts

---

## 1. OVERVIEW

`.opencode/skills/system-deep-loop/deep-review/scripts/` contains the code entrypoints used by the deep-review workflow. The folder has review pivot logic, contract snapshot rendering, runtime capability reporting and a nested test area.

## 2. CONTENTS

| Entry | Responsibility |
|---|---|
| `divergent-review-pivot.ts` | Implements the divergent review pivot entrypoint. |
| `render-contract-snapshot.cjs` | Renders the review contract snapshot. |
| `runtime-capabilities.cjs` | Reports runtime capabilities used by the review workflow. |
| `tests/` | Holds review-specific test sources. |

## 3. BOUNDARIES

The folder owns review-specific script entrypoints and delegates workflow policy to the owning deep-review skill. The nested `tests/` directory is the test boundary for this script surface.

## 4. VALIDATION

Use the source-specific command documented by the owning deep-review skill. The inventory above is the current navigation surface.

## 5. RELATED

- [`Deep-review skill`](../SKILL.md)

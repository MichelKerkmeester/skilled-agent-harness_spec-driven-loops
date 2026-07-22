---
title: "Synthesis: shared resource-map render seam"
description: "Re-export seam for the resource-map markdown renderer shared deep-loop research and review reducers consume."
---

# Synthesis

---

## 1. OVERVIEW

Shared re-export seam for `emitResourceMap`, the workflow output renderer that research and review reducers call to render resource-map markdown. The single implementation lives in `system-spec-kit`. This folder re-exports it so callers under `system-deep-loop` reach it through a shared local path, and the rendered markdown stays byte-identical to the original renderer.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `resource-map.cjs` | Re-exports `emitResourceMap` (and sibling exports) from `system-spec-kit/scripts/resource-map/extract-from-evidence.cjs`. Carries no logic of its own. |

## 3. CONSUMERS

- `deep-research/scripts/reduce-state.cjs`
- `runtime/scripts/reduce-state.cjs`
- `runtime/lib/write-set-conflict-graph/shipped-census.ts`
- `runtime/lib/cross-mode-closures/parity.ts`

## 4. RELATED

- [`system-spec-kit/scripts/resource-map/extract-from-evidence.cjs`](../../../system-spec-kit/scripts/resource-map/extract-from-evidence.cjs) (single implementation)

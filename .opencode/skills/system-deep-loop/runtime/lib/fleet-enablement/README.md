---
title: "Fleet Enablement: Serial Per-Mode Authority Moves"
description: "Derives each mode's projected surfaces from the shared manifest and drives the remaining modes through enablement one at a time, stopping at the first failure with resumable state."
---

# Fleet Enablement

---

## 1. OVERVIEW

Runtime primitives for enabling the non-pilot `system-deep-loop` modes one at a time. Authority moves per mode and never in a batch, so the driver awaits a single mode per step, records what completed on disk, and stops at the first failure rather than continuing into modes whose predecessors did not pass.

Surface attribution is derived rather than assumed. The legacy projection manifest is shared across every flip mode and carries no mode field, so the derivation owns a prefix-ownership table that keeps mode-to-surface mapping in one place beside the frozen mode order. It reports two facts a caller would otherwise miss: a mode whose projectable set is empty, where a reader contract would pass without checking anything, and a pair of modes that share a surface prefix, where a per-mode contract cannot separate them.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mode-surface-map.ts` | `FLEET_MODE_ORDER` and `deriveModeSurfaceSet`: per-mode surfaces, readers, empty-projectable and shared-prefix flags derived from the projection manifest |
| `enablement-driver.ts` | `runFleetEnablement` and `readEnablementState`: the serial loop, its dry run, stop-on-first-failure, and the external state file it resumes from |
| `index.ts` | Public API barrel |

---

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs`

---

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/fleet-enablement.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/enable-modes-cli.vitest.ts`

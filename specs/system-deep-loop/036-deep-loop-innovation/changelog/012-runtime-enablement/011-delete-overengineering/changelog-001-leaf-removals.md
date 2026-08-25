---
title: "Changelog: Leaf Removals [012-runtime-enablement/011-delete-overengineering/001-leaf-removals]"
description: "F5 hierarchical-budgets shadow-adapters, F6 receipts legacy-recovery manifest, and F8 dead AUTHORITY_FLIP_COMMON constants removed with barrel and test references severed first."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-24

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/001-leaf-removals` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering`

### Summary

Wave 1 of the over-engineering removal program deleted three independent zero-caller leaves (F5, F6, F8) with no live-loop adjacency. Barrel re-exports and test references were severed before each file deletion so the typechecker never observed a dangling import.

### What Changed

- Deleted `lib/hierarchical-budgets/shadow-adapters.ts` (F5 — dead shadow-parity comparison wrappers).
- Deleted `lib/receipts-and-effect-recovery/legacy-compatibility.ts` (F6 — dead recovery-surface manifest and dispatch-receipt assessor).
- Removed dead `AUTHORITY_FLIP_COMMON_MODE` / `AUTHORITY_FLIP_COMMON_VARIANTS` from `per-mode-authority-flip/types.ts` and its barrel re-export (F8).
- Severed barrel re-exports in `hierarchical-budgets/index.ts`, `receipts-and-effect-recovery/index.ts`, and `per-mode-authority-flip/index.ts`.
- Removed shadow-parity and legacy-recovery test blocks from the two affected vitest files; cleaned two stale README references in a residue sweep.

### Status

Complete. Typecheck held at 57 baseline errors (0 new `TS2307`); authority 8/8 `new_authoritative_final`; suite failing set unchanged by name.

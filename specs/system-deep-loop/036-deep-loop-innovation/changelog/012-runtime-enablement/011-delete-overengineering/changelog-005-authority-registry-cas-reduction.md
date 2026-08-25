---
title: "Changelog: Authority Registry CAS Reduction [012-runtime-enablement/011-delete-overengineering/005-authority-registry-cas-reduction]"
description: "F7 CAS-mutator reduction of authority-registry.ts plus resequenced F4 flip-authority.cjs removal, keeping the read path and lock family byte-for-byte."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/005-authority-registry-cas-reduction` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering`

### Summary

Wave 5 (final) reduced `authority-registry.ts` (F7) — the highest-adjacency wave — by removing the four CAS mutators, their private per-mode lock-path helper, and three orphaned input interfaces (637 → 298 LOC) while keeping the read path, lock-reclaim family, and pending-transition trio byte-for-byte. The resequenced F4 (`flip-authority.cjs`) and its test files were removed here too so `authority-finalize.vitest.ts` could be deleted whole rather than split across two waves.

### What Changed

- Removed four CAS mutators (`prepareCutover`, `compareAndSwap`, `compareAndSwapRollback`, `compareAndSwapFinalize`), `#writeRollbackFinalRecord`, `#lockPath()`, and three input interfaces from `authority-registry.ts`.
- Dropped two orphaned type exports from `per-mode-authority-flip/index.ts`.
- Removed CAS test blocks from `per-mode-authority-flip.vitest.ts`; kept read/lock/selector coverage.
- Rewrote `flipAuthority()` in `deep-research-postflip-fanout.vitest.ts` to seed the post-flip record directly instead of via the removed CAS API.
- Deleted `scripts/flip-authority.cjs` (F4, resequenced from phase 004), `flip-authority-cli.vitest.ts`, and the whole `authority-finalize.vitest.ts` file.

### Status

Complete. Typecheck held at 56 baseline errors (0 `TS2307`); authority 8/8 `new_authoritative_final`, epoch 3, unchanged; targeted tests 24/24 green; suite failing set unchanged by name. Program complete; operator ff-merge gate is the remaining integration step.

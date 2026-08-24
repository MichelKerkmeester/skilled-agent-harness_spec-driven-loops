---
title: "Checklist: Phase 005 Authority Registry CAS Reduction"
description: "Acceptance checklist for the F4+F7 authority-registry.ts CAS-mutator reduction wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/005-authority-registry-cas-reduction"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 005 Authority Registry CAS Reduction

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] Phase `004-rollout-flip-tooling` confirmed green and integrated (`07cba092ec`); `enable-modes.cjs` absent. `flip-authority.cjs` still present because F4 was resequenced into this phase.
- [x] Fresh baseline captured (tsc 56 errors / 0 `TS2307`; runtime failing-set by name) — `scratch/tsc-baseline-005.txt`.
- [x] Repo-wide re-grep for the CAS mutators clean except the known survivor (`deep-research-postflip-fanout.vitest.ts`) and the definitions/tests this wave removes.

### Survivor Fix (landed in the same atomic change as the mutator removal)
- [x] `deep-research-postflip-fanout.vitest.ts`'s `flipAuthority()` no longer calls `prepareCutover` or `compareAndSwap`.
- [x] That file's own suite run passes (targeted run with `per-mode-authority-flip.vitest.ts`: 24/24).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] `index.ts` barrel: `AuthorityPrepareCutoverInput` and `AuthorityCompareAndSwapRollbackInput` dropped; `AuthorityCompareAndSwapInput` and `AuthorityPendingTransition` still exported.
- [x] `authority-registry.ts`: `prepareCutover()`, `compareAndSwap()`, `compareAndSwapRollback()`, `#writeRollbackFinalRecord`, `compareAndSwapFinalize()` removed.
- [x] `authority-registry.ts`: `AuthorityPrepareCutoverInput`, `AuthorityCompareAndSwapRollbackInput`, `AuthorityCompareAndSwapFinalizeInput` interfaces removed.
- [x] `authority-registry.ts`: `#lockPath()` removed.
- [x] `authority-registry.ts`: `read()`, `defaultRecord()`, `withTransactionLock()`, and the full lock-reclaim family — all still present (kept anchors confirmed by grep; 637 → 298 LOC via boundary-asserted transform).
- [x] `authority-registry.ts`: `preparePendingTransition()`, `readPendingTransition()`, `clearPendingTransition()`, `AuthorityPendingTransition`, `AuthorityCompareAndSwapInput`, `isAdmittedAuthorityWriter()`, `isValidPendingTransition()` — all still present.
- [x] `per-mode-authority-flip.vitest.ts`: 7 `compareAndSwap` `it()` blocks removed; read-default, tampered-record, and `withTransactionLock` tests remain.
- [x] `per-mode-authority-flip.vitest.ts`: `describe('prepareCutover', ...)` removed in full.
- [x] `per-mode-authority-flip.vitest.ts`: `describe('compareAndSwapRollback', ...)` removed in full.
- [x] `per-mode-authority-flip.vitest.ts`: `describe('stale-lock reclaim', ...)` — only the per-mode-CAS-lock `it()` removed; the other four remain. Unused `chmodSync`/`readFileSync`/`AuthorityRoute` imports dropped.
- [x] `authority-finalize.vitest.ts` deleted (whole). `flip-authority.cjs` + `flip-authority-cli.vitest.ts` deleted (F4, resequenced here).
- [x] No other file touched (scope-lock). Known residue: `seedAuthorityRecord()` helper now unreferenced but left in place — outside the enumerated edit list.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] tsc: no new `TS2307`, total ≤ baseline. Evidence: 56 → 56, `TS2307` 0, no new error on any removed symbol (`/tmp/tsc-after-005.txt`).
- [x] authority: 8/8 `new_authoritative_final`, `allOnLedger` true. Evidence: `verify-authority.cjs` — 8/8 final, epoch 3.
- [x] runtime suite: failing set unchanged by name. Evidence: `scratch/suite-after-005.log` — by-name diff vs baseline = zero new failures.
- [x] `per-mode-authority-flip.vitest.ts` passes in full. Evidence: targeted run passed.
- [x] `deep-research-postflip-fanout.vitest.ts` passes in full. Evidence: targeted run passed (gateway watermark / perturbation / restoration assertions green with the directly-seeded record).
- [x] mode-append-gateway suite passes. Evidence: not in the suite's failing set.
- [x] residue rg: zero non-deleted references. Evidence: removed method calls / interfaces / `#lockPath` / `#writeRollbackFinalRecord` all 0 (the `#lockPath` hits in `immutable-frame-store.ts` are a different class).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — this is a reduction wave, not a bug fix; finding-class and producer-inventory categories do not
apply. Completeness criteria are defined in `spec.md` REQUIREMENTS and SUCCESS CRITERIA instead.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

No new input-handling or secrets surface is introduced. Adjacency risk to the fail-closed authorization
boundary is tracked in `spec.md` RISKS & DEPENDENCIES and mitigated by leaving the read path and
lock-reclaim family untouched (see `spec.md` §8 KEEP LIST). The critical authority gate stayed green: 8/8
modes `new_authoritative_final`, `allOnLedger` true, after the reduction.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] Parent PHASE MAP row for `005-authority-registry-cas-reduction` flipped to Complete; realized LOC total noted against the provisional "~500".
- [x] `graph-metadata.json` `last_active_child_id` set to 005 — the final wave; the `011-delete-overengineering` program is complete.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Temp files in scratch/ only.
- [x] scratch/ cleaned before completion.
- [x] One commit, `<100` files, guard respected.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 31 | 31 |

**Verification Date**: 2026-08-24 (Status: Complete — all gates green; read path + lock family confirmed untouched; F4 folded in)
<!-- /ANCHOR:summary -->

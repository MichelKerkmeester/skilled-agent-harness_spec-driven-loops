---
title: "Checklist: Phase 005 Authority Registry CAS Reduction"
description: "Acceptance checklist for the F7 authority-registry.ts CAS-mutator reduction wave."
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

- [ ] Phase `004-rollout-flip-tooling` confirmed deleted and green (`enable-modes.cjs`, `flip-authority.cjs` absent).
- [ ] Fresh baseline captured (tsc error count, runtime failing-set by name) — phase 001's baseline is stale.
- [ ] Repo-wide re-grep for `prepareCutover` / `compareAndSwap` / `compareAndSwapRollback` / `compareAndSwapFinalize` clean except for the known survivor (`deep-research-postflip-fanout.vitest.ts`) and the definitions/tests this wave removes.

### Survivor Fix (must land before mutator removal)
- [ ] `deep-research-postflip-fanout.vitest.ts`'s `flipAuthority()` no longer calls `prepareCutover` or `compareAndSwap`.
- [ ] That file's own suite run passes in isolation before proceeding.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] `index.ts` barrel: `AuthorityPrepareCutoverInput` and `AuthorityCompareAndSwapRollbackInput` dropped from type exports; `AuthorityCompareAndSwapInput` and `AuthorityPendingTransition` still exported.
- [ ] `authority-registry.ts`: `prepareCutover()`, `compareAndSwap()`, `compareAndSwapRollback()`, `#writeRollbackFinalRecord`, `compareAndSwapFinalize()` removed.
- [ ] `authority-registry.ts`: `AuthorityPrepareCutoverInput`, `AuthorityCompareAndSwapRollbackInput`, `AuthorityCompareAndSwapFinalizeInput` interfaces removed.
- [ ] `authority-registry.ts`: `#lockPath()` removed.
- [ ] `authority-registry.ts`: `read()`, `defaultRecord()`, `withTransactionLock()`, and the full lock-reclaim family (`#acquireLock`, `#releaseLock`, `#isLockStale`, `isPidAlive`, `isLockHolderRecord`, `LockHolderRecord`, `DEFAULT_STALE_LOCK_TTL_MS`, `#transactionLockPath()`) — all still present, byte-for-byte unchanged.
- [ ] `authority-registry.ts`: `preparePendingTransition()`, `readPendingTransition()`, `clearPendingTransition()`, `AuthorityPendingTransition`, `AuthorityCompareAndSwapInput`, `isAdmittedAuthorityWriter()`, `isValidPendingTransition()` — all still present, untouched.
- [ ] `per-mode-authority-flip.vitest.ts`: 7 `compareAndSwap` `it()` blocks removed; read-default test, tampered-record test, and `withTransactionLock` test remain.
- [ ] `per-mode-authority-flip.vitest.ts`: `describe('prepareCutover', ...)` removed in full.
- [ ] `per-mode-authority-flip.vitest.ts`: `describe('compareAndSwapRollback', ...)` removed in full.
- [ ] `per-mode-authority-flip.vitest.ts`: `describe('stale-lock reclaim', ...)` — only the per-mode-CAS-lock `it()` removed; the other four `it()` blocks remain.
- [ ] `authority-finalize.vitest.ts` does not exist (deleted here, or already gone from phase 004 — confirmed either way, not assumed).
- [ ] No other file touched (scope-lock).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] tsc: no new `TS2307`, total at or below fresh baseline. Evidence: __________
- [ ] authority: 8/8 `new_authoritative_final`, `allOnLedger` true. Evidence: __________
- [ ] runtime suite: failing set unchanged by name. Evidence: __________
- [ ] `per-mode-authority-flip.vitest.ts` passes in full. Evidence: __________
- [ ] `deep-research-postflip-fanout.vitest.ts` passes in full. Evidence: __________
- [ ] mode-append-gateway suite passes. Evidence: __________
- [ ] residue rg: zero non-deleted references to any removed symbol/interface/path. Evidence: __________
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
lock-reclaim family untouched (see `spec.md` §8 KEEP LIST).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] Parent PHASE MAP row for `005-authority-registry-cas-reduction` flipped to Complete; note the realized LOC total against the parent's provisional "~500" estimate (spec.md §9.5).
- [ ] `graph-metadata.json` `last_active_child_id` set — this is the last wave; the parent packet's `011-delete-overengineering` program is complete once this closes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] Temp files in scratch/ only.
- [ ] scratch/ cleaned before completion.
- [ ] One commit, `<100` files, guard respected.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 31 | Pending execution |

**Verification Date**: Not yet executed (Status: Planned)
<!-- /ANCHOR:summary -->

---
title: "Tasks: Phase 005 Authority Registry CAS Reduction"
description: "Ordered reduction manifest for F7 — gate on phase 004, fix the known survivor, sever the barrel, remove the mutators, trim tests, verify."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/005-authority-registry-cas-reduction"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 005 Authority Registry CAS Reduction

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Order matters more here than in earlier waves: this file sits next to the authorization boundary, and one
caller (T2) must be fixed **before** the mutators it calls can be deleted. All paths are under
`.opencode/skills/system-deep-loop/runtime/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T0 — Gate on Phase 004 (orchestrator, read-only)
- [ ] Confirm `scripts/enable-modes.cjs` and `scripts/flip-authority.cjs` no longer exist.
- [ ] Confirm phase `004-rollout-flip-tooling`'s own tsc/authority/suite gates are green.
- [ ] STOP — do not proceed to T1 — if either check fails.

### T1 — Re-confirm zero callers, repo-wide (remover, read-only)
- [ ] `rg -n "prepareCutover"` across the whole repo (not just `runtime/`) — expect only `authority-registry.ts`'s own definition.
- [ ] `rg -n "\.compareAndSwap\("` across the whole repo — expect only `authority-registry.ts`'s own definition plus test call sites listed in T5/T6.
- [ ] `rg -n "compareAndSwapRollback"` — expect only `authority-registry.ts`'s own definition plus `per-mode-authority-flip.vitest.ts`'s `describe('compareAndSwapRollback', ...)`.
- [ ] `rg -n "compareAndSwapFinalize"` — expect only `authority-registry.ts`'s own definition plus `authority-finalize.vitest.ts`.
- [ ] Check `tests/unit/authority-finalize.vitest.ts` state: still present (proceed to T7), or already removed by phase 004 (skip T7, note it as already-satisfied).
- [ ] STOP and report if any hit lands outside the files named in spec.md §3, or if a caller beyond `deep-research-postflip-fanout.vitest.ts` (already known, see T2) turns up.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 — Fix the known survivor FIRST (remover)
- [ ] `tests/integration/deep-research-postflip-fanout.vitest.ts`: rewrite `flipAuthority()` to construct the target `AuthorityRecord` directly (`state: 'new_authoritative_reversible'`, `epoch: 2`, `selectedWriter: 'dark'`, the same `candidateSha`/`policyVersion`/digest values the current CAS calls pass, `recordDigest` computed the same way `authority-registry.ts` computes it) and write it with `writeCanonicalJsonAtomic` — no `prepareCutover` or `compareAndSwap` call remains in this file.
- [ ] Do not change the function's return type or the `registry.read(MODE)` call the rest of the file depends on.
- [ ] Run only this file: `vitest run tests/integration/deep-research-postflip-fanout.vitest.ts` — must pass before continuing to T3.

### T3 — Sever the barrel (edits first)
- [ ] `lib/per-mode-authority-flip/index.ts`: remove `AuthorityPrepareCutoverInput` and `AuthorityCompareAndSwapRollbackInput` from the `export type { ... }` list. Leave `AuthorityCompareAndSwapInput` and `AuthorityPendingTransition` in place — `preparePendingTransition`/`readPendingTransition` still need them.

### T4 — Remove the mutators from `authority-registry.ts`
- [ ] Remove `prepareCutover()` and its doc comment.
- [ ] Remove `compareAndSwap()` and its doc comment.
- [ ] Remove `compareAndSwapRollback()`, its doc comment, and its private helper `#writeRollbackFinalRecord`.
- [ ] Remove `compareAndSwapFinalize()` and its doc comment.
- [ ] Remove the now-orphaned `AuthorityPrepareCutoverInput`, `AuthorityCompareAndSwapRollbackInput`, `AuthorityCompareAndSwapFinalizeInput` interfaces.
- [ ] Remove `#lockPath()` — its only callers were the four removed methods.
- [ ] Do **not** remove: `read()`, `defaultRecord()`, `withTransactionLock()`, `#acquireLock`, `#releaseLock`, `#isLockStale`, `isPidAlive()`, `isLockHolderRecord()`, `LockHolderRecord`, `DEFAULT_STALE_LOCK_TTL_MS`, `#transactionLockPath()`, `preparePendingTransition()`, `readPendingTransition()`, `clearPendingTransition()`, `AuthorityPendingTransition`, `AuthorityCompareAndSwapInput`, `isAdmittedAuthorityWriter()`, `isValidPendingTransition()`.

### T5 — Trim `per-mode-authority-flip.vitest.ts`
- [ ] Remove the 7 `compareAndSwap` `it()` blocks interleaved under `describe('AuthorityRegistry', ...)` (the flip, stale-epoch, state-mismatch, resume-idempotent, writer-rejected, writer-guard-before-lock, and dark-writer-admitted tests). Leave the read-default test, the tampered-record test, and the `withTransactionLock` "serializes transactions" test in place — they are interleaved with the ones being removed, not contiguous.
- [ ] Remove `describe('prepareCutover', ...)` in full.
- [ ] Remove `describe('compareAndSwapRollback', ...)` in full.
- [ ] In `describe('stale-lock reclaim', ...)`: remove only the fifth `it()` ("reclaims a per-mode CAS lock left by a dead process..."), which is the one that calls `compareAndSwap()`. Leave the other four `it()` blocks (all exercised through `withTransactionLock()`) untouched.
- [ ] Confirm `cutoverReadyRecord()` and `seedAuthorityRecord()` helpers are still referenced by at least one remaining test (the tampered-record test) — do not remove them.

### T6 — Delete `authority-finalize.vitest.ts` (conditional on T1's finding)
- [ ] If still present: delete the file in full — every describe in it (`AuthorityRegistry.compareAndSwapFinalize`, `flip-authority.cjs — finalizeOneMode`, `flip-authority.cjs --finalize --dry-run`) tests a target this phase or phase 004 has removed.
- [ ] If already removed by phase 004: no action; note it in the commit message as already-satisfied.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T7 — Verify (orchestrator runs; devin cannot run vitest)
- [ ] `node .../typescript/bin/tsc -p runtime/tsconfig.json` → no new `TS2307`; error count at or below a fresh baseline.
- [ ] `node runtime/scripts/verify-authority.cjs` → 8 modes `new_authoritative_final`, `allOnLedger` true.
- [ ] Runtime suite (`vitest run --reporter=dot`) → failing set unchanged by name vs a fresh baseline.
- [ ] Explicit pass confirmation: `per-mode-authority-flip.vitest.ts`, `deep-research-postflip-fanout.vitest.ts`, mode-append-gateway suite.
- [ ] `rg` re-scan of every deleted symbol/interface → zero non-deleted references.

### T8 — Commit
- [ ] One conventional commit, `<100` files, mass-deletion guard respected (not overridden).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All verification gates pass (see `spec.md` SUCCESS CRITERIA / `plan.md` TESTING STRATEGY)
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

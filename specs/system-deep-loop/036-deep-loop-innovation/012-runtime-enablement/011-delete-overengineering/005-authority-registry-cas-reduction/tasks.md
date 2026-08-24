---
title: "Tasks: Phase 005 Authority Registry CAS Reduction"
description: "Ordered reduction manifest for F4+F7 — gate on phase 004, fix the known survivor, sever the barrel, remove the mutators, trim tests, delete the flip runner, verify."
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

Order matters more here than in earlier waves: this file sits next to the authorization boundary. All
edits landed in one working-tree state (one atomic commit), so no intermediate broken state is committed;
the `flipAuthority()` survivor fix (T2) and the mutator removal (T4) travel together. All paths are under
`.opencode/skills/system-deep-loop/runtime/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T0 — Gate on Phase 004 (orchestrator, read-only)
- [x] `scripts/enable-modes.cjs` gone (phase 004). `scripts/flip-authority.cjs` still present at wave start —
  F4 was resequenced into THIS phase, so this phase deletes it (see spec.md §2).
- [x] Phase `004-rollout-flip-tooling` landed green (`07cba092ec`, integrated to v4/main).

### T1 — Re-confirm callers, repo-wide (read-only)
- [x] `rg` for `prepareCutover` / `.compareAndSwap(` / `compareAndSwapRollback` / `compareAndSwapFinalize` —
  the only production/live caller of the CAS API besides the removed scripts was
  `deep-research-postflip-fanout.vitest.ts`'s `flipAuthority()` (handled in T2); the registry's own
  definitions and the two trimmed test files were the rest.
- [x] `authority-finalize.vitest.ts` still present at wave start (phase 004 did not touch it) → T6 deletes it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 — Fix the known survivor (`flipAuthority()` rewrite)
- [x] `tests/integration/deep-research-postflip-fanout.vitest.ts`: `flipAuthority()` rewritten to construct
  the target `AuthorityRecord` directly (`new_authoritative_reversible`, `epoch: 2`, `dark`, the same
  `candidateSha`/`policyVersion`/digest values, `recordDigest = sha256Bytes(canonicalBytes(core))`) and
  write it with `writeCanonicalJsonAtomic`; no `prepareCutover`/`compareAndSwap` call remains.
- [x] Return type and the `registry.read(MODE)` call unchanged; added the `writeCanonicalJsonAtomic` import.
- [x] Targeted run of this file (with `per-mode-authority-flip.vitest.ts`) passed: 24/24.

### T3 — Sever the barrel
- [x] `lib/per-mode-authority-flip/index.ts`: removed `AuthorityPrepareCutoverInput` and
  `AuthorityCompareAndSwapRollbackInput` from the `export type` list; kept `AuthorityCompareAndSwapInput`
  and `AuthorityPendingTransition`.

### T4 — Remove the mutators from `authority-registry.ts`
- [x] Removed `prepareCutover()`, `compareAndSwap()`, `compareAndSwapRollback()` (+ `#writeRollbackFinalRecord`),
  `compareAndSwapFinalize()` and their doc comments.
- [x] Removed the orphaned `AuthorityPrepareCutoverInput`, `AuthorityCompareAndSwapRollbackInput`,
  `AuthorityCompareAndSwapFinalizeInput` interfaces and the `#lockPath()` helper.
- [x] KEPT the full read path + lock-reclaim family + pending-transition trio (§8) byte-for-byte
  (637 → 298 LOC). Boundary-asserted transform; kept anchors confirmed present.

### T5 — Trim `per-mode-authority-flip.vitest.ts`
- [x] Removed the 7 interleaved `compareAndSwap` `it()` blocks; kept the read-default, tampered-record, and
  `withTransactionLock` serialize tests.
- [x] Removed `describe('prepareCutover', ...)` and `describe('compareAndSwapRollback', ...)` in full.
- [x] In `describe('stale-lock reclaim', ...)` removed only the fifth `it()` (per-mode CAS lock reclaim);
  kept the four `withTransactionLock()`-based reclaim tests.
- [x] Dropped the now-unused `chmodSync` / `readFileSync` fs imports and the `AuthorityRoute` type import.
  `cutoverReadyRecord()` stays (tampered-record test). `seedAuthorityRecord()` is now unreferenced but left
  in place — removing it is outside this wave's enumerated edit list (scope-lock); noted as a limitation.

### T6 — Delete dead test files + the resequenced F4 runner
- [x] Deleted `tests/unit/authority-finalize.vitest.ts` (whole — every describe tested a removed target).
- [x] Deleted `scripts/flip-authority.cjs` (F4).
- [x] Deleted `tests/unit/flip-authority-cli.vitest.ts` (F4).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T7 — Verify (orchestrator runs; devin cannot run vitest)
- [x] `tsc -p runtime/tsconfig.json` → 56 errors (== fresh baseline), 0 `TS2307`, no new error on any removed symbol.
- [x] `node runtime/scripts/verify-authority.cjs` → 8 modes `new_authoritative_final`, `allOnLedger` true, epoch 3.
- [x] Runtime suite (`vitest run --reporter=dot`) → failing set unchanged by name vs baseline.
- [x] Explicit pass: `per-mode-authority-flip.vitest.ts` + `deep-research-postflip-fanout.vitest.ts` (24/24 targeted).
- [x] `rg` re-scan of every removed method/interface/`#lockPath` → zero non-deleted references.

### T8 — Commit
- [x] One conventional commit, `<100` files, mass-deletion guard respected (not overridden).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All verification gates pass (see `spec.md` SUCCESS CRITERIA / `plan.md` TESTING STRATEGY)
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

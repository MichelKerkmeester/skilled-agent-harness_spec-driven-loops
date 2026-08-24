---
title: "Phase 005: Authority Registry CAS Reduction — Reduce, Not Delete"
description: "Wave 5 (final) of the over-engineering removal program: remove the CAS-mutator methods (prepareCutover, compareAndSwap, compareAndSwapRollback, compareAndSwapFinalize) from per-mode-authority-flip/authority-registry.ts once their only production callers (phase 004's enable-modes.cjs and flip-authority.cjs) are gone, keeping the load-bearing read path and the lock-reclaim machinery intact. High-adjacency to the fail-closed authorization gateway; runs last and only after phase 004 is green."
trigger_phrases:
  - "authority registry cas reduction"
  - "authority registry mutator removal"
  - "reduce authority-registry.ts"
importance_tier: "critical"
contextType: "implementation"
status: complete
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Phase 005: Authority Registry CAS Reduction

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | .../011-delete-overengineering/005-authority-registry-cas-reduction |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Risk** | High-adjacency — sits next to the fail-closed authorization gateway |
| **Findings** | F4, F7 (see parent `research/research.md`) — F4 (`flip-authority.cjs`) resequenced into this phase from 004; see §2 |
| **Order** | Wave 5, LAST — ran after Phase `004-rollout-flip-tooling` (F3) landed and was green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`lib/per-mode-authority-flip/authority-registry.ts` (637 LOC) is a file-scoped, lock-guarded, mode-keyed
authority CAS store. It has two faces: a **read path** every live production consumer depends on, and a
**write/mutate path** (`prepareCutover`, `compareAndSwap`, `compareAndSwapRollback`,
`compareAndSwapFinalize`) whose only production callers are the one-time rollout/flip tooling
(`enable-modes.cjs`, `flip-authority.cjs`) that phase `004-rollout-flip-tooling` deletes. All 8 deep-loop
modes are already finalized to `new_authoritative_final`; once phase 004 lands, nothing in production ever
calls the mutators again.

This is a **reduction, not a whole-file delete**: ~330 LOC of mutator methods, their now-orphaned input
interfaces, and one lock-path helper come out; the read path, the lock-reclaim machinery, and the
untouched pending-transition trio stay byte-for-byte unchanged. See §8 for the full KEEP list and §9 for
investigation findings that correct and extend the parent audit's F7 write-up.

**F4 resequenced into this phase.** Phase 004 originally owned F4 (`flip-authority.cjs`). It was moved here
because `flip-authority.cjs` and the F7 CAS mutator `compareAndSwapFinalize` share the
`authority-finalize.vitest.ts` test file; removing them together lets that file be deleted whole rather
than split across two waves. So this phase also deletes `flip-authority.cjs` and
`flip-authority-cli.vitest.ts` alongside the CAS reduction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Surface | Change |
|---------|--------|
| `runtime/lib/per-mode-authority-flip/authority-registry.ts` | Remove `prepareCutover()`, `compareAndSwap()`, `compareAndSwapRollback()` (+ its private `#writeRollbackFinalRecord` helper), `compareAndSwapFinalize()`; remove the now-orphaned `AuthorityPrepareCutoverInput`, `AuthorityCompareAndSwapRollbackInput`, `AuthorityCompareAndSwapFinalizeInput` interfaces; remove the per-mode lock-path helper `#lockPath()` (used only by the four removed methods) |
| `runtime/lib/per-mode-authority-flip/index.ts` | Barrel: drop `AuthorityPrepareCutoverInput` and `AuthorityCompareAndSwapRollbackInput` from the `export type { ... }` list |
| `runtime/tests/unit/per-mode-authority-flip.vitest.ts` | Remove the 7 `compareAndSwap` `it()` blocks (interleaved under the flat `describe('AuthorityRegistry', ...)`, not their own sub-describe), the `describe('prepareCutover', ...)` block, the `describe('compareAndSwapRollback', ...)` block, and the one per-mode-lock-reclaim `it()` inside `describe('stale-lock reclaim', ...)` |
| `runtime/tests/unit/authority-finalize.vitest.ts` | Deleted whole — dead after this phase + F4 (§9.4) |
| `runtime/scripts/flip-authority.cjs` | Deleted (F4 — resequenced from phase 004; the one-time per-mode authority-flip runner) |
| `runtime/tests/unit/flip-authority-cli.vitest.ts` | Deleted (F4 — resequenced from phase 004; tests the deleted runner) |
| `runtime/tests/integration/deep-research-postflip-fanout.vitest.ts` | Rewrite the `flipAuthority()` helper to seed the target `AuthorityRecord` directly via `writeCanonicalJsonAtomic`, instead of calling `prepareCutover` + `compareAndSwap` — **blocking precondition, see §9.3** |

### Out of Scope

- `AuthorityRegistry.read()`, the internal `defaultRecord()` fallback, `isValidAuthorityRecord()`,
  `selectAuthorityRoute()`, `AUTHORITY_FLIP_MODE_ORDER` — the read path. Do not touch.
- `withTransactionLock()` and every lock-reclaim primitive it depends on (`#acquireLock`,
  `#releaseLock`, `#isLockStale`, `isPidAlive`, `isLockHolderRecord`, `LockHolderRecord`,
  `DEFAULT_STALE_LOCK_TTL_MS`, `#transactionLockPath()`) — load-bearing, see §9.2. Do not touch.
- `preparePendingTransition()`, `readPendingTransition()`, `clearPendingTransition()`,
  `AuthorityPendingTransition`, `AuthorityCompareAndSwapInput` (type), `isAdmittedAuthorityWriter()`,
  `isValidPendingTransition()` — not named by this wave. They currently have zero external callers
  either, but that is a separate future audit question, not this phase's scope. Do not touch.
- `runtime/tests/unit/enable-modes-cli.vitest.ts` — deleted by phase 004 with the `enable-modes.cjs` it
  tests. (`flip-authority-cli.vitest.ts` moved into this phase's In Scope above, since F4 was resequenced
  here.)
- The `authorized-ledger`, `mode-append-gateway`, `event-envelope`, `legacy-projections`, replay-fingerprint,
  the 8 per-mode reducers, sealed-artifacts, `authority-root/`, `cutover-binding/`, `verify-authority.cjs` —
  the live ledger loop, untouched.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Phase `004-rollout-flip-tooling` is landed and green before this phase's file edits start —
  it deletes the two production callers (`enable-modes.cjs`, `flip-authority.cjs`) this reduction depends on.
- **REQ-002**: Zero remaining callers of `prepareCutover` / `compareAndSwap` / `compareAndSwapRollback` /
  `compareAndSwapFinalize` anywhere in the repo — including `tests/integration/` — confirmed by a fresh
  repo-wide `rg` immediately before deletion. STOP if any caller survives (see §9.3 for the one already
  found and its required fix).
- **REQ-003**: The read path and the lock-reclaim machinery (§8) are behaviorally unchanged — same
  public signatures, same on-disk record shape, same error codes.
- **REQ-004**: `tsc -p runtime/tsconfig.json` shows no new `TS2307` against a baseline captured fresh
  immediately before this wave (phase 001's 57-error/0-`TS2307` baseline is stale by now — three
  intervening waves will have changed it).
- **REQ-005**: `verify-authority.cjs` still reports all 8 modes `new_authoritative_final`, `allOnLedger`
  true. This gate is **critical** here — this file is adjacent to the fail-closed authorization boundary.
- **REQ-006**: The full runtime vitest suite's failing set does not grow by name against a freshly
  captured baseline, with explicit pass confirmation on `per-mode-authority-flip.vitest.ts`,
  `deep-research-postflip-fanout.vitest.ts`, and the mode-append-gateway suite.
- **REQ-007**: `git grep` finds no remaining reference to any deleted symbol, interface, or path.
- **REQ-008**: One commit, well under the 100-file mass-deletion ceiling.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 004 confirmed deleted and green before any edit in this phase lands.
- **SC-002**: The four CAS mutators, `#writeRollbackFinalRecord`, `#lockPath()`, and the three orphaned
  input interfaces are gone from `authority-registry.ts`; the barrel's type-export list is updated to
  match.
- **SC-003**: `rg` for `prepareCutover|compareAndSwap\(|compareAndSwapRollback|compareAndSwapFinalize|AuthorityPrepareCutoverInput|AuthorityCompareAndSwapRollbackInput|AuthorityCompareAndSwapFinalizeInput` returns zero non-deleted references.
- **SC-004**: `deep-research-postflip-fanout.vitest.ts` no longer calls `prepareCutover` or
  `compareAndSwap`; its fan-out assertions still pass unchanged.
- **SC-005**: `authority-finalize.vitest.ts` does not exist.
- **SC-006**: The read path and the full lock-reclaim family (§8) are unmodified — confirmed by a diff
  review, not just a passing test.
- **SC-007**: tsc no new errors; authority 8/8 `new_authoritative_final`; runtime suite failing-set
  unchanged by name; `per-mode-authority-flip.vitest.ts` and `deep-research-postflip-fanout.vitest.ts`
  both pass in full.
- **SC-008**: One commit, well under the 100-file mass-deletion ceiling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase `004-rollout-flip-tooling` must be committed and green first (see METADATA Order) | Mutators still have callers if phase 004 hasn't landed | REQ-001; T0 gate check before any edit |
| Risk | High-adjacency — sits next to the fail-closed authorization gateway | A mistake here could break auth routing | Read path + lock-reclaim machinery explicitly untouched (§8 KEEP LIST); prefer revert over patch-forward |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope, sequencing, and verification gates are fully resolved for this wave; see §9 Investigation
Findings below for corrections already folded into scope.
<!-- /ANCHOR:questions -->

---

## 8. CRITICAL — KEEP LIST (do NOT touch)

This is the load-bearing surface of `authority-registry.ts` and its barrel. All of it is used by
`append-mode-event.cjs`, `status.cjs`, `fanout-run.cjs`, and `verify-authority.cjs`, directly or
transitively:

| Symbol | Kind | Notes |
|--------|------|-------|
| `AuthorityRegistry.read()` | public method | The sole read path. Falls back to the internal `defaultRecord()` helper when no record has ever been written for a mode. |
| `defaultRecord()` | module-level private function | Backs `read()`'s default-record fallback. **There is no separately named `readDefault()` method** — the parent audit's write-up (`research/research.md` §4) and this phase's own dispatch brief both refer to this fallback as "`readDefault()`"; that name does not exist in the source. Treat every mention of `readDefault()` in prior docs as this internal helper. |
| `isValidAuthorityRecord()` | function | Lives in `authority-selector.ts` (sibling module), imported into `authority-registry.ts` for `read()`'s tamper check, re-exported by the barrel. |
| `selectAuthorityRoute()` | function | Also lives in `authority-selector.ts`, re-exported by the barrel. Not defined in `authority-registry.ts` at all. |
| `AUTHORITY_FLIP_MODE_ORDER` | constant | Lives in `types.ts`, re-exported by the barrel. |
| `withTransactionLock()` | public method | **Stays — see §9.2.** Serializes transactions through `authority-flip-transaction.lock`; used by the kept `stale-lock reclaim` tests and by `deep-research-postflip-fanout.vitest.ts`. |
| `#acquireLock`, `#releaseLock`, `#isLockStale`, `isPidAlive()`, `isLockHolderRecord()`, `LockHolderRecord`, `DEFAULT_STALE_LOCK_TTL_MS`, `#transactionLockPath()` | private helpers | Stay — all reachable only through `withTransactionLock()`, which stays. |
| `preparePendingTransition()`, `readPendingTransition()`, `clearPendingTransition()`, `AuthorityPendingTransition`, `AuthorityCompareAndSwapInput` (type), `isAdmittedAuthorityWriter()`, `isValidPendingTransition()` | public methods / types / helpers | Out of scope for this wave (§3). Not named by the removal target list. |

---

## 9. INVESTIGATION FINDINGS — corrections and additions to `research/research.md` §4/§5

The parent audit's F7 write-up is directionally correct but incomplete on four points, found by reading
`authority-registry.ts` in full and re-grepping every mutator symbol repo-wide (not just the two named
scripts) before drafting this spec.

### 9.1 `readDefault()` is not a real method name

See §8. The read path is `AuthorityRegistry.read()` alone; its default-record behavior is the internal
`defaultRecord()` function. No action needed — this is a naming clarification for whoever executes this
wave, so they do not go looking for a `readDefault` symbol that does not exist.

### 9.2 The lock-holder helpers do NOT become unused — correction to the brief's conditional

The dispatch brief scoped `LockHolderRecord` / `isPidAlive` for removal "if they become unused." They do
not. `withTransactionLock()` is a public method with **zero production callers today** but real test
coverage independent of the four removed mutators: the first four `it()` blocks in
`describe('stale-lock reclaim', ...)` (`per-mode-authority-flip.vitest.ts`) and the `flipAuthority()`
helper in `deep-research-postflip-fanout.vitest.ts` both call it directly. It depends on `#acquireLock`,
which depends on `#isLockStale`, `isPidAlive`, and `isLockHolderRecord`. None of these become unused.

Only `#lockPath()` — the **per-mode** CAS lock path (`authority-<mode>.lock`), distinct from
`#transactionLockPath()` (`authority-flip-transaction.lock`) — becomes unused, because its only callers
are the four removed methods. Remove `#lockPath()`; keep everything else in the lock family.

The fifth `it()` in `stale-lock reclaim` ("reclaims a per-mode CAS lock left by a dead process...", the
only one that calls `compareAndSwap()` to prove the reclaim worked) tests `#lockPath()`'s reclaim path
specifically and must be removed with it. The other four `it()` blocks in that same `describe` exercise
the identical `#acquireLock`/`#isLockStale` logic through `withTransactionLock()` instead, so removing
just the fifth one does not reduce coverage of the shared reclaim logic — it stays proven.

### 9.3 A third, previously unfound caller — BLOCKING

`research/research.md` §3 states: *"F7 — `prepareCutover` / `compareAndSwap` callers are exactly
`enable-modes.cjs` (F3) and `flip-authority.cjs` (F4); once those are removed, the CAS mutators are
dead."* That is incomplete. A repo-wide re-grep for this phase found a third caller:

`runtime/tests/integration/deep-research-postflip-fanout.vitest.ts`, `flipAuthority()` (lines ~147-170),
calls `registry.withTransactionLock(...)` wrapping `registry.prepareCutover(...)` then
`registry.compareAndSwap(...)` to seed a `new_authoritative_reversible` / `selectedWriter: 'dark'` fixture
record before its fan-out assertions run. This is independent of phase 004's two scripts — deleting
`enable-modes.cjs` and `flip-authority.cjs` does not remove this caller.

**This is the STOP-if-any-caller-survives condition the dispatch brief anticipated.** It does not block
the whole phase; it adds one required, mechanical, test-only edit that must land in the same commit as
the mutator removal (removing the mutators without this edit breaks this integration test outright):

Rewrite `flipAuthority()` to construct the target `AuthorityRecord` object directly and write it with
`writeCanonicalJsonAtomic` (already used elsewhere in this test file's dependency graph, and the same
pattern `per-mode-authority-flip.vitest.ts`'s local `seedAuthorityRecord()` helper already uses) instead
of driving it through the CAS API. The record shape to reproduce: `state: 'new_authoritative_reversible'`,
`epoch: 2` (starting epoch 1 + one forward transition), `selectedWriter: 'dark'`, the same
`candidateSha`/`policyVersion`/digest values the current call sites pass, `recordDigest` computed the same
way `authority-registry.ts` computes it (`sha256Bytes(canonicalBytes(core))` over the frozen core object).
The test's own assertions read the record back via `registry.read(MODE)` afterward — that call is
unaffected and needs no change.

### 9.4 `authority-finalize.vitest.ts` is not "trim ~200 LOC" — it is a whole dead file

The dispatch brief named one test-trim target: `tests/unit/per-mode-authority-flip.vitest.ts`, "~200 LOC."
Investigation found a second file, `tests/unit/authority-finalize.vitest.ts` (459 LOC), whose entire
content is dead after this phase plus phase 004 land:

- `describe('AuthorityRegistry.compareAndSwapFinalize', ...)` — tests the method this phase deletes.
- `describe('flip-authority.cjs — finalizeOneMode', ...)` and `describe('flip-authority.cjs --finalize --dry-run', ...)` — both spawn `scripts/flip-authority.cjs` directly (`FLIP_CLI = resolve(..., 'scripts', 'flip-authority.cjs')`), the script phase 004 deletes.

Because this phase runs **last**, and phase 004's own suite must be green before this wave can start
(REQ-001), one of two states is true when this wave begins:

1. Phase 004 already removed this file (or its `flip-authority.cjs`-dependent blocks) as part of its own
   CLI-test-suite cleanup — in which case T1's re-check finds it already gone or already reduced, and this
   task is a no-op confirmation.
2. Phase 004 left it in place — in which case its two `flip-authority.cjs` describes are already spawning
   a deleted script and the suite cannot be green, contradicting REQ-001's precondition. That state should
   be impossible by the time this wave starts; if T1 finds it, treat it as a phase-004 gap and delete this
   file wholesale here rather than proceeding with a known-broken baseline.

Either way, by the end of this wave `authority-finalize.vitest.ts` must not exist. Verify at execution
time; do not assume either state without checking (T1).

### 9.5 Realistic LOC total — corrects the parent PHASE MAP's provisional ~500 estimate

| Target | Estimated LOC removed |
|--------|------------------------|
| `authority-registry.ts` (4 methods + 1 private helper + 3 interfaces + `#lockPath()`) | ~330 |
| `index.ts` barrel (2 type names dropped) | ~2 |
| `per-mode-authority-flip.vitest.ts` (7 `compareAndSwap` its + `prepareCutover` describe + `compareAndSwapRollback` describe + 1 stale-lock it) | ~500 |
| `authority-finalize.vitest.ts` (conditional whole-file delete) | 0–459 |
| `deep-research-postflip-fanout.vitest.ts` (rewrite, not a net deletion) | ~0 (behavior-preserving rewrite) |

Realistic total: **~830–1,290 LOC**, depending on `authority-finalize.vitest.ts`'s state at execution
time — well above the parent `spec.md` PHASE MAP's provisional "~500" for this row. Flag this for the
parent's PHASE MAP row when this phase closes; not corrected here (the phase parent is lean-trio and out
of this child's write scope while the wave is still Planned).

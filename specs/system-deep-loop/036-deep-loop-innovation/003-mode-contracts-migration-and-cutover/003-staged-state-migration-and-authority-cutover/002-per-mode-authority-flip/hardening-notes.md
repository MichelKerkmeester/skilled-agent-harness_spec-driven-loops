---
title: "Hardening Notes: Per-Mode Authority Flip Machinery"
description: "Confirm-first red/green closure of four safety gaps in the dark authority-flip and rollback machinery, ahead of any live authority move."
trigger_phrases:
  - "per-mode authority flip hardening notes"
  - "authority flip reverse cas atomic cutover hardening"
importance_tier: "critical"
contextType: "analysis"
parent: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
---

# Hardening Notes: Per-Mode Authority Flip Machinery

Dark, unwired hardening pass over `lib/per-mode-authority-flip/` and its
supporting registry. Every gate below follows red-before/green-after:
a test reproduces the exact failure scenario against the code as it stood
before this pass, the fix lands, the same test is shown green. Nothing in
this pass wires a mode adapter to live authority; the `AuthorityRegistry`
compare-and-swap paths are still only ever invoked by tests supplying their
own temporary root, exactly as before.

All four gates below reproduced as genuine, confirmed bugs — none were
refuted.

## Gate: reverse authority CAS (rollback actually restores durable authority)

**Red.** `AuthorityRegistry` had no method to move a mode's durable record
back toward legacy; only the forward `cutover_ready -> new_authoritative_reversible`
edge existed. `tests/unit/per-mode-authority-flip.vitest.ts:840` ("admits a
write at cutover_ready, flips forward, then rollback restores legacy at a
new epoch and denies the stale dark epoch") failed with
`TypeError: registry.compareAndSwapRollback is not a function` against the
pre-hardening code — the durable selector had no way back to legacy after a
forward flip, so a rolled-back mode would have stayed dark-authoritative
forever at the application layer.

**Fix.** `lib/per-mode-authority-flip/authority-registry.ts:337`
(`compareAndSwapRollback`) implements the three-state reverse edge
`new_authoritative_reversible(epoch N) -> rollback_pending(epoch N) ->
legacy_authoritative(epoch N+1)` against the exact same durable record the
selector reads, as two individually atomic file writes under the mode's
existing per-mode lock. A crash between the two writes leaves the record at
`rollback_pending`, a state the selector (`authority-selector.ts`) already
denies all canonical admission for — no window exists where a stale
dark-authoritative read is possible. `#writeRollbackFinalRecord`
(`authority-registry.ts:405`) completes the second write on resume,
matching by expected epoch rather than re-validating the already-consumed
forward precondition.

**Green.** `tests/unit/per-mode-authority-flip.vitest.ts:840-980` (4 tests
at `:840`, `:890`, `:903`, `:941`): admits a write, flips, rolls back,
reads legacy at the new epoch, proves a fresh legacy write is selected, and
proves a caller still holding the pre-rollback dark record digest is
denied (`RECORD_DIGEST_MISMATCH`); rejects a rollback whose expected
epoch/state no longer matches; resumes a crash-stranded `rollback_pending`
deterministically; resumes idempotently once already fully restored. All 4
pass against the fixed code.

## Gate: atomic cutover (no two contradictory durable facts) + stale-lock recovery

**Red.** Two independent failure modes:

1. A crash between the ledger append and the registry CAS had no durable
   record of the exact CAS the appended event authorized, so a fresh
   coordinator instance could only resume by having the identical original
   request replayed into it. `tests/unit/per-mode-authority-flip.vitest.ts:1464`
   ("reconciles and cleanly aborts a prepared transition that never
   actually reached the ledger") failed with
   `TypeError: registry.preparePendingTransition is not a function`; the
   companion `:1504` ("fails loud rather than guessing...") failed the
   same way on `registry.readPendingTransition`.
2. `withTransactionLock`/`compareAndSwap` opened their lock files with a
   bare `openSync(path, 'wx')` and no ownership metadata — a lock left
   behind by a dead process denied every future transaction forever.
   `tests/unit/per-mode-authority-flip.vitest.ts:982` ("reclaims a
   transaction lock left by a process that no longer exists") and `:1023`
   (the per-mode CAS lock equivalent) both failed with
   `AuthorityFlipError: Another authority transaction is already active
   for this registry root` / `Another writer holds this mode's authority
   record lock` — a real hard-kill scenario, not the throw-based "crash"
   the existing suite exercised (a JS `throw` still runs `finally` and
   releases the lock; only a real process death strands it).

**Fix.**
- Durable prepare/commit marker: `AuthorityRegistry.preparePendingTransition`
  / `readPendingTransition` / `clearPendingTransition`
  (`authority-registry.ts:428-462`) persist the exact CAS input a ledger
  event authorizes, written before the append
  (`cutover-coordinator.ts:209`) and cleared only after the CAS commits
  (`cutover-coordinator.ts:229`). `AuthorityFlipCoordinator#reconcilePendingTransition`
  (`cutover-coordinator.ts:249-304`) runs at the start of every
  `requestCutover`, inside the transaction lock: if the ledger never
  actually received the prepared event, the marker is cleanly aborted; if
  the ledger has it and the registry is still at the exact expected
  pre-state, the CAS completes purely from durable evidence — no replay of
  the original request required; if the registry is in neither the
  expected pre- nor post-state, reconciliation fails loud
  (`AuthorityFlipError('CAS_CONFLICT', ...)`) rather than guessing.
- Stale-lock reclaim: `AuthorityRegistry#acquireLock`
  (`authority-registry.ts:184-210`) writes `{pid, acquiredAt}` into the
  lock file and, on `EEXIST`, checks `#isLockStale`
  (`authority-registry.ts:156-176`) — the owning PID is confirmed dead
  (`ESRCH`) or the lock aged past a configurable TTL — before reclaiming
  once and retrying. A live, non-stale holder still fails closed
  immediately; a malformed lock file never auto-reclaims (fails loud
  instead of displacing an unknown holder).

**Green.**
`tests/unit/per-mode-authority-flip.vitest.ts:982-1043` (stale-lock reclaim,
5 tests: dead-PID transaction lock, TTL-aged transaction lock, live-lock
negative control, malformed-lock negative control, dead-PID per-mode CAS
lock) and `:1422-1548` (crash matrix, 3 tests covering the existing
crash-after-ledger-append-before-CAS resume plus the two new prepare/commit
scenarios) all pass. The existing `AuthorityFlipCoordinator` "resumes
safely after a crash" test (`:1422`) now also asserts the prepare marker
exists immediately after the simulated crash and is cleared after resume
(`:1447`, `:1458`), and that the post-resume selector derives exactly one
authority (`dark`, the committed epoch) from the registry (`:1459-1461`).

## Gate: deny BLOCKED/aborted handoffs

**Red.** `evaluateCutoverPreflight` checked only `handoff.closure.abortedRows > 0`;
a handoff whose rows vetoed to `BLOCKED` (missing/stale/invalid fresh
evidence at migration time, not a policy-frozen permanent BLOCK
disposition) with zero aborted rows still returned `{verdict: 'ready'}`.
`tests/unit/per-mode-authority-flip.vitest.ts:1074` reproduces this
directly against the shared fixture handoff (every `MIGRATE`-disposition
row forced to `BLOCKED` for missing fresh evidence, zero `ABORTED` rows)
and failed with `expected { verdict: 'ready', … } to deeply equal
{ verdict: 'blocked', … }` against the pre-hardening code.

**Fix.** `lib/per-mode-authority-flip/preflight.ts:87-92`: a row is now an
illegitimate block only when its status is `BLOCKED` *and* its frozen
manifest disposition was not itself `BLOCK` — i.e. a row that was supposed
to reach `UPCAST`/`PIN`/`FORK`/`MIGRATE` but never actually got there.
A row whose disposition the census permanently freezes to `BLOCK` (a
lock/writer-ownership resource that can never be migrated, e.g.
`database-controls`) remains legitimate and does not gate the flip — this
is a deliberate, narrower reading than a literal
`handoff.closure.blockedRows === 0`: the real frozen census contains
several such permanently-BLOCK rows for every mode (confirmed via
`lib/inflight-state-classification/frozen-census-policy.ts`), so a literal
`blockedRows === 0` gate would make `ready` mathematically unreachable for
any real mode forever, not just close the described stranding scenario.
Any illegitimately-blocked row, or any `ABORTED` row, now denies with
`MIGRATION_HANDOFF_INVALID`.

**Green.** `tests/unit/per-mode-authority-flip.vitest.ts:1074-1087` passes:
the same dirty handoff that used to read `ready` now correctly denies. A
new companion fixture, `buildCleanHandoffFixture`
(`tests/unit/per-mode-authority-flip.vitest.ts:252-305`), hand-builds
genuinely `COMMITTED` receipts for every `MIGRATE`-disposition row (the
real ledger-checkpoint import machinery is out of this pass's scope) so the
pre-existing happy-path and coordinator crash-matrix tests keep proving
`ready`/`flipped` is still reachable when nothing is actually stranded.

## Gate: enforce the full frozen prefix from durable state

**Red.** `checkManifestOrder` only checked "a benchmark variant may not
flip before `deep-improvement-common`"; every other predecessor
relationship in the eight-mode order was unenforced, and the coordinator
trusted the caller-supplied `alreadyFlippedModes` set verbatim.
`tests/unit/per-mode-authority-flip.vitest.ts:1590` builds a request for
the eighth/last manifest mode with a forged `alreadyFlippedModes` claiming
every predecessor already flipped, while the durable registry shows every
predecessor still at its untouched legacy default. Against the
pre-hardening coordinator this **completed a full flip** —
`{disposition: 'flipped', record: {mode: 'deep-alignment', state:
'new_authoritative_reversible', epoch: 4, ...}}` — a live demonstration of
an out-of-order authority transition succeeding purely on an unverified
claim.

**Fix.**
- `lib/per-mode-authority-flip/manifest-order.ts:37-55`: `checkManifestOrder`
  now requires every mode ordered before the requested one in
  `AUTHORITY_FLIP_MODE_ORDER` to appear in the supplied `flippedModes` set
  — the full prefix, not only the common-workstream special case.
- `lib/per-mode-authority-flip/manifest-order.ts:64-71`: new
  `deriveFlippedModes(registry)` reads all eight modes' own durable records
  and includes a mode only if its own state is
  `new_authoritative_reversible` or `new_authoritative_final`.
- `lib/per-mode-authority-flip/cutover-coordinator.ts:75-97`:
  `requestCutover` now derives `flippedModes` from the durable registry
  itself, inside the transaction lock, and uses that derived set for both
  the order check and the preflight evaluation — the caller-supplied
  `alreadyFlippedModes` on the request is never consulted for the order
  decision.

**Green.** `tests/unit/per-mode-authority-flip.vitest.ts:1590-1607` (forged
claim denied with `MODE_ORDER_VIOLATION`, zero ledger events, registry
unchanged) and `:1637-1687` (the same last mode admitted and fully flipped
once every one of its seven predecessors is genuinely seeded
`new_authoritative_reversible` in the registry, with every predecessor's
own record confirmed untouched afterward — the one-mode blast radius) both
pass. The lower-level `checkManifestOrder`/`deriveFlippedModes` unit tests
(`:574-692`) cover the exact-prefix logic and durable-derivation function
directly.

## Verification

- `tsc --noEmit -p tsconfig.json`: exit 0.
- `tests/unit/per-mode-authority-flip.vitest.ts`: 62/62 pass (was 45/62
  against the pre-hardening code with these same tests — the 17 failures
  are exactly the four gates above).
- Sibling suites, unaffected by this pass, still pass in full:
  `tests/unit/cutover-certificate.vitest.ts` 41/41,
  `tests/unit/inflight-state-migration.vitest.ts` 31/31.
- Every ledger write in this package still goes through
  `appendAuthorizedThroughFence` (`lib/per-mode-authority-flip/ledger-event.ts:174`)
  — untouched by this pass. No mode adapter wires the selector as live
  authority; `AuthorityRegistry`/`AuthorityFlipCoordinator` are still only
  ever constructed by tests against a temporary root.

## Deliberately out of scope

The frozen census's permanently-BLOCK rows (`database-controls`,
`loop-guard-sweep-lock`, and similar lock/writer-ownership resources) are
still modeled as an overloaded `BLOCK` disposition rather than a distinct,
separately-verified permanent-ownership disposition. That redesign is a
larger change than a hardening pass and was not attempted here; the
narrower fix above closes the actual stranding scenario without it.

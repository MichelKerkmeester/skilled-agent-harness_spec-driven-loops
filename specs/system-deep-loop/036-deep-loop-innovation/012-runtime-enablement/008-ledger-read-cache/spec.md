---
title: "Feature Specification: Ledger Read Cache"
description: "Give AppendOnlyLedger an opt-in verified-events read cache so a single-writer ledger stops paying the exclusive-lock read floor on every read, collapsing the authorized-append pipeline's ~18 lock+scan cycles per dispatch without weakening the durability guarantees concurrent-writer consumers depend on."
trigger_phrases:
  - "ledger read cache"
  - "verified events cache"
  - "append-only ledger read floor"
  - "opt-in single-writer read cache"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
    last_updated_at: "2026-08-22T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored spec"
    next_safe_action: "Design the opt-in cache and its invalidation contract, then implement behind a default-off flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The per-read cost is the frame store's exclusive-lock round-trip, not fsync and not the scan"
      - "The cache is opt-in and default-off; concurrent-writer consumers keep the lock-per-read semantics"
      - "The effect producer's per-lineage ledger is single-writer, so the cache is safe there"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Ledger Read Cache

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-08-22 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No authority moves; a read-path performance change to a shared primitive, default-off |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `007-effect-enablement`;
> successor `none` (latest sibling). This phase is a dependency of the effect producer in `007`: it removes the
> per-read lock floor that makes the producer serialize the fan-out pool.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Routing the live fan-out executor spawn through the shipped effect gateway (phase `007`) records a fail-closed intent
and a confirmation per lineage. Measurement shows each such dispatch costs **~700ms of on-thread, non-CPU wall time**,
and that four concurrent dispatches take four times a single one — the recording **serializes the fan-out pool**.

The cause was traced by measurement, and it is not what it first looked like:

- fsync is not the cost: a directory fsync on the test filesystem is ~0.03ms and a file fsync ~4ms.
- The shell-out in `resolveAuthorityRoot` (`git rev-parse`) is ~11ms — negligible.
- Every `AppendOnlyLedger` read — `readVerifiedEvents` and `getVerifiedHead` — wraps its scan in the frame store's
  **exclusive cross-process writer lock** (`withExclusiveLock`). That lock round-trip (create a lock file, fsync it,
  hard-link it into place, release) is a **~34ms fixed floor per read, dominant even on an empty ledger** where there
  are zero frames to scan.
- The authorized-append pipeline invokes that read ~18 times per dispatch: the gateway's opening read, and per append
  (intent, then confirmation) an idempotency read, a `getVerifiedHead`, the audit-ledger reads inside authorization,
  the fence's head read, and a post-append verification read. ~18 × ~34ms ≈ the ~700ms.

Because each read takes the exclusive lock, the reads also cannot overlap: concurrent dispatches block one another on
the same lock discipline, which is why the pool serializes.

The lock-per-read is correct and necessary when more than one process writes the same ledger: it is what gives a reader
a consistent view against a concurrent append. But the effect producer's ledger is written by exactly one process — the
lineage that owns its run directory. For a single-writer ledger, re-taking the lock and re-scanning ~18 times to read a
value that only this process can change is pure overhead.

### Purpose

Give `AppendOnlyLedger` an **opt-in verified-events read cache**. When enabled, the ledger caches the result of a
verified scan and serves subsequent reads from the cache until its own `append` invalidates it, so a single-writer
ledger pays the exclusive-lock read floor once per change rather than once per read. The flag is **default-off**: every
existing consumer keeps the exact lock-per-read semantics it has today. The effect-dispatch helper (`007`) enables it on
the per-lineage ledgers it constructs, which are single-writer by construction, collapsing the ~18 lock+scan cycles per
dispatch to a small constant and removing the pool serialization.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** This is a read-path performance change to a shared
> primitive. The risk is a **correctness regression in a durability primitive**, not a security breach. The whole point
> of the default-off design is that no existing consumer's integrity guarantees change.

### Non-Goals

- Changing the frame store's write path, its fsync discipline, or the exclusive-lock semantics for writes.
- Enabling the cache for any concurrent-writer consumer (rollback drills, authority flip, receipts) — they stay
  lock-per-read.
- A cross-process cache. The cache lives in one `AppendOnlyLedger` instance and is only valid because that instance is
  the sole writer of its ledger.
- Altering the verified-event contents, framing, hash chain, or the reader contracts that consume them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a default-off constructor option to `AppendOnlyLedger` that enables an in-instance verified-events read cache.
- When enabled: `readVerifiedEvents` and `getVerifiedHead` serve from the cache after the first verified scan; the
  instance's own `append` (the authorized append path) invalidates the cache so the next read re-scans under lock.
- Prove the cache never serves stale data for the case it is enabled for (single writer), and prove it is inert when
  off (the default), by leaving every existing consumer on the lock-per-read path.
- Enable the flag from the effect-dispatch helper on the per-lineage effect and audit ledgers it constructs.
- Measure the dispatch cost and the concurrency before and after, and record the delta.

### The Single-Writer Safety Boundary

The cache is only correct when this `AppendOnlyLedger` instance is the only writer of its ledger directory for the
instance's lifetime. That holds for the effect producer: the ledger lives under `${lineageDir}`, a per-lineage run
directory written only by the lineage that owns it. The flag's contract states this precondition, and the flag stays
off everywhere the precondition does not hold. Enabling it on a concurrent-writer ledger would let a reader miss another
process's append — the exact staleness the exclusive lock exists to prevent — so the default is off and the enablement
is explicit and local.

### Authorized Cross-Packet Surface

`lib/authorized-ledger/append-only-ledger.ts` is a shared durability primitive owned by the ledger-schema work and
audited by the whole-system gate. Editing it is normally out of this packet's scope. The operator authorized this
change because the effect producer's serialization is rooted there and the default-off design confines the behavior
change to callers that explicitly opt in. The edit adds an optional cache; it does not alter the write path, the lock
semantics for writes, or the verified-event contract.

### Out of Scope

- The two `007` baseline test adjustments and the `007` commit — those follow once the cache lands and the dispatch
  cost is re-measured.
- Any change to the frame store's lock implementation or fsync behavior.
- Enabling the cache on any other consumer.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `lib/authorized-ledger/append-only-ledger.ts` (ledger-schema-owned, authorized) | Adds a default-off read-cache option; caches verified scan results and invalidates on the instance's own append |
| `lib/deep-loop/fanout-effect-dispatch.ts` (this epic's helper) | Enables the flag on the per-lineage effect and audit ledgers it constructs |
| Ledger read-cache tests | New coverage: cache hit/invalidation, default-off inertness, single-writer correctness, and a before/after dispatch measurement |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: `AppendOnlyLedger` accepts a default-off option that enables an in-instance verified-events read cache;
  omitting it preserves today's exact lock-per-read behavior.
- **REQ-002**: With the cache on, `readVerifiedEvents` and `getVerifiedHead` return the same values they would under
  lock-per-read for a single-writer ledger, serving repeated reads without re-acquiring the exclusive lock.
- **REQ-003**: The instance's own successful `append` invalidates the cache, so the next read reflects the appended
  event.
- **REQ-004**: With the cache off (the default), every read still takes the exclusive lock and re-scans — no existing
  consumer's behavior changes.
- **REQ-005**: The effect-dispatch helper enables the flag on the per-lineage ledgers it constructs, and on those
  ledgers alone.
- **REQ-006**: The authorized append path still validates the fence, proof, idempotency, and chain under lock exactly
  as before; the cache changes only reads.
- **REQ-007**: The measured per-dispatch cost and the concurrent-vs-single ratio improve materially with the cache on,
  and the improvement is recorded as a before/after delta.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A unit test proves that with the cache on, N repeated reads perform one verified scan (asserted by a
  scan/lock counter or an injected observation), and that an `append` forces the next read to re-scan.
- **SC-002**: A unit test proves the cache is inert when off: reads still scan every time, exercised by the existing
  ledger suite staying green unchanged.
- **SC-003**: A correctness test proves that on a single-writer ledger the cached reads return byte-identical verified
  events to a fresh lock-per-read ledger over the same directory after each append.
- **SC-004**: The full `authorized-ledger` test suite (and the effect-recording suite) re-run green; no existing test is
  weakened to accommodate the cache.
- **SC-005**: A measurement records the dispatch cost and the 4-concurrent-vs-1 ratio before and after enabling the
  flag, showing the per-read floor removed and the pool no longer serialized.
- **SC-006**: The scoped diff touches only the ledger, the effect-dispatch helper's enablement, and the tests.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| Cache serves stale data under a concurrent writer | A reader misses another process's append — a durability/consistency regression | The flag is default-off and enabled only on single-writer per-lineage ledgers; the precondition is stated in the option contract and asserted by the single-writer correctness test |
| The cache misses an invalidation on append | A reader after an append sees the pre-append state | REQ-003 invalidates on the instance's own successful append; SC-001 asserts the post-append read re-scans |
| The change touches a whole-system-gate-audited primitive | A regression in a shared durability core | Default-off keeps every existing consumer on the current path; the full ledger suite is re-run as a delta and must stay green (SC-004) |
| The speedup is smaller than expected | The pool still serializes | SC-005 measures before/after; if the residual is elsewhere, that is surfaced rather than assumed away |

**Dependencies**: the effect producer in `007-effect-enablement` (the caller that enables the flag and the surface the
speedup is proven against); the frame store `immutable-frame-store.ts` whose exclusive-lock read floor is the cost being
avoided.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The root cause is measured (the per-read exclusive-lock floor, ~34ms, ~18× per dispatch), the fix is
scoped (an opt-in, default-off, in-instance read cache invalidated on the instance's own append), the safety boundary is
stated (single-writer only), and the operator authorized the cross-packet edit to the shared primitive. The remaining
unknowns are implementation details — where the cache field lives on the instance and how the append path signals
invalidation — which the setup task resolves by reading the read and append methods.
<!-- /ANCHOR:questions -->

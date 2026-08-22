---
title: "Implementation Summary: Ledger Read Cache"
description: "Planned: the opt-in AppendOnlyLedger read cache that removes the effect producer's per-read exclusive-lock floor is specified and authorized; no code is written yet."
trigger_phrases:
  - "ledger read cache summary"
  - "read cache planned"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
    last_updated_at: "2026-08-22T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored spec"
    next_safe_action: "Implement the default-off cache and its append invalidation"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The per-read cost is the frame store's exclusive-lock round-trip (~34ms), not fsync (~0.03-4ms) and not git (~11ms)"
      - "The pipeline takes that lock ~18 times per dispatch, which is the ~700ms and the pool serialization"
      - "The cache is opt-in, default-off, single-writer-only, invalidated on the instance's own append"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Ledger Read Cache

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache |
| **Status** | Planned |
| **Commit** | none yet |
| **Completed** | Nothing built; the spec is authored and the cross-packet edit is authorized |
| **Lines** | 0 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Nothing yet. This phase exists because the effect producer in `007` serializes the fan-out pool, and measurement traced
that to a cost no earlier phase anticipated: every `AppendOnlyLedger` read takes the frame store's exclusive
cross-process lock, a ~34ms round-trip that dominates even on an empty ledger, and the authorized-append pipeline takes
it ~18 times per dispatch. fsync (~0.03-4ms) and the `git rev-parse` in `resolveAuthorityRoot` (~11ms) were measured and
ruled out.

The planned fix gives `AppendOnlyLedger` a default-off, in-instance verified-events read cache: with it on,
`readVerifiedEvents` and `getVerifiedHead` serve from a memo without re-taking the lock, and the instance's own
successful append invalidates the memo. The flag is enabled only on the effect producer's per-lineage ledgers, which a
single process writes, so the cache can never miss another writer's append. Every existing consumer stays default-off on
the exact lock-per-read path it has today.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Not yet delivered. The build follows the plan's three phases: add the default-off cache to the read path, invalidate on
the instance's own append and enable the flag from the effect-dispatch helper, then prove cache hit/invalidation,
default-off inertness, single-writer byte-equality, a green full suite, and a before/after dispatch measurement.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

**The cache is opt-in and default-off.** The exclusive-lock-per-read exists to give a consistent read against a
concurrent writer. Removing it universally would let any consumer miss another process's append. Default-off confines
the behavior change to callers that assert they are the sole writer.

**Single-writer only.** The effect producer's ledger lives under a per-lineage run directory written by exactly one
process, so an in-instance memo invalidated on that instance's append is provably consistent there. The option contract
states this precondition, and the flag stays off everywhere it does not hold.

**Fix the read floor, not fsync.** Measurement disproved fsync as the cost; the exclusive-lock round-trip on every read
is the floor. The cache removes repeated locking, not durability — the write path and its fsync discipline are
untouched.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Not yet run. The blocking gates are: cache-on does one verified scan for N reads and re-scans after an append;
single-writer cached reads are byte-identical to fresh lock-per-read reads; the existing ledger suite passes unchanged
with the flag off; and a before/after measurement shows the per-read floor removed and the 4-vs-1 ratio no longer
serialized.

Verification command (from `.opencode/skills/system-deep-loop/runtime`):
`npx vitest run tests/unit/*authorized-ledger* tests/unit/fanout-effect-recording.vitest.ts` plus the new read-cache
test, and `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` for Errors: 0.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

The cache helps only single-writer ledgers. Concurrent-writer consumers keep the per-read lock cost by design; speeding
them up would require a cross-process invalidation signal this phase does not build. The speedup is proven against the
effect producer's per-lineage ledgers, which is where the serialization it exists to remove occurs.
<!-- /ANCHOR:limitations -->

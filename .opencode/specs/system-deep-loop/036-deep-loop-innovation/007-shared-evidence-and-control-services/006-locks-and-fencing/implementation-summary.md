---
title: "Implementation Summary: Locks & Fencing"
description: "Implemented and verified the additive-dark locks-and-fencing runtime: canonical protected resources, durable monotonic lease tokens, guarded ledger/state commits, replay-bound resume identity, legacy/dark shadow control, and gateway-authorized lifecycle evidence."
trigger_phrases:
  - "locks and fencing implementation"
  - "deep-loop fencing verification"
  - "stale writer rejection evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
    last_updated_at: "2026-07-21T00:35:36Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark locks-and-fencing runtime"
    next_safe_action: "Consume the new adapters from later dark-path wiring while legacy remains authoritative"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Locks & Fencing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing` |
| **Baseline HEAD** | `d1a3f0323c3635f24c3560feaeda839522ececf0` |
| **Status** | Implemented and focused-verification green |
| **Authority** | Additive-dark; shipped legacy writers remain canonical and unchanged |
| **Atomicity domain** | Single-host filesystem only; every other topology fails closed |
| **Runtime surface** | `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The new runtime package provides a durable per-resource fencing service without changing the event-envelope, authorized-ledger, replay-fingerprint, or legacy writer implementations. A grant is recorded in an append-only hash-chained journal before its active lease state is atomically replaced. Token counters survive release, expiry, process loss, restart, restore advance, and rollback attempts; uncertainty in state, journal, topology, identity, ordering, or ownership fails closed.

### Modules

| Module | Contract |
|--------|----------|
| `locks-and-fencing-types.ts` | Closed resource, lease, decision, replay, and coordinator types |
| `locks-and-fencing-errors.ts` | Typed timeout, stale-fence, lease-lost, ordering, corruption, conflict, overflow, and topology errors |
| `protected-resource-registry.ts` | Exact canonical resource schemas, stable digest/order keys, and the frozen shipped-writer replacement manifest |
| `durable-file.ts` | Owner-only atomic JSON replacement and fsynced append primitives |
| `fenced-lease-coordinator.ts` | Bounded acquire/renew/release, monotonic journal, crash recovery, expiry/takeover, canonical multi-resource ordering, and commit guards |
| `fenced-ledger-writer.ts` | Current-fence plus expected-head enforcement around the existing single-use authorized append |
| `fenced-state-store.ts` | Current-fence plus version/continuity/replay identity enforcement for projection, lineage, status, checkpoint, merge, council, and pause/resume state |
| `fenced-shadow-adapter.ts` | One guarded epoch for the authoritative legacy mutation and non-authoritative dark observation |
| `replay-identity.ts` | Resume identity derived only from a verified or freshly derived replay fingerprint |
| `lock-lifecycle-evidence.ts` | Closed typed lifecycle event, canonical envelope preparation, gateway authorization, durable ledger append, verified read, and deterministic reducer |
| `index.ts` | Dependency-closed public API with no raw protected-write shortcut |
| `locks-and-fencing.vitest.ts` | Focused concurrency, recovery, mutation, shadow, ledger, evidence, and fail-closed contract suite |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The package was added as a dark, dependency-closed runtime surface. It exposes guarded replacement seams but does not route existing traffic, alter legacy writers, or promote dark results to authority. Focused filesystem/concurrency tests, a deliberate token-reuse mutation, full runtime typechecking, alignment drift, comment hygiene, and packet validation provide the delivery evidence.

### Additive-Dark and Scope Proof

- All runtime implementation files are new under `runtime/lib/locks-and-fencing/`; the only new runtime test is `runtime/tests/unit/locks-and-fencing.vitest.ts`.
- `runtime/lib/event-envelope/`, `runtime/lib/authorized-ledger/`, and `runtime/lib/replay-fingerprint/` are consumed through their public contracts and were not modified.
- Existing loop-lock, CLI guard, council, repair, fan-out, lifecycle, checkpoint, projection, and observability writers were not modified.
- The frozen manifest records the later direct replacement seam for each legacy writer. It does not route traffic or change authority in this leaf.
- No cutover flag, legacy retirement, raw-ledger append path, force-unlock path, multi-host claim, or dark-result authority was added.
- The working tree also contains new sibling runtime directories from concurrent leaf work. They were neither implementation dependencies nor modifications made by this leaf; path-scoped status evidence is recorded at handoff.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

### Contract Proofs

| Contract | Evidence |
|----------|----------|
| Canonical protected resources | Closed top-level/component schemas reject aliases, traversal, empty or non-NFC identities, forged derived fields, and unknown topology |
| Durable monotonic fencing | Hash-chained grant journal is fsynced before active-state replacement; release never edits the high-water mark; restore can only advance it |
| Crash safety | Fault injection after journal fsync and before state commit reconstructs the journaled lease; the next takeover receives token 2 rather than reusing token 1 |
| Owner-safe lifecycle | Renew/release require the exact resource, token, lease ID, and owner tuple; a displaced holder receives `STALE_FENCE` and cannot affect its successor |
| Mutation atomicity | `withFence` holds the same nonce-safe coordinator mutex that takeover requires until the ledger append or atomic state replacement finishes |
| Ledger integrity | `FencedLedgerWriter` checks the expected verified head while fenced, then calls the existing authorized ledger; two current-head contenders produce one commit and one `HEAD_CONFLICT` |
| Projection/control CAS | `FencedStateStore` binds fence token, expected version, continuity identity, optional replay fingerprint, state bytes, and state digest in one atomic replacement |
| Fan-out and resume | Distinct lineage resources overlap; status, checkpoint, merge, council, pause/resume, projection, and lineage fixtures reject the old token after takeover |
| Deadlock and timeout | Unique resources must arrive in canonical order; inverted, duplicate, nested, and re-entrant guards fail before blocking; contention ends at a typed bounded jittered timeout |
| Legacy/dark coexistence | `FencedShadowAdapter` returns the exact authoritative legacy value and contains dark failure under the same lease; it never promotes dark output to authority |
| Typed durable evidence | Lifecycle payloads use the canonical envelope registry, are authorized through `TransitionAuthorizationGateway`, append through `AppendOnlyLedger`, and read/reduce only from verified events |
| Replay identity | Resume evidence accepts the final digest and range only from the existing derived/verified replay-fingerprint contract |
| Comment hygiene | All new TypeScript and the focused test pass the shared comment-hygiene checker with zero violations |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Command | Result |
|------|---------|--------|
| Focused runtime contract | `.opencode/skills/system-spec-kit/mcp-server/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts .opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts` | Exit 0; 1 file, 24 tests passed |
| Claim falsifier | Temporarily replaced `baseToken + 1` with token reuse, ran the same focused command, then restored | Exit 1; 14/24 tests failed for monotonicity, takeover, stale-state, and stale-ledger assertions |
| TypeScript | `/opt/homebrew/bin/tsc -p .opencode/skills/system-deep-loop/runtime/tsconfig.json --noEmit --ignoreDeprecations 6.0` | Exit 0 |
| Targeted alignment drift | `python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing --fail-on-warn` | Exit 0; 11 files, 0 findings |
| Comment hygiene | Shared checker over 11 modules plus the focused test | Exit 0; zero violations |
| Strict packet validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <leaf> --strict` | Exit 0; Errors 0, Warnings 0 |

The focused suite is the approved gate for this leaf. The operator-supplied full runtime baseline has about 100 failures from the missing `better-sqlite3` dependency and kebab-case test-fixture filename mismatches; those failures are owned by the later integration gate. The full suite was not rerun or modified here, so this summary makes no broad full-suite regression claim.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. The backend deliberately supports only one host and one filesystem atomicity domain. Multi-host coordination requires a different backend and currently fails closed.
2. Legacy call-site wiring is intentionally absent. Authority remains with shipped legacy writers until the later cutover phase explicitly consumes these adapters.
3. The high-water journal is safety-critical. Rollback may remove the new call surface, but it must retain or advance journal state; deleting or restoring an older journal can re-authorize stale work and is forbidden.
4. The focused suite proves the new unit/in-memory/filesystem boundary. It does not prove higher deployment or multi-host rungs.

The additive dark runtime is implemented, its focused contract and TypeScript gate are green, the mutation falsifier turns the suite red for the intended reason, strict packet validation reports no errors or warnings, and legacy authority is unchanged.
<!-- /ANCHOR:limitations -->

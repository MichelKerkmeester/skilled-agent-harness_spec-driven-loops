---
title: "Checklist: Locks & Fencing"
description: "Blocking verification contract for monotonic fencing, stale-writer rejection, guarded legacy/dark coexistence, fan-out and resume safety, and bounded deadlock/timeout behavior."
trigger_phrases:
  - "locks and fencing checklist"
  - "deep-loop stale writer verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
    last_updated_at: "2026-07-15T14:01:58Z"
    last_updated_by: "codex"
    recent_action: "Passed the focused fencing, stale-writer, timeout, recovery, and typed-evidence matrix"
    next_safe_action: "Use the additive adapters from later dark-path integration work"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Locks & Fencing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for locks and fencing. Every item is executed against a candidate SHA pinned to phase-003 BASE; the report records the protected-resource manifest hash, atomicity domain, coordinator state generation, commands, exit codes, barrier/fault point, winning and rejected tokens, committed heads/versions, and unexpected tracked mutation. Zero discovered writers, zero exercised stale-writer barriers, an unbounded wait, or a protected backend without atomic fence-plus-mutation support fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Existing envelope, authorized-ledger, replay-fingerprint, and additive-dark authority boundaries are consumed without modification [evidence: path-scoped `git diff --` reports no changes under the three consumed substrate directories]
- [x] CHK-002 [P0] The frozen manifest maps shipped ledger, projection, council, fan-out, repair, pause/resume, checkpoint, and lineage writers to one resource kind and replacement seam [evidence: `SHIPPED_WRITE_SURFACE_MANIFEST` is frozen in `protected-resource-registry.ts`]
- [x] CHK-003 [P1] The single-host domain, canonical order, lease TTL/renewal, bounded jittered timeout, safe-integer token width, and overflow behavior are encoded and tested [evidence: focused Vitest `locks-and-fencing.vitest.ts` passed 24/24]
- [x] CHK-004 [P1] Any unsupported atomicity domain fails with `UNSUPPORTED_ATOMICITY_DOMAIN` [evidence: focused Vitest unsupported-topology assertion passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] `withFence` holds the coordinator mutex through ledger append or state replacement; no public check-then-write helper exists [evidence: `fenced-lease-coordinator.ts` guard and public `index.ts` API passed focused Vitest]
- [x] CHK-006 [P0] Release and renewal require the exact resource, token, lease ID, and owner tuple; stale teardown is rejected [evidence: focused Vitest exact-owner lifecycle cases passed]
- [x] CHK-007 [P1] Canonical encoding rejects aliased fields, traversal, empty/noncanonical identities, unknown fields, and mixed normalization [evidence: focused Vitest canonical-resource rejection matrix passed]
- [x] CHK-008 [P1] Existing loop-lock and CLI ownership code is unchanged; the new coordinator reuses nonce-safe loop-lock acquisition and release internally [evidence: path-scoped `git diff --` reports no loop-lock or CLI ownership edits]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Concurrent same-resource acquisition yields one holder; subsequent grants are strictly newer [evidence: focused Vitest same-resource contention case passed]
- [x] CHK-010 [P0] Release, expiry, crash recovery, coordinator restart, restore advance, and rollback attempts preserve the high-water mark [evidence: focused Vitest journal/restart/restore monotonicity cases passed]
- [x] CHK-011 [P0] Old-token ledger and state mutations return typed stale-fence rejection without changing the committed head/version [evidence: focused Vitest stale ledger and state mutation cases passed]
- [x] CHK-012 [P0] Competing expected-head ledger appends produce one commit and one `HEAD_CONFLICT`; takeover rejects the old fence before append [evidence: focused Vitest ledger contention and takeover cases passed]
- [x] CHK-013 [P0] Projection, checkpoint, and pause/resume replacements validate fence, version, continuity identity, and optional replay identity inside one mutex [evidence: focused Vitest state-store identity and CAS cases passed]
- [x] CHK-014 [P0] The additive shadow adapter uses one guarded epoch and returns the exact authoritative legacy result when dark observation fails [evidence: focused Vitest shadow dark-failure containment case passed]
- [x] CHK-015 [P0] Distinct lineages overlap; same status, merge, checkpoint, council, and lineage resources admit only the current token [evidence: focused Vitest fan-out and resource-isolation cases passed]
- [x] CHK-016 [P0] The resource matrix rejects stale dispatch/status/merge/checkpoint/pause-resume state after takeover [evidence: focused Vitest stale resource-matrix case passed]
- [x] CHK-017 [P0] Inverted, duplicate, nested, and re-entrant guards fail before blocking; ordinary contention ends at a typed bounded timeout [evidence: focused Vitest ordering and timeout cases passed]
- [x] CHK-018 [P0] Malformed journal/state, expected-head conflict, unsupported topology, token rollback, and overflow fail closed without protected mutation [evidence: focused Vitest corruption, conflict, topology, rollback, and overflow cases passed]
- [x] CHK-019 [P0] Owner reuse, clock rewind, heartbeat liveness, and expiry never authorize an old token after takeover [evidence: focused Vitest owner/clock/heartbeat/expiry cases passed]
- [x] CHK-020 [P0] Journal-before-state fault injection, CAS/head conflicts, expiry, takeover, and release retain one reconstructable current epoch [evidence: focused Vitest injected-fault and reconstructability cases passed]
- [x] CHK-021 [P1] All lifecycle actions carry redacted resource digest, token, lease/correlation identity, owner, reason, latency, and optional replay fingerprint [evidence: focused Vitest typed lifecycle payload case passed]
- [x] CHK-022 [P1] The approved focused leaf suite passes 24/24; the known full-suite `better-sqlite3` and fixture-filename baseline is explicitly outside this leaf [evidence: Vitest exit 0 with 1 file and 24/24 tests passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-023 [P0] The dark public API has no raw protected append/check helper; the unique manifest identifies every intentional legacy authority entry point [evidence: `index.ts` export review and `SHIPPED_WRITE_SURFACE_MANIFEST` focused test passed]
- [x] CHK-024 [P1] Every manifest entry names its direct fenced replacement; legacy fallback remains authority-governed rather than open-ended dark fallback [evidence: focused Vitest frozen-manifest coverage passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-025 [P1] Production lease IDs use `randomUUID`; tokens are epochs, and evidence excludes raw paths/payloads [evidence: `fenced-lease-coordinator.ts` and typed lifecycle evidence tests passed]
- [x] CHK-026 [P1] Resource paths derive only from validated SHA-256 digests; unknown fields, traversal, normalization variants, and forged derived values are rejected [evidence: focused Vitest digest-path and canonical validation cases passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-027 [P2] `implementation-summary.md` records protected resources, domain, timeout/error policy, journal recovery, and the no-force-unlock rule [evidence: `implementation-summary.md` contract proof and limitation sections]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-028 [P1] Coordinator, guards, adapters, and tests are dependency-closed under one new runtime directory/test file; operator-owned commit/rollback must retain or advance the journal [evidence: path-scoped git status and tsc exit 0]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the reviewed resource manifest covers every protected writer, tokens remain strictly monotonic through all lifecycle and recovery fixtures, stale live/resumed writers are rejected at each mutation boundary, legacy/dark and fan-out races admit one valid epoch, and all shipped regression suites plus the cross-surface fault matrix are green on the pinned candidate SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds the resource-manifest hash and coordinator generation to the candidate SHA, confirms atomic fence-plus-mutation evidence for every protected backend, and `git diff-index --quiet HEAD --` reports no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->

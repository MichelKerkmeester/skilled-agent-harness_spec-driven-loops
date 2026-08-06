---
title: "Implementation Summary: Identity and Lock Ownership Hardening"
description: "ATTEMPT REVERTED — the 033 remediation code was rolled back to landed-024 after a 451-test per-mode regression that could not be isolated within budget; design docs retained. See handover.md."
trigger_phrases:
  - "identity lock hardening implementation"
  - "deep-loop remediation completion"
  - "F001 F002 F003 F004 F005 evidence"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
    last_updated_at: "2026-08-06T05:29:50Z"
    last_updated_by: "claude-opus"
    recent_action: "reverted 033 to landed-024 after unisolated 451-test regression"
    next_safe_action: "re-attempt 033 root-cause-first, gate on full per-mode matrix"
    blockers:
      - "451-test per-mode regression root cause not isolated; F001/F002 ruled out by revert"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts"
    completion_pct: 0
    open_questions:
      - "Root cause of the 451-test per-mode invalid_input regression not isolated"
    answered_questions:
      - "Design retained in body; code reverted. F001-F004 findings confirmed real; only fix execution failed."
---
# Implementation Summary: Identity and Lock Ownership Hardening

> **⚠️ STATUS: ATTEMPT REVERTED — NOT IMPLEMENTED.** The runtime code for this remediation
> was rolled back to landed-024 (`5c98e4654e`) after two build attempts produced a
> 451-test per-mode regression whose root cause could not be isolated within budget. The
> content below describes the *intended* fix and is retained as design of record. The
> authoritative status, postmortem, hard lesson, and re-attempt conditions are in
> **`handover.md`**. Verified end state: `runtime/lib`+`runtime/tests` == landed-024,
> `tsc` rc 0, `agent-improvement-certificates` 14/14 pass.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-identity-and-lock-ownership-hardening |
| **Completed** | 2026-08-05 |
| **Level** | 3 |
| **Status** | Blocked |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime now treats identity and filesystem ownership as explicit evidence. The gateway denies unresolved caller identity when identity validation is required, preserves deliberately unbound shadow/legacy adapters, policy identity includes explicit authorization state, leaf publication has one process-shared winner, append locks cannot reclaim or release an unverified owner or overwrite a live restore winner, and fresh loop-lock records become visible only after complete atomic publication.

### Authorization Identity

`transition-authorization-gateway.ts` records the first unresolved actor, capability, or evidence field and returns a typed deny when identity validation is required. The predicate is true when an identity resolver is configured, the authority supplies an actor/capability/evidence binding, or the authority state is outside `shadowing` and `legacy_authoritative`. An unbound shadowing or legacy-authoritative adapter therefore keeps its intended no-identity path. If the provider itself is unavailable, the existing `GATEWAY_FAILURE` fallback remains unchanged. Legitimate bindings and resolver-backed consumers now declare their identity contract explicitly.

`transition-policy-registry.ts` rejects registrations without explicit serializable authorization state. The state digest is included in each policy identity, and runtime/test consumers now pass `authorizationState: null` or captured state rather than relying on opaque closures.

### Process-Shared Publication and Ownership

`leaf-artifact-writer.ts` holds the shared append lock across recovery, stage, write-once publication, state append, and cleanup. The result distinguishes the process that published from a process that observed a committed replay.

`atomic-state.ts` writes a pid-plus-random-nonce owner token. Reclaim requires an atomically claimed, matching token whose process is provably dead. If the claim must be restored, `linkSync(claimPath, lockPath)` performs a non-overwriting compare-and-swap: `EEXIST` preserves the live winner and removes only the detached claim. Release claims the current lock and removes it only when the token still belongs to the releasing owner; a successor remains intact.

`loop-lock.ts` writes a complete serialized owner record to a unique temporary file, fsyncs it, and hard-links it into the exclusive target path. This closes the fresh-acquisition partial-file window while preserving the existing stale-reclaim and identity-checked release races.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each confirmed item received a failing negative or contention test before its implementation. For this re-fix, the F001 omitted-binding denial was red with the guard disabled, and the F004 three-process interleaving was red against the old overwrite restore. The fixes were then validated in focused suites, all nine shadow-parity files, and the final serial owned-suite set. Policy call-site inventory, TypeScript compilation, comment hygiene, metadata generation, and strict packet validation close the documentation and static gates. No data migration, feature flag, deployment, or external mutation is part of this packet.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reject closure-only authorization state | JavaScript evaluator source cannot reveal runtime closure values; explicit state makes policy identity auditable. |
| Reuse the append lock for leaf publication | It already supplies a process-shared filesystem boundary and keeps stage, publish, and append one critical section. |
| Reclaim only a dead matching owner token | File age is not proof of death; conservative timeout is safer than deleting a live owner. |
| Compare tokens during release | A release that races a reclaim or successor must not unlink another process's lock. |
| Restore claims with non-overwriting CAS | `linkSync` either installs the detached claim into an absent path or returns `EEXIST` without replacing a live winner. |
| Atomically hard-link fresh loop-lock records | A complete temporary inode prevents partial JSON from becoming a reclaimable owner record. |
| Preserve the 024 guarantees | The gateway-only fenced append, hard-private mutator, replay short-circuit, and existing tests are not weakened. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

### Red-before Evidence

| Finding | Test | Red result |
|---------|------|------------|
| F001 | `denies caller identity when an identity-required authority supplies no binding` | `vitest` rc 1 with the identity-denial guard disabled; the caller-supplied actor ID received `allow` instead of the expected typed denial. |
| F002 | `rejects closure-only authorization state that cannot be included in policy identity` | `vitest` rc 1; identical evaluator source produced registrations instead of rejection before the explicit-state requirement. |
| F003 | `publishes one state record under cross-process contention for one iteration` | `vitest` rc 1; both contenders reported the non-publisher result before the shared publication claim. |
| F004 | `keeps a live winner when dead-owner restore races two live acquirers` | `vitest` rc 1 against the old restore; the three-process interleaving observed `overlapped: true` because `renameSync` overwrote a live winner. |

### Green-after Evidence

| Check | Result |
|-------|--------|
| `tests/unit/authorized-ledger.vitest.ts` | 33 tests passed, 0 failed, rc 0 |
| `tests/unit/locks-and-fencing.vitest.ts` | 28 tests passed, 0 failed, rc 0 |
| `tests/unit/receipts-and-effect-recovery.vitest.ts` | 58 tests passed, 0 failed, rc 0 |
| `tests/unit/loop-lock.vitest.ts` | 17 tests passed, 0 failed, rc 0 |
| `tests/unit/loop-lock-cli.vitest.ts` | 7 tests passed, 0 failed, rc 0 |
| `tests/unit/atomic-state.vitest.ts` | 17 tests passed, 0 failed, rc 0 |
| `tests/unit/leaf-artifact-writer.vitest.ts` | 23 tests passed, 0 failed, rc 0 |
| `tests/unit/branch-leases-waves.vitest.ts` | 15 tests passed, 0 failed, rc 0 |
| `tests/unit/replay-fingerprint.vitest.ts` | 39 tests passed, 0 failed, rc 0 |
| All nine listed files together | 237 tests passed, 0 failed, rc 0 |
| `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json` from `runtime` | rc 0 |

### Shadow-Parity Green-after Evidence

| File | Tests | Passed | Failed |
|------|------:|-------:|-------:|
| `deep-ai-council-shadow-parity` | 39 | 39 | 0 |
| `deep-research-shadow-parity` | 49 | 49 | 0 |
| `deep-alignment-shadow-parity` | 8 | 8 | 0 |
| `deep-review-shadow-parity` | 8 | 8 | 0 |
| `deep-improvement-common-shadow-parity` | 27 | 27 | 0 |
| `skill-benchmark-shadow-parity` | 17 | 17 | 0 |
| `model-benchmark-shadow-parity` | 37 | 37 | 0 |
| `agent-improvement-shadow-parity` | 33 | 33 | 0 |
| `shadow-parity-harness` | 31 | 31 | 0 |
| **Total** | **249** | **249** | **0** |

### Static and Packet Gates

| Check | Result |
|-------|--------|
| Changed-code comment hygiene script | Pass; no forbidden ephemeral identifiers in changed code comments |
| `generate-description.js` for this child | Pass; metadata generated |
| `backfill-graph-metadata.js` for this child | Pass; graph metadata generated |
| `validate.sh <child> --strict` | Pass; errors 0, warnings 0 |
| `run-all-drift-guards.sh` | Repository-wide alignment guard remains red on pre-existing findings; stack-folder and router-sync guards pass, and no finding names either re-fixed runtime file. |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Ambiguous malformed append locks** remain until the existing bounded acquisition timeout because the implementation refuses to guess whether an unreadable owner is dead. This is intentional fail-closed behavior.
2. **The Codex hook installer reports pre-existing drift in the home hook file from this linked worktree.** The check was run with `--allow-worktree`; the home hook file was not modified because it is outside the packet and workspace authority.
3. **The repository-wide gate is not represented as an all-green claim.** Four named pre-existing failure files remain outside this packet's modification scope; the requested owned suites are green and those files were not touched.
<!-- /ANCHOR:limitations -->

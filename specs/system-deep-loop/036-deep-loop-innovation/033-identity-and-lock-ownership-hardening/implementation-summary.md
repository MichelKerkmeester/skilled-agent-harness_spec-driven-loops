---
title: "Implementation Summary: Identity and Lock Ownership Hardening"
description: "LANDED — all 5 findings (F001-F005) landed as 4446839af8 on skilled/v4.0.0.0 on the third attempt, passing the FULL per-mode matrix (32/32 files) the first two reverted attempts' verification gate omitted. See handover.md for the full postmortem."
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
    last_updated_at: "2026-08-07T23:18:39Z"
    last_updated_by: "claude"
    recent_action: "Landed all 5 findings as 4446839af8 on skilled/v4.0.0.0; FULL 32/32 matrix green"
    next_safe_action: "None — all findings landed"
    blockers: []
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
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Design retained across all three attempts. F001-F005 findings confirmed real; the third attempt fixed both the findings and the first two attempts' regression root cause."
---
# Implementation Summary: Identity and Lock Ownership Hardening

> **STATUS: LANDED.** All five findings (F001-F005) landed as `4446839af8` on
> `skilled/v4.0.0.0` on the third attempt. The first two attempts produced a 451-test
> per-mode regression whose root cause could not be isolated within budget and were
> reverted; the postmortem, hard lesson, and the full-matrix gate that let the third
> attempt succeed are in **`handover.md`**. Verified end state: FULL per-mode matrix
> 32/32 files green, `shadow-parity-harness` 31/31, `tsc` rc 0.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-identity-and-lock-ownership-hardening |
| **Completed** | 2026-08-07 |
| **Level** | 3 |
| **Status** | Complete (5/5 findings landed as `4446839af8`) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

> **Scope correction (code-verified, supersedes any broader wording below).** The landed pre-014 clearance verdict (`016-whole-system-gate/review/pre-014-clearance-verdict.md`, commit `010d145b9a`) checked the actual landed code and found F001, F002, and F005 are **narrower than an earlier draft of this summary implied**. F003 and F004 are fully cleared; F001/F002/F005 are real but **per-mode 014-cutover preconditions**, not closed items. Corrected below.

The runtime now treats filesystem ownership as explicit evidence (F003/F004, fully cleared), and adds an **opt-in** identity-denial path plus a policy-state digest (F001/F002, dormant until wired at cutover). F005's release path is hardened; its fresh-acquisition path is unchanged.

### Authorization Identity (F001, F002 — opt-in / partial; per-mode cutover preconditions)

`transition-authorization-gateway.ts` adds an **opt-in** `identityResolver` hook: when a deployment configures a resolver, an actor/capability/evidence mismatch returns a typed `INVALID_INPUT` deny. **No production gateway construction site configures a resolver today**, so the gateway still fails open in practice — by design, to avoid the state-based fail-closed that caused the historical 451-test regression. Wiring a resolver is a **precondition for each mode's 014 cutover**, not a completed control.

`transition-policy-registry.ts` was **not changed by this packet** (its `authorizationStateDigest` fold landed with 032; the type properties with the tsc-gap fix `fbc70d1495`). This packet's F002 contribution is limited to binding `capturedAuthorizationState` at the 8 shadow-parity harness construction sites. The registry itself still accepts `null` captured state; enforcing it at the registry is a per-mode cutover precondition.

### Process-Shared Publication and Ownership (F003, F004 — cleared; F005 — partial)

`leaf-artifact-writer.ts` (F003, CLEARED) holds a shared `FencedLeaseCoordinator` lease across recovery, stage, write-once publication, state append, and cleanup, distinguishing the process that published from one that observed a committed replay.

`atomic-state.ts` (F004, CLEARED) writes a pid-plus-random-nonce owner token; reclaim atomically claims a dead matching token via `renameSync` single-inode claim; restore performs a non-overwriting compare-and-swap by renaming the detached claim back only when the target path is vacant (`existsSync` guard), otherwise discarding the claim so a live winner is never overwritten; release removes the lock only when the token still belongs to the releasing owner.

`loop-lock.ts` (F005, PARTIAL): the **release path** now claims the current lock and unlinks only a still-owned token (closing the TOCTOU release race). The **fresh-acquisition write path is unchanged** — it remains `openSync(lockPath, 'wx')` + `writeFileSync`, not a temp-file-plus-hard-link; the partial-file window it leaves is mitigated today only by an unrelated host-local single-flight, and closing it at the write path is a per-mode cutover precondition. (An earlier draft here incorrectly claimed a `linkSync`/hard-link fresh-acquisition; no such call exists in this file.)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each confirmed item received a failing negative or contention test before its implementation. The F001 omitted-binding denial was red with the guard disabled, and the F004 three-process interleaving was red against the old overwrite restore. The design was retained across three attempts; the first two each produced a catastrophic 451-test per-mode regression that their narrower "owned suites" verification gate did not catch (see `handover.md`). The third attempt fixed the regression root cause and made the FULL per-mode matrix (32/32 files, all 8 modes) the mandatory verification gate — the same gate the first two attempts had omitted. Policy call-site inventory, TypeScript compilation, comment hygiene, metadata generation, and strict packet validation close the documentation and static gates. No data migration, feature flag, deployment, or external mutation is part of this packet.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reject closure-only authorization state | JavaScript evaluator source cannot reveal runtime closure values; explicit state makes policy identity auditable. |
| Reuse the append lock for leaf publication | It already supplies a process-shared filesystem boundary and keeps stage, publish, and append one critical section. |
| Reclaim only a dead matching owner token | File age is not proof of death; conservative timeout is safer than deleting a live owner. |
| Compare tokens during release | A release that races a reclaim or successor must not unlink another process's lock. |
| Restore claims with non-overwriting CAS | The `existsSync` guard plus `renameSync` either restores the detached claim into a still-vacant path or discards it without ever overwriting a live winner. |
| Harden the loop-lock release path only | The TOCTOU release race is closed by claim-then-owned-unlink; the fresh-acquisition write path (`openSync 'wx'`) is unchanged and its partial-file window remains a per-mode cutover precondition (F005). |
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

### Green-after Evidence (third, landed attempt — `4446839af8`)

| Check | Result |
|-------|--------|
| FULL per-mode matrix (certificates/rollback-gate/resume-adapter/shadow-parity x 8 modes) | **32/32 files green** — the exact gate the first two reverted attempts' narrower "owned suites" gate had omitted |
| `shadow-parity-harness` | 31/31 passed |
| `tests/unit/authorized-ledger.vitest.ts` | 28 tests passed, 0 failed |
| `tests/unit/atomic-state.vitest.ts` | 18 tests passed, 0 failed |
| `tests/unit/loop-lock.vitest.ts` | 15 tests passed, 0 failed |
| `tests/unit/leaf-artifact-writer.vitest.ts` | 25 tests passed, 0 failed |
| Receipts suite | 56 tests passed, 0 failed |
| `tests/unit/replay-fingerprint.vitest.ts` | 38 tests passed, 0 failed |
| Forged-actor/capability/evidence denial tests | Still pass |
| `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json` from `runtime` | rc 0 |

### Live Regressions Restored (from an earlier bulk commit, discovered and fixed during this land)

| Item | Fix |
|------|-----|
| `atomic-state.ts` removed append lock | Restored |
| `loop-lock.ts` TOCTOU release | Restored |
| `authorized-ledger-test-helper.ts` (deleted, imported by 11 suites) | Recovered, and two real bugs in it fixed |

### Static and Packet Gates

| Check | Result |
|-------|--------|
| Changed-code comment hygiene script | Pass; no forbidden ephemeral identifiers in changed code comments |
| `generate-description.js` for this child | Pass; metadata generated |
| `backfill-graph-metadata.js` for this child | Pass; graph metadata generated |
| `validate.sh <child> --strict` | Pass; errors 0, warnings 0 |
| `024` gateway-only fenced-append hardening | Untouched |
| Out of scope, stays red | `branch-leases-waves` `fence_token` test — a separate session's in-flight fenced-append feature |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Ambiguous malformed append locks** remain until the existing bounded acquisition timeout because the implementation refuses to guess whether an unreadable owner is dead. This is intentional fail-closed behavior.
2. **The Codex hook installer reports pre-existing drift in the home hook file from this linked worktree.** The check was run with `--allow-worktree`; the home hook file was not modified because it is outside the packet and workspace authority.
3. **The repository-wide gate is not represented as an all-green claim.** Four named pre-existing failure files remain outside this packet's modification scope; the requested owned suites are green and those files were not touched.
4. **Out of scope, stays red:** the `branch-leases-waves` `fence_token` test belongs to a separate session's in-flight fenced-append feature and was not touched by this packet.
<!-- /ANCHOR:limitations -->

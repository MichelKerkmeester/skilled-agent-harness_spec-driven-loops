---
title: "Implementation Summary: Per-Mode Authority Flip"
description: "Delivered a dark, unwired mode-keyed authority selector, durable registry with atomic compare-and-swap, fail-closed preflight, and authority-transition ledger event for the phase-014 forward cutover edge."
trigger_phrases:
  - "per-mode authority flip implementation"
  - "deep-loop authority selector coordinator"
  - "authority compare-and-swap ledger event"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
    last_updated_at: "2026-08-09T08:20:00Z"
    last_updated_by: "claude"
    recent_action: "Built dark selector/registry/preflight/CAS/ledger event; 42/42 tests green"
    next_safe_action: "None -- operator-gated wiring/execution is a separate follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/per-mode-authority-flip.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The forward cutover_ready -> new_authoritative_reversible edge was the only genuinely unbuilt authority mutation; the rollback (dark -> legacy) direction already existed per mode"
      - "Sibling 003's cutover certificate is a pre-authorization attestation (authorityMutation: false), consumed as this coordinator's preflight input, not produced from this coordinator's output"
      - "Crash recovery between the ledger append and the registry publish is resolved by scanning the ledger for the exact transition digest before re-authorizing, not by relying on gateway-level idempotency alone"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-per-mode-authority-flip |
| **Completed** | 2026-08-09 |
| **Level** | 2 |
| **Authority** | Dark and unwired; no real mode's authority record was touched and no mode adapter was changed to consult the selector |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Sibling 003's cutover certificate already proves a mode is *ready* to flip; sibling 001's handoff already proves
every classified row reached a safe terminal state; and each mode's existing `rollback-switch.ts` already knows how
to move *back* from dark to legacy. Nothing in the runtime knew how to make the *forward* move: durably record which
route a mode's canonical writes should take, and atomically flip that route from `cutover_ready` to
`new_authoritative_reversible` with one ledger-recorded transaction. This packet builds exactly that mechanism, dark:
every function is unit-callable and unit-tested, and nothing wires it to a live mode.

### Mode-keyed authority registry

`AuthorityRegistry` persists one digest-bound JSON record per mode under a caller-supplied root directory. A mode
that has never been written reads back as its default — `legacy_authoritative` at epoch 1 — so the registry never
implicitly grants dark authority. `compareAndSwap` is the one forward edge this registry owns
(`cutover_ready(N) -> new_authoritative_reversible(N+1)`); any other current state, or a mismatched expected epoch,
throws `AuthorityFlipError('CAS_CONFLICT', ...)` and leaves the on-disk record untouched. A per-mode lock file
(`openSync(..., 'wx')`, mirroring the existing rollback-drill sandbox store's proven pattern) guards the
read-modify-write critical section, and every write goes through the existing `writeCanonicalJsonAtomic` fsync+rename
primitive.

### Canonical selector

`selectAuthorityRoute` is the one function every mode adapter would eventually call at its persistence boundary. It
recomputes and checks the record's own digest, validates the mode binding, and returns exactly one canonical route:
`legacy` for `legacy_authoritative`/`shadowing`/`cutover_ready`, `dark` for `new_authoritative_reversible`/
`new_authoritative_final`, and an explicit denial (never an implicit fallback) for `rollback_pending`, a malformed
record, an unknown state, a wrong-mode binding, a policy-version mismatch, or a stale caller-supplied record digest.

### Fail-closed preflight

`evaluateCutoverPreflight` composes — never re-derives — the evidence phase-008/013 already certify:
`verifyCutoverCertificate` (sibling 003, which already binds the mode-gate, shadow-parity, and rollback-drill
certificates) and `verifyInflightMigrationHandoff` (sibling 001). It adds only what is genuinely new to this phase:
cross-binding both siblings' evidence to the same classification-manifest digest, the eight-mode manifest-order guard
(`004-deep-improvement-common` before its three variants), and a rollback-asset presence/uniqueness check.

### Atomic coordinator and ledger event

`AuthorityFlipCoordinator.requestCutover` ties preflight, the phase-004 authorization gateway, the
authority-transition ledger event, and the registry CAS into one root-locked transaction
(`AuthorityRegistry.withTransactionLock`). The ledger append happens through the existing
`appendAuthorizedThroughFence` seam — the only sanctioned path to the hard-private `appendAuthorized` — exactly as
siblings 001 and 003 do. If a crash happens after the ledger append but before the registry CAS, a retry with the
same request detects the already-appended event by scanning the ledger for the exact transition digest and resumes
straight to the CAS, so no request ever produces a second ledger event or a partial authority state.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/per-mode-authority-flip/types.ts` | Created | Closed vocabularies, record/selector/preflight/request/event types, denial reason codes, manifest order constants |
| `runtime/lib/per-mode-authority-flip/manifest-order.ts` | Created | `checkManifestOrder`: single-mode + benchmark-variant-after-common guard |
| `runtime/lib/per-mode-authority-flip/authority-selector.ts` | Created | `selectAuthorityRoute`/`isValidAuthorityRecord`: pure canonical route resolution |
| `runtime/lib/per-mode-authority-flip/authority-registry.ts` | Created | `AuthorityRegistry`: file-scoped, lock-guarded, mode-keyed authority CAS store |
| `runtime/lib/per-mode-authority-flip/preflight.ts` | Created | `evaluateCutoverPreflight`: consumes sibling 001/003 evidence, cross-binds, adds order/asset checks |
| `runtime/lib/per-mode-authority-flip/ledger-event.ts` | Created | Authority-transition event type registration, facts builder, fenced append |
| `runtime/lib/per-mode-authority-flip/cutover-coordinator.ts` | Created | `AuthorityFlipCoordinator`: atomic preflight + authorize + append + CAS, crash-safe resume |
| `runtime/lib/per-mode-authority-flip/index.ts` | Created | Public API barrel |
| `runtime/tests/unit/per-mode-authority-flip.vitest.ts` | Created | 42 cases across selector, manifest order, registry CAS, preflight, and coordinator |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every new module reuses existing runtime substrate rather than reimplementing it: `writeCanonicalJsonAtomic` for
durable file writes, `appendAuthorizedThroughFence` for the guarded ledger append, `verifyCutoverCertificate` and
`verifyInflightMigrationHandoff` for the two siblings' already-independently-verified evidence, and the reused
`ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS`/`ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS` constants from sibling 003
rather than re-declared literals. The test suite drives real fixtures: the actual 46-row frozen census (through the
real `MigrationCoordinator` and `buildInflightMigrationHandoff`, mirroring sibling 001's own fixture helper), a real
`buildCutoverCertificate` (mirroring sibling 003's fixture), and a real `AppendOnlyLedger` +
`TransitionAuthorizationGateway` + `TransitionPolicyRegistry` stack for the coordinator's atomicity and crash-recovery
tests. Nothing in this package is imported by any other runtime module or by any mode adapter: it is dark, exactly as
scoped — confirmed by `grep -rln "per-mode-authority-flip" lib scripts` finding only this package's own files plus
one pre-existing forward-reference comment in sibling 001.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Only the forward `cutover_ready -> new_authoritative_reversible` edge is built here | Confirm-first grading (`t001-disposition.md`) found every other authority edge already implemented per mode: the readiness gate and the `rollback_pending -> legacy_authoritative` restoration already exist in each `lib/<mode>-rollback-gate/`. Rebuilding either would duplicate a proven, already-tested contract. |
| The cutover certificate is consumed, not produced | `CutoverCertificateFacts.authorityMutation` is hard-typed `false` and no CAS/selector exists anywhere upstream of sibling 003. The dispatch brief explicitly directs consuming `verifyCutoverCertificate` as this coordinator's preflight input; spec.md's "successor" phrasing is folder-navigation order, which spec.md itself flags as non-binding on runtime order. |
| Ledger append precedes the registry CAS, with a pre-check for an already-appended event | The ledger is the durable fact; the registry is a derived, re-checkable cache of it (matching the architecture's own framing: "a process flag or environment variable is never the source of truth"). Ordering the CAS last, and detecting a prior append by content rather than trusting gateway-level dedup alone, makes a crash between the two steps resumable without a second append. |
| A policy-frozen `BLOCK` disposition does not gate the flip; an `ABORTED` row does | `verifyInflightMigrationHandoff` already proves every row reached a terminal receipt. A `BLOCK` disposition (e.g. a control row that stays legacy-owned forever, mirroring `PIN`) is a legitimate terminal outcome by design; an `ABORTED` row means an attempted operation itself failed at runtime and remains genuinely unresolved. |
| One JSON file per mode, one root-level transaction lock | Per-mode files make the "changes only the selected mode" blast-radius property structural rather than merely tested; the root-level lock enforces the single-active-transaction rule from `plan.md` without inventing a distributed-lock mechanism this dark, single-process build does not need. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime TypeScript compile | PASS: `tsc --noEmit -p tsconfig.json` from `runtime/`, exit 0, zero errors |
| Targeted Vitest | PASS: 1 file, 42 tests; suite sha256 `f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00`; candidate SHA `f009b8fb9d` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed] |
| CAS rejects stale/wrong epoch | PASS: `test "rejects a stale/wrong epoch CAS and leaves the record unchanged"`, `test "rejects a CAS whose expected state does not match the current record"`, `test "rejects a stale/wrong expected epoch with zero side effects"` (coordinator level) |
| Flip requires a valid cutover certificate | PASS: `test "requires a valid cutover certificate: a tampered certificate denies with zero side effects"` |
| Crash recovery, no partial update | PASS: `test "resumes safely after a crash between the ledger append and the registry publish, with no duplicate ledger event"` |
| Sibling regression check | PASS: `cutover-certificate.vitest.ts` 41/41, `inflight-state-migration.vitest.ts` 31/31, unchanged by this build |
| Comment hygiene | PASS: no spec path, phase number, or REQ/CHK/ADR/task id in any new code comment (`grep -rniE "REQ-[0-9]|CHK-[0-9]|ADR-[0-9]|T0[0-9][0-9]\b|specs/system-deep-loop|014-staged-state|002-per-mode" lib/per-mode-authority-flip/*.ts` -> no matches) |
| Fenced-ledger rule | PASS: `appendAuthorizedThroughFence` is the only append path used; `grep -rn "appendAuthorized\b" lib/per-mode-authority-flip/` -> no matches; the one `as unknown as JsonObject` cast is the benign canonical-JSON serialization pattern already used by siblings 001/003 |
| Scoped diff | PASS: only new files under `lib/per-mode-authority-flip/` and one new test file; `git status --short` in `runtime/` shows no modified existing file |
| Dark/unwired confirmation | PASS: `grep -rln "per-mode-authority-flip" lib scripts` finds only this package's own files plus a pre-existing comment in sibling 001; no mode adapter or script invokes `AuthorityFlipCoordinator`/`selectAuthorityRoute` |
| Strict packet validation | Final state: 8 errors, all `TS rule bridge failed`/`tsx runtime missing`, byte-for-byte the same 8 rule ids that fail identically on the untouched, already-shipped sibling `001-inflight-state-migration` (confirmed by running `validate.sh --strict` against both) — a known environmental gap per the dispatch brief, not introduced by this change. Two real issues surfaced and were fixed during this task: `implementation-summary.md` was missing (`LEVEL_MATCH`), and `checklist.md`'s H1 read `# Checklist: ...` instead of the required `# Verification Checklist: ...` (`TEMPLATE_HEADERS`); both now pass. The `EVIDENCE_CITED` warning (2 items missing the bracket evidence tag) was also fixed; only the pre-existing, template-level `ANCHORS_VALID` warning remains, matching sibling 001 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`description.json`/`graph-metadata.json` are not regenerated by this build.** They still report `status: planned` from the last save, matching the same deferral siblings 001 and 003 used. These are machine-generated files this task does not hand-author; a later `generate-context.js` pass reconciles them.
2. **Strict spec-kit validation was not fully run in this worktree.** This worktree's toolchain is missing the `tsx` runtime the TS rule bridge needs — a known environmental gap unrelated to this change (see the dispatch brief and siblings 001/003's own identical note). The orchestrator runs `validate.sh --strict` from a toolchain-capable worktree.
3. **No mode adapter consults the selector, and no mode's real authority record was ever created.** This is the explicit scope boundary: the mechanism exists and is unit-verified; wiring a live mode adapter to call `selectAuthorityRoute`, and actually invoking `AuthorityFlipCoordinator.requestCutover` against a real mode's registry root, are separate, operator-gated execution steps this packet does not perform.
<!-- /ANCHOR:limitations -->

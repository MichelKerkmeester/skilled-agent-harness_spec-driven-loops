---
title: "T001 Disposition: Per-Mode Authority Flip"
description: "Confirm-first grading of every requirement/task against live code at HEAD before building."
trigger_phrases:
  - "per-mode authority flip t001 disposition"
importance_tier: "critical"
contextType: "analysis"
parent: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
---

# T001 Disposition: Per-Mode Authority Flip

## Method

Grepped `lib/` at HEAD (commit `f009b8fb9d`, siblings 001/003 already built and committed) for: `compare-and-swap|compareAndSwap|CAS\b`, `AuthoritySelector`, `AuthorityRegistry`, `flipAuthority`, `CutoverCoordinator`, `authority-transition`, and read every `*-rollback-gate/{mode-gate,rollback-switch,types}.ts` for all eight modes plus `lib/cutover-certificate/*` (003) and `lib/inflight-state-migration/*` (001).

## Findings

### ALREADY-PRESENT (reused, not rebuilt)

- **Per-mode readiness gate** — `lib/<mode>-rollback-gate/mode-gate.ts` (`<Mode>ModeMigrationGate`) already certifies phase-008 shadow-parity + rollback-drill + lifecycle/resume evidence into a `mode-migration-readiness` certificate per mode, for all eight modes. Consumed via 003's certificate, not re-verified here.
- **Rollback (dark → legacy) direction** — `lib/<mode>-rollback-gate/rollback-switch.ts` (`<Mode>RollbackSwitch`) already implements the `rollback_pending -> legacy_authoritative` edge (authorize, fence, restore, certificate) for all eight modes. REQ-012's "rollback remains available" is satisfied by this pre-existing machinery; child 002 does not touch it.
- **Cutover readiness attestation** — `lib/cutover-certificate/certificate.ts` (`buildCutoverCertificate`/`verifyCutoverCertificate`, sibling 003) already binds mode-gate certificate + shadow-parity + rollback-drill certificate + mixed-version replay + classification manifest + migration receipts + approving policy into one `CutoverCertificate` for the exact `cutover_ready(epoch N) -> new_authoritative_reversible(epoch N+1)` transition, with `authorityMutation: false` — confirming it is a pre-authorization attestation, not the mutation itself. `verifyCutoverCertificate` is reused directly as this child's primary preflight gate (per the dispatch brief), rather than re-verifying parity/drill/mode-gate independently — that would duplicate 003's contract, which plan.md's "without duplicating either contract" forbids.
- **State-migration handoff** — `lib/inflight-state-migration/migration-handoff.ts` (`buildInflightMigrationHandoff`/`verifyInflightMigrationHandoff`, sibling 001) already proves every classified row reached a terminal receipt. Reused as-is; cross-bound to the same `classificationManifestDigest` the cutover certificate already references.
- **Ledger append seam** — `appendAuthorizedThroughFence` (`lib/locks-and-fencing/fenced-ledger-writer.ts`) is the only sanctioned path to the hard-private `AppendOnlyLedger#appendAuthorized`. Reused verbatim, exactly as 003 and 001 do.
- **Rollback-window minimums** — `ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS`/`ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS` (`lib/cutover-certificate/types.ts`) reused by reference in the transition-event facts rather than re-declared, per REQ-012 ("phase-004 minimum... may not be weakened").

### CONFIRMED-MISSING (built in this child)

No file anywhere in `lib/` implements: a durable mode-keyed authority record distinct from the per-drill sandbox store; a canonical selector consulted at a write boundary; the forward `cutover_ready -> new_authoritative_reversible` compare-and-swap; the eight-mode manifest-order guard (`004-deep-improvement-common` before its three variants); or an authority-transition ledger event. The only existing CAS code (`lib/rollback-drills/sandbox-authority-store.ts`) is explicitly scoped to an ephemeral, hermetic, `/tmp`-rooted drill sandbox (`assertHermeticSandbox`) and is not reachable from, nor reusable as, a production authority store. This confirms REQ-001, REQ-002, REQ-004, REQ-008, REQ-009, REQ-010, REQ-011 as genuinely unbuilt; built now as `lib/per-mode-authority-flip/`.

## Interpretation note (documented per Logic-Sync Protocol, not escalated — direction was already given)

`spec.md`'s phase-adjacency line reads "predecessor `001`; successor `003`" and REQ-014 describes this child's output as feeding 003. Live evidence contradicts a literal reading of that ordering: `CutoverCertificateFacts.authorityMutation` is hard-typed `false`, and no CAS/selector exists anywhere upstream of 003. The dispatch brief explicitly instructs consuming 003's `verifyCutoverCertificate` as this child's preflight input. Built accordingly: 003's certificate is a precondition this child's coordinator checks before performing the real (dark, unwired) mutation; "successor" in spec.md is folder-navigation order, not build/data-flow order, as spec.md itself flags ("navigation order, not a hard runtime dependency").

## Confirm-first grading: hardening pass over the built machinery

An independent adversarial review of the built `lib/per-mode-authority-flip/`
machinery raised four gaps against the code at HEAD. Each was graded
against live behavior before any fix, per the same confirm-first method as
above (a hypothesis is not acted on until reproduced). Full red/green
evidence, fixes, and file:line citations are in `hardening-notes.md`
alongside this file. Summary of the confirm-first grading itself:

- **CONFIRMED-MISSING — reverse authority CAS.** The earlier finding above
  ("Rollback (dark -> legacy) direction — already implements the
  `rollback_pending -> legacy_authoritative` edge... REQ-012's 'rollback
  remains available' is satisfied by this pre-existing machinery") is
  correct only about the eight `*-rollback-gate/rollback-switch.ts`
  files' own authorization/fencing/certificate contract — every one of
  them explicitly returns `authorityMutation: false` and
  `phase014RestorationRequired: true`. `AuthorityRegistry` (the durable
  store this child built and the selector actually reads) had no reverse
  edge at all; a completed rollback switch could not make the selector
  stop returning dark. Confirmed real; built now (`compareAndSwapRollback`).
- **CONFIRMED-MISSING — atomic cutover / stale-lock recovery.** The
  forward CAS append-then-publish ordering had no durable prepare record,
  so a crash between the two could only be resolved by replaying the
  identical original request; the lock files carried no ownership
  metadata, so a lock left by a dead process denied every future
  transaction permanently. Confirmed real; built now (prepare/commit
  marker + reconciliation, PID/TTL stale-lock reclaim).
- **CONFIRMED-MISSING — deny illegitimately-blocked handoff rows.**
  `evaluateCutoverPreflight` checked only `abortedRows`; a row that vetoed
  to `BLOCKED` for missing/stale/invalid fresh evidence (as opposed to a
  row whose disposition the census permanently freezes to `BLOCK`) still
  read `ready`. Confirmed real; built now, narrowed to exclude the
  frozen-BLOCK rows a literal `blockedRows === 0` gate would have made
  `ready` unreachable for entirely (see "Deliberately out of scope" in
  `hardening-notes.md`).
- **CONFIRMED-MISSING — full frozen-prefix order from durable state.**
  `checkManifestOrder` enforced only "a benchmark variant may not flip
  before `004-deep-improvement-common`" and trusted a caller-supplied
  `alreadyFlippedModes` set; a coordinator call naming the eighth manifest
  mode with a forged predecessor claim and zero predecessors actually
  flipped in the registry completed a full flip. Confirmed real, live
  reproduction included in `hardening-notes.md`; built now
  (`deriveFlippedModes` + coordinator-enforced exact prefix).

All four gaps reproduced as genuine bugs against the code as it stood; none
were refuted.

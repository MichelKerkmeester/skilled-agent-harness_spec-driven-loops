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

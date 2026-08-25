---
title: "Changelog: Runtime Enablement [012-runtime-enablement]"
description: "Append gateway and legacy projection, pilot and fleet authority flips, legacy-writer retirement, effect producer and read cache, mode projection contracts, whole-system gate, closeout documentation, full finalize, and over-engineering deletion across eleven phase children."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-08-24

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement` (Phase Parent)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation`

### Summary

This phase turns on the dark deep-loop substrate: it builds the append gateway and per-event projection the modes lacked, migrates write protocols onto that boundary, flips authority serially across all eight modes, retires direct-append writers, wires fail-closed effect recording, and reaches a literal whole-system gate PASS on the finalized runtime. All eleven phase children are complete; the epic awaits only the operator ff-merge gate.

### What Changed

- **001 append-gateway-and-projection** — Complete. Delivered `appendModeEvent`, the first production projection contract, the `append-mode-event.cjs` CLI, and ten unit tests with proven negative controls.
- **002 deep-research-enablement** — Complete. Migrated the pilot write protocol onto the gateway, built the promotion and classification edges, executed the pilot flip, and proved post-flip fan-out writes through the gateway with the legacy file as a pure projection.
- **003 fleet-enablement** — Complete. Built the serial enablement driver, CLI, and tests; executed the fleet flip via the operator-chosen registry-direct path; all eight modes hold durable `new_authoritative_reversible` records.
- **004 legacy-writer-retirement** — Complete. Inventoried agent-performed direct appends, added `check-direct-append.cjs` gated on ledger authority, and widened enforcement under `new_authoritative_final`.
- **005 whole-system-gate** — Complete. Built the frozen-SHA gate with seven checks and blocking receipts; re-measured on the finalized tree to a literal PASS with none not-run.
- **006 enablement-closeout** — Complete. Ran the claim sweep, reconciled `036` statuses, feature catalog, and manual-testing playbook against the finalized runtime.
- **007 effect-enablement** — Complete. Wired fail-closed effect intent and confirmation at the live `fanout-run.cjs` launcher seam through the audited effect gateway.
- **008 ledger-read-cache** — Complete. Added an opt-in, default-off verified-events read cache on `AppendOnlyLedger`, enabled on the per-lineage effect ledger for a measured ~40% per-dispatch win.
- **009 mode-projection-contracts** — Complete. Built six ledger-fold projection surface contracts, honestly reclassified three non-foldable surfaces, and reached zero mode-owned coverage gaps.
- **010 full-enablement-finalize** — Complete. Finalized all eight modes to `new_authoritative_final`, dropped the legacy shadow writer, taught `verify-authority` the final tier, and re-measured the gate to a proven literal PASS.
- **011 delete-overengineering** — Complete. Removed rollback ceremony, one-time migration scaffolding, and five dependency-ordered residue waves proven safe by import-graph and audit evidence.

### Status

Complete. All eight modes read `new_authoritative_final` from stored records; the whole-system gate passes; legacy writers are retired and guarded. Pending only the operator ff-merge gate.

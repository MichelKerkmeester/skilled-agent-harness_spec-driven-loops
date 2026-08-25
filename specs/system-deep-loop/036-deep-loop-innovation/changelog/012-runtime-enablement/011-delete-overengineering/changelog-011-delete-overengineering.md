---
title: "Changelog: Delete Over-Engineering [012-runtime-enablement/011-delete-overengineering]"
description: "Five dependency-ordered deletion waves removing second-order migration, rollback, and over-built runtime residue after all eight deep-loop modes finalized to new_authoritative_final — leaf removals, legacy-compat converters, mode-contracts value layer, rollout tooling, and authority-registry CAS reduction."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering` (Phase Parent)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement`

### Summary

This phase parent removes the second-order migration, rollback, and over-built machinery left in the deep-loop runtime after all eight modes finalized to `new_authoritative_final`. A prior wave had already removed rollback ceremony and one-time scaffolding; this program deletes the evidence-backed residue surfaced by a 10-iteration audit and repo-wide zero-caller re-proof, as five dependency-ordered waves. All five children are complete; the live ledger loop and authority posture are unchanged.

### What Changed

- **001 leaf-removals** — Complete. Removed F5 hierarchical-budgets shadow-adapters, F6 receipts legacy-recovery manifest, and F8 dead `AUTHORITY_FLIP_COMMON_*` constants with barrel and test references severed first.
- **002 legacy-compat-converters** — Complete. Deleted seven per-mode `legacy-compatibility.ts` converters (F1, ~4,306 LOC) as one cross-calling set; kept `deep-research-ledger-schema` and `tests/helpers/legacy-real-log.ts` as live callers.
- **003 mode-contracts-value-layer** — Complete. Removed F2 conformance engine value files; kept `mode-contract-types.ts` and `substrate-ports.ts`; relocated `matchesPreparedAuthorizationDecision` byte-for-byte into `authorized-ledger`.
- **004 rollout-flip-tooling** — Complete. Removed F3 fleet-enablement stack (`enable-modes.cjs` + `lib/fleet-enablement/`). F4 (`flip-authority.cjs`) was resequenced into phase 005 because `authority-finalize.vitest.ts` tests both F4 and the F7 CAS mutator.
- **005 authority-registry-cas-reduction** — Complete. Reduced F7 CAS mutators in `authority-registry.ts` (637 → 298 LOC) while keeping the read path and lock family byte-for-byte; removed the resequenced F4 flip runner and its test files together.

### Status

Complete. All five waves landed green with tsc, authority (8/8 `new_authoritative_final`), and suite gates unchanged by failure name. No authority moves; integration to v4/main awaits the operator ff-merge gate.

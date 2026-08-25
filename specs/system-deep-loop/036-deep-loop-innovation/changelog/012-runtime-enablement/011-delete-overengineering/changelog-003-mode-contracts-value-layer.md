---
title: "Changelog: Mode-Contracts Value Layer [012-runtime-enablement/011-delete-overengineering/003-mode-contracts-value-layer]"
description: "F2 removal of the mode-contracts conformance engine with byte-identical relocation of matchesPreparedAuthorizationDecision and retention of mode-contract-types.ts plus substrate-ports.ts."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-24

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/003-mode-contracts-value-layer` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering`

### Summary

Wave 3 removed the dead mode-contracts value layer (F2) — the conformance runner, strict gate validators, and version-compatibility policy — while preserving the type contract all eight reducers import and the substrate-port types it depends on. One function still called by a kept authorized-ledger test was relocated byte-for-byte before deletion.

### What Changed

- Created `lib/authorized-ledger/prepared-authorization-matcher.ts` with a byte-identical relocation of `matchesPreparedAuthorizationDecision` and its helpers from the deleted strict-gate-validator.
- Repointed the authorized-ledger vitest import to the new module (import source only).
- Severed every value re-export from `lib/mode-contracts/index.ts`; the barrel now re-exports `mode-contract-types.ts` only.
- Deleted `conformance.ts`, `strict-gate-validator.ts`, `compatibility-policy.ts`, and `tests/unit/mode-contracts.vitest.ts`.
- Retained `substrate-ports.ts` after tsc surfaced that `mode-contract-types.ts` imports its `ModeSubstratePorts` / `ModeSubstratePortName` types.
- Rewrote `lib/mode-contracts/README.md` to the type-only reality (residue sweep).

### Status

Complete. Relocation diff vs `git HEAD` original empty; typecheck returned to 57 baseline errors (0 `TS2307`); authority 8/8 `new_authoritative_final`; prepared-authorization test block passes with the new import.

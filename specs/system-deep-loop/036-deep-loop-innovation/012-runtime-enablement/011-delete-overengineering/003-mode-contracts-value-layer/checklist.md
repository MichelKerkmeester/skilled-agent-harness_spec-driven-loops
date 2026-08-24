---
title: "Checklist: Phase 003 Mode-Contracts Value Layer"
description: "Acceptance checklist for the F2 mode-contracts value-layer removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/003-mode-contracts-value-layer"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 003 Mode-Contracts Value Layer

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] Fresh baseline captured (tsc error count, runtime failing-set by name) — re-captured for this wave, not assumed from Wave 1's plan.md.
- [x] Zero-caller re-scan clean for the eight `mode-contracts` value symbols named in `spec.md` REQ-002.
- [x] `matchesPreparedAuthorizationDecision` exception re-confirmed: only hit outside `lib/mode-contracts/` + its own test is `tests/unit/authorized-ledger.vitest.ts`.
- [x] All 8 reducer packages re-confirmed `import type`-only against `mode-contracts` (no value import).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] `lib/authorized-ledger/prepared-authorization-matcher.ts` created with `matchesPreparedAuthorizationDecision` + `digest`/`isRecord`/`isDigest`.
- [x] `lib/authorized-ledger/index.ts` exports `matchesPreparedAuthorizationDecision`.
- [x] `tests/unit/authorized-ledger.vitest.ts` import line repointed; no other line changed in that file.
- [x] `lib/mode-contracts/strict-gate-validator.ts` no longer defines `matchesPreparedAuthorizationDecision` (pre-deletion state, before delete step).
- [x] `lib/mode-contracts/index.ts` reduced to types-only (`mode-contract-types.ts` re-exports); every value export removed.
- [x] `lib/mode-contracts/conformance.ts` deleted.
- [x] `lib/mode-contracts/strict-gate-validator.ts` deleted.
- [x] `lib/mode-contracts/compatibility-policy.ts` deleted.
- [x] `lib/mode-contracts/substrate-ports.ts` **RETAINED** (KEEP correction) — its `ModeSubstratePorts` / `ModeSubstratePortName` types are imported by `mode-contract-types.ts`; deleting it broke the KEEP file's tsc (`TS2307`).
- [x] `tests/unit/mode-contracts.vitest.ts` deleted.
- [x] `lib/mode-contracts/mode-contract-types.ts` and `substrate-ports.ts` — untouched, byte-for-byte, confirmed by diff.
- [x] No other file touched (scope-lock).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] tsc: no new `TS2307`, total ≤ 57. Evidence: 57→57 errors, `TS2307` 0 after restoring `substrate-ports.ts` (`scratch/tsc-baseline-003.txt`, `scratch/tsc-after-003.txt`).
- [x] authority: 8/8 `new_authoritative_final`. Evidence: `verify-authority.cjs` — `allOnLedger` true.
- [x] runtime suite: failing set unchanged by name; `authorized-ledger.vitest.ts` prepared-authorization block (13 cases) green. Evidence: 14 failed / 2630 passed / 7 skipped; by-name diff vs post-002 baseline = zero new/gone; targeted run: prepared-auth block passes.
- [x] residue rg: zero non-deleted references, except `matchesPreparedAuthorizationDecision` at its new home. Evidence: `rg` clean; matcher resolves only to `authorized-ledger/{prepared-authorization-matcher,index}.ts` + its test.
- [x] relocation fidelity: `matchesPreparedAuthorizationDecision` + helpers diff vs `git HEAD` original = identical.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — this is a pure deletion-and-relocation wave, not a bug fix; finding-class and producer-inventory
categories do not apply. Completeness criteria are defined in `spec.md` REQUIREMENTS and SUCCESS CRITERIA
instead.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

N/A — no new code, secrets, or input-handling surface introduced; this wave deletes existing zero-caller
code and relocates one function to the module that owns its domain types.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] Parent PHASE MAP row for `003-mode-contracts-value-layer` flipped to Complete; `graph-metadata.json` `last_active_child_id` set.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Temp files in scratch/ only.
- [x] scratch/ cleaned before completion.
- [x] One commit, `<100` files, guard respected.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 24 | 24 |

**Verification Date**: 2026-08-24 (Status: Complete — all gates green; substrate-ports.ts retained per KEEP correction)
<!-- /ANCHOR:summary -->

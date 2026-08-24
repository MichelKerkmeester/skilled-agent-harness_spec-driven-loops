---
title: "Checklist: Phase 004 Rollout Tooling"
description: "Acceptance checklist for the F3 fleet-enablement removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/004-rollout-flip-tooling"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 004 Rollout Tooling

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

- [x] Fresh baseline captured (tsc 57 errors / 0 `TS2307`; runtime failing-set by name) — `scratch/tsc-baseline-004.txt`.
- [x] Zero-caller re-scan clean for F3 (no hit outside `fleet-enablement/` self, its tests, or its README).
- [x] `prepareCutover`/`compareAndSwap`/`compareAndSwapFinalize` confirmed called only by
  `enable-modes.cjs` and `flip-authority.cjs` outside the registry itself.
- [x] Adjacency found and resolved: `authority-finalize.vitest.ts` directly tests `flip-authority.cjs`, so
  F4 was resequenced to phase 005 (whole-file test deletion there). See `spec.md` §2/§8.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] `scripts/README.md` `enable-modes.cjs` row removed.
- [x] `lib/README.md` `fleet-enablement/` row removed.
- [x] `lib/legacy-projections/README.md` § CONSUMERS bullet for `fleet-enablement/mode-surface-map.ts`
  removed; `append-mode-event.ts` bullet intact.
- [x] `scripts/enable-modes.cjs` deleted.
- [x] `lib/fleet-enablement/` deleted (whole directory, including its `README.md`).
- [x] `tests/unit/enable-modes-cli.vitest.ts` deleted.
- [x] `tests/unit/fleet-enablement.vitest.ts` deleted.
- [x] `scripts/flip-authority.cjs` / `flip-authority-cli.vitest.ts` / `authority-finalize.vitest.ts`
  **NOT** touched (F4 resequenced to phase 005) — confirmed by diff.
- [x] `authority-registry` untouched (out of scope) — confirmed by diff.
- [x] No other file touched beyond the F3 set and its three doc severs (scope-lock).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] tsc: no new `TS2307`, total ≤ fresh baseline. Evidence: 57 → 56 (dead `enablement-driver.ts` TS2352 gone), `TS2307` 0 (`scratch/tsc-after-004.txt`).
- [x] authority: 8/8 `new_authoritative_final`. Evidence: `verify-authority.cjs` — `allOnLedger` true, 8/8 final.
- [x] runtime suite: failing set unchanged by name. Evidence: `scratch/suite-after-004.log` — by-name diff vs baseline = zero new failures; the two deleted F3 test files drop from the suite, no new failures introduced.
- [x] residue rg: zero non-deleted references. Evidence: `rg` for `fleet-enablement` / `enable-modes` / `runFleetEnablement` across the runtime → clean.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — this is a pure deletion wave, not a bug fix; finding-class and producer-inventory categories do not
apply. Completeness criteria are defined in `spec.md` REQUIREMENTS and SUCCESS CRITERIA instead.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

N/A — no new code, secrets, or input-handling surface introduced; this wave only deletes existing
zero-caller code.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] Parent PHASE MAP row for 004 flipped to Complete; `graph-metadata.json` `last_active_child_id` set.
- [x] Phase 005 scope updated to carry F4 (`flip-authority.cjs`) alongside F7 (CAS reduction).
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
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 22 | 22 |

**Verification Date**: 2026-08-24 (Status: Complete — all gates green; F4 resequenced to phase 005)
<!-- /ANCHOR:summary -->

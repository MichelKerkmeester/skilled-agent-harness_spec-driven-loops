---
title: "Checklist: Phase 004 Rollout & Flip Tooling"
description: "Acceptance checklist for the F3/F4 rollout/flip-tooling removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/004-rollout-flip-tooling"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 004 Rollout & Flip Tooling

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

- [ ] Fresh baseline captured (tsc error count, runtime failing-set by name).
- [ ] Zero-caller re-scan clean for F3, F4 (no hit outside each module's own files, tests, or the expected
  non-dependency comment).
- [ ] `prepareCutover`/`compareAndSwap`/`compareAndSwapFinalize` confirmed called only by
  `enable-modes.cjs` and `flip-authority.cjs` outside `authority-registry.ts` itself.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] `scripts/README.md` `enable-modes.cjs` row removed.
- [ ] `lib/README.md` `fleet-enablement/` row removed.
- [ ] `lib/legacy-projections/README.md` § CONSUMERS bullet for `fleet-enablement/mode-surface-map.ts`
  removed; `append-mode-event.ts` bullet intact.
- [ ] `scripts/enable-modes.cjs` deleted.
- [ ] `lib/fleet-enablement/` deleted (whole directory, including its `README.md`).
- [ ] `tests/unit/enable-modes-cli.vitest.ts` deleted.
- [ ] `tests/unit/fleet-enablement.vitest.ts` deleted.
- [ ] `scripts/flip-authority.cjs` deleted.
- [ ] `tests/unit/flip-authority-cli.vitest.ts` deleted.
- [ ] `authority-registry.ts` untouched (out of scope for this phase — confirmed by diff).
- [ ] No other file touched (scope-lock).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] tsc: no new `TS2307`, total ≤ fresh baseline. Evidence: __________
- [ ] authority: 8/8 `new_authoritative_final`. Evidence: __________
- [ ] runtime suite: failing set unchanged by name. Evidence: __________
- [ ] residue rg: zero non-deleted references. Evidence: __________
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

- [ ] Parent PHASE MAP row for 004 flipped to Complete; `graph-metadata.json` `last_active_child_id` set.
- [ ] Phase 005 unblocked — `authority-registry.ts` CAS mutators now have zero callers, ready for that
  phase's reduction.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] Temp files in scratch/ only.
- [ ] scratch/ cleaned before completion.
- [ ] One commit, `<100` files, guard respected.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 22 | Pending execution |

**Verification Date**: Not yet executed (Status: Planned)
<!-- /ANCHOR:summary -->

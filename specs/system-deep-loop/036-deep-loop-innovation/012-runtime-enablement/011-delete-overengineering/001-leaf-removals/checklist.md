---
title: "Checklist: Phase 001 Leaf Removals"
description: "Acceptance checklist for the F5/F6/F8 leaf-removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/001-leaf-removals"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 001 Leaf Removals

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

- [x] Fresh baseline captured (tsc 57 errors; runtime failing-set 14 by name).
- [x] Zero-caller re-scan clean for F5, F6, F8 — re-proved every exported symbol, not just the named ones, before deletion.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] `hierarchical-budgets/index.ts` shadow-adapters re-export removed.
- [x] `receipts-and-effect-recovery/index.ts` legacy-compat re-export removed.
- [x] `per-mode-authority-flip/index.ts` `AUTHORITY_FLIP_COMMON_*` export removed.
- [x] `per-mode-authority-flip/types.ts` — only the two dead constants removed, rest intact.
- [x] Shadow test block removed from `hierarchical-budgets.vitest.ts`.
- [x] Legacy-compat test block removed from `receipts-and-effect-recovery.vitest.ts`.
- [x] `shadow-adapters.ts` deleted.
- [x] `receipts-and-effect-recovery/legacy-compatibility.ts` deleted.
- [x] No unrelated file touched — 8 manifest files, plus 2 module READMEs whose stale references to the deleted files the residue sweep caught (documented deviation in `implementation-summary.md`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] tsc: no new `TS2307`, total ≤ 57. Evidence: 57→57 errors, `TS2307` count 0 (`scratch/tsc-baseline-001.txt`, `scratch/tsc-after-001.txt`).
- [x] authority: 8/8 `new_authoritative_final`. Evidence: `verify-authority.cjs` — 8 modes, epoch 3, `allOnLedger` true.
- [x] runtime suite: failing set unchanged by name. Evidence: 14 failed / 2692 passed / 7 skipped; by-name diff vs pre-removal baseline (`suite_merged.txt`) = zero new, zero gone.
- [x] residue rg: zero non-deleted references. Evidence: `rg` over `lib`+`scripts`+`tests` incl. READMEs → no hits.
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

- [x] Parent PHASE MAP row for 001 flipped to Complete; `graph-metadata.json` `last_active_child_id` set to `001-leaf-removals`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Temp files in scratch/ only — evidence logs and the goal-prompt deliverable live under the parent `scratch/`; the child has no scratch.
- [x] scratch/ retains only intentional artifacts (gate-evidence logs, the operator's goal prompt, relocated prior-mission docs) — no transient cruft.
- [x] One commit, `<100` files, mass-deletion guard respected (not overridden).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 24 | 24 |

**Verification Date**: 2026-08-24 (Status: Complete — all gates green)
<!-- /ANCHOR:summary -->

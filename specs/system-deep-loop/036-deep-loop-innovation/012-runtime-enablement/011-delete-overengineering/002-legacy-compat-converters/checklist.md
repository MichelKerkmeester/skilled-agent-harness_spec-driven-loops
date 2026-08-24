---
title: "Checklist: Phase 002 Legacy-Compat Converters"
description: "Acceptance checklist for the F1 seven-module legacy-compat removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/002-legacy-compat-converters"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 002 Legacy-Compat Converters

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

- [x] Fresh baseline captured (tsc error count, runtime failing-set by name).
- [x] Zero-caller re-scan clean for all 7 F1 targets (no hit outside each module's dir + test, or the noted cross-module cluster).
- [x] Confirmed `tests/helpers/legacy-real-log.ts` is imported by `tests/unit/deep-research-ledger-schema.vitest.ts` (KEEP proven, not assumed).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] `deep-ai-council-ledger-schema/index.ts` legacy-compat re-export removed.
- [x] `deep-improvement-common-ledger-schema/index.ts` legacy-compat re-export removed.
- [x] `model-benchmark-ledger-schema/index.ts` legacy-compat re-export removed.
- [x] `deep-alignment-ledger-schema/index.ts` legacy-compat re-export removed.
- [x] `deep-review-ledger-schema/index.ts` legacy-compat re-export removed.
- [x] `skill-benchmark-ledger-schema/index.ts` legacy-compat re-export removed.
- [x] `agent-improvement-ledger-schema/index.ts` legacy-compat re-export removed.
- [x] Legacy-compat `it()` block removed from each of the 7 matching test files; unrelated `it()` blocks in the same file untouched.
- [x] Now-dead `decide<Mode>Compatibility` / `upcastLegacy<Mode>Record` imports removed from all 7 test files.
- [x] Now-dead `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` imports removed from the 5 test files that had them (deep-ai-council, deep-improvement-common, deep-alignment, deep-review, skill-benchmark).
- [x] All 7 `legacy-compatibility.ts` files deleted.
- [x] `deep-research-ledger-schema/legacy-compatibility.ts`, its barrel export, and its test file untouched.
- [x] `tests/helpers/legacy-real-log.ts` untouched (not deleted, not edited).
- [x] No other file touched (scope-lock).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] tsc: no new `TS2307`, total ≤ 57. Evidence: 57→57 errors, `TS2307` 0, no new error signature (`scratch/tsc-baseline-002.txt`, `scratch/tsc-after-002.txt`).
- [x] authority: 8/8 `new_authoritative_final`. Evidence: `verify-authority.cjs` — 8 modes, epoch 3, `allOnLedger` true.
- [x] runtime suite: failing set unchanged by name; `deep-research-ledger-schema.vitest.ts` passes. Evidence: 14 failed / 2666 passed / 7 skipped; by-name diff vs post-001 baseline = zero new, zero gone.
- [x] residue rg: zero non-deleted references. Evidence: `rg` all 14 removed symbols over `lib`+`scripts`+`tests` → no hits; 8 stale README rows removed.
- [x] KEEP-diff: `git diff --stat` on the deep-research module + test + `legacy-real-log.ts` is empty. Evidence: empty diffstat confirmed.
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

- [x] Parent PHASE MAP row for `002-legacy-compat-converters` flipped to Complete; `graph-metadata.json` `last_active_child_id` set.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Temp files in scratch/ only.
- [x] scratch/ cleaned before completion.
- [x] One commit, `<100` files (21 expected), guard respected.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 26 | 26 |

**Verification Date**: 2026-08-24 (Status: Complete — all gates green)
<!-- /ANCHOR:summary -->

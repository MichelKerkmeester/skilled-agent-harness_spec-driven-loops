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

- [ ] Fresh baseline captured (tsc error count, runtime failing-set by name).
- [ ] Zero-caller re-scan clean for all 7 F1 targets (no hit outside each module's dir + test, or the noted cross-module cluster).
- [ ] Confirmed `tests/helpers/legacy-real-log.ts` is imported by `tests/unit/deep-research-ledger-schema.vitest.ts` (KEEP proven, not assumed).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] `deep-ai-council-ledger-schema/index.ts` legacy-compat re-export removed.
- [ ] `deep-improvement-common-ledger-schema/index.ts` legacy-compat re-export removed.
- [ ] `model-benchmark-ledger-schema/index.ts` legacy-compat re-export removed.
- [ ] `deep-alignment-ledger-schema/index.ts` legacy-compat re-export removed.
- [ ] `deep-review-ledger-schema/index.ts` legacy-compat re-export removed.
- [ ] `skill-benchmark-ledger-schema/index.ts` legacy-compat re-export removed.
- [ ] `agent-improvement-ledger-schema/index.ts` legacy-compat re-export removed.
- [ ] Legacy-compat `it()` block removed from each of the 7 matching test files; unrelated `it()` blocks in the same file untouched.
- [ ] Now-dead `decide<Mode>Compatibility` / `upcastLegacy<Mode>Record` imports removed from all 7 test files.
- [ ] Now-dead `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` imports removed from the 5 test files that had them (deep-ai-council, deep-improvement-common, deep-alignment, deep-review, skill-benchmark).
- [ ] All 7 `legacy-compatibility.ts` files deleted.
- [ ] `deep-research-ledger-schema/legacy-compatibility.ts`, its barrel export, and its test file untouched.
- [ ] `tests/helpers/legacy-real-log.ts` untouched (not deleted, not edited).
- [ ] No other file touched (scope-lock).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] tsc: no new `TS2307`, total ≤ 57. Evidence: __________
- [ ] authority: 8/8 `new_authoritative_final`. Evidence: __________
- [ ] runtime suite: failing set unchanged by name; `deep-research-ledger-schema.vitest.ts` passes. Evidence: __________
- [ ] residue rg: zero non-deleted references. Evidence: __________
- [ ] KEEP-diff: `git diff --stat` on the deep-research module + test + `legacy-real-log.ts` is empty. Evidence: __________
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

- [ ] Parent PHASE MAP row for `002-legacy-compat-converters` flipped to Complete; `graph-metadata.json` `last_active_child_id` set.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] Temp files in scratch/ only.
- [ ] scratch/ cleaned before completion.
- [ ] One commit, `<100` files (21 expected), guard respected.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation + Code Quality + Testing + Documentation + File Organization items | 24 | Pending execution |

**Verification Date**: Not yet executed (Status: Planned)
<!-- /ANCHOR:summary -->

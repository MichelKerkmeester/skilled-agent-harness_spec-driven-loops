---
title: "Changelog: Legacy-Compat Converters [012-runtime-enablement/011-delete-overengineering/002-legacy-compat-converters]"
description: "F1 removal of seven per-mode legacy-compatibility.ts ledger schema upcasters deleted as one cross-calling set, with deep-research-ledger-schema and legacy-real-log.ts kept as live callers."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/002-legacy-compat-converters` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering`

### Summary

Wave 2 removed the seven per-mode `legacy-compatibility.ts` converters (F1, ~2,506 production LOC) that classified and upcast pre-ledger JSONL rows during migration. Four modules cross-called each other's compat functions, so all seven were deleted as one set. The eighth sibling — `deep-research-ledger-schema` — and `tests/helpers/legacy-real-log.ts` remain because `append-mode-event.cjs` still calls the deep-research upcaster.

### What Changed

- Deleted seven `lib/<mode>-ledger-schema/legacy-compatibility.ts` files (deep-ai-council, deep-improvement-common, model-benchmark, deep-alignment, deep-review, skill-benchmark, agent-improvement).
- Removed each module barrel's `decide*Compatibility` + `upcastLegacy*Record` re-export blocks (28 lines across seven index files).
- Removed legacy-compat test blocks and dead imports from seven unit vitest files (889 lines); surviving tests untouched.
- Cleaned eight stale README CONTENTS rows in a residue sweep (seven for this wave plus one wave-001 straggler).
- Left `deep-research-ledger-schema`, its converter, and `tests/helpers/legacy-real-log.ts` byte-for-byte unchanged (KEEP-diff empty).

### Status

Complete. Typecheck held at 57 baseline errors (0 new `TS2307`); authority 8/8 `new_authoritative_final`; suite failing set unchanged by name; zero residue on all 14 removed symbols.

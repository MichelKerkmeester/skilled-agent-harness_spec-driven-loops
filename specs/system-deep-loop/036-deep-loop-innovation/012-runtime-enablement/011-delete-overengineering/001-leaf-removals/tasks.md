---
title: "Tasks: Phase 001 Leaf Removals"
description: "Ordered removal manifest for F5/F6/F8 — sever barrels first, then delete, then verify."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/001-leaf-removals"
trigger_phrases: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 001 Leaf Removals

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Order matters: sever every re-export and reference **before** deleting a target file, so tsc never sees a
dangling import. All paths are under `.opencode/skills/system-deep-loop/runtime/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T1 — Re-confirm zero callers (remover, read-only)
- [x] `rg -n "shadow-adapters|DarkAdmissionComparison|FanOutShadowInput"` across `lib/` + `scripts/` — expect only `hierarchical-budgets/` self + tests.
- [x] `rg -n "LEGACY_RECOVERY_SURFACES|LEGACY_RECOVERY_SURFACE_MANIFEST_DIGEST|assessLegacyDispatchReceipt"` — expect only `receipts-and-effect-recovery/` self + tests.
- [x] `rg -n "AUTHORITY_FLIP_COMMON_MODE|AUTHORITY_FLIP_COMMON_VARIANTS"` — expect only `per-mode-authority-flip/{types.ts,index.ts}` + any test.
- [x] STOP and report if any hit lands outside the module's own dir or its tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 — Sever barrels & references (edits first)
- [x] `lib/hierarchical-budgets/index.ts`: remove the `shadow-adapters` re-export line(s).
- [x] `lib/receipts-and-effect-recovery/index.ts`: remove the `legacy-compatibility` re-export line(s).
- [x] `lib/per-mode-authority-flip/index.ts`: remove the `AUTHORITY_FLIP_COMMON_*` re-export.
- [x] `lib/per-mode-authority-flip/types.ts`: remove only the `AUTHORITY_FLIP_COMMON_MODE` + `AUTHORITY_FLIP_COMMON_VARIANTS` declarations; leave the rest of the file intact.
- [x] `tests/hierarchical-budgets/hierarchical-budgets.vitest.ts`: remove the shadow-parity `describe`/`it` block(s) only.
- [x] `tests/unit/receipts-and-effect-recovery.vitest.ts`: remove the legacy-compat `describe`/`it` block(s) only.

### T3 — Delete targets
- [x] Delete `lib/hierarchical-budgets/shadow-adapters.ts`.
- [x] Delete `lib/receipts-and-effect-recovery/legacy-compatibility.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T4 — Verify (orchestrator runs; devin cannot run vitest)
- [x] `node .../typescript/bin/tsc -p runtime/tsconfig.json` → no new `TS2307`; error count ≤ 57 baseline.
- [x] `node runtime/scripts/verify-authority.cjs` → 8 modes `new_authoritative_final`.
- [x] Runtime suite (`vitest run --reporter=dot`) → failing set unchanged by name vs baseline.
- [x] `rg` re-scan of every deleted symbol → zero non-deleted references.

### T5 — Commit
- [x] One conventional commit, `<100` files, mass-deletion guard respected (not overridden).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All verification gates pass (see `spec.md` SUCCESS CRITERIA / `plan.md` TESTING STRATEGY)
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

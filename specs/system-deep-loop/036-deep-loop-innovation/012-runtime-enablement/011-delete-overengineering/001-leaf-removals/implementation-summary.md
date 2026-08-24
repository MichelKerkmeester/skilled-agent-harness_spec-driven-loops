---
title: "Implementation Summary: Phase 001 Leaf Removals"
description: "F5/F6/F8 leaf removal — shadow adapters, recovery manifest, dead constants — with gate evidence."
trigger_phrases:
  - "phase 001 leaf removals"
  - "shadow adapters removed"
  - "recovery manifest removed"
importance_tier: "normal"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/001-leaf-removals"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/001-leaf-removals"
    last_updated_at: "2026-08-24T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Removed F5 shadow-adapters, F6 recovery manifest, F8 dead constants; all gates green"
    next_safe_action: "Proceed to phase 002 (F1 seven per-mode legacy-compatibility.ts)"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Zero-caller proof re-confirmed at deletion time across every exported symbol, not just the named ones"
---
# Implementation Summary: Phase 001 Leaf Removals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-leaf-removals |
| **Completed** | 2026-08-24 |
| **Level** | 2 |
| **Actual Effort** | 1 removal wave (GLM-5.2-High remover, orchestrator-verified) |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Removed three independent leaf residues left behind after all 8 deep-loop modes were finalized to
`new_authoritative_final`: the hierarchical-budget shadow adapters (F5), the receipts recovery-manifest
legacy-compatibility surface (F6), and two dead `AUTHORITY_FLIP_COMMON_*` constants (F8). None had a live
caller. GLM-5.2-High (via cli-devin) performed the edits and deletions from the ordered manifest; the
orchestrator ran every gate, because that executor cannot run vitest.

The intra-target order was strict: each barrel re-export and test reference was severed **before** the
underlying file was deleted, so the typechecker never observed a dangling import.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/hierarchical-budgets/shadow-adapters.ts` | Deleted | F5 — dead shadow adapters comparing new budget decisions against legacy guards |
| `lib/receipts-and-effect-recovery/legacy-compatibility.ts` | Deleted | F6 — dead recovery-surface manifest and dispatch-receipt assessor |
| `lib/hierarchical-budgets/index.ts` | Modified | Removed the shadow-adapters re-export block |
| `lib/receipts-and-effect-recovery/index.ts` | Modified | Removed the legacy-compatibility re-export |
| `lib/per-mode-authority-flip/index.ts` | Modified | Removed the `AUTHORITY_FLIP_COMMON_*` re-export |
| `lib/per-mode-authority-flip/types.ts` | Modified | Removed the two dead `AUTHORITY_FLIP_COMMON_MODE` / `AUTHORITY_FLIP_COMMON_VARIANTS` declarations |
| `tests/hierarchical-budgets/hierarchical-budgets.vitest.ts` | Modified | Removed the shadow-parity test block and its now-unused imports |
| `tests/unit/receipts-and-effect-recovery.vitest.ts` | Modified | Removed the legacy-recovery test block and its now-unused imports |
| `lib/hierarchical-budgets/README.md` | Modified | Dropped the stale `shadow-adapters.ts` file-table row (residue sweep) |
| `lib/dispatch-receipts/README.md` | Modified | Dropped the stale consumer reference to the deleted legacy-compatibility file (residue sweep) |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GLM-5.2-High (via cli-devin, model uid `glm-5-2`) acted as the remover: it made the barrel/reference edits
and file deletions from the ordered manifest in `tasks.md`. The orchestrator drove verification, because
that executor cannot run vitest — it read every diff against the manifest, then ran the typecheck, authority
check, and full runtime suite before staging.

The wave was one pass in strict order per target: re-confirm zero callers → sever barrel re-exports and test
references → delete the file → re-run the gates. A residue sweep after the deletions caught two stale README
references, which were removed in the same wave.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Sever barrels and test references before deleting files | Keeps tsc from ever seeing a dangling import mid-wave; makes each step independently green |
| Re-prove zero callers for every exported symbol, not just the named ones | The delete targets exported more symbols than the audit named; a finding is a hypothesis until re-proven at deletion time |
| Keep the two edited test files, remove only their dead blocks | The files hold live coverage for surviving behavior; only the shadow/legacy blocks referenced removed symbols |
| Clean two stale README references as part of the wave | A deleted file left dangling doc pointers; residue is not clean until docs match the tree |
| Orchestrator runs all gates | The remover's environment cannot run vitest, so verification stays with the orchestrator reading diffs and running checks |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Typecheck | Pass | - | 57 errors, identical to baseline; 0 new `TS2307` |
| Authority | Pass | 8/8 modes | All `new_authoritative_final`, `allOnLedger` true |
| Suite | Pass | 2692 passed | 14 failed / 7 skipped — failing set identical by name to the pre-removal baseline |
| Residue | Pass | - | `rg` for every removed symbol/path across `lib`+`scripts`+`tests` (incl. READMEs) → zero references |

### Gate Evidence

| Gate | Command | Result |
|------|---------|--------|
| Typecheck | `tsc -p runtime/tsconfig.json --noEmit` | 57 → 57 errors; `TS2307` count 0 |
| Authority | `runtime/scripts/verify-authority.cjs` | 8 modes `new_authoritative_final`, epoch 3, `allOnLedger` true |
| Suite | `vitest run --reporter=dot` (runtime) | 14 failed / 2692 passed / 7 skipped; by-name diff vs pre-removal baseline = zero new, zero gone |
| Residue | `rg <removed-symbols> lib scripts tests` | zero non-deleted references |


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| Live-loop survival | Append gateway, authorized-ledger, projections, reducers, receipts read path intact | No live-loop file touched; authority 8/8 green | Pass |
| Scope containment | Only manifest files ± residue changed | 8 manifest files + 2 README residue lines; no unrelated file | Pass |
| Commit ceiling | Single commit under the 100-file mass-deletion guard | Well under; guard not overridden | Pass |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Second-order residue remains** — phases 002–005 (F1, F2, F3+F4, F7) are still Planned; this wave removed only the three no-adjacency leaves.
2. **Suite baseline carries 14 pre-existing failures** — env/load-sensitive tests unrelated to this removal; unchanged by name and out of scope here.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Touch only the 8 manifest files | Also edited 2 module READMEs | The residue sweep found two stale doc references to the deleted files; removing a file is not complete while docs still point at it |

<!-- /ANCHOR:deviations -->

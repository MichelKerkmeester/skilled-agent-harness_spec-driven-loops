---
title: "Implementation Summary: Phase 002 Legacy-Compat Converters"
description: "F1 removal — seven per-mode legacy-compatibility.ts converters — with gate evidence."
trigger_phrases:
  - "phase 002 legacy compat converters"
  - "per-mode legacy compatibility removed"
  - "ledger schema upcasters removed"
importance_tier: "normal"
contextType: "implementation"
status: complete
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/002-legacy-compat-converters"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/002-legacy-compat-converters"
    last_updated_at: "2026-08-24T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Removed seven per-mode legacy-compatibility.ts converters (F1) as a set; all gates green"
    next_safe_action: "Proceed to phase 003 (F2 mode-contracts value layer)"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "deep-research-ledger-schema and tests/helpers/legacy-real-log.ts are LIVE and were left untouched (KEEP-diff empty)"
---
# Implementation Summary: Phase 002 Legacy-Compat Converters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-legacy-compat-converters |
| **Completed** | 2026-08-24 |
| **Level** | 2 |
| **Actual Effort** | 1 removal wave (GLM-5.2-High remover, orchestrator-verified) |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Removed the seven per-mode `legacy-compatibility.ts` converters (F1, ~2,506 production LOC) that classified
and upcast pre-ledger JSONL rows during the migration to the append-only ledger. With every mode finalized to
`new_authoritative_final`, no production path calls them. The eighth sibling — `deep-research-ledger-schema` —
stays: its `upcastLegacyDeepResearchRecord` is still live at `scripts/append-mode-event.cjs:233,453`, and the
shared `tests/helpers/legacy-real-log.ts` fixture it depends on stays with it.

The four modules `deep-improvement-common`, `agent-improvement`, `model-benchmark`, and `skill-benchmark`
cross-called each other's converters, so they had to be removed as one set — not module by module.

### Files Changed

| File group | Action | Purpose |
|------------|--------|---------|
| 7 × `lib/<mode>-ledger-schema/legacy-compatibility.ts` | Deleted | F1 — the dead per-mode converters (deep-ai-council, deep-improvement-common, model-benchmark, deep-alignment, deep-review, skill-benchmark, agent-improvement) |
| 7 × `lib/<mode>-ledger-schema/index.ts` | Modified | Removed each barrel's `decide<Mode>Compatibility` + `upcastLegacy<Mode>Record` re-export block (28 lines) |
| 7 × `tests/unit/<mode>-ledger-schema.vitest.ts` | Modified | Removed each file's legacy-compat test block(s) and now-dead imports (889 lines); unrelated tests untouched |
| 8 × `lib/<module>/README.md` | Modified | Dropped the stale CONTENTS row for a deleted `legacy-compatibility.ts` (residue sweep) |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GLM-5.2-High (via cli-devin, model uid `glm-5-2`) acted as the remover from an ordered manifest: sever the
seven barrel re-exports and the seven test blocks first, then delete the seven converter files. The
orchestrator ran verification, because that executor cannot run vitest — it read every diff against the
manifest, then ran typecheck, authority, and the full runtime suite.

The remover was told to drop a now-dead import only if the symbol was unused elsewhere in the same file, so
`legacy-real-log` helpers still used by surviving tests were preserved; the typecheck confirms no import was
over-removed. A residue sweep after the deletions caught eight stale README rows (seven for this wave plus one
wave-001 straggler in `receipts-and-effect-recovery`), removed in the same commit.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Delete all seven converters as one set | Four of them cross-call each other's compat functions; removing one at a time would break the intermediate typecheck |
| Keep `deep-research-ledger-schema` and its converter | Its upcaster is a live caller at `append-mode-event.cjs`, not dead migration code |
| Keep `tests/helpers/legacy-real-log.ts` | Imported by six ledger-schema tests including the kept deep-research test; not a per-wave artifact |
| Instruct "drop an import only if now unused in the file" | Some `legacy-real-log` symbols are shared with surviving tests; a blanket drop would break them |
| Clean the wave-001 README straggler here | A deleted file left a dangling doc row; residue is not clean while docs still point at it |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Typecheck | Pass | - | 57 errors, identical to baseline; 0 new `TS2307`; no new error signature (proves no import over-removed) |
| Authority | Pass | 8/8 modes | All `new_authoritative_final`, `allOnLedger` true |
| Suite | Pass | 2666 passed | 14 failed / 7 skipped — failing set identical by name to the pre-removal baseline; passed count fell by exactly the removed test blocks |
| Residue | Pass | - | `rg` for all 14 removed symbols → zero references; no doc/path residue remains |
| KEEP-diff | Pass | - | `git diff --stat` on the deep-research module + test + `legacy-real-log.ts` is empty |


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| Live-loop survival | Append gateway + the live deep-research upcaster intact | `append-mode-event.cjs` upcaster untouched; authority 8/8 | Pass |
| Scope containment | Only the 7-module set ± doc residue changed | 21 manifest files + 8 README rows; KEEP-diff empty | Pass |
| Commit ceiling | Single commit under the 100-file guard | 29 runtime files + docs; guard not overridden | Pass |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Waves 003–005 remain** — F2 (mode-contracts value layer), F3+F4 (rollout/flip tooling), F7 (authority-registry CAS reduction) are still Planned.
2. **Suite baseline carries 14 pre-existing failures** — env/load-sensitive tests unrelated to this removal; unchanged by name.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Touch only the 21 manifest files | Also removed 8 README CONTENTS rows | Residue sweep found stale rows for deleted files, incl. one wave-001 straggler in `receipts-and-effect-recovery/README.md` |

<!-- /ANCHOR:deviations -->

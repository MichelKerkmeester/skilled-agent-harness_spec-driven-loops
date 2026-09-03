---
title: "Plan: Phase 002 Legacy-Compat Converters"
description: "Approach and verification gates for the F1 seven-module legacy-compat removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/002-legacy-compat-converters"
trigger_phrases: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Plan: Phase 002 Legacy-Compat Converters

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Overview

Seven modules, one internal dependency cluster, no live-loop adjacency. Ordering rules:

1. **Cross-module dependency** — `agent-improvement`, `model-benchmark`, and `skill-benchmark` each call
   `deep-improvement-common`'s `decideDeepImprovementCommonCompatibility` / `upcastLegacyDeepImprovementCommonRecord`
   internally. All four are deleted together in this wave, so this never surfaces as a dangling import — but
   the remover must delete the full set, not a subset.
2. **Sever before delete, per module** — remove the barrel (`index.ts`) re-export of `decide<Mode>Compatibility`
   + `upcastLegacy<Mode>Record`, then remove the matching test file's now-dead imports of those two symbols
   (plus the `legacy-real-log` import where the file no longer uses it — see below), then delete the file
   itself. tsc never observes a dangling import mid-wave.
3. **Test-block removal is surgical, not tail-truncation** — in `deep-ai-council`, `model-benchmark`,
   `deep-alignment`, and `deep-review`'s test files, the legacy-compat `it()` block sits mid-file, followed by
   unrelated `it()` blocks (event-version / registry checks) that must survive. Identify the block to remove
   by its calls to `decide<Mode>Compatibility` / `upcastLegacy<Mode>Record`, not by line position.
4. **`tests/helpers/legacy-real-log.ts` stays.** Five of the seven target test files
   (`deep-ai-council`, `deep-alignment`, `deep-review`, `skill-benchmark`, `deep-improvement-common`) import
   `REAL_LEGACY_LOGS` / `readRealJsonl` / `unknownLegacyRecords` from it, used only inside the block being
   removed — so the import line is dropped from those five files. The helper file itself is not deleted: it
   is also imported by `tests/unit/deep-research-ledger-schema.vitest.ts`, which is out of scope and stays
   green. This corrects the parent research doc's Wave-2 suggestion (`research/research.md` §5), which had
   listed the helper for removal without checking the deep-research test's dependency on it.

The remover (GLM-5.2-High via cli-devin) makes the edits and deletions in the manifest order (`tasks.md`).
The orchestrator runs the gates — devin's sandbox cannot run vitest, so typecheck, authority verification,
and the runtime suite are executed here, and every diff is read against the manifest before commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope and requirements documented in `spec.md`
- [x] Baseline capture procedure defined (see §8 Baseline below)

### Definition of Done
- [ ] All gates in §5 Testing Strategy pass
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deletion-only wave — no new architecture introduced. The existing module/barrel/test structure is
reduced, not restructured.

### Key Components

Unaffected by design; see `spec.md` §3 SCOPE for the exact files removed and barrels edited.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Re-confirm zero callers for all 7 F1 targets, including the cross-module cluster (`tasks.md` T1).

### Phase 2: Core Implementation
- Sever barrels and test imports, then delete the seven targets (`tasks.md` T2–T3).

### Phase 3: Verification
- Run typecheck, authority check, runtime suite, residue scan, and the deep-research KEEP-diff, then commit
  (`tasks.md` T4–T5).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command | Pass condition |
|------|---------|----------------|
| Typecheck | project `tsc -p runtime/tsconfig.json` | no new `TS2307`; total errors ≤ 57 baseline |
| Authority | `runtime/scripts/verify-authority.cjs` | 8 modes `new_authoritative_final`, allOnLedger true |
| Suite | `vitest run --reporter=dot` (runtime) | failing set unchanged by name vs baseline; `deep-research-ledger-schema.vitest.ts` still passes |
| Residue | `rg` for every deleted symbol/path | zero non-deleted references |
| KEEP-diff | `git diff --stat` against the deep-research module, its test, and `tests/helpers/legacy-real-log.ts` | empty — zero lines changed in any of the three |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tsc / vitest / `verify-authority.cjs` toolchain | Internal | Green | Already in-repo; no new dependency introduced |
| `deep-improvement-common-ledger-schema`'s compat functions (in-wave, deleted together with its 3 callers) | Internal | Green | Must delete as one set — see §3 Cross-module dependency in `spec.md` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any verification gate goes red mid-wave.
- **Procedure**: Every change is git-reversible in the worktree; the wave is one commit, so `git revert
  <sha>` (or reset before commit) restores the prior tree. Nothing is pushed.
<!-- /ANCHOR:rollback -->

---

## 8. BASELINE

Same repo baseline as wave 1 (tsc = 57 errors: TS2322×38, TS2411×16, TS2339×2, TS2352×1, 0 TS2307; runtime
suite = 13 pre-existing failures, env/load-sensitive, zero MODULE_NOT_FOUND). Wave 1 lands first, so
re-capture fresh immediately before this wave starts — a green baseline is guilty until a perturbation
confirms it, and wave 1's deletions may shift the exact error/failure counts even if the shape holds.

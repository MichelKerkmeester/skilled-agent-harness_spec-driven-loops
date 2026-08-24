---
title: "Plan: Phase 001 Leaf Removals"
description: "Approach and verification gates for the F5/F6/F8 leaf-removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/001-leaf-removals"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Plan: Phase 001 Leaf Removals

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Overview

Three independent leaves, no ordering dependency between them, no live-loop adjacency. The only ordering
rule is intra-target: sever the barrel re-export and test references before deleting the file, so the
typechecker never observes a dangling import mid-wave.

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
- Re-confirm zero callers for F5/F6/F8 (read-only `rg` re-proof — `tasks.md` T1).

### Phase 2: Core Implementation
- Sever barrels and test references, then delete the three targets (`tasks.md` T2–T3).

### Phase 3: Verification
- Run typecheck, authority check, runtime suite, and residue scan, then commit (`tasks.md` T4–T5).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command | Pass condition |
|------|---------|----------------|
| Typecheck | project `tsc -p runtime/tsconfig.json` | no new `TS2307`; total errors ≤ 57 baseline |
| Authority | `runtime/scripts/verify-authority.cjs` | 8 modes `new_authoritative_final`, allOnLedger true |
| Suite | `vitest run --reporter=dot` (runtime) | failing set unchanged by name vs baseline |
| Residue | `rg` for every deleted symbol/path | zero non-deleted references |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tsc / vitest / `verify-authority.cjs` toolchain | Internal | Green | Already in-repo; no new dependency introduced |
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

tsc = 57 errors (TS2322×38, TS2411×16, TS2339×2, TS2352×1), 0 TS2307. Runtime suite baseline: 13 pre-existing
failures (env/load-sensitive), zero MODULE_NOT_FOUND. Capture fresh immediately before the wave; a green is
guilty until a perturbation confirms it.

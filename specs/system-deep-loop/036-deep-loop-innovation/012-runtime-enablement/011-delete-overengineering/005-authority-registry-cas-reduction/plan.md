---
title: "Plan: Phase 005 Authority Registry CAS Reduction"
description: "Approach and verification gates for reducing authority-registry.ts's CAS mutators after phase 004 lands."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/005-authority-registry-cas-reduction"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Plan: Phase 005 Authority Registry CAS Reduction

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Overview

This wave is gated, not independent. Order:

1. **Gate on phase 004.** Confirm `004-rollout-flip-tooling` is committed and its own gates (tsc, authority,
   suite) are green. `enable-modes.cjs` and `flip-authority.cjs` must no longer exist. This is a
   precondition check, not a task this phase performs.
2. **Re-confirm callers, repo-wide, including `tests/`.** The parent audit's zero-caller proof for F7
   named only two production scripts and missed a third caller inside
   `tests/integration/deep-research-postflip-fanout.vitest.ts` (spec.md §9.3). Re-grep before touching
   anything; if a caller beyond the ones already identified in spec.md turns up, STOP and report — do not
   improvise a fix for an unknown caller.
3. **Fix the known survivor first.** Rewrite `deep-research-postflip-fanout.vitest.ts`'s `flipAuthority()`
   to seed the target record directly (spec.md §9.3), so it no longer calls the methods about to be
   deleted. Run just this one test file to confirm it still passes before moving on — this is the safe
   negative control: prove the rewrite is behavior-preserving in isolation before the mutators disappear
   and make a failure here undebuggable.
4. **Sever the barrel** (`index.ts` type-export list) so tsc never sees a dangling type import.
5. **Remove the mutators, their private helper, their interfaces, and `#lockPath()`** from
   `authority-registry.ts` — the read path and the full lock-reclaim family are untouched (spec.md §8).
6. **Trim the two test files**: the interleaved `compareAndSwap` its, the `prepareCutover` describe, the
   `compareAndSwapRollback` describe, and the one per-mode-lock-reclaim it in `stale-lock reclaim`
   (`per-mode-authority-flip.vitest.ts`); delete `authority-finalize.vitest.ts` wholesale if it still
   exists (spec.md §9.4 — check its state, don't assume).
7. **Verify, then commit.**

The remover (GLM-5.2-High via cli-devin) performs steps 3, 4, 5, and 6. The orchestrator runs step 1's
precondition check, step 2's re-grep, and all of step 7 — devin's sandbox cannot run vitest — and reads
every diff against spec.md §3/§8 before committing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope and requirements documented in `spec.md`, including the KEEP LIST (§8) and Investigation
  Findings (§9)
- [x] Baseline capture procedure defined (see §8 Baseline below)

### Definition of Done
- [ ] All gates in §5 Testing Strategy pass, with the Authority gate treated as critical
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reduction wave, not a whole-file delete or a new architecture. `authority-registry.ts` keeps its read
path and lock-reclaim machinery; only the mutator surface is removed.

### Key Components

Unaffected by design; see `spec.md` §3 SCOPE for the exact methods/interfaces removed and `spec.md` §8
for the full KEEP LIST that must remain byte-for-byte unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Gate on phase 004 being green, then re-confirm zero callers repo-wide including `tests/`
  (`tasks.md` T0–T1).

### Phase 2: Core Implementation
- Fix the known survivor first, sever the barrel, remove the mutators, then trim the two test files
  (`tasks.md` T2–T6).

### Phase 3: Verification
- Run typecheck, authority check (critical gate), runtime suite, and residue scan, then commit
  (`tasks.md` T7–T8).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command | Pass condition |
|------|---------|----------------|
| Precondition | `rg -n "enable-modes\.cjs\|flip-authority\.cjs"` under `runtime/scripts/` | Neither file exists (phase 004 landed) |
| Caller re-proof | `rg -n "prepareCutover\|compareAndSwapRollback\|compareAndSwapFinalize\|\.compareAndSwap\("` repo-wide, excluding `authority-registry.ts` itself | Zero hits before deletion begins |
| Typecheck | project `tsc -p runtime/tsconfig.json` | no new `TS2307`; total errors at or below a freshly captured baseline |
| Authority | `runtime/scripts/verify-authority.cjs` | 8 modes `new_authoritative_final`, `allOnLedger` true — **critical gate**, this file is adjacent to the authorization boundary |
| Suite | `vitest run --reporter=dot` (runtime) | failing set unchanged by name vs a fresh baseline; explicit pass on `per-mode-authority-flip.vitest.ts`, `deep-research-postflip-fanout.vitest.ts`, and the mode-append-gateway suite |
| Residue | `rg` for every deleted symbol/interface/path | zero non-deleted references |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase `004-rollout-flip-tooling` (must land first) | Internal | Blocking | This wave cannot start — REQ-001 |
| tsc / vitest / `verify-authority.cjs` toolchain | Internal | Green | Already in-repo; no new dependency introduced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any verification gate goes red mid-wave, especially the authority gate.
- **Procedure**: Every change is git-reversible in the worktree; the wave is one commit, so `git revert
  <sha>` (or reset before commit) restores the prior tree. Nothing is pushed. Because this file sits next
  to the authorization boundary, prefer reverting over patching forward if any authority gate goes red
  mid-wave — diagnose from a known-good state, not from a partially-edited one.
<!-- /ANCHOR:rollback -->

---

## 8. BASELINE

Phase 001's baseline (57 tsc errors, 0 `TS2307`; 13 pre-existing runtime-suite failures) is stale by the
time this wave runs — phases 002, 003, and 004 will each have changed the tree. Capture a fresh baseline
immediately before this wave starts; a green result at that point is guilty until this wave's own
perturbation confirms it, per the parent packet's baseline-before-no-regressions standard.

---
title: "Plan: Phase 003 Mode-Contracts Value Layer"
description: "Approach and verification gates for the F2 mode-contracts value-layer removal wave, including the pre-step relocation of matchesPreparedAuthorizationDecision."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/003-mode-contracts-value-layer"
trigger_phrases: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Plan: Phase 003 Mode-Contracts Value Layer

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Overview

One target module (`lib/mode-contracts/`), one barrel, eight reducer consumers that only ever take
`import type`. The ordering rule from Wave 1 still holds: sever every barrel re-export and reference
before deleting a file, so the typechecker never observes a dangling import mid-wave.

This wave adds one pre-step Wave 1 didn't need. The audit's F2 zero-caller proof
(`research/research.md` §3) traced five of `strict-gate-validator.ts`'s nine value symbols. The other
four are `hasExactKeys`, `matchesInstalledVersionBindings`, `validateRows` (all confirmed zero-caller by
this packet's own re-proof — see `spec.md` §2) and `matchesPreparedAuthorizationDecision`, which
`tests/unit/authorized-ledger.vitest.ts` imports and calls in a live 13-case suite. Deleting
`strict-gate-validator.ts` outright would break that suite. The fix is a relocation, not a scope change:
`matchesPreparedAuthorizationDecision` is authorized-ledger domain logic that was filed under
`mode-contracts` — it belongs next to the types it operates on (`AuthorizationDecisionRecord`,
`TransitionAuthorizationRequest`, both defined in `lib/authorized-ledger/authorized-ledger-types.ts`).

The remover (GLM-5.2-High via cli-devin) does the relocation, the barrel edits, and the deletions in the
manifest order (`tasks.md`). The orchestrator runs the gates — devin's sandbox cannot run vitest, so
typecheck, authority verification, and the runtime suite are executed here, and every diff is read
against the manifest before commit, with particular attention to `authorized-ledger.vitest.ts` staying a
one-line import-path change with no assertion drift.
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

Deletion-and-relocation wave — no new architecture introduced. One function moves to the module that
owns the types it operates on; the rest of the change is reduction.

### Key Components

Unaffected by design; see `spec.md` §3 SCOPE for the exact files removed, relocated, and barrels edited.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Re-confirm zero callers for every F2 value symbol, including the `matchesPreparedAuthorizationDecision`
  exception and the 8 reducers' `import type`-only status (`tasks.md` T1).

### Phase 2: Core Implementation
- Relocate `matchesPreparedAuthorizationDecision` before any deletion, then sever the barrel, then delete
  the four value files and their test (`tasks.md` T2–T4).

### Phase 3: Verification
- Run typecheck, authority check, runtime suite, and residue scan, then commit (`tasks.md` T5–T6).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command | Pass condition |
|------|---------|----------------|
| Typecheck | project `tsc -p runtime/tsconfig.json` | no new `TS2307`; total errors ≤ 57 baseline |
| Authority | `runtime/scripts/verify-authority.cjs` | 8 modes `new_authoritative_final`, allOnLedger true |
| Suite | `vitest run --reporter=dot` (runtime) | failing set unchanged by name vs baseline; `authorized-ledger.vitest.ts` prepared-authorization block (13 cases) green |
| Residue | `rg` for every deleted symbol/path | zero non-deleted references, except the relocated `matchesPreparedAuthorizationDecision` at its new path |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tsc / vitest / `verify-authority.cjs` toolchain | Internal | Green | Already in-repo; no new dependency introduced |
| `matchesPreparedAuthorizationDecision`'s live consumer (`authorized-ledger.vitest.ts`) | Internal | Green | Relocation must land before `strict-gate-validator.ts` is deleted (§1) |
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

Same pre-wave tree as Wave 1 (Wave 1 has not executed as of this packet's authoring — verify with
`git status` before starting): tsc = 57 errors (TS2322×38, TS2411×16, TS2339×2, TS2352×1), 0 TS2307.
Runtime suite baseline: 13 pre-existing failures (env/load-sensitive), zero MODULE_NOT_FOUND. Capture
fresh immediately before this wave regardless of Wave 1/2 status — a green is guilty until a perturbation
confirms it, and the baseline numbers shift once earlier waves land.

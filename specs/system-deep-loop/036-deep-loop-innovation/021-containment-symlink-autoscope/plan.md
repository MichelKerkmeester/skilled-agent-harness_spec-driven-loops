---
title: "Implementation Plan: Containment Auto-Scope for Symlinked Spec Trees"
description: "Phased plan to auto-resolve the containment repo root to the worktree that physically holds a symlinked artifact, closing the containment catch-22 without touching the guard."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-containment-symlink-autoscope"
    last_updated_at: "2026-08-27T03:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased plan; implementation complete"
    next_safe_action: "Verify both gates; reconcile docs"
---
# Implementation Plan: Containment Auto-Scope for Symlinked Spec Trees

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Symptom** | `resolveArtifactScope` returns null when the spec tree symlinks into another checkout; containment cannot function |
| **Root cause** | Scope is resolved against cwd's git worktree; the artifact realpaths outside it, and the writes land in the other worktree git can't see from cwd |
| **Change kind** | Auto-resolve the repo root to the artifact's real worktree; the guard is unchanged |
| **Verification** | Reproduced catch-22 resolves; negative control rejected; both gates |

### Overview
The fix lives entirely in repo-root resolution. When the artifact resolves outside the working directory's worktree, `resolveContainmentRepoRoot` returns the worktree that physically contains it, so both the scope check and the git operations run against the right repo. The redirect fires only in the previously-null case, so the normal path is untouched, and it only ever redirects to a worktree that CONTAINS the artifact, so it cannot widen scope to an arbitrary location.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The catch-22 reproduced (symlinked spec tree -> null scope)
- [x] Confirmed the fix belongs in repo-root resolution, not the guard

### Definition of Done
- [x] The symlinked artifact scopes correctly
- [x] The negative control (non-worktree artifact) is still rejected
- [x] Both gates clean; guard tests unchanged

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Resolve the containment root to where the writes physically land. The guard already scopes correctly once given the right repo root; the only defect was choosing `cwd`'s worktree when the artifact lives in another. Auto-detection supplies the correct root; the guard is unchanged.

### Key Components
- **`resolveContainmentRepoRoot(env, cwd, opts)`** — override > artifact-worktree redirect > cwd, with an injected `gitToplevel` for testability.
- **`fanout-run.cjs`** — passes `lineageDir` + `resolveGitToplevel` into the resolver.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reproduce & confirm
- [x] Reproduce the catch-22: symlinked spec tree -> `resolveArtifactScope` returns null
- [x] Confirm the guard is correct once the repo root points at the artifact's worktree
- [x] Confirm a non-worktree artifact must stay unscopable (security boundary)

### Phase 2: Implement
- [x] Extend `resolveContainmentRepoRoot` with the artifact-aware redirect (injected `gitToplevel`)
- [x] Export `realpathSafe`/`isSubpath`; add `fs` to the helper
- [x] Wire `fanout-run.cjs` to pass `lineageDir` + `resolveGitToplevel`

### Phase 3: Verify
- [x] node:test: redirect, in-worktree, non-worktree, override-wins all pass
- [x] Manual repro: symlinked artifact scopes; negative control rejected
- [x] Both gates: no new code-caused failures; guard tests unchanged

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveContainmentRepoRoot` auto-detection (real temp symlinks + fake gitToplevel) | node:test |
| Negative control | A non-worktree artifact never widens scope | node:test |
| Integration | Symlinked artifact scopes; orphan rejected | manual repro harness |
| Regression | Both whole-suite gates; guard tests unchanged | vitest + `run-node-tests.mjs` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `write-containment __internals.resolveGitToplevel` | Internal | Green | The injected git resolver |
| Both whole-suite gates | Internal | Green | Regression yardstick |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The auto-detection mis-scopes a run.
- **Procedure**: `git checkout` `runtime-bootstrap.cjs` + `fanout-run.cjs` + the test. The env override (packet 020) remains as the manual fallback.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Reproduce) ──> Phase 2 (Auto-detect) ──> Phase 3 (Verify both gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reproduce & confirm | None | Implement |
| Implement | The reproduction | Verify |
| Verify | Implement | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Reproduce & confirm | Medium | ~1 hour |
| Implement | Low-Medium | ~45 min |
| Verify (both gates) | Low | 30 min (+ suite runtime) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The guard confirmed untouched (only repo-root resolution changed)
- [x] Both-gate baselines recorded

### Rollback Procedure
1. `git checkout` `runtime-bootstrap.cjs` + `fanout-run.cjs`.
2. Revert the test additions.
3. Re-run both gates to confirm the prior state.

### Data Reversal
- **Has data migrations?** No — resolution logic + tests only.

<!-- /ANCHOR:enhanced-rollback -->

---
title: "Implementation Plan: dependency-seams Worktree-Symlink Fix"
description: "Phased plan to fix the dependency-seams resolution assertions by realpath-ing the comparison base so they pass under a git worktree's symlinked node_modules; no dependency change."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T12:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the dependency/Node-ABI phased plan"
    next_safe_action: "Phase 1: audit + decide the canonical version"
---
# Implementation Plan: better-sqlite3 Version + Node-ABI Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Symptom** | `dependency-seams` fails 2 assertions: `require.resolve()` output doesn't start with the runtime's `node_modules` path |
| **Root cause** | The base path is raw; `require.resolve()` is realpath'd. In a git worktree `node_modules` is a symlink, so the two diverge and the prefix check fails — only in a worktree |
| **Change kind** | Test-only: realpath the comparison base (import `realpathSync`) |
| **Verification** | `dependency-seams` 6/6 + whole-suite delta vs baseline |

### Overview
The failure looked like a native version drift but is a git-worktree symlink artifact. `require.resolve()` follows symlinks and returns the main-checkout realpath; the assertion compared it against a raw worktree path built from `import.meta.url`. The fix realpaths the runtime-`node_modules` base so both sides are the same realpath, passing in a worktree and the main checkout while still catching a genuine sibling reach-in. No dependency or native-binding change. The `12.10.0`/`12.11.1` drift is real but separately scoped: the symlinked `node_modules` would make a bump a main-checkout-wide native change.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The exact failing assertions captured
- [x] The symlink divergence between `require.resolve()` and the raw base confirmed
- [x] The realpath fix approved; the version bump deferred as separately scoped

### Definition of Done
- [x] `dependency-seams` passes 6/6 in the worktree
- [x] Change confined to the one test file (no dependency/native change)
- [x] Whole-suite delta clean vs the 017 baseline

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Compare realpath against realpath. The assertion already receives a symlink-followed path from `require.resolve()`; the base it compares against must be realpath'd the same way so a symlinked `node_modules` (the git-worktree case) does not produce a false negative.

### Key Components
- **Realpath'd base** — `realpathSync(resolve(runtimeRoot, 'node_modules'))` used in the two failing assertions, replacing the raw `resolve(...)` path.
- **Unchanged negative assertion** — the sibling-reach-in check is left as-is under scope lock (it targets a non-existent path and never fs-accesses it).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigate & decide
- [x] Capture the exact failing assertions and their messages (tests #1 and #4, `expected false to be true`)
- [x] Trace the divergence: `require.resolve()` returns a realpath; the base is a raw worktree path; `node_modules` is a symlink to the main checkout
- [x] Confirm the version assertion (#3) passes and the drift is orthogonal to the failure
- [x] **Decide** (operator): realpath the comparison base; defer the version bump as separately scoped

### Phase 2: Implement
- [x] Import `realpathSync`
- [x] Realpath the runtime-`node_modules` base in the two failing assertions
- [x] Leave the sibling assertion and `PINNED` untouched (scope lock)

### Phase 3: Verify
- [x] `dependency-seams` passes 6/6 in the worktree
- [x] Change confined to the one test file (no dependency/native change)
- [x] Whole runtime suite vs the 017 baseline: no new code-caused failures

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted | `dependency-seams` 6/6 | vitest |
| Negative control | The same assertions were watched failing (raw base) before the realpath fix | node repro + vitest |
| Regression | Whole runtime suite vs baseline | vitest run |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node `fs.realpathSync` | Internal | Green | The fix itself |
| The 017 whole-suite baseline | Internal | Green | Regression yardstick |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The realpath change makes an assertion behave unexpectedly.
- **Procedure**: `git checkout -- tests/unit/dependency-seams.vitest.ts`. The change is confined to that one test file; there is no dependency, lockfile, or native artifact to revert.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Diagnose + decide) ──> Phase 2 (Realpath the base) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigate & decide | None | Implement |
| Implement | Decisions | Verify |
| Verify | Implement | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Investigate & decide | Medium | ~1 hour |
| Implement (realpath the base) | Low | ~15 min |
| Verify (targeted + whole suite) | Low | 30 min (+ suite runtime) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The pre-fix failing assertions captured (raw base → false)
- [x] The realpath fix verified green in the worktree

### Rollback Procedure
1. `git checkout -- tests/unit/dependency-seams.vitest.ts`.
2. Re-run `dependency-seams` to confirm the prior state.

### Data Reversal
- **Has data migrations?** No — one test file only.

<!-- /ANCHOR:enhanced-rollback -->

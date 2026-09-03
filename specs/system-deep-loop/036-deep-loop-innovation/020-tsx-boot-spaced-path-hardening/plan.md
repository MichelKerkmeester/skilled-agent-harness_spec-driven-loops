---
title: "Implementation Plan: tsx Boot + Containment-Root Hardening"
description: "Phased plan to strip NODE_PRESERVE_SYMLINKS from the tsx re-exec child across 10 entrypoints via a shared helper, add a DEEP_LOOP_REPO_ROOT containment override, and lock both with a node:test."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/020-tsx-boot-spaced-path-hardening"
    last_updated_at: "2026-08-26T16:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased plan; implementation complete"
    next_safe_action: "Verify both gates; reconcile docs"
trigger_phrases: []
---
# Implementation Plan: tsx Boot + Containment-Root Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Symptom** | `ERR_MODULE_NOT_FOUND` on `loop-lock.js` from a spaced-path checkout under `NODE_PRESERVE_SYMLINKS=1` |
| **Root cause** | The tsx loader fails to initialize when its own path is spaced + the flag preserves it; the `.js`->`.ts` remap never activates |
| **Change kind** | Strip the (unneeded) flag in the tsx child env across 10 entrypoints; add a repo-root override |
| **Verification** | node:test on the helpers + the 10-entrypoint guard; both whole-suite gates |

### Overview
The runtime never needs `NODE_PRESERVE_SYMLINKS` — containment resolves paths through `fs.realpath` and the repo root is `cwd`. So the fix removes the flag from the tsx re-exec child, at a single source (a shared `runtime-bootstrap.cjs`) that all 10 entrypoints call. A companion `DEEP_LOOP_REPO_ROOT` override lets an operator pin the containment root explicitly. A node:test locks both helpers and guards every entrypoint against re-leaking the flag.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The crash class reproduced (flag + spaced tsx path) and the flag confirmed as the trigger
- [x] The flag confirmed unused by the runtime (containment uses `fs.realpath`; repoRoot = cwd)

### Definition of Done
- [x] All 10 entrypoints boot under the flag
- [x] `DEEP_LOOP_REPO_ROOT` override resolves; blank ignored
- [x] Both gates (vitest + node:test) clean vs baseline

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single source of truth for the process-boot environment. The tsx child env and the containment repo-root resolution both live in one small `.cjs` helper; every entrypoint calls it, so the fix cannot drift per-file and the rationale lives in one place.

### Key Components
- **`runtime-bootstrap.cjs`** — `tsxChildEnv(extra)` (strips the flag) + `resolveContainmentRepoRoot(env, cwd)` (honors the override).
- **10 entrypoints** — build the tsx child env via `tsxChildEnv`.
- **`fanout-run.cjs`** — resolves the containment repo root via the helper at both containment sites.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigate & confirm
- [x] Reproduce the flag-triggered tsx failure class; confirm the flag is the only differing factor
- [x] Confirm the runtime never sets/needs the flag; containment uses `fs.realpath`, repoRoot = cwd
- [x] Enumerate the 10 tsx re-exec entrypoints (blast radius)

### Phase 2: Implement
- [x] Create `runtime-bootstrap.cjs` with `tsxChildEnv` + `resolveContainmentRepoRoot`
- [x] Rewire all 10 entrypoints' tsx child env to `tsxChildEnv`
- [x] Wire both `fanout-run.cjs` containment sites to `resolveContainmentRepoRoot`
- [x] Leave the unrelated `AI_SESSION_CHILD` spawn untouched

### Phase 3: Verify
- [x] node:test: both helpers + the 10-entrypoint guard pass
- [x] Entrypoints boot under `NODE_PRESERVE_SYMLINKS=1`
- [x] `run-node-tests.mjs` and the runtime vitest suite: no new failures

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `tsxChildEnv`, `resolveContainmentRepoRoot` | node:test |
| Guard | All 10 entrypoints route through the helper | node:test (source assertion) |
| Boot | An entrypoint runs its TS under the flag | manual repro |
| Regression | Both whole-suite gates vs baseline | vitest + `run-node-tests.mjs` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `run-node-tests.mjs` gate | Internal | Green | The node:test regression yardstick |
| The runtime vitest suite | Internal | Green | The vitest regression yardstick |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The flag strip shifts behavior for a module that relied on preserved symlinks.
- **Procedure**: `git checkout` the 10 entrypoints + `fanout-run.cjs` and delete `runtime-bootstrap.cjs` + its test. The change is confined to those scripts.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm) ──> Phase 2 (Helper + rewire) ──> Phase 3 (Verify both gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigate & confirm | None | Implement |
| Implement | The confirmation | Verify |
| Verify | Implement | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Investigate & confirm | Medium | ~1.5 hours (mostly reproduction) |
| Implement (helper + 11 files) | Low-Medium | ~1 hour |
| Verify (both gates) | Low | 30 min (+ suite runtime) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The 10 entrypoints + fanout-run snapshotted (git)
- [x] Both-gate baselines recorded

### Rollback Procedure
1. `git checkout` the 10 entrypoints + `fanout-run.cjs`.
2. Remove `runtime-bootstrap.cjs` + `scripts/tests/runtime-bootstrap.test.cjs`.
3. Re-run both gates to confirm the prior state.

### Data Reversal
- **Has data migrations?** No — scripts + one helper + one test only.

<!-- /ANCHOR:enhanced-rollback -->

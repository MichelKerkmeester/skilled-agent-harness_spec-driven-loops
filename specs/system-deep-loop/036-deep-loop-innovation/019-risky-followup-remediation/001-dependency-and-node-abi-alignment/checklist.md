---
title: "Verification Checklist: dependency-seams Worktree-Symlink Fix"
description: "Verification evidence for realpath-ing the dependency-seams comparison base."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T12:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Verified dependency-seams 6/6 after the realpath fix"
    next_safe_action: "Commit 001; push both 019 children"
---
# Verification Checklist: dependency-seams Worktree-Symlink Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The exact failing assertions captured
  - **Evidence**: `dependency-seams.vitest.ts:42` and `:63`, both `expected false to be true`
- [x] CHK-002 [P0] The symlink root cause confirmed
  - **Evidence**: `runtime/node_modules` is a symlink; `require.resolve()` returns the main-checkout realpath
- [x] CHK-003 [P1] The fix direction decided with rationale
  - **Evidence**: operator chose realpath; version bump deferred (`plan.md` §Overview)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The change is minimal and clearly-commented
  - **Evidence**: a durable WHY comment on the symlink reason; no ephemeral ids in `dependency-seams.vitest.ts`
- [x] CHK-011 [P1] The self-containment intent is preserved
  - **Evidence**: only the runtime's own `node_modules` base is realpath'd; the sibling negative assertion is unchanged

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `dependency-seams.vitest.ts` passes
  - **Evidence**: `vitest run` green — 6/6
- [x] CHK-021 [P0] The fix was watched failing first
  - **Evidence**: a `node` repro showed `startsWith raw: false` / `startsWith realpath: true`
- [x] CHK-022 [P1] No new whole-suite regression
  - **Evidence**: whole-suite delta vs the 017 baseline is clean (`vitest run`)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Passes in both worktree and main checkout
  - **Evidence**: realpath makes the base match `require.resolve()` regardless of the symlink
- [x] CHK-025 [P1] The real version drift is not silently dropped
  - **Evidence**: `12.10.0`/`12.11.1` documented as separately scoped (`spec.md` §Out of Scope)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No dependency, lockfile, or native drift
  - **Evidence**: the staged diff is `tests/unit/dependency-seams.vitest.ts` only

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The corrected diagnosis is documented
  - **Evidence**: `spec.md` §Problem and `plan.md` §Overview record the worktree-symlink root cause

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scoped diff — one test file
  - **Evidence**: `git status` shows only `dependency-seams.vitest.ts` changed

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-26
**Verified By**: claude (conductor)

<!-- /ANCHOR:summary -->

---
title: "Tasks: Phase 004 Rollout Tooling"
description: "Ordered removal manifest for F3 — sever doc cross-refs first, then delete, then verify."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/004-rollout-flip-tooling"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 004 Rollout Tooling

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Order matters: sever every doc cross-reference **before** deleting a target file, so no README is left
pointing at a deleted path. All paths are under `.opencode/skills/system-deep-loop/runtime/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T1 — Re-confirm zero callers (read-only)
- [x] `rg -n "enable-modes|fleet-enablement"` across `lib/` + `scripts/` — only `fleet-enablement/` self +
  its own tests + its own README, plus the three doc rows severed in T2.
- [x] `rg -n "flip-authority"` — confirmed F4 stays for phase 005; `authority-finalize.vitest.ts` directly
  tests `flip-authority.cjs`, which drove the resequencing (see `spec.md` §2/§8).
- [x] `rg -n "prepareCutover|compareAndSwap|compareAndSwapFinalize"` — the only callers are
  `scripts/enable-modes.cjs` and `scripts/flip-authority.cjs`. `authority-registry` left untouched.
- [x] No hit landed outside the module's own files, its tests, or the expected non-dependency comment.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 — Sever doc cross-references (edits first)
- [x] `scripts/README.md`: `enable-modes.cjs` FILES row removed. (No `flip-authority.cjs` row exists.)
- [x] `lib/README.md`: `fleet-enablement/` FILES row removed.
- [x] `lib/legacy-projections/README.md` § CONSUMERS: `fleet-enablement/mode-surface-map.ts` bullet removed;
  `append-mode-event.ts` bullet intact.

### T3 — Delete targets (F3 only)
- [x] Deleted `scripts/enable-modes.cjs`.
- [x] Deleted `lib/fleet-enablement/` (whole directory: `enablement-driver.ts`, `mode-surface-map.ts`,
  `index.ts`, `README.md`).
- [x] Deleted `tests/unit/enable-modes-cli.vitest.ts`.
- [x] Deleted `tests/unit/fleet-enablement.vitest.ts`.
- [x] `scripts/flip-authority.cjs` and `tests/unit/flip-authority-cli.vitest.ts` **NOT** deleted — F4
  resequenced into phase 005.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T4 — Verify (orchestrator runs; devin cannot run vitest)
- [x] `tsc -p runtime/tsconfig.json` → 56 errors (57 → 56, the dead `enablement-driver.ts` error gone),
  0 `TS2307`.
- [x] `node runtime/scripts/verify-authority.cjs` → 8 modes `new_authoritative_final`, `allOnLedger` true.
- [x] Runtime suite (`vitest run --reporter=dot`) → failing set unchanged by name vs baseline.
- [x] `rg` re-scan of `enable-modes`, `fleet-enablement`, `runFleetEnablement` → zero non-deleted
  references.

### T5 — Commit
- [x] One conventional commit, `<100` files, mass-deletion guard respected (not overridden).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All verification gates pass (see `spec.md` SUCCESS CRITERIA / `plan.md` TESTING STRATEGY)
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

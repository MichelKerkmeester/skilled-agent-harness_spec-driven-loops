---
title: "Tasks: Phase 004 Rollout & Flip Tooling"
description: "Ordered removal manifest for F3/F4 — sever doc cross-refs first, then delete, then verify."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/004-rollout-flip-tooling"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 004 Rollout & Flip Tooling

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

### T1 — Re-confirm zero callers (remover, read-only)
- [ ] `rg -n "enable-modes|fleet-enablement"` across `lib/` + `scripts/` — expect only `fleet-enablement/`
  self + its own tests + its own README.
- [ ] `rg -n "flip-authority"` across `lib/` + `scripts/` — expect only `scripts/flip-authority.cjs` self +
  its own test + the non-dependency comment in `verify-authority.cjs` ("does not import or reuse
  flip-authority.cjs").
- [ ] `rg -n "prepareCutover|compareAndSwap|compareAndSwapFinalize"` — confirm the **only** callers outside
  `authority-registry.ts` itself are `scripts/enable-modes.cjs` and `scripts/flip-authority.cjs`. Do not
  touch `authority-registry.ts` — leaving these mutators dead is expected and correct (phase 005 reduces
  them, not this phase).
- [ ] STOP and report if any hit lands outside the module's own files, its tests, or the expected
  non-dependency comment.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 — Sever doc cross-references (edits first)
- [ ] `scripts/README.md`: remove the `enable-modes.cjs` FILES row. (No `flip-authority.cjs` row exists —
  confirmed pre-existing gap; do not add one.)
- [ ] `lib/README.md`: remove the `fleet-enablement/` FILES row.
- [ ] `lib/legacy-projections/README.md` § CONSUMERS: remove the
  `.opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/mode-surface-map.ts` bullet; leave the
  `append-mode-event.ts` bullet intact.

### T3 — Delete targets
- [ ] Delete `scripts/enable-modes.cjs`.
- [ ] Delete `lib/fleet-enablement/` (whole directory: `enablement-driver.ts`, `mode-surface-map.ts`,
  `index.ts`, `README.md`).
- [ ] Delete `tests/unit/enable-modes-cli.vitest.ts`.
- [ ] Delete `tests/unit/fleet-enablement.vitest.ts`.
- [ ] Delete `scripts/flip-authority.cjs`.
- [ ] Delete `tests/unit/flip-authority-cli.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T4 — Verify (orchestrator runs; devin cannot run vitest)
- [ ] `node .../typescript/bin/tsc -p runtime/tsconfig.json` → no new `TS2307`; error count ≤ fresh
  baseline.
- [ ] `node runtime/scripts/verify-authority.cjs` → 8 modes `new_authoritative_final`.
- [ ] Runtime suite (`vitest run --reporter=dot`) → failing set unchanged by name vs baseline.
- [ ] `rg` re-scan of every deleted symbol/path (`enable-modes`, `fleet-enablement`, `runFleetEnablement`,
  `flip-authority`) → zero non-deleted references.

### T5 — Commit
- [ ] One conventional commit, `<100` files, mass-deletion guard respected (not overridden).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All verification gates pass (see `spec.md` SUCCESS CRITERIA / `plan.md` TESTING STRATEGY)
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

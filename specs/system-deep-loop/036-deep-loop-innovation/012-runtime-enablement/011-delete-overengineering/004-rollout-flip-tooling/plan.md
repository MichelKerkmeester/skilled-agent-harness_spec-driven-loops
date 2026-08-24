---
title: "Plan: Phase 004 Rollout & Flip Tooling"
description: "Approach and verification gates for the F3/F4 rollout/flip-tooling removal wave."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/004-rollout-flip-tooling"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Plan: Phase 004 Rollout & Flip Tooling

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Overview

Two independent one-time tooling stacks, no ordering dependency between them, no live-loop adjacency. The
only ordering rule is intra-target: sever every README row and consumer-list bullet before deleting the
file it describes, so no doc is left pointing at a path that no longer exists.

`lib/fleet-enablement/` has no barrel consumer outside itself — `index.ts` is the sole re-export point and
the whole directory goes together, so there is no separate "sever the barrel" step the way F5/F6 in wave
001 needed; the directory deletion *is* the barrel removal.

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

Deletion-only wave — no new architecture introduced. The existing module/barrel/test/doc structure is
reduced, not restructured.

### Key Components

Unaffected by design; see `spec.md` §3 SCOPE for the exact files removed and README cross-references
fixed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Re-confirm zero callers for F3/F4, and re-confirm the CAS-mutator caller set (`tasks.md` T1).

### Phase 2: Core Implementation
- Sever doc cross-references, then delete the two stacks and their tests (`tasks.md` T2–T3).

### Phase 3: Verification
- Run typecheck, authority check, runtime suite, and residue scan, then commit (`tasks.md` T4–T5).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command | Pass condition |
|------|---------|----------------|
| Typecheck | project `tsc -p runtime/tsconfig.json` | no new `TS2307`; total errors ≤ fresh baseline |
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
| Phase 005 (downstream) | Internal | Blocked-on-this | Phase 005 cannot start until this phase lands and is green — see Sequencing below |
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

tsc = 57 errors (TS2322×38, TS2411×16, TS2339×2, TS2352×1), 0 TS2307 — the figure captured for wave 001 on
this same unmodified tree; still the reference point since no wave in the program has executed yet. Runtime
suite baseline: 13 pre-existing failures (env/load-sensitive), zero MODULE_NOT_FOUND. Re-capture fresh
immediately before this wave executes — if waves 001–003 have already landed by then, the fixed figures
above are stale and the fresh capture is what this wave's gates compare against, not this historical
number. A green is guilty until a perturbation confirms it.

## 9. SEQUENCING

`enable-modes.cjs` and `flip-authority.cjs` are the only two callers of the authority-registry CAS mutators
(`prepareCutover`, `compareAndSwap`, `compareAndSwapFinalize`). This wave does not touch
`authority-registry.ts` — reducing those now-dead mutators is phase 005, which runs after this wave lands.
The read-only capability this tooling served (confirm all 8 modes on ledger authority) is unaffected: it
already lives in `scripts/verify-authority.cjs`, which never imported F3 or F4, so no capability is lost by
this deletion — only the write-path machinery that already finished its one-time job.

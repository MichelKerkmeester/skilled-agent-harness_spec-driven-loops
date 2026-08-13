---
title: "Implementation Plan: Write-Containment Concurrent-Writer Safety"
description: "Remove the irreversible rmSync delete path from the deep-loop write-containment guard and split its outcome into fatal (in-HEAD) violations and non-fatal (not-in-HEAD) advisories, so fan-out is safe on a dirty, multi-actor tree."
trigger_phrases:
  - "write containment plan"
  - "preserve untracked containment fix"
  - "fatal advisory split fanout"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/048-write-containment-hardening/003-write-containment-concurrent-safety"
    last_updated_at: "2026-08-11T14:03:33Z"
    last_updated_by: "codex"
    recent_action: "Preserved the shipped plan while reopening moved-packet metadata closeout"
    next_safe_action: "Refresh continuity after packet paths are clean."
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts"
    session_dedup:
      fingerprint: "sha256:dc2fbfec4b1f6aec3fcebd172b0a38740d34c213191ef7dcba0041d953229ed9"
      session_id: "2026-08-06-deep-loop-046"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "The fix is additive to the revert-action branch only; no other executor kind or containment trigger changed"
---
# Implementation Plan: Write-Containment Concurrent-Writer Safety

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (runtime lib) + CommonJS (`fanout-run.cjs`) |
| **Framework** | deep-loop fan-out runtime (`system-deep-loop/runtime`) |
| **Storage** | Git working tree (baseline diff, no database) |
| **Testing** | Vitest (`write-containment.vitest.ts`) |

### Overview
`write-containment.ts` diffs the working tree after a `cli-codex` leaf dispatch and reverts any out-of-scope path. For a not-in-HEAD (untracked) path the only prior revert was a hard `rmSync` delete, which is irreversible and cannot distinguish the leaf's own writes from a concurrent actor's. The fix removes the delete branch entirely: `revertOutOfScopeViolations` now preserves not-in-HEAD paths on disk with action `preserved_untracked`, and `enforceWriteContainment` partitions its findings into fatal `violations` (in-HEAD, reverted from HEAD) and non-fatal `advisories` (not-in-HEAD, preserved). `fanout-run.cjs` fails the iteration only on fatal violations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (dirty-tree deletion of unattributable files)
- [x] Success criteria measurable (vitest pass count, tsc diagnostics, `rg rmSync` absence)
- [x] Dependencies identified (git baseline diff, no external services)

### Definition of Done
- [x] All acceptance criteria met (preserve not-in-HEAD, keep reverting in-HEAD, fatal/advisory split, fail-only-on-fatal)
- [x] Tests passing (`write-containment.vitest.ts` 18/18)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary, this packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard-and-revert: a post-dispatch git diff classifies out-of-scope paths, then a revert function acts on each classification. The fix changes only the revert action for one classification (not-in-HEAD) and adds an outcome partition consumed by the caller.

### Key Components
- **`revertOutOfScopeViolations` (write-containment.ts)**: For each out-of-scope path, reverts in-HEAD paths via `git checkout HEAD` and now leaves not-in-HEAD paths untouched, recording `preserved_untracked` instead of deleting.
- **`enforceWriteContainment` (write-containment.ts)**: Aggregates revert actions into `EnforceResult`, now with a fatal `violations` array (in-HEAD) and a non-fatal `advisories` array (not-in-HEAD).
- **`fanout-run.cjs`**: Logs the containment event whenever anything is detected (fatal or advisory) and fails the codex iteration only when `containment.violations.length > 0`.

### Data Flow
1. `fanout-run.cjs` captures a pre-dispatch git baseline for the leaf's artifact directory.
2. The leaf dispatches; the working tree may pick up out-of-scope changes from the leaf itself or from a concurrent actor.
3. `enforceWriteContainment` diffs against the baseline, classifies each out-of-scope path as in-HEAD or not-in-HEAD, and calls `revertOutOfScopeViolations`.
4. In-HEAD paths are reverted from HEAD and recorded as fatal `violations`; not-in-HEAD paths are preserved on disk and recorded as non-fatal `advisories`.
5. `fanout-run.cjs` logs the full event and fails the iteration only if `violations.length > 0`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reproduce the exact symptom with a negative control (pre-fix test run)
- [x] Confirm the `rmSync` delete branch as the root cause in `write-containment.ts`

### Phase 2: Core Implementation
- [x] Remove the `rmSync` import and the delete branch from `revertOutOfScopeViolations`
- [x] Add `preserved_untracked` to the `ContainmentRevertAction.action` union and use it for not-in-HEAD paths
- [x] Add `advisories` to `EnforceResult`; partition detected violations into fatal `violations` (in-HEAD) and non-fatal `advisories` (not-in-HEAD)
- [x] Update `fanout-run.cjs` to log every containment event and fail the iteration only on `containment.violations.length > 0`

### Phase 3: Verification
- [x] Flip the untracked-delete assertions in `write-containment.vitest.ts` to preservation assertions
- [x] Add a concurrent-writer regression proving a not-in-HEAD file is preserved as a non-fatal advisory
- [x] Add a mixed fatal-tracked + advisory-untracked regression case
- [x] Run the full unit suite and whole-runtime typecheck

### Phase 4: Metadata closeout
- [ ] Refresh continuity fingerprints after the moved packet's paths are clean.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Pre-fix run reproducing the exact bug (4 failed assertions) | Vitest |
| Unit | `revertOutOfScopeViolations`, `enforceWriteContainment` preserve/revert/partition behavior | Vitest (`write-containment.vitest.ts`) |
| Regression | Concurrent untracked writer preserved as advisory; mixed fatal-tracked + advisory-untracked case | Vitest |
| Static proof | No remaining delete capability in the module | `rg rmSync write-containment.ts` |
| Type safety | Whole-runtime typecheck | `tsc --noEmit` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git working tree / baseline diff | Internal | Green | Containment detection itself is unchanged by this fix; only the revert action changed |
| `fanout-run.cjs` shared runtime | Internal | Green | Used by every deep mode; the full fanout/executor vitest suites gate the change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A regression is found where an in-HEAD violation no longer fails an iteration, or where the advisory log is silently dropped.
- **Procedure**: Revert the three changed files (`write-containment.ts`, `fanout-run.cjs`, `write-containment.vitest.ts`) to their pre-fix state; this restores the old delete-on-untracked behavior, so only revert if the fatal-path regression risk is judged worse than reintroducing the deletion bug.
<!-- /ANCHOR:rollback -->

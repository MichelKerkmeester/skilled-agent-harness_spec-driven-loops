---
title: "Implementation Summary: Write-Containment Concurrent-Writer Safety"
description: "The deep-loop write-containment guard can no longer irreversibly delete files it cannot attribute to a codex leaf. Not-in-HEAD out-of-scope paths are now preserved and logged as non-fatal advisories instead of being hard-deleted; in-HEAD out-of-scope changes are still reverted from HEAD and still fail the iteration."
trigger_phrases:
  - "write containment fix shipped"
  - "preserve untracked implementation summary"
  - "fatal advisory split delivered"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/046-write-containment-concurrent-safety"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Recorded the shipped and verified write-containment concurrent-writer safety fix"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts"
    session_dedup:
      fingerprint: "sha256:ae8d6b2a9fe52de5f9f37e05114d0cbc05691ff8c7396040bd4d4891404b0d0c"
      session_id: "2026-08-06-deep-loop-046"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Write-Containment Concurrent-Writer Safety

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 046-write-containment-concurrent-safety |
| **Completed** | 2026-08-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop write-containment guard can no longer destroy a file it cannot prove belongs to the leaf it is watching. A 15-iteration research run on a dirty, multi-actor tree had deleted 12 untracked files at end-of-run - 4 from the current session and 8 belonging to the operator's unrelated, concurrent workstreams - because the guard's only "revert" for an untracked out-of-scope path was a hard delete. That delete branch is gone.

### Preserve, Don't Delete
`revertOutOfScopeViolations` in `write-containment.ts` no longer imports or calls `rmSync`. A not-in-HEAD (untracked or newly-added) out-of-scope path is now left on disk and recorded with a new action, `preserved_untracked`. An in-HEAD out-of-scope modification or deletion is still reverted with `git checkout HEAD`, because that revert is recoverable and is the guard's genuine protection against a leaf corrupting tracked source.

### Fatal vs. Advisory Outcomes
`EnforceResult` gained an `advisories` field alongside the existing `violations` field. `enforceWriteContainment` now partitions every detected out-of-scope path by its revert action: in-HEAD reverts land in `violations` (fatal, fails the iteration), and preserved not-in-HEAD paths land in `advisories` (non-fatal, logged only). `fanout-run.cjs` logs the containment event whenever either array is non-empty, but only fails a codex iteration when `containment.violations.length > 0`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified | Removed `rmSync` import and delete branch; added `preserved_untracked` action and the `advisories`/`violations` partition |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Logs every containment event; fails the iteration only on fatal `violations` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modified | Flipped untracked-delete assertions to preservation; added a concurrent-writer regression and a mixed fatal-tracked + advisory-untracked case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix was proven with a negative control first: running the pre-fix test suite reproduced the exact bug, with 4 assertions failing because the code returned `removed_untracked` and empty advisories where `preserved_untracked` was expected. After the fix, the same suite - now updated to assert preservation, plus the new concurrent-writer and mixed-outcome regressions - passed 18/18. A whole-runtime TypeScript check confirmed 0 errors attributable to the change (the only remaining diagnostic is a pre-existing `tsconfig` `moduleResolution=node10` deprecation, unrelated to this fix). A direct `rg rmSync write-containment.ts` search returned no match, confirming the module has no remaining path to delete a file. The high-value protection - reverting an in-HEAD out-of-scope change from HEAD and failing the iteration - was left untouched and is still covered by the existing suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Never delete a not-in-HEAD path, full stop | Deletion was the only available revert for an untracked path and it is irreversible; those are exactly the paths the guard cannot prove belong to the leaf, so any delete there risks destroying a concurrent actor's work |
| Keep reverting in-HEAD paths from HEAD | `git checkout HEAD` is recoverable and is the guard's real protection against a leaf corrupting tracked source; removing it would weaken containment for no data-loss benefit |
| Split the outcome into fatal `violations` and non-fatal `advisories` | The failure mode that caused data loss was treating an unattributable untracked file the same as a genuine tracked-source violation; splitting the outcome lets the fan-out keep failing hard on real violations while no longer punishing (by deleting) paths it cannot attribute |
| Prove the fix with a negative control before trusting the green suite | The bug was silent (no exception, just a wrong deletion); confirming the pre-fix test actually failed the expected way rules out a test that would have passed either way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control (pre-fix) | FAIL as expected - 4 assertions failed: expected `preserved_untracked`, got `removed_untracked`; advisories empty |
| `npx vitest run tests/unit/write-containment.vitest.ts` (cwd `.opencode/skills/system-deep-loop/runtime`) | PASS - 18/18 |
| `npx tsc --noEmit -p tsconfig.json` | PASS - 0 errors attributable to this change (pre-existing `moduleResolution=node10` deprecation only) |
| `rg rmSync write-containment.ts` | PASS - no match; the module cannot delete a file |
| In-HEAD revert-and-fail behavior | PASS - unchanged; still reverts from HEAD and still fails the iteration, covered by the existing suite |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 8 already-deleted operator files cannot be recovered.** They were untracked, had no backup, and were deleted before this fix landed; recovery from git or worktrees is not possible. This is recorded as out of scope, not remediated.
2. **No per-write process attribution.** The guard still cannot tell which process wrote a given not-in-HEAD path; it can only avoid destroying paths it cannot attribute. Attributing writes to the codex subprocess specifically is not feasible with the current adapter and is potential future work.
3. **Detection still depends on the pre-dispatch git baseline.** If the baseline capture itself is wrong or stale, both the fatal and advisory classifications inherit that error; this fix changes only the revert action, not the detection mechanism.
<!-- /ANCHOR:limitations -->

---
title: "Implementation [system-deep-loop/036-deep-loop-innovation/021-containment-symlink-autoscope/implementation-summary]"
description: "Final state and verification for auto-resolving the write-containment repo root to the worktree that physically holds a symlinked artifact, closing the containment half of the spaced-path catch-22 without touching the guard."
trigger_phrases:
  - "containment symlink autoscope summary"
  - "resolvecontainmentreporoot artifact worktree"
  - "containment catch-22 closed"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-containment-symlink-autoscope"
    last_updated_at: "2026-08-27T03:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Auto-scoped containment to the artifact's real worktree; catch-22 closed, boundary intact"
    next_safe_action: "Commit; push per operator go-ahead"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/tests/runtime-bootstrap.test.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The catch-22 is a symlinked spec tree realpathing out of cwd's worktree; auto-resolving to the artifact's worktree fixes it."
      - "The guard is untouched and the security boundary holds (non-worktree artifacts stay unscopable)."
---
# Implementation Summary: Containment Auto-Scope for Symlinked Spec Trees

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-containment-symlink-autoscope |
| **Completed** | 2026-08-26 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~2 hours |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the containment half of the spaced-path catch-22 that packet 020 left as an open question. When the loop runs from a checkout whose `.opencode` is a symlink into a shared checkout, the spec/artifact tree realpaths out of the working directory's git worktree, so `resolveArtifactScope` returned null and containment could not function — and the writes physically landed in a worktree git could not see from cwd. The fix resolves the containment repo root to the worktree that physically holds the artifact, automatically, so both the scope check and the git operations run against the right repo. The containment guard itself is untouched; only repo-root resolution changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/runtime-bootstrap.cjs` | Modified | `resolveContainmentRepoRoot` now redirects to the artifact's worktree when it symlinks out of cwd's; adds/exports `realpathSafe` + `isSubpath` |
| `runtime/scripts/fanout-run.cjs` | Modified | Imports `__internals`; passes `lineageDir` + `resolveGitToplevel` into the resolver |
| `runtime/scripts/tests/runtime-bootstrap.test.cjs` | Modified | node:test for redirect / in-worktree / non-worktree / override-wins |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The catch-22 was reproduced with a two-git-repo fixture: an "outer" checkout whose `.opencode` symlinks into a "shared" checkout. `resolveArtifactScope` returned null there, exactly as reported. The fix was confirmed at the same fixture: with the resolver, `repoRoot` becomes the shared worktree, `resolveArtifactScope` returns a real scope, and an orphan artifact (in no worktree) still returns null — the security boundary holds. The precedence is override, then artifact-worktree redirect, then cwd; the redirect fires only when the artifact is outside cwd's worktree (the previously-null case), so the normal path is unchanged. `gitToplevel` is injected so the decision is unit-tested with a fake resolver and real temp symlinks. Verified on both gates.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix repo-root resolution, not the guard | The guard scopes correctly once given the right root; the only defect was choosing cwd's worktree. This keeps the security boundary logic untouched. |
| Redirect only to a worktree that CONTAINS the artifact | A non-worktree location never becomes the scope base, so the guard can never be widened to an arbitrary path. |
| Inject `gitToplevel` | Keeps the resolver a pure decision function, unit-testable with a fake resolver instead of a live git repo. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `runtime-bootstrap.test.cjs` (node:test) | PASS — 9/9 (5 tsx + 4 auto-scope) |
| Repro: symlinked artifact scopes | PASS — `repoRoot` = the real worktree; scope non-null |
| Negative control: orphan artifact | PASS — still `NULL` (boundary intact) |
| `run-node-tests.mjs` | 84 files, 767 pass, 17 fail — all pre-existing; +4 mine, 0 new |
| Runtime vitest whole suite | Delta clean; the write-containment guard tests pass unchanged |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Auto-detection relies on the artifact living in a git worktree.** If the symlinked spec tree points somewhere that is not a git worktree at all, the resolver keeps cwd (never widening scope) and containment behaves as before — a genuinely out-of-repo run stays unscopable by design.
2. **The exact "Mobile CLI" checkout was not available.** The fix targets the general case (a spec tree symlinked into a second git worktree), which is what the report describes; if that operator's topology differs, the reproduction fixture is the reference to adjust against.

<!-- /ANCHOR:limitations -->

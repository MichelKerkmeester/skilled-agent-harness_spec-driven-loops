---
title: "Verification Checklist: Containment Auto-Scope for Symlinked Spec Trees"
description: "Verification evidence for auto-resolving the containment repo root to the artifact's real worktree."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-containment-symlink-autoscope"
    last_updated_at: "2026-08-27T03:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Verified fix + negative control + both gates"
    next_safe_action: "Commit"
---
# Verification Checklist: Containment Auto-Scope for Symlinked Spec Trees

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

- [x] CHK-001 [P0] The catch-22 reproduced
  - **Evidence**: symlinked `.opencode` spec tree -> `resolveArtifactScope` returns `NULL`
- [x] CHK-002 [P0] The guard confirmed correct given the right repo root
  - **Evidence**: with `repoRoot` = the artifact's worktree, `resolveArtifactScope` returns a scoped result
- [x] CHK-003 [P1] The security boundary is understood
  - **Evidence**: a non-worktree artifact must stay `NULL`; redirect only to a worktree that contains the artifact

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The guard is untouched
  - **Evidence**: only `resolveContainmentRepoRoot` + its `fanout-run` call site changed; `resolveArtifactScope` unchanged
- [x] CHK-011 [P1] The resolver stays testable
  - **Evidence**: `gitToplevel` is injected; unit tests use a fake resolver + real temp symlinks

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The auto-detection is unit-tested
  - **Evidence**: `runtime-bootstrap.test.cjs` redirect / in-worktree / non-worktree / override-wins all green
- [x] CHK-021 [P0] The negative control passes
  - **Evidence**: a non-worktree artifact resolves to cwd, never widening scope; orphan artifact stays `NULL` in the repro
- [x] CHK-022 [P1] No new whole-suite regression on either gate
  - **Evidence**: `run-node-tests.mjs` 767 pass / 17 pre-existing; runtime vitest delta clean, guard tests pass

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] The symlinked artifact scopes correctly
  - **Evidence**: repro resolves `repoRoot` to the real worktree; `resolveArtifactScope` returns `.opencode/specs/foo/lineage`
- [x] CHK-025 [P1] The override still wins
  - **Evidence**: `DEEP_LOOP_REPO_ROOT` precedence unit test passes

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Scope is never widened to a non-worktree location
  - **Evidence**: the non-worktree unit test asserts the resolver returns cwd, not the orphan path (`resolveContainmentRepoRoot`)

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The WHY is durable and hygiene-clean
  - **Evidence**: `runtime-bootstrap.cjs` comment states the symlink failure mode; `check-comment-hygiene.sh` exit 0

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scoped diff — resolver + one call site + tests
  - **Evidence**: `git status` = `runtime-bootstrap.cjs`, `fanout-run.cjs`, the test, and packet docs

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-26
**Verified By**: claude (conductor)

<!-- /ANCHOR:summary -->

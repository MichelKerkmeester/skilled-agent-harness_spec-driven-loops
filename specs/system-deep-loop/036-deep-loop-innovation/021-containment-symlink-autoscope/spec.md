---
title: "Feature Specification: Containment Auto-Scope for Symlinked Spec Trees"
description: "Close the containment half of the spaced-path catch-22: when the artifact tree resolves through a symlink into a different checkout, write-containment rejected every artifact as unscopable because it resolved against the working directory's git worktree, which no longer contains the realpath'd artifact. Resolve the containment repo root to the worktree that physically holds the artifact, automatically, so containment works without requiring DEEP_LOOP_REPO_ROOT."
trigger_phrases:
  - "containment symlink autoscope"
  - "resolveArtifactScope null symlinked spec tree"
  - "containment repo root auto detection"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-containment-symlink-autoscope"
    last_updated_at: "2026-08-27T03:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Auto-scoped containment to the artifact worktree; verified"
    next_safe_action: "Reconcile docs; commit; push per operator go-ahead"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The catch-22 is real: a symlinked spec tree realpaths out of cwd's git worktree, so resolveArtifactScope returns null."
      - "Auto-resolving the repo root to the artifact's real worktree fixes it without touching the guard or requiring an env var."
---
# Feature Specification: Containment Auto-Scope for Symlinked Spec Trees

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-26 |
| **Source** | Closes the OPEN QUESTION documented in `020-tsx-boot-spaced-path-hardening` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 020-tsx-boot-spaced-path-hardening |
| **Successor** | 022-phase0-dispatch-anchor |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 020 fixed the tsx-loader crash and added a `DEEP_LOOP_REPO_ROOT` override, but left the containment half of the operator's catch-22 unconfirmed. It is now reproduced: when the loop runs from a checkout whose `.opencode` is a symlink into a different (shared) checkout, the spec/artifact tree realpaths *out* of the working directory's git worktree. Write-containment resolves the artifact scope against the worktree of `process.cwd()`; because the artifact's realpath is not a subpath of that worktree, `resolveArtifactScope` returns `null` — the write is treated as unscopable, and containment cannot function. Worse, the writes physically land in the OTHER checkout, so running git against `cwd`'s repo cannot see them at all. The `DEEP_LOOP_REPO_ROOT` override fixes it only if the operator knows to set it.

### Purpose

Resolve the containment repo root automatically to the git worktree that physically contains the artifact, so containment scopes correctly and git can see the writes — without requiring the operator to set an env var, and without changing the containment guard's own logic or its security boundary.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extend `resolveContainmentRepoRoot(env, cwd, opts)` with an artifact-aware auto-detection: when the artifact resolves outside cwd's git worktree, return the worktree that physically holds it (via an injected `gitToplevel`). The `DEEP_LOOP_REPO_ROOT` override still wins; the in-worktree case is unchanged.
- Wire `fanout-run.cjs` to pass the per-leaf `lineageDir` and `resolveGitToplevel` (from write-containment `__internals`) into the resolver.
- node:test coverage for the auto-detection, including the security-boundary case (a non-worktree artifact never widens scope).

### Out of Scope

- Any change to `resolveArtifactScope` / `enforceWriteContainment` — the guard is untouched.
- The tsx-loader fix and the env override (packet 020).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/runtime-bootstrap.cjs` | Modify | Artifact-aware `resolveContainmentRepoRoot`; export `realpathSafe`/`isSubpath` |
| `scripts/fanout-run.cjs` | Modify | Import `__internals`; pass `lineageDir` + `gitToplevel` to the resolver |
| `scripts/tests/runtime-bootstrap.test.cjs` | Modify | node:test for the auto-detection + the negative (non-worktree) case |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A symlinked-out artifact scopes correctly | With the resolved repo root, `resolveArtifactScope` returns a non-null scope for a spec tree symlinked into another worktree. |
| REQ-002 | The security boundary is preserved | A genuinely out-of-scope artifact (in no worktree) is still rejected; the guard logic is unchanged. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The normal case is unchanged | When the artifact is inside cwd's worktree, the resolver returns cwd exactly as before. |
| REQ-004 | The explicit override still wins | `DEEP_LOOP_REPO_ROOT` takes precedence over auto-detection. |
| REQ-005 | No whole-suite regression on either gate | The runtime vitest suite (guard tests included) and `run-node-tests.mjs` show no new code-caused failures. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The reproduced catch-22 resolves — the artifact scopes instead of returning null.
- **SC-002**: The negative control (non-worktree artifact) is still rejected.
- **SC-003**: Both gates clean; the guard's own tests unchanged and passing.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widening the containment scope could hide a real out-of-scope write | A leaf write escapes the guard | Auto-detection only redirects to a git worktree that CONTAINS the artifact; a non-worktree location never widens scope (tested); the guard logic is untouched |
| Risk | Auto-detection changes the normal case | Regression for in-worktree runs | The redirect only fires when the artifact is outside cwd's worktree — the previously-null case; the in-worktree path returns cwd unchanged (tested) |
| Dependency | `write-containment __internals.resolveGitToplevel` | The injected git resolver | Verified present and exported |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The containment catch-22 documented in packet 020 is reproduced and closed; the exact "Mobile CLI" topology is modeled as a symlinked spec tree into a second git worktree, which is the general case.

<!-- /ANCHOR:questions -->

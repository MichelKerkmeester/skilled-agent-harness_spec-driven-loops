---
title: "Feature Specification: Worktree Hygiene & Relocation"
description: "Prune finished git worktrees, enable Git's filesystem monitor, and make the sk-git worktree base directory configurable so worktrees can live outside the primary checkout — stopping GitKraken, git status, fsmonitor, and sync clients from scanning every nested worktree's node_modules."
trigger_phrases:
  - "worktree base relocation"
  - "move worktrees out of checkout"
  - "gitkraken high cpu worktrees"
  - "speckit worktreeBase config"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/026-worktree-hygiene-and-relocation"
    last_updated_at: "2026-08-21T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "Relocated 13 idle worktrees to ~/worktrees/public; sk-git base now configurable"
    next_safe_action: "Operator decision on the 0158 orphan (229M); optional commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-spec"
      parent_session_id: null
---
# Feature Specification: Worktree Hygiene & Relocation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repo carried 24 git worktrees nested inside the primary checkout at
`.worktrees/`. Because they live under the primary tree, any filesystem scan from
the repo root walks all of them: a `find` counted ~2.79M files, ~900K of them in
128 real (non-symlinked) nested `node_modules`. GitKraken (opened on the primary
checkout), `git status`, and any file-watcher paid that cost on every scan —
observed as git subprocesses at ~41% CPU and a ~1.8GB GitKraken renderer.

### Purpose

Reduce the file forest the primary checkout exposes to watchers by (1) pruning
finished worktrees, (2) enabling Git's filesystem monitor, and (3) making the
worktree base directory configurable so worktrees can be relocated outside the
checkout entirely.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Safe removal of clean, branch-backed worktree directories (branch refs preserved).
- `core.fsmonitor` + `core.untrackedcache` in the primary checkout.
- Configurable worktree base across the allocator, launch wrapper, and reaper.
- Migration of idle worktrees to the relocated base.

### Out of Scope

- The active worktree `022-012-runtime-enablement-build` (never moved/removed).
- Branch-ref deletion (refs preserved so every removal stays reversible).
- The `0158` orphan removal (229M; deferred to operator decision).

### Target State

New and migrated worktrees live at `~/worktrees/public`; the primary checkout's
`.worktrees/` holds only the active worktree; other clones default unchanged to
in-checkout `.worktrees`.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-001** Prune removes only clean worktrees (non-forced `git worktree remove`); dirty/locked are reported.
- **REQ-002** The active worktree 022 is preserved throughout.
- **REQ-003** Configurable base resolves consistently in allocator, wrapper, and reaper; default `.worktrees` unchanged.

### P1 - Required (complete OR user-approved deferral)

- **REQ-004** `core.fsmonitor` + `core.untrackedcache` enabled and verified.
- **REQ-005** `is_valid_pair` accepts both the configured base and the legacy `.worktrees` layout.
- **REQ-006** All sk-git worktree test suites green.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** Main-checkout file count materially reduced (measured before/after).
- **SC-002** `git worktree repair` reports a healthy registry after migration.
- **SC-003** Active worktree 022 branch + uncommitted files intact.
- **SC-004** `speckit.worktreeBase` set; new worktrees allocate outside the checkout.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Moving a worktree with a live session breaks it | Low | `lsof -d cwd` pass proved only 022 live; only idle worktrees moved |
| Relocation breaks other clones / CI | Low | Default stays `.worktrees`; only this repo sets the config |
| `/var` vs `/private/var` skew breaks daemon detection | Med | Reaper canonicalizes parents before comparing to the base |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1** Remove the `0158` orphan (229M, no branch ref, no git admin entry)? Deferred to operator; removal is terminal.
- **Q2** Commit the sk-git runtime changes now? The comment-hygiene pre-commit checker is currently reported missing/not-executable, which will block commits until resolved.

<!-- /ANCHOR:questions -->

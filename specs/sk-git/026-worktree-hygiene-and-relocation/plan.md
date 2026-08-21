---
title: "Plan: Worktree Hygiene & Relocation"
description: "Implementation plan for pruning worktrees, enabling fsmonitor, and making the sk-git worktree base configurable and relocatable."
trigger_phrases:
  - "worktree relocation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/026-worktree-hygiene-and-relocation"
    last_updated_at: "2026-08-21T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "Plan executed end to end"
    next_safe_action: "Operator decision on 0158 orphan; optional commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-plan"
      parent_session_id: null
---
# Plan: Worktree Hygiene & Relocation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three sequential items reduce the file forest the primary checkout exposes to
watchers: prune finished worktrees, enable Git's filesystem monitor, and make the
sk-git worktree base configurable so worktrees relocate outside the checkout.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Existing sk-git suites (allocator, wrapper, reaper) stay green with no config set.
- New relocated-base behavior covered by regression tests + a throwaway-repo negative control.
- Active worktree 022 intact (branch + uncommitted files) after migration.
- `git worktree repair` reports a healthy registry.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`_wn_base_dir()` in the allocator resolves the worktree base:
`SPECKIT_WORKTREE_BASE` (env) > `speckit.worktreeBase` (git config) > `.worktrees`
(default, relative to toplevel). The default preserves legacy in-checkout behavior
for every other clone and the test suite. The launch wrapper and reaper inline an
equivalent resolver (launch-path robustness). `is_valid_pair` accepts both the
configured base and the legacy `.worktrees` layout so pre- and post-relocation
worktrees both validate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Prune + fsmonitor
Non-forced `git worktree remove` on finished worktrees; `core.fsmonitor` + `core.untrackedcache`.

### Phase 2: Relocation code
Base resolver + pair/creation + launch wrapper + reaper + regression tests + docs.

### Phase 3: Migration + verification
Set config, `git worktree move` idle worktrees, `git worktree repair`, verify 022 + file-count delta.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Backward-compat: run allocator/wrapper/reaper suites with no config (default `.worktrees`).
- New behavior: throwaway-repo negative control (worktree created outside repo) + 6 codified regression tests.
- Live migration: `git worktree list` shows relocated paths; 022 integrity check; file-count delta measured.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Git ≥ 2.37 for the built-in fsmonitor daemon (host has 2.50.1).
- `~/worktrees/public` on the same volume as the repo (instant `git worktree move` renames).
- No coupling to the pre-push hook (it validates off branch names, not directory paths).

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Prune:** `git worktree add <dir> <branch>` recreates any removed worktree (branch refs preserved).
- **fsmonitor:** `git config --unset core.fsmonitor` / `core.untrackedcache`.
- **Relocation:** `git config --unset speckit.worktreeBase`; `git worktree move` worktrees back; revert the sk-git commit; `git worktree repair`.

<!-- /ANCHOR:rollback -->

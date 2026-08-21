---
title: "Implementation Summary: Worktree Hygiene & Relocation"
description: "Final state and validation evidence for the worktree prune + fsmonitor + configurable-base relocation work."
trigger_phrases:
  - "worktree relocation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/026-worktree-hygiene-and-relocation"
    status: implemented
    last_updated_at: "2026-08-21T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped all 3 items; suites green; main file count 2.79M → 587K"
    next_safe_action: "Operator decision on 0158 orphan (229M); optional commit of sk-git changes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/worktree-naming.sh"
      - ".opencode/bin/worktree-session.sh"
      - ".opencode/bin/worktree-reaper.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-impl"
      parent_session_id: null
---
# Implementation Summary: Worktree Hygiene & Relocation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Branch** | `skilled/v4.0.0.0` |
| **Completed** | 2026-08-21 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## 2. What Was Built

All three requested items shipped.

**Item 1 — Prune.** 9 finished worktrees removed via non-forced `git worktree
remove`; branch refs preserved (reversible). 15 worktrees with real uncommitted
work kept.

**Item 2 — fsmonitor.** `core.fsmonitor=true` + `core.untrackedcache=true` set and
verified; caches warmed. Git 2.50.1.

**Item 3 — Relocation.** Worktree base is now configurable (`speckit.worktreeBase`
/ `SPECKIT_WORKTREE_BASE`, default `.worktrees`), resolved by allocator, launch
wrapper, and reaper. This repo is set to `~/worktrees/public`; 13 idle worktrees
migrated there; active `022-012-runtime-enablement-build` stays in-repo, intact.

Result: main-checkout file count **2,794,654 → 587,282 (−79%)**.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## 3. How It Was Delivered

Files changed:
- `.opencode/skills/sk-git/scripts/worktree-naming.sh` — `_wn_base_dir()`, base-aware pair + creation, grammar comment
- `.opencode/bin/worktree-session.sh` — wrapper base resolution
- `.opencode/bin/worktree-reaper.sh` — reaper base + generalized daemon-orphan detection
- `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` — assertion fix + 6 regression tests
- `.opencode/skills/sk-git/SKILL.md` — ALWAYS #4 base documentation + version bump 1.5.1.0 → 1.5.2.0
- `.opencode/skills/sk-git/scripts/README.md` — `validate-pair` row
- `.opencode/skills/sk-git/changelog/v1.5.2.0.md` — release entry (sk-doc VALID)

Sequence: prune + fsmonitor first (fast, reversible), then the code with a
throwaway-repo negative control, then the live migration with `git worktree move`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## 4. Key Decisions

- **Configurable base, default `.worktrees`.** Relocation must not break other clones/CI/tests; only this repo opts in via config.
- **Target `~/worktrees/public`.** Outside the checkout and any MEGA path; same volume → instant `git worktree move` renames.
- **Migrate idle, preserve active.** `lsof -d cwd` proved only 022 was live; moving preserves uncommitted work and is reversible.
- **Absolute dir emission.** A relative `.worktrees/x` is meaningless once the base is external; no production caller joins it with the toplevel.
- **Inline resolver in wrapper/reaper.** Keeps the launch path free of a new source-dependency across six runtimes.
- **Canonicalized daemon-orphan detection.** Fixes `/var` vs `/private/var` skew that a literal-prefix match missed.
- **Deferred the 0158 orphan.** 229M, no branch ref, no git admin entry, but removal is terminal — operator's call.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## 5. Verification

| Check | Result |
|-------|--------|
| Allocator suite | PASS 71 / FAIL 0 (+6 relocated-base tests) |
| Wrapper suite | PASS 15 / FAIL 0 |
| Reaper suite | PASS 15 / FAIL 0 |
| Negative-control (throwaway repo) | worktree created outside repo; pair valid; number not reused |
| `git worktree repair` | registry OK |
| Active 022 | branch intact, 3 uncommitted files preserved |
| `core.fsmonitor` / `core.untrackedcache` | `true` / `true` |
| Main file count | 2,794,654 → 587,282 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## 6. Known Limitations

1. **0158 orphan** (`.worktrees/0158-sk-git-session-start-reconcile`, 229M): deferred to operator; removal reclaims ~15.6K files but is terminal.
2. **Not committed.** Runtime changes are in the working tree only. The comment-hygiene pre-commit checker is currently reported "missing or not executable" — commits will be blocked until that is resolved.
3. **Ongoing prune** replaces this one-time cleanup as worktrees finish; the relocated base keeps future worktrees out of the checkout automatically.

<!-- /ANCHOR:limitations -->

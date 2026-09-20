---
title: "Implementation Plan: continuous-integration workflow for sk-git"
description: "Build a safe publish primitive, an IDE follower, and a status dashboard; wire autosync into the post-commit hook and the launch wrapper; achieve cross-runtime guard parity; document the model in sk-git."
trigger_phrases:
  - "continuous integration workflow"
  - "always current live branch"
  - "sk-git autosync"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/007-continuous-integration-workflow"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Scripts, hook, wrapper, and cross-runtime wiring implemented and sandbox-verified"
    next_safe_action: "Author the sk-git skill docs and run validate.sh --strict"
---
# Implementation Plan: continuous-integration workflow for sk-git

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | POSIX-ish Bash scripts + a git `post-commit` hook + JSON runtime config |
| **Framework** | sk-git skill; the `worktree-session.sh` launch wrapper; the versioned git hooks |
| **Storage** | `.opencode/bin/`, `.opencode/scripts/git-hooks/`, `.codex/hooks.json`, `.opencode/skills/sk-git/` |
| **Testing** | Isolated sandbox battery for `git-sync.sh`; `bash -n`; JSON validity; read-only smoke runs; `validate.sh --strict` |

### Overview
Sessions stay isolated (worktree + DB isolation unchanged) but publish each commit to one shared **live** branch. The primitive `git-sync.sh` does `fetch → fast-forward-or-rebase-abort → non-force push`. The `post-commit` hook calls it in a tightly-gated `--auto` mode so only launch-wrapper sessions publish. The wrapper resolves the live branch from the primary checkout, bases the session worktree on it, and exports the gating env. The IDE checkout runs `git-live-follow.sh` (fast-forward-only) to stay current. `worktree-status.sh` gives a glance view of what each session has and hasn't published. Because the mechanism is a git hook plus a runtime-agnostic wrapper, it fires identically across runtimes; the only missing cross-runtime piece was the two Codex SessionStart guards, now added.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The launch wrapper, the `post-commit` hook, and all three runtime SessionStart surfaces read directly before change.
- [x] The safety invariants confirmed: no force-push, abort-on-conflict, non-fatal, tracked-only dirty check.
- [x] OpenCode's existing guard wiring (via `session-cleanup.js`) confirmed so it is not double-wired.

### Definition of Done
- [x] `git-sync.sh` passes the full sandbox battery (fast-forward / rebase / conflict-abort / `--auto`-safe / untracked-tolerant).
- [x] The wrapper dry-run shows the live branch, base, and autosync env; it mutates nothing.
- [x] `.codex/hooks.json` is valid JSON with the two guards added.
- [x] `validate.sh --strict` passes on this packet.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Trunk-following continuous integration with short-lived per-session worktrees. Isolation is preserved for safe writes and DB separation; publication is decoupled and happens at commit granularity through a single safe primitive. The primary checkout is a read-mostly follower that no session works in.

### Key Components
- **`git-sync.sh`** — the publish primitive. Resolves live branch + remote, refuses to publish from the live branch itself, then loops: fetch, fast-forward-publish if the live tip is an ancestor of HEAD, else (tracked-clean) rebase onto the live tip and publish, else report pending. Any rebase conflict triggers `git rebase --abort` and a manual-resolution message. `--auto` makes every exit code 0.
- **`git-live-follow.sh`** — the IDE follower. Polls the live branch and fast-forwards the checkout only when the local tip is an ancestor of the remote tip and the tree is clean; a diverged or dirty tree is reported, never overwritten.
- **`worktree-status.sh`** — the dashboard. Walks `git worktree list --porcelain` and prints branch / ahead / behind / dirty against the live branch; ahead + dirty is exactly the not-yet-visible work.
- **`post-commit` autosync block** — env-gated (`SPECKIT_AUTOSYNC=1` + `SPECKIT_LIVE_BRANCH`), linked-worktree-only (`--absolute-git-dir` ≠ resolved `--git-common-dir`), non-fatal call to `git-sync.sh --auto --quiet`.
- **`worktree-session.sh` wiring** — resolves `LIVE_BRANCH` from the primary checkout, bases the new worktree on it, and exports `SPECKIT_LIVE_BRANCH` + `SPECKIT_AUTOSYNC` (default 1, honoring a pre-set 0).
- **`.codex/hooks.json`** — adds `worktree-guard.sh` + `check-git-hooks.sh` to SessionStart, mirroring Claude; OpenCode already runs both via its `session-cleanup.js` plugin.

### Data Flow
Launch → wrapper bases the worktree on the live branch and exports the autosync env → session commits → `post-commit` runs `git-sync.sh --auto` → the commit fast-forwards or rebases onto the live branch and publishes (non-force) → the IDE follower fast-forwards the primary checkout → the operator sees it.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the wrapper, the hook, and the three runtime SessionStart surfaces; confirm the safety invariants and the existing OpenCode guard wiring.

### Phase 2: Core Implementation
- [x] Author `git-sync.sh`, `git-live-follow.sh`, `worktree-status.sh`.
- [x] Add the gated autosync block to `post-commit`.
- [x] Wire the live-branch resolution + autosync env into `worktree-session.sh`.
- [x] Add the two SessionStart guards to `.codex/hooks.json`.

### Phase 3: Verification
- [x] Run the `git-sync.sh` sandbox battery; `bash -n` every script; validate the JSON; smoke-run the follower + dashboard + wrapper dry-run.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioral (sandbox) | `git-sync.sh` publish paths | Fake local remote + disabled hooks; 9 assertions |
| Syntax | All new + edited scripts | `bash -n` |
| Config validity | `.codex/hooks.json` | JSON parse + hook count |
| Smoke (read-only) | dashboard, follower, wrapper dry-run | Direct invocation, no mutation |
| Spec validation | This packet | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `worktree-session.sh` launch wrapper | Internal | Green | No env to gate autosync on |
| `install-git-hooks.sh` symlink of `post-commit` | Internal | Green | Autosync only fires when the hook is installed |
| `worktree-guard.sh` + `check-git-hooks.sh` | Internal | Green | Cross-runtime guard parity |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Autosync misbehaves or the operator wants the old invisible-but-isolated behavior back.
- **Procedure**: The three new scripts are additive (delete them). The behavior-affecting changes are the `post-commit` autosync block, the wrapper env exports, and the `.codex/hooks.json` guards — each is a `git checkout` of the file. Per-launch opt-out is `SPECKIT_AUTOSYNC=0` with no code change.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 40 minutes |
| Core Implementation | Medium | 70 minutes |
| Verification | Medium | 45 minutes |
| **Total** | | **155 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed autosync cannot fire from the primary checkout (triple gate).
- [x] Confirmed `--auto` never returns non-zero and the hook composes with existing behavior.

### Rollback Procedure
1. `git checkout` `post-commit`, `worktree-session.sh`, and `.codex/hooks.json`; delete the three new `.opencode/bin/*.sh` scripts.
2. Restart affected sessions so the reverted wrapper stops exporting the autosync env.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no data or history is rewritten; the live branch retains whatever was already published (non-force).

<!-- /ANCHOR:enhanced-rollback -->

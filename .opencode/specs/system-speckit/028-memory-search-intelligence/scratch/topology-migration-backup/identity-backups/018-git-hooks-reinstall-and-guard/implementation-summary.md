---
title: "Implementation Summary: Git Hooks Reinstall and Presence Guard"
description: "Status: COMPLETE. Reinstalled post-merge/post-rewrite, shipped check-git-hooks.sh as a SessionStart guard, and re-verified worktree hook sharing. A significant correction to the spec's own core.hooksPath reasoning was discovered during implementation and is recorded below."
trigger_phrases:
  - "git hooks reinstall status"
  - "018 complete"
  - "check-git-hooks.sh shipped"
  - "core.hooksPath global override finding"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/018-git-hooks-reinstall-and-guard"
    last_updated_at: "2026-07-09T20:55:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented REQ-001/002/003, corrected spec.md's core.hooksPath claim"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/check-git-hooks.sh"
      - ".claude/settings.json"
      - ".opencode/scripts/install-git-hooks.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-018-git-hooks-reinstall-and-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should check-git-hooks.sh also verify that core.hooksPath resolves to .git/hooks, not just that the symlinks exist? See Known Limitations — a machine with a conflicting global core.hooksPath override would pass this guard's current check while hooks silently never fire."
    answered_questions:
      - "Warn-only vs auto-reinstall for REQ-002: shipped warn-only, per spec.md's own recommendation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-git-hooks-reinstall-and-guard |
| **Completed** | 2026-07-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: COMPLETE.** All three requirements shipped and verified.

**REQ-001 (installer reinstall).** Ran `bash .opencode/scripts/install-git-hooks.sh` against
this checkout. Confirmed before: `.git/hooks/` had only `pre-commit`/`post-commit` symlinked
(dated May 23). Confirmed after: `ls -la .git/hooks/` shows all four hook names —
`pre-commit`, `post-commit`, `post-merge`, `post-rewrite` — as symlinks resolving into
`.opencode/scripts/git-hooks/`. (The installer also symlinks `README.md` into `.git/hooks/`,
pre-existing behavior of the unmodified installer, out of scope for this phase — harmless
because git only invokes hooks by reserved name.)

**REQ-002 (SessionStart presence guard).** Authored `.opencode/bin/check-git-hooks.sh`
(46 lines), structurally mirroring `worktree-guard.sh`: `set -euo pipefail`, an env-var
early-exit (`SPECKIT_GIT_HOOKS_GUARD=off`), resolves the expected hook set from
`.opencode/scripts/git-hooks/` (excluding `lib/` and `README.md`), stats each
`.git/hooks/<name>` for symlink-ness, prints one warning line naming every missing hook plus
the fix command, always exits 0. Wired as a third `SessionStart` hook command in
`.claude/settings.json`, in the same array entry as `session-prime.js` and
`worktree-guard.sh`, same 3-second timeout convention.

**REQ-003 (worktree coverage re-verification).** Re-ran (not just carried over from spec-time)
`git -C .worktrees/0001-mcp-front-proxy rev-parse --git-path hooks` from inside that real
worktree checkout. Output: `.../Public/.git/hooks` — confirming the worktree still resolves
to this checkout's shared hooks directory, not a per-worktree copy. Cross-checked by listing
that resolved path from inside the worktree and confirming all four newly-installed hook
symlinks are visible there too.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.git/hooks/post-merge` | Created (symlink) | REQ-001 |
| `.git/hooks/post-rewrite` | Created (symlink) | REQ-001 |
| `.opencode/bin/check-git-hooks.sh` | Created (46 lines) | REQ-002 |
| `.claude/settings.json` | Modified (added 1 SessionStart entry) | REQ-002 wiring |
| `.opencode/scripts/install-git-hooks.sh` | Modified (added 2-line worktree-sharing note to success output) | REQ-003, optional |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Followed `plan.md`'s three phases exactly: (1) ran the installer directly against this
checkout — mechanical, zero design decisions; (2) authored `check-git-hooks.sh` by reading
`worktree-guard.sh` end to end first and mirroring its exact non-fatal pattern (env-var
silence flag, `set -euo pipefail`, always `exit 0`); (3) re-verified worktree hook sharing
from inside a real `.worktrees/*` checkout rather than trusting the spec-time claim.

**Testing approach for T012 (drift-marker firing):** rather than running real commits/merges/
rebases against this actual repo (the task's own constraint: no git commit/push against this
checkout beyond hook installation itself), all four hook bodies were tested using unmodified
copies in three disposable scratch git repos under the session scratchpad
(`hooks-smoke-test*`, deleted after use). This is safer and, as it turned out, load-bearing —
see the finding below, which the scratch-repo approach is what surfaced.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guard is warn-only, not auto-reinstalling | Per spec.md's own recommendation; mirrors `worktree-guard.sh`'s precedent; zero blast radius — no session start ever mutates `.git/hooks/` or git config |
| Defer the `core.hooksPath`-direct alternative | Per plan.md's reasoning, unchanged by implementation: retires a working installer for marginal benefit, doesn't close the fresh-clone gap by itself either |
| check-git-hooks.sh checks symlink presence only, not hooksPath resolution | Matches REQ-002's literal acceptance criteria exactly; extending it is flagged below as a new, separate finding rather than silently expanded in-flight |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:finding -->
## Significant Finding: spec.md's `core.hooksPath` Claim Needed Correction

`spec.md`'s Problem Statement and Out-of-Scope sections both characterize this checkout's
local `core.hooksPath = <repo>/.git/hooks` override in `.git/config` as **"harmless... points
at git's own default location... it changes nothing, it just happens to already be set."**

**That characterization is factually incorrect on this operator's machine, confirmed
empirically during T012's scratch-repo testing:**

1. This machine has a **global** `core.hooksPath` override in `~/.gitconfig`:
   `core.hookspath=/Users/michelkerkmeester/.config/git/hooks` — an empty directory.
2. A brand-new scratch git repo (no local override, i.e. exactly the "fresh clone" scenario
   spec.md describes) inherited this global override. Hooks were correctly symlinked into
   its `.git/hooks/` by `install-git-hooks.sh`, but `git commit --amend` produced **no**
   drift-marker write — confirmed via `GIT_TRACE=1`, direct hook-script invocation with git's
   exact argv/stdin contract (which worked), and `git config --get core.hooksPath` (which
   resolved to the empty global directory, not the repo's own `.git/hooks/`).
3. Setting the same local override this real checkout already has
   (`git config --local core.hooksPath <repo>/.git/hooks`) in the scratch repo immediately
   fixed it: `commit --amend`, `merge`, and `rebase` all then correctly wrote the drift
   marker via `post-commit`/`post-merge`/`post-rewrite`.

**What this means:** the local override is not redundant — it is the specific thing making
hooks fire at all in this checkout, because it counteracts a conflicting global override this
operator's machine happens to have. Since `.git/config` is never version-controlled (spec.md's
own correct observation), a genuinely fresh clone on **this same machine** would need that
local override re-set, not just the installer re-run — `install-git-hooks.sh` only symlinks
hook files, it does not touch `core.hooksPath` at all. `check-git-hooks.sh` as scoped by
REQ-002 would not catch this: it only checks whether `.git/hooks/<name>` is a symlink, which
would still be true even when a conflicting hooksPath override makes those symlinks inert.

**Disposition:** this does not block REQ-001/002/003 as scoped — all three are satisfied in
this checkout today (the local override already exists here, confirmed via
`git config --local --get core.hooksPath` before any change was made). Flagged here per the
task's "stop and flag clearly" instruction as a corrected fact plus a real, narrow latent gap
for a possible future follow-up (extending `check-git-hooks.sh` to also assert
`git config --get core.hooksPath` resolves to `.git/hooks`), not acted on unilaterally since
it is outside REQ-002's literal, approved acceptance criteria.
<!-- /ANCHOR:finding -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.git/hooks/` lists all four hooks as symlinks | PASS — `pre-commit`, `post-commit`, `post-merge`, `post-rewrite` all confirmed via `ls -la .git/hooks/` |
| `check-git-hooks.sh` silent when all hooks present | PASS — exit 0, no output |
| `check-git-hooks.sh` warns on one missing hook | PASS — deleted `post-merge`, ran the script, got exactly one line: `[check-git-hooks] Missing git hook symlink(s): post-merge. Fix: bash .opencode/scripts/install-git-hooks.sh (silence: SPECKIT_GIT_HOOKS_GUARD=off)`, exit 0 |
| `check-git-hooks.sh` silent when restored | PASS — re-ran installer, re-ran guard, no output |
| `SPECKIT_GIT_HOOKS_GUARD=off` silences a real missing-hook state | PASS — no output with the flag set and `post-merge` deliberately missing |
| Worktree hook-path re-verification (REQ-003) | PASS — from inside `.worktrees/0001-mcp-front-proxy`: `git rev-parse --git-path hooks` → `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/hooks`; all four hooks visible there |
| Drift-marker firing: empty commit | PASS (scratch repo) — `git commit --allow-empty` produced no marker write (no `.opencode/specs` rename/delete diff — correct, matches installer's own printed expectation) |
| Drift-marker firing: amend | PASS (scratch repo, with the local hooksPath override matching this checkout's own config) — deleting a spec file and amending wrote the marker via `post-commit`/`post-rewrite` |
| Drift-marker firing: merge | PASS (scratch repo) — merging a branch that deleted a spec file wrote the marker via `post-merge` |
| Drift-marker firing: rebase | PASS (scratch repo) — rebasing a branch that deleted a spec file wrote the marker via `post-commit` (during replay) and `post-rewrite` (confirmed independently via direct invocation with git's exact `rebase` argv/stdin contract) |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/018-git-hooks-reinstall-and-guard --strict` | PASS, Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`check-git-hooks.sh` verifies symlink presence, not `core.hooksPath` resolution.** As
   documented in the Significant Finding above, a machine with a conflicting global
   `core.hooksPath` override would pass this guard silently while hooks never actually fire.
   This is a real, narrow gap outside REQ-002's literal acceptance criteria — not fixed here,
   flagged for a possible future follow-up.
2. **Fresh clones on a machine with a conflicting global `core.hooksPath` remain unprotected
   even after REQ-001 and REQ-002 both ship**, because neither the installer nor the guard
   touches `core.hooksPath` itself. This is a stronger version of the limitation spec.md
   already named ("a fresh clone still needs one bootstrap action") — the bootstrap action
   needed can be two things (install + possibly a local hooksPath override), not always one,
   depending on the clone's machine.
3. **`install-git-hooks.sh` also symlinks `README.md` into `.git/hooks/README.md`.**
   Pre-existing behavior of the unmodified installer (it iterates every regular file in the
   source directory, and `README.md` is one). Harmless — git only invokes hooks by reserved
   name — but noted here since it was observed during REQ-001's execution and is not
   mentioned in spec.md.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

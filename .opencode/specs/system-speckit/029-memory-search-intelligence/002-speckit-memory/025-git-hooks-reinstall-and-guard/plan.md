---
title: "Implementation Plan: Git Hooks Reinstall and Presence Guard"
description: "Run the existing installer once (P0), then add a small SessionStart guard modeled on worktree-guard.sh's own warn-only pattern (P1), and re-confirm worktree hook coverage at implementation time rather than re-engineering it."
trigger_phrases:
  - "git hooks reinstall plan"
  - "check-git-hooks guard script"
  - "SessionStart hook wiring plan"
  - "hooksPath deferred alternative"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/025-git-hooks-reinstall-and-guard"
    last_updated_at: "2026-07-09T20:22:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed all three phases: reinstall, guard authoring+wiring+tests, worktree re-verification"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/scripts/install-git-hooks.sh"
      - ".opencode/bin/worktree-guard.sh"
      - ".opencode/bin/check-git-hooks.sh"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-018-git-hooks-reinstall-and-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Git Hooks Reinstall and Presence Guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (git hooks + a new SessionStart guard script) |
| **Runtime surface** | Claude Code's `SessionStart` hook chain (`.claude/settings.json`) plus git's own `core.hooksPath` / git-common-dir sharing across linked worktrees |
| **Storage** | N/A — no database or daemon state involved |
| **Testing** | Manual symlink-presence assertions, a scripted delete/restart guard test, and a real `git merge` / `git commit --amend` smoke test confirming the drift-marker hooks actually fire |

### Overview
Three small, independently low-risk fixes land together: (1) mechanically run the installer this
checkout is already missing two hooks from; (2) add one new guard script wired into the existing
SessionStart chain, built directly on `worktree-guard.sh`'s already-proven non-fatal warn pattern
rather than inventing a new one; (3) re-confirm — not re-engineer — that git's git-common-dir
sharing already gives every `.worktrees/*` checkout the same hook coverage as the main checkout,
and write that confirmation down where the next session can find it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and backed by direct inspection (see `spec.md`)
- [x] Success criteria measurable
- [x] No dependency on another 028 child before this phase can start

### Definition of Done
- [x] REQ-001: installer run, all four hooks symlinked, a real merge/rebase writes the drift marker
- [x] REQ-002: `check-git-hooks.sh` authored, wired into `.claude/settings.json`, delete/restart test passes
- [x] REQ-003: worktree coverage re-verified at implementation time and recorded in `implementation-summary.md`
- [x] `validate.sh --strict` clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Git's `core.hooksPath` (already correctly resolving to the shared `.git/hooks` via `.git/config`,
confirmed at spec time) plus `.opencode/scripts/git-hooks/*` as the versioned source of truth,
installed today via one-time symlinks (`install-git-hooks.sh`). Presence is verified at every
session start the same way `worktree-guard.sh` already verifies worktree isolation: a fast,
non-fatal, warn-and-exit-0 check wired into the same `SessionStart` array.

### Key Components
- **`install-git-hooks.sh`** (existing, unmodified except REQ-003's optional one-line message) —
  the installer REQ-001 runs against this checkout.
- **`.opencode/scripts/git-hooks/{pre-commit,post-commit,post-merge,post-rewrite}`** (existing,
  unmodified) — the versioned hook bodies; this phase does not touch their logic.
- **`.opencode/bin/check-git-hooks.sh`** (new) — the SessionStart presence guard, REQ-002.
- **`.claude/settings.json`**'s `SessionStart` array (existing, gains one entry) — currently runs
  `session-prime.js` then `worktree-guard.sh`; the new guard is appended as a third command.

### Data Flow
SessionStart fires `session-prime.js`, `worktree-guard.sh`, and (new) `check-git-hooks.sh` in
sequence. The guard lists the expected hook set by reading `.opencode/scripts/git-hooks/`
(excluding `lib/` and `README.md`), stats each `.git/hooks/<name>` for symlink-ness, and prints one
warning line per missing/broken entry — never more than that, never a hard failure.

### Considered-and-deferred alternative
Point `core.hooksPath` directly at `.opencode/scripts/git-hooks/`, retiring the symlink-install
step entirely so any future new hook file takes effect with zero install step. This is a real,
simpler-sounding option — but it is deferred this phase for two concrete reasons: (1) it retires a
working installer (`install-git-hooks.sh`, with its existing non-symlink-target safety check) for
marginal benefit over the guard-script approach below; (2) it does not, by itself, close the
fresh-clone gap either — a fresh clone still needs exactly one bootstrap action to set
`core.hooksPath` in the first place, the same as it needs one bootstrap run of the installer today.
REQ-002's SessionStart guard is the piece that actually closes the "silently zero-protection"
gap, and it works the same way regardless of which install strategy sits underneath it. If the
symlink model ever becomes a maintenance burden (e.g. hooks change often enough that forgetting to
re-run the installer becomes a recurring nuisance even with the guard in place), the
`core.hooksPath`-direct approach is the natural follow-up — not required to close today's gap.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reinstall (REQ-001 — P0, mechanical, no decision needed)
1. Run `bash .opencode/scripts/install-git-hooks.sh` from the repo root.
2. Confirm `ls -la .git/hooks/` shows `post-merge` and `post-rewrite` as new symlinks alongside the
   already-present `pre-commit`/`post-commit` pair.
3. Smoke-test: `git commit --allow-empty -m "hook smoke"` (per the installer's own printed
   instruction) should run silently unless drift is detected.

### Phase 2: Guard (REQ-002 — P1, new script + wiring)
1. Author `.opencode/bin/check-git-hooks.sh`, structurally mirroring `worktree-guard.sh`:
   `set -euo pipefail`; an env-var early-exit (`SPECKIT_GIT_HOOKS_GUARD=off`); resolve the repo
   root via `git rev-parse --show-toplevel`; list the expected hook names from
   `.opencode/scripts/git-hooks/` (excluding `lib/` and `README.md`); for each, check
   `.git/hooks/<name>` exists and is a symlink; print one warning line naming every missing/broken
   hook plus the fix command (`bash .opencode/scripts/install-git-hooks.sh`); always `exit 0`.
2. Add the new script as a third `SessionStart` hook command in `.claude/settings.json`, in the
   same array `session-prime.js` and `worktree-guard.sh` already occupy, with the same timeout
   convention (3s) those two entries use.
3. Test: delete one hook symlink, start a new session, confirm exactly one warning line naming
   that hook appears on stderr; re-run the installer, start a new session, confirm no warning.
4. Test: set `SPECKIT_GIT_HOOKS_GUARD=off`, delete a hook symlink, start a new session, confirm no
   warning (silence flag honored).

### Phase 3: Verify & document (REQ-003 — P1)
1. From inside a real `.worktrees/*` checkout, re-run
   `git -C .worktrees/<any>/ rev-parse --git-path hooks` and confirm it still resolves to this
   checkout's shared `.git/hooks` (re-confirming, not re-deriving, the spec-time finding).
2. Optionally append a one-line note to `install-git-hooks.sh`'s success output stating that hooks
   are shared across all linked worktrees, so a future operator does not re-run the installer per
   worktree unnecessarily (REQ-003, optional file-change row in `spec.md` § Files to Change).
3. Record REQ-003's re-verification result, the guard test outcomes, and `validate.sh --strict`'s
   result in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Hook symlink presence after install | `ls -la .git/hooks/` |
| Manual | Guard fires on a deliberately broken hook, silent when hooks are intact | Delete one symlink, start a session, restore, start a session |
| Manual | Silence flag honored | `SPECKIT_GIT_HOOKS_GUARD=off` + a broken hook + a session start |
| Manual | Drift-marker hooks actually fire post-install | `git commit --amend` / a scripted merge; inspect the marker `lib/memory-drift-marker.sh` writes |
| Manual | Worktree coverage re-confirmed | `git -C .worktrees/<any>/ rev-parse --git-path hooks` from inside a real worktree |

No new automated-test surface is added — this is bash tooling wiring around git/SessionStart, not
application code inside `mcp_server`'s vitest suite. The hook bodies' own logic (already covered by
whatever tests `011`/`013`/`014` added) is unmodified by this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| None on other 028 children | N/A | N/A | This phase is self-contained; `depends_on: []` in `graph-metadata.json` |
| `worktree-guard.sh`'s existing pattern (reference implementation for REQ-002) | Internal, informational | Green (already shipped, 41 lines, well-understood) | If its pattern ever changes shape, REQ-002's guard should be re-aligned to match, but this phase does not modify `worktree-guard.sh` itself |
| `.claude/settings.json`'s `SessionStart` array (write target for REQ-002) | Internal | Green (already exists, two entries today) | If the array's shape changes concurrently, REQ-002's wiring step needs a rebase, not a redesign |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the new SessionStart guard adds noticeable latency, produces a false-positive
  warning, or the operator otherwise wants to back it out.
- **Procedure**:
  1. Guard script: remove its entry from `.claude/settings.json`'s `SessionStart` array, or set
     `SPECKIT_GIT_HOOKS_GUARD=off` for an immediate silence without a code change; delete
     `.opencode/bin/check-git-hooks.sh` for a full revert. No state to clean up — the script is
     stateless and read-only against `.git/hooks/`.
  2. Hook symlinks: `bash .opencode/scripts/install-git-hooks.sh --uninstall` removes exactly the
     symlinks the installer created, leaving any pre-existing non-symlink hook untouched (existing
     installer behavior, unchanged by this phase).
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

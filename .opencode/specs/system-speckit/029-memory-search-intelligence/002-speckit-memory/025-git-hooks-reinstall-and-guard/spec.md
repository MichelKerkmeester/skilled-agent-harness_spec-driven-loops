---
title: "Feature Specification: Git Hooks Reinstall and Presence Guard [template:level_1/spec.md]"
description: "This checkout's .git/hooks/ only has pre-commit and post-commit symlinked (installed May); post-merge and post-rewrite -- added by the self-healing work this session -- are not installed, so merges and rebases write zero drift-marker signal, and nothing auto-installs hooks for a fresh clone or new worktree."
trigger_phrases:
  - "git hooks reinstall"
  - "post-merge post-rewrite missing"
  - "git hooks presence guard"
  - "hooksPath versioned directory"
  - "worktree git hooks coverage"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/025-git-hooks-reinstall-and-guard"
    last_updated_at: "2026-07-09T20:22:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented REQ-001/002/003, verified via scratch-repo hook tests"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/scripts/install-git-hooks.sh"
      - ".opencode/scripts/git-hooks/post-merge"
      - ".opencode/scripts/git-hooks/post-rewrite"
      - ".opencode/bin/worktree-guard.sh"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-018-git-hooks-reinstall-and-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the SessionStart guard auto-reinstall missing hooks, or warn-only like worktree-guard.sh? Shipped warn-only per this spec's own recommendation."
    answered_questions:
      - "Warn-only vs auto-reinstall: shipped warn-only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Git Hooks Reinstall and Presence Guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `018-git-hooks-reinstall-and-guard` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../024-sleeptime-consolidation/spec.md |
| **Successor** | ../026-eval-harness-extension/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**Direct inspection of this checkout's `.git/hooks/` confirms the gap.** `ls -la .git/hooks/`
shows exactly two symlinks, both dated May 23: `post-commit -> .opencode/scripts/git-hooks/post-commit`
and `pre-commit -> .opencode/scripts/git-hooks/pre-commit`. The versioned source directory,
`.opencode/scripts/git-hooks/`, ships four hook bodies today: `pre-commit`, `post-commit`,
`post-merge`, and `post-rewrite` — the latter two added by this session's self-healing work and
never installed into this checkout. Both write the same advisory memory-index drift marker
(`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`, sourced by both scripts) that
`011-automatic-drift-self-healing` and `013-drift-marker-pipeline-resilience` built and
`014-self-healing-internals-hardening` hardened — but only `post-commit` currently fires it.
Merges and rebases are the highest-drift git events (they can rename, delete, or bulk-move spec
folders in one step), and right now this checkout writes **zero** drift-marker signal for either
one: a `git merge` or `git rebase` here today produces no marker at all, silently defeating the
Layer-2 self-healing protection those three phases shipped.

**Nothing auto-installs the hooks.** `package.json` has no `postinstall`/`prepare` script
referencing `install-git-hooks.sh`, and no shell profile or CI step was found invoking it either.
`.claude/settings.json:50`'s `SessionStart` array already runs two hook commands on every
session — `session-prime.js` and `.opencode/bin/worktree-guard.sh` — but neither performs a
git-hooks presence check (confirmed by reading both: `session-prime.ts`, 447 lines, and
`worktree-guard.sh`, 41 lines — neither references `git-hooks`, `hooksPath`, `post-merge`, or
`post-rewrite`). A fresh clone, or a new git worktree created before the installer is remembered,
silently gets zero Layer-2 protection with no signal that anything is missing.

**This checkout's `.git/hooks/` is already shared across every `.worktrees/*` checkout — a fix
here already covers all 16 of them.** This repo runs `.worktrees/0001-mcp-front-proxy/` through
`.worktrees/0025-028-renumber/` (16 directories) as linked git worktrees. Verified directly:
`git -C .worktrees/0001-mcp-front-proxy rev-parse --git-path hooks` resolves to this checkout's
own `.git/hooks` (not a per-worktree copy), because git hooks live in the git-common-dir, not the
per-worktree gitdir, unless `core.hooksPath` is overridden with a worktree-local value — and this
repo's `core.hooksPath` is set once in the shared `.git/config`
(`hooksPath = <repo>/.git/hooks`, confirmed via `git config --local --get core.hooksPath`), so
every worktree inherits it. That override is functionally identical to git's own default hooks
location — it changes nothing, it just happens to already be set — and it is not managed by any
script in this repo (no `hooksPath` reference exists under `.opencode/scripts/` or
`.opencode/skills/system-spec-kit/`). The real remaining gap is not per-worktree coverage; it is
that `.git/config` itself is never checked into version control, so a genuinely fresh clone starts
with no `hooksPath` override and no installed hooks at all until someone remembers to run the
installer once.

### Purpose
Restore full hook coverage in this checkout immediately, and add a self-check so this specific
gap — hooks quietly falling behind the versioned source, with no signal until someone notices a
merge wrote no drift marker — cannot recur silently. The fix must not re-litigate worktree
coverage (already correct today, confirmed above); it must close the fresh-clone / forgotten-step
gap and make the two-hooks-missing state visible next time it happens.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **REQ-001 (P0, mechanical):** Run the existing installer against this checkout so
  `post-merge`/`post-rewrite` join the already-installed `pre-commit`/`post-commit` pair.
- **REQ-002 (P1, new small guard script):** A SessionStart-wired, non-fatal presence check —
  modeled directly on the existing `worktree-guard.sh` pattern (warn to stderr, always exit 0,
  one env-var silence flag) — that detects when a versioned hook under
  `.opencode/scripts/git-hooks/` has no matching symlink under `.git/hooks/`, and names exactly
  which one(s) are missing plus the fix command.
- **REQ-003 (P1, documentation + one verification run):** Record the already-confirmed worktree
  sharing behavior (see Problem Statement) as a durable finding, and re-verify it once from inside
  a real `.worktrees/*` checkout as part of this phase's own verification pass, so the claim is
  re-confirmed at implementation time, not just carried over from this planning pass.

### Out of Scope
- Any change to the hook bodies' own logic (`post-merge`, `post-rewrite`, `pre-commit`,
  `post-commit`, or `lib/memory-drift-marker.sh`) — that behavior is owned by
  `011-automatic-drift-self-healing`, `013-drift-marker-pipeline-resilience`, and
  `014-self-healing-internals-hardening`; this phase only restores and guards *installation*, not
  hook content.
- Retiring the symlink-install model in favor of pointing `core.hooksPath` directly at
  `.opencode/scripts/git-hooks/` (the "always current, no install step" alternative named in this
  packet's own trigger). Considered and deferred — see `plan.md` § Architecture — because it
  retires a working installer for marginal benefit and does not, by itself, close the fresh-clone
  gap either (a fresh clone still needs one bootstrap action to set `core.hooksPath` in the first
  place). REQ-002's SessionStart guard is the mechanism that actually closes that gap regardless
  of which install strategy is used underneath.
- Removing the pre-existing, redundant `core.hooksPath` override already sitting in `.git/config`
  — it is harmless (points at git's own default location) and removing it has no functional
  benefit; flagged as a documented non-requirement, not left as a silent unknown.
- CI/hosted-runner hook installation — this repo's git hooks are a local-checkout convenience
  layer (advisory, best-effort, bypassable via env vars); no CI pipeline was found invoking them,
  and adding one is a separate concern from restoring local coverage.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.git/hooks/post-merge` | Create (symlink) | REQ-001: installed by running `install-git-hooks.sh` against this checkout |
| `.git/hooks/post-rewrite` | Create (symlink) | REQ-001: same |
| `.opencode/bin/check-git-hooks.sh` (new) | Create | REQ-002: SessionStart presence guard, modeled on `worktree-guard.sh` |
| `.claude/settings.json` | Modify | REQ-002: add the new guard as a third `SessionStart` hook command alongside `session-prime.js` and `worktree-guard.sh` |
| `.opencode/scripts/install-git-hooks.sh` | Modify (optional, minor) | REQ-003: append a one-line success-message note that hooks are shared across all linked worktrees, so the installer does not need to be re-run per worktree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `bash .opencode/scripts/install-git-hooks.sh` SHALL be run against this checkout so `.git/hooks/post-merge` and `.git/hooks/post-rewrite` exist as symlinks to their `.opencode/scripts/git-hooks/` counterparts, matching the already-installed `pre-commit`/`post-commit` pair. | `ls -la .git/hooks/` shows all four hook names as symlinks (`->`) resolving into `.opencode/scripts/git-hooks/`; a `git merge` or `git commit --amend` in this checkout produces a memory-index drift marker write (or a no-op skip logged by `lib/memory-drift-marker.sh`), where today it produces neither. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A new SessionStart-wired guard script SHALL detect any versioned hook name under `.opencode/scripts/git-hooks/` (excluding `lib/` and `README.md`) that has no matching symlink under `.git/hooks/`, and print exactly one non-fatal warning naming the missing hook(s) and the fix command; it MUST always exit 0 and MUST NOT block the session. | Deleting one hook symlink and starting a new session produces one warning line on stderr naming that hook and the installer command; re-running the installer and starting a new session produces no warning; an env var (e.g. `SPECKIT_GIT_HOOKS_GUARD=off`) silences it entirely, mirroring `worktree-guard.sh`'s `SPECKIT_WORKTREE_GUARD=off` contract. |
| REQ-003 | The worktree-sharing finding (see Problem Statement) SHALL be re-verified once from inside a real `.worktrees/*` checkout during this phase's own implementation, and the result recorded in `implementation-summary.md`. | `git -C .worktrees/<any>/ rev-parse --git-path hooks` is re-run at implementation time and its output (the shared main-checkout `.git/hooks` path) is quoted in `implementation-summary.md`, not merely inherited from this spec's planning-time claim. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.git/hooks/` in this checkout lists all four versioned hooks as symlinks, and a
  merge/rebase in this checkout writes the same drift-marker signal a commit already does.
- **SC-002**: A SessionStart guard exists that would have caught today's silent two-hooks-missing
  state on the very next session start, proven by the delete/restart test in REQ-002's acceptance
  criteria.
- **SC-003**: Worktree hook coverage is a re-confirmed, documented fact at implementation time
  (REQ-003), not an inherited assumption from this planning pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new SessionStart guard adds latency to every session start. | Low — a slow guard degrades the operator's session-open experience | Mirror `worktree-guard.sh`'s implementation exactly: a handful of `git`/`ls`-class calls only, no network, no heavy IO; stay well under the existing per-hook 3-second `.claude/settings.json` timeout the same way `worktree-guard.sh` already does |
| Risk | A non-symlink file already occupies a target hook name (e.g. a hand-written custom hook). | Low | Already handled: `install-git-hooks.sh` skips with a warning rather than overwriting a non-symlink target (see script body); REQ-001 inherits that existing safety, it is not new risk introduced by this phase |
| Dependency | None on other 028 children for REQ-001/REQ-002/REQ-003 to land — this phase only restores and guards *installation*, a self-contained fix to the installer/SessionStart wiring. | N/A | `depends_on: []` in `graph-metadata.json` |
| Related (not a dependency) | `011-automatic-drift-self-healing`, `013-drift-marker-pipeline-resilience`, `014-self-healing-internals-hardening` own the drift-marker hook bodies this reinstall restores execution of. | If those phases' hook logic changes shape later, this phase's guard (which only checks symlink presence, not hook content) is unaffected. | No action needed; noted for context only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Warn-only vs auto-reinstall for REQ-002**: this spec recommends warn-only, mirroring
  `worktree-guard.sh`'s existing detect-and-warn precedent (never silently mutate git config or
  `.git/hooks/` on every session start; let the operator run the one-line fix command). Revisit if
  operators find the manual step annoying enough to justify the extra risk surface of an
  auto-reinstalling SessionStart hook.
- Is the pre-existing, redundant `core.hooksPath = <repo>/.git/hooks` override in `.git/config`
  worth removing for cleanliness? It is harmless and undocumented; this phase leaves it in place
  (see Out of Scope) unless a future session decides otherwise.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---
title: "Feature Specification: continuous-integration workflow for sk-git (always-current live branch)"
description: "Add a trunk-following continuous-integration workflow to sk-git so the operator's IDE checkout always reflects every concurrent AI session's committed work: launch-wrapper sessions publish each commit to a shared live branch via a safe fetch → fast-forward-or-rebase-abort → non-force-push primitive, the IDE checkout fast-forward-follows it, and the same autosync fires cross-runtime for claude, codex, and opencode."
trigger_phrases:
  - "continuous integration workflow"
  - "always current live branch"
  - "sk-git autosync"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/001-continuous-integration-workflow"
    last_updated_at: "2026-07-13T15:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scripts, hook, wrapper, and cross-runtime wiring implemented and verified"
    next_safe_action: "Author the sk-git skill docs; run validate.sh --strict; hand off for operator review/merge"
---
# Feature Specification: continuous-integration workflow for sk-git (always-current live branch)

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
| **Created** | 2026-07-13 |
| **Branch** | `wt/0037-sk-git-continuous-integration` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The launch wrapper `worktree-session.sh` isolates every top-level AI session into its own worktree on a dead-end `work/<runtime>/<slug>` branch with isolated MCP databases. That isolation is what makes concurrent multi-session, multi-runtime work safe — but it also makes each session's work **invisible** in the operator's IDE, which is open on the primary checkout. The operator cannot see "what is currently active" without manually inspecting each worktree or branch. Sharing one working tree across sessions is not an option: concurrent uncommitted writers on a single tree corrupt each other.

### Purpose
Give the operator a single **live branch** that their IDE follows and that always reflects every session's committed work within seconds — without giving up per-session worktree isolation or DB isolation. Each launch-wrapper session keeps its isolated worktree (safe writes preserved) but publishes each commit to the shared live branch through a safe primitive; the IDE checkout fast-forward-follows that branch. The publish path fires identically for `claude`, `codex`, and `opencode` sessions. The honest limit is committed-granularity visibility (seconds behind a commit), never another session's un-committed editor buffer.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A publish primitive `git-sync.sh`: `fetch` the live branch, fast-forward-publish when possible, else rebase the session's commits onto it and publish, aborting cleanly on any conflict; non-force push; non-fatal `--auto` (hook) mode.
- An IDE-side follower `git-live-follow.sh`: fast-forward-only, skip-when-dirty auto-pull of the live branch.
- A glance dashboard `worktree-status.sh`: per-worktree branch / ahead / behind / dirty against the live branch.
- Autosync wiring: the shared `post-commit` git hook publishes commits when the launch wrapper has marked the session (env-gated, linked-worktree-only, fully non-fatal).
- Launch-wrapper wiring: `worktree-session.sh` resolves the live branch from the primary checkout, bases the session worktree on it, and exports `SPECKIT_LIVE_BRANCH` + `SPECKIT_AUTOSYNC` so the hook fires.
- Cross-runtime parity: wire the `worktree-guard.sh` + `check-git-hooks.sh` SessionStart guards into `.codex/hooks.json` (Claude and OpenCode already run them).
- sk-git docs: a new `references/continuous_integration.md`, a SKILL.md lifecycle/rule update, and a `finish_workflows.md` sync step.

### Out of Scope
- Real-time sub-commit sharing of un-committed editor buffers (would require a shared filesystem / Live Share and reintroduce the concurrent-writer corruption risk this design avoids).
- Any change to MCP DB isolation, the socket-length workaround, or the child-detection logic in `worktree-session.sh`.
- Any change to the existing code-graph invalidation or memory-drift behavior of the `post-commit` hook (autosync composes with them, it does not replace them).
- Force-push, history rewriting of the live branch, or auto-resolution of another session's conflicting changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/git-sync.sh` | Create | Publish primitive (fetch → FF-or-rebase-abort → non-force push) |
| `.opencode/bin/git-live-follow.sh` | Create | IDE-side FF-only, skip-when-dirty follower |
| `.opencode/bin/worktree-status.sh` | Create | Per-worktree ahead/behind/dirty dashboard |
| `.opencode/scripts/git-hooks/post-commit` | Modify | Env-gated, linked-worktree-only, non-fatal autosync block |
| `.opencode/bin/worktree-session.sh` | Modify | Resolve live branch, base worktree on it, export autosync env |
| `.codex/hooks.json` | Modify | Add the two SessionStart guards Claude/OpenCode already run |
| `.opencode/skills/sk-git/SKILL.md` | Modify | Lifecycle + an ALWAYS rule for the live-branch model |
| `.opencode/skills/sk-git/references/continuous_integration.md` | Create | The model, the scripts, safety contract, opt-out |
| `.opencode/skills/sk-git/references/finish_workflows.md` | Modify | A publish-to-live sync step |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `git-sync.sh` fast-forward-publishes a session's commit to the live branch | Sandbox `TEST A`: commit lands on `origin/live` |
| REQ-002 | `git-sync.sh` rebases onto a moved live branch then publishes | Sandbox `TEST B`: commit rebased atop the concurrent commit |
| REQ-003 | On a rebase conflict `git-sync.sh` aborts, leaves the branch byte-unchanged and unpublished, and never force-pushes | Sandbox `TEST C`: HEAD unchanged, tree clean, `origin/live` unchanged |
| REQ-004 | `--auto` mode never returns non-zero (must not break the triggering commit) | Sandbox `TEST D`: exit 0 on a blocked publish |
| REQ-005 | Autosync fires only for a launch-wrapper session inside a linked worktree, never the primary checkout | `post-commit` gate requires `SPECKIT_AUTOSYNC=1` + `SPECKIT_LIVE_BRANCH` + linked-worktree |
| REQ-006 | The publish path is runtime-agnostic (claude / codex / opencode) | The git hook + wrapper are runtime-independent; wrapper takes the runtime as an argument |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Untracked scratch files do NOT block the rebase-publish path | Sandbox `TEST E`: commit published with an untracked file present |
| REQ-008 | The `post-commit` autosync composes with the existing code-graph + memory-drift behavior | `bash -n` clean; existing early-exits and markers preserved |
| REQ-009 | Codex SessionStart runs the same two guards as Claude/OpenCode | `.codex/hooks.json` SessionStart has 3 hooks; valid JSON |
| REQ-010 | `git-live-follow.sh` is fast-forward-only and never pulls over a dirty tree | Diverged → warn only; dirty → warn only; no reset/merge |
| REQ-011 | The workflow is opt-out per launch (`SPECKIT_AUTOSYNC=0`) and per commit (existing hook bypasses) | Wrapper honors a pre-set `SPECKIT_AUTOSYNC=0` |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `git-sync.sh` sandbox battery passes all publish paths (fast-forward, rebase, conflict-abort, `--auto`-safe, untracked-tolerant).
- **SC-002**: A launch-wrapper session's commit becomes visible on the live branch with no operator action; the primary checkout can fast-forward-follow it.
- **SC-003**: The autosync never fires from the primary checkout and never fails a commit.
- **SC-004**: `.codex/hooks.json` is valid JSON and runs the two guards Claude and OpenCode already run.

### Acceptance Scenarios

- **Scenario 1**: **Given** a launched `claude` session that commits, **when** the live branch has not moved, **then** `git-sync.sh` fast-forward-publishes the commit and the IDE follower fast-forwards to it.
- **Scenario 2**: **Given** two sessions committing concurrently, **when** the second commits after the first published, **then** the second rebases onto the live branch and publishes without a force-push.
- **Scenario 3**: **Given** a session commit that conflicts with the live branch, **when** autosync runs, **then** the rebase aborts, the commit stays local and unpublished, and the operator gets a clear manual-resolution message.
- **Scenario 4**: **Given** a `codex` session start, **when** the session is on the shared checkout or the hooks are not installed, **then** the guard warnings surface exactly as they do for Claude.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Autosync fires from the primary checkout | Would publish/rebase the operator's tree unexpectedly | Triple gate: `SPECKIT_AUTOSYNC=1` + `SPECKIT_LIVE_BRANCH` (wrapper-only) + linked-worktree check; the wrapper never exports these in the primary tree |
| Risk | Rebase in a hook corrupts or strands work | Lost or half-applied commits | Rebase only when tracked files are clean; abort on first conflict restores exact pre-sync state; never `--autostash`; non-force push |
| Risk | Autosync fails the triggering commit | Broken commit flow | `--auto` mode is non-fatal (every early exit is 0) and the hook calls it with `|| true`; `post-commit` exit status is ignored by git |
| Risk | Untracked scratch files wrongly block publish | Autosync silently never publishes | Dirty check is tracked-only (`git diff` / `git diff --cached`), not `git status --porcelain` |
| Dependency | `worktree-guard.sh` + `check-git-hooks.sh` | Cross-runtime guard parity | Already present; only Codex wiring was missing |
| Dependency | The existing `install-git-hooks.sh` symlink of `post-commit` | Autosync only fires if the hook is installed | `check-git-hooks.sh` warns when the symlinks are missing |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Autosync adds one `git fetch` + at most one `git push` per commit; the rebase runs only on divergence and only over the session's own small commit set.

### Security
- **NFR-S01**: No credentials are handled; the push uses the existing remote configuration. Nothing widens repo authority.

### Reliability
- **NFR-R01**: Every failure mode is non-destructive: a blocked publish leaves the commit local, the branch byte-unchanged, and the live branch untouched, with a printed manual-resolution path.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- The primary checkout on a detached HEAD yields no live branch: the wrapper falls back to basing the worktree on `HEAD` and skips exporting the autosync env, so nothing publishes.
- A session that is itself on the live branch is refused (the follower's job, and a self-referential push).

### Error Scenarios
- A push race (the live branch advanced between fetch and push) retries the whole fetch→publish loop a bounded number of times, then reports the commits as pending.
- A dirty tree with tracked-file modifications on a moved live branch refuses the rebase and reports the commits as pending, rather than risk a mid-rebase conflict on uncommitted work.

### Concurrent Operations
- Multiple sessions publish to the same live branch; each fast-forwards or rebases onto the others' work. No force-push means no session can clobber another's published commits.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three new scripts, one hook edit, one wrapper edit, one runtime-config edit, three doc changes |
| Risk | 16/25 | Behavior-affecting git automation on shared launch infra; mitigated by tight gating + a full sandbox battery |
| Research | 10/20 | Mapped the wrapper, the hook, and all three runtime SessionStart surfaces before changing them |
| **Total** | **40/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The continuous-integrate model, the auto-on-commit trigger, and the cross-runtime requirement are operator-selected; merge to `skilled/v4.0.0.0` awaits operator approval.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->

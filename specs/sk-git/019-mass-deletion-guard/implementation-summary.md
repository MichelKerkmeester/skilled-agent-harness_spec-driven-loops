# Implementation Summary — Mass-Deletion Guard

## Final state

A shared fail-open guard refuses commits (and, where wired, pushes) that remove an
unusually large number of tracked files, unless the operator authorizes that one
operation. It is the durable defense-in-depth against the stale-tree `git add -A`
snapshot that erased 902 tracked files on 2026-08-13, and against runaway-agent
mass deletions like the 44-file 2026-05-04 incident.

## What shipped

| File | Change |
|---|---|
| `.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh` | New shared lib: `mass_deletion_staged_count`, `mass_deletion_range_count`, `mass_deletion_verdict`, `mass_deletion_report`. Fail-open under `set -euo pipefail`. |
| `.opencode/scripts/git-hooks/pre-commit` | Sources the lib after `REPO_ROOT`; blocks a staged deletion count over the ceiling (runs first). **Primary defense.** |
| `.opencode/scripts/git-hooks/pre-push` | Sources the lib; "Gate 0" per-ref deletion check before the release-branch skip; captures `local_sha`. **Backstop (see constraint).** |
| `.opencode/scripts/git-hooks/tests/mass-deletion-guard.test.sh` | New tracked test: 8 verdict-logic + 4 real-commit integration cases. |

## Configuration

- `SPECKIT_MASS_DELETION_THRESHOLD` — ceiling (default 100).
- `SPECKIT_ALLOW_MASS_DELETION=1` — authorize one blocked operation.
- Audit log: `<git-dir>/mass-deletion-guard.log`.

## Validation evidence (confirmed)

- `bash .opencode/scripts/git-hooks/tests/mass-deletion-guard.test.sh` → **12 passed, 0 failed** (exit 0).
- `bash -n` clean on all three touched hook files.
- The effective machine hooks path (`~/.config/git/hooks/pre-commit`, `core.hooksPath`) symlinks to the edited `.opencode/scripts/git-hooks/pre-commit`; `grep` confirmed it contains the `mass-deletion-guard.sh` gate — so the commit guard fires on this repo. (inferred-then-confirmed: guard logic proven in isolation; wiring proven by symlink+grep.)

## Constraint / known gap

`core.hooksPath` on this machine is `~/.config/git/hooks`, which symlinks the
repo's `pre-commit` but not `pre-push`. The pre-push backstop is therefore
**dormant here**; wiring `pre-push` into that dir would also activate the repo's
currently-dormant naming/permission gates and could disrupt in-flight worktree
pushes, so it was intentionally not wired. The push-side code ships ready.

## Context

Root-caused from the 2026-08-13 clobber investigation: an external orchestrator
(jcode / Superset desktop) ran the destructive `add -A` sync; both tools were
removed separately. This guard is the repo-side insurance so a future stale-tree
snapshot from any tool that respects git hooks cannot silently destroy branch state.

_memory.continuity:
  status: complete
  last_action: "Built + tested mass-deletion guard (pre-commit live, pre-push ready); 12/12 tests pass"
  next_steps: "Optional: wire pre-push into ~/.config/git/hooks if the naming/permission gate activation is acceptable"
  blockers: none

# Plan — Mass-Deletion Guard

## Approach

Add one shared, fail-open bash lib and wire it into the existing hook chain,
matching the repo's established pattern (shared `lib/`, blocking gates with an
env bypass, fail-open on missing/broken dependencies).

## Design

- **`lib/mass-deletion-guard.sh`** — pure helpers, no side effects, no `exit`:
  - `mass_deletion_staged_count` — staged deletions (`git diff --cached --diff-filter=D`).
  - `mass_deletion_range_count <base> <tip>` — deletions a push range introduces.
  - `mass_deletion_verdict <n>` — returns 0 allow / 1 block; fail-open on
    non-numeric; honors threshold + `SPECKIT_ALLOW_MASS_DELETION`.
  - `mass_deletion_report <mode> <n> [detail]` — stderr guidance + audit log.
  - Every command substitution guarded so the lib is safe when sourced under
    `set -euo pipefail`.

- **pre-commit** — source the lib right after `REPO_ROOT` resolves and gate on the
  staged deletion count first (cheapest, most catastrophic thing to catch). This
  is the primary defense: the clobber vector is a commit.

- **pre-push** — source the lib; add "Gate 0" at the top of the per-ref loop,
  before the release-branch skip, capturing `local_sha` (previously discarded).
  Update-only (a new branch has no prior remote state). Backstop.

## Why a threshold of 100

Real destructive events here were 902 and 44 files; normal commits rarely delete
near 100. 100 catches the catastrophic while effectively never firing on ordinary
work. Fully tunable per-operation for the rare legitimate large deletion.

## Verification

- Tracked test `tests/mass-deletion-guard.test.sh`: 8 verdict-logic cases
  (threshold, override, custom threshold, fail-open) + 4 real-commit integration
  cases in an isolated repo.
- Confirm the effective `core.hooksPath` `pre-commit` resolves to the edited
  source (so the gate actually fires on the real repo).

## Risk / blast radius

Every commit runs the gate. Mitigated: only net deletions >100 block, adds/mods
never block, fail-open on any error, per-invocation override. Reversible: revert
the two hook edits; the lib and test are additive.

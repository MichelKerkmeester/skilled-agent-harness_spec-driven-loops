# Checklist — Mass-Deletion Guard

## Functional (proven by `tests/mass-deletion-guard.test.sh`, 12/12 pass)

- [x] Commit deleting >100 tracked files is blocked. — integration: delete-130 blocked
- [x] Same delete with `SPECKIT_ALLOW_MASS_DELETION=1` succeeds. — override allows delete-130
- [x] Commit deleting ≤100 files is allowed. — delete-40 allowed
- [x] Adds/mods of any count are never blocked. — add-160 allowed
- [x] Custom `SPECKIT_MASS_DELETION_THRESHOLD` is honored. — custom threshold blocks 11
- [x] Empty / non-numeric count fails open (allows). — verdict fails open
- [x] Bad threshold value defaults to 100. — bad threshold allows 50

## Robustness

- [x] `bash -n` clean on lib, pre-commit, pre-push.
- [x] Lib is fail-open under `set -euo pipefail` (guarded substitutions).
- [x] Missing lib → gate skipped, commit/push proceeds (fail-open by `[ -f ]` / `command -v`).

## Wiring

- [x] Effective `core.hooksPath` `pre-commit` symlink → edited source contains the gate (grep-confirmed).
- [x] Constraint recorded: `pre-push` absent from `~/.config/git/hooks`, left unwired by design.

## Hygiene

- [x] No ephemeral-artifact pointers in code comments (durable WHY only).
- [x] Changes additive except two scoped hook edits; reversible.

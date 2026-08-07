# Phase 005 dispositions — three applied, two refuted, three routed on

## Applied

| Finding | Change |
|---------|--------|
| `fanout:SOL-09` | `.scan-one.sh` resolved one workstation's absolute paths; now derives `REPO_ROOT` from its own location |
| `devin-04:F7` | `karabiner.json` untracked and ignored, left on disk so the operator keeps their shortcuts |
| `devin-01:F13` | sk-doc SKILL.md layout block now lists the `feature-catalog/` directory that exists at the hub root |

## RF-005-1 — `devin-01:F18` the sk-git changelog claim is ambiguous, not false

**Claim**: the changelog documents `.github/workflows/` and `.github/hooks/scripts/` READMEs that do
not exist under sk-git.

**Why it is wrong**: `.opencode/skills/sk-git/.github` indeed does not exist, but the READMEs the
changelog describes do exist — at the repository root `.github/hooks/scripts/README.md`. The entry
records real work and is imprecise about location, which makes it a wording fix, not a false record.
Routed to phase 006 as documentation drift.

## RF-005-2 — `devin-05:F3` renaming archived run-labels violates the archive contract

**Claim**: sk-design `benchmark/after-*` run-labels use `report.json`/`report.md` instead of the
storage-standard names.

**Why it is wrong**: benchmark archives in this repository are governed by an additive,
never-overwritten, never-repurposed contract — established in phase 002 from the sk-doc README and
reconfirmed in phase 004. Renaming a shipped run-label is precisely what that contract forbids. The
naming standard applies to new runs; retrofitting it onto archived evidence rewrites history.

This is the third phase in which the same archive contract has stopped a proposed change.

## Routed onward

| Finding | Destination | Why |
|---------|-------------|-----|
| `devin-03:F9` | 006 | `.opencode/commands/create/assets/tests/` exists; `test_emitted_name_contract.py` has zero references anywhere. Real gap, but wiring a runner versus removing the test is a decision, not a cleanup |
| `devin-03:F10` | 006 | `.opencode/commands/doctor/scripts/tests/` exists; its `.test.cjs` is only self-referenced. Same shape |
| `fanout:SOL-06` | 007 | Generated compiled-routing preserves phase-numbered topology; belongs with the contract-drift phase, not a file-placement pass |

Both routed test findings carried the false-refutation text from the triage worklist parser defect.
Their dispositions were corrected in that phase; the note text was not, and is corrected here.

## Systemic issue found while verifying SOL-09

`SOL-09` names one script, but **319 committed non-spec files contain the string
`/Users/michelkerkmeester`**. Many are benchmark reports that legitimately record run-time paths, so
the number overstates the defect — but it is far larger than one script and deserves a scoped audit
of its own rather than silent expansion of this phase.

**Verify**: `rg -l '/Users/michelkerkmeester' --glob '!node_modules' --glob '!*/specs/*' --glob '!.worktrees/**' --glob '!*.log' . | wc -l`

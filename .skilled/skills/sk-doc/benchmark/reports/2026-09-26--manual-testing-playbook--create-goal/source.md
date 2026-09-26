# Source: sk-create-goal manual testing playbook run, 2026-09-26

This file names what the run executed against and where its raw evidence lives. Every field
derives from the run records.

## Playbook commit state

The playbook corpus is uncommitted work in this worktree. At run time the repository sat at commit
`1ab166030e` and `git status --porcelain` reported the corpus as untracked:

```
?? .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/
```

No scenario file was modified by the run. The corpus is an input and a run never rewrites it.

## Scenario files

Root document: [`manual-testing-playbook.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md)

| ID | Feature file |
|---|---|
| SCG-001 | [`goal-authoring/top-level-goal.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/top-level-goal.md) |
| SCG-002 | [`goal-authoring/phase-parent-and-nested-child-goals.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/phase-parent-and-nested-child-goals.md) |
| SCG-003 | [`goal-authoring/add-goal-to-packet-without-goal.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/add-goal-to-packet-without-goal.md) |
| SCG-004 | [`goal-authoring/cut-over-budget-parent.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/cut-over-budget-parent.md) |
| SCG-005 | [`goal-authoring/refuse-leftover-placeholder.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md) |
| SCG-006 | [`goal-authoring/detect-unbound-phase.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/detect-unbound-phase.md) |
| SCG-007 | [`goal-authoring/route-session-goal-away.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/route-session-goal-away.md) |
| SCG-008 | [`goal-authoring/resend-parent-after-child-change.md`](../../../../../../.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/resend-parent-after-child-change.md) |

This packet ships no `feature-catalog/`, so no catalog cross-reference exists for any scenario.

## Raw record paths

Raw per-scenario transcripts stay in the spec packet that produced them:

- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-001.md`
- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-002.md`
- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-003.md`
- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-004.md`
- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-005.md`
- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-006.md`
- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-007.md`
- `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-008.md`

Each record carries the exact prompt, every command with its output and exit status, the expected
signals marked observed or not observed, the agent replies verbatim and the scenario verdict. The
`results.csv` in this folder is a one-row-per-scenario index over those records.

## Workspace note

Each scenario ran from the repository root in its own `mktemp -d` workspace under
`/tmp/create-goal-playbook.*`, with a copy of the budget manifest at the same relative path the
preconditions require. Every workspace was removed at its last step and each record confirms the
removal. No scenario read or wrote a real packet and no session state was touched.

# Manual Testing Playbook Run: sk-create-goal, 2026-09-26

One full execution of the `sk-create-goal` manual testing playbook, eight scenarios in one
category, run by one operator in index order. Each scenario ran in its own `mktemp -d` scratch
workspace from the repository root and each workspace was removed at its last step.

## Run metadata

| Field | Value |
|---|---|
| Run label | `2026-09-26--manual-testing-playbook--create-goal` |
| Run date | 2026-09-26 |
| Executor | `llmgateway/mimo-v2.6-pro`, high thinking, via cli-pi |
| Operator | one dispatched `@markdown` worker acting as both agent and orchestrator |
| Playbook | `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/` |
| Run state | uncommitted worktree at commit `1ab166030e` |
| Raw records | `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/` |

## Totals

| Verdict | Count |
|---|---|
| PASS | 8 |
| FAIL | 0 |
| SKIP | 0 |

## Scenario results

| ID | Name | Verdict | Reason | Evidence |
|---|---|---|---|---|
| SCG-001 | Top-level goal | PASS | The check passes 4/4 with zero findings, the report reads `packet_budget=ok` and `packet_nested=false`, the chat slice carries the objective sentence and the criteria count reads 3 | [`SCG-001.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-001.md) |
| SCG-002 | Phase parent and nested child goals | PASS | The binding set equals the folder set by name, one binding anchor sits in the parent and none in the children, all three checks pass and the report fields read as listed | [`SCG-002.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-002.md) |
| SCG-003 | Add goal to a packet without one | PASS | The goal file is absent before the retrofit and present after it with the template marker once, the check passes 4/4 and the report reads `packet_budget=ok` | [`SCG-003.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-003.md) |
| SCG-004 | Cut an over-budget parent | PASS | The readings travel 5325, 5325, 4656, 3876 with N2 at or below the 4000 limit and the final report reads `ok`, the criteria count stays 5 and the final check is green | [`SCG-004.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-004.md) |
| SCG-005 | Refuse a leftover placeholder | PASS | The placeholder check fails on the seeded decision row with the finding `decision table contains unfilled template text` and no chat slice is handed off | [`SCG-005.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-005.md) |
| SCG-006 | Detect an unbound phase | PASS | The binding check fails with one finding naming `002-beta/goal.md` while the phase name still appears in the goal prose. The other three checks stay green | [`SCG-006.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-006.md) |
| SCG-007 | Route a session goal away | PASS | The reply redirects the request to the goal hooks, no goal file and no session state appear. The packet report reads `PACKET_GOAL_NOT_FOUND` | [`SCG-007.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-007.md) |
| SCG-008 | Resend the parent after a child change | PASS | The parent decision is amended before the child goal, the slice hash changes from H1 to H2, the chat slice carries the amended checksum decision and no session state is touched | [`SCG-008.md`](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-008.md) |

## Release verdict

**PASS. The release is acceptable on this run.**

The playbook root's hard rule says a `FAIL` in SCG-001, SCG-002, SCG-005 or SCG-006 forces the
release verdict to `FAIL`, because those scenarios gate the mode's core authoring and checking
behavior. All four passed, so the hard rule does not fire. The root's release readiness rule holds
on all four of its conditions: no verdict is `FAIL`, every critical scenario passed, the run covers
the full eight scenarios named by the root index and no blocking triage item remains open.

## Fields not captured

The run records name every field they did not capture as not recorded. Nothing is filled in from
inference. Those fields are the SCG-008 step 7 `chat_slice`, the SCG-004 step 10, step 12 and
step 14 `chat_slice` and `objective_slice` values and the SCG-008 step 10 `objective_slice` value.
Each named reading those steps exist for was captured in full. See the evidence-completeness notes
in the two records.

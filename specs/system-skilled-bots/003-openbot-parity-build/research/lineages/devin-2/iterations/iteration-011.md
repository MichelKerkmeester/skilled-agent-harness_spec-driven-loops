# Iteration 11: Acceptance criteria and the `[P0]` checklist — does every gate have a runnable check? (angle 1, closure layer)

**Iteration**: 11 of 13
**Focus**: The closure layer. Every phase has a `REQ` table, an `AC` table and a `[P0]` checklist. This pass checked three things: every requirement has an acceptance row, no acceptance row cites a requirement that does not exist, and every `[P0]` checklist row names a check that can actually run.

## Focus

A phase closes on its checklist. A `[P0]` row without a command is a gate nobody can pass or fail, and a `[P0]` row that counts the wrong thing fails a correct build. This pass compared the requirement and acceptance tables mechanically, then read every `[P0]` row for a runnable verify.

## Actions Taken

1. Extracted every `REQ-` id from each `spec.md` and every `REQ-` reference from each `acceptance-criteria.md`, then diffed both directions for all eleven phases.
2. Counted `REQ` rows against `AC` rows per phase.
3. Read every `[P0]` checklist row across all eleven `tasks.md` files.
4. Checked phase 011's four command-less `[P0]` rows.
5. Checked the file-table counts that phases 002 and 009 assert in `CHK-002` (22 and 23).
6. Compared phase 008's `CHK-020` count form to the other phases' form.

## Findings

1. **P1 — Phase 011's four `[P0]` checklist rows have no verify command, so the phase's hard-blocker checklist cannot be run.** `CHK-001`, `CHK-002`, `CHK-020` and `CHK-021` are each a bare statement with no "Verify:" clause [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:154] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:174] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:175], while every other phase's equivalent rows name a command. A `[P0]` row without a command cannot be evidenced, and the completion rule requires evidence per row. **Exact edit**: add a verify to each — `rg -c '^\| REQ-' …/011-messaging-channels/spec.md` prints 19 for CHK-001, the file-table count for CHK-002, `rg -c '\| Unmet \|' …/acceptance-criteria.md` prints 0 for CHK-020, and `cd $RT && npx vitest run tests/channel-conformance.vitest.ts` exits 0 for CHK-021.
2. **P2 — Phases 002 and 009 label `CHK-002` "The plan names every file the change touches" but verify the spec's file table.** The command greps `^\| \`\.skilled` in `spec.md`, not `plan.md` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:158] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/tasks.md:152]. The counts are correct today (22 and 23 rows), but the check proves the spec table, not the plan, so a plan that omits a file passes. **Exact edit**: either relabel the row "The spec's file table names every file the change touches" or point the command at `plan.md`'s file table.
3. **P2 — Phase 008's `CHK-020` counts `Met` rows and expects 13, so an approved waiver fails the gate.** The row reads "Every acceptance criterion is Met. Verify: `rg -c '\| Met \|' …/acceptance-criteria.md` prints 13" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:165]. The other phases count `| Unmet |` and expect 0, which tolerates a waived row; 008's form does not. **Exact edit**: change 008's row to the `| Unmet |` form and expect 0, or count `Met` plus `Waived` and expect 13.

## Ruled Out

- **Treating any requirement as unaccepted.** All eleven phases have one or more `AC` rows per `REQ` and no `AC` row cites a missing `REQ`; the counts are 7/7, 10/10, 15/15, 9/9, 12/12, 11/11, 9/12, 13/13, 10/10, 11/11 and 19/19 (007 has three extra matrix rows, all mapped to existing requirements). The acceptance layer is complete.
- **Treating 002's and 009's asserted file counts as wrong.** Both match the current tables (22 and 23 rows), so the check passes today; the defect is what it proves, not whether it passes.
- **Treating the `[P0]` checklist as decorative.** The rows name real gates elsewhere — typecheck, the full suite, a secret scan and a manual verb run — and nine phases carry a runnable command for each. 011 is the outlier.

## Dead Ends

- A pure `REQ`/`AC` diff cannot find a gate that checks the wrong artifact; that only appears when the `[P0]` row's label is read against its command.

## Edge Cases

- **Ambiguous input**: "the `[P0]` checklist" was read as every row tagged `[P0]` in `tasks.md`, including the `CHK-FIX-*` rows, not only the numbered `CHK-0xx` set.
- **Contradictory evidence**: none.
- **Missing dependencies**: none.
- **Partial success**: the checklist commands were read, not run; running `validate.sh` or the suite would write outside the lineage.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:153, :154, :174, :175
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:158
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/tasks.md:152
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:165
- All eleven `spec.md` `REQ` tables and `acceptance-criteria.md` `AC` tables (mechanical diff)
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 1, acceptance and checklist closure layer
- Questions answered: the acceptance layer is complete in both directions; the checklist layer has one phase with four unrunnable `[P0]` rows and two phases whose `CHK-002` proves the wrong document, plus one count form that rejects a legitimate waiver.

## Reflection

- **What worked and why**: The mechanical `REQ`/`AC` diff is cheap and gives a clean negative result, which is worth as much as a finding: the parallel authors did keep the acceptance tables complete.
- **What did not work and why**: The `[P0]` sweep needed a human read per row because the label and the command can disagree; no script can tell that "the plan" should not be grepped in `spec.md`.
- **What I would do differently**: Extract every checklist row into a table of label, command and expected output before judging any of them.

## Recommended Next Focus

Take the remaining security angle: the run folder and the child environment. Phase 008 promises the value never reaches the run folder; check what the run folder actually holds (prompt, filtered config, evidence) and whether any phase writes a file there that could carry a secret, including the filtered UTCP config from 007 and the parked prompt from 004.

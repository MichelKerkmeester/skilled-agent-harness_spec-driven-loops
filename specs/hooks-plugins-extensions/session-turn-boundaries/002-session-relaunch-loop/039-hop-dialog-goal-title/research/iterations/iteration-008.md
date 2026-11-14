# Iteration 8: Parent-level open ends

## Focus

The three remaining sub-items of the combined parent-open-ends question: how the 002 parent goal can bind phases 037, 038 and 039 inside its 4,000-character durable slice; why phase 033 says Draft while its nine children say Complete; and whether a rebase keeps a `Commit-Id` as `.skilled/skills/sk-git/SKILL.md` says. The killer grace-period test and the Codex goal reader were settled in iteration 7; this iteration closes the rest.

## Actions Taken

- Ran the read-only packet report `node .skilled/hooks/goal/bin/goal.cjs packet specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop --workspace .`. It printed `packet_durable_chars=3993`, `packet_budget=ok`, so 7 characters remain below 4,000.
- Read the 002 parent goal's binding table and log, `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`, and the binding parser in `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`.
- Swept the 033 parent spec, its goal, all nine child specs and acceptance files, and the phase map.
- Read `.skilled/skills/sk-git/SKILL.md` section 6, `.skilled/scripts/git-hooks/prepare-commit-msg`, `.skilled/skills/sk-git/scripts/commit-id-naming.sh`, the 039 goal log, and the three 039 commit messages.

## Findings

### F1. The 002 parent goal has two real bindings and one false positive, and it can fit only with prose cuts (CONFIRMED)

The packet report says the durable slice is 3,993 characters, so 7 below the cap. The binding table stops at `036-review-remediation` and has no row for 037, 038 or 039 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:65]. The packet log records the reason: 038 and 039 each hold a `goal.md`, while 037 holds none [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:151]. `check-goal.cjs` still reports all three rows because its binding check walks every direct phase child and only looks for a row whose second table cell is that child's `goal.md` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:250-275].

The row shape matters. The parser reads only the second table cell [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:160-163], and `extractBindingTarget` accepts exactly one code-wrapped `child/goal.md` path, one markdown link, or one bare `child/goal.md` value [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165-174]. A grouped row such as `037-039` with three paths in the second cell returns `null` and leaves all three rows missing. The first cell is ignored, so a compact first cell such as `| 038 |` is valid as long as the second cell is exactly the path.

Measured line lengths (Node `String.length` on the exact strings; each added row also adds one newline):

| Change | Cost or saving | Rule it relies on |
|---|---:|---|
| Standard row for 038 | +73 chars + 1 newline | Binding table row, second cell exact path |
| Standard row for 039 | +67 + 1 | Same |
| Compact row for 038 (`| 038 | \`038-goal-and-workflow-resume/goal.md\` |`) | +48 + 1 | `check-goal` reads only the second cell |
| Compact row for 039 | +45 + 1 | Same |
| Compact row for 037 | +43 + 1 | Same, but the file does not exist |
| Shorten D1 | -37 | `budget-and-handoff.md` section 3 step 5 |
| Shorten D7 | -70 | Section 3 step 5 |
| Shorten criterion 1 | -24 | Section 3 step 6 |
| Shorten criterion 4 | -4 | Section 3 step 6 |

The cut order is the one in `budget-and-handoff.md` section 3: decision prose before criterion wording, and never remove a criterion or a decision [SOURCE: .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:49-58]. A count of 4,000 is within budget [SOURCE: .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:41].

Three concrete ways:

1. **Smallest honest fix: bind 038 and 039, record 037 as an exception.** Add two standard rows (140 chars + 2 newlines), shorten D1 and D7 (saves 107), and shorten criteria 1 and 4 (saves 28). The slice becomes exactly 4,000 characters (`3993 - 107 - 28 + 142 = 4000`), which is `packet_budget=ok`. Extend the existing binding-exception log row to 037 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:150]. This binds the two packets that have a goal document and records the third accurately, instead of pointing a row at a file that does not exist.
2. **Compact rows for 038 and 039, with D1 and D7 cuts.** Add the two compact rows (93 chars + 2 newlines) and shorten D1 and D7 (saves 107). The slice becomes 3,981 characters, 19 below the cap; adding the criterion cuts leaves 47 below. This relies on the parser reading only the second cell, so the first column can be the phase number [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:160-174]. It is a readability trade, not a semantic one.
3. **Bind all three only after authoring 037's goal.** Add compact rows for 037, 038 and 039 (136 chars + 3 newlines), shorten D1, D7, criterion 1 and criterion 4 (saves 135). The slice becomes 3,997 characters, 3 below the cap. The 037 row is honest only if `037-relaunch-test-speed/goal.md` exists; the binding check shown above compares the target string, not the file's existence [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:250-275]. Authoring that goal is outside this packet's budget, so option 1 or 2 is the smaller change.

**Verdict: CONFIRMED.** The 7-character claim is exact; 037 has no goal to bind; the smallest honest change is two rows plus the section 3 cuts. A row for 037 that points at a missing file would silence `check-goal` without binding anything, so it is not a fix.

### F2. Phase 033 is Complete everywhere except its own status fields (CONFIRMED mismatch; validation command UNCONFIRMED)

The parent spec says `| **Status** | Draft |` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md:49], and all nine rows of the phase map say `Draft` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md:111-121]. Its continuity block still records `completion_pct: 0`, the scaffold action and the "fill each child's spec docs" next action [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md:12-22].

The children disagree. Every child `spec.md` has `| **Status** | Complete |` at line 23; representative: [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/spec.md:23]. The same sweep over `033-research-remediation/0*/spec.md` found that line in all nine children. The acceptance files have no `| Unmet |` row; representative: [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/acceptance-criteria.md:54-61]. The parent's own Handoff Criteria already says all nine children are Complete and the recursive strict validation passes [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md:56].

**Right status: Complete.** If the recorded acceptance evidence holds, the parent and its phase map are done. The fields that would change are:

- Parent `spec.md` line 49: `Draft` to `Complete`.
- Parent `spec.md` lines 113-121: the nine phase-map `Status` cells from `Draft` to `Complete`.
- Parent `spec.md` continuity: `completion_pct` 0 to 100; `last_updated_at`, `last_updated_by`, `recent_action` and `next_safe_action` to the closure evidence [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md:12-22].
- Parent `goal.md` continuity: `completion_pct` 0 to 100, and the five `- [ ]` criteria [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/goal.md:84-88] to `- [x]` once the live and validation evidence is confirmed.
- The same stale pattern appears in the child goals: child 001's seven criteria are all `- [ ]` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/goal.md:60-66], even though its spec says Complete and its acceptance rows are Met. Do not read the unchecked child goal boxes as child incompleteness.

**Validation UNCONFIRMED.** The research boundary forbids running the repo-wide `validate.sh --recursive` command, so the two validation criteria remain unconfirmed by command output. The status conclusion rests on the nine child specs, the acceptance rows and the handoff criterion, not on a fresh validation run. The smallest change is metadata-only; no code changes.

### F3. The sk-git rebase sentence is wrong: the hook keeps an id only when the replayed message still carries it (CONFIRMED)

`.skilled/skills/sk-git/SKILL.md` says: "An amend keeps its id, unless the message is replaced with `-m`, which mints a fresh one. A cherry-pick re-mints a fresh one. A rebase keeps the id, and the commit it replaced is recognised as a copy by its author email and author date." [SOURCE: .skilled/skills/sk-git/SKILL.md:322].

The hook does not implement an unconditional rebase rule. It reads the pending message file, and it mints only when `HAS_COMMIT_ID == 0` or when `CHERRY_PICK_HEAD` is present [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:285-288]. A cherry-pick drops every copied `Commit-Id:` line before stamping [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:240-243], and a real merge with `MERGE_HEAD` pending is left untouched [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:133-138]. Otherwise, an existing id in the message is kept. The hook has no access to the commit being replaced, so it cannot "keep" an id that the replayed message no longer contains.

The rebase shapes therefore split by the message, not by the rebase command:

- **Id kept:** a replay that hands the hook the original message with its `Commit-Id:` trailer. This covers a plain `git rebase` replay, `git rebase --continue` with the original message, an interactive `reword` where the editor leaves the trailer in place, and `git commit --amend` without `-m`.
- **Fresh id minted:** a replay whose message has no `Commit-Id:` trailer. This covers an interactive reword that deletes or replaces the trailer, `git commit --amend -m`, `git rebase --exec 'git commit --amend -m ...'`, a squash or fixup whose combined message lacks the trailer, and every cherry-pick (clean or continued after a conflict).
- **No id stamped:** a real merge with `MERGE_HEAD` pending [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:133-138].

The 039 log is consistent with that. It records that the first reworded commit kept `0013887`, while the second and third were replayed and now carry `0013892` and `0013893` in place of `0013888` and `0013889` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/goal.md:117]. The three current commit messages confirm the trailers: `9d0c5368d1` has `0013887`, `c461b79a71` has `0013892`, and `7d6077678e` has `0013893`. The allocator mints `max + 1` and never back-fills, so the fresh ids are new ordinals, not a reuse of the old ones [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:5-9] [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:59-71]. The old ids are absent from `git log --all`, which matches the log's "in place of" wording.

The second clause of the SKILL.md sentence is a different mechanism: the collision check recognises a replayed commit as a copy by its author email and author date, which is why a rebase that does keep an id does not collide with the original copy. The tests for that behaviour are in `tests/pre-push-message-contract.test.sh` around the force-pushed rewrite and rebased-copy cases [SOURCE: .skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh:119-126] [SOURCE: .skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh:200-215]. That clause is not what preserves the id.

**Verdict: CONFIRMED.** The smallest change is doc-only: replace the rebase sentence at `SKILL.md:322` with a conditional one. The hook is behaving as designed; the allocator is not reusing an ordinal.

## Ruled Out

- **A single grouped binding row for 037, 038 and 039.** `extractBindingTarget` requires the second cell to be exactly one code-wrapped or bare `child/goal.md` value; a cell with three paths returns `null` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165-174].
- **A 037 row that points at a missing `goal.md`.** The binding check compares the target string with the child name and does not test file existence in the shown function [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:250-275]. It would silence `check-goal` without binding a real goal.
- **Treating the fresh Commit-Ids as a prepare-commit-msg defect.** The hook mints only when the replayed message lacks an id; the 039 reword did not carry the old trailer [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:285-288]. The defect is the unconditional sentence in the SKILL.md.

## Dead Ends

No new dead end beyond the grouped-row shape and the missing-037-file row. Iteration 7's killer-test and Codex-reader directions remain settled.

## Edge Cases

- **Ambiguous input:** the focus asks to bind 037, 038 and 039, but 037 has no `goal.md`. The narrow interpretation used here is: bind the two phases that have goals, and record 037 as the existing binding exception unless the operator authorizes a 037 goal. The alternative, a row to a missing file, is a false pass.
- **Contradictory evidence:** none. The packet report, the log and `check-goal` agree on the missing rows and the 7-character margin.
- **Missing dependencies:** none. The only missing artifact is 037's goal, which is the edge case above.
- **Partial success:** none. All three sub-items reached a verdict.

## Sources Consulted

- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md`
- `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`
- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/goal.md`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/spec.md`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/acceptance-criteria.md`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/goal.md`
- `.skilled/skills/sk-git/SKILL.md`
- `.skilled/scripts/git-hooks/prepare-commit-msg`
- `.skilled/skills/sk-git/scripts/commit-id-naming.sh`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/goal.md`
- `git show` output for `9d0c5368d1`, `c461b79a71` and `7d6077678e`

## Questions Answered

- The combined parent-open-ends question is answered. The killer grace-period test and the Codex goal reader were settled in iteration 7; the 002 binding budget, the 033 status and the sk-git rebase sentence are settled here.

## Questions Remaining

- Live proof and ranking: which fixes of packets 038 and 039 have no live hop behind them, what is the smallest set of live runs that closes them per runtime, and how do the surviving gaps rank by operator impact against cost?

## Assessment

- New information ratio: 0.85. Three parent-level items were settled with new code and packet evidence; the prior packet logs supplied only the initial claims.
- Questions addressed: the combined packet-and-parent open-ends question.
- Questions answered: the combined packet-and-parent open-ends question.

## Reflection

- What worked and why: reading the binding parser next to the budget report turned a vague "add rows" request into exact row shapes and counts. Reading the hook's `HAS_COMMIT_ID` branch next to the 039 log separated a doc defect from a code defect.
- What did not work and why: the recursive validation command could not be run under the research boundary, so the 033 completion claim rests on artifact statuses rather than a fresh `RESULT: PASSED`. The rebase conclusion is a code-path proof, not a reproduction of the original reword.
- What I would do differently: measure the proposed replacement strings before choosing a cut, so the first option is not exactly at the cap with no margin.

## Recommended Next Focus

Iteration 9: live proof and ranking. Name the fixes with no live hop, the smallest live-run set per runtime, and the impact-versus-cost order of the surviving gaps.

## SCOPE VIOLATIONS

None.

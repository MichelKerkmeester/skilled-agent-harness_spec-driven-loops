# Review Iteration 003

## Dispatcher

- Mode: review | Target agent: `@deep-review` | Execution: single review iteration, inline
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-vibe-1795297959308-ycf8yr` | generation 1 | lineageMode `new`
- Iteration 3 of 5 | stopPolicy `max-iterations` (convergence 0.10 is telemetry only)
- Dimension: **traceability**
- Operator review focus: the uncommitted worktree goal carry-over change, checked against packet 056's spec, tasks and implementation-summary claims, and checked for a goal set in a worktree-only packet being carried across a hop without being lost or misrouted. This iteration asks whether every claim the packet and the two hook docs make is backed by the artifact it names.

## Files Reviewed

- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:100-160` (scope, REQ-001..REQ-005, SC-001, SC-002, risks)
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/tasks.md:28-60` (T001..T010, completion criteria)
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/implementation-summary.md:60-130` (verification table, Key Decisions, Known Limitations)
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/spec.md` (phase-map rows 56 and the 055 to 056 transition row)
- `.skilled/hooks/session-handover/goal-carry-over.md:99-145`
- `.skilled/hooks/session-handover/troubleshooting.md:49-56`
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md:98`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-claude.md:758`
- `.skilled/hooks/session-handover/lib/README.md:99-112`, `tests/README.md:81-89`
- `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3940-4092` (the five new CLI tests)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`troubleshooting.md` says a worktree-only goal is carried only when the log names the worktree, but the claimed note also carries it** -- `.skilled/hooks/session-handover/troubleshooting.md:54` -- the entry reads "A Claude goal whose packet exists only in a linked git worktree is carried only when the session log names that worktree's path." `worktreeHeadlinePackets:948-951` accepts two signals: `real === claimed` (the `goal_root` of the note this session claimed last) or a log path. The CLI test `prepare carries the worktree goal of the note this session claimed when its log names no worktree path` (`session-handover-cli.test.cjs:4082-4099`) exercises exactly the case the doc says cannot work. An operator reading the entry would stop looking after finding no worktree path in the log, when the claimed note would have carried the goal.
   Finding class: doc-inaccuracy
   Scope proof: the doc sentence is at `troubleshooting.md:54`; the second acceptance signal is at `relaunch-core.cjs:948-951`; the contradicting test is at `session-handover-cli.test.cjs:4082-4099`.
   Affected surface hints: `.skilled/hooks/session-handover/troubleshooting.md`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`worktreeHeadlinePackets`)
   Case: a receiver started on a worktree goal hands over again before it touches the worktree, so its log names no worktree path. The goal is carried through the claimed note, but the troubleshooting entry tells the operator the opposite and points them at the log.

2. **The feature catalog describes the goal carry-over without `goal_root` or the worktree search** -- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md:98` -- the paragraph enumerates `goal_packet`, `goal_ended`, the no-goal fallback, the claimed-note rule and the switch, and never mentions that a packet can live only in a linked worktree or that the note now carries `goal_root`. The `feature_catalog_code` overlay protocol therefore fails: the catalog is the surface that states what the feature does, and it now understates it.
   Finding class: doc-inaccuracy
   Scope proof: the paragraph is a single line at `:98`; the new behavior it omits is at `relaunch-core.cjs:513-553` and `:936-960`; the note field it omits is at `:1513-1517`.
   Affected surface hints: `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md`, `.skilled/hooks/session-handover/goal-carry-over.md` (which does describe it)
   Case: an operator or agent reads the feature catalog to learn what a hand-over carries, sees only `goal_packet`, and concludes a worktree-only packet is not carried -- the state the phase was built to end.

3. **`spec.md` and `tasks.md` still say three CLI worktree tests while the change ships five, and the packet's own test count proves the prose is stale** -- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:110` -- `spec.md` section 3 lists one CLI test file with "Worktree happy path, two-worktree refusal, tampered root", and `tasks.md:44` verifies T003 with "the three CLI worktree tests print `pass 3`". The diff adds five: the happy path (`session-handover-cli.test.cjs:3985`), the two-worktree refusal (`:4038`), the tampered root (`:4060`), the claimed-note root (`:4082`) and the `GIT_DIR` scrub (`:4101`). `spec.md:139` SC-002 says the suite goes from 1065 to 1073, and 5 CLI + 2 wrapper + 1 core is exactly the 8 that count explains, so the count is right and only the prose is stale. `implementation-summary.md` Key Decisions records the two later tests as P2 fixes from an independent review, which is where the drift entered.
   Finding class: stale-prose
   Scope proof: the "three" wording is at `spec.md:110` and `tasks.md:44`; the five tests are at `session-handover-cli.test.cjs:3985`, `:4038`, `:4060`, `:4082`, `:4101`; the arithmetic that confirms five is at `spec.md:139` against the 1065 baseline.
   Affected surface hints: `spec.md` section 3 and REQ-001/REQ-003/REQ-004, `tasks.md` T003, `implementation-summary.md` Key Decisions
   Case: a later reviewer or a `validate.sh` checklist pass reads T003's verify line, runs the three named tests, sees `pass 3`, and marks the task verified -- while the two tests that guard the claimed-note path and the `GIT_DIR` scrub are never named by any task and could be deleted without the packet noticing.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-001 (`spec.md:118`) is implemented at `relaunch-core.cjs:513`, `:936`; REQ-002 (`:119`) at `skilled-loop:1460`, `:1240`; REQ-003 (`:120`) at `relaunch-core.cjs:547-553`; REQ-004 (`:126`) at `:954-957`; REQ-005 (`:127`) is claimed by `implementation-summary.md:112-114` and not re-measured here. The bounded tail at `:906-920` narrows REQ-001, and the "three CLI tests" prose at `spec.md:110` is stale. |
| `checklist_evidence` | core | partial | T001-T010 are all `[x]`. T003's verify line names three tests where five exist (`tasks.md:44`). T010's real-session probe is recorded at `implementation-summary.md:116` and is not reproducible in this lineage. T005's `bash -n` and the `pass 0 fail 2` negative run are claims, not artifacts. |
| `skill_agent` | overlay | notApplicable | The change touches no `SKILL.md` and no agent definition. `goal-carry-over.md` is a hook reference doc, not a skill contract, and it is accurate: every claim at `:103-107`, `:122` and `:144` matches `relaunch-core.cjs:547-553`, `:948-951`, `:1513-1517` and `skilled-loop:461`. |
| `agent_cross_runtime` | overlay | notApplicable | No `.claude/agents` or `.opencode/agents` file is in the diff or in the declared scope. |
| `feature_catalog_code` | overlay | fail | `session-handover-loop.md:98` omits `goal_root` and the worktree search; see P2 finding 2. |
| `playbook_capability` | overlay | partial | `session-handover-claude.md:758` describes the goal carry-over checks and has no worktree-only case. The phase's `spec.md` section 3 does not list the playbook, so this is recorded as follow-up rather than raised as a finding. |

## Integration Evidence

- `spec.md:139` SC-002 (1065 to 1073) reconciles exactly with 5 CLI + 2 wrapper + 1 core new tests, which is the arithmetic that identifies the "three CLI tests" prose as stale rather than the count as wrong.
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/spec.md` phase-map row 56 and the 055-to-056 transition row both state "Node suite 1073 pass, OpenCode plugin 75 pass, hooks vitest 509 passed", matching `implementation-summary.md:112-114`.
- `.skilled/hooks/session-handover/goal-carry-over.md:103-107` describes the log-named search, the claimed-note signal, the two-pair refusal and the `goal_root` ownership rule; each maps to `relaunch-core.cjs:948-951`, `:954-957` and `:1513-1517`.

## Edge Cases

- **Missing dependency: the three suites cannot be re-run inside this lineage.** `implementation-summary.md:112-114` claims 1073 / 75 / 509 and the goal's completion criteria claim `fail 0`; neither is re-measured here because running the suites writes outside the lineage. Recorded as unverified, not as a pass.
- **Ambiguity: `implementation-summary.md` Known Limitations 3 says the Pi and OpenCode behaviour is "Inferred from their code, not tested".** That is an honest label and matches `spec.md:112` ("Out of Scope"). Not raised.
- **Contradictory evidence resolved: the packet's test count and its test prose disagree.** `spec.md:139` implies eight new tests and the diff adds eight; `spec.md:110` and `tasks.md:44` say three CLI tests. The count wins because it reconciles with the diff, so the prose is stale and the count is sound. Adjudicated in P2 finding 3.
- **Partial success: `playbook_capability` is partial but out of the declared change scope.** Recorded as follow-up in the protocol table rather than as a finding, so the finding count stays inside the declared target.

## Confirmed-Clean Surfaces

- `goal-carry-over.md:103-107`, `:122` and `:144` match the code on every claim: the log-named search, the claimed-note signal, the two-pair refusal, the `goal_root` write-and-remove rule, the `git worktree list` gate, the "never re-checked in another checkout" rule, the `claim` line format and the single-root render.
- `spec.md` section 6 risk table states the `goal_root` risk and the mitigation that `relaunch-core.cjs:547-553` and `:453-462` implement.
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/spec.md` phase-map row 56 and the transition row agree with `implementation-summary.md` on all three suite counts.
- `lib/README.md:99-112` and `tests/README.md:81-89` remain accurate: the entrypoint table is curated and never listed `usableGoalPacket` either, and the wrapper test description still covers "the goal packets".

## Ruled Out

- **`lib/README.md` omitting the newly exported `usableGoal`.** The entrypoint table is curated, not exhaustive: it never listed `usableGoalPacket`, which pre-existed, so the omission is the table's existing shape rather than drift from this change.
- **`tests/README.md` being stale.** Its wrapper-test description ("Covers the claim state, the withdrawn hand-overs and the goal packets") still holds for the two new worktree tests.
- **`spec.md` section 3 omitting `goal-handover.cjs`.** `renderGoalSlice` already accepted `roots` before this change (`goal-handover.test.cjs:173`), so no edit to that file was needed and its absence from the file list is correct.
- **`implementation-summary.md` Known Limitations 3 being a defect.** It labels the Pi and OpenCode behaviour as inferred and untested, which matches `spec.md:112` putting those receivers out of scope.

## Next Focus

- Dimension: maintainability
- Focus area: the shape of the new code in `relaunch-core.cjs` (`repositoryWorktrees`, `noteGoalRoot`, `usableGoal`, `worktreeHeadlinePackets`), the `skilled-loop` two-line protocol, and the cost of the next safe change
- Reason: correctness, security and traceability are covered; the remaining question is whether the new helpers are shaped so the next change to the goal path is safe, and whether the two-line shell protocol is the clearest available encoding
- Rotation status: traceability complete, rotating to maintainability
- Blocked/productive carry-forward: productive -- reconciling a count against a diff settled a contradiction; carry that into the maintainability pass
- Required evidence: `file:line` for every claim, plus the existing convention each new helper either follows or departs from
- Recovery note: not applicable

Review verdict: CONDITIONAL

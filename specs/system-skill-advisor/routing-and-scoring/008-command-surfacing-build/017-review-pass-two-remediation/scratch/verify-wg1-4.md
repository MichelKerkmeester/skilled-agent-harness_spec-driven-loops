# Verify WG1 to WG4 (T003 to T021)

Independent check of the uncommitted lane edits against `tasks.md`. I edited nothing except this report.

## Per task

- T003 CONCERN: matches the task line exactly (`lib/command-attach.ts:289-295`, `:335`, `tests/command-attach-guards.vitest.ts:28-35`, `:52-65`). The NOEDIT4 cases would fail on revert, because the old pattern had neither `no changes` nor `don't` nor a curly fold. The concern is the prescribed bare `no changes` alternative, which also catches prompts that do ask for a change (finding F1).
- T004 PASS: `lib/scorer/text.ts:5` imports the helper and `:150` uses it. The four `it.each` cases (`tests/scorer/read-only-explainer.vitest.ts:29-36`) start with "please", so the leading-verb fallback cannot pass them and they would fail on revert. `command-attach.ts` still has no import, so this adds no cycle.
- T005 PASS: `lib/scorer/fusion.ts:20`, `:677`, `:881`. The curly-apostrophe case (`tests/command-meaning-anchor.vitest.ts:338-344`) returns true under the old `NO_EDIT_REQUEST.test`, so it would fail on revert.
- T006 PASS: `tests/handlers/advisor-status.vitest.ts:497-523`. The env var is restored in a `finally`, the original two `not.toContain` lines are kept, and the stored-record asserts prove the case now persists what it guards. It is a guard by design and passes today.
- T007 PASS: one line deleted at `tests/command-attach.vitest.ts:120`, the next line kept, nothing else touched.
- T008 PASS: `tests/command-attach-guards.vitest.ts:117-127` and `scripts/command-bridges/README.md:50`. The field list matches `CommandRow` at `lib/command-attach.ts:48-53`, including the three `mutating` values. The old sentence named no field in backticks, so the test would fail on revert.
- T009 PASS: `derive-command-bridges.cjs:957-966` and the export at `:1414`. In the new `tests/derive-command-bridges-strings.vitest.ts` the regex assertion catches a raw U+2028 or U+2029 even though `new Function` would still parse it. `DERIVE` prints fresh.
- T010 PASS: `command-offer.mjs:328-345` and `:439-456`, with tests at `tests/command-offer.vitest.ts:448-521`. The untrusted case uses the default warm and replay, so on revert both fake scripts would run and the case would fail. The existing case got `trusted: () => true` (`:289`). See F4 for a P2 note on where the marker is looked up.
- T011 PASS: `worktree-restore.mjs:47-68`. The -z order is read correctly: new path in the entry, source in the next field, and the code is tested on both columns. Short-format git quotes a name holding a space, so both new cases (`tests/worktree-restore.vitest.ts:115-145`) would fail on revert.
- T012 PASS: `run-command-behaviour.mjs:985-998`, with the call site at `:1262` (the only caller). The mixed case would fail on revert because `refusal` stays null. The behaviour change is intended: `--set g2 --row-id <chat row>` used to run as g2 and is now refused.
- T013 CONCERN: `command-offer.mjs:419`, `run-command-behaviour.mjs:806-808`, `:1157`, `:1231`, `:1248`. The lineFixture and "hands each line" tests would fail on revert. However, no vitest covers the run-line write path in `runArm` and `runTurn`. Only the planning probe does (finding F3).
- T014 PASS: `capture-command-routing-baseline.mjs:84-97`, `:367` and `:683-686`. Every env write sits at `:381-396`, inside the `try` that opens at `:374`, so a throw still reaches the restore in the `finally`. The nine names match the nine writes and deletes, and there are no others. The test is `tests/command-routing-slice.vitest.ts:24-43` and `:111-119`.
- T015 PASS: `measure-brief-cost.mjs:163-173`, with the test at `tests/measure-brief-cost.vitest.ts:131-145`. The existing `runScript` already took an env argument, so no change was needed there. Without the fix the hook inherits `1`, so the test would fail on revert.
- T016 PASS: `score-command-transcripts.mjs:123`, plus usage lines `:21` and `:40`, with the test at `tests/command-transcript-score.vitest.ts:626-636`. The session form never read `rowId` (it is used only at `:1063`, in summary mode), so the refusal removes no function. The worker also added one comment sentence at `:112-113`, which was not asked for but is harmless.
- T017 PASS: the header at `score-command-transcripts.mjs:6-8` is the requested text, and `node --check` exits 0.
- T018 CONCERN: the replacement is literal, but the sentence now reads as a run-on that suggests `--json` is also a usage error (`scripts/routing-accuracy/README.md:114`). See F2.
- T019 PASS: `scripts/routing-accuracy/README.md:82` and `:115`. Both are accurate against the code.
- T020 PASS: `scripts/routing-accuracy/README.md:116`. Both insertions are present and match `armFor` and `lineFixture`.
- T021 PASS: `scripts/routing-accuracy/README.md:102`. The sentence sits after the first sentence of the Sandbox bullet.

## Findings

F1 (P2). `lib/command-attach.ts:289`. The new bare `no changes` alternative, together with the existing `do not` class (`don't` and the curly form are new), reads prompts that ask for a change as no-edit requests. The attach path then drops the command, both scorer gates turn it off, and `isReadOnlyExplainer` can flip to true. Confirmed by running a probe through the tsx loader: `isNoEditRequest` returns true for "refactor the parser so there are no changes to its public api", "fix the flaky test and make sure there are no changes in behaviour", "add a check that git status shows no changes after the build" and "create an agent called invoice-parser with no changes to existing agents". The plan prescribed this regex, so the worker followed the task. The published command corpus is unaffected: `command-routing-slice.vitest.ts` passes row by row against the committed baseline. FLOOR and EVAL, which include holdout counts, are the coordinator's to confirm. Smallest fix: replace the `no changes` alternative with `make no changes|no changes yet`, the two forms the tests need. Optionally add a negative case: "refactor the parser so there are no changes to its public api" stays `false`.

F2 (P2). `scripts/routing-accuracy/README.md:114`, in "`--row-id <id>` narrows `--summary` to one row and is a usage error with `--runtime` and `--json` prints machine-readable output." The run-on reads as if `--json` with `--runtime` were also a usage error. Smallest fix: end the clause after `--runtime` with a period and start a new sentence, "`--json` prints machine-readable output."

F3 (P2). `run-command-behaviour.mjs:1157` and `:1231`. No vitest covers the claim that a g2 run line records `fixture` while a chat row does not. Only `probe-arm-fixture.mjs` covers it. A regression in `runArm` or `runTurn` would pass the suite. Smallest fix: none is required by the task. If wanted, add a `--dry-run` case in `command-behaviour-guards.vitest.ts` that runs one g2 row into a temp log and expects its line to carry `fixture`. This only works if a dry run can run without a prepared arena, which I did not check.

F4 (P2, note only). `command-offer.mjs:340` looks for the marker at a literal `<checkout>/.git/skilled-behaviour-arena`, while `liveArmRefusal` (`run-command-behaviour.mjs:606`) resolves it through `git rev-parse --git-path`. Today they agree, because `prepare-behaviour-arena.mjs:314` builds a clone with a real `.git` folder. An arena built as a linked worktree, where `.git` is a file, would fail closed as `untrusted_checkout`. That is safe but surprising. The marker cannot arrive through a commit, because git refuses tracked paths under `.git`. Anyone who can write the named folder can plant it, which matches the stated threat model of an untrusted log, not an untrusted local writer. Smallest fix: none needed now. If arenas ever become worktrees, resolve the marker the way `liveArmRefusal` does.

## Rule checks

I grepped all added lines in the WG1 to WG4 files plus the new untracked test. I found no code comment naming a spec path, phase, task or finding id, no `/create:skill` or `/create:sk-skill` in an added line, no em dash and no semicolon in an added README line, and no reference to `holdout-prompts`. Each changed file maps to a task in its own lane. The `tests/README.md` edit in the same diff belongs to WG5 (T024), not to these lanes. I did not open `holdout-prompts.jsonl`.

## What I ran and what I only read

Ran, with output and exit read:
- `env -u AI_SESSION_CHILD npx vitest run` on the 11 lane test files (command-attach-guards, read-only-explainer, command-meaning-anchor, command-attach, advisor-status, derive-command-bridges-strings, command-offer, worktree-restore, command-behaviour-guards, measure-brief-cost, command-transcript-score): 11 files and 209 tests passed.
- `tests/command-routing-slice.vitest.ts` alone: 6 of 6 passed, exit 0.
- `derive-command-bridges.cjs --check`: printed `{"status":"fresh","changed":[]}`, exit 0.
- `node --check` on the seven changed scripts: exit 0.
- The F1 regex probe through the tsx loader, on the four prompts quoted above plus three more.

From reading only, with no revert run:
- Every "would fail on revert" judgment.
- The -z field order.
- The env-restore-on-throw path.
- F2, F3 and F4.

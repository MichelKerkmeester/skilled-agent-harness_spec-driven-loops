# Review of the phase specs 002 to 006

Written by a fresh Fable 5.2 session on 2026-11-11, with no memory of how the drafts were written. It read every file and line the five drafts cite, changed the planning documents inside this packet and built nothing. No test suite was run.

## Verdict

The five drafts named the right files and their citations were almost all correct. Their task lines were not ready for a small model. Most said "revise", "add" or "update" without the text, and several proved themselves with a search that passes whether or not the edit is right. Every edit task now points at an edit file that holds the exact old text and the exact new text, and every task ends with a command that fails when the edit is missing.

Four findings changed the edit set:

1. Phase 002 missed three statements of the routing rule. Two of them are compiled into the command contracts.
2. Phase 003 asked for about forty separate edits in one test file. One helper edit covers them, and one test case that bypasses the helper was not named at all.
3. Phase 005's first task could not be run by a small model, and its measured output came from a degraded advisor run. The task is replaced and the measurement is redone.
4. Phase 005 planned a test in a harness that cannot read the shipped router. A direct command replaces it.

## How the task lines work now

Each phase folder has `scratch/edit-T###.txt` files. One file holds one edit: the target path, an OLD block and a NEW block. The task line names the edit file, names the one target file in parentheses and ends with `Verify:` and a command with its expected output.

I generated every edit file with a script that asserted the OLD block occurs in the real source the stated number of times. I then applied all the edits to temporary copies outside the repository and ran the text-based Verify commands against the real tree and against the copies. Each one failed before the edit and passed after it. The commands that run tests or regenerate files were not run.

When OLD is not found, or a test fails, the task line tells the implementer to stop, mark the task `[B]` and write an open question in `goal.md`. No task asks the implementer to repair a red test by judgment.

## Phase 002: bind single-entry executors to the single path

Found wrong:

- The rule is stated in seven places across five files, and the draft covered four. Each presentation asset states it a second time in its `Fan-out default policy` sentence, at `deep-research-presentation.txt:71` and `deep-review-presentation.txt:88`. The compiled contracts embed that sentence, so the draft would have regenerated contracts that still carried the old rule.
- The deep-research feature catalog restates the rule at `fanout-dispatch.md:52-53`. The draft did not list it.
- The draft's Verify commands searched for `--count above 1` as a fixed string. The source reads `` `--count` above 1 `` with backticks, so that pattern never matches. The command still exited 0 because the other patterns matched.
- No task gave the new wording.

Changed:

- Twelve tasks in place of eight. T002 to T008 carry the seven edits, T009 and T010 regenerate the contracts, T011 audits all seven policy-bearing files.
- The new wording says what a one-lineage matrix writes: `config.executor` from its one entry, with `config.fanout` left unset. The four workflow files then skip the runner on their existing guard, so no workflow file changes.
- T009 and T010 prove regeneration by comparing a fresh compile with the written file. I measured that a fresh compile is byte-identical to both committed contracts today, so the comparison is a valid proof.
- T007 checks that the review sentence keeps the words `Native and CLI fan-out lineages run under`. A system-spec-kit test asserts them.
- The Measured Behavior block is rerun with a command that shows all nine lines.
- The plan records that a one-entry `cli-deepseek-harness` matrix now reaches the existing fail-fast at `deep-research-auto.yaml:1216`.

Citations: all correct. One note on `phase-facts.md`: it quotes the guard as `skip_when: "config.fanout is absent"`. The four workflow files read `skip_when: "no entries in config.fanout.executors"`. The draft spec did not repeat the wrong quote.

Could not verify:

- That the regenerated contracts carry the new sentence on exactly 2 lines each. The count is derived from the current contracts, which embed the sentence and the bullets once each. T009 and T010 measure it.
- Whether sk-doc has a gate on feature catalog entries that the one-line catalog edit could trip.

## Phase 003: refuse a single-lineage fan-out run

Found wrong:

- T003, the refusal itself, was proved by `node --check`, which passes for any syntactically valid file.
- T006 said "add the opt-in to existing direct one-lineage unit invocations". The evidence counts 37 or more launch sites. A small model would have to find each one and decide whether it is one lineage.
- Every launch in `fanout-run.vitest.ts` passes through `canonicalizeFanoutArgs`, including the two raw `spawn` calls. The draft did not use this.
- One case does bypass that helper: the recorded-run case near line 2930 calls `recordScriptRun` and `replayScriptRun` directly and asserts the exact argument list. No draft or evidence file names it. It would have turned red.
- The stress file has three launch helpers, not three cases. The draft's T008 said "existing one-lineage stress cases".
- T004 and T005 asked for two new tests without their code.
- The draft did not say where the refusal goes relative to the stop-policy guard, or what value of the flag counts.

Changed:

- Sixteen tasks. T002 registers the key, T003 inserts the refusal directly after the expansion at line 3396, T004 adds the opt-in in the shared test helper, T005 and T006 fix the recorded-run case, T007 and T008 add the refusal test and the opt-in test with their full code, T009 to T012 fix the stress fixture, the three stress helpers, the timestamp-window launch and the runbook.
- The refusal message is fixed in the plan. It names the single-executor workflow and names neither the flag nor a count.
- Only the bare flag opts in. Every edit places the flag where the runner's parser reads it as `true`.
- T001 now also checks that phase 002 has landed, which makes the ordering a command and not a sentence.
- T013 to T015 run the three test targets. A failure blocks the task.

Citations: all correct. `fanout-run.cjs:30`, `:1585`, `:3396` and the guard at `:3397-3407` say what the documents claim. I also checked every file in the repository that names the runner. Only the repin runbook documents a direct invocation. The other tests import a helper or read the source.

Could not verify:

- The two new tests and the helper edit have never been executed. I wrote them from the existing stop-policy test and the recorded-run case, which use the same helpers. T006 to T008 run them.
- How many existing tests turn red. The launch paths were read, not run. T013 to T015 measure it.
- Whether an existing test asserts on the argument list of a launch that passes through the helper. I found one such assertion, in the recorded-run case, which bypasses the helper.

## Phase 004: name the file in plan phase lines

Found wrong:

- T002 and T003 proved themselves with a loose pattern and left the example text to the implementer.
- The snapshot risk was mitigated by "review the diff and retain only the four plan-example changes", which is a judgment call.
- One task both regenerated the snapshot and ran the suite.

Changed:

- Seven tasks. The example text is fixed: all three phase sentences name `scripts/rotate-logs.sh`, the file the card's task example already uses. Only the GOOD example changes, as the evidence review asked.
- T005 regenerates and requires `git diff --numstat` to report 4 lines added and 4 removed. Any other number blocks the task.
- T003 runs `check-card-sync.sh`, the existing read-only guard for the card. It printed `CARD SYNC OK` today.
- The task file no longer uses shell variables. Every command is written out.

Citations: all correct. `plan.md.tmpl:124`, the card at line 120, `SKILL.md:94` and the four snapshot lines 483, 943, 1593 and 2433 match.

Could not verify:

- Whether the snapshot file is fresh today. If it is stale, `--update` changes more than four lines and T005 blocks.

## Phase 005: point chat sessions at the authoring card

Found wrong:

- T001 asked for "the active runtime route trace" and told the implementer to widen the phase if the trace was negative. A small model cannot produce that trace, and the branch is an open scope decision.
- The Measured Behavior block showed a degraded advisor run with no recommendations. Run from this session, the same command is not degraded and returns `sk-code`, `sk-doc` and `mcp-tooling` at 0.82. This matches `phase-facts.md` and `trust-checks.md`. system-spec-kit is absent.
- REQ-001 required "a non-degraded live route to system-spec-kit". The measurement shows that route does not exist, so the requirement could never be met.
- T007 planned a case in `smart-router-measurement.vitest.ts`. That harness resolves a skill under `.skilled/skill/<name>` in a temporary workspace. The shipped tree is `.skilled/skills/`. A case for the real router would need a fixture copy that nobody has measured.
- The IMPLEMENT keywords are listed twice in `ROUTER.md`, at line 39 in prose and at line 163 in the keyword row. The draft edited one. The evidence review cites the row as line 162, which is off by one.
- T003 used `npm run test:core` from `runtime/`. The scaffold test belongs to the `cli` project, which the package script runs from `runtime/cli` with the shared config.
- T006 said "add natural-language write verbs" without naming them.
- The completion criteria included "Manual verification passed".

Changed:

- Fourteen tasks. T001 to T003 are three counts read from the files: two scaffold output blocks, one notice return with seven adapters that load the gate core, and the skill's instruction to read `ROUTER.md`. T003 also records the advisor result.
- The six verbs are "add", "change", "edit", "fix", "update" and "write". They go into both places in `ROUTER.md`.
- The router proof is a command that applies the router's own word-boundary rule to the measured prompt. It prints `[]` today and `['add']` after the edit.
- The smart-router test file is removed from the scope. The plan says why.
- The card line is first under `Next steps:` on both scaffold paths. The notice sentence is the last line of the notice.
- The two scaffold helpers each get one line that throws when the card path is missing, so every existing case checks it.

A decision the orchestrator may want to overturn: goal decision D2 says a carrier that fails its reach check is dropped. The router carrier does not reach a session at prompt time, because the advisor does not pick the skill. It does reach a session that opens the skill for another reason. I kept it, stated the limit in the spec and the goal, and did not gate the other two carriers on it. Dropping T012 and T013 would also be defensible.

Citations: `ROUTER.md:160` is where the keyword table starts, `shared-smart-router.md:68-70` is the boundary rule, and `create.sh` prints `Next steps` at lines 2206 and 2414. The spec-gate core lives at `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`. `phase-facts.md` points at `.skilled/hooks/spec-gate/`, which holds the adapters.

Could not verify:

- Whether a live chat session opens system-spec-kit on a plain write. No task measures it.
- How often the six verbs match a request that is not a write.
- Whether a test outside `spec-gate-core.test.mjs` pins the notice. A search for the notice's last line found only the core and that test.

## Phase 006: repair the speckit workflow gates

Found wrong:

- T005, T006 and T007 proved themselves with `rg -A`, which prints lines and exits 0 whether or not the new field is there. No task gave the text for the step 5 check, the test-failure outcome or the phase gate line.
- T010 was ticked before anything was built, and four checklist rows that depend on the built state were ticked too.
- Defining `plan_clarity` does not close the arithmetic gap that `phase-facts.md` describes. The other three checks still sum to 75 against a threshold of 70.

Changed:

- T004 to T006 load the parsed YAML and print the new values. A field under the wrong key fails the task.
- All five edits have exact text. The step 5 edit is one edit to two adjacent lines.
- T010 and the four checklist rows are open again, and the summary counts follow.
- The plan states that the step 5 hard stop is the control for an unclear plan and that points and threshold stay with the open `quality_gates` question.

Citations: all correct. Lines 386-392, 558-562 and 674-681 of `speckit-implement.yaml`, 1044-1053 of `speckit-complete.yaml` and 656 of `speckit-plan.yaml` match. All three files parse today.

Not added, and listed as an open question: `speckit-complete.yaml:1096` carries the same three-item prerequisite check, and `speckit-complete.yaml:1249` lists `Validate tests pass` with no stop. The evidence names only the implement workflow for those two findings, so I did not add them.

Could not verify:

- Whether a model that reads the workflow follows the new stops. The checks prove the text is there and parses.

## Across the phases

- Order: 002 must land before 003. T001 of phase 003 now checks for the phase 002 wording in `research.md`.
- No two phases edit the same file. The five file sets are disjoint. Phase 004 narrows the `SKILL.md:94` sentence to plan and implement requests and phase 005 widens what counts as an implement request. The sentence stays true after both.
- No later phase edits a source the compiled contracts are built from, so phase 002's contracts stay fresh.
- Each acceptance row names the tasks that prove it. Each goal has between three and six completion criteria and matches its spec. The parent goal was not changed.
- The parent spec lists all six children. Its file table gained the feature catalog row and lost the smart-router test row, and its phase 5 text now describes the reach checks.

## Coverage of the confirmed recommendations

Every item in the research change set, the trust checks and `phase-facts.md` is carried by a task. The work I added is the two missed policy sentences, the feature catalog line, the recorded-run test case and the prose keyword list. Each one is a place where a confirmed recommendation applies and the draft had no task.

Left out on purpose, as the evidence review asked: a `Verify:` rule on plan lines, a fan-out summary line, an `AGENTS.md` extension, a single-executor runner and a workflow change that passes the flag.

## What the orchestrator should know before dispatch

- Hand the implementer the task line and the edit file it names. The task line alone does not carry the text.
- Phase 003 carries the most risk. Its test code is unexecuted.
- Other sessions were editing files under `.skilled/commands/doctor/` while this review ran. None of them is a file these phases touch.

# Phase facts: what each build phase must do

Source for the spec authors of children 002 to 006. Every line reference was read in the orchestrating session on 2026-11-11. Re-read each one before you cite it, and correct it if the file has moved.

Evidence lives in child `001-research-egm-checks-and-chat-path-gaps/`: `research/research.md`, `research_archive/2026-11-11T20-11-35Z/research.md`, `scratch/fable-review-of-generations-2-and-3.md`, `scratch/trust-checks.md`, `scratch/incident-chat-started-loop.md`.

Nothing in any phase has been built or tested. No test suite has been run.

## 002-bind-single-entry-executors-to-single-path

Problem: the deep-loop command docs say any `--executors` value switches to fan-out. A one-entry matrix with count 1 therefore reaches the fan-out runner, where one process writes every iteration and the packet-level init, lock and spec check never run.

- `.skilled/commands/deep/assets/deep-research-presentation.txt:108-109`: "0 or 1 --executor (no --executors, no count>1): write config.executor" and "2+ --executor flags, --executors, or any count>1: write config.fanout".
- `.skilled/commands/deep/research.md:126` and `.skilled/commands/deep/review.md:98`: "an `--executors` value ... switches to fan-out".
- `.skilled/commands/deep/assets/deep-review-presentation.txt` carries the twin of the presentation lines. Find the line.
- All four workflows spawn the runner whenever `config.fanout` exists: `deep-research-auto.yaml:225`, `deep-research-confirm.yaml:238`, `deep-review-auto.yaml:228`, `deep-review-confirm.yaml:210`, each under `skip_when: "config.fanout is absent"`.

Change: a `--executors` matrix that expands to exactly one lineage binds `config.executor`, the single-executor path. Two or more lineages bind `config.fanout`. Four doc lines, one clause each.

Open point for the spec: `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown` name the runner. `runtime/tests/unit/render-command-contract.vitest.ts` suggests they are generated. Find the generator and say whether they need regenerating.

Must land before phase 003, or the proper command starts failing on a one-entry matrix.

## 003-refuse-single-lineage-fanout-run

Problem: `fanout-run.cjs` accepts a matrix that expands to one lineage. A chat session called it that way three times in this packet, and nothing reported that one process wrote all iterations.

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:30`: `FANOUT_FLAGS`. An unregistered flag fails as unknown.
- `fanout-run.cjs:3396`: `const allLineages = expandLineages(fanoutConfig);`. Lines 3397-3407 hold the stop-policy guard that throws `inputError`. The refusal goes beside it, in the same shape, before any directory, ledger or spawn.
- `fanout-run.cjs:1585`: "THIS process is the executor for EVERY iteration". One process per lineage is deliberate and stays.

Change: refuse a `research` or `review` run whose matrix expands to one lineage unless `--allow-single-lineage` is passed. The error message names the single-executor `/deep:research` or `/deep:review` path. It never names the flag and never suggests raising a count.

Callers that need the flag:
- `runtime/tests/unit/fanout-run.vitest.ts`: 106 matrix lines and 19 launch sites. The red count is unknown until the suite runs after the edit.
- `runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts:179`: `executors: [executor]`, shared by the whole adapter stress suite.
- `runtime/tests/stress/cli-adapter/fanout.vitest.ts`: one-executor cases near lines 165, 756 and 794.
- `runtime/tests/unit/lineage-timestamp-window.vitest.ts:109`.
- `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md:148-152`: an operator procedure that calls the runner directly. Line 160 requires "one lineage".

Add one negative and one positive test from the existing stop-policy test template.

Known gap to state, not fix: `--count=2` bypasses the refusal, and `deep-research-auto.yaml:1216` teaches a count for DSH.

## 004-name-file-in-plan-phase-lines

Problem: a plan phase line can name no file, so an implementer picks the file. Proof belongs on task lines, where the rule already exists (`spec-authoring-card.md` section 7 and `templates/core/tasks.md.tmpl:53`).

- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124`: the FILL comment with the GOOD example for phases.
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120`: the matching example.
- `.skilled/skills/system-spec-kit/SKILL.md:94`: "a write starts with `references/workflows/spec-authoring-card.md`". The router does not implement that. It loads by intent keyword.
- The template text is pinned four times in `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` at lines 483, 943, 1593 and 2433.

Change: the GOOD example in the template and the card names the file each phase touches. `SKILL.md:94` becomes "a plan or implement request starts with the card". Regenerate the snapshot file. Find the regeneration command in the test file or its package script.

Dropped by review, do not add: a `Verify:` requirement on plan lines, a fan-out summary line, an `AGENTS.md:186` extension.

## 005-point-chat-sessions-at-authoring-card

Status of these items: proposed by the orchestrating session and not reviewed by a second model. The spec must say so and make its first task a check that each carrier reaches a chat session.

Problem: most users chat and never type a command. On that path the authoring card mostly never loads.

- `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a --keep flag to the rotate-logs script"}' --format json` returns `sk-code`, `sk-doc` and `mcp-tooling` at 0.82. `system-spec-kit` is absent.
- `.skilled/skills/system-spec-kit/ROUTER.md:160-175`: `INTENT_SIGNALS`. That prompt contains none of the keywords. Matching is on word boundaries (`references/cli/shared-smart-router.md:68-70`).
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints "Next steps" and does not mention the card.
- `.skilled/hooks/spec-gate/` asks the spec-folder question. Adapters exist for claude, codex, cursor, devin, dsh, opencode and pi. Deny is opt-in through `SYSTEM_SPEC_GATE_ENFORCE`. It returns nothing to a dispatched child.

Candidate changes, each one line:
1. `create.sh` "Next steps" output names the authoring card.
2. The spec-gate message carries one sentence naming the card.
3. `ROUTER.md` `INTENT_SIGNALS` gains write-verb keywords so a plain write request loads the card. An earlier review dropped this. The advisor result above is the new fact that reopens it.

Out of scope: `AGENTS.md` is 27,372 bytes and Devin reads 16,384 bytes of a rule file (`.devin/SYNC.md:93`). That overrun gets its own packet.

## 006-repair-speckit-workflow-gates

Status: found by a fresh review of the command workflows. These files load only when a user runs a `/speckit:*` command.

- `.skilled/commands/speckit/assets/speckit-implement.yaml:386-392`: the pre-implementation gate has threshold 70 and scores `plan_clarity` at 25 points. `plan_clarity` appears once in the file and is defined nowhere, so a plan with zero clarity passes at 75.
- `speckit-implement.yaml:558-562`: `step_5_implementation_check` checks prerequisites, blockers and environment. It has no check that the plan leaves no design choice to the implementer and no `on_fail`.
- `speckit-implement.yaml:674-681`: `step_7_completion` lists "Validate tests pass". Its outcomes cover validation errors and name no stop for a failing test.
- `speckit-complete.yaml:1044-1053`: the phase gate checks that `plan.md` exists. It does not check that the plan states a technical approach.
- `speckit-plan.yaml:656`: "Extract [NEEDS CLARIFICATION] markers (max 3)" reads as a cap of three in total. The intent is passes of three.

Changes: define `plan_clarity` where it is scored, add the design-choice check with an `on_fail`, add the test-failure stop, add the technical-approach check, reword the marker line.

Waiting on the operator, list as open questions and keep out of scope: deleting the `quality_gates` and `circuit_breaker` blocks (`speckit-plan.yaml:403,429`, `speckit-implement.yaml:382,408`, `speckit-complete.yaml:492,535`), and deleting `default_level: level_2` (`speckit-plan.yaml:279`, `speckit-implement.yaml:266`, `speckit-complete.yaml:316`).

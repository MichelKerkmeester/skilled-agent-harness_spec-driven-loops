---
title: "Synthesis: plan-check build, review and remediation"
description: "A fresh Opus reading of the plan-check build after its deep review and remediation, with the defects it found and how each was closed."
trigger_phrases:
  - "goldfish plan-check synthesis"
  - "one-lineage refusal synthesis"
importance_tier: "important"
contextType: "implementation"
---
# Synthesis

Written on 2026-11-12 by a fresh Opus 5.5 session that took no part in the research, the build, the review or the remediation. Every claim below was checked against the working tree as it stood when this pass ran. The work is uncommitted, so file:line references point at the working tree, not at a commit.

## Verdict

**NOT CLEAN.**

The single most important control, the one-lineage refusal in `fanout-run.cjs`, works: I reproduced it outside the repository and the focused unit file passes. Eleven of the twelve review findings and SL-203 are fixed or correctly dropped. But the fix for deferred item SL-204 adds a regression the review never saw. The direct `/deep:review:auto` path now refuses every home-directory Claude config dir, and the documented `--config-dir=~/.claude-account2` example is one of them. Child 007 hit this as a failing test. It read the failure as a mistake in the test and changed the test input, which hid the defect instead of fixing it. That is a P1, so the packet does not meet goal criterion 5's spirit ("no P0 or P1 finding stays open after remediation"), even though the review itself recorded none. Three P2 defects and several stale status lines in child 007 and the parent come on top of it.

## What was built

**001 research.** Five fresh `cli-pi` iterations (generation 3) and ten (generation 2) answered whether the Elephant-Goldfish cold read should enter spec-kit. They also covered how a chat session gets workflow protection and how a chat-started deep loop stays on its workflow. The verdict was not to adopt the cold read as a sub-agent. Instead the research proposed making plan phase lines decidable by a fresh reader and adding one refusal in the fan-out runner. A Fable 5.2 review trimmed both edit sets; `scratch/phase-facts.md` holds the confirmed remainder.

**002 executor binding.** The deep-research and deep-review command pages, both presentation assets and the fan-out feature catalog now send an `--executors` matrix that expands to one lineage to `config.executor`. Two or more lineages go to `config.fanout`. Both compiled contracts were regenerated, and a stale `deep-ai-council` contract was recompiled as a drift fix.

**003 lineage refusal.** `fanout-run.cjs` registers `allowSingleLineage` and refuses a research or review matrix that expands to one lineage before any side effect, unless the caller opts in. Unit, stress and timestamp-window tests and the DeepSeek repin runbook pass the opt-in.

**004 plan file naming.** The plan template's phases FILL comment and the authoring card's example now name the file each phase touches. The `SKILL.md` card sentence was narrowed to plan and implement requests, and the four scaffold snapshots were regenerated.

**005 authoring-card pointers.** `create.sh` prints a step 0 naming the card in both Next steps blocks. The spec-gate first-mutation notice gains one sentence naming the card. The system-spec-kit `ROUTER.md` IMPLEMENT intent gains six write verbs, later moved to a WRITE intent (see D3 below).

**006 speckit workflow gates.** `speckit-implement.yaml` defines `plan_clarity`, adds a design-choice stop with an `on_fail` and adds a `test_failure` outcome. `speckit-complete.yaml` requires a stated technical approach at its phase gate, and `speckit-plan.yaml` describes repeated passes of up to three clarification markers.

**007 remediation.** It changes the refusal predicate to the `ACTIVE_FANOUT_LOOP_TYPES` set and accepts the values `true` and `1`. It exports `validateClaudeConfigDir` and applies it in `deep-review-auto.yaml`. It also rewords the five policy carriers, documents the opt-in, hoists the `create.sh` sentence into one readonly variable and reconciles child 006 and the parent phase map.

## Review findings and their final state

| ID | Severity | Final state | Evidence (current tree) |
|----|----------|-------------|-------------------------|
| R2-P2-001 | P2 | Fixed | `fanout-run.cjs:3400` now reads `ACTIVE_FANOUT_LOOP_TYPES.has(loopType)`; the set is at `:475`. The neighbouring stop-policy guard at `:3411` still repeats the literal pair, but that line was not part of the finding. |
| R1-P2-004 | P2 | Fixed (message unchanged by design) | `fanout-run.cjs:3402-3404` accepts Boolean `true` and the strings `true` and `1`. The refusal text still hides the opt-in on purpose, and `research.md:131-133` says so. |
| R1-P2-003 | P2 | Partly fixed, placed wrongly | The flag is now documented at `research.md:123`, `review.md:95` and `fanout-dispatch.md:54-56`. The command-page rows sit inside a "Workflow Flag Surface" table whose heading (`research.md:105-109`) says every row is a workflow input. This flag is not one. The runner itself still has no usage text. See defect D2. |
| R3-P2-003 | P2 | Fixed | `fanout-dispatch.md:52-56` states the refusal, the opt-in, the values it accepts, the skipped phases and the message limitation. |
| R1-P2-001 | P2 | Fixed | "its iterations value binds to config.maxIterations" at `deep-research-presentation.txt:109`, `deep-review-presentation.txt:137`, `research.md:127-128` and `review.md:99-100`. The compiled contracts match (drift check OK). |
| R1-P2-002 | P2 | Fixed | The `--executors` rows at `research.md:122` and `review.md:94` and the presentation table rows at `deep-research-presentation.txt:68` and `deep-review-presentation.txt:85` name both destinations. |
| R1-P2-006 | P2 | Fixed | `002-bind-single-entry-executors-to-single-path/spec.md:114` owns the `deep-ai-council` contract refresh as a generated drift fix. |
| R1-P2-005 | P2 | Fixed | `006-repair-speckit-workflow-gates/tasks.md:123` CHK-012 now allows exactly the `plan_clarity` row. I confirmed from `git diff` that this is the only change inside `quality_gates` (`speckit-implement.yaml:390`). |
| R3-P2-004 | P2 | Fixed | `006/implementation-summary.md:41` reads Complete with 28 of 28, consistent with `006/acceptance-criteria.md:92-94`. |
| R3-P2-001 | P2 | Fixed before 007 ran (007 dropped it correctly) | `004/implementation-summary.md:83,98` records AC-002 closed from `build-evidence.md:152`. No stale "blocked" text remains. |
| R3-P2-002 | P2 | Partly fixed | Phase rows at parent `spec.md:132-138` read Complete. But `spec.md:144` still says "Resume Phase 5 with /speckit:resume ...005-point-chat-sessions-at-authoring-card/". That is the exact impact the finding named, and 007's own scope row (`007/spec.md:111`, "advance the resume pointer") promised to fix it. |
| R4-P2-002 | P2 | Fixed for the shell; third variant left | `create.sh:24` defines `SPEC_AUTHORING_CARD_NEXT_STEP` and `:2209` and `:2418` echo it. The differently worded `spec-gate-core.mjs:178` sentence remains. It is a separate surface in another language, so that is acceptable, but it is still a second copy to keep in step. |
| SL-203 | security, deferred | Safe, closed correctly | 007's reasoning holds: a lineage label comes only through the schema (`executor-config.ts:820`, `:849-852`), which allows lowercase letters, digits and hyphens. `fanout-run.cjs:3575` joins it under `lineagesDir`. I did not fuzz it; I read the cited lines. |
| SL-204 | security, deferred | Wrongly fixed | The validator now runs at `deep-review-auto.yaml:1264`, which closes the trust gap. But the render hint at `deep-review-auto.yaml:1328-1330` tells the binder to expand `~` to HOME before binding, and `validateClaudeConfigDir` refuses an absolute path outside the repo before it ever checks the `.claude*` root (`cli-guards.cjs:106`, via `fanout-run.cjs:686`). See defect D1. |

## Checks I ran

| Command | Exit | Decisive output |
|---------|------|-----------------|
| `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts` | 0 | `Tests  182 passed (182)` |
| `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/stress/cli-adapter` | 0 | `Test Files  8 passed (8)`, `Tests  152 passed \| 8 skipped (160)` |
| `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` (repo root) | 0 | `[CONTRACT DRIFT] OK commands=3` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <P> --recursive --strict` | 0 | `RESULT: PASSED` for the parent and all seven children. Child 001 printed `Warnings: 2` (one unresolved `[SOURCE:]` in `iteration-002.md:33`, and a decision record at Level 1) and still passed under `--strict`. |
| Refusal probe: from a fresh directory under the session scratchpad in `/private/tmp`, `node <repo>/.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs --spec-folder specs/probe-pkt --loop-type research --fanout-config-json '{"executors":[{"label":"only-seat","kind":"cli-opencode","model":"opencode-go/glm-5.1","iterations":1}],"concurrency":1}' --base-artifact-dir specs/probe-pkt/research` | 3 | `{"status":"error","error":"fan-out refused: this research executor matrix expands to one lineage. Run the single-executor /deep:research workflow instead; ...","code":"INPUT_VALIDATION"}`. A file listing taken before and after showed no new file or directory beyond my own capture files, and nothing appeared in the repository. |
| Validator probe: `node -e` calling `validateClaudeConfigDir` with `~/.claude-alt`, `$HOME/.claude-alt`, `$HOME/.claude` and `.claude-local` | 0 | `~/.claude-alt` and `.claude-local` pass. `/Users/<me>/.claude-alt` and `/Users/<me>/.claude` fail with `configDir absolute path must stay inside the repository root`. |

I did not run the full deep-loop suite or the system-spec-kit `runtime/cli` suite. The figures quoted for those (2,884 passed; `npm test` exit 0) come from `scratch/remediation-evidence.md` and are the orchestrator's claims, not mine.

## Defects found in this pass

**D1 (P1). The SL-204 fix breaks home-directory config dirs on direct `/deep:review:auto` with `cli-claude-code`.** Evidence: `deep-review-auto.yaml:1264` calls `validateClaudeConfigDir(configDirInput)`. The render hint at `:1328-1330` says "expand a leading ~ to HOME and bind that path", so the bound value is absolute. `validateClaudeConfigDir` (`fanout-run.cjs:682-704`) first runs `validateNamespaceValue`, which throws for any absolute path outside the repository (`cli-guards.cjs:106`). Failure scenario: an operator runs `/deep:review:auto --executor=cli-claude-code --model=... --config-dir=~/.claude-account2`, the form documented at `deep-review-presentation.txt:466`. The binder renders `/Users/<me>/.claude-account2`, and the inline node script throws `configDir absolute path must stay inside the repository root` before the dispatch. Every iteration fails. Before this change the same run worked. The fan-out path is unaffected, because its JSON keeps the `~` form and the validator expands it after the namespace check. Child 002 makes this worse: a one-entry `--executors` matrix for `cli-claude-code` with a home `configDir` used to run through fan-out and now routes to this broken single-executor path. Child 007 met this exact failure in its new unit test. `scratch/remediation-evidence.md:56` concluded "the validator is right and the test was wrong", and edit-T029 changed the test input from an absolute home path to `~/...` (`fanout-run.vitest.ts:2623-2635`), so the test now passes while production input still fails. Fix: either drop the `~`-expansion render hint so the validator gets `~/...`, or let the validator accept an absolute path under `os.homedir()` whose top segment is `.claude*` before it applies the repository namespace rule. Then restore an absolute-home-path case in the test.

**D2 (P2). The direct-runner opt-in is advertised in the command pages a chat session reads, in a table that calls it a workflow input.** Evidence: `research.md:105-109` says "Every flag below is a workflow input", and `:123` lists `--allow-single-lineage`. `review.md:95` does the same. The workflow never reads or forwards this flag: it is missing from the input list at `research.md:97`, and no YAML passes it. The research and child 003 deliberately kept the flag out of the refusal message so that a refused session goes back to the workflow (`scratch/phase-facts.md:32`). Failure scenario: a chat session that hits the refusal searches the command page it already has open, finds the flag listed as a normal input, adds it and runs the one-lineage loop without init, synthesis or save. That is the incident route the refusal exists to stop. The compiled contracts carry the same row, so `/deep:*` runs load it too. Fix: move the row out of the workflow flag table into a short "direct runner callers" note, or keep it only in `fanout-dispatch.md` and the runbook.

**D3 (P2). Write verbs in the IMPLEMENT intent can push PLAN out of the router selection.** Evidence: `ROUTER.md:163` gives IMPLEMENT ten keywords at weight 3. `select_intents` (`references/cli/shared-smart-router.md:81-88`) keeps a second intent only when it is within 1.0 of the top score. Failure scenario: "write a plan and update the spec" scores IMPLEMENT 6 (`write`, `update`) against PLAN 3 (`plan`), so only IMPLEMENT loads. `level-decision-matrix.md`, `level-selection-guide.md` and `folder-structure.md` are no longer loaded for a planning request that loaded them before. The card still loads, because both intents map it. The review ruled out collisions between keyword arrays but did not test score displacement. The two router docs also disagree on how matching works: `ROUTER.md:326` says substring, `shared-smart-router.md:69` says word boundary. Under substring matching, "add" would also fire on "address" and "fix" on "prefix". Fix: measure on a prompt sample before shipping, or drop the generic verbs to a lower weight.

**D4 (P2). Child 007's own closure records contradict each other.** Evidence: `007/acceptance-criteria.md:48` says Status Draft, `:14-15` says "replay audit remains open" with `completion_pct: 80` at `:25`, and `:26-27` keeps an open question, while `:90` says Closeable Yes. `007/spec.md:171` still says "child 007 remains pending" and that the parent "resumes at phase 5", and `:216` lists the replay mismatches as unresolved. `007/implementation-summary.md:29` marks that question answered. AC-001 and AC-002 (`007/acceptance-criteria.md:61-62`) cite the 179-test run in `build-evidence.md:154`, which predates every 007 edit. The run that covers 007's new tests is the 182-test rerun at `remediation-evidence.md:62`. Parent `spec.md:144` (stale resume pointer, as above), `:176` ("six numbered child folders"; there are seven) and `:48` (Status Draft beside seven Complete rows) are the same class of drift. Failure scenario: a `/speckit:resume` from the parent lands on a closed phase 5, and a closure check that reads 007's AC metadata reports it as Draft at 80 percent. Strict validation does not catch any of this.

## Known limits

- **The `--count=2` route past the refusal.** A matrix that expands to two lineages, even the same executor twice, passes `fanout-run.cjs:3401` and runs with no init, synthesis or save, sharing one process per lineage. `deep-research-auto.yaml:1216` still suggests "rerun with --count=2" for DeepSeek Harness. This is scoped out at parent `spec.md:86`. I read it from the code and did not run it, to avoid spawning executors.
- **The refusal is a speed bump, not a fence.** Anyone who passes the opt-in or writes iteration files by hand skips the workflow, as research section 8 admits. With D2, the opt-in is easy to find.
- **No live chat session was measured.** The parent open question at `spec.md:167` stands. The advisor did not pick system-spec-kit for a plain write prompt when it was measured on 2026-11-11, and nothing since shows that it does.
- **005 AC-001 was closed by reconstruction.** The requirement was to check each carrier's reach before editing it. The evidence is HEAD reads and a driver comparison recorded afterwards, accepted by the orchestrating session under goal D1 (`scratch/build-evidence.md:161-163`), not by the operator.
- **007's edit replay cannot be reproduced.** Five edit packets (T014, T015, T019, T024, T028) no longer replay against the tree, because later child 006 closeout text overwrote them. Only the orchestrator's apply-time "exact match True" vouches for them.
- **The workflow-gate repairs are prose for a model to read.** `plan_design_choices: none` and the `plan_clarity` criteria string at `speckit-implement.yaml:390,559` are read by a model, not run by an engine, so whether they stop a bad plan depends on the session honouring them.
- **The `quality_gates`, `circuit_breaker` and `default_level` removals remain open.** They wait on the operator under goal D7.
- **The cold-read question itself is still open.** Whether a fresh reader's findings predict real deviations (parent `spec.md:165`) was never measured. The research chose a decidable plan-line shape in place of a cold-read step.

## What reaches a chat session

Most users chat and never type a command. Measured against that:

**Reaches a plain chat session:**
- **The `fanout-run.cjs` refusal (003, 007).** It fires for any caller of the script, chat session or not. It is the only change here that blocks rather than advises, and it is the one that would have stopped the incident.
- **The spec-gate notice sentence (005).** `spec-gate-core.mjs:178` is shown at the first Write or Edit of a non-child session on the hooked runtimes, but only while the gate is open and has not yet been delivered (`evaluateMutation`, `spec-gate-core.mjs:1797-1809`). A session that binds a folder before its first write never sees it.
- **The plan template FILL comment (004).** It reaches a chat session that scaffolds through `create.sh`, because the comment lands in the new `plan.md`. A session that writes `plan.md` by hand never sees it.
- **The `create.sh` step 0 (005).** It reaches a chat session only when that session runs `create.sh`.

**Reaches a chat session only if it already opened system-spec-kit:**
- **The `ROUTER.md` write verbs and the card example (004, 005).** The skill advisor did not pick system-spec-kit for a plain write prompt when measured (child 001 `scratch/trust-checks.md`), so on that path these never load.

**Does not reach a plain chat session:**
- **The executor-binding wording (002), the opt-in documentation and `config.maxIterations` wording (007) and the `deep-review-auto.yaml` validator (007).** These load only when `/deep:research` or `/deep:review` runs, or when a session happens to read the page.
- **All of child 006.** `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml` load only under `/speckit:implement`, `/speckit:complete` and `/speckit:plan`.

Measured against the operator's goal, the packet delivers one hard control that reaches chat, the refusal, plus three advisory pointers that reach chat only on specific paths. The `/speckit:*` gate repairs, which most closely track the original "fresh reader can check the plan" idea, reach only command users.

## Follow-up After This Synthesis

The orchestrating session closed all four defects above in phase 007 (`007-fix-deep-review-p2-findings-for-plan-check-builds/spec.md`, Synthesis Follow-up). D1: `validateClaudeConfigDir` now accepts the absolute home form the review workflow renders and still refuses any path outside `~/.claude*` or a repository `.claude*` folder; the unit case asserts both. D2: the `/deep:*` flag tables no longer list `--allow-single-lineage`. D3: the six write verbs moved to a WRITE intent at weight 1 that loads only the card, so "write a plan and update the spec" keeps PLAN first. D4: the phase 007 acceptance metadata, its stale spec lines and the parent's resume line and child count are reconciled. This section was added by the orchestrator, not by the synthesis author.

---
title: "Tasks: Offer the right deep-loop command and flags from explicit loop wording"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep loop command offers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Offer the right deep-loop command and flags from explicit loop wording

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell names used below. `PKT` is `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `PROBE` is the command `node $PKT/scratch/probes/probe.mjs $PKT/scratch/probes/probes-spec-baseline.json $PKT/scratch/probes/results-after.json`, run from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the operator decisions before any edit (`$PKT/scratch/decisions.md`). Verify: `rg -c '^\| D[0-9]' $PKT/scratch/decisions.md` prints 11. Observed 2026-11-24: prints 11, where it read 9 when the task was ticked, because D10 joined after the first landing and D11 after the fresh review.
- [x] T002 Capture the 69-probe baseline with the advisor code unmodified (`$PKT/scratch/probes/results-spec-baseline.json`). Verify: `git status --short .skilled/skills/system-skill-advisor` prints nothing, and the run in `spec.md` Measured Behavior shows `exit 0 live` on all 69 lines.
- [x] T003 Capture the corpus counts at the pre-change commit `2ef3895f753`, in a clean checkout, because the advisor code in this worktree was already edited when the docs were written (`$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`). Verify: a run without `--write` prints `false_offer` and `false_offer_attached`, and both counts plus `capturedAtSha` are saved to `$PKT/scratch/corpus-before.json`. Observed 2026-11-23: run without `--write` in a clean detached checkout at `2ef3895f753` after a full build. `capturedAtSha` prints `2ef3895f753`, `false_offer` 0 of 35 and `false_offer_attached` 0 of 35, saved to `$PKT/scratch/corpus-before.json`. The baseline committed at that commit gives the same counts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A: advisor code
- [x] T004 Replace the depth-word gate with an explicit loop-ask test, and let one mode cue resolve a deferred hub route (`$ADV/lib/command-attach.ts`). Verify: `PROBE` shows `cmd=/deep:review` on V6, H1a and E3, and `cmd=/deep:research` on H1b and E1. Observed 2026-11-23: `results-after.json` shows `/deep:review` on V6, H1a and E3 and `/deep:research` on H1b and E1.
- [x] T005 Remove `ask the council`, `convene` and `several models` from `DEPTH_WORDING`, and drop the depth-only words from the gate (`$ADV/lib/command-attach.ts`). Verify: `rg -n "'convene'|'several models'|'ask the council'" $ADV/lib/command-attach.ts` prints nothing. Observed 2026-11-23: prints nothing.
- [x] T006 Add the stage-one rule for explicit loop wording beside a research or review cue, and delete the `several models` boost (`$ADV/lib/scorer/lanes/explicit.ts`). Verify: `rg -n "'several models'" $ADV/lib/scorer/lanes/explicit.ts` prints nothing, and `PROBE` shows H3b with a top row other than `system-deep-loop`. Observed 2026-11-23: prints nothing, and H3b tops no skill in `results-after.json`.
- [x] T007 Add a gate case per loop-ask clause and an `undefined` case per depth word (`$ADV/tests/command-attach.vitest.ts`). Verify: `npx vitest run tests/command-attach.vitest.ts` in `$ADV` reports 0 failed. Observed 2026-11-23: the whole advisor suite, which runs this file, reports 0 failed (see T030).
- [x] T008 Add near-miss rows for N7, N9, D1, V7, H6 and A3 (`$ADV/scripts/routing-accuracy/command-prompts.jsonl`). Verify: `rg -c '"row_type":"near-miss"' $ADV/scripts/routing-accuracy/command-prompts.jsonl` prints the earlier count plus 6. Observed 2026-11-23: the first-round recapture counted 41 rows, the 35 earlier rows plus these 6 (`implementation-summary.md` Verification). Later rounds added more, so the count is now 31 against 9 before the packet.
- [x] T009 Rebuild the advisor `dist` (`$ADV/dist/`). Verify: `npm run build` in `$ADV` exits 0, and `PROBE` prints `live` on every line. Observed 2026-11-23: `npm run build` exit 0, and the probe rerun prints `exit 0 live` on all 69 lines.
- [x] T010 Recapture the routing baseline (`$ADV/scripts/routing-accuracy/command-routing-baseline.json`). Verify: `node $ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs --write` exits 0, and `false_offer` over the earlier rows equals the T003 count. Observed 2026-11-23: `false_offer` 0 of 57. Over the 35 earlier rows it is 0, equal to T003.

### Lane B: deep command docs
- [x] T011 [P] Add the `### Offer From an Advisor Brief` section with its flag table (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -n 'Offer From an Advisor Brief|--spec-folder=<the Gate 3 answer>' .skilled/commands/deep/assets/deep-research-presentation.txt` prints both. Observed 2026-11-23: prints both, the `### Offer From an Advisor Brief` heading and the `--spec-folder=<the Gate 3 answer>` offer sentence.
- [x] T012 [P] Add the same section with review's names, target type, `--review-focus` row and fan-out verdict note (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n 'Offer From an Advisor Brief|--review-focus' .skilled/commands/deep/assets/deep-review-presentation.txt` prints both. Observed 2026-11-23: prints both.
- [x] T013 [P] Add step 0 of MODE ROUTING pointing at the offer section (`.skilled/commands/deep/research.md`). Verify: `rg -n 'Offer From an Advisor Brief' .skilled/commands/deep/research.md` prints one line. Observed 2026-11-23: prints one line, step 0 of `MODE ROUTING`.
- [x] T014 [P] Add the same step 0 (`.skilled/commands/deep/review.md`). Verify: `rg -n 'Offer From an Advisor Brief' .skilled/commands/deep/review.md` prints one line. Observed 2026-11-23: prints one line, step 0 of `MODE ROUTING`.
- [x] T015 Replace step 6 with the question-tool sentence and mark Q2 Autonomous and Q-Exec Native recommended (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/deep-research-presentation.txt` prints 0, and `rg -n 'Autonomous \(Recommended\)|Native \(Recommended, default\)'` prints two lines. Observed 2026-11-23: prints no match, and both recommended lines print, the `A) Autonomous (Recommended)` row and the `A) Native (Recommended, default)` row.
- [x] T016 Make the same setup changes (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/deep-review-presentation.txt` prints 0. Observed 2026-11-23: prints nothing.
- [x] T017 Rewrite the completed-packet message to name `--extend=N` and `--restart`, and add the `--extend=N` next step (`.skilled/commands/deep/assets/deep-research.yaml`). Verify: `rg -n 'rerun with --extend=N' .skilled/commands/deep/assets/deep-research.yaml` prints at least one line. Observed 2026-11-23: prints the completed-packet message "Completed deep-research packet detected. To add iterations to this run, rerun with --extend=N."
- [x] T018 Add the `--extend=N` next step (`.skilled/commands/deep/assets/deep-review.yaml`). Verify: `rg -n -- '--extend=N' .skilled/commands/deep/assets/deep-review.yaml` prints one line. Observed 2026-11-23: prints the Next Steps row "--spec-folder={spec_folder} --extend=N (when the stop reason is maxIterationsReached ...)". Later rounds added the flag notes, so it now prints six lines.
- [x] T019 Add the `--extend=N` and `/doctor:deep-loop --scope=research` Next Steps rows, and write the example flags with `=` (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -n 'doctor:deep-loop --scope=research|--max-iterations=5 --convergence=0.10' .skilled/commands/deep/assets/deep-research-presentation.txt` prints both. Observed 2026-11-23: prints both.
- [x] T020 Add the `--extend=N` and `/doctor:deep-loop --scope=review` Next Steps rows (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n 'doctor:deep-loop --scope=review' .skilled/commands/deep/assets/deep-review-presentation.txt` prints one line. Observed 2026-11-23: prints one line.

### Lane C: deep-loop skill docs and hub routing
- [x] T021 [P] Add the sentence that names `/doctor:deep-loop` for a run whose graph or convergence looks wrong (`.skilled/skills/system-deep-loop/SKILL.md`). Verify: `rg -n 'doctor:deep-loop' .skilled/skills/system-deep-loop/SKILL.md` prints at least one line. Observed 2026-11-23: prints the sentence "Use `/doctor:deep-loop` to diagnose a run whose coverage graph or convergence looks wrong."
- [x] T022 Add `iterative research`, `multi-round research` and `autonomous research` to the research aliases (`.skilled/skills/system-deep-loop/hub-router.json`). Verify: `rg -c '"(iterative|multi-round|autonomous) research"' .skilled/skills/system-deep-loop/hub-router.json` prints 3. Observed 2026-11-23: prints 1 line holding two aliases. `autonomous research` was dropped after its out-of-domain replay pulled a slide-deck prompt to the hub (operator decision D8).
- [x] T023 Mirror the three aliases in the stage-two control document (`.skilled/skills/system-deep-loop/ROUTER.md`). Verify: `rg -c 'multi-round research' .skilled/skills/system-deep-loop/ROUTER.md` prints at least 1. Observed 2026-11-23: prints 1.
- [x] T024 Regenerate the hub intent signals and activation manifest (`.skilled/skills/system-deep-loop/graph-metadata.json`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` names `system-deep-loop` in its subject line and reports no failure. Observed 2026-11-23: `OK: parent-skill-check — all hard invariants passed, 0 warnings`.
- [x] T025 [P] Remove `comprehensive research` and `deep investigation`, and point the Gate 2 line at the advisor CLI (`.skilled/skills/system-deep-loop/deep-research/SKILL.md`). Verify: `rg -n 'comprehensive research|deep investigation|skill_advisor\.py' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints nothing. Observed 2026-11-23: prints nothing.
- [x] T026 [P] Remove `audit spec folder` and `pre-release review`, and attach the `:auto` invoke form (`.skilled/skills/system-deep-loop/deep-review/SKILL.md`). Verify: `rg -n 'audit spec folder|pre-release review|/deep:review :auto' .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints nothing. Observed 2026-11-23: prints nothing.
- [x] T027 [P] Write the example flags with `=` (`.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md`). Verify: `rg -n -- '--max-iterations 15' .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` prints nothing. Observed 2026-11-23: prints nothing.
- [x] T028 Regenerate the compiled contracts from the edited sources (`.skilled/commands/deep/assets/compiled/`). Verify: `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/compiled/deep-research.contract.markdown` prints 0. Observed 2026-11-23: prints no match, exit 1.

### Lane H: fresh holdout rows
- [x] T029 Replace the three deep-family `holdout` rows with fresh prompts, written after lane A's tuning and without reading the old rows (`$ADV/scripts/routing-accuracy/command-prompts.jsonl`). Verify: `git diff` on the file shows three removed and three added deep-family rows with `"split":"holdout"`. Observed 2026-11-23: against `2ef3895f753`, 3 deep-family holdout ids removed and 3 added, counted by id without reading the rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run the whole advisor suite (`$ADV`). Verify: `npx vitest run` in `$ADV` reports 0 failed. Observed 2026-11-23 on `958fa817187` after `npm run build`: 180 files, 2622 passed, 4 skipped, 0 failed, exit 0.
- [x] T031 Rerun the probe set with the same file (`$PKT/scratch/probes/results-after.json`). Verify: `PROBE` shows the gain group with its command, R7 with `cmd=-`, and the keep and negative groups matching the baseline block line for line on top skill and `cmd=`. Observed 2026-11-23 on `958fa817187` (`$PKT/scratch/probes/results-final-958fa81-worktree.json` and `results-final-958fa81-primary.json`): every gain, stage-one and lose line keeps its command, R7 shows `cmd=-` and every `/deep:*` row keeps policy `ask`. One negative row differs per checkout, with no command in either: in the worktree H5 tops `sk-doc` over `sk-code` by 0.000004, and in the primary checkout N12 tops the operator's private `local-webflow` skill. No advisor code changed after the committed rerun.
- [x] T032 Record the stage-one group and N9 outcomes (`implementation-summary.md`). Verify: `rg -n 'R2|V2|V4|H7|H10|N9' $PKT/implementation-summary.md` prints each id with its observed top row. Observed 2026-11-23: `implementation-summary.md` Verification, the closure-pass probe row, names each id with its top row.
- [x] T033 Check the runtime mirrors (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0. Observed 2026-11-23: `PASS: 260 mirrors across 10 trees are in sync.`
- [x] T034 Check the command references (`.skilled/commands/scripts/validate-command-references.cjs`). Verify: `node .skilled/commands/scripts/validate-command-references.cjs` exits 0. Observed 2026-11-23: `OK command references resolve across 84 asset file(s)`, exit 0.
- [x] T035 Replay each new alias against an out-of-domain prompt (`$PKT/scratch/probes/`). Verify: a user-research or product-research prompt holding each alias does not top `system-deep-loop`. Observed 2026-11-23: `results-ac017-ood.json`, three of four replays stay off the hub. "write a memo on multi-round research funding for the grant committee" tops it with no command, and the operator kept the alias (ADR-002, AC-017 Waived).
- [x] T036 Validate the packet (`$PKT`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PKT --strict` prints `RESULT: PASSED`. Observed 2026-11-23: `RESULT: PASSED`, Errors 0, Warnings 0.

### Review fix round

Built in worktree `worktrees/522-deep-loop-offer-review-fixes`. The 31 probes are `$PKT/scratch/probes/review-fix-cases.json`: `review-fix-base.json` is the run before the fix and `review-fix-final.json` the run after it.

- [x] T037 Count convergence and a coverage graph as a deep run only beside a review or research noun (`$ADV/lib/command-attach.ts` `LOOP_RUN_SUBJECT`, Python `_LOOP_RUN_SUBJECT_RE`). Verify: probes S1 to S3 carry no `/doctor:deep-loop`, and S4 and S5 keep it. Observed in `review-fix-final.json`.
- [x] T038 Read continue, resume, extend and restart before a loop name as a loop ask (`LOOP_REQUEST`, `_LOOP_REQUEST_RE`). Verify: C1 gets `/deep:review`, and C2 and C3 get `/deep:research`. Observed.
- [x] T039 Let an explicit run ask that comes first, or opens its own clause, outrank the past-run and writing-about readings, at the producers `isPastRunRead` and `isWritingAboutTopic` (and their Python copies). Verify: X1 to X4 carry their command, and X5 ("write a blog post about how to run a deep review") and X6 carry none. Observed.
- [x] T040 Apply the back-pointing look-behind to digit counts, count one only as "one more", leave "after N iterations" a description unless "stop" comes first, read "needed more iterations" as a description, and read "rounds of the X" as the subject. Verify: N1 to N8 carry no deep command, and N9 and N10 keep `/deep:review`. Observed.
- [x] T041 Keep "set up a … loop for X" and a loop name behind a preposition or clause word off the loop ask. Verify: V1 and V2 carry no `/deep:review`, and V3 keeps `/deep:research`. Observed.
- [x] T042 Name the mode from the loop unit before counting cues, read the -ing cue, and let "run one" after a question ask for the loop. Verify: M1 gets `/deep:research`, M2 and M3 get `/deep:review`, and M4 stays a question. Observed.
- [x] T043 Withhold the `/doctor:deep-loop` command row on a prompt that names no deep run (`$ADV/lib/scorer/fusion.ts` `withholdDeepLoopDoctorWithoutRun`). The operator chose this guard. Verify: N4 tops nothing. The new `doctor-handoff-command.vitest.ts` case fails with the guard line removed and passes with it.
- [x] T044 Add each prompt to the shared fixture and the guard tests (`$ADV/tests/fixtures/deep-loop-offer-cases.json`, `$ADV/tests/command-attach-guards.vitest.ts`). Verify: the fixture holds 54 cases. The Python suite prints `cases=54` and `pass=130, fail=0`. A TypeScript and Python predicate comparison over 58 prompts shows drift 0.
- [x] T045 Correct the loop-ask wording in both offer sections and the v4.2.0.0 changelog, and regenerate the compiled contracts (`.skilled/commands/deep/assets/`, `.skilled/changelog/skilled/v4.2.0.0.md`). Verify: `rg -n 'says "iterations", "iterative"' .skilled/commands/deep/assets` prints nothing, and both `compile-command-contracts.cjs --write` runs exit 0.
- [x] T046 List the offer flags in the `/deep:*` argument hints (`.skilled/commands/deep/research.md`, `review.md` and the copy in `.skilled/skills/system-deep-loop/command-metadata.json`). Both hints gain `--stop-policy`, `--lineage-mode` and `--extend-minutes`, review gains `--review-focus`, and `--model`, `--reasoning-effort` and `--count` nest under `--executor`. The operator chose this (Q013). Verify: `validate_document.py` reports only the soft budget warning on each file, the mirror sync check passes 260 mirrors, the catalog mirror check prints `STATUS=OK`, and both contracts recompile with exit 0.
- [x] T047 Add nine near-miss rows and recapture the corpus (`$ADV/scripts/routing-accuracy/`). Verify: `false_offer` is 0 of 57 (was 0 of 48) and `false_offer_attached` is 1 of 57 (the V7 row, unchanged). The baseline diff holds only the nine rows, the totals and the hashes.
- [x] T048 Skip a run ask that a negation within two words before it forbids, so "but do not run another deep review" leaves the past-run reading in force (`RUN_ASK_NEGATED` in `$ADV/lib/command-attach.ts`, `_RUN_ASK_NEGATED_RE` in Python). Verify: probes G1 and G2 carry no deep command and G5 keeps `/deep:review`.
- [x] T049 Let a round take one named review after "of", with its determiner and nothing after it but a preposition or clause word, so "run 3 rounds of the security audit" asks for the loop while "3 rounds of peer review", "rounds of the peer review process" and "rounds of the clinical trial results" stay subjects (`PASS_NOUN`, `_LOOP_PASS_NOUN`). Verify: probes G3, G4, R6 and R9 get `/deep:review`, R1 to R5, R7 and R8 get no deep command, and main also gave R1 to R5 none.
- [x] T050 Add the G and R prompts to the shared fixture and name the run-ask outranking in `$ADV/lib/README.md`. Verify: the fixture holds 63 cases, the Python suite prints `cases=63` and `pass=130, fail=0`, and a TypeScript and Python predicate comparison over 72 prompts shows drift 0.
- [x] T051 Work every acceptance row against its own check and record the evidence (`acceptance-criteria.md`). Add gate cases for "thoroughly", "exhaustive" and "deep dive" (`$ADV/tests/command-attach-guards.vitest.ts`). Record the AC-019 supersession and the AC-017 alias choice (`decision-record.md` ADR-001, ADR-002). Verify: 18 rows `Met`, AC-019 `Superseded`, and AC-008 and AC-017 `Unmet` with their reason in the closure statement. Later rounds added rows to the table, and each round's own task records the rows it added (T062, T083).
- [x] T052 Name the three offer options in step 0 of both command documents and send a composed flag into option A from the flag table (`.skilled/commands/deep/review.md`, `.skilled/commands/deep/research.md`). Rerun F6 outside plan mode before and after the edit (`scratch/behaviour/F6.md`, `scratch/behaviour/F6-after-step0.md`). Verify: the drift check and its tests pass, and AC-008 records both runs.
- [x] T053 Sample F6 three more times after the routing-step edit (`scratch/behaviour/F6-sample-1.md` to `F6-sample-3.md`). Verify: AC-008 reads `Met` with the 1 of 4 rate stated in the row.
### Fresh review round

Reopened 2026-11-23 after a fresh review. Built in worktree `worktrees/529-deep-loop-offer-gate-fixes`. `HOOK` sends one prompt through `.skilled/hooks/skill-advisor/claude/user-prompt-submit.js` and prints the brief's first line.

- [x] T054 Withhold the command when a refusal leads the loop ask: "don't", "do not", "never", "no need to", "not asking for", "no" before the loop name, and "is not needed" after it (`$ADV/lib/command-attach.ts` `asksForLoopRun`, `_asks_for_loop_run` in Python). Verify: `HOOK` on the six REQ-015 refusals prints no `/deep:` command, and the control keeps `/deep:review`. Observed 2026-11-23 (`scratch/probes/fresh-review-hook.txt`): the six refusals print no `/deep:` command, and "do a deep review of the parser" keeps `/deep:review`.
- [x] T055 Add "how many" to the question reading (`LOOP_QUESTION`, its Python copy). Verify: `HOOK` on both REQ-016 questions prints no `/deep:` command. Observed (`scratch/probes/fresh-review-hook.txt`): both questions print no `/deep:` command.
- [x] T056 Accept `deep-review` and `deep-research` in the loop wording, and fold curly apostrophes before the run-ask and writing-about tests (`LOOP_WORDING`, `asksForLoopRun`, `isWritingAboutTopic`, Python copies). Verify: `HOOK` on both REQ-017 prompts prints their commands. Observed (`scratch/probes/fresh-review-hook.txt`): the hyphen prompt prints `/deep:review` and the curly-apostrophe prompt `/deep:research`.
- [x] T057 Skip a symptom that a negation leads, and let a counted run ask cancel the stuck reading (`LOOP_RUN_SYMPTOM`, `isStuckRunComplaint`, Python copies). Verify: `HOOK` on the REQ-018 prompt prints `/deep:research` and no `/doctor:deep-loop`. Observed (`scratch/probes/fresh-review-hook.txt`): `/deep:research`, no `/doctor:deep-loop`.
- [x] T058 Treat a loop name followed by a code, file or result noun, or led by an edit or fix verb, and a count that describes a subject, as no ask (`command-attach.ts`, Python copies). Verify: `HOOK` on the nine REQ-019 subject prompts prints no `/deep:` command, and the three controls keep theirs. Observed (`scratch/probes/fresh-review-hook.txt`): the nine subject prompts print no `/deep:` command, and the three controls keep theirs. Probe H10 ("a multi-pass security and correctness audit") first lost its command, so up to three words may now stand before the loop noun.
- [x] T059 Mirror the TypeScript mention and boundary rule in the Python typed check (`$ADV/scripts/skill_advisor.py`). Verify: the four REQ-020 prompts give the same result from both gates. Observed: fixture field `typedReviewKept` on the four prompts plus a typed control, read by both suites. `attachCommand` returns no command, no command, no command, `/doctor:deep-loop` and `/deep:review`, and the Python gate drops, drops, drops, drops and keeps the row.
- [x] T060 Add every REQ-015 to REQ-020 prompt to the shared fixture and the guard tests (`$ADV/tests/fixtures/deep-loop-offer-cases.json`, `$ADV/tests/command-attach-guards.vitest.ts`). Verify: the Python suite and `npx vitest run` in `$ADV` report 0 failed, and the predicate comparison shows drift 0. Observed in the fresh-review round: fixture 98 cases, Python `cases=98` and `pass=130, fail=0`, `npx vitest run` 180 files, 2696 passed, 4 skipped, 0 failed, TypeScript and Python predicates agree on 227 prompts (drift 0).
- [x] T061 Rerun the 69 probes and recapture the corpus (`scratch/probes/`). Verify: every gain, keep and stage-one line keeps its command, and `false_offer` stays 0. Observed: `scratch/probes/results-fresh-review.json`, 69 lines `exit 0 live`, 0 changes against `results-final-958fa81-worktree.json`. Corpus `false_offer` 0 of 57. One aggregate moved, a holdout refusal row that no longer carries a command (`fit.decline.byKind.refusal.carried` 3 to 2), so the baseline was rewritten with `--write`, as the ratchet test asks for an intended change.
- [x] T062 Record AC-008 as waived (`acceptance-criteria.md`, `decision-record.md` ADR-003). Verify: AC-008 reads `Waived` with `ADR-003`, and ADR-003 exists. Observed: AC-008 reads `Waived` with `ADR-003`, and ADR-003 is in `decision-record.md`.
- [x] T063 Correct the changelog (`.skilled/changelog/skilled/v4.2.0.0.md`). Verify: it no longer claims refused asks were skipped before this round, it names the brief change, and it quotes the final suite count. Observed: the changelog states the refusal rule as built, names the brief options and the typed `(ask)`, and quotes the suite count of the round its row belongs to; that row has since been corrected to the eighth-round 3,188 passed (T092). `implementation-summary.md` no longer says spelled-out refusals were skipped before this round.
- [x] T064 Validate the packet (`$PKT`). Verify: `validate.sh $PKT --strict` prints `RESULT: PASSED`. Observed 2026-11-23: `RESULT: PASSED`, AC coverage 29 of 29.

### Sixth fix round

Reopened 2026-11-24 after a three-lineage deep review (`$PKT/review/review-report.md`) returned FAIL on its coverage gate. The operator asked for the round to run autonomously (Q035). Built in worktree `worktrees/533-deep-loop-offers-deep-review`. The shared gate files (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`, `$ADV/tests/fixtures/deep-loop-offer-cases.json`) are edited by the serial lanes S1 to S4 in that order. Lanes P1 to P4 own disjoint files and run beside them. Every behaviour change lands in both gate copies with a shared fixture case. `TESTS` is `npx vitest run <files>` in `$ADV`, and `PY` is `python3 tests/python/test_skill_advisor.py` in `$ADV`.

- [x] T065 Record the typed-on-stuck exception and the bare-loop-name decision (`spec.md` REQ-020, SC-005 and the D2 bullet, `acceptance-criteria.md` AC-027 and AC-008, `decision-record.md` ADR-005, ADR-006, Q034 and Q035). Verify: `rg -n 'ADR-005' $PKT/spec.md $PKT/acceptance-criteria.md` prints the REQ-020, SC-005 and AC-027 lines, and AC-008's cell no longer says "accepted that as Met". Observed 2026-11-24 in the planning pass.

#### Lane S1: refusal vocabulary (serial, first)
- [x] T066 Add the refusal leads `skip` (not before "to", "straight to", "right to", "ahead to" or "directly to"), `avoid`, `instead of`, `rather than`, `no need for`, `refuse`/`refused` (with an optional "to") and `(?:do not|don't|never) even (?:think about|consider)` to `RUN_ASK_NEGATED` and `_RUN_ASK_NEGATED_RE`, keeping the two-word gap (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`). Verify: the REQ-023 refusals read `asksForLoopRun: false` and its three controls stay true in `TESTS tests/deep-loop-offer-cases.vitest.ts` and `PY`. Observed 2026-11-24: the leads sit in the exported `RUN_ASK_REFUSAL_LEADS` list (`command-attach.ts`), which builds `RUN_ASK_NEGATED_SOURCE`, and in `_RUN_ASK_REFUSAL_LEAD_LIST`, which builds `_RUN_ASK_NEGATED_RE` (`skill_advisor.py`). The fixture's seven refusal-verb rows read `false` (`tests/fixtures/deep-loop-offer-cases.json` rows `refusal-verb-skip`, `refusal-verb-avoid`, `refusal-verb-no-need-for`, `refusal-verb-instead-of`, `refusal-verb-refuse`, `refusal-verb-even-think` and `refusal-verb-refused-to`) and its five controls read `true` (rows `refusal-verb-skip-to-control`, `refusal-verb-hesitate-control`, `refusal-verb-forget-control`, `refusal-verb-conjunction-skip` and `refusal-verb-conjunction-avoid`), and both suites read that file: `TESTS` reports 11 files and 809 tests passed, `PY` `pass=136, fail=0`.
- [x] T067 Withhold `/doctor:deep-loop` on a stuck complaint that refuses any run or fix: an exported `RUN_REFUSED` pattern read by the stuck branch of `attachCommand` and by `withholdDeepLoopDoctorWithoutRun`, and a Python copy that drops `command-doctor-deep-loop` in `_apply_deep_loop_offer_gate` (`$ADV/lib/command-attach.ts`, `$ADV/lib/scorer/fusion.ts`, `$ADV/scripts/skill_advisor.py`). Verify: the fixture field `doctorWithheld` passes in both suites, and a `tests/scorer/doctor-handoff-command.vitest.ts` case covers the fused row. Observed 2026-11-24: `RUN_REFUSED` is exported in `command-attach.ts`, read by the stuck branch of `attachCommand` through `isRunRefused` and by `withholdDeepLoopDoctorWithoutRun` (`lib/scorer/fusion.ts`), with `_RUN_REFUSED_RE` read by `is_run_refused` (`skill_advisor.py`). The fixture's 47 `doctorWithheld` rows pass in both suites (`tests/fixtures/deep-loop-offer-cases.json`), and `tests/scorer/doctor-handoff-command.vitest.ts` covers the withhold step in `it "withholds the doctor on %s"` while `it 'passes the deep-loop doctor on "%s": %s'` covers the fused row.
- [x] T068 Add the REQ-023 and REQ-024 prompts to the shared fixture and the guard tests (`$ADV/tests/fixtures/deep-loop-offer-cases.json`, `$ADV/tests/command-attach-guards.vitest.ts`, `$ADV/tests/python/test_skill_advisor.py`). Verify: `TESTS tests/deep-loop-offer-cases.vitest.ts tests/command-attach-guards.vitest.ts tests/scorer/doctor-handoff-command.vitest.ts` and `PY` report 0 failed. Observed 2026-11-24 in the sixth round: the fixture then held 203 cases, `tests/command-attach-guards.vitest.ts` adds the refusal-verb group on a review route in `it "withholds the %s command on a refused run: %s"`, and `PY` then printed `cases=203` and `pass=136, fail=0`. The targeted vitest run over the eleven touched files then reported 11 files and 809 tests passed, exit 0. The shared fixture held 285 cases after the eighth round (T092) and holds 359 on the final tree, where `PY` prints `cases=359`.

#### Lane S2: single-site gate fixes (serial, second)
- [x] T069 Keep a typed deep command beside a second typed command: export `typedCommandsIn` (every typed key, longest at one start index), read it in the deep gate of `attachCommand` and in `typedCommandForTop`, and leave `typedCommandIn` unchanged (`$ADV/lib/command-attach.ts`). Verify: the two REQ-025 fixture rows keep `/deep:review` in both suites. Observed 2026-11-24: `typedCommandsIn` (`command-attach.ts`) lists every typed key in order, `typedCommandForTop` walks it, the deep gate of `attachCommand` reads it, and `typedCommandIn` still answers its longest key. The two REQ-025 rows (`tests/fixtures/deep-loop-offer-cases.json` rows `typed-two-commands-changelog` and `typed-two-commands-doctor`) keep `/deep:review` through `typedRunsKept` in both suites, and `tests/scorer/multi-typed-command-gates.vitest.ts` adds four route cases.
- [x] T070 Skip a `NAMED_LOOP_MODE` match that `namesLoopSubject` reads as the subject, and add the -ing forms to `DEFECT_CHECK` (`$ADV/lib/command-attach.ts`, and a Python mode-cue copy if one exists). Verify: the two REQ-026 deferred-route guard cases return `/deep:review`. Observed 2026-11-24: `loopAskCues` blanks a `NAMED_LOOP_MODE` match that `namesLoopSubject` reads as the subject (`command-attach.ts`), and `DEFECT_CHECK` reads the verbs in `DEFECT_CHECK_VERBS`: `checking`, `inspecting`, `scanning`, `examining`, `going over` and `looking over`. Both cases return `/deep:review` (`tests/command-attach-guards.vitest.ts` `it "names the review mode on a deferred route: %s"`). The Python fallback carries its own copy — `_MODE_CUE_WORDS` and `_MODE_CUE_PATTERNS` over `_RESEARCH_MODE_CUE_LIST` and `_REVIEW_MODE_CUE_LIST`, with `_DEFECT_CHECK_PATTERN` built from `_DEFECT_CHECK_VERB_LIST` and `_DEFECT_CHECK_NOUN_LIST` — and `VOCABULARY_PAIRS` compares those lists with the native ones.
- [x] T071 Keep a typed run row on a stuck complaint in `_apply_deep_loop_offer_gate`, add the fixture column `servedReviewKept`, read it in TypeScript through `attachTypedCommand` and in Python from the gate, and keep `typedReviewKept` as the `attachCommand` layer (`$ADV/scripts/skill_advisor.py`, fixture, `$ADV/tests/deep-loop-offer-cases.vitest.ts`, `$ADV/tests/python/test_skill_advisor.py`). Verify: typed-stuck reads `typedReviewKept: false` and `servedReviewKept: true`, and both suites pass. Observed 2026-11-24: `servedReviewKept` sits on every `typedReviewKept` case (`tests/fixtures/deep-loop-offer-cases.json`), TypeScript reads it through `attachTypedCommand` in `it "served: %s"` (`tests/deep-loop-offer-cases.vitest.ts`), and Python reads both the gate-kept run row and the served head in `test_deep_loop_offer_gate_parity` (`tests/python/test_skill_advisor.py`). The typed-stuck row reads `false` and `true` as asked.
- [x] T072 Emit `typed: true` on the deep run row the Python gate keeps because the prompt typed its command (`$ADV/scripts/skill_advisor.py`). Verify: a `PY` case on "/deep:review:confirm the auth module" finds `typed` on the `command-spec-kit-deep-review` row of the JSON output, and none on an untyped run ask. Observed 2026-11-24: `_apply_deep_loop_offer_gate` marks the kept row (`skill_advisor.py`), and `test_deep_loop_typed_run_row_marked` (`tests/python/test_skill_advisor.py`) finds `typed` on the `command-spec-kit-deep-review` row the JSON emit returns for that prompt, on the typed-stuck prompt, and none on an untyped run ask.
- [x] T073 Make `_is_loop_workflow_request` read the passes wording only where `asks_for_loop_run` or `is_stuck_run_complaint` holds, mirroring lane P2 (`$ADV/scripts/skill_advisor.py`). Verify: a `PY` case shows "several passes of the linter failed, review the config" is no loop workflow request and "review the parser in several passes" is one. Observed 2026-11-24: `_is_loop_workflow_request` gates its passes reading on those two predicates (`skill_advisor.py`), and `DEEP-LOOP-WORKFLOW: a pass count that reports past runs is no loop request` passes in `PY`.
- [x] T074 Pin the bare-loop-name rule (ADR-006) with the fixture row "deep loop: audit the payments flow", `asksForLoopRun: false`. Verify: both suites pass. Observed 2026-11-24: the row `bare-loop-name` (`tests/fixtures/deep-loop-offer-cases.json`) reads `asksForLoopRun: false`, and both suites read the fixture.

#### Lane S3: long-prompt cost (serial, third)
- [x] T075 Compile the lead patterns once, test each occurrence against a bounded window before it in `commandOnlyMentioned`, `hasLoopAsk` and their Python copies, and pass `_advisor_prompt_head(prompt_lower)` into `_apply_deep_loop_offer_gate` (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`). Verify: the REQ-030 long-prompt cases pass in `tests/command-attach-guards.vitest.ts` and `PY` with loose ceilings, and no fixture case changes its result. Observed 2026-11-24: a lead is read on a 400-character window (`LEAD_WINDOW` in `command-attach.ts`; `_LEAD_WINDOW` in `skill_advisor.py`), the naming patterns are built once, and the head is the same in both copies (`_advisor_prompt_head` in `skill_advisor.py`, passed into `_apply_deep_loop_offer_gate` from `analyze_request`). `tests/command-attach-guards.vitest.ts` holds the four long-prompt cases in `describe "long prompts"`, `DEEP-LOOP-LONG` passes in `PY`, and the 203 cases the fixture held in that round kept their results.

#### Lane S4: vocabulary drift guard (serial, last)
- [x] T076 Export the count words, run symptoms, artifact-after nouns, past-run read verbs and iterative verbs as arrays that build their patterns, mirror each as a named Python tuple, and extend the drift guard to compare the two copies and to require a fixture case per entry (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`, fixture, `$ADV/tests/deep-loop-offer-cases.vitest.ts`). Verify: `TESTS tests/deep-loop-offer-cases.vitest.ts` and `PY` pass, and a scratch edit adding `sixty` to one copy fails the guard. Observed 2026-11-24: the exported arrays are the ones `VOCABULARY_PAIRS` reads in `tests/deep-loop-offer-cases.vitest.ts`, each mirrored as a named Python tuple in `skill_advisor.py`: `COUNT_WORDS` / `_COUNT_WORD_LIST`, `LOOP_RUN_SYMPTOMS` / `_LOOP_RUN_SYMPTOM_LIST`, `LOOP_ARTIFACT_NOUNS` / `_LOOP_ARTIFACT_NOUN_LIST`, `PAST_RUN_READ_VERBS` / `_PAST_RUN_READ_VERB_LIST`, `RERUN_PRONOUNS` / `_RERUN_PRONOUN_LIST`, `ITERATIVE_VERBS` / `_ITERATIVE_VERB_LIST`, `LOOP_WORDING` / `_LOOP_WORDING_LIST`, `LOOP_NAMES` / `_LOOP_NAME_LIST`, `LOOP_WANT_LEADS` / `_LOOP_WANT_LEAD_LIST`, `RUN_ASK_REFUSAL_LEADS` / `_RUN_ASK_REFUSAL_LEAD_LIST`, `MODE_SUFFIXES` / `_MODE_SUFFIX_LIST`, `READ_ONLY_LOOP_MODES` / `_READ_ONLY_LOOP_MODE_LIST`, `MODE_CUE_WORDS.research` / `_RESEARCH_MODE_CUE_LIST`, `MODE_CUE_WORDS.review` / `_REVIEW_MODE_CUE_LIST`, `DEFECT_CHECK_VERBS` / `_DEFECT_CHECK_VERB_LIST` and `DEFECT_CHECK_NOUNS` / `_DEFECT_CHECK_NOUN_LIST`, which the effort, question and command-lead lists complete. A scratch edit adding `sixty` to one copy failed the guard, and both suites pass on the built tree. The seventh round widened it to twelve compared pairs and five per-entry cases (T087); the eighth round took it to fifteen pairs, because three more lists joined (`LOOP_EFFORT_LEADS`, `LOOP_EFFORT_WORDS` and `LOOP_QUESTION_AUXILIARIES`), and `VOCABULARY_PAIRS` compares twenty-two pairs on the tree today. The pairs sit in `VOCABULARY_PAIRS`, the refusal-lead pair is its `RUN_ASK_REFUSAL_LEADS` entry, the numeric pairs sit in `NUMERIC_PAIRS` with their assertion in `it "%s holds the native %d"`, and the per-entry cases are the `it.each` cases over `LOOP_WORDING`, `LOOP_NAMES`, `LOOP_WANT_LEADS`, `COUNT_WORDS`, `ITERATIVE_VERBS`, `LOOP_RUN_SYMPTOMS`, `LOOP_ARTIFACT_NOUNS`, `LOOP_EFFORT_WORDS`, `LOOP_EFFORT_LEADS`, `LOOP_EFFORT_CHANGE_VERBS`, `PAST_RUN_READ_VERBS` and `RERUN_PRONOUNS`.

#### Parallel lanes
- [x] T077 [P] Lane P1: carry `command`, `policy`, `ownerSkillId` and a literal `typed: true` through `parseRecommendations`, and set `typed: true` where `degradedRecommendations` keeps a typed command (`$ADV/lib/subprocess.ts`, `$ADV/skill-advisor-cli.ts`). Verify: `TESTS tests/subprocess-typed-fields.vitest.ts tests/command-brief-golden.vitest.ts` shows `/deep:review (ask)` with no `A ` option on both degraded paths. Observed 2026-11-24: `parseRecommendations` in `lib/subprocess.ts` carries the four fields, `typedCommandForRecommendation` reaches a legacy mode id, and `degradedRecommendations` in `skill-advisor-cli.ts` marks the row it derived the typed command for. `tests/command-brief-golden.vitest.ts` pins the two heads in `it "prints a typed deep command plainly"` and `it "keeps the offer options on a degraded deep row that is not marked typed"`, and `tests/subprocess-typed-fields.vitest.ts`, `tests/cli-degraded-command-contract.vitest.ts` and the golden file pass together.
- [x] T078 [P] Lane P2: count the stage-one passes wording only where `asksForLoopRun` or `isStuckRunComplaint` holds (`$ADV/lib/scorer/lanes/explicit.ts`). Verify: `TESTS tests/scorer/stage-one-loop-subject.vitest.ts` passes. Observed 2026-11-24: `passesAsked` in `lib/scorer/lanes/explicit.ts` needs either predicate, and the file's four cases pass, including the stuck run that quotes its passes.
- [x] T079 [P] Lane P3: pin the typed-on-stuck served head and the deep typed, stuck and refusal cases at the handler layer (`$ADV/tests/typed-on-stuck-serving.vitest.ts`, `$ADV/tests/handlers/advisor-recommend-typed-command.vitest.ts`). Verify: `TESTS tests/typed-on-stuck-serving.vitest.ts tests/handlers/advisor-recommend-typed-command.vitest.ts` passes. Observed 2026-11-24: the serving file takes the real `advisor_recommend` head and serves `/deep:review` over the diagnosis on the typed-stuck prompt (`tests/typed-on-stuck-serving.vitest.ts` `it "serves the typed /deep:review over the diagnosis a stuck complaint earns"`) and the diagnosis alone on the untyped one (`it "keeps the diagnosis on an untyped stuck complaint"`). The handler file covers the same in `it "replaces the deep-loop diagnosis with a typed /deep:review"` (`tests/handlers/advisor-recommend-typed-command.vitest.ts`). Both pass.
- [x] T080 [P] Lane P4: keep a refinement that names another file or dimension as its own registry entry (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`). Verify: `npx vitest run tests/unit/reduce-state-refinement-other-file.vitest.ts tests/unit/synthesis-closeout-refinements.vitest.ts tests/unit/fanout-merge.vitest.ts` in `.skilled/skills/system-deep-loop/runtime` reports 0 failed. Observed 2026-11-24: `refinesSameLocation` (`reduce-state.cjs`) keeps a refinement at another file or dimension as its own entry with its `refines` link and still folds one at the same file. The three files report 3 files, 108 tests passed, exit 0, and a replay of the three lineages on a temp copy gave 0 missing structured findings.

#### Closure (gates stage, after every lane)
- [x] T081 Build and rerun everything (`$ADV`). Verify: `npm run build` exit 0, `npx vitest run` 0 failed, `PY` 0 failed, the predicate comparison drift 0, `PROBE` keeps every gain, keep and stage-one command, the prompt hook prints `/deep:review (ask)` on the typed-stuck prompt, and the corpus `false_offer` stays 0. Record the numbers in `implementation-summary.md` and AC-042. Observed 2026-11-24 on the sixth round's staged tree: `npm run build` exit 0; `npx vitest run` 184 files, 3,029 passed, 4 skipped, 0 failed; `PY` `pass=136, fail=0`; the 69 probes all read `exit 0 live` and the compare against `results-final-958fa81-worktree.json` printed `changes=0 guarded_failures=0`; the typed-stuck head is pinned by `tests/typed-on-stuck-serving.vitest.ts` `it "serves the typed /deep:review over the diagnosis a stuck complaint earns"`; `false_offer` is 0 of 57. The eighth round reran the same commands on its tree: `npx vitest run` 184 files, 3,188 passed, 4 skipped, 0 failed, `PY` `cases=285` and `pass=136, fail=0`, and the 69 probes still compare `changes=0 guarded_failures=0` (T092). AC-042 carries the numbers, and `implementation-summary.md` rows "Sixth round: advisor `npm run build` and `npx vitest run`" to "Sixth round: independent verification" carry the sixth-round rows.
- [x] T082 Bring the closure docs to the built behaviour: the fixture header names the layer each typed column pins; implementation-summary limitations 6 and 7 and the fifth-round "A stuck run drops the run row" line; the v4.2.0.0 changelog lines on stuck runs and refusals; packet 013's REQ-006 evidence for the degraded paths; and this file's checklist evidence (CHK-001's REQ count and the Verification Summary). Verify: AC-041 cites the line of each. Observed 2026-11-24: the fixture header is done (`tests/fixtures/deep-loop-offer-cases.json` `$comment`). `implementation-summary.md` carries the sixth-round paragraph "A sixth round fixed", the reversed fifth-round sentence "Python typed check", the rewritten limitations 6 and 7, the new limitation 8, and the sixth-round verification rows "Sixth round: advisor `npm run build` and `npx vitest run`" to "Sixth round: independent verification". The changelog names the refusal exception, the typed-on-stuck head and the refusal verbs (`.skilled/changelog/skilled/v4.2.0.0.md` "A complaint about a stuck run gets" to "A turned-down loop gets no run"). Packet 013 records its degraded-path evidence at `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md` row "Reopened: degraded paths". CHK-001's count read 34 after this round and 39 after the eighth, and CHK-001 itself carries the current count; the Verification Summary matches the boxes it counts (CHK-020 and `tasks.md` "Verification Summary", and the eighth-round tasks `tasks.md` "Eighth fix round" T088 to T093).
- [x] T083 Work each new acceptance row against its own check (`acceptance-criteria.md` AC-030 to AC-042). Verify: each row reads `Met` with observed evidence, or names an ADR. Observed 2026-11-24: AC-030 to AC-039 and AC-042 read `Met` with the command, count and line each rests on, AC-040 reads `Unmet` because the review rerun is not part of the build, and AC-041 was closed with its cited lines by the closure-doc dispatch (T082).
- [ ] T084 Rerun the deep review on this packet with traceability as its focus, so `spec_code` and `checklist_evidence` finish. Verify: the rerun's terminal gates read evidence, scope and coverage pass (AC-040). Not run: a follow-up review run, not part of the build.
- [x] T085 Validate the packet (`$PKT`). Verify: `validate.sh $PKT --strict` prints `RESULT: PASSED`. Observed 2026-11-24: `RESULT: PASSED` on this packet and on packet 013 with the tree built by this round.

### Seventh fix round

Reopened 2026-11-24 after the traceability review rerun (`$PKT/review/review-report.md`) returned FAIL on its coverage gate with 0 P0, 2 P1 and 12 P2. A docs lane corrects the closure records and a drift-guard lane edits the two gate copies and the shared fixture. `TESTS` is `npx vitest run <files>` in `$ADV`, and `PY` is `python3 tests/python/test_skill_advisor.py` in `$ADV`.

- [x] T086 Correct the closure-doc drift the review found (`$PKT/spec.md` REQ-011, `$PKT/acceptance-criteria.md` AC-032, AC-038 and AC-043, `$PKT/tasks.md`, `$PKT/decision-record.md` ADR-007, `$PKT/implementation-summary.md` limitation 8, `.skilled/changelog/skilled/v4.2.0.0.md` "Advisor runtime suite with the loop offers"). Verify: `validate.sh $PKT --strict` prints `RESULT: PASSED`, and `rg -n 'autonomous research' $PKT/spec.md` prints two lines, both saying the alias was dropped. Observed 2026-11-24: REQ-011 names the two aliases the hub carries and ADR-007 records the drop, AC-043 owns the row and reads both hub files, limitation 8 states the served-brief layer, every acceptance evidence cell cites the line that holds it, T001's decision count reads 11, and the changelog row quotes the final-tree suite.
- [x] T087 Widen the vocabulary drift guard to the surfaces the review named: export the refusal-lead alternation as a list on both sides and compare it, give `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS` a per-entry case, and pin `LEAD_WINDOW` and `ADVISOR_PROMPT_MAX_CHARS` against the Python source (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`, `$ADV/tests/deep-loop-offer-cases.vitest.ts`, `$ADV/tests/fixtures/deep-loop-offer-cases.json`). Verify: `TESTS tests/deep-loop-offer-cases.vitest.ts` passes, and the twelfth pair, the two numeric pairs and the per-entry cases are read in the file. Observed 2026-11-24 in code by the drift-guard dispatch: `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts`) and `_RUN_ASK_REFUSAL_LEAD_LIST` (`skill_advisor.py`) were the twelfth pair, read by `VOCABULARY_PAIRS` in `tests/deep-loop-offer-cases.vitest.ts`; the numeric pairs sit in its `NUMERIC_PAIRS` and are asserted in `it "%s holds the native %d"`, and the per-entry cases are its `it.each` cases over `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS`. The full advisor suite reported 184 files, 3,126 passed, 4 skipped, 0 failed in that round, and `PY` reported `pass=136, fail=0`; the eighth round reads 184 files, 3,188 passed on fifteen pairs (T092).

### Eighth fix round

Reopened 2026-11-24 after the second traceability rerun (`$PKT/review/review-report.md`, generation 4) returned FAIL on its coverage gate with 0 P0, 1 P1 and 18 P2. The P1 and three of the P2 are code findings, fixed at `2520456bd3f` before this round's docs pass; the rest are closure-doc findings, fixed here. `TESTS` is `npx vitest run <files>` in `$ADV`, and `PY` is `python3 tests/python/test_skill_advisor.py` in `$ADV`.

- [x] T088 Read a plural loop name as a loop ask in both gate copies, and keep a plural loop that reports a past run, names a symptom or asks a question off it (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`, `$ADV/tests/fixtures/deep-loop-offer-cases.json`). Verify: the thirteen plural prompt rows read their `asksForLoopRun` column in `TESTS tests/deep-loop-offer-cases.vitest.ts` and in `PY`. The ninth round later added eight `-served` rows for the same run prompts, which pin the served mode rather than the ask. Observed 2026-11-24 at `2520456bd3f`: the eight run rows from `plural-deep-reviews-use-verb` to `plural-review-loops` (`tests/fixtures/deep-loop-offer-cases.json`) read `true`, the five past-run, symptom and question rows `plural-deep-reviews-stuck`, `plural-deep-reviews-ran-overnight`, `plural-deep-reviews-past-run-from-last-week`, `plural-deep-reviews-how-many-ran` and `plural-deep-reviews-question` read `false`, both suites read the same fixture through `tests/deep-loop-offer-cases.vitest.ts` `FIXTURE` and `tests/python/test_skill_advisor.py` `test_deep_loop_offer_gate_parity`, and `TESTS` reports 2 files and 841 tests passed, `PY` `cases=285` and `pass=136, fail=0` at `2520456bd3f`. On the final tree `PY` prints `cases=359`.
- [x] T089 Keep a question that leads with `how do` or `how can` a question about the loop, while a run asked for in a later clause still counts (`$ADV/lib/command-attach.ts` `LOOP_QUESTION_AUXILIARIES` and the how-to pattern, `$ADV/scripts/skill_advisor.py`, fixture). Verify: "how do I run a deep review on this?" and "how can a deep research loop stop early?" ask for no run, and "how do I run a deep review? then run a deep review on the parser" does. Observed 2026-11-24 at `2520456bd3f`: the two question rows `how-do-run-deep-review` and `how-can-research-loop-stop` (`tests/fixtures/deep-loop-offer-cases.json`) read `false` and the run-after-question row `how-do-then-run-deep-review` reads `true`; the auxiliaries are compared with Python as `LOOP_QUESTION_AUXILIARIES`, the `VOCABULARY_PAIRS` entry in `tests/deep-loop-offer-cases.vitest.ts`, and both suites pass.
- [x] T090 Read a complaint about the loop's own speed or cost as no run ask, and keep an effort word used as a manner on the request (`$ADV/lib/command-attach.ts` `LOOP_EFFORT_LEADS` and `LOOP_EFFORT_WORDS`, `$ADV/scripts/skill_advisor.py`, fixture). Verify: the thirteen complaint rows ask for no run and the four controls keep `/deep:review`. Observed 2026-11-24 at `2520456bd3f`: "the deep review loop is too slow" and the twelve rows beside it (`tests/fixtures/deep-loop-offer-cases.json` rows `effort-loop-too-slow` to `effort-optimise-deep-review`) read `false`, the four controls (rows `effort-control-fast-run` to `effort-control-improve-with-run`) read `true`, each list entry carries its own no-run case (`tests/deep-loop-offer-cases.vitest.ts` `it.each(LOOP_EFFORT_WORDS)` and `it.each(LOOP_EFFORT_LEADS)`), and both suites pass.
- [x] T091 Render a supplied command on the degraded CLI path only where the tracked table names it for the row's own skill (`$ADV/skill-advisor-cli.ts` `trackedCommandForOwner`). Verify: a supplied `/deep:review` on a typed row keeps printing, and an unknown command or another skill's command drops the command, policy, owner and typed marker. Observed 2026-11-24 at `2520456bd3f`: `trackedCommandForOwner` (`skill-advisor-cli.ts`) is read where the supplied string reaches the row, in `degradedRecommendations`, `tests/cli-degraded-command-contract.vitest.ts` `it "keeps a supplied command the tracked table names for the row skill"` keeps the tracked command and `it "drops a supplied command naming %s"` drops the two it cannot vouch for, and `TESTS tests/cli-degraded-command-contract.vitest.ts` passes.
- [x] T092 Bring the closure docs to the final tree, for every count and evidence cell the review named (`$PKT/acceptance-criteria.md`, `$PKT/spec.md`, `$PKT/tasks.md`, `$PKT/decision-record.md`, `$PKT/implementation-summary.md`, `.skilled/changelog/skilled/v4.2.0.0.md` "Advisor runtime suite with the loop offers"). Verify: no closure doc states a suite, fixture or pair count the tree no longer has, every `path:line` cell opens on the line that holds its evidence, REQ-006 names the fixture and the guards file, and REQ-031 names the ten lists that carry a per-entry case and the five that do not. Observed 2026-11-24 on the eighth round's tree: `npx vitest run` 184 files, 3,188 passed, 4 skipped, 0 failed; `PY` `cases=285` and `pass=136, fail=0`; the shared fixture holds 285 cases; the drift guard compares fifteen pairs; and the 69-probe compare prints `changes=0 guarded_failures=0`.
- [x] T093 Validate the packet (`$PKT`). Verify: `validate.sh $PKT --strict` prints `RESULT: PASSED`. Observed 2026-11-24: `RESULT: PASSED`, Errors 0, Warnings 0.

### Ninth fix round

Reopened 2026-11-24 after the third traceability rerun (`$PKT/review/review-report.md`, generation 5) returned FAIL on its coverage and scope gates with 0 P0, 4 P1 and 16 P2. The code findings were fixed at `3db3085bcf0` and `5ace62e10e6` before this round's docs pass. `TESTS` is `npx vitest run <files>` in `$ADV`, and `PY` is `python3 tests/python/test_skill_advisor.py` in `$ADV`.

- [x] T094 Keep a read-only loop's command under a no-edit clause in both copies (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`, fixture). Verify: the three no-edit rows keep their command in `TESTS tests/deep-loop-offer-cases.vitest.ts` and in `PY`. Observed 2026-11-24 at `3db3085bcf0`: both suites pass the rows (AC-048).
- [x] T095 Read the mode cue only from loop phrases the prompt still asks for (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`, fixture, guards). Verify: the refused-cue rows serve the asked mode. Observed 2026-11-24 at `3db3085bcf0`: the five rows and the guard block pass (AC-049).
- [x] T096 Run the deferred-route mode guard on the routed single-target route too (`$ADV/lib/command-attach.ts`). Verify: "run a deep loop to review the research loop config" serves `/deep:review` on the routed research route. Observed 2026-11-24 at `3db3085bcf0`: it does, and a 338-prompt sweep changed only that one result (AC-050).
- [x] T097 Serve every REQ-035 prompt that names a mode, read a plural loop noun in the scorer's explicit lane and its Python mirror, and amend REQ-035 for the mode-free prompt (`$ADV/lib/command-attach.ts`, `$ADV/scripts/skill_advisor.py`, `$ADV/lib/scorer/lanes/explicit.ts`, `$PKT/spec.md`, `$PKT/decision-record.md` ADR-008). Verify: the built advisor serves the seven mode-naming prompts with their command. Observed 2026-11-24 at `5ace62e10e6`: it does, and "run two deep loops on the cache layer" tops the hub with no command, as its singular does (AC-051).
- [x] T098 Read a pronoun rerun as a run ask, withhold the doctor command on a past-run summary, keep the command when an effort word sets the manner, and read a typed `/doctor:deep-loop` after a clause break as a request, in both copies. Verify: the pronoun, past-summary, effort-manner and typed-doctor rows pass `TESTS` and `PY`. Observed 2026-11-24 at `3db3085bcf0`: they do (AC-052).
- [x] T099 Compare the mode vocabulary on every surface that carries it and pin the exception grammar with shared rows (`$ADV/tests/deep-loop-offer-cases.vitest.ts`, fixture). Verify: `TESTS tests/deep-loop-offer-cases.vitest.ts` passes. Observed 2026-11-24 at `3db3085bcf0`: it passes, and a 3,729-prompt grammar sweep gave 0 disagreements between the copies (AC-053).
- [x] T100 Write a direction one iteration ruled out as reopenable, replace a heading-first strategy section with one heading, and let the duplicate-command guard withhold (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `$ADV/handlers/advisor-recommend.ts`). Verify: `npx vitest run tests/unit` in the deep-loop runtime and `TESTS tests/handlers` report 0 failed. Observed 2026-11-24 at `3db3085bcf0`: 190 files, 3,632 passed, 2 skipped, and 16 handler files, 130 passed, 1 skipped (AC-054).
- [x] T101 Bring the closure docs to the final tree for the five doc findings (`$PKT/acceptance-criteria.md` AC-015, AC-019, AC-040 and AC-041 and every evidence cell that cites `implementation-summary.md`, this file's T081 and T082 citations). Verify: every `path:line` cell opens on the line that holds its evidence, and `validate.sh $PKT --strict` prints `RESULT: PASSED`. Observed 2026-11-24: each cited line was found by its row label, not by offset, and the advisor suite on the final tree reported 186 files, 3,415 passed, 4 skipped, 0 failed, with `PY` `pass=136, fail=0` on 347 shared cases.

### Tenth fix round

Reopened 2026-11-24 after the fourth traceability rerun (`$PKT/review/review-report.md`, generation 6) returned FAIL on its coverage gate with 0 P0, 4 P1 and 39 P2. `TESTS` is `npx vitest run <files>` in `$ADV`, and `PY` is `python3 tests/python/test_skill_advisor.py` in `$ADV`.

- [x] T102 Serve no run row for a mode-free ask in the Python fallback and spell that absence `"none"` in the shared fixture (`$ADV/scripts/skill_advisor.py` `_apply_deep_loop_offer_gate`, fixture, both suites). Verify: `TESTS tests/deep-loop-offer-cases.vitest.ts` and `PY` pass, and the tightened check fails on the old fallback. Observed 2026-11-24 at `9f1190407eb`: it failed four rows before the gate edit and passes after (AC-055).
- [x] T103 Keep the strategy file's own section numbers in the review reducer (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` `replaceAnchorSection`). Verify: `npx vitest run tests/unit` in the deep-loop runtime reports 0 failed. Observed 2026-11-24 at `9f1190407eb`: 191 files, 3,634 passed, 2 skipped (AC-056).
- [x] T104 Move every acceptance and task citation to a name: a symbol, test title, fixture row id, summary row label or task id, with one `Evidence: path:N (anchor)` tail per acceptance row that `scratch/citations/evidence-tails.py` checks against the tree (`scratch/citations/cites.py` lists a row range's citations). Correct the stale counts and anchors the rerun named, amend REQ-012 to ADR-001, restate REQ-031 without list counts, extend the declared change set and fill `timeline.md`. Verify: the tail check reports no problem and `validate.sh $PKT --strict` prints `RESULT: PASSED`. Observed 2026-11-24: the tail check reports `problems=0`.
- [x] T105 Rerun the gates on the final tree. Verify: `npm run build` exit 0, `npx vitest run` 0 failed, `PY` 0 failed, `PROBE` compare clean. Observed 2026-11-24: build exit 0, 186 files, 3,418 passed, 4 skipped, 0 failed, `PY` `cases=347` and `pass=136, fail=0`, and `changes=0 guarded_failures=0`.

### Eleventh fix round

Reopened 2026-11-24 after the fifth traceability rerun (`$PKT/review/review-report.md`, generation 7) returned FAIL on its coverage gate in one lineage, with 0 P0, 3 P1 and 14 P2. `TESTS` is `npx vitest run <files>` in `$ADV`, and `PY` is `python3 tests/python/test_skill_advisor.py` in `$ADV`.

- [x] T106 Collapse whitespace when both gate copies fold the prompt (`$ADV/lib/command-attach.ts` `lowerFolded`, `$ADV/scripts/skill_advisor.py` `_fold_quotes`, fixture). Verify: the four whitespace rows pass `TESTS` and `PY`. Observed 2026-11-24 at `4edba5ad264`: they do, and the built advisor serves `/deep:review` on them (AC-057).
- [x] T107 Cancel a refusal that a negation leads, in both copies (`RUN_ASK_REFUSAL_CANCEL_LEADS`, `_RUN_ASK_REFUSAL_CANCEL_LEAD_LIST`, fixture). Verify: the negated-refusal rows and their controls pass. Observed 2026-11-24 at `4edba5ad264`: they do (AC-058).
- [x] T108 Compare every gate pattern the copies spell alike and list the rest with a reason (`$ADV/tests/deep-loop-offer-cases.vitest.ts`). Verify: `TESTS tests/deep-loop-offer-cases.vitest.ts` passes and a one-sided quantifier change fails it. Observed 2026-11-24 at `4edba5ad264`: 40 pairs compared, 38 listed (AC-059).
- [x] T109 End the Next Focus projection before the verdict and keep its lines (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` `stripReviewVerdict`). Verify: `npx vitest run tests/unit` in the deep-loop runtime reports 0 failed. Observed 2026-11-24 at `4edba5ad264`: 192 files, 3,635 passed, 2 skipped (AC-060).
- [x] T110 Close the closure-record findings: AC-020 waived under ADR-009, AC-034's served head recorded in `scratch/probes/ac034-served-head.jsonl`, AC-038 and REQ-031 scoped to the deep-loop gate's lists, AC-040 citing an archived report, AC-044 and T088 naming the `-served` rows, T051 and T082 without present-tense counts, and the citation checkers kept in `scratch/citations/`. Verify: `scratch/citations/evidence-tails.py` reports `problems=0` and `validate.sh $PKT --strict` prints `RESULT: PASSED`. Observed 2026-11-24: both hold.
- [x] T111 Seed the generation 8 review scope with every file the declared change set names, so a finding on any of them stays inside the scope gate. Verify: each change-set path in `spec.md` section 3 is a line of `review/fanout-review-scope.txt`. Observed 2026-11-24 when generation 8 opened.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. T084 is open: the traceability review rerun is a follow-up review run, not part of the build.
- [x] No `[B]` blocked tasks remaining. Observed 2026-11-23: none.
- [x] Manual verification passed: one recorded behaviour session each on F3, F5 and F6, or a waiver recorded in `decision-record.md`. Observed: `scratch/behaviour/F3.md`, `F5.md` and `F6-sample-1.md`.
- [x] `$PKT/scratch/probes/results-after.json` exists and `implementation-summary.md` quotes its gain, lose and negative lines. Observed: the closure-pass probe row in Verification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Operator decisions**: See `scratch/decisions.md`
- **Routing analysis**: See `scratch/routing-analysis.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason on the same line, and a `[B]` task blocks close until it is done or waived in `decision-record.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 52. Observed 2026-11-24: prints 52.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 4' plan.md` prints one line
- [x] CHK-003 [P1] Dependencies available: `npm run build` in `$ADV` exits 0. Observed 2026-11-23: exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The advisor build type-checks: `npm run build` in `$ADV` exits 0. Observed 2026-11-23: exit 0.
- [x] CHK-011 [P0] No ephemeral labels in changed code comments: `git diff -U0 $ADV/lib | rg -n '\b(D[0-9]|P[0-9]|REQ-|specs/)'` prints nothing. Observed 2026-11-23: over the packet's diff from its first commit, the added lines print nothing.
- [x] CHK-012 [P1] The mode-cue path returns no command when both cues or neither appear: a vitest case for each. Observed 2026-11-23: `command-attach-guards.vitest.ts` "leaves a deferred route without a command" holds a both-cue case and a no-cue case.
- [x] CHK-013 [P1] The gate change stays behind `skillId === 'system-deep-loop'`: `git diff $ADV/lib/command-attach.ts` shows no edit outside that branch except the word lists. Observed 2026-11-23: every new branch in `attachCommand` opens with `skillId === 'system-deep-loop'`. The other hunks add the word lists and the helpers those branches call.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` reads `Met`, `Waived` or `Superseded`. Observed 2026-11-24: AC-040 reads `Unmet`, for the traceability review rerun, so the row stays open.
- [x] CHK-021 [P0] Probe rerun complete: `$PKT/scratch/probes/results-after.json` holds 69 rows. Observed 2026-11-23: 69 rows.
- [x] CHK-022 [P1] Edge cases tested: N6 and N10 carry no command on the probe rerun, and `command-attach.vitest.ts` holds the loop-ask-plus-depth-word case and the two-cue case that spec.md Edge Cases names. Observed 2026-11-23: N6 and N10 show `cmd=-`. The loop-ask-plus-depth-word case ("do a thorough deep review of the typo handling") and the two-cue case are in `command-attach-guards.vitest.ts`.
- [x] CHK-023 [P1] Corpus recapture read: `false_offer` and `false_offer_attached` over the earlier rows match T003. Observed 2026-11-23: 0 and 0 over the 35 earlier rows, equal to T003.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each gap has a class: the gate gap is `class-of-bug`, the drift rows are `instance-only`, and the near-miss rows are `matrix/evidence`. Recorded here: the gate gap was fixed at its producer in `command-attach.ts` with a fixture of cases, the drift rows were removed one by one, and the near-miss rows joined the corpus as evidence.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'DEPTH_REQUEST|DEPTH_WORDING' $ADV/lib` lists every reader. Observed 2026-11-23: neither name is left. The producers are now the `LOOP_*` patterns in `command-attach.ts` with copies in `skill_advisor.py`, read by `command-attach.ts`, `explicit.ts`, `fusion.ts` and `skill_advisor.py`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the plan's affected-surfaces table names every reader of `attachCommand`. Observed 2026-11-23: the readers are `command-attach.ts` itself and `capture-command-routing-baseline.mjs`, and the plan's table names the capture script.
- [x] CHK-FIX-004 [P0] The gate has adversarial cases: depth-only, refusal, question about the loop and past-run summary each have a vitest or probe row. Observed 2026-11-23: R7 (depth-only), N6 (refusal), N10 (question) and N9 (past-run) are probe rows, each without a deep command.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed: plan.md names the three axes and the probe file holds 69 rows. Observed 2026-11-23: `plan.md` names the three axes, and the probe file holds 69 rows.
- [x] CHK-FIX-006 [P1] N/A for a hostile environment: the gate reads only the prompt string and no process-wide state. Confirmed by reading the gate.
- [x] CHK-FIX-007 [P1] Evidence pinned: `implementation-summary.md` names the commit the probe rerun ran against. Observed 2026-11-23: `implementation-summary.md` Verification names `958fa817187` for the final rerun.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret in any changed file: `git diff | rg -n -i 'api[_-]?key|token=|password'` prints nothing. Observed 2026-11-23: over the non-spec files the packet's commits changed, the added lines print nothing.
- [x] CHK-031 [P0] Both `/deep` commands keep policy `ask`: the probe rerun shows `pol=ask` on every `/deep:*` row. Observed 2026-11-23: every `/deep:*` row in `results-after.json` shows policy `ask`.
- [x] CHK-032 [P1] N/A for auth: the change reads no credential and adds no access path. Confirmed by reading the diff.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same five gain ids: `rg -c 'V6, H1a' spec.md plan.md tasks.md` prints at least 1 per file. Observed 2026-11-23: 4, 1 and 2.
- [x] CHK-041 [P1] Code comments carry the durable why: the new gate and stage-one rule each have a comment that says why loop wording, not depth wording, opens them. Observed 2026-11-23: `command-attach.ts` above `LOOP_WORDING` and `explicit.ts` beside the stage-one rule say why loop wording opens them.
- [x] CHK-042 [P2] The advisor `lib/README.md` line that lists the depth words matches the new lists: `rg -n 'convene' $ADV/lib/README.md` prints nothing. Observed 2026-11-23: prints nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe inputs and outputs live under `$PKT/scratch/probes/` only. Observed 2026-11-23: every probe input and output is under `scratch/probes/`.
- [x] CHK-051 [P1] No temporary file outside the packet: `git status --short` lists only files the lanes name. Observed 2026-11-23: `git status --short` lists only this packet's files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---

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

- [x] T001 Read the operator decisions before any edit (`$PKT/scratch/decisions.md`). Verify: `rg -c '^\| D[0-9]' $PKT/scratch/decisions.md` prints 9.
- [x] T002 Capture the 69-probe baseline with the advisor code unmodified (`$PKT/scratch/probes/results-spec-baseline.json`). Verify: `git status --short .skilled/skills/system-skill-advisor` prints nothing, and the run in `spec.md` Measured Behavior shows `exit 0 live` on all 69 lines.
- [ ] T003 Capture the corpus counts at the pre-change commit `2ef3895f753`, in a clean checkout, because the advisor code in this worktree was already edited when the docs were written (`$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`). Verify: a run without `--write` prints `false_offer` and `false_offer_attached`, and both counts plus `capturedAtSha` are saved to `$PKT/scratch/corpus-before.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A: advisor code
- [ ] T004 Replace the depth-word gate with an explicit loop-ask test, and let one mode cue resolve a deferred hub route (`$ADV/lib/command-attach.ts`). Verify: `PROBE` shows `cmd=/deep:review` on V6, H1a and E3, and `cmd=/deep:research` on H1b and E1.
- [ ] T005 Remove `ask the council`, `convene` and `several models` from `DEPTH_WORDING`, and drop the depth-only words from the gate (`$ADV/lib/command-attach.ts`). Verify: `rg -n "'convene'|'several models'|'ask the council'" $ADV/lib/command-attach.ts` prints nothing.
- [ ] T006 Add the stage-one rule for explicit loop wording beside a research or review cue, and delete the `several models` boost (`$ADV/lib/scorer/lanes/explicit.ts`). Verify: `rg -n "'several models'" $ADV/lib/scorer/lanes/explicit.ts` prints nothing, and `PROBE` shows H3b with a top row other than `system-deep-loop`.
- [ ] T007 Add a gate case per loop-ask clause and an `undefined` case per depth word (`$ADV/tests/command-attach.vitest.ts`). Verify: `npx vitest run tests/command-attach.vitest.ts` in `$ADV` reports 0 failed.
- [ ] T008 Add near-miss rows for N7, N9, D1, V7, H6 and A3 (`$ADV/scripts/routing-accuracy/command-prompts.jsonl`). Verify: `rg -c '"row_type":"near-miss"' $ADV/scripts/routing-accuracy/command-prompts.jsonl` prints the earlier count plus 6.
- [ ] T009 Rebuild the advisor `dist` (`$ADV/dist/`). Verify: `npm run build` in `$ADV` exits 0, and `PROBE` prints `live` on every line.
- [ ] T010 Recapture the routing baseline (`$ADV/scripts/routing-accuracy/command-routing-baseline.json`). Verify: `node $ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs --write` exits 0, and `false_offer` over the earlier rows equals the T003 count.

### Lane B: deep command docs
- [ ] T011 [P] Add the `### Offer From an Advisor Brief` section with its flag table (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -n 'Offer From an Advisor Brief|--spec-folder=<the Gate 3 answer>' .skilled/commands/deep/assets/deep-research-presentation.txt` prints both.
- [ ] T012 [P] Add the same section with review's names, target type, `--review-focus` row and fan-out verdict note (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n 'Offer From an Advisor Brief|--review-focus' .skilled/commands/deep/assets/deep-review-presentation.txt` prints both.
- [ ] T013 [P] Add step 0 of MODE ROUTING pointing at the offer section (`.skilled/commands/deep/research.md`). Verify: `rg -n 'Offer From an Advisor Brief' .skilled/commands/deep/research.md` prints one line.
- [ ] T014 [P] Add the same step 0 (`.skilled/commands/deep/review.md`). Verify: `rg -n 'Offer From an Advisor Brief' .skilled/commands/deep/review.md` prints one line.
- [ ] T015 Replace step 6 with the question-tool sentence and mark Q2 Autonomous and Q-Exec Native recommended (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/deep-research-presentation.txt` prints 0, and `rg -n 'Autonomous \(Recommended\)|Native \(Recommended, default\)'` prints two lines.
- [ ] T016 Make the same setup changes (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/deep-review-presentation.txt` prints 0.
- [ ] T017 Rewrite the completed-packet message to name `--extend=N` and `--restart`, and add the `--extend=N` next step (`.skilled/commands/deep/assets/deep-research.yaml`). Verify: `rg -n 'rerun with --extend=N' .skilled/commands/deep/assets/deep-research.yaml` prints at least one line.
- [ ] T018 Add the `--extend=N` next step (`.skilled/commands/deep/assets/deep-review.yaml`). Verify: `rg -n -- '--extend=N' .skilled/commands/deep/assets/deep-review.yaml` prints one line.
- [ ] T019 Add the `--extend=N` and `/doctor:deep-loop --scope=research` Next Steps rows, and write the example flags with `=` (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -n 'doctor:deep-loop --scope=research|--max-iterations=5 --convergence=0.10' .skilled/commands/deep/assets/deep-research-presentation.txt` prints both.
- [ ] T020 Add the `--extend=N` and `/doctor:deep-loop --scope=review` Next Steps rows (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n 'doctor:deep-loop --scope=review' .skilled/commands/deep/assets/deep-review-presentation.txt` prints one line.

### Lane C: deep-loop skill docs and hub routing
- [ ] T021 [P] Add the sentence that names `/doctor:deep-loop` for a run whose graph or convergence looks wrong (`.skilled/skills/system-deep-loop/SKILL.md`). Verify: `rg -n 'doctor:deep-loop' .skilled/skills/system-deep-loop/SKILL.md` prints at least one line.
- [ ] T022 Add `iterative research`, `multi-round research` and `autonomous research` to the research aliases (`.skilled/skills/system-deep-loop/hub-router.json`). Verify: `rg -c '"(iterative|multi-round|autonomous) research"' .skilled/skills/system-deep-loop/hub-router.json` prints 3.
- [ ] T023 Mirror the three aliases in the stage-two control document (`.skilled/skills/system-deep-loop/ROUTER.md`). Verify: `rg -c 'multi-round research' .skilled/skills/system-deep-loop/ROUTER.md` prints at least 1.
- [ ] T024 Regenerate the hub intent signals and activation manifest (`.skilled/skills/system-deep-loop/graph-metadata.json`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` names `system-deep-loop` in its subject line and reports no failure.
- [ ] T025 [P] Remove `comprehensive research` and `deep investigation`, and point the Gate 2 line at the advisor CLI (`.skilled/skills/system-deep-loop/deep-research/SKILL.md`). Verify: `rg -n 'comprehensive research|deep investigation|skill_advisor\.py' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints nothing.
- [ ] T026 [P] Remove `audit spec folder` and `pre-release review`, and attach the `:auto` invoke form (`.skilled/skills/system-deep-loop/deep-review/SKILL.md`). Verify: `rg -n 'audit spec folder|pre-release review|/deep:review :auto' .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints nothing.
- [ ] T027 [P] Write the example flags with `=` (`.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md`). Verify: `rg -n -- '--max-iterations 15' .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` prints nothing.
- [ ] T028 Regenerate the compiled contracts from the edited sources (`.skilled/commands/deep/assets/compiled/`). Verify: `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/compiled/deep-research.contract.markdown` prints 0.

### Lane H: fresh holdout rows
- [ ] T029 Replace the three deep-family `holdout` rows with fresh prompts, written after lane A's tuning and without reading the old rows (`$ADV/scripts/routing-accuracy/command-prompts.jsonl`). Verify: `git diff` on the file shows three removed and three added deep-family rows with `"split":"holdout"`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run the whole advisor suite (`$ADV`). Verify: `npx vitest run` in `$ADV` reports 0 failed.
- [ ] T031 Rerun the probe set with the same file (`$PKT/scratch/probes/results-after.json`). Verify: `PROBE` shows the gain group with its command, R7 with `cmd=-`, and the keep and negative groups matching the baseline block line for line on top skill and `cmd=`.
- [ ] T032 Record the stage-one group and N9 outcomes (`implementation-summary.md`). Verify: `rg -n 'R2|V2|V4|H7|H10|N9' $PKT/implementation-summary.md` prints each id with its observed top row.
- [ ] T033 Check the runtime mirrors (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0.
- [ ] T034 Check the command references (`.skilled/commands/scripts/validate-command-references.cjs`). Verify: `node .skilled/commands/scripts/validate-command-references.cjs` exits 0.
- [ ] T035 Replay each new alias against an out-of-domain prompt (`$PKT/scratch/probes/`). Verify: a user-research or product-research prompt holding each alias does not top `system-deep-loop`.
- [ ] T036 Validate the packet (`$PKT`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PKT --strict` prints `RESULT: PASSED`.

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
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: one recorded behaviour session each on F3, F5 and F6, or a waiver recorded in `decision-record.md`
- [ ] `$PKT/scratch/probes/results-after.json` exists and `implementation-summary.md` quotes its gain, lose and negative lines
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 14
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 4' plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies available: `npm run build` in `$ADV` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The advisor build type-checks: `npm run build` in `$ADV` exits 0
- [ ] CHK-011 [P0] No ephemeral labels in changed code comments: `git diff -U0 $ADV/lib | rg -n '\b(D[0-9]|P[0-9]|REQ-|specs/)'` prints nothing
- [ ] CHK-012 [P1] The mode-cue path returns no command when both cues or neither appear: a vitest case for each
- [ ] CHK-013 [P1] The gate change stays behind `skillId === 'system-deep-loop'`: `git diff $ADV/lib/command-attach.ts` shows no edit outside that branch except the word lists
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` reads `Met`, `Waived` or `Superseded`
- [ ] CHK-021 [P0] Probe rerun complete: `$PKT/scratch/probes/results-after.json` holds 69 rows
- [ ] CHK-022 [P1] Edge cases tested: N6 and N10 carry no command on the probe rerun, and `command-attach.vitest.ts` holds the loop-ask-plus-depth-word case and the two-cue case that spec.md Edge Cases names
- [ ] CHK-023 [P1] Corpus recapture read: `false_offer` and `false_offer_attached` over the earlier rows match T003
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each gap has a class: the gate gap is `class-of-bug`, the drift rows are `instance-only`, and the near-miss rows are `matrix/evidence`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'DEPTH_REQUEST|DEPTH_WORDING' $ADV/lib` lists every reader.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: the plan's affected-surfaces table names every reader of `attachCommand`.
- [ ] CHK-FIX-004 [P0] The gate has adversarial cases: depth-only, refusal, question about the loop and past-run summary each have a vitest or probe row.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed: plan.md names the three axes and the probe file holds 69 rows.
- [ ] CHK-FIX-006 [P1] N/A for a hostile environment: the gate reads only the prompt string and no process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence pinned: `implementation-summary.md` names the commit the probe rerun ran against.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret in any changed file: `git diff | rg -n -i 'api[_-]?key|token=|password'` prints nothing
- [ ] CHK-031 [P0] Both `/deep` commands keep policy `ask`: the probe rerun shows `pol=ask` on every `/deep:*` row
- [ ] CHK-032 [P1] N/A for auth: the change reads no credential and adds no access path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same five gain ids: `rg -c 'V6, H1a' spec.md plan.md tasks.md` prints at least 1 per file
- [ ] CHK-041 [P1] Code comments carry the durable why: the new gate and stage-one rule each have a comment that says why loop wording, not depth wording, opens them
- [ ] CHK-042 [P2] The advisor `lib/README.md` line that lists the depth words matches the new lists: `rg -n 'convene' $ADV/lib/README.md` prints nothing
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Probe inputs and outputs live under `$PKT/scratch/probes/` only
- [ ] CHK-051 [P1] No temporary file outside the packet: `git status --short` lists only files the lanes name
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---

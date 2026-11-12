# Iteration 5: Ranked hardening set

## Focus

Close the run: rank every confirmed defect by the damage it allows, give the smallest change to an existing line for each, name the spec levels it touches, and apply the reversal-cost test to separate the fixes worth making from the overengineering. One verification was owed before ranking: whether a failing test suite has any defined stopping point once `tests_pass` is removed from the picture as unowned config.

## Actions Taken

1. Re-read `.skilled/commands/speckit/assets/speckit-implement.yaml:670-706` (step 7 activities, `pre_completion_validation` outcomes, `completion_checkpoint`) to check for a test-failure action.
2. Consolidated the 24 confirmed defects from iterations 1-4 into one ranked list, each with its citation, damage, smallest change, level impact and verdict.
3. Applied the reversal-cost ladder from `.skilled/repo-rules/prevent-overengineering.md:54` to every proposed fix: does a cheaper existing-line change fail, and if so what fails?

## Findings

1. **A failing test suite has no defined stopping point in any of the three workflows.** Implement step 7's activities include "Validate tests pass" and "Verify all tasks completed" with no `on_fail`; its `pre_completion_validation` classifies tooling outcomes (`success`, `user_error`, `validation_error`, `system_error`), not test verdicts; and its `completion_checkpoint` requires only that `implementation-summary.md` exists with all sections. The one place that names `tests_pass` as a condition is `quality_gates.post_implementation`, which nothing evaluates. So the single most load-bearing fact about a finished change is recorded in prose, not gated anywhere. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:674-688] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:394-403]

2. **The ranked set. Damage is ordered by what the defect permits, not by how wrong the YAML looks.** "Levels" is the spec level at which the defect changes behaviour (L1 <100 LOC, L2 100-499, L3 >=500).

| # | Defect | Damage allowed | Smallest existing-line change | Levels | Worth it? |
|---|---|---|---|---|---|
| 1 | Seven confidence STOPs survive into auto with `wait_for` and no `mode_overrides.auto` (`plan:586`, `:635`, `:779`; `implement:641-653` child-only; `complete:727`, `:804`, `:980`, `:1156`) | An unattended run halts and waits for an operator the mode exists to avoid; the trigger is a self-assigned score | Add one `auto:` key beside `confirm:` in `mode_overrides` per file, stating the low-band default (`record the assumption and proceed`), one line each | L1-L3 | **Yes** — highest damage, 3 lines, no new artifact |
| 2 | `quality_gates` blocks wired to nothing, with 26 undefined check ids (`plan:403`, `implement:382`, `complete:492`) | A reader believes tests and clarity are gated at 70; nothing evaluates them, and the check ids have no rubric to evaluate with | Delete the three blocks. Do **not** wire them: with no definitions, wiring would gate on an invented rubric | L1-L3 | **Yes** (deletion). Wiring = overengineering |
| 3 | No test-failure action anywhere (`implement:674-688`) | A change with failing tests can be marked complete | Extend the existing `validation:` line of step 7 from `implementation_complete` to `implementation_complete AND tests_pass`, and add the `on_fail` the sibling steps already carry | L1-L3 | **Yes** — one line, and it is the only check that matters after the gate is deleted |
| 4 | Implement steps 4 and 5 lose their only resolution branch under auto (`implement:536-568`) | An open P0 or a failed environment check proceeds into coding with no stated successor | Extend the existing `- Ensure ALL P0 complete (HARD BLOCKER)...` activity with `, else STOP before Step 5`; add the missing `on_fail` beside step 5's `checks:` | L2-L3 (step 4 is skipped at L1) | **Yes** — two lines |
| 5 | Level inherited, never re-derived (`implement:248`, `:539`; `plan:86`, `complete:147`) | A packet labelled L1 whose real size is L2 skips the acceptance gate and `AC_CLOSURE`, so the closure gate silently disappears | Extend `level_selection.note` with one clause: read the level from spec.md, and when absent or older than the plan run `recommend-level.sh` before Step 4 | L2-L3 | **Yes** — one line, restores a real validator |
| 6 | Plan caps clarification at three markers while complete blocks on any (`plan:656`, `complete:1049`) | A spec with four or more markers can never satisfy both commands; the packet bounces | `"(max 3)"` → `"(repeat in passes of 3 until none remain)"` | L2-L3 (gates appear there) | **Yes** — one line |
| 7 | Unscoped `validate.sh --strict` on intermediate writes (`plan:783`, `implement:512`, complete's three `post_write_validation` blocks) | On the repair and partial-folder paths the gate reports a missing required file, and `on_fail` names the wrong repair ("template drift") | Prefix each `command:` with the `SPECKIT_RULES=` subset deep research already uses for the same reason (`deep-research-auto.yaml:533`) | L2-L3 (repair paths) | **Yes** — precedent exists in-repo, one line per site |
| 8 | `research/research.md` declared as a plan output and never validated; 298 of 4,060 packets have one (`plan:758-759`, `implement:482`) | An output promise that most runs do not keep, and any later step that reads it is reading an optional file | `outputs: [plan.md, research/research.md]` → `outputs: [plan.md]`, moving research to the existing conditional activity wording | L1-L3 | **Yes** (one-line honesty fix). Consequence: it also invalidates `research/research.md` as a host for later plan-side records |
| 9 | `circuit_breaker` defined in three files, consumed by none, with contradictory `OPEN` behaviour (`plan:429`, `implement:408`, `complete:535`) | Nothing today; it is the same dead-config class as #2 | Delete the block from all three | L1-L3 | **Yes** (deletion). Reconciling the three semantics = overengineering |
| 10 | `skip_allowed: false` beside two `optional: true` steps (`implement:439`, `:572`, `:711`) | A literal reader cannot run the quick-fix path the file defines | `skip_allowed: false` → `skip_allowed: "false, except steps declaring optional: true"` | L1 (quick fixes) | **Yes** — one line |
| 11 | Three incomparable `confidence_framework.scoring_weights` under one key (`plan:443`, `implement:422`, `complete:551`) | A "70%" means three different things in three replies that all print `Confidence: NN%` | Pick plan's four factors as the family default and delete the other two weight maps; the per-step `scoring_factors` already carry the phase-specific detail | L1-L3 | **Maybe** — worth it only if the printed number is read; otherwise delete the key with #2's class |
| 12 | Complete's `quality_gates.planning_gate` duplicates the wired `phase_gate_checkpoint` and holds the only `plan_has_approach` / `tasks_has_format` checks (`complete:504-519` vs `:1042-1052`) | The wired gate passes a plan with no technical approach | Fold the two content checks into the wired `phase_gate_checkpoint`'s numbered list (add two numbered lines), then delete the dead block with #2 | L2-L3 | **Yes** — two lines, no new gate |
| 13 | `confidence_score < 60` triggers complete's research phase, on a scale with bands at 80/40 (`complete:759`) | Most of the "proceed with caution" band dispatches research | `60` → `40`, matching the framework's own low band | L1-L3 | **Yes** — one character-level change |
| 14 | `available_templates.default_level: level_2` vs the table's Level 1 default (`plan:279`, `implement:266`, `complete:316`) | A new packet's level has two answers | Delete the `default_level` line, or set it to `level_1` | L1-L3 | **Yes** — trivial |
| 15 | `[DEVIATION:` in 14 files; `debug-delegation.md` once, archived; the required summary section in 212 of 3,945 (5.4%) | Not a workflow defect; it invalidates any measurement plan built on these counters | None in the workflow. Do not build a metric on either counter | L1-L3 | **No fix** — a constraint on what can be claimed |
| 16 | Self-assessed confidence in all eight `confidence_checkpoint` blocks (`plan:765`, `implement:641`, complete's four) | The author certifies the document it wrote; a wrong score is invisible | Add `cite the plan.md section each factor was judged against` to the existing `assess:` fields | L1-L3 | **Partly** — the checkable version is one clause; the independent version needs a fresh reader and is a separate decision |

3. **The ranking is not the order the leads arrived in.** The dispatch's leads concentrated on the `plan_clarity` arithmetic (rank 2's dead block) and said nothing about the auto-mode STOPs, which rank first because they stop work in the one mode that has nobody to unstop it. The second-ranked item is the dead gate; the third is the fact the dead gate was hiding, that a failing test suite has no stopping point at all. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:674-688]

4. **Seven of the sixteen are one-line changes, and four of those seven are deletions.** Deletions dominate because the file's real enforcement is prose inside steps (`on_fail`, `HARD_BLOCK`, `action_if_failed`), and the declarative blocks that look like enforcement are the ones with no consumer. The reversal-cost ladder settles the choice: for #2 and #9 the cheaper move fails nothing that matters, because the expensive move would gate on a rubric that does not exist. [SOURCE: .skilled/repo-rules/prevent-overengineering.md:54]

## Questions Answered

No strategy question remained open. The ranking itself is the answer this lineage was dispatched to produce.

## Questions Remaining

Two items are UNKNOWN rather than open:

1. **UNKNOWN — whether any runtime reads `quality_gates` or `circuit_breaker` outside the repository.** The consumer search was repository-local. A runtime that reads these keys would move #2 and #9 from "dead config" to "drifted contract".
2. **UNKNOWN — how often `auto` runs a confidence checkpoint below 40.** No telemetry exists; the seven STOP sites are a structural finding, and their frequency is unmeasured.

## Ruled Out

- **Wiring `quality_gates` with invented rubrics for 26 ids.** That is a new metrics surface by another name, and the task forbids metrics files; deleting the block is the cheaper and more honest move.
- **Reconciling the three `circuit_breaker` semantics.** Three contradictory recovery behaviours, none consumed: reconciling them would invent a fourth behaviour and a consumer for it.
- **Fixing self-scored confidence by dispatching a fresh reader.** It changes the plan explorers' conclusion-free contract, which the prior lineage recorded as a separate decision; the checkable-score clause is the in-scope part.

## Dead Ends

- Looking for a test-verdict action in `pre_completion_validation`: it classifies tooling outcomes, not test results. The absence is Finding 1 and rank 3.

## Edge Cases

- Ambiguous input: "rank by the damage they allow" can mean damage-if-enforced or damage-today. Selected damage-today, with the arithmetic defects marked as latent under rank 2, because a defect that cannot fire is not the same as one that does.
- Contradictory evidence: defect #2 both hides and enables defects #3, #7 and #12 — deleting the block removes the hiding but also removes the promise. Recorded as a dependency between ranks rather than as a conflict.
- Missing dependencies: the level column assumes the level contract in `folder-structure.md` (three tiers); no Level 3+ row exists, matching iteration 4's finding.
- Partial success: the ranking covers every defect this lineage confirmed (24 raw, 16 distinct after merging duplicates), but not defects outside the three target files.

## SCOPE VIOLATIONS

None executed. No target file was modified; every change above is proposed text, not an applied edit.

## Sources Consulted

- `.skilled/commands/speckit/assets/speckit-implement.yaml:674-688`, `:394-403`, `:536-568`, `:248`, `:439`, `:570-573`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:86`, `:279`, `:403`, `:443`, `:656`, `:758-759`, `:783`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:147`, `:316`, `:504-519`, `:551`, `:727-804`, `:980`, `:1042-1052`, `:1156`
- `.skilled/commands/deep/assets/deep-research-auto.yaml:533`
- `.skilled/repo-rules/prevent-overengineering.md:54`
- Iterations 1-4 of this lineage (24 confirmed findings)

## Assessment

- New information ratio: 0.85
- Questions addressed: the ranking deliverable, plus the test-failure stopping point
- Questions answered: none open; the eight strategy questions were answered by iterations 1-3

## Reflection

- What worked and why: ranking by damage-today rather than damage-as-written. It reordered the dispatch's own leads — the `plan_clarity` arithmetic fell to rank 2 as "latent under a dead block", while the auto-mode STOPs, which no lead named, took rank 1.
- What did not work and why: the first ranking attempt sorted by file and section, which produced a tidy list with no priority — every item looked equally urgent. The useful sort key was "what can a reader do after this defect" rather than "where is it".
- What I would do differently: derive the damage sentence for every candidate before ranking any of them; a defect whose damage cannot be stated in one sentence is usually a style difference.

## Recommended Next Focus

Nothing in this lineage. The next evidence is a decision: whether to apply the seven one-line fixes and the four deletions as a single hardening pass, and whether a runtime outside this repository reads the two dead config keys.

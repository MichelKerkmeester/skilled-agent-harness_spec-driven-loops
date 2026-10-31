# Insight review, 2026-10-26

A fresh Opus xhigh agent read both speed-loop runs, the 24 authored packets, the current templates, the authoring card and the validator, read-only. Its report is below as it returned it. The conductor re-checked two claims: the core templates name the benchmark task 26 times (spec 11, tasks 6, plan 4, implementation-summary 5) and `spec.md.tmpl:318` and `:423` carry "Does `--quiet` suppress warnings? No, stderr is unchanged". Both hold. The claim that every validator round was metadata repair is only partly checked: the metadata rules appear in all 24 `author.validate` files.

Operator decisions on 2026-10-26: the before-after, roadmap and resource-map add-ons stay removed; the benchmark uses the level the helper picks; every recommendation below becomes a phase (015 to 018).

## Verdict

One effect of 054 is real and grader-independent: in the 054 variants every task line carries a `Verify:` clause (12 of 12 packets, 100% of lines); in the 12 control packets no task line does. The grade gains are confounded and the speed numbers are noise. The main confound: the 054 templates use this exact benchmark task as their worked example.

## Top three recommendations

1. Take the benchmark task out of the fill notes. `spec.md.tmpl:59` and `:100` say "a 17-line report"; `tasks.md.tmpl:83` says "prints 1 and 17"; `spec.md.tmpl:318/423/433` answer the upkeep requirement in advance. The now054 and refined sandboxes hit task terms in every core template; pre054 and main-no054 hit none. The `quiet_flag_refs=0` guard only counted references to the packet folder. These are comments, so the validator is unaffected.
2. Stop scaffolding the sections whose sample content is the defect. The "delete if N/A" notes did not work on this model: a sign-off table survived in 9 of 12 run-2 packets, about equally across variants.
3. Benchmark at the level the helper picks, and add a second task. The card says "Do not raise the level yourself" (`spec-authoring-card.md:38`), but the brief forces `--level 3`. The helper scores this change at 9/100, which is Level 0.

## What the data supports

- Supported: 054 beats both controls in both runs under two graders, mostly on Testable, matching the 0% to 100% `Verify:` result. Main drift alone accounts for about 3 of the 5 to 7 points over pre054.
- Not supported: refined against now054. Their templates differ by one spec line, some tasks notation and card wording; the grade gap flipped sign between runs (-4.3, then +0.6).
- Not supported: any speed claim. Paired spreads reach about 200 s at n=3.
- Generalization is unproven, because the worked example is the test itself.

Evidence-summary corrections: grader 2's pre054 mean includes the contaminated pre054 r1 packet; no per-packet grades were saved; the Step-block difference cannot come from the refinement (card section 6 and `plan.md.tmpl:124` are identical in both sandboxes, pooled 4 of 6 against 2 of 6); the add-on removal could not affect this brief; "Level 3 for a Level 2 input" is the brief's error; report length depends on the input (12, 16, 17 or 18 lines), so some "17" claims are true.

Cheapest decisive measurement: rescore the 24 packets with deterministic checks (`Verify:` ratio, template residue, stated line counts against `wc -l` for the named input, pointers to a missing decision-record.md), then run one new task no template mentions, 5 rounds, with output tokens as the speed proxy (spread 0.08 to 0.25 of the mean against 0.23 to 0.34 for seconds).

## Causes, over grader 2's 52 listed defects

1. Template sample content: 46 of 52; 42 of them sit in sections that exist only at Level 2 or above, so the forced Level 3 is their root cause.
2. Model factual errors: 5. Four of the five or six wrong-shape packets had run the script, so running it alone does not fix this.
3. Brief level plus the "total must match the level" note: 1 (an invented 76/100 score).
4. Card: 0 counted, but section 6 asks for Step blocks while line 68 makes the plan fill note "the contract for that section".

## Changes, by gain per unit of risk

1. Neutralize the task-specific examples. No validator change.
2. Drop the optional sample sections from the scaffold: sign-off, the enhanced-rollback checklist, the "Phase 1.5" sample and the edge-case rows. These are already optional in the validator (`orchestrator.ts:648`).
3. Demote Fix Completeness to optional (`tasks.md.tmpl:167` says every level requires it). This shrinks the required-anchor set (`orchestrator.ts:994`); update the parity test and diff strict results over all specs before and after.
4. Fix the card's plan-shape contradiction by dropping the Step requirement in card section 6; tasks.md already carries 100% `Verify:` lines.
5. Add a "Measured behavior" block: the author pastes the command and its verbatim output, and every number in the spec quotes it. A missing block is a warning only.

## Also noted

- The validator never failed on content in any of the 24 author runs; the failures were `GENERATED_METADATA_*`. Auto-repairing derived metadata while a packet is a Draft removes about one round per run and cannot turn a pass into a fail.
- Level 3 explains packet size: 785 to 977 lines in every variant, against 395 for the Level 1 example.
- The brief is loose: "final recommended-level line" is line 2 of 16.

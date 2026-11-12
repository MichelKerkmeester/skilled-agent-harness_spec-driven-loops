# Iteration 8: Measurement — what the benchmark proves today and what it would need

## Focus

Angle 8 (measurement): name the benchmark and fixture rows that separate a missed command from a wrongly started one, and establish what the existing corpora already assert. Chosen because iterations 1-7 produced design claims that are currently unfalsifiable by the repository's own gates.

## Actions Taken

1. Inventoried the routing-accuracy corpus files and counted rows and fields.
2. Measured the doctor command slice's coverage of doctor bridges, its chat-style share, and its control rows.
3. Read the captured scorer evaluation baseline and its metric names.
4. Cross-checked which metrics would move if command surfacing regressed to zero.

## Findings

1. The repository carries four prompt corpora: `labeled-prompts.jsonl` 195 skill-level rows, `holdout-prompts.jsonl` 66, `ambiguity-prompts.jsonl` 24, and `doctor-prompts.jsonl` 78 rows whose `expected_top` is a command-bridge id [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl:1].

2. Only the doctor slice asserts a command expectation, so command-level routing accuracy is measured for one of seven command families; the other 195 skill rows carry `skill_top_1` and `skill_correct` and no command field at all [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1].

3. The doctor slice already tests the chat-only path: only 15 of its 78 rows contain a literal `/doctor`, and the remaining 63 are prose prompts such as "Help me set up skilled" or "set up skilled in a new repo" [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl:2]. The corpus shape the spec asks for exists; it is just scoped to one command family.

4. Coverage is half-built inside that family: 17 of the 35 doctor bridges have at least one row, and 18 have none — including `command-doctor-ci-report`, `-ci-scaffold`, `-ci-toggle`, `-overlay-apply`, `-overlay-repin`, `-overlay-status`, `-sk-code-quality`, `-sk-skill-check`, `-sk-skill-convert`, `-symlink-link`, `-symlink-unlink`, `-skill-advisor-tune`, `-skill-advisor-rebuild`, `-skill-advisor-parent-skill`, `-skill-advisor-skill-graph-freshness`, `-speckit`, `-mcp-debug`, `-git-standards` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1].

5. The slice also carries 19 `control` rows whose expectation is a skill or `null` — "create a git worktree for my feature" → `sk-git`, "review this pull request for bugs" → `sk-code`, and a `null` expectation exists among them — which is exactly the wrongly-started guard, already authored, again doctor-scoped [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl:1].

6. The captured baseline records only skill-level metrics: `full_corpus_top1` 158/195 = 0.8103, `unknown_count` 13, `gold_none_false_fire` 5, `holdout_top1` 50/66 = 0.7576, `ambiguity_top1` 20/24 with tau 0.03 [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1]. A change that made every command unrecommendable would leave this baseline green, because no metric reads a command id.

7. The metrics that separate a missed command from a wrongly started one map onto names that already exist: `command_recall` (expected command in top-2 — the analogue of top-1 accuracy plus `expected_second`), `wrong_command_rate` (a command surfaced where the label is a skill or `null` — the analogue of `gold_none_false_fire`), plus two that do not exist yet: `policy_precision` (the surfaced command's `run|ask` matches the row's label) and `brief_naming` (the rendered brief contains the command string for every true positive, which is the only end-to-end check that the contract change from iteration 3 actually reached the model) [INFERENCE: from the four metric names and the baseline's existing pairs].

8. Row budget for the remaining 28 commands: at least two prose rows plus one control row per command is 56 positive and 28 control rows, or 84 rows; adding the 18 uncovered doctor bridges and their controls brings the corpus to roughly 240 command rows, which is the same order as the 195 skill rows that already exist [INFERENCE: from the per-bridge counts above and the doctor slice's 78 rows for 17 bridges].

## Answer to the measurement question

Keep the doctor slice as the template and extend it rather than inventing a new harness: every command gets ≥2 prose rows with `expected_top` set to its bridge id and `expected_second` where a skill should follow, every command gets ≥1 control row whose expectation is a skill or `null`, and every `mutates` command gets a row asserting `policy: ask`. Score four metrics — `command_recall`, `wrong_command_rate`, `policy_precision`, `brief_naming` — and ratchet them the way `scorer-eval-baseline.json` already ratchets top-1. Two of the four are new names on existing patterns; the other two exist only because this packet adds a policy field and a brief change, and without `brief_naming` the contract work is unmeasured.

## Ruled Out

- A new benchmark harness: the doctor slice already has the exact shape (prose prompt → command id, `expected_second`, controls), and a second harness would duplicate its fixtures.
- Measuring command surfacing through the existing skill metrics: a command-only regression leaves all five baseline metrics unchanged, which is the failure this iteration exists to prevent.

## Dead Ends

- Looking for a command-level metric anywhere in the captured baseline or the bench files: none. `scorer-bench.ts` and the baseline both speak skill ids only.

## Edge Cases

- Ambiguous input: "benchmark rows" could mean one row per command or one per command-target. Selected interpretation: per bridge id where a command has several routes (doctor), per command elsewhere, matching how `expected_top` is already populated.
- Contradictory evidence: none; the doctor slice and the baseline describe different granularities and both are internally consistent.
- Missing dependency: the 18 uncovered doctor bridges have no fixtures to copy from, so their rows need authoring rather than extension.
- Partial success: I did not run the corpora, only read them and their baseline, so this iteration measures coverage of the fixtures, not the current accuracy of command routing.

## Questions Answered

- Which benchmark rows and metrics separate a missed command from a wrongly started one?

## Questions Remaining

- 2 of 9 remain open.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts

## Assessment

- New information ratio: 1.0
- Questions addressed: Q8 (measurement)
- Questions answered: Q8
- Findings: 8, all new

## Reflection

- What worked and why: counting rows per field and per bridge turned "we need benchmarks" into a coverage table with exact gaps (17/35 doctor bridges, 0/28 others) and an exact budget. Reading the baseline's metric names showed the regression that would pass silently.
- What did not work and why: I first assumed all four corpora were skill-level and was ready to report zero command coverage; the doctor slice disproved it. The lesson is to inspect every corpus file's keys before characterising a suite.
- What I would do differently: enumerate expected_top values across all corpora first — one pass over four files — instead of reading files one at a time.

## Recommended Next Focus

Angle 9 (prior art): how other agent harnesses route a free-text request to a packaged workflow, from their public documentation — and what that implies for the mechanism chosen in iteration 6, especially whether any of them bind the behavior through a root document rather than a hook.

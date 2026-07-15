# Iteration 006 — revim-* reviewer/prompt benchmark harness

**Focus:** peck `benchmarks/` (revim-planner/acceptance-reviewer/code-reviewer + models.json) reviewer-prompt regression harness vs spec-kit deep-improvement Lane B/Lane C benchmarks.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.85 (highest of the run).

## Findings
- **[F-006-01]** peck benchmark target `revim` = known pass/fail cases against acceptance-reviewer/code-reviewer/planner; benchmark dirs define agent+cases, `models.json` the model matrix (`external/peck-master/benchmarks/AGENTS.md:3,7,27-34`, `benchmarks/models.json:2-16`); spec-kit model-benchmark also separates fixtures/profiles (`deep-improvement/assets/model-benchmark/README.md:17,21-25`). GAP partial. **ADAPT** · M · med · blast: Lane B fixture/profile schema + reporter.
- **[F-006-02]** peck reviewer benchmarks are GROUND-TRUTH VERDICT FIXTURES over real repo states/diffs: `config.sh` sets `CHECKOUT/INPUT/EXPECTED`; `run.sh` checks out revim, runs the agent/model, extracts `Pass|Fail|Block`, compares to expected (`revim-code-reviewer/config.sh:4-9`, `run.sh:32-58`); spec-kit Lane C scorer default measures ROUTING/resource recall, not known-bug diff detection (`skill-benchmark/score-skill-benchmark.cjs:388-408`). GAP real. **ADAPT** · M · med.
- **[F-006-03]** peck planner uses an OUTCOME ORACLE (pass requires new commits + story.md diff + clean tree) (`revim-planner/README.md:13-16`, `config.sh:13-22`); spec-kit model-benchmark has executable/hidden-test oracles for code tasks but not planner/reviewer workflow-state oracles (`model-benchmark/lib/code-task-scorer.cjs:300-355`). GAP partial. **ADAPT** · M · low.
- **[F-006-04]** peck model sweep (one case × many aliases/variants × repeats) is comparable but SIMPLER than spec-kit's Cartesian model×variant×framework×fixture×sample sweep (`run-parallel.sh:26-50` vs `sweep-benchmark.cjs:188-240`). GAP none for matrix mechanics. **SKIP mechanics / ADAPT fixture oracle** · S.
- **[F-006-05]** spec-kit CAN'T yet do "reviewer prompt catches this known bug class" as a first-class benchmark: Lane B fixtures are pattern/function contracts; Lane C validates routing/usefulness; D4 task-outcome advisory only. peck shows the missing shape (real diff/story input + expected verdict). GAP real. **ADOPT concept / ADAPT into spec-kit** · M · med · blast: add a reviewer-benchmark fixture type + expected-verdict rubric.
- **[F-006-06]** best mapping for a 006 reviewer-rule benchmark = Lane B model-benchmark + a NEW reviewer fixture/scorer (not Lane C router replay) (`start-model-benchmark-loop.md:1-4` vs `start-skill-benchmark-loop.md:6-9`). GAP real. **ADAPT** · M · med.

## Ruled out
- model alias/variant matrix + parallel repeats — spec-kit already expands models/variants/frameworks/fixtures/samples.
- hidden/withheld oracle concept — spec-kit code-task fixtures already use visible + held-out hidden_tests.
- Lane C private gold is routing gold, not reviewer-bug verdict gold.

## Verdict contribution
**Strategically important (highest novelty, 0.85).** peck supplies the missing shape: a REVIEWER-PROMPT REGRESSION HARNESS over real fixtures with expected verdicts. This is the validation substrate for ANY new reviewer/completion rule the sub-packet proposes (001/002/005). **ADOPT concept; ADAPT into deep-improvement Lane B** as a new reviewer-fixture type + scorer. Strong candidate sub-phase (it makes the other adoptions testable).

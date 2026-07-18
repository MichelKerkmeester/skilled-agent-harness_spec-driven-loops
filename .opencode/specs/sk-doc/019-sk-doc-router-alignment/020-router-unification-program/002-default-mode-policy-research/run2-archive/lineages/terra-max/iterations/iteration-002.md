# Iteration 2: Q2 / Thread 3 — Controlled Null-Hub Disambiguation Experiment

## Focus

Design a controlled experiment for `defaultMode: null` that separates evidence-based disambiguation from arbitrary mode selection. The explicit dispatch focus overrides the reducer's stale payload-sizing follow-up; it does not revisit the Run 1 keep/flip verdict or helper-payload sizing. “Adversarially ambiguous” is interpreted narrowly as a request that names two modes while explicitly requiring only one, with a valid multi-intent bundle retained as a positive control.

## Findings

1. The deterministic replay exposes a testable null-hub abstention trace: it reports `workflowMode`, `defaultApplied`, and `deferReason`; `defaultApplied` can only be true when no mode scored and the policy has a non-null default. The `sk-doc` policy sets `defaultMode` to `null`, so zero-signal fixtures can assert no automatic default separately from downstream response quality. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13]
2. A local three-prompt replay supplies stable controls for the first two strata: `I need help with some documentation.` produced no intents, `defaultApplied: false`, and `deferReason: "no-mode-scored"`; `Please add an argument-hint to a command.` produced only `create-command` from the `argument-hint` alias. This distinguishes correct abstention from a weak but discriminating signal without changing hub sources. [SOURCE: command output: node router-replay.cjs module invocation for the three listed prompts] [SOURCE: .opencode/skills/sk-doc/hub-router.json:27,42]
3. The adversarial prompt `I need a command template and a flowchart, but only one; choose one.` tied `create-command` and `create-flowchart` in replay and surfaced `deferReason: "ambiguous-multi-axis"`, while the replay still returned candidate modes and flowchart resources. That is a useful mechanical baseline, but it cannot itself prove clean model behavior: replay selects scored keywords within the ambiguity delta and returns telemetry/resources, whereas the hub contract requires `UNKNOWN_FALLBACK` when intent is contradictory. [SOURCE: command output: node router-replay.cjs module invocation for the three listed prompts] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480,643-702] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-97]
4. The controlled experiment should use matched, blinded fixture pairs in three strata: **Z** zero-signal prompts golded as `defer` with a discriminating clarification; **W** weak-signal prompts golded as one named mode; and **A** two-mode, “only one” prompts golded as `defer` retaining both candidates. Each A fixture needs an alias-order reversal and a paraphrase pair; a separate explicit-two-task prompt is the positive `orderedBundle` control. Measure exact outcome correctness (`single|orderedBundle|defer`), wrong-mode rate on Z/A, candidate-retention recall on A, clarification-discriminator adequacy, alias-order flip rate, and false-positive resource count. Run deterministic router replay as the mechanical control, then live dispatch with scorer-only gold to measure actual model behavior; the benchmark already runs replay before scoring, enables route-gold by default for hub skills, and reserves live dispatch for follow-on measurement. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20,65-89,174-206] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88] [INFERENCE: combining the replay telemetry seam, the null-hub contract, and the existing playbook's positive multi-intent control]

## Ruled Out

- Treating the existing SD-007 multi-intent scenario as the adversarial fixture: its contract deliberately permits a combined route or an explicit disambiguation, so it cannot detect an arbitrary single pick where the user said only one mode is wanted. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88]
- Treating deterministic replay alone as proof of model-level clean disambiguation: it records scored candidates and telemetry but does not grade the model's clarification or semantic handling of the “only one” constraint. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480,643-702] [SOURCE: .opencode/skills/sk-doc/SKILL.md:84-86]

## Dead Ends

- A single ambiguous fixture without alias-order and paraphrase counterparts cannot attribute a resulting pick to evidence rather than incidental ordering; use paired variants as the minimum adversarial unit. [INFERENCE: based on the equal-score replay result and the ordered hub tie-break policy]
- The legacy public/private fixture directory is supported only by explicit `--fixtures-dir` and is superseded by each skill's manual-testing playbook, so it is not the default seam for this experiment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:18-26,50-58]

## Edge Cases

- Ambiguous input: the forced dispatch focus overrides the reducer's Q1 follow-up. For the experiment, “adversarial” means contradictory single-choice wording, while a valid explicit two-task request remains a positive bundle control. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:47-50,73-77]
- Contradictory evidence: none. Replay telemetry and the user-facing hub fallback are different measurement layers; the gap is the reason to run both controls rather than a conflict to collapse.
- Missing dependencies: none. All evidence came from local committed sources and local replay.
- Partial success: none. The experiment design is answered; no live-model outcome is claimed or inferred as already measured.

## Sources Consulted

- .opencode/skills/sk-doc/hub-router.json:4-50
- .opencode/skills/sk-doc/SKILL.md:45-101
- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356,456-480,538-702,709-728
- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20,65-89,174-206
- .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,47-50,73-88
- .opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:18-26,50-58
- command output: local `node` invocation of `routeSkillResources` for zero-signal, weak-signal, and adversarial prompts

## Assessment

- New information ratio: 0.88
- Questions addressed: Q2 / thread 3 — controlled distinction between disambiguation and arbitrary picking under `defaultMode: null`.
- Questions answered: Q2 at the experiment-design and test-seam level; the live-model measurement is deliberately left for a later execution.

## Reflection

- What worked and why: replaying one prompt from each signal stratum against the same committed hub made the null-default behavior observable through stable telemetry instead of inferring it from prose alone.
- What did not work and why: deterministic replay cannot understand the semantic contradiction in “only one,” so its candidate list is necessary baseline evidence but not a sufficient behavioral verdict.
- What I would do differently: implement the paired fixture matrix in the playbook path, preserve private expected outcomes outside the model prompt, and score router and live traces separately before comparing alias-order invariance.

## Recommended Next Focus

Investigate Q3 / thread 4: define a reversible migration and rollback sequence for any default-policy change, using the Q2 fixture matrix as pre- and post-change regression evidence. [INFERENCE: Q2 supplies the missing behavior gate needed to make a rollback decision observable]

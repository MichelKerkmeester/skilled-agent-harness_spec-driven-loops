# Iteration 30: D3-A13 Loaded-vs-Applied Output-Diff Witness

## Focus

[D3-A13 / D3] Loaded vs applied: an output-diff witness for `sk-design`. This pass asks what proof is missing after route correctness and context loading: a concrete output choice that changed because a loaded mode rule was applied, classified as `not-loaded`, `loaded-inert`, or `loaded-determinative`.

## Actions Taken

1. Re-read iterations 27-29 and the active strategy so this pass did not re-cover hub-route gold, false `interface` defaults, or four-copy vocabulary drift.
2. Re-read the live `sk-design` hub, registry, shared context contract, context card, proof card, and proof checker. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:15] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47]
3. Re-read the skill-benchmark live executor, scorer, D4-R ablation, scenario authoring contract, operator guide, and playbook loader. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:59] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:242] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:133] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:26] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:152]
4. Checked three existing `design-interface` playbook scenarios that already contain prose-level output-choice gold: pinned brief, register-first gate, and critique-against reference. [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/02--brief-pinning-and-precedence/002-pinned-brief-followed-verbatim.md:42] [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/12--brief-to-dials-intake/016-register-first-context-gate.md:46] [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/04--system-as-critique-against/004-query-default-then-deviate.md:44]

## Findings

### Finding 1: The proof card claims application, but the deterministic checker only proves field presence

Severity: P1. Label: ENFORCEABLE on structured proof artifacts; ADVISORY for open-ended visual quality judgment.

The `Proof Of Application Card` says it proves loaded context changed the output, not merely that files were opened. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:15] The shared contract also says no design claim passes until the files behind that claim are named as loaded, and it defines proof fields used by parent sessions, delegated prompts, child responses, and final proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71]

The executable checker does not verify changed output. It searches for regex presence of four proof fields plus a checked READY verdict, then returns `ok` when fields are present and READY is true. [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:25] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:52] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:78] A card can therefore pass while naming `REGISTER / DIALS`, `CONTRAST PAIRS`, `INTERFACE PREFLIGHT`, `AUDIT EVIDENCE`, and READY, without tying any specific output choice to a specific mode rule.

Buildable recommendation: add an `APPLICATION WITNESSES` section to `proof_of_application_card.md` and extend `proof_check.py` with `--require-application-witness`. Minimum row shape:

```text
APPLICATION WITNESS:
- choice:
  mode rule:
  source path:
  source anchor:
  observed output excerpt:
  classification: not-loaded | loaded-inert | loaded-determinative
```

For final READY claims, require at least one `loaded-determinative` witness for every required mode in the route or bundle. `not-loaded` is a hard failure when the required rule path is absent from the manifest/read trace. `loaded-inert` is a hard failure when a required rule was loaded but no output choice follows it, or when the output contradicts the rule. This is deterministic when the artifact carries structured witnesses and excerpts; it stays advisory for judging whether the resulting design is tasteful.

### Finding 2: Live mode and D4-R can measure routing or task quality, but not rule-to-choice causality

Severity: P1. Label: ENFORCEABLE for transcript/JSON witness parsing; ADVISORY for semantic grade quality.

The live executor's prompt is explicitly routing analysis: it asks the model to determine surface, sub-language, reference paths, assets, and agent, then emit one JSON block. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:59] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:63] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:72] Its observed shape returns `observedResources`, `observedAssets`, `observedSurface`, and `statedRoutingCorrect: null`; it has no field for concrete output choices or source-rule attribution. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:252] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:255]

D4-R is closer because it asks for an actual minimal implementation plan, not a routing list. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:133] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:139] But it grades the on/off pair as a task-outcome usefulness delta with correctness, verification, focus, and hallucination axes. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:24] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:26] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:31] The operator guide and report renderer keep `D4_task_outcome` advisory and outside the weighted aggregate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md:76] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs:80]

Buildable recommendation: add a separate `applicationWitnesses` lane, not another D4-R score. In live/task-outcome mode, require the answer to emit both the task output and a structured witness block. The scorer should parse:

```json
{
  "applicationWitnesses": [
    {
      "choice": "REGISTER Product before palette",
      "sourcePath": "../shared/register.md",
      "sourceRule": "set register first",
      "mode": "interface",
      "classification": "loaded-determinative",
      "outputExcerpt": "REGISTER: Product ... palette inherits Product restraint"
    }
  ]
}
```

Then report `applicationWitness.passRate`, `loadedInertCount`, and `notLoadedCount` before any proof-card or adoption pass can count. This is enforceable for benchmark transcripts that carry structured witness JSON. The grader can still remain advisory for whether the final design is good.

### Finding 3: Existing playbooks already contain choice-level gold, but the loader does not preserve it as scorer gold

Severity: P1. Label: ENFORCEABLE.

The fixture authoring contract's private gold is currently `skillId`, `advisorLane`, `intentKeys`, `resources`, and `negativeActivation`; no output-choice or application-witness field exists. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:27]

The playbook loader captures root-table `expectedSignals`, but `parseFeatureFile` returns prompt, class, expected surface, expected intent, expected resources/assets, pass criteria, critical flag, and negative activation. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:137] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:176] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:186] There is no normalized `expectedSignals` or `expectedApplicationWitnesses` field in the scenario shape.

That loses real local gold. `ID-016` expects `REGISTER: Product`, WHY, DIALS, and downstream effect to appear before visual choices, and expects palette/layout/motion/copy to inherit the Product posture. [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/12--brief-to-dials-intake/016-register-first-context-gate.md:43] [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/12--brief-to-dials-intake/016-register-first-context-gate.md:47] `ID-002` expects the plan to keep cream `#F4F1EA`, serif display, and terracotta unchanged rather than applying anti-default deviation to pinned axes. [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/02--brief-pinning-and-precedence/002-pinned-brief-followed-verbatim.md:42] [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/02--brief-pinning-and-precedence/002-pinned-brief-followed-verbatim.md:45] `ID-004` expects one real system to be read as a default to critique against, then a justified deviation, no chooser menu, and no copied system content. [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/04--system-as-critique-against/004-query-default-then-deviate.md:44] [SOURCE: .opencode/skills/sk-design/design-interface/manual_testing_playbook/04--system-as-critique-against/004-query-default-then-deviate.md:47]

Buildable recommendation: add `expected_application_witnesses` to playbook frontmatter or a private sidecar consumed by the benchmark. Example:

```yaml
expected_application_witnesses:
  - id: register-before-choice
    mode: interface
    source_path: ../shared/register.md
    required_choice: "REGISTER: Product before palette/layout/motion/copy"
    forbidden_before_choice:
      - palette
      - layout
      - motion
      - copy
    classification_required: loaded-determinative
```

Then return `expectedApplicationWitnesses` from `load-playbook-scenarios.cjs`, join it with live `applicationWitnesses`, and fail the scenario before D4-R when required witnesses are absent or inert. This is deterministic for explicit string/regex patterns and structured JSON. Semantic paraphrase matching can remain a secondary advisory grader.

### Finding 4: The enforceable state machine is route-correct -> loaded -> determinative output choice, not loaded -> READY

Severity: P1. Label: ENFORCEABLE on a test corpus and proof-card artifacts; ADVISORY for open-world design-taste evaluation.

The hub already separates smallest-useful routing from build bundles, and UI build work requires a larger bundle plus context/proof cards before recommendations or ready claims. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] The context contract says the manifest is proof of context, not a summary. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] The hard gates block design decisions before required files are named and block ready claims before final proof fields are present. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:138] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150]

That chain still needs a middle state. A loaded rule can be absent from the output (`loaded-inert`), or an output can make a choice without the rule being loaded (`not-loaded`). Neither should count as applied. Only `loaded-determinative` proves the rule affected a concrete choice.

Buildable recommendation: insert this gate order into the future D3 scorer:

```text
hub-route-correct
context-loaded
application-witness
proof-card-shape
D4-R task-outcome advisory
```

The application-witness gate should emit three mutually exclusive states:

- `not-loaded`: expected mode/rule path missing from observed resources, read trace, or context manifest.
- `loaded-inert`: expected mode/rule path loaded, but required output choice missing, out of order, or contradicted.
- `loaded-determinative`: expected mode/rule path loaded and the response names a concrete output choice plus the rule/downstream effect that caused it.

This gives the later build an enforceable witness without pretending the tool can fully automate taste. It checks whether a cited mode rule had an observable effect; a human or grader can still judge whether the resulting design is good.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing proof needs a third layer after route correctness and context loading. The layer is a structured application witness tying one output choice to one loaded rule.
- Q5/all: The enforceable backlog item is an `applicationWitnesses` schema plus a scorer/checker lane that fails `not-loaded` and required `loaded-inert` cases before READY, adoption, or task-outcome credit. The advisory boundary is aesthetic quality and semantic paraphrase outside explicit witness gold.

## Questions Remaining

- Should `applicationWitnesses` live first in the proof card, in benchmark private gold, or in both with one generated from the other?
- Should each required mode need at least one `loaded-determinative` witness, or should witness count depend on route role such as primary/support/validation?
- Should the first implementation use strict structured JSON/regex only, or also add an advisory semantic grader for paraphrased output choices?

## Next Focus

D3-A14: exact application-witness schema and scorer placement: fixture fields, live parser shape, report section, first-failing-stage names, and how the witness gate interacts with proof cards and D4-R.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-027.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-028.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-029.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/shared/assets/context_loaded_card.md`
- `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`
- `.opencode/skills/sk-design/shared/scripts/proof_check.py`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/manual_testing_playbook/02--brief-pinning-and-precedence/002-pinned-brief-followed-verbatim.md`
- `.opencode/skills/sk-design/design-interface/manual_testing_playbook/04--system-as-critique-against/004-query-default-then-deviate.md`
- `.opencode/skills/sk-design/design-interface/manual_testing_playbook/12--brief-to-dials-intake/016-register-first-context-gate.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scoring_contract.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md`

## Assessment

newInfoRatio: 0.70. Prior D3 iterations established route correctness, default observability, vocabulary projection, backend/tool lockstep, and boundary proof. This pass adds the missing "applied" witness: a mode rule must cause a named output choice, or else the run is only loaded context plus self-attestation. The novelty is moderate-high because the proof card already gestures at changed output and the playbooks already contain prose choice gold, but no current checker or scorer preserves that as machine-readable evidence.

## Reflection

The useful distinction is not "did the skill read the right file?" but "did one loaded rule visibly constrain one output choice?" That keeps enforcement honest: deterministic where the artifact is structured, advisory where the remaining question is design quality.

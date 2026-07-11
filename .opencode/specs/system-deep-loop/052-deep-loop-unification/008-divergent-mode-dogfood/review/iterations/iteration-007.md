# Deep Review Iteration 007

## Dimension

Correctness, second pass over the previously unreviewed `deep-ai-council` and `deep-improvement` mode packets. This pass traced default producer-consumer paths for Council convergence and Lane B auto-workflow synthesis. The code graph remained unavailable per the persisted review state, so exact search, direct reads, and cross-file contract comparison supplied graphless fallback coverage.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:244-295`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:140-220`
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md:33-54`
- `.opencode/skills/system-deep-loop/runtime/lib/council/adjudicator-verdict-scoring.cjs:82-145`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:154-213`
- `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:35-63,183-201`
- `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:198-215`
- `.opencode/commands/deep/model-benchmark.md:138-175`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:419-452`

## Findings by Severity

### P0

None.

### P1

#### R7-P1-001 [P1] Council convergence discards proposal identity before stability scoring

- File: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:244`
- Evidence: The production seat adapter parses only the footer stance and emits `recommended_option` as `support`, `support_with_risks`, or `block`, regardless of the plan in the seat body. The default adjudicator then majority-votes that generic value at `orchestrate-topic.cjs:150-175`, and the next-round scorer treats an unchanged value plus empty confidence/risk/axis fields as zero delta at `adjudicator-verdict-scoring.cjs:126-141`. Two rounds whose seats support materially different plans can therefore stop as stable. The production CLI test asserts only the generic `SUPPORT` footer and does not exercise divergent supported plans at `orchestrate-session-cli.vitest.ts:154-213`.
- Finding class: algorithmic
- Scope proof: Direct reads covered the prompt producer, production parser, default adjudicator, stability scorer, and production CLI test. `orchestrate-topic.cjs:178-195` permits a custom adjudicator, but the normal session CLI path supplies no such function.
- Affected surface hints: council seat parser, default round adjudicator, verdict stability scorer, deep Council session runner
- Recommendation: Preserve a stable plan/option identifier in each seat verdict and require material-plan agreement before the default adjudicator can produce a stable recommendation; add a two-round test where generic stances match but proposals conflict.

```json
{"type":"claim_adjudication","findingId":"R7-P1-001","claim":"The default deep-ai-council session path can declare verdict stability when generic seat stances remain SUPPORT even though the supported plans materially differ.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:244-252",".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:150-175",".opencode/skills/system-deep-loop/runtime/lib/council/adjudicator-verdict-scoring.cjs:126-141"],"counterevidenceSought":"Checked the custom-adjudicator branch and production CLI tests for a plan-identity extractor or conflicting-plan convergence case.","alternativeExplanation":"A caller-supplied adjudicator can emit real option identifiers, but the production session runner does not configure one and therefore uses the lossy default merge.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if the production command path is shown to inject an adjudicator that derives stable material-plan identifiers before every score, or if default merge is unreachable in shipped sessions."}
```

#### R7-P1-002 [P1] Auto model-benchmark synthesis executes an unbound promotion step

- File: `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:192`
- Evidence: The autonomous workflow declares no `candidate_path` or `target_path` inputs at lines 35-44, yet synthesis contains an unconditional `step_promote_candidate` command using both placeholders and `--approve` at lines 192-195. The command router says selected workflow steps execute sequentially at `model-benchmark.md:148`, while the helper exits usage error when candidate or target is absent at `promote-candidate.cjs:449-452`. The confirm workflow demonstrates the intended conditional shape with `condition: gate_after_score == 'B' ...` at `deep_model-benchmark_confirm.yaml:210-214`; auto has no equivalent condition.
- Finding class: cross-consumer
- Scope proof: Exact search across all improvement workflow assets found promotion only in the two confirm workflows plus this auto Lane B step; the Lane A auto workflow does not promote. Direct reads covered auto inputs, both Lane B workflow variants, router execution semantics, and helper required arguments.
- Affected surface hints: model-benchmark auto workflow, Lane B synthesis, promotion helper, model-benchmark command router
- Recommendation: Remove promotion from autonomous synthesis or gate it behind explicitly bound candidate/target inputs and a real approval decision; keep benchmark-only auto runs successful and non-mutating by default.

```json
{"type":"claim_adjudication","findingId":"R7-P1-002","claim":"The Lane B auto workflow reaches a promotion command whose required candidate and target placeholders are not defined by that workflow, causing synthesis failure and potentially treating autonomous mode as approval.","evidenceRefs":[".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:35-44",".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:192-195",".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:449-452",".opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:210-214"],"counterevidenceSought":"Searched the auto workflow, command router, sibling improvement workflows, and promotion helper for bindings, skip conditions, or an engine-level optional-step contract.","alternativeExplanation":"The prose word 'Offer' may invite an AI orchestrator to skip the command, but the YAML step has a command and no condition while the confirm sibling expresses optionality with an explicit condition.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if the workflow executor has a verified rule that skips command-bearing steps described as offers, with an end-to-end auto run proving the unbound command is never evaluated."}
```

### P2

None.

## Traceability Checks

- `spec_code`: partial. The Council's material-agreement claim was checked against the production parser/adjudicator/scorer chain; Lane B's benchmark-only command claim was checked against its auto workflow and promotion helper.
- `checklist_evidence`: not re-entered; iteration 5 owns that completed direction.
- Overlay protocols: not re-entered; iteration 6 owns the overlay stabilization direction.
- Resource map: not present, so the coverage gate remains skipped.
- Review depth: complex/strict with graphless fallback. Required bug classes `proposal_identity` and `autonomous_promotion_boundary` both produced findings; no high-risk selected target was omitted.

## Verdict

CONDITIONAL. Two new P1 correctness findings affect default execution paths. No P0 or P2 findings were found.

## Next Dimension

Correctness stabilization on the remaining unreviewed deep-improvement Lane C/Lane D dispatch adapters, without re-entering Council convergence or Lane B promotion.

Review verdict: CONDITIONAL

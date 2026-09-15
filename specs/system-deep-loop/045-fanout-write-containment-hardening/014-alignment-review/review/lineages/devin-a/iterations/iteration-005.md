# Iteration 5: General Architecture

## Focus

Lane 6 of the packet spec: the shared-checkout containment model, the fan-out runner, the merge and reducers, and the dispatch adapters read as one system — contradictions, dead paths and duplicated rules.

Files reviewed:
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` (lines 12, 23, 751-757, 823-843, 890-891)
- `.opencode/commands/deep/assets/deep-review-confirm.yaml` (lines 199-221: step_fanout_spawn_cli + step_fanout_spawn_native)
- `.opencode/commands/deep/assets/deep-review-auto.yaml` (lines 214-244 fan-out doctrine, 829-903 pivot-seat dispatches)
- `.opencode/agents/deep-review.md` (lines 30, 50-60: single-iteration contract + HALT condition)
- `.opencode/skills/system-deep-loop/deep-review/SKILL.md` (lines 43-56: forbidden invocation patterns)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (lines 549-570 lock liveness, 3196-3211 buildLineageCommand, 3165-3170 session/prompt)
- `.opencode/commands/deep/assets/deep-review-auto.yaml` (lock_file path line 151)

## Scorecard

- Dimensions covered: correctness, security, traceability
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.16

## Findings

### P1, Required

- **F011**: `deep-review-confirm.yaml`'s native fan-out branch dispatches the LEAF `deep-review` agent as a full-loop executor, `.opencode/commands/deep/assets/deep-review-confirm.yaml:208-221`. The step's context says "Execute the deep-review loop with these parameters: ... Run to convergence. Write all outputs to the override directory." That is exactly the pattern the sibling auto YAML forbids ("the LEAF deep-review agent is used only for individual iterations, never as a full-loop sub-agent or pasted phase-running prompt", `.opencode/commands/deep/assets/deep-review-auto.yaml:224-227`), which the agent's own contract forbids ("This agent executes a SINGLE review iteration, not the full loop", `.opencode/agents/deep-review.md:30`; HALT on full-loop dispatch requests, `:50-60`), and which the SKILL.md lists under FORBIDDEN INVOCATION PATTERNS ("Dispatch the @deep-review LEAF agent via the Task tool for iteration loops", `deep-review/SKILL.md:51`). A confirm-mode fan-out with native executors dispatches an agent that is contractually required to refuse the task (or to produce a single iteration, failing the runner's forced-depth validation). The deep-research confirm YAML has no equivalent native branch, so this is review-specific. Dimension: correctness.

## Claim Adjudication

### F011 (P1)

```json
{
  "findingId": "F011",
  "claim": "deep-review-confirm.yaml step_fanout_spawn_native dispatches the LEAF deep-review agent to run the full review loop, contradicting the auto YAML, the agent contract, and the SKILL.md forbidden-invocation list.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep-review-confirm.yaml:208-221",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:224-227",
    ".opencode/agents/deep-review.md:30",
    ".opencode/agents/deep-review.md:50-60",
    ".opencode/skills/system-deep-loop/deep-review/SKILL.md:51"
  ],
  "counterevidenceSought": "Checked whether fanout-run.cjs handles native lineages itself in confirm mode (it does not — the confirm YAML skips the runner for native and dispatches directly); verified the auto YAML's own native path (buildLineageCommand via fanout-run.cjs, lines 1567/1657/1747) never pastes a phase-running prompt; confirmed the deep-research confirm YAML has no step_fanout_spawn_native.",
  "alternativeExplanation": "The native branch may be aspirational for a future native loop runner — but as shipped it names agent: deep-review, which is the LEAF iteration agent, so the contradiction stands.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the confirm YAML's native branch is rewired to the deep/review command surface (config.fanout_lineage_artifact_dir single-lineage invocation) like the auto path, downgrade to P2 stale-branch note.",
  "transitions": [{"iteration": 5, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | deep-review-confirm.yaml:208-221 vs deep-review-auto.yaml:224-227, agents/deep-review.md:30 | Full-loop LEAF dispatch in the confirm native branch (F011); hard-gate failure |
| playbook_capability | partial | advisory | fanout-merge.cjs:823-843 | Merge strongest-restriction verified (any active P0 -> FAIL) |

## Assessment

- New findings ratio: 0.16 (1 P1; weighted 5 of accumulated 31)
- Dimensions addressed: correctness, security (containment/lock model), traceability
- Novelty justification: final lane; F011 first-seen
- Verdict mapping: P1 present (no P0) -> CONDITIONAL

## Ruled Out

- Merge strongest-restriction fiction: `fanout-merge.cjs:823-843` filters active findings and sets merged FAIL on any active P0; the presentation asset's claim (deep-review-presentation.txt:472) matches the code. Ruled out.
- Lock-file path drift: YAML `lock_file: {artifact_dir}/.deep-review.lock` matches `DEEP_LOOP_LOCK_FILENAMES` in fanout-run.cjs:491 and the liveness check at 549-570. Ruled out.
- Auto-YAML pivot-seat dispatches: the pivot seats (deep-review-auto.yaml:829-903) are bounded single-iteration read-only direction-selection seats rendered from `renderReviewPivotSeatPrompt`, not full-loop dispatch — consistent with the LEAF contract. Ruled out.
- Containment-mode contradiction: runner default `preserve` matches the SKILL.md NEVER-rule wording ("it no longer reverts them"); restore is opt-in. Ruled out.

## Dead Ends

- Full read of fanout-pool.cjs cap logic and fanout-salvage.cjs: pool/salvage internals are exercised only under multi-lineage load; the flat-pool path was validated by this run's own dispatch. Not pursued further.

## Recommended Next Focus

Synthesis: compile all 11 findings (5 P1, 6 P2, 0 P0) into the lineage review report with remediation workstreams; merged verdict for this lineage is CONDITIONAL (no P0; four active P1s with adjudication packets).

Review verdict: CONDITIONAL

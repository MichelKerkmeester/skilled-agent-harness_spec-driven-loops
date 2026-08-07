# Iteration 001 - Correctness

## Scope
Focused pass over fan-out artifact root binding and reducer ownership.

## Findings

### P0

- **F001**: deep-review reducer ignores fan-out artifact_dir override - `.opencode/skills/deep-review/scripts/reduce-state.cjs:1673` - The workflow explicitly binds `artifact_dir` from `config.fanout_lineage_artifact_dir` when present [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:118], and this lineage prompt depends on that binding. Later the workflow runs `node .opencode/skills/deep-review/scripts/reduce-state.cjs {spec_folder}` [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1059]. The reducer then unconditionally resolves `{spec_folder}/review` with `resolveArtifactRoot(resolvedSpecFolder, 'review')` [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1673] and its CLI accepts only a positional `specFolder`, with no artifact-dir override [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1786]. In a fan-out lineage, reducer refreshes read/write the canonical packet or fail on missing canonical state instead of operating inside the lineage packet.

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "The deep-review reducer cannot honor config.fanout_lineage_artifact_dir and therefore targets the canonical review packet during a fan-out lineage refresh.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:118",
    ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1059",
    ".opencode/skills/deep-review/scripts/reduce-state.cjs:1673",
    ".opencode/skills/deep-review/scripts/reduce-state.cjs:1786"
  ],
  "counterevidenceSought": "Checked the reducer CLI and reduceReviewState signature for --artifact-dir, artifactDir, or config.fanout_lineage_artifact_dir handling; none is present.",
  "alternativeExplanation": "The workflow may assume reducer is never called inside fan-out children, but the YAML's normal loop includes step_reduce_review_state and fan-out prompts ask children to run phase_main_loop.",
  "finalSeverity": "P0",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if the command renderer injects artifact_dir by another hidden mechanism before invoking reduce-state.cjs or skips reducer inside fan-out lineages.",
  "transitions": []
}
```

## Verdict Rationale
This iteration found an active P0. The lineage cannot safely claim fan-out review completion while reducer-owned outputs may be written outside the lineage packet.

Review verdict: FAIL

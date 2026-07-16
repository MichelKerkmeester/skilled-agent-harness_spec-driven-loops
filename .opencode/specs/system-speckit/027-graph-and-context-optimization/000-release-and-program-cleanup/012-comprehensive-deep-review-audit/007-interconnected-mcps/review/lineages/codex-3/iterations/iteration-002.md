# Iteration 002 - Security

## Focus
Executor sandbox defaults and artifact write boundary safety.

## Findings
### P1
- **F002**: Fan-out lineages run with repo-write permission while the artifact boundary is prompt-only - `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83` - unset sandbox mode normalizes to `workspace-write`, `fanout-run.cjs` tells the child agent not to touch outside the lineage directory, and the subprocess is spawned from the repo root with that prompt as the only observed artifact boundary. The OpenCode branch explicitly uses `--dangerously-skip-permissions`, and the review command notes that `sandboxMode='read-only'` is not honored there. [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344`] [SOURCE: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:910`]

### P0
None.

### P2
None.

## Claim Adjudication
```json
{
  "findingId": "F002",
  "claim": "CLI fan-out write boundaries are enforced by instruction rather than a runtime permission boundary",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344",
    ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:910"
  ],
  "counterevidenceSought": "Checked permissions-gate references and command dispatch paths for an artifact-local enforcement call in fanout-run.",
  "alternativeExplanation": "Workspace-write may be necessary for iteration artifact writes, but that does not restrict writes to the lineage artifact directory.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if fanout-run applies a runtime permission matrix or launches each CLI with only the lineage artifact dir writable."
}
```

Review verdict: CONDITIONAL

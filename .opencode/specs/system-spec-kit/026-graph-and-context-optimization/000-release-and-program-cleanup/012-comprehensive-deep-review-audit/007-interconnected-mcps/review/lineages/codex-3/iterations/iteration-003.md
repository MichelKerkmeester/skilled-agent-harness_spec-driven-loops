# Iteration 003 - Traceability

## Focus
Executor config validation correctness and spec-to-code contract drift.

## Findings
### P1
- **F003**: Per-lineage `iterations` config changes only timeout, not the loop bound - `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:122` - `lineageExecutorSchema` documents `iterations` as a per-lineage max-iterations override, but `buildLoopPrompt()` omits any `max_iterations` parameter and only asks the child to run to convergence. The only runtime consumer in `fanout-run.cjs` is `computeLineageTimeoutMs()`, where `iterations` sizes the timeout. [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:131`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154`]

### P0
None.

### P2
None.

## Traceability Checks
- `spec_code`: partial. The slice asks for executor config validation correctness and specifically calls out `iterations`; the code confirms the issue.
- `checklist_evidence`: pass. No `checklist.md` exists for this Level 1 review slice.

## Claim Adjudication
```json
{
  "findingId": "F003",
  "claim": "lineage iterations are not propagated to the child loop's max-iteration bound",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:131",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154"
  ],
  "counterevidenceSought": "Checked buildLoopPrompt parameters and fanout-run command construction for max_iterations or max-iterations propagation.",
  "alternativeExplanation": "The timeout scaling may have been intended as the only use of iterations, but the schema text says max-iterations override.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if the schema is rewritten to describe timeout sizing only, or if fanout-run passes iterations into the child config."
}
```

Review verdict: CONDITIONAL

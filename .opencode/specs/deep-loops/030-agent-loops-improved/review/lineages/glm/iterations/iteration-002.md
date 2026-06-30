# Deep Review Iteration 002

## Dispatcher
- Session: `fanout-glm-1782805948784-ypcv5r`
- Run: 2
- Focus: `fanout-lineage-isolation`
- Focus area: confirm detached lineage artifact isolation and merge/salvage behavior after partial lineage outputs
- Budget profile: `scan`
- Status: `complete`

## Files Reviewed
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:481`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1362`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1381`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1392`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1416`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:93`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:138`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:168`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:318`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:717`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_review_auto.yaml:1164`

## Findings - New

### P0 Findings
- None.

### P1 Findings
1. **Unrecoverable iteration salvage can still produce a fulfilled lineage when the summary report exists** -- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1416` -- `runSalvageSweep()` detects iteration numbers from the child state log and, when stdout cannot recover the missing iteration markdown, writes only a `fanout_salvage_failed` marker while incrementing `failed` [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:93] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:138]. The runner records that salvage summary but only throws for timeout/non-zero exit, missing top-level expected artifacts, or stop-policy violation before returning a fulfilled result [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1362] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1381] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1392] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1416]. For review lineages the expected artifact check is only `review-report.md`, so a child with a report/registry but a failed per-iteration markdown salvage is accepted as fulfilled and can be merged by registry-only synthesis [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:481] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:717] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_review_auto.yaml:1164].
   - Finding class: cross-consumer
   - Scope proof: Checked the salvage writer, runner success/failure gates, pool settlement, failure classifier, review merge, and review synthesis handoff. The only `salvage.failed` classifier is downstream of thrown worker errors; fulfilled worker outputs are marked completed without invoking that classifier [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:168] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:318].
   - Affected surface hints: `["fanout-run.cjs success gates", "fanout-salvage.cjs failed marker", "fanout-pool.cjs fulfilled settlement", "fanout-merge.cjs review registry merge", "deep_review_auto.yaml synthesis"]`
   - Recommendation: Treat `salvage.failed > 0` as a lineage failure unless a later validation proves every state-log iteration has a non-marker iteration markdown file; include the salvage summary on the thrown error so the existing `salvage_miss` retry/telemetry path runs, and add a regression with `review-report.md` present plus one unrecoverable missing iteration markdown.

```json
{
  "type": "claim-adjudication",
  "claim": "A review fan-out lineage can be marked fulfilled after an unrecoverable iteration-markdown salvage failure when its top-level review report exists.",
  "evidenceRefs": [
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:93",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:138",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:481",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1362",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1416",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:168",
    "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:717"
  ],
  "counterevidenceSought": "Checked for direct `salvage.failed` rejection in fanout-run and found none; checked `findMissingLineageArtifacts()` and found review expects only review-report.md; checked cli-guards and fanout-pool and found salvage_miss classification only applies to rejected worker errors, while fulfilled workers emit completed results.",
  "alternativeExplanation": "The implementation may intentionally accept top-level report/registry as sufficient merge input and treat missing iteration markdown as audit-only. That still contradicts the deep-review artifact contract because iteration markdown is the durable evidence surface and downstream automation parses iteration files and final verdict lines.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade if production review lineages cannot produce review-report.md/registry when any state-log iteration lacks a real iteration markdown, or if a separate validator rejects the `fanout_salvage_failed` marker before fanout-merge can run."
}
```

### P2 Findings
- None.

## Traceability Checks
- `spec_code`: partial/pass for this focus. The reviewed runtime/workflow surfaces match the parent packet's deep-loop runtime/workflow command scope; the active issue is inside named fan-out implementation and synthesis surfaces.
- `checklist_evidence`: blocked. Child checklist sweep remains outside this single fanout-lineage-isolation iteration.
- `feature_catalog_code`: partial. Strongest-restriction registry merge exists, but partial-output salvage failure can be hidden before merge if only the top-level report/registry is present.

## Integration Evidence
- `fanout-salvage.cjs` writes a failed marker for unrecoverable iteration markdown recovery.
- `fanout-run.cjs` returns fulfilled lineage output after salvage unless one of its separate failure gates fires.
- `fanout-pool.cjs` records fulfilled worker outputs as completed without failure classification.
- `fanout-merge.cjs` merges only lineages with registries and does not inspect per-iteration markdown salvage markers.
- `deep_review_auto.yaml` calls `fanout-merge.cjs` in synthesis before deriving the merged verdict.

## Edge Cases
- The provided Spec Memory detached session id was rejected as not server-managed; local file evidence was used instead.
- Budget discipline caveat: validation and counterevidence reads exceeded the selected scan profile after the optional memory lookup failed; outputs are still coherent and all writes are packet-local.
- Prior iteration P1 remains active and affects the verdict; this iteration does not claim full lineage completion.

## Confirmed-Clean Surfaces
- Strongest-restriction severity merge is present for registries that reach `fanout-merge.cjs`: active P0 produces `FAIL`, active P1 produces `CONDITIONAL`, otherwise `PASS` [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:606].
- Missing top-level review reports are rejected by `fanout-run.cjs`; the finding is limited to failed per-iteration markdown salvage when the top-level report/registry exists [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1392].

## Ruled Out
- P0 escalation: ruled out because the issue corrupts review evidence/merge trust but does not itself prove immediate destructive data loss or exploitable security impact.
- Broad sandbox isolation review: ruled out because this iteration's assigned focus was partial lineage outputs and salvage/merge behavior, not executor write containment.
- Reducer-owned registry/dashboard/report mutation: ruled out by the detached leaf boundary.

## Next Focus
- dimension: correctness
- focus area: runner retry/exit semantics around partial fan-out lineages and existing active P1s
- reason: both active findings are in detached CLI fan-out behavior and should be followed by correctness validation of retry/failure propagation.
- rotation status: move from lineage isolation to first remaining core dimension.
- blocked/productive carry-forward: PRODUCTIVE — direct runner/salvage/merge reads exposed actionable integration gaps.
- required evidence: `fanout-run.cjs`, `fanout-pool.cjs`, `scripts/lib/cli-guards.cjs`, and relevant fanout unit tests.

Review verdict: CONDITIONAL

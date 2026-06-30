# Deep Review Iteration 003 - GLM Fan-out Lineage

## Dispatcher
- session_id: fanout-glm-1782805948784-ypcv5r
- run: 3
- status: complete
- budgetProfile: scan (selected before analysis; exceeded during counterevidence reads, recorded in Edge Cases)
- dimension: correctness
- focus: runner retry/exit semantics around partial fan-out lineages and existing active P1s

## Files Reviewed
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` lines 1180-1417
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` lines 120-153 and 520-689
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` lines 152-190
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` lines 105-147
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` lines 720-788
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` lines 430-559

## Findings - New

### P0 Findings
- None.

### P1 Findings
1. **Mixed salvage/missing-artifact failures skip the transient retry path** -- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:176` -- `fanout-run` turns an exit-0 lineage with missing expected top-level artifacts into a thrown failure and deliberately attaches `failed: Math.max(1, salvage.failed)` to the salvage summary while preserving any successful iteration salvage count [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1392`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1399`]. The retry classifier only marks `salvage_miss` when `salvage.failed > 0 && salvage.salvaged === 0` [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:176`], and the pool schedules retries only for errors normalized as `retryable === true` [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:543`]. A partial lineage that salvages at least one iteration but still misses `review-report.md`/other expected artifacts is therefore normalized as a fatal `exit` failure instead of the transient missing-artifact condition the runner tried to encode, so it consumes the lineage without retry and preserves partial review evidence as terminal.
   - Finding class: cross-consumer
   - Scope proof: Checked runner failure construction, salvage counting, failure normalization, retry scheduling, and fanout unit coverage; current tests cover pure salvage-miss retry [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:733`] and failure-class rollup where `salvaged` is zero [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:430`], but not mixed `{ salvaged: >0, failed: >0 }` missing-artifact failures.
   - Affected surface hints: ["fanout-run missing artifact failure", "cli-guards failure classification", "fanout-pool retry scheduler", "fanout-run retry tests", "review/research/context lineage artifacts"]
   - Recommendation: Classify any `salvage.failed > 0` lineage-artifact failure as retryable unless an explicit fatal exit class is present, or attach a separate `missingArtifacts`/`artifact_miss` retry signal that survives successful iteration salvage; add a regression where one iteration is salvaged but the top-level expected artifact remains missing and the retry succeeds.
   - Claim adjudication:
     ```json
     {
       "type": "gate-relevant P1 compact skeptic/referee",
       "claim": "Mixed successful iteration salvage plus missing expected artifact bypasses the transient retry semantics and is treated as fatal.",
       "evidenceRefs": [
         ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1392",
         ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1399",
         ".opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:176",
         ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:543",
         ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:733",
         ".opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:430"
       ],
       "counterevidenceSought": "Checked retry scheduler, failure-class normalization, salvage sweep behavior, and fanout-run/pool tests for a mixed salvaged+failed retry case; only pure salvage-miss retry is covered.",
       "alternativeExplanation": "A design could intentionally make mixed salvage fatal after any recovered content, but fanout-run explicitly adds failed>=1 for missing expected artifacts, which is a retry signal defeated by the classifier's salvaged===0 guard.",
       "finalSeverity": "P1",
       "confidence": "high",
       "downgradeTrigger": "Downgrade only if the owning workflow contract states that missing top-level artifacts after any successful iteration salvage must never be retried."
     }
     ```

### P2 Findings
- None.

## Traceability Checks
- Parent-scope traceability remained bounded to named implementation surfaces; no child phase docs were broadened into code findings this iteration.
- Existing active P1s were considered as context: prompt initialization gap and exit-0 salvage-fulfilled lineage remain active and compatible with this new retry-classification finding.

## Integration Evidence
- `fanout-run.cjs` worker failure construction is the producer of missing-artifact salvage summaries.
- `scripts/lib/cli-guards.cjs` is the classification boundary that converts worker errors into retryable/fatal lineage failures.
- `fanout-pool.cjs` is the retry scheduler consuming that classification.
- `tests/unit/fanout-run.vitest.ts` and `tests/unit/fanout-pool.vitest.ts` are the regression surfaces for retry semantics.

## Edge Cases
- Config, registry, dashboard, and report files are absent by direct leaf boundary; not treated as blockers and not created.
- Budget profile was selected as `scan`, but counterevidence reads exceeded the nominal call budget; artifact/state remain complete and the overrun is recorded for operator audit.
- Code graph freshness was stale in startup context, so structural-impact analysis was not used; direct file reads provide the cited evidence.

## Confirmed-Clean Surfaces
- Pure non-zero exit handling remains terminal and counted as failed/all_failed according to runner and pool tests [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:720`].
- Timeout/salvage-miss retry exhaustion is represented in pool tests for pure transient failures [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:494`].

## Ruled Out
- P0 escalation: ruled out because the verified impact is retry/fan-out review evidence completeness, not immediate destructive data loss or an exploitable security issue.
- Broad merge synthesis review: ruled out because this iteration's assigned focus was runner retry/exit semantics.
- Retrying exhausted approaches from iterations 001-002: ruled out by strategy; this iteration did not re-review prompt init or fulfilled exit-0 salvage as standalone findings.

## Next Focus
- dimension: security
- focus area: executor environment and sandbox trust boundaries for detached fan-out lineages
- reason: correctness findings now cluster around fan-out failure handling; rotate to the next remaining core dimension to check trust-boundary risk.
- rotation status: move from correctness to security
- blocked/productive carry-forward: PRODUCTIVE — direct runner/pool/classifier reads exposed another actionable retry-semantics issue
- required evidence: fanout-run.cjs environment construction, scripts/lib/cli-guards.cjs, executor dispatch environment helpers, and deep-loop workflow prompts that constrain detached lineage writes

Review verdict: CONDITIONAL

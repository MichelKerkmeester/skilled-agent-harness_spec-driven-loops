# Review Iteration 006 - attach-scorer-10

## Dispatcher

- Mode: review, leaf iteration 6 (cross-reference confirmation) of the `attach-scorer-10` fan-out lineage.
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the seven `attach-scorer` rows of `review/review-scope-10.txt`.
- Focus read first: `review/review-brief-10.txt`; no dimension remains open, so this pass runs the cross-reference analysis the agent contract names as the fallback and records it as an edge case.
- Prior state read: state log (five iterations), registry (four open findings), strategy (all dimensions complete).
- Holdout rule honoured: no prompt corpus was opened and no session text was printed.

## Files Reviewed

| File | Lines read | Dimension |
|------|-----------|-----------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 409-451 | cross-reference |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 165-190 | cross-reference |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 609-742 | cross-reference |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | 1520-1560 | cross-reference |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | 44-56 | cross-reference |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 134 | cross-reference |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | 26-36 | cross-reference |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. AC10-P1-001 is unchanged.

### P2 Findings

None new. The three open P2 are unchanged.

## Traceability Checks

- `spec_code` -- pass on the cross-reference read: the registry's four findings, the four iteration narratives and the strategy counts agree, and each finding still resolves to the same `file:line`. No requirement row moved during the run.
- `checklist_evidence` -- notApplicable; no `checklist.md` in this phase-parent packet.

## Integration Evidence

- Registry coherence: `openFindingsCount` 4, `findingsBySeverity` P0 0 / P1 1 / P2 3, and `dimensionCoverage` true for all four, matching the four narratives and the strategy's running counts.
- Dashboard coherence: iteration 5 of 8, provisional verdict CONDITIONAL, and the progress table lists iterations 1-5 with their ratios and severities.
- The four finding sites were re-read: `command-attach.ts:423` (P1 and P2-002), `:416`/`:399` (P2-003), and `tests/command-transcript-score.vitest.ts:1544` (P2-001). Each still matches its narrative.

## Edge Cases

- Cross-reference fallback: every dimension is complete and no new direction is left in the area, so this pass audits the state coherence instead. That fallback is recorded here as the agent contract requires.
- No conflict was found between the registry, the dashboard, the strategy and the narratives.

## Confirmed-Clean Surfaces

- All five prior iterations' `graphEvents` were persisted and the coverage graph holds the dimension, file, finding and evidence nodes plus the COVERS, IN_DIMENSION, IN_FILE and EVIDENCE_FOR edges.
- The state log carries one canonical `type:"iteration"` record per iteration, each with the required route proof, and the delta files exist for iterations 1-5.
- No review target, config, registry, dashboard or reducer output was modified by this lineage outside the gateway and reducer.

## Ruled Out

- A state-integrity defect: the four state surfaces agree.
- A new finding from the cross-reference read: no new input appeared.
- Re-reporting the recorded limits and the `capturedAtSha` question.

## Verdict

No new finding. Active findings remain one P1 and three P2; CONDITIONAL by the active-finding mapping.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis and stop decision
- Reason: every dimension is covered, both core protocols are recorded, and the state surfaces agree
- Rotation status: D1-D4 complete, confirmation and cross-reference complete
- Required evidence: the convergence decision is a STOP before synthesis begins
- Recovery note: none

Review verdict: CONDITIONAL

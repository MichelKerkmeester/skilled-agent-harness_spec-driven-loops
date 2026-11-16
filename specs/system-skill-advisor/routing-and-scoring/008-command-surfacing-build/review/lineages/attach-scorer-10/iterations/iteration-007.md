# Review Iteration 007 - attach-scorer-10

## Dispatcher

- Mode: review, leaf iteration 7 (stuck recovery: escalate-severity review) of the `attach-scorer-10` fan-out lineage.
- Recovery entry: `stuckRecovery` from iteration 6 (`stuckThresholdReached`), recorded through the append gateway as `deep_review.recovery_started` with strategy `escalate-severity-review`, target dimension correctness.
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the seven `attach-scorer` rows of `review/review-scope-10.txt`.
- Focus read first: `review/review-brief-10.txt`; this pass changes granularity from cross-reference to an explicit P0/P1 hunt over the carried findings and their call paths.
- Holdout rule honoured: no prompt corpus was opened and no session text was printed.

## Files Reviewed

| File | Lines read | Dimension |
|------|-----------|-----------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 240-270, 330-455, 480-520 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 160-240, 455-485 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 700-760, 1355-1375, 1495-1545 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | 1430-1575 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | 44-56, 1788-1812 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 134 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | 26-36 | correctness |

## Findings by Severity

### P0 Findings

None. The escalation hunt asked whether an offer on a refused prompt can execute anything by itself, and it cannot: `attachCommand` returns a command string on a recommendation, `typedCommandForTop` returns a typed command record, and no path in the area executes, writes, or bypasses a policy. There is no data-loss, auth-bypass or destructive-action path in the seven files.

### P1 Findings

None new. AC10-P1-001 remains P1 and is not P0: the worst outcome is an unwanted offer of a command the reader refused, and the command's own policy still governs whether it starts; the defect does not auto-run or auto-write.

### P2 Findings

None new. The three open P2 keep their severity: each is a coverage or comment gap on code whose current behaviour is correct, so none reaches the P1 bar.

## Traceability Checks

- `spec_code` -- pass on the escalation read: `REQ-006` and `REQ-003` still match their code and cases, and the D-01 disposition still owns the mention fix with the single-quote input uncovered.
- `checklist_evidence` -- notApplicable; no `checklist.md` in this phase-parent packet.

## Integration Evidence

- Escalation call-path check: `commandOnlyMentioned` is consulted at `command-attach.ts:259` and `:501` and at `scorer/fusion.ts:1213`, `:1232`, `:1248`; every one returns a recommendation or a command record. No caller writes, starts, or executes from the predicate.
- Guarded-write call path: `startState` at `score-command-transcripts.mjs:1500` computes `unsafe` from `selfAuto || (guarded && wrote)`, and `started` from `touched && shape !== 'readOnly'`; no write is performed by the reader.
- The two severity questions (P1 not P0, P2 not P1) were each answered from these call paths, not from the finding text.

## Edge Cases

- Recovery pass: the last two iterations were zero-finding and the stuck threshold fired, so this pass deliberately searched for a missed P0/P1 and for an over-rated P2 rather than repeating the cross-reference read. No change to the finding set followed.
- A refused command that carries a `run` policy is still only offered; the host decides to start it, so the P1 impact stays an unfit offer.
- The single-quote gap and the apostrophe comment remain linked but separately rated, as recorded in iteration 4.

## Confirmed-Clean Surfaces

- No P0 class exists in the changed surfaces: no destructive write, no auth or policy bypass, no secret handling, no filesystem execution.
- The scorer's `unsafe` flag is a measurement and cannot itself start or stop a run.
- The bench and README changes carry no behavioural path.

## Ruled Out

- Escalating AC10-P1-001 to P0: no automatic execution follows the offer.
- Escalating any P2 to P1: each gap leaves today's behaviour correct.
- Re-opening the recorded limits or the `capturedAtSha` question.

## Verdict

No new finding. Active findings remain one P1 and three P2; CONDITIONAL by the active-finding mapping.

## Next Focus

- Dimension: none remaining
- Focus area: stop decision, then synthesis
- Reason: the recovery pass confirmed the finding set and all four dimensions are covered
- Rotation status: D1-D4 complete; recovery complete
- Required evidence: the next convergence decision is a STOP before synthesis
- Recovery note: the escalation strategy was applied and produced no severity change

Review verdict: CONDITIONAL

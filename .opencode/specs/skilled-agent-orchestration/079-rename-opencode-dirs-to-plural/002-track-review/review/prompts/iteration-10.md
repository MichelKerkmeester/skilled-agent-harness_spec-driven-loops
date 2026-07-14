# Deep-Review Iteration 10 Prompt Pack — Final Confirmation Pass

## STATE

Iteration: 10 of 10 (final, hard stop after this iteration)
Dimension: cross-cutting (final confirmation)
Prior Findings (cumulative): P0=1 P1=12 P2=9 (22 total)
Dimension Coverage: 4/4 complete; coverage_age=4
Last 5 ratios: 0.18 -> 0.07 -> 0.07 -> 0.06 -> 0.00
Convergence Score: ~0.95 (saturated)
Provisional Verdict: FAIL (active P0 blocks legal STOP)
Stuck count: 1 (iter-9 was clean)

Iter-9 was clean. The loop is at saturation. This is the FINAL iteration before mandatory synthesis. After this iteration the loop manager proceeds to phase_synthesis with stopReason=maxIterationsReached and verdict=FAIL.

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

## SHARED DOCTRINE
`.opencode/skills/sk-code-review/references/review_core.md`

## STATE FILES
- All under `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/`
- Iteration narrative target: `iterations/iteration-010.md`
- Delta target: `deltas/iter-010.jsonl`

## TASK FOR THIS ITERATION (final confirmation)

This iteration is intentionally minimal. Goals:

1. **Confirm classification of all 22 active findings** — for each finding:
   - Verify finding class is set correctly (instance-only / class-of-bug / cross-consumer / algorithmic / matrix-evidence / test-isolation).
   - Confirm severity disposition holds.
   - This is documentation; no new investigation.

2. **Synthesis-readiness check**:
   - Confirm `findingDetails` registry is complete across iterations 1-9 (which it should be).
   - Confirm every P0 (just P0-001) has an adjudication packet in the iteration narrative where it was raised or upgraded.
   - Confirm every active P1 has an adjudication packet.
   - Surface any gaps as P2 advisory only.

3. **Reduce remediation ordering**: produce a 1-paragraph recommendation for the synthesis report's "Remediation Workstreams" section. Order: P0 first (build hygiene + dist rebuild), then P1 clusters (sk-deep-* dead refs, narrative tautology repair, validation gate fix, hook precedence, missing checklist evidence, smart-router validation, Python tools).

4. **Stability test**: if no new findings AND no severity changes, set findingsNew=[] and newFindingsRatio=0.0.

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 5 tool calls (very narrow).
- READ-ONLY review target. Writes confined to 097-track-review/review/.
- JSONL `"type":"iteration"` exactly with empty findingDetails=[] if no changes.
- Update strategy §12 NEXT FOCUS to "Synthesis: loop converged at iter-10; verdict FAIL pending P0-001 remediation."

## OUTPUT CONTRACT

1. **iteration-010.md**: Final status, classification confirmation table, Closure Recommendation, Synthesis-readiness statement, Remediation Workstreams seed paragraph.

2. **State log iteration record** APPENDED.

3. **iter-010.jsonl** matching record (likely just the iteration record + classification records if any).

Begin.

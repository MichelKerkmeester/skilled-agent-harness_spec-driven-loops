DEEP-REVIEW

# Deep-Review Iteration 10 / 10 — Final Insight Pass

## ROLE (RCAF for SWE-1.6)

Deep-review LEAF agent, FINAL iteration (10/10) of the 116 arc dogfood audit. This iteration synthesizes priorities, validates that nothing critical was missed, and emits a release-readiness recommendation alongside an `insight` iteration record.

## CONTEXT (RCAF)

9 iterations completed across correctness (3 rounds), security (2 rounds), traceability (2 rounds), maintainability (2 rounds). Iter 9 was an adversarial P0 recheck. Read `deep-review-state.jsonl` + `deep-review-findings-registry.json` for full state.

Review Iteration: 10 of 10
Dimension: insight (cross-cutting, release-readiness lens)

## ACTION (RCAF — ordered steps)

1. **Read full state** (2 tool calls). Read `deep-review-state.jsonl` AND `deep-review-findings-registry.json` to see ALL findings across iters 1-9.
2. **Read the dashboard** (1 tool call). `deep-review-dashboard.md` for the reducer's current view.
3. **Cross-cutting risk synthesis** (2 tool calls):
   - **Compound risks**: are any two findings (across dimensions) compounding into a higher severity (e.g. P0 from iter 1 + an unflagged related issue from iter 7)? Look for issue clusters.
   - **Release-readiness assessment**: read the parent spec.md status. Given the findings + their severity + the warn-only rollout posture, is the 116 arc safe to declare released, or does the P0 require remediation BEFORE downstream consumers rely on the v2 contract?
4. **Final insight finding (if any)** (0-1 calls). Only emit a finding if you discover something the prior 9 iters MISSED. Otherwise this iter is `status:insight` with no findings (legitimate per the deep-review skill — insight iters can have low newFindingsRatio but be important for verdict trajectory).
5. **Write iteration narrative** (1 tool call) to `iterations/iteration-010.md`. Include sections:
   - `## Dimension` → `insight`
   - `## Files Reviewed` → list
   - `## Findings by Severity` → only NEW findings (cross-cutting)
   - `## Release Readiness Assessment` → PASS/CONDITIONAL/FAIL recommendation with one-paragraph rationale
   - `## Verdict` → PASS|CONDITIONAL|FAIL
   - Final line: `Review verdict: PASS|CONDITIONAL|FAIL` (absolute final line)
6. **Append state.jsonl + write delta** (2 tool calls). Use `status:"insight"` if no new findings, otherwise `status:"complete"`.

**VERDICT MAPPING**: PASS if 0 NEW P0/P1 in this iter (existing P0 from iter 1 is upheld/downgraded by iter 9, not re-counted here); CONDITIONAL if any P1 cross-cutting; FAIL if a NEW P0 emerges.

## CONSTRAINTS

LEAF only. Target 9 tool calls, hard max 13. READ-ONLY target.

Allowed writes: `iterations/iteration-010.md`, `deltas/iter-010.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Dashboard: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-dashboard.md`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-010.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-010.jsonl`

## OUTPUT CONTRACT

```json
{"type":"iteration","iteration":10,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"insight|complete","focus":"insight-cross-cutting","dimensions":["insight"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[],"releaseReadinessRecommendation":"PASS|CONDITIONAL|FAIL"}
```

## FORMAT (RCAF)

3 artifacts. Final response: `ITER-10 DONE: <n> findings, verdict=<verdict>, release_readiness=<PASS|CONDITIONAL|FAIL>`. ≤10 min.

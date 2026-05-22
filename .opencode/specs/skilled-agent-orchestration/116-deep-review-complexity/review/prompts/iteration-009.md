DEEP-REVIEW

# Deep-Review Iteration 9 / 10 — Correctness (Round 3, P0 Hotspot Recheck)

## ROLE (RCAF for SWE-1.6)

Deep-review LEAF agent, iter 9/10. Round 3 of correctness. Focus on the EXISTING P0 finding's hotspot area — adversarial recheck.

## CONTEXT (RCAF)

Persistent P0 from iter 1: V2EnforcementMode type uses `'off'` while V2_ENFORCEMENT_MODES set includes `'skip'` — drift in `post-dispatch-validate.ts:153,156`. The function `getV2EnforcementMode()` checks `'strict' | 'off' | 'warn'` but the set says `'skip'` is valid.

Iter 1 confidence: 0.9 (P0). This iter performs the **adversarial recheck** required for P0 verdicts before final synthesis.

Review Iteration: 9 of 10
Dimension: correctness (adversarial P0 recheck)

## ACTION (RCAF — ordered steps)

1. **Read state** (1 tool call). Confirm exhausted approaches.
2. **Adversarial recheck of the P0** (3 tool calls):
   - **Re-read the exact lines** (1 call). `post-dispatch-validate.ts:140-220` (broad window around the cited lines). Confirm OR REFUTE that the set vs type drift exists exactly as claimed.
   - **Counterevidence search** (1 call). Grep for any aliasing, test coverage, or comment that explains why `skip` and `off` might intentionally coexist. (Is `skip` documented as legacy/deprecated? Is there a runtime mapping anywhere?)
   - **Downstream impact** (1 call). If an operator sets `DEEP_REVIEW_V2_ENFORCEMENT=skip`, what actually happens? Trace through the function logic. Is the silent-default-to-warn truly a behavioral bug, or is it the documented graceful fallback?
3. **Verdict on the P0 after adversarial recheck**: PASS (truly P0, ship as-is finding) OR DOWNGRADE (P1 or P2 with rationale) OR INVALIDATED (no finding, dedup it).
4. **Write iteration narrative** to `iterations/iteration-009.md`. Include the adversarial recheck result clearly. Final line: `Review verdict: PASS|CONDITIONAL|FAIL`.

   - PASS: if recheck PASSES P0 → leave P0 in place, this iter is PASS-with-recheck-result.
   - CONDITIONAL: if recheck DOWNGRADES to P1 → emit downgrade in narrative, this iter is CONDITIONAL.
   - FAIL: if a NEW P0 (different from existing) is found.
   - INVALIDATED: if recheck REFUTES the P0 → emit `finding_invalidation` event in delta, this iter is PASS.

5. **Append state.jsonl + write delta** (2 tool calls). If invalidating prior P0, include a `{"type":"finding_invalidation","id":"finding-001","reason":"..."}` record in the delta.

**VERDICT MAPPING (strict)**: PASS if 0 net P0 AND 0 net P1 in THIS iter; CONDITIONAL if any P1 (no P0); FAIL if any NEW P0.

## CONSTRAINTS

LEAF only. Target 9 tool calls, hard max 13. READ-ONLY target.

Allowed writes: `iterations/iteration-009.md`, `deltas/iter-009.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-009.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-009.jsonl`

## OUTPUT CONTRACT

```json
{"type":"iteration","iteration":9,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"correctness-p0-adversarial","dimensions":["correctness"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

v2 fields with `requiredBugClasses`: `p0_adversarial_recheck`, `counterevidence_search`, `downstream_impact_trace`.

## FORMAT (RCAF)

3 artifacts. Final response: `ITER-9 DONE: <n> findings, verdict=<verdict>, P0_status=<UPHELD|DOWNGRADED|INVALIDATED>`. ≤10 min.

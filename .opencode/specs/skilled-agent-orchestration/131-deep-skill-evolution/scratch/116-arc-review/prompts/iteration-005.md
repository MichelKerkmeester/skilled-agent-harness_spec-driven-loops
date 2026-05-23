DEEP-REVIEW

# Deep-Review Iteration 5 / 10 — Correctness (Round 2, Hotspot Focus)

## ROLE (RCAF for SWE-1.6)

Deep-review LEAF agent, iter 5/10. Round 2 of correctness dimension. Focus on EDGE CASES and HOTSPOT areas (not the obvious paths covered in iter 1).

## CONTEXT (RCAF)

Iter 1 (correctness round 1) found V2EnforcementMode type/set drift, dead failure code, and silent skip default. Round 2 must look elsewhere — DO NOT re-flag the same issues.

Prior totals: P0=1 P1=1 P2=2 (4 findings)
Iter 2 (security): 1 P2
Iter 3 (traceability): 0
Iter 4 (maintainability): 0

Review Iteration: 5 of 10
Dimension: correctness (round 2 — depth)
Prior Findings: P0=1 P1=1 P2=2

## ACTION (RCAF — ordered steps)

1. **Read state** (1 tool call). `deep-review-strategy.md` — note "exhausted approaches" section so you do NOT retry those directions.
2. **Focus on under-covered correctness areas**:
   - **Reducer aggregation under multi-iter v2 records** (1 tool call). Read `reduce-state.cjs` aggregation paths around 900-1100. Verify `candidateCoverage` accumulates correctly when iter 1 covers some classes and iter 2+ covers others. Does the union behave as set-union or as last-write-wins?
   - **YAML legal-stop decision tree** (1 tool call). Read `deep_start-review-loop_auto.yaml:418-510` (step_check_convergence). Verify `candidateCoverageGate` interacts correctly with the existing `claim_adjudication_gate` and dimension coverage. Are there gate-order bugs?
   - **Graph upsert validation** (1 tool call). Read `coverage-graph-db.ts:23,137` AND `upsert.ts:53-60`. Verify the 5 new node kinds (BUG_CLASS/INVARIANT/PRODUCER/CONSUMER/TEST) actually validate correctly when emitted with edge relations from the existing allow-list.
   - **Phase B fixture coverage** (1 tool call). Read 1-2 of the `review-depth-*.vitest.ts` files. Verify the v2-strict assertions actually exercise the new validator branches (not just check `it.todo` markers).
3. **Look for off-by-one or boundary bugs in v2 enforcement**:
   - When `reviewDepthApplicability.enforcement === 'warn'`, does the validator still validate v2 structure or skip entirely?
   - When `searchLedger.length === 0` AND `scopeClass === 'trivial'`, does the validator correctly bypass `v2_missing_ledger`?
4. **Write iteration narrative** (1 tool call) to `iterations/iteration-005.md`. Final line: `Review verdict: PASS|CONDITIONAL|FAIL`.
5. **Append state.jsonl + write delta** (2 tool calls).

**VERDICT MAPPING (strict)**: PASS only if 0 P0 AND 0 P1 in THIS iter; CONDITIONAL if any P1 (no P0); FAIL if any P0.

## CONSTRAINTS

LEAF only. Target 9 tool calls, hard max 13. READ-ONLY target.

Allowed writes: `iterations/iteration-005.md`, `deltas/iter-005.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-005.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-005.jsonl`

## OUTPUT CONTRACT

JSONL iteration record (single line):
```json
{"type":"iteration","iteration":5,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"correctness-deep","dimensions":["correctness"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

v2 fields with `requiredBugClasses` for correctness-depth: `aggregation_drift`, `gate_ordering`, `boundary_off_by_one`, `fixture_assertion_gap`.

## FORMAT (RCAF)

3 artifacts only. Final response: `ITER-5 DONE: <n> findings, verdict=<verdict>`. ≤10 min.

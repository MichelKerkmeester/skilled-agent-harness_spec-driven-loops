DEEP-REVIEW

# Deep-Review Iteration 7 / 10 — Traceability (Round 2, Cross-Surface)

## ROLE (RCAF for SWE-1.6)

Deep-review LEAF agent, iter 7/10. Round 2 of traceability. Focus on CROSS-SURFACE consistency — the same concept appearing across multiple files must agree.

## CONTEXT (RCAF)

Prior iters found 1 P0 + 1 P1 + 2 P2 + (iter 5/6 may have added findings — check state.jsonl).

Iter 3 (traceability round 1) was 0 findings — Round 2 must go DEEPER, not just re-check.

Review Iteration: 7 of 10
Dimension: traceability (cross-surface)

## ACTION (RCAF — ordered steps)

1. **Read state** (1 tool call). Strategy + state.jsonl. Note exhausted approaches.
2. **Cross-surface name consistency** (3 tool calls):
   - **Validator failure codes vs Phase B fixtures**: grep `v2_missing_ledger | v2_uncited_ledger_row | v2_broken_linked_finding | v2_shallow_finding_details | state_delta_iteration_mismatch` across `post-dispatch-validate.ts` and `tests/deep-loop/review-depth-*.vitest.ts`. Any code emitted but not asserted? Any asserted but not emitted?
   - **Reducer registry fields vs playbook scenarios**: grep `candidateCoverage | searchDebt | ruledOutCandidates | cleanSearchProof | searchCoverage` across `reduce-state.cjs` + `manual_testing_playbook/08--review-depth-v2-rollout/*.md`. Same names used both places?
   - **Phase ADR claims vs implementation**: read `004-validator-v2-enforcement/decision-record.md` (warn-then-strict-then-STOP rollout) AND `005-search-ledger-persistence-and-reporting/decision-record.md` (registry shape). Verify each claim in the ADRs is implemented in the source it cites.
3. **Spec-vs-research-synthesis traceability** (1 call). Read `001-research-synthesis/research/research.md` Recommendations §4. For R1 (versioned searchLedger), R2 (validator enforcement), R3 (reducer persistence): does each landed Phase B/C/D/E/F/G output cite the originating recommendation? Are there research recommendations that DIDN'T ship (besides explicit R8 P2 defaults deferral)?
4. **Write iteration narrative** (1 tool call) to `iterations/iteration-007.md`. Final line MUST be `Review verdict: PASS|CONDITIONAL|FAIL`.
5. **Append state.jsonl + write delta** (2 tool calls).

**VERDICT MAPPING (strict)**: PASS if 0 P0 AND 0 P1; CONDITIONAL if any P1 (no P0); FAIL if any P0.

## CONSTRAINTS

LEAF only. Target 9 tool calls, hard max 13. READ-ONLY target.

Allowed writes: `iterations/iteration-007.md`, `deltas/iter-007.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-007.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-007.jsonl`

## OUTPUT CONTRACT

```json
{"type":"iteration","iteration":7,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"traceability-cross-surface","dimensions":["traceability"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{"spec_code":"pass|partial|fail","checklist_evidence":"pass|partial|fail"},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

v2 fields with `requiredBugClasses`: `code_vs_test_drift`, `code_vs_playbook_drift`, `adr_vs_code_drift`, `research_vs_ship_drift`.

## FORMAT (RCAF)

3 artifacts. Final response: `ITER-7 DONE: <n> findings, verdict=<verdict>`. ≤10 min.

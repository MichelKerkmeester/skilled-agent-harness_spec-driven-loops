DEEP-REVIEW

# Deep-Review Iteration 3 / 10 — Traceability

## ROLE (RCAF for SWE-1.6)

You are a deep-review LEAF agent performing iteration 3 of 10 on the `116-deep-review-complexity` arc. Focus this iteration on **traceability** (spec-vs-code alignment, checklist evidence, claim-to-implementation chains).

## CONTEXT (RCAF)

Prior iterations:
- Iter 1 (correctness): 1 P0 (V2EnforcementMode type/set drift), 1 P1 (dead `state_delta_iteration_mismatch`), 1 P2 (silent skip default)
- Iter 2 (security): 1 P2

Running totals: P0=1 P1=1 P2=2 (4 open findings)

Review Iteration: 3 of 10
Dimension: traceability
Review Target: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity
Prior Findings: P0=1 P1=1 P2=2

## ACTION (RCAF — ordered steps with acceptance criteria)

1. **Read state** (2 tool calls). `deep-review-strategy.md` + `deep-review-state.jsonl` for prior findings + exhausted approaches.
2. **Spec-to-code traceability** (3 tool calls). For each of these claims from the 116 research/spec, verify against shipped code:
   - Research recommendation R1 (`searchLedger` versioned contract): read `state_format.md` for v2 schema + `post-dispatch-validate.ts` for enforcement — do field names match across the chain (`reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, `searchLedger`)?
   - ADR-001 of phase 004 (warn → strict → STOP rollout): does `post-dispatch-validate.ts` actually implement all three tiers? Or just warn?
   - ADR-001 of phase 005 (reducer registry shape): does `reduce-state.cjs` registry expose all 5 documented fields (`candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, `searchCoverage`)?
3. **Checklist evidence traceability** (1 tool call). Spot-check 1-2 phase children's checklist.md — do the `[x] CHK-NNN` items cite concrete file:line evidence, or are they checked without evidence?
4. **Playbook traceability** (1 tool call). Read `08--review-depth-v2-rollout/058-validator-warn-rollout.md` and verify cited artifact names (e.g. `DEEP_REVIEW_V2_ENFORCEMENT`, `legacy_unversioned_record`) exist verbatim in the implementation.
5. **Write iteration narrative** (1 tool call) to `iterations/iteration-003.md`. Sections: Dimension / Files Reviewed / Findings by Severity / Traceability Checks / Verdict / Next Dimension. **MUST end with final line `Review verdict: PASS|CONDITIONAL|FAIL` (no trailing whitespace)**.
6. **Append JSONL** to `deep-review-state.jsonl` via `echo '<single-line-json>' >>`.
7. **Write delta** to `deltas/iter-003.jsonl`.

**VERDICT MAPPING (strict)**: PASS only if 0 P0 AND 0 P1; CONDITIONAL if any P1 but no P0; FAIL if any P0.

## CONSTRAINTS

- LEAF only, target 9 tool calls, hard max 13
- READ-ONLY on review target
- Allowed writes: `iterations/iteration-003.md`, `deltas/iter-003.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`
- All paths repo-relative

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-003.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-003.jsonl`

## OUTPUT CONTRACT

3 artifacts: iteration markdown (ending with verdict line), state-log JSONL append (single line, type=iteration), delta file (iteration record + one finding line per finding).

JSONL iteration record:
```json
{"type":"iteration","iteration":3,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"traceability","dimensions":["traceability"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{"spec_code":"pass|partial|fail","checklist_evidence":"pass|partial|fail"},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

v2 fields encouraged: `reviewDepthSchemaVersion:2`, `reviewDepthApplicability:{scopeClass:"complex",enforcement:"warn",...}`, `targetSelection`, `searchCoverage:{requiredBugClasses:["spec_code_drift","checklist_evidence_gap","playbook_artifact_drift"],...,graphCoverageMode:"graphless_fallback"}`, `searchLedger[]`.

## FORMAT (RCAF)

Output: 3 artifacts only. Final response: `ITER-3 DONE: <n> findings, verdict=<verdict>`. Time budget ≤10 min.

# Iteration 1 - Correctness

## Dispatcher

- Mode: review
- Dimension: correctness
- Budget profile: scan
- Scope: shared deep-loop iteration validation and divergent-pivot transaction boundaries

## Dimension

Correctness: state/artifact consistency, gate behavior, and durable transition invariants.

## Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:499-1390`
- `.opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:125-434`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:987-1196`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:1501-1715`
- `.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-validator.vitest.ts:107-225`
- `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:121-165`
- `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:154-170`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:1285-1286`
- `.opencode/skills/system-deep-loop/deep-review/SKILL.md:338-354`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **R1-P1-001: Delta validation does not enforce canonical-record parity** -- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:1182` -- The validator compares only the numeric iteration identity between the state-log and delta records. It validates v2 depth fields only on the state-log record, while the delta merely needs any `type="iteration"` record and matching route proof. A delta can therefore carry stale or contradictory findings, coverage, ledger, or status and still pass, even though the delta is subsequently consumed as structured reducer input. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:1182-1193] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:1623-1639] [SOURCE: .opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:154-170]

   Finding class: cross-consumer

   Scope proof: Exact searches for delta mismatch validation found only iteration-id coverage in `review-depth-validator.vitest.ts:202-225`; `verify-iteration.cjs:159-163` also checks only that some iteration record exists. The reducer reads all delta payloads, so the inconsistency crosses validation into state reduction.

   Affected surface hints: post-dispatch validator, iteration reliability verifier, deep-review reducer, delta JSONL contract

   Recommendation: Compare the canonical state and delta iteration records over the contract-owned fields, or validate the delta record independently with the same required/v2 checks and reject contradictory canonical fields.

   Claim adjudication: `{"type":"claim_adjudication","claim":"A contradictory delta canonical record can pass the iteration gates and reach reducer input.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:1182-1193",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:1623-1639",".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:159-163",".opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:154-170"],"counterevidenceSought":"Searched runtime tests and validators for full state/delta equality, matching findings, ledger, status, or independent delta schema validation; only route proof and numeric iteration identity were found.","alternativeExplanation":"Per-event delta rows are intentionally independent, but the first canonical iteration record is contractually the same record and is consumed as structured state evidence.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if a mandatory downstream gate, not found in the reviewed workflow, proves canonical field parity before any reducer consumes the delta."}`

2. **R1-P1-002: Narrative verdict gate accepts a non-final or duplicated verdict** -- `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:136` -- The verifier uses an unanchored, case-insensitive regex over the entire narrative. It therefore accepts a verdict in the middle of the file, trailing prose after a verdict, or multiple contradictory verdict lines, despite the deep-review contract requiring exactly one canonical verdict as the absolute final line. The auto workflow invokes this verifier as its mechanical three-artifact gate. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:134-137] [SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:338-354] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1285-1286]

   Finding class: cross-consumer

   Scope proof: Exact search for `Review verdict` found the absolute-final-line rule in the owning skill and the sole runtime verifier check at `verify-iteration.cjs:136`; no test or post-dispatch validator enforces final-line placement or uniqueness.

   Affected surface hints: iteration reliability verifier, auto review workflow, synthesis verdict parser

   Recommendation: Parse the trimmed narrative's final line with an exact case-sensitive match and reject any additional verdict lines.

   Claim adjudication: `{"type":"claim_adjudication","claim":"The mechanical iteration gate accepts narratives that violate the mandatory verdict-line contract.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:134-137",".opencode/skills/system-deep-loop/deep-review/SKILL.md:338-354",".opencode/commands/deep/assets/deep_review_auto.yaml:1285-1286"],"counterevidenceSought":"Searched the review validators, workflow caller, and tests for a final-line or uniqueness check; none was found.","alternativeExplanation":"A downstream step may re-derive verdict severity, but that does not make the required iteration artifact parseable or satisfy the explicit three-artifact gate contract.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if the workflow is proven to reject non-final or duplicate verdict lines before this verifier can return success."}`

### P2 Findings

None.

## Traceability Checks

- `spec_code`: partial, checked the owning deep-review verdict and artifact contracts against runtime validators.
- `checklist_evidence`: pending, packet checklist was not part of this correctness slice.
- `skill_agent`: partial, loaded the canonical `.opencode/agents/deep-review.md` contract and confirmed the three-artifact workflow.
- Other overlay protocols: pending.

## Integration Evidence

- `.opencode/commands/deep/assets/deep_review_auto.yaml:1285-1286` invokes both the post-dispatch validator and `verify-iteration.cjs`.
- `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:154-170` reads per-iteration delta payloads.

## Edge Cases

- The divergent-pivot transaction passed this bounded source/test review: durable replay, three-seat quorum, agreement veto, and recursion handling are directly covered. This is not full correctness saturation of the 1,217-file target.
- Code graph coverage was not used; exact search plus direct reads supplied the evidence for this bounded slice.

## Confirmed-Clean Surfaces

- Divergent pivot preflight limits and fail-closed quorum paths are implemented and covered by integration tests.
- Pivot completion replay rejects simultaneous durable completed and failed outcomes.

## Ruled Out

- Divergent pivot 2/3-return acceptance: ruled out because quorum requires all three seats fulfilled and parse-valid at `divergent-pivot.ts:685-705`.
- Premature pivot completion on high-severity blocker: ruled out because agreement convergence requires zero high blockers at `divergent-pivot.ts:868-895`.

## Verdict

CONDITIONAL: two P1 correctness defects remain active.

## Next Dimension

- Dimension: security
- Focus area: filesystem trust boundaries, command interpolation, receipt validation, and artifact path containment
- Reason: shared runtime mutation and command surfaces have the highest next risk after correctness gates
- Rotation status: correctness completed for iteration 1; security pending
- Productive carry-forward: post-dispatch validation and divergent-pivot path handling
- Required evidence: direct source reads plus caller/test confirmation

Review verdict: CONDITIONAL

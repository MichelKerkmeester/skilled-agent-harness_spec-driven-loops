## Dimension
correctness

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` (lines 1-700)
- `.opencode/skills/deep-review/scripts/reduce-state.cjs` (lines 900-1100)
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md` (lines 1-80)
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json` (lines 1-89)

## Findings by Severity

### P0

**Finding 1: V2 enforcement mode type definition mismatch allows invalid env values to pass silently**

- **Claim**: The `V2EnforcementMode` type definition uses `'off'` while the `V2_ENFORCEMENT_MODES` set includes `'skip'`, and the `getV2EnforcementMode()` function only checks for `'off'`, not `'skip'`. This inconsistency allows the env var to be set to `'skip'` (which appears valid per the set) but then defaults to `'warn'` behavior without warning the operator.

- **EvidenceRefs**: 
  - `post-dispatch-validate.ts:153` - `V2_ENFORCEMENT_MODES` set includes `'skip'`
  - `post-dispatch-validate.ts:156` - `V2EnforcementMode` type uses `'off'` instead of `'skip'`
  - `post-dispatch-validate.ts:163-169` - `getV2EnforcementMode()` only checks for `'strict'`, `'off'`, `'warn'`

- **CounterevidenceSought**: Is there any documentation or tests that clarify whether `'skip'` or `'off'` is the canonical value? Are there other parts of the codebase that use `'skip'` as the enforcement mode?

- **AlternativeExplanation**: This could be intentional if `'skip'` is meant to be an alias for `'warn'` or if the type definition is meant to be the source of truth and the set is outdated. However, the presence of both values in close proximity suggests this is an oversight rather than intentional design.

- **FinalSeverity**: P0

- **Confidence**: 0.9

- **DowngradeTrigger**: If documentation or tests confirm that `'skip'` is intentionally aliased to `'warn'` or if the set is meant to be deprecated in favor of the type definition.

### P1

**Finding 2: Dead failure reason code 'state_delta_iteration_mismatch' declared but never used**

- **Claim**: The failure reason `'state_delta_iteration_mismatch'` is declared in the `PostDispatchFailureReason` type union but is never actually used in the validation logic. Only `'delta_iteration_id_mismatch'` is used. This creates confusion about the intended validation behavior and could mask future bugs if the wrong code is referenced.

- **EvidenceRefs**:
  - `post-dispatch-validate.ts:81` - `'state_delta_iteration_mismatch'` declared in type union
  - `post-dispatch-validate.ts:289` - Only `'delta_iteration_id_mismatch'` is used in validation
  - `post-dispatch-validate.ts:631` - Only `'delta_iteration_id_mismatch'` is checked for identity failure

- **CounterevidenceSought**: Is there a comment or documentation explaining the distinction between these two failure reasons? Is this dead code left for future use?

- **AlternativeExplanation**: This could be intentional dead code left for a future validation check that hasn't been implemented yet. However, without documentation, this creates ambiguity about the current validation contract.

- **FinalSeverity**: P1

- **Confidence**: 0.85

- **DowngradeTrigger**: If documentation confirms this is intentional placeholder code for future implementation.

### P2

**Finding 3: V2_ENFORCEMENT_MODES set includes 'skip' but validation logic treats it as invalid**

- **Claim**: The `V2_ENFORCEMENT_MODES` set on line 153 includes `'skip'` as a valid enforcement mode, but the `getV2EnforcementMode()` function on lines 163-169 does not check for `'skip'`. This means if an operator sets `DEEP_REVIEW_V2_ENFORCEMENT=skip`, it will be treated as invalid and default to `'warn'` without any warning message.

- **EvidenceRefs**:
  - `post-dispatch-validate.ts:153` - `V2_ENFORCEMENT_MODES` set includes `'skip'`
  - `post-dispatch-validate.ts:163-169` - `getV2EnforcementMode()` does not check for `'skip'`
  - `post-dispatch-validate.ts:199-201` - Validation checks against `V2_ENFORCEMENT_MODES` set, which includes `'skip'`

- **CounterevidenceSought**: Is there any test coverage that verifies the behavior when `'skip'` is set? Are there other parts of the system that use `'skip'` as a valid enforcement mode?

- **AlternativeExplanation**: The set might be intended for a different purpose (e.g., documentation or future expansion) and the function is the source of truth. However, the set is used in validation logic (line 199-201), suggesting it should align with the function.

- **FinalSeverity**: P2

- **Confidence**: 0.8

- **DowngradeTrigger**: If the set is documented as serving a different purpose than runtime validation.

## Traceability Checks

- **spec_code**: The v2 enforcement mode logic is documented in the state format reference (`deep-review/references/state_format.md`) and the prompt template, but the inconsistency between `'skip'` and `'off'` is not documented. The spec does not clarify which value is canonical.

- **checklist_evidence**: The Phase B test fixtures include v2 enforcement tests, but they do not appear to test the `'skip'` vs `'off'` inconsistency. The todo test for convergence fixtures (marked `it.todo(TODO(116/008))`) does not cover this edge case.

## Verdict
CONDITIONAL

## Next Dimension
security (iter 2)

Review verdict: CONDITIONAL
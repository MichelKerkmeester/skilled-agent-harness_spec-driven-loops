# Deep-Review iter-8 — 007 rename packet — SYNTHESIS-PREP CONVERGENCE EVALUATION

## Role
Senior deep-reviewer. Read-only. Convergence judge.

## Context
Iters 1-7 covered: correctness (0F), traceability (0F), security (0F+1 cannot-verify), maintainability (1 P2: M-001), adversarial-R1 (2 P2: H5-001, H5-002), H5 re-verification (TBD post-fix), adversarial-R2 (TBD). Total prior findings: 3 P2 (all advisory, no P0/P1).

## Scope: CONVERGENCE ASSESSMENT + SYNTHESIS PREP

### Pre-planning

1. **Read** all 7 prior iter files at `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/007-sk-prompt-models-rename/review/iterations/iteration-{001..007}.md`. Build the full findings registry (P0/P1/P2 by ID).

2. **Re-compute newFindingsRatio**: for iters 1-7, what proportion of total findings in iter-N were ALSO present in iter-(N-1)? Sliding window of 3.
   - Iter 5→6→7 ratio: if H5-001 + H5-002 are re-verified PASS in iter-6, then iter-7 should show zero new findings under that hypothesis.
   - Threshold: newFindingsRatio < 0.15 for 3 consecutive iters → CONVERGED.

3. **Verdict assignment**:
   - **PASS** (with hasAdvisories=true) if: zero P0, zero P1, P2 findings exist but are documented as accepted advisories.
   - **CONDITIONAL** if: P1 findings present without user-approved deferral.
   - **FAIL** if: any P0 unfixed.

4. **Synthesis preparation**: draft a one-paragraph executive summary for `review-report.md`. Include: total iters, dimensions covered, finding counts by severity, verdict, recommended next-action.

5. **Stop recommendation**:
   - `converged_pass` — if all prior dimensions clean + iter-6 H5 PASS + iter-7 zero new findings
   - `converged_pass_with_advisories` — same but with M-001 P2 still open
   - `continue_adversarial` — if iter-7 found new issues
   - `escalate` — if iter-6 H5 re-verification FAILED (meaning the fix didn't work)

### Action + Output
JSON `## FINDINGS` (likely 0 new; this is a synthesis iter) + `## NARRATIVE` with the verdict + executive summary + stop_recommendation.

End of prompt.

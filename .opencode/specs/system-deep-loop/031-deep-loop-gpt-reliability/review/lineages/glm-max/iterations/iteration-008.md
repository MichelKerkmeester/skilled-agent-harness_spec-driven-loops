# Iteration 8: Broaden — Mode-D fix substance & prompt.md residual (correctness)

## Focus
Broadened angle (correctness). Verify phase 008's Mode-D gate fix substance holds across the 8 `/deep:*` command files and the ai-council route-identity correction, and check whether the impl-summary's own flagged limitation (an out-of-scope residual) is a real live defect.

## Scorecard
- Dimensions covered: correctness (deepened)
- Files reviewed: 3 (008/implementation-summary.md, .opencode/commands/prompt.md, 008 route-identity cross-ref)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.09

## Findings

### P1, Required
(none)

### P2, Suggestion

- **F013**: `.opencode/commands/prompt.md` retains the old Mode-D self-classification gate that phase 008 removed from the 8 `/deep:*` commands, `.opencode/commands/prompt.md:27-37`
  - prompt.md still carries the exact pre-fix pattern: line 27 "EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION)", line 29 "SELF-CHECK: Are you operating as the @general agent?", line 37 `general_agent_verified = TRUE → Continue`, plus `general_agent_verified` blanks at lines 58, 157, 172. This is the abstract self-classification question (defaulting to a hard block on "NO or UNCERTAIN") that phase 008 replaced with an evidence-based DISPATCH-CONTEXT CHECK in all 8 deep command files.
  - Phase 008's implementation-summary explicitly flagged this as a discovered-but-unfixed instance (limitation 3, lines 122): "`.opencode/commands/prompt.md` has the identical pre-fix pattern... but is outside this phase's declared scope (research's 8-file citation didn't include it). Flagging it here as a discovered-but-unfixed instance for a future phase."
  - Severity P2: it is a DOCUMENTED residual, not an undisclosed defect; and `/prompt` is not a deep-loop command, so the original Mode-D misfire surface (phase 005's false-positive block) does not directly apply. But it is a genuine inconsistency — the pattern the packet set out to eliminate remains live in one command file, and no later phase (014/015 drift remediation included) closed it.
  - [SOURCE: .opencode/commands/prompt.md:27,29,37,58,157,172; 008/implementation-summary.md:122]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | 008/implementation-summary.md:50-58,108-109 | Mode-D fix (8 files) and ai-council route-identity correction verified sound; impl-summary's "zero remaining self-classification prose across 8 command files" PASS and "zero remaining mode: council" PASS are consistent with the documented scope. prompt.md is the one out-of-scope residual (F013). |

## Assessment
- New findings ratio: 0.09 (1 net-new P2; low novelty — the Mode-D fix is sound)
- Dimensions addressed: correctness
- Novelty justification: Phase 008's fix is correctly scoped and well-verified (76/76 vitest, validate.sh --strict PASS, grep confirms zero residuals in the 8 in-scope files). The packet's own honesty surfaced F013 before this review did — the defect is that no follow-up phase closed the documented residual, not that it was hidden.

## Ruled Out
- Mode-D fix incompleteness (in-scope files): ruled out — all 8 declared command files were migrated from the self-classification gate to the evidence-based check; phase 008 verification grep confirms zero residual in-scope. (iteration 8, evidence: 008/implementation-summary.md:108)
- ai-council route-identity still wrong: ruled out — corrected to `mode: ai-council`/`target_agent: ai-council` matching the registry (verified in iter 3 against mode-registry.json). (iteration 8, evidence: 008/implementation-summary.md:58; mode-registry.json)

## Dead Ends
- None this iteration.

## Recommended Next Focus
- Final P0 hunt: adversarial replay of the most consequential claims for any spec-contradiction or security gap not yet covered, then a coverage/protocol verification pass before synthesis.

Review verdict: PASS

# Deep-Review Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Iteration: 7 of 7
Dimension: final adversarial checklist / synthesis preflight
Prior Findings: P0=0 P1=3 P2=1
Dimension Coverage: correctness, security, traceability, maintainability, release-readiness replay, cross-runtime parity replay
Traceability: core=partial overlay=partial
Resource Map Coverage: present; stale continuity finding active.
Coverage Age: 3
Last 2 ratios: 0.0 -> 0.0
Stuck count: 2 but max iteration is reached after this pass
Provisional Verdict: CONDITIONAL hasAdvisories=true

Review Iteration: 7 of 7
Mode: review
Dimension: final adversarial checklist / synthesis preflight
Review Target: full review state and active findings F001-F004.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/SKILL.md` or its review-core references before final severity calls. Keep reviewed target files read-only.

## Review Focus

Perform the final adversarial pre-synthesis pass:
- Challenge whether each active P1 is really P1 or should be P0/P2/false-positive.
- Verify no active P0 exists.
- Verify no unreviewed critical public surface remains in the configured review scope.
- Prepare final synthesis inputs: verdict, active finding list, remediation order, residual risks, and verification evidence.
- Do not mutate target files; only review artifacts.

## Required Artifacts

- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-007.md`
- Append canonical JSONL iteration record to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- Write delta file to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deltas/iter-007.jsonl`
- Strategy may be updated if needed: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`

## Constraints

- LEAF only; do not dispatch sub-agents.
- Review target is READ-ONLY; write only review artifacts.
- Every validation claim needs file:line evidence.
- New P0/P1 findings require claim-adjudication details.
- Use parseable finding bullets for any new finding; if no new findings, state `- None.` under each severity subsection.

## Output Contract

Use sessionId `deep-review-066-20260503T211436Z`, generation `1`, lineageMode `new`. The JSONL record must include `type`, `iteration`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, and `durationMs`.

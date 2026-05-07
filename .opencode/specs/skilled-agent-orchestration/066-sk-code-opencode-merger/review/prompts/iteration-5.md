# Deep-Review Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Iteration: 5 of 7
Dimension: release-readiness replay / active finding validation
Prior Findings: P0=0 P1=3 P2=1
Dimension Coverage: correctness, security, traceability, maintainability (4/4)
Traceability: core=partial overlay=partial
Resource Map Coverage: present; stale continuity finding active.
Coverage Age: 1
Last 2 ratios: 1.0 -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true

Review Iteration: 5 of 7
Mode: review
Dimension: release-readiness replay / active finding validation
Review Target: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger` plus working tree changes for the `sk-code-opencode` merger and public agent/command cleanup.
Prior Findings: F001 P1 ADR stale, F002 P2 resource-map stale, F003 P1 spec/plan stale, F004 P1 standards_contract baseline inversion.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/SKILL.md` or its review-core references before final severity calls. Keep reviewed target files read-only.

## Review Focus

Perform release-readiness replay:
- Re-read the evidence for F001-F004 and confirm, downgrade, or mark false-positive if counterevidence exists.
- Check whether any target files were changed after the findings that would resolve them.
- Look specifically for additional active release-readiness blockers that were missed by dimension passes.
- Do not file duplicate findings; use traceability checks and findingDetails to report validation state.

## Required Artifacts

- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-005.md`
- Append canonical JSONL iteration record to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- Write delta file to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deltas/iter-005.jsonl`
- Strategy may be updated if needed: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`

## Constraints

- LEAF only; do not dispatch sub-agents.
- Review target is READ-ONLY; write only review artifacts.
- Every validation claim needs file:line evidence.
- New P0/P1 findings require claim-adjudication details.
- Use parseable finding bullets for any new finding; if no new findings, state `- None.` under each severity subsection.

## Output Contract

Use sessionId `deep-review-066-20260503T211436Z`, generation `1`, lineageMode `new`. The JSONL record must include `type`, `iteration`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, and `durationMs`.

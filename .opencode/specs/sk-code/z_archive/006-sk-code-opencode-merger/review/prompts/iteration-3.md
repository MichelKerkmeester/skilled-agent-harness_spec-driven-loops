# Deep-Review Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Iteration: 3 of 7
Dimension: traceability
Prior Findings: P0=0 P1=1 P2=1
Dimension Coverage: correctness, security (2/4)
Traceability: core=partial overlay=pending
Resource Map Coverage: resource-map.md is present; verify path ledger current-state metadata and touched/untouched entries.
Coverage Age: 0
Last 2 ratios: 1.0 -> 0.0
Stuck count: 1
Provisional Verdict: CONDITIONAL hasAdvisories=true

Review Iteration: 3 of 7
Mode: review
Dimension: traceability
Review Target: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger` plus working tree changes for the `sk-code-opencode` merger and public agent/command cleanup.
Prior Findings: P1=ADR stale current-state metadata, P2=resource-map stale continuity metadata.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/SKILL.md` or its review-core references before final severity calls. Keep reviewed target files read-only.

## Review Focus

Perform a traceability pass:
- Cross-check spec, plan, tasks, checklist, decision-record, implementation-summary, and resource-map against the implemented state.
- Verify moved/deleted paths in resource-map match actual current git status and new paths.
- Verify public agent and command mirrors are consistent across runtimes and satisfy the user publication constraint.
- Verify generated advisor artifacts and telemetry no longer present active `sk-code-opencode` routing labels except intentional historical/spec references.
- Identify only new traceability findings not already captured by iteration 1.

## Required Artifacts

- Write iteration narrative to: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/iterations/iteration-003.md`
- Append canonical JSONL iteration record to: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/deep-review-state.jsonl`
- Write delta file to: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/deltas/iter-003.jsonl`
- Strategy may be updated if needed: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/deep-review-strategy.md`

## Constraints

- LEAF only; do not dispatch sub-agents.
- Review target is READ-ONLY; write only review artifacts.
- Every finding needs file:line evidence.
- New P0/P1 findings require claim-adjudication details.
- Use parseable finding bullets: `- **F###**: Title -- path:line -- Description` under `## Findings - New` with `### P0 Findings`, `### P1 Findings`, and `### P2 Findings` subsections.

## Output Contract

Use sessionId `deep-review-066-20260503T211436Z`, generation `1`, lineageMode `new`. The JSONL record must include `type`, `iteration`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, and `durationMs`.

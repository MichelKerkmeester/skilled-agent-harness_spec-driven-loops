# Deep-Review Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Iteration: 4 of 7
Dimension: maintainability
Prior Findings: P0=0 P1=2 P2=1
Dimension Coverage: correctness, security, traceability (3/4)
Traceability: core=partial overlay=mostly pass
Resource Map Coverage: present with known stale continuity metadata.
Coverage Age: 0
Last 2 ratios: 0.0 -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true

Review Iteration: 4 of 7
Mode: review
Dimension: maintainability
Review Target: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger` plus working tree changes for the `sk-code-opencode` merger and public agent/command cleanup.
Prior Findings: P1 ADR stale, P1 spec/plan stale, P2 resource map continuity stale.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/SKILL.md` or its review-core references before final severity calls. Keep reviewed target files read-only.

## Review Focus

Perform a maintainability pass:
- Inspect the unified `sk-code` router/resource organization for confusing naming, stale references, or future maintenance hazards.
- Inspect public agent/command generic wording for consistency, readability, and avoiding repo-specific stack details.
- Inspect moved verifier/script references and generated artifacts for sustainable path patterns.
- Avoid duplicating already-known documentation-state traceability findings unless a distinct maintainability defect appears.

## Required Artifacts

- Write iteration narrative to: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/iterations/iteration-004.md`
- Append canonical JSONL iteration record to: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/deep-review-state.jsonl`
- Write delta file to: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/deltas/iter-004.jsonl`
- Strategy may be updated if needed: `.opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/review/deep-review-strategy.md`

## Constraints

- LEAF only; do not dispatch sub-agents.
- Review target is READ-ONLY; write only review artifacts.
- Every finding needs file:line evidence.
- New P0/P1 findings require claim-adjudication details.
- Use parseable finding bullets: `- **F###**: Title -- path:line -- Description` under `## Findings - New` with `### P0 Findings`, `### P1 Findings`, and `### P2 Findings` subsections.

## Output Contract

Use sessionId `deep-review-066-20260503T211436Z`, generation `1`, lineageMode `new`. The JSONL record must include `type`, `iteration`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, and `durationMs`.

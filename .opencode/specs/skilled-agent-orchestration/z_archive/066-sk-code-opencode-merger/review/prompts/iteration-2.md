# Deep-Review Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Iteration: 2 of 7
Dimension: security
Prior Findings: P0=0 P1=1 P2=1
Dimension Coverage: correctness (1/4)
Traceability: core=partial overlay=pending
Resource Map Coverage: cross-check target files against resource map when relevant.
Coverage Age: 0
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true

Review Iteration: 2 of 7
Mode: review
Dimension: security
Review Target: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger` plus working tree changes for the `sk-code-opencode` merger and public agent/command cleanup.
Review Scope Files: see config `reviewScopeFiles`; emphasize advisor/hook safeguards, verifier script movement, generated artifacts, command/workflow language, telemetry/search-decision artifacts, and public distribution surfaces.
Prior Findings: P0=0 P1=1 P2=1

## Shared Doctrine

Load `.opencode/skills/sk-code-review/SKILL.md` or its review-core references before final severity calls. Keep the reviewed target read-only.

## Review Focus

Perform a security/trust-boundary pass:
- Check that the merger did not introduce secret exposure, prompt-injection regressions, unsafe tool permissions, unsafe command examples, or path/sandbox bypass language.
- Verify public command/agent wording does not disclose internal project stack specifics in ways that violate the user's publication constraint.
- Review verifier script relocation and generated advisor artifacts for risky path assumptions or stale old-skill execution hooks.
- Revisit iteration 1 P1 only if security-relevant; otherwise carry it forward.

## Required Artifacts

- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-002.md`
- Append canonical JSONL iteration record to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- Write delta file to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deltas/iter-002.jsonl`
- Strategy may be updated if needed: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`

## Constraints

- LEAF only; do not dispatch sub-agents.
- Review target is READ-ONLY; write only review artifacts.
- Every finding needs file:line evidence.
- New P0/P1 findings require claim-adjudication details.
- Use parseable finding bullets: `- **F###**: Title -- path:line -- Description` under `## Findings - New` with `### P0 Findings`, `### P1 Findings`, and `### P2 Findings` subsections.

## Output Contract

Use sessionId `deep-review-066-20260503T211436Z`, generation `1`, lineageMode `new`. The JSONL record must include `type`, `iteration`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, and `durationMs`.

# Deep-Review Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Iteration: 6 of 7
Dimension: cross-runtime public-surface parity replay
Prior Findings: P0=0 P1=3 P2=1
Dimension Coverage: correctness, security, traceability, maintainability, release-readiness replay
Traceability: core=partial overlay=partial
Resource Map Coverage: present; stale continuity finding active.
Coverage Age: 2
Last 2 ratios: 1.0 -> 0.0
Stuck count: 1
Provisional Verdict: CONDITIONAL hasAdvisories=true

Review Iteration: 6 of 7
Mode: review
Dimension: cross-runtime public-surface parity replay
Review Target: public agent mirrors and command assets touched by the cleanup, plus relevant `sk-code` router docs.
Prior Findings: F001 P1, F002 P2, F003 P1, F004 P1 remain active.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/SKILL.md` or its review-core references before final severity calls. Keep reviewed target files read-only.

## Review Focus

Perform cross-runtime/public-surface parity replay:
- Compare `.opencode/agent`, `.claude/agents`, `.gemini/agents`, and `.codex/agents` for the generic `sk-code` router wording cleanup.
- Verify command examples/assets avoid public exposure of internal stack/surface details except generic command branding that is unrelated to `sk-code` internals.
- Check whether F004 baseline inversion is present in all intended command variants and whether any additional mirror variants were missed.
- Look for a new finding only if there is a distinct cross-runtime parity issue not already captured by F004.

## Required Artifacts

- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-006.md`
- Append canonical JSONL iteration record to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- Write delta file to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deltas/iter-006.jsonl`
- Strategy may be updated if needed: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`

## Constraints

- LEAF only; do not dispatch sub-agents.
- Review target is READ-ONLY; write only review artifacts.
- Every validation claim needs file:line evidence.
- New P0/P1 findings require claim-adjudication details.
- Use parseable finding bullets for any new finding; if no new findings, state `- None.` under each severity subsection.

## Output Contract

Use sessionId `deep-review-066-20260503T211436Z`, generation `1`, lineageMode `new`. The JSONL record must include `type`, `iteration`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, and `durationMs`.

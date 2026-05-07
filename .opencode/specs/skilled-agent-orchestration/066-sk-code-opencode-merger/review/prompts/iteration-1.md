# Deep-Review Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Iteration: 1 of 7
Dimension: inventory + correctness
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: cross-check target_files from `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md`; classify missed coverage as gaps.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 7
Mode: review
Dimension: inventory + correctness
Review Target: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger` plus working tree changes for the `sk-code-opencode` merger and public agent/command cleanup.
Review Scope Files: see config `reviewScopeFiles`; include spec docs, `sk-code`, moved/deleted old skill resources, advisor/generated artifacts, public agent mirrors, and `spec_kit` commands.
Prior Findings: P0=0 P1=0 P2=0

## Shared Doctrine

Load `.opencode/skills/sk-code-review/SKILL.md` or its review-core references before final severity calls. Keep the reviewed target read-only.

## Review Focus

Perform an inventory and correctness pass:
- Verify the accepted merger decisions are actually reflected in the current files.
- Verify public agent/command cleanup removed internal `sk-code` stack/surface details from public agent and command files.
- Verify route naming, deleted legacy content, moved verifier paths, and generated advisor/telemetry artifacts are coherent enough for later dimensions.
- Do not modify reviewed files except the required review artifacts listed below.

## Required Artifacts

All paths are relative to repo root.

- Config: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deltas/iter-001.jsonl`

## Constraints

- You are a LEAF review agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold findings only in context.
- Review target is READ-ONLY. Do not modify reviewed implementation/source/docs outside the review artifact paths.
- Every finding needs concrete file:line evidence.
- New P0/P1 findings require claim-adjudication details.

## Output Contract

Produce three artifacts:

1. Iteration narrative markdown at `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-001.md` with headings: Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append one single-line canonical JSONL record to `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl` using `"type":"iteration"` exactly. Required fields: `type`, `iteration`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`, optional `graphEvents`.
3. Write `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deltas/iter-001.jsonl` containing the same iteration record plus per-finding and graph-event records.

Use sessionId `deep-review-066-20260503T211436Z`, generation `1`, lineageMode `new`.

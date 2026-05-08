# Deep-Review Iteration 2 Prompt Pack — CORRECTNESS

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: correctness (focus: 098/001 dist-rebuild + sed-mangled vitest regex repair)
Prior Findings: P0=0 P1=1 P2=4 (1 P1, 4 P2 from iter 1: P1-007, P1-005 downgraded, P2-002, P2-004, P2-008)
Dimension Coverage: [inventory] (1/5 including inventory)
Traceability: core=spec_code-pass,checklist_evidence-fail overlay=skill_agent-pass,agent_cross_runtime-pass,feature_catalog_code-partial,playbook_capability-pass
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> 0.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true (P1-007 active)

Review Iteration: 2 of 10
Mode: review
Dimension: correctness
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096, 098-097-remediation — verdict-flip confirmation)
Review Scope Files (this iteration's focus):
  - .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild/
  - .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts
  - .opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js
  - .opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts (regex repair)
  - .opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js
  - .opencode/skills/system-spec-kit/scripts/dist/* (post-rebuild integrity)
  - .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/002-sk-deep-token-replace/
  - .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair/
  - .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/
  - .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/
  - .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift/
Prior Findings: P0=0 P1=1 P2=4

## CONTEXT — CORRECTNESS PASS

Iter 1 produced the closed-gate replay table. This iteration is the CORRECTNESS deep dive on the
remediation edits themselves. Specifically:

**FOCUS-A: 098/001-dist-rebuild correctness**
- Confirm `dist/` is genuinely rebuilt (not just touched)
- Verify the sed-mangled vitest regex was correctly repaired (098/001 spec.md mentions a regex-related repair)
- Spot-check that source/dist parity holds for the index-scope-policy
- Hunt for any sed-collateral mangling that escaped the rebuild (e.g., template strings, regex literals, JSON files with .opencode/skill/ inside string values)

**FOCUS-B: 098/002-007 correctness**
- Spot-check that the sed-style replacements did not create syntax errors, broken references, or
  left-over dual hits (singular still present somewhere). Read 002, 003, 005, 006, 007 implementation-summary.md
  and verify a small handful of claims at file:line.
- Look for new bugs introduced BY the remediation edits (e.g., a file that was correctly singular before,
  incorrectly pluralized by the bulk-sed).

**FOCUS-C: spot-check the 4 STILL_ACTIVE findings from iter 1**
- P2-002 (vitest.js:409 still singular) — confirm and check whether this is an intentional historical
  reference or a real bug
- P2-008 (tool-schemas.ts:578) — confirm whether singular references are intentional schema documentation
  or stale text
- P1-007 — already P1 active; do NOT re-classify, just confirm file:line evidence still holds

Run a small `git log --oneline 098-* | head` or `git log -- .opencode/skills/system-spec-kit/mcp_server/dist/`
sweep to confirm the rebuild actually happened.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Only write under `099-track-rereview/review/`.
- Workflow-resolved spec_folder is `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/` — that and `review/` underneath are the ONLY legal write targets. Do NOT touch any predecessor packet.

## OUTPUT CONTRACT

Three artifacts: iteration-002.md narrative + state-log JSONL append + iter-002.jsonl delta. The state-log record uses `"type":"iteration"` (NOT iteration_delta) and includes `dimensions:["correctness"]`, `findingsSummary`, `traceabilityChecks`, `newFindingsRatio`, `sessionId:"2026-05-07T17:08:57Z"`, `generation:1`, `lineageMode:"new"`, `timestamp`, `durationMs`. Per-finding records in delta use `{"type":"finding",...}` (one JSON per line). All three artifacts REQUIRED.

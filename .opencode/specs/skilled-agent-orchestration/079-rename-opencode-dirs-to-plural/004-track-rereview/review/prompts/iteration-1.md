# Deep-Review Iteration 1 Prompt Pack — INVENTORY (closed-gate replay)

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 10
Dimension: inventory (closed-gate replay table)
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: [] (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 10
Mode: review
Dimension: inventory
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096, 098-097-remediation — verdict-flip confirmation)
Review Scope Files:
  - .opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/
  - .opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/
  - .opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/
  - .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/
  - .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/ (phase parent + 7 sub-phases 001-007)
  - .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/review-report.md (predecessor verdict source)
Prior Findings: P0=0 P1=0 P2=0

## CONTEXT — VERDICT-FLIP HYPOTHESIS

097 closed with verdict FAIL on 2026-05-07: 1 active P0, 12 P1, 9 P2. Read the predecessor report
at `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/review-report.md` and
extract the 22 finding IDs. The 098-097-remediation packet then shipped 7 sub-phases:

- 098/001-dist-rebuild — npm run build + sed-mangled vitest regex repair (claims to resolve P0-001 live runtime stale dist code-graph globs)
- 098/002-sk-deep-token-replace — sk-deep-* dead refs across 89 actionable hits
- 098/003-narrative-validation-repair — narrative spec-doc casualties from bulk-sed
- 098/004-hooks-resolver-tighten — Stop hook env override gated to NODE_ENV=test
- 098/005-checklist-evidence — checklist evidence backfill
- 098/006-skill-advisor-python — skill_advisor.py path bindings + advisor state path plural
- 098/007-p2-doc-drift — P2 doc drift sweep

YOUR PRIMARY DELIVERABLE for iter-1: a CLOSED-GATE REPLAY TABLE mapping every 097 finding ID
(P0-001, P1-001..P1-012, P2-001..P2-009) to:
1. The 098 sub-phase that claimed to fix it (or "NOT_ATTEMPTED")
2. Replay verdict: RESOLVED / STILL_ACTIVE / DOWNGRADED / NEW_FINDING
3. File:line evidence backing the verdict (one or two grep/file-checks per row)

Do NOT line-by-line audit; this is the architectural inventory pass. Subsequent iterations will
deep-dive on rows you flag as STILL_ACTIVE, DOWNGRADED, or NEW.

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

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do NOT modify any reviewed file. Only write under `099-track-rereview/review/`.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- Workflow-resolved spec_folder is `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/` — that and `review/` underneath are the ONLY legal write targets. Do NOT touch any predecessor packet.

## OUTPUT CONTRACT

You MUST produce THREE artifacts. The post_dispatch_validate step rejects iteration if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-001.md`. Structure: Dimension, Files Reviewed, **Closed-Gate Replay Table** (22 rows from 097), Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl`. Use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"mode":"review","run":"run-001","status":"complete","focus":"inventory","dimensions":["inventory"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-05-07T17:08:57Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via single-line JSON with newline terminator. Do NOT pretty-print.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-001.jsonl`. One `{"type":"iteration",...}` record (mirror of the state-log append) plus per-event records (finding, classification, ruled_out, traceability-check) — one JSON line each.

All three artifacts are REQUIRED.

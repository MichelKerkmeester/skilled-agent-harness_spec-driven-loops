DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

Spec folder: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 20
Dimension: correctness, deeper on test coverage
Prior Findings: P0=0 P1=3 P2=2 (P1-001 top-level missing-dist import; P1-002 PPR trace loses provenance; P1-003 checklist/tasks.md completion conflict; P2-004 eval cleanup not failure-safe; P2-005 catalog/playbook coverage gap)
Dimension Coverage: correctness x2, security/reliability x1, maintainability+traceability-overlays x1
Traceability: core=CONDITIONAL overlay=CONDITIONAL (feature_catalog_code, playbook_capability)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 4
Last 2 ratios: 0.25 -> 0.2
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 5 of 20
Mode: review
Dimension: Per iteration 4's recommendation, deepen correctness on test coverage: examine the 4 recovered/modified vitest test files line-by-line for actual assertion strength (not just "test exists") around includeTrace behavior, flag-off byte-identical behavior, and seeded-PPR impact ordering. Specifically check whether any test actually exercises the P1-001 scenario (dist artifact absent) or P1-002 scenario (multi-hop trace provenance) -- if neither is tested, that strengthens those findings; if one is tested and passes anyway, investigate why the test didn't catch it (test may be testing the wrong thing). Also check for untested edge cases: empty candidate lists, single-file-only symbols, malformed edge metadata, duplicate PPR candidates, budget/deadline cutoff behavior.
Review Target: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit
Review Scope Files: same 16 files as prior iterations, with focus this time on the 4 vitest files and code-graph-context.ts's PPR functions
Prior Findings: P0=0 P1=3 P2=2

## OPERATOR DIRECTIVE (BINDING)

--stop-policy=max-iterations is set for this run. Convergence is telemetry only. Do NOT recommend stopping even if this dimension looks clean; broaden or deepen instead. The loop will run all 20 iterations regardless of your verdict.

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

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-config.json
- State Log: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/iterations/iteration-5.md
- Write per-iteration delta file to: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deltas/iter-005.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `review/iterations/iteration-5.md`, this iteration's narrative markdown
  - `review/deep-review-state.jsonl`, append-only JSONL state log
  - `review/deltas/iter-005.jsonl`, this iteration's delta JSONL
  - `review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead, under a `## SCOPE VIOLATIONS` heading, and continue the review. NEVER execute the out-of-scope mutation.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, findingDetails, traceabilityChecks, newFindingsRatio, and optional graphEvents.

## OUTPUT CONTRACT (IMPORTANT SCHEMA NOTE)

You MUST produce THREE artifacts per iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-5.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE of this file MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL` (no trailing whitespace, no variation).

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. **You MUST include BOTH a `findingsNew` array (rich claim-adjudication shape: id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND a separate `findingDetails` array (shape per finding: id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel for every new finding. If zero new findings, both may be `[]`.**

Required schema:
```json
{"type":"iteration","iteration":5,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-005","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-005.jsonl`. Holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (identical to the state-log append) plus per-event structured records. Each record on its own JSON line.

All three artifacts are REQUIRED and will be validated before the loop proceeds to iteration 6.

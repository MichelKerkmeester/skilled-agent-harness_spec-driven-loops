DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

Spec folder: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 20
Dimension: correctness (finer grain)
Prior Findings: P0=0 P1=1 P2=0
Dimension Coverage: correctness partial (1/4 dimensions touched)
Traceability: core=CONDITIONAL overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 1
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 20
Mode: review
Dimension: Continue correctness at finer grain before broadening. First verify whether the code-graph-context.ts module-load failure mode identified in P1-001 (top-level await import of a compiled Memory MCP dist artifact that may be absent, before the seeded-PPR flag is checked) has any additional related regressions: check deadline/budget handling, duplicate-candidate handling, and trace-output behavior in the recovered collectSeededPprImpactRanking / computeBoundedPersonalizedPageRank code paths. Then begin traceability: compare checklist.md's evidence claims against actually-runnable verification commands (tsc, vitest invocations) rather than trusting the checklist's own prose.
Review Target: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit
Review Scope Files: same 16 files as iteration 1 (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, structural-indexer.ts, cross-file-edge-resolver.ts, edge-confidence-flags.ts, code-graph-context.ts, the 4 vitest test files, the eval script, ENV_REFERENCE.md)
Prior Findings: P0=0 P1=1 P2=0 (P1-001, open, see review/deep-review-findings-registry.json for full detail; do not re-emit this exact finding as new, but you MAY note if you find it worse/different than recorded, or find related regressions it did not cover)

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

- Config: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-config.json
- State Log: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/iterations/iteration-2.md
- Write per-iteration delta file to: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `review/iterations/iteration-2.md`, this iteration's narrative markdown
  - `review/deep-review-state.jsonl`, append-only JSONL state log
  - `review/deltas/iter-002.jsonl`, this iteration's delta JSONL
  - `review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead, under a `## SCOPE VIOLATIONS` heading, and continue the review. NEVER execute the out-of-scope mutation.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, findingDetails, traceabilityChecks, newFindingsRatio, and optional graphEvents.

## OUTPUT CONTRACT (IMPORTANT SCHEMA NOTE)

You MUST produce THREE artifacts per iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-2.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE of this file MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL` (no trailing whitespace, no variation).

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. **The real validator requires BOTH a `findingsNew` array (rich claim-adjudication shape: id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND a separate `findingDetails` array (validator-required whenever findingsCount > 0; shape per finding: id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash). Include BOTH arrays, populated in parallel for every new finding, even though this doubles some content -- omitting `findingDetails` fails the real validator even though the human-facing template historically only mentioned `findingsNew`.** If this iteration has zero new findings, both arrays may be `[]`.

Required schema:
```json
{"type":"iteration","iteration":2,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-002","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-002.jsonl`. Holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (identical to the state-log append, including both findingsNew and findingDetails) plus per-event structured records. Each record on its own JSON line.

All three artifacts are REQUIRED and will be validated before the loop proceeds to iteration 3.

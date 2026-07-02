DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

Spec folder: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 20
Dimension: security/reliability (broadening per operator directive)
Prior Findings: P0=0 P1=3 P2=0 (P1-001 code-graph-context.ts top-level missing-dist import; P1-002 PPR trace loses multi-hop provenance chain; P1-003 checklist.md claims complete but tasks.md/plan.md leave items unchecked)
Dimension Coverage: correctness touched twice (iter 1-2), security/traceability/maintainability not yet started
Traceability: core=CONDITIONAL overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 2
Last 2 ratios: 1.0 -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 3 of 20
Mode: review
Dimension: Security/reliability. Per iteration 2's own recommendation: review the recovered eval script (score-seeded-ppr-retrieval.mjs) and any filesystem operations it performs (temp DB copies, path handling) for injection/traversal/unsafe-cleanup risk. Also review edge-confidence-flags.ts and the two structural-indexer.ts/cross-file-edge-resolver.ts write paths for any unsafe input handling (e.g. untrusted file paths, env var parsing without validation). Do NOT re-emit P1-001/P1-002/P1-003; you may note if you find them worse or find directly related new issues.
Review Target: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit
Review Scope Files: same 16 files as prior iterations (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, structural-indexer.ts, cross-file-edge-resolver.ts, edge-confidence-flags.ts, code-graph-context.ts, the 4 vitest test files, the eval script scripts/eval/score-seeded-ppr-retrieval.mjs, ENV_REFERENCE.md)
Prior Findings: P0=0 P1=3 P2=0

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

- Config: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/iterations/iteration-3.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `review/iterations/iteration-3.md`, this iteration's narrative markdown
  - `review/deep-review-state.jsonl`, append-only JSONL state log
  - `review/deltas/iter-003.jsonl`, this iteration's delta JSONL
  - `review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead, under a `## SCOPE VIOLATIONS` heading, and continue the review. NEVER execute the out-of-scope mutation.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, findingDetails, traceabilityChecks, newFindingsRatio, and optional graphEvents.

## OUTPUT CONTRACT (IMPORTANT SCHEMA NOTE)

You MUST produce THREE artifacts per iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-3.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE of this file MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL` (no trailing whitespace, no variation).

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. **You MUST include BOTH a `findingsNew` array (rich claim-adjudication shape: id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND a separate `findingDetails` array (shape per finding: id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel for every new finding. If zero new findings, both may be `[]`.**

Required schema:
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-003.jsonl`. Holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (identical to the state-log append) plus per-event structured records. Each record on its own JSON line.

All three artifacts are REQUIRED and will be validated before the loop proceeds to iteration 4.

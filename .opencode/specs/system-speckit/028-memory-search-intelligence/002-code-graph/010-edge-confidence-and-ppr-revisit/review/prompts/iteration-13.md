DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 13 of a batch covering 12-16). Your ALLOWED WRITE PATHS are ONLY `review/iterations/iteration-13.md` and `review/deltas/iter-013.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json`. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings through iteration 7, read-only context)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `code-graph-context.ts` top-level `await import()` of the compiled Memory MCP dist module runs unconditionally at MCP SERVER STARTUP, before the seeded-PPR flag is checked.
- P1-002: Seeded-PPR trace output loses the multi-hop provenance chain when `includeTrace` + seeded-PPR flag are both enabled.
- P1-003: `checklist.md` claims full completion but `tasks.md`/`plan.md` show sync/doc-update/validate.sh tasks and Completion Criteria still unchecked.
- P2-004: Eval harness cleanup not failure-safe.
- P2-005: Feature catalog/playbook omit the new gated capability.
- P2-006: Focused PPR tests miss both P1-001 and P1-002 scenarios.

Do NOT re-emit any of the above as new findings.

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION

Independent re-verification of this packet's own verification claims. `implementation-summary.md` and `checklist.md` claim specific results: `tsc --noEmit` clean (0 errors) for both the confidence-differentiation change and the PPR recovery+ADR-001 fix, the existing code-graph vitest suite passing with the new flag off with the SAME pre-existing baseline failure count as before (regression-proof), and the recovered PPR module's own unit tests passing (2 files, 9 tests). Actually RUN these commands yourself right now (you have Bash) and confirm the exact numbers match what the docs claim, rather than trusting the prose. Specifically run: `cd .opencode/skills/system-code-graph && npx tsc --noEmit` (or the project's real typecheck script if different -- check package.json first), and `npx vitest run mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` (adjust the path/command to match the real project structure -- check package.json scripts first). Report the ACTUAL exit codes and output, and flag a finding if the real numbers do not match what implementation-summary.md/checklist.md claim.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY for edits, but you MAY run read-only verification commands (typecheck, test runs) via Bash -- these do not modify source files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-13.md`, `review/deltas/iter-013.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes the shared state/strategy/registry files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-13.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-013.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record. Include BOTH `findingsNew` (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line.

Required schema for the first line:
```json
{"type":"iteration","iteration":13,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-013","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in under 150 words: the verdict, the actual command exit codes/results, the count and titles of any new findings, and confirmation both files were written.

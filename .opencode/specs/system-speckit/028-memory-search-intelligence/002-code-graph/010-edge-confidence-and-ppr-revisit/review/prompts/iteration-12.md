DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 12 of a batch covering 12-16). Your ALLOWED WRITE PATHS are ONLY `review/iterations/iteration-12.md` and `review/deltas/iter-012.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator merges these after the batch completes. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings through iteration 7, read-only context; iterations 8-11 ran in a prior parallel batch and are not yet merged into this summary -- do not assume their outcome, but do not duplicate the list below)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `code-graph-context.ts` top-level `await import()` of the compiled Memory MCP dist module runs unconditionally at MCP SERVER STARTUP, before the seeded-PPR flag is checked. Confirmed no outer launcher/build layer mitigates it.
- P1-002: Seeded-PPR trace output loses the multi-hop provenance chain when `includeTrace` + seeded-PPR flag are both enabled. Confirmed reachable via the live MCP tool schema.
- P1-003: `checklist.md` claims full completion but `tasks.md`/`plan.md` show sync/doc-update/validate.sh tasks and Completion Criteria still unchecked, despite that work being done.
- P2-004: Eval harness cleanup not failure-safe.
- P2-005: Feature catalog/playbook omit the new gated capability.
- P2-006: Focused PPR tests miss both P1-001 and P1-002 scenarios.

Do NOT re-emit any of the above as new findings.

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION

Security deep-dive on the new/modified code from this session. (1) `edge-confidence-flags.ts`: examine exactly how `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` is read from `process.env` -- is it a strict `=== 'true'` check (fail-safe-closed on typos/other truthy strings) or something looser? Any case-sensitivity issue? (2) In `structural-indexer.ts` and `cross-file-edge-resolver.ts`'s new confidence-write code, check whether any user-controlled or file-derived string data (symbol names, file paths) flows into a SQL statement without parameterization, or into any object key in a way that could enable prototype pollution (e.g. `obj[userControlledKey] = value` where key could be `__proto__` or `constructor`). (3) In the recovered `code-graph-context.ts` PPR code, check the same for any Map/object construction keyed by symbol IDs or file paths derived from the code graph. This is a genuinely adversarial security pass, not a rubber stamp -- try to find a real issue before concluding there is none, and if you find none, say precisely what you checked and ruled out.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-12.md`, `review/deltas/iter-012.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes the shared state/strategy/registry files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-12.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-012.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record. Include BOTH `findingsNew` (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line.

Required schema for the first line:
```json
{"type":"iteration","iteration":12,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-012","status":"complete","focus":"<dimension-or-focus>","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in under 150 words: the verdict, the count and titles of any new findings, and confirmation both files were written.

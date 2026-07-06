DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 17 of a batch covering 17-20). Your ALLOWED WRITE PATHS are ONLY `review/iterations/iteration-17.md` and `review/deltas/iter-017.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json`. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings through iteration 7, read-only context)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `code-graph-context.ts` top-level `await import()` of the compiled Memory MCP dist module runs unconditionally at MCP SERVER STARTUP, before the seeded-PPR flag is checked.
- P1-002: Seeded-PPR trace output loses the multi-hop provenance chain when `includeTrace` + seeded-PPR flag are both enabled.
- P1-003: `checklist.md` claims full completion but `tasks.md`/`plan.md` show sync/doc-update/validate.sh tasks and Completion Criteria still unchecked.
- P2-004: Eval harness cleanup not failure-safe.
- P2-005: Feature catalog/playbook omit the new gated capability.
- P2-006: Focused PPR tests miss both P1-001 and P1-002 scenarios.
(Iterations 8-16 ran in two earlier parallel batches; their findings are not summarized here since this prompt was authored before they completed. Read `review/deep-review-findings-registry.json` yourself at the start of your work to get the true current list before starting, and do not duplicate anything already active there.)

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION

Concurrency/idempotency correctness of the top-level `await import()` in `code-graph-context.ts` (the P1-001 mechanism). Node ES module imports are cached after first resolution, so a SECOND import of the same module path should reuse the cached module rather than re-running side effects. Verify: (a) is this module ever imported more than once in the same process in a way that could matter (e.g. via a dynamic re-import elsewhere, or via a test harness that resets the module registry between tests), (b) if the top-level import throws (missing dist file), does that exception propagate cleanly and crash/prevent the MCP server from starting in an obvious, loggable way, or could it be silently swallowed somewhere in the import chain (index.ts -> tools/index.ts -> code-graph-tools.ts -> handlers/index.ts -> handlers/context.ts) such that the server appears to start but the tool silently fails on every call instead, which would be a worse operator experience than a clean crash, (c) is there any global/module-level mutable state elsewhere in code-graph-context.ts that could behave differently under concurrent MCP tool calls now that PPR functions exist (e.g. shared arrays/maps reused across calls without per-call scoping).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-17.md`, `review/deltas/iter-017.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes the shared state/strategy/registry files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-17.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-017.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record. Include BOTH `findingsNew` (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line.

Required schema for the first line:
```json
{"type":"iteration","iteration":17,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-017","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in under 150 words: whether the crash mode is clean vs silent, the count and titles of any new findings, and confirmation both files were written.

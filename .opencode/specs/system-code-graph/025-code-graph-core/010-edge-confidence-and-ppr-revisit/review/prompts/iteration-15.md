DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 15 of a batch covering 12-16). Your ALLOWED WRITE PATHS are ONLY `review/iterations/iteration-15.md` and `review/deltas/iter-015.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json`. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

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

Independent git-history re-verification. This packet's docs cite specific commit hashes as historical fact: `657a0f6a3e` (introduced the original seeded-PPR module before its first cut) and `277c35344c` (deleted it, with the deletion commit message reportedly describing the cut as measured/negative). Run `git log --oneline -1 657a0f6a3e` and `git log --oneline -1 277c35344c` (and `git show 277c35344c --stat` and read its full commit message) yourself via Bash to confirm these commits actually exist in this repo's history and that the commit message content matches what the packet's docs claim it says. Also confirm `git show 277c35344c^:.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` (the parent commit, i.e. the pre-deletion version) actually contains a `computeBoundedPersonalizedPageRank` function, which is the claimed recovery source. This is a from-scratch independent check -- do not assume the prior session's own verification was correct, verify it yourself.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. `git log`/`git show` are read-only and permitted.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-15.md`, `review/deltas/iter-015.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, any git command that mutates history or the working tree (checkout, reset, stash, commit), and any write/rename/delete outside the two allowed paths above (this includes the shared state/strategy/registry files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-15.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-015.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record. Include BOTH `findingsNew` (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line.

Required schema for the first line:
```json
{"type":"iteration","iteration":15,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-015","status":"complete","focus":"<dimension-or-focus>","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in under 150 words: whether both commits and their claimed content check out, the count and titles of any new findings, and confirmation both files were written.

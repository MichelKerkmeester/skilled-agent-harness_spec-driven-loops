DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (FINAL ITERATION)

Spec folder: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## STATE

This is iteration 20 of 20, the FINAL iteration of this review. 19 prior iterations across correctness, security, traceability, and maintainability surfaced 9 confirmed P1 findings and 6 confirmed P2 findings (0 P0):

P1s:
- P1-001: `code-graph-context.ts` top-level `await import()` of the compiled Memory MCP dist module runs unconditionally at MCP SERVER STARTUP, before the seeded-PPR flag is checked. If the dist artifact is absent, the whole server fails to start.
- P1-002: Seeded-PPR trace output (`why_included.edgeChain`) loses the multi-hop provenance chain when `includeTrace` + seeded-PPR flag are both enabled.
- P1-003: `checklist.md` claims full completion but `tasks.md`/`plan.md` show sync/doc-update/validate.sh tasks and Completion Criteria still unchecked.
- P1 (cross-file, iter8): Name-only cross-file call resolution can be promoted to 0.9/EXTRACTED confidence without verifying the candidate is actually the import target's module (a same-named unrelated function elsewhere in the repo can silently get top-tier confidence).
- P1 (verification wording, iter10): Acceptance docs say the suite should be "green"/"passing" with the flag off, while completion evidence records a known failing baseline (6 failed/9 failed, later 5 failed/8 failed) -- the words don't match the numbers.
- P1 (suite baseline reproducibility, iter13): Running the documented flag-off verification command from the documented location today produces 9 failed files/23 failed tests across the whole suite, not the claimed 6/9 baseline -- the docs don't specify the exact scoped command that produced the original number.
- P1 (benchmark evidence durability, iter14): The claimed four-tier confidence distribution (892/2267/16198/2838 edges) is not recoverable from any persisted raw artifact; the current live DB shows a uniform 0.8 tier instead.
- P1 (AMBIGUOUS not flagged, iter18): The `why_included.ambiguous` trace field only checks `evidenceClass === 'INFERRED'`, so new `AMBIGUOUS` CALLS edges are silently NOT flagged as ambiguous in trace output.
- P1 (rollback not clean, iter19): Flag-off impact-ranking and blast-radius code paths still read and use differentiated confidence metadata left in the database from a prior flag-on scan; toggling the flag off does not restore flag-off-equivalent behavior once the DB has ever been touched with the flag on.

P2s: eval-harness cleanup not failure-safe, feature-catalog/playbook coverage gap, PPR test-isolation gap, doc path reference error, ADR-001 misattribution in 3 docs, stale seeded-PPR-removed language in benchmark-status.md/feature-flags.md.

## YOUR TASK FOR THIS FINAL ITERATION

Do NOT re-emit any finding above. Instead, do a genuine completeness pass with two parts:

**Part A -- gap check.** Given the 9 P1s above, is there an OBVIOUS, closely-related gap none of them cover? Specifically consider: (1) does the P1-019 rollback problem (stale confidence surviving a flag toggle) ALSO apply to the seeded-PPR flag itself, not just the edge-confidence flag -- i.e. if seeded-PPR ran once and got recorded anywhere (cache, trace log, telemetry), does turning the PPR flag off fully restore old behavior, or is there an analogous PPR-side staleness risk; (2) given P1-018 (AMBIGUOUS not flagged in trace), is there a SIMILAR blind spot in any OTHER consumer of evidenceClass (not just the trace writer) that was not checked in iteration 18's scoped grep; (3) given P1-001 (startup-blocking import), does the SAME top-level-import pattern exist ANYWHERE else in this session's changed files, not just this one call site.

**Part B -- final risk-ranking.** Of the 9 P1s, which ONE poses the most real-world risk if this packet were shipped/merged as-is today, and why? Which are genuinely blocking (must fix before any production flag flip) versus which are lower-urgency because both flags stay default-off? Give a one-paragraph honest assessment, not a restatement of the list.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-config.json
- State Log: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/iterations/iteration-20.md
- Write per-iteration delta file to: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deltas/iter-020.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 10 tool calls. Soft max 13, hard max 14 (this is the final synthesis iteration, slightly more budget is fine).
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `review/iterations/iteration-20.md`, this iteration's narrative markdown
  - `review/deep-review-state.jsonl`, append-only JSONL state log
  - `review/deltas/iter-020.jsonl`, this iteration's delta JSONL
  - `review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the allowed paths.

## OUTPUT CONTRACT

Produce THREE artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-20.md`. Structure: headings for Dimension, Files Reviewed, Part A (Gap Check), Part B (Final Risk Ranking), Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension (write "None -- this is the final iteration"). The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl`. `"type":"iteration"` EXACTLY. Include BOTH `findingsNew` (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash) for any new finding from Part A. If Part A finds nothing new, both may be `[]`. Part B's risk-ranking is narrative only, not a new finding record.

Required schema:
```json
{"type":"iteration","iteration":20,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-020","status":"complete","focus":"final gap-check and risk-ranking synthesis","dimensions":["correctness","security","traceability","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via single-line JSON with newline terminator. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-020.jsonl`. FIRST line is the same canonical record as above, followed by per-event structured records.

All three artifacts are REQUIRED. This is the last iteration -- the loop ends after this one regardless of verdict.

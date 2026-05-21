DEEP-REVIEW

# Deep-Review Iteration {N} — {DIMENSION_FOCUS}

## STATE

STATE SUMMARY (auto-generated):
Iteration: {N} of 20
Dimension: {DIMENSION_FOCUS}
Prior Findings: P0={p0} P1={p1} P2={p2}
Dimension Coverage: {covered} ({covered_n}/4)
Traceability: core={core_status} overlay={overlay_status}
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: {coverage_age}
Last 2 ratios: {ratio_prev} -> {ratio_latest}
Stuck count: {stuck_count}
Provisional Verdict: {prov_verdict} hasAdvisories={advisories}

Review Iteration: {N} of 20
Mode: review
Dimension: {DIMENSION_FOCUS}
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
Prior Findings: P0={p0} P1={p1} P2={p2}

## PRIOR CONTEXT

Read this first to pick up where iteration {N_prev} left off:

- Strategy: <review-packet>/deep-review-strategy.md (NEXT FOCUS, FILES UNDER REVIEW, CROSS-REFERENCE STATUS, RUNNING FINDINGS)
- Findings registry: <review-packet>/deep-review-findings-registry.json
- Recent iteration narratives: <review-packet>/iterations/iteration-{NN}.md (read the last 2-3)
- State log: <review-packet>/deep-review-state.jsonl (tail for prior iteration records)

## SCOPE REMINDER

Shipped in this session (commits c0941055f + 131838c96):
- mcp-coco-index HttpSidecarRerankerAdapter + dispatch + COCOINDEX_RERANK_VIA_SIDECAR env (default True after PROMOTE) + 9 unit tests + A/B benchmark
- system-rerank-sidecar feature catalog + manual testing playbook

Files under review: see config.reviewScopeFiles or strategy §15.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS + GATES

Dimensions: correctness, security, traceability, maintainability.
Quality gates: evidence (file:line), scope (within review_scope_files), coverage (all dimensions touched before STOP).
Verdicts: FAIL (any P0) | CONDITIONAL (any P1, no P0) | PASS (no P0/P1; hasAdvisories=true if active P2 exist).

## CLAIM ADJUDICATION (mandatory for new P0/P1)

Every NEW P0/P1 finding must include in the iteration narrative:
- claim: 1-sentence assertion
- evidenceRefs: list of "path:line" or shell command outputs
- counterevidenceSought: what would disprove the finding (alternative explanations)
- alternativeExplanation: what the finding could be instead, if anything
- finalSeverity: P0/P1/P2 after self-adjudication
- confidence: low | medium | high
- downgradeTrigger: what would justify a future downgrade

Findings missing any of the seven fields will cause the next iteration's claimAdjudicationGate to veto STOP.

## ASSIGNED FOCUS

{ASSIGNMENT_BODY}

## OUTPUT CONTRACT

Produce THREE artifacts:

1. Iteration narrative at `<review-packet>/iterations/iteration-{NNN}.md` with headings: Dimension Focus, Files Reviewed, Findings by Severity (P0/P1/P2 with claim-adjudication packets for new P0/P1), Traceability Checks, Verdict, Next Dimension. Final line MUST be exactly one of: `Review verdict: PASS` | `Review verdict: CONDITIONAL` | `Review verdict: FAIL` | `Review verdict: PENDING`.

2. Append to `<review-packet>/deep-review-state.jsonl` exactly one canonical record with `"type":"iteration"`:

```json
{"type":"iteration","iteration":{N},"mode":"review","run":"run-{NNN}","status":"complete","focus":"{DIMENSION_FOCUS}","dimensions":["{dim}"],"filesReviewed":["..."],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[...],"traceabilityChecks":{"summary":{"required":6,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[...]},"newFindingsRatio":<0..1>,"sessionId":"2026-05-20T20:30:00Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<ms>,"graphEvents":[...]}
```

3. Per-iteration delta file at `<review-packet>/deltas/iter-{NNN}.jsonl` with at least one `"type":"iteration"` record plus optional `"type":"finding"` / `"type":"classification"` / `"type":"ruled_out"` records (one per line).

After the iteration completes:
- Update `<review-packet>/deep-review-strategy.md`: §6 COMPLETED DIMENSIONS (mark this dimension if complete), §7 RUNNING FINDINGS (delta + totals), §8 WHAT WORKED, §11 RULED OUT, §12 NEXT FOCUS (next dimension), §14 CROSS-REFERENCE STATUS, §15 FILES UNDER REVIEW.
- Update `<review-packet>/deep-review-findings-registry.json`: refresh `dimensionCoverage` (set true for completed dim), `findingsBySeverity`, `openFindingsCount`, `convergenceScore` if available.

## CONSTRAINTS

- LEAF agent, no sub-agent dispatch. Target 12 tool calls, soft max 18, hard max 24.
- Write ALL findings to files. Read-only against reviewed source/tests/docs/specs.
- BANNED: rm, mv, sed -i, git, any modification to reviewed paths.
- ALLOWED write targets: only paths inside the review packet directory `<review-packet>/`.
- newFindingsRatio = sum(severity_weight × new_findings) / sum(severity_weight × all_findings_this_iter), severities weighted P0=10, P1=5, P2=1. If 0 findings → ratio = 0.0. If any new P0 → ratio = max(calc, 0.50).

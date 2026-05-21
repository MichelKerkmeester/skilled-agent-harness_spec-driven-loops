DEEP-REVIEW

# Deep-Review Iteration 2 — Correctness Pass

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 20
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0 (3 pending-verify anchors PV-001/PV-002/PV-003 from inventory iteration-001)
Dimension Coverage: [inventory] (0/4)
Traceability: core=mapped overlay=mapped (gates not yet executed)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> 0.0
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 2 of 20
Mode: review
Dimension: correctness
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
Prior Findings: P0=0 P1=0 P2=0

## PRIOR CONTEXT

Read these first:

- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-strategy.md — §12 NEXT FOCUS lists the iter-002 focus areas; §13 KNOWN CONTEXT lists PV-001/PV-002/PV-003 anchors; §14 CROSS-REFERENCE STATUS has line-level mappings.
- Iteration narrative: .opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/iterations/iteration-001.md — full inventory map, all 13 files with line-level entry points, traceability mappings.
- Findings registry: .opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deep-review-findings-registry.json
- State log: .opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deep-review-state.jsonl (iteration 1 record at line 2).

## SCOPE REMINDER

Two commits shipped:
1. `c0941055f` feat(016/008/006): cocoindex dedup via shared sidecar — PROMOTE
2. `131838c96` docs(system-rerank-sidecar): feature catalog + manual testing playbook

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
- counterevidenceSought: what would disprove the finding
- alternativeExplanation: what the finding could be instead
- finalSeverity: P0/P1/P2 after self-adjudication
- confidence: low | medium | high
- downgradeTrigger: what would justify a future downgrade

Findings missing any of the seven fields will cause the next iteration's claimAdjudicationGate to veto STOP.

## ASSIGNED FOCUS — CORRECTNESS PASS

Verify the three pending-verify anchors from iter-001 plus general correctness of the runtime path:

1. **PV-001 default dispatch** — investigate whether `COCOINDEX_RERANK_VIA_SIDECAR=true` is actually the default for users. Trace:
   - `cocoindex_code/config/config.py:770` env-var parsing
   - `cocoindex_code/rerankers/reranker.py:24-30` `_rerank_via_sidecar_enabled()` raw env read
   - `cocoindex_code/rerankers/reranker.py:379-408` dispatch
   - `test_http_sidecar_adapter.py:240-247` `test_dispatch_off_by_default`
   Question: does the runtime honor `Config.rerank_via_sidecar`, or does it read raw env that defaults to OFF if unset? Is there a divergence between Config default and dispatch read? If yes, severity classifies as P1 or P0 depending on whether the implementation-summary PROMOTE claim is materially false.

2. **PV-002 launcher ensure** — verify the cocoindex MCP startup auto-ensure path:
   - `cli.py:139-158` `_ensure_rerank_sidecar_for_mcp`
   - `ensure_rerank_sidecar.py:80-128` and around `:90-96` (the SPECKIT_CROSS_ENCODER gate)
   - Compare to feature_catalog.md:198-201 + manual_testing_playbook.md:159-160 claims that cocoindex auto-spawns the sidecar at MCP startup
   Question: does the ensure helper skip spawn when SPECKIT_CROSS_ENCODER is unset (i.e. spec-memory off but cocoindex still needs it)? If yes, that's a P0 regression candidate — the PROMOTE claim fails when cocoindex MCP launches without spec-memory's flag.

3. **REQ-002 fallback chain** — verify HTTP failure paths actually fall back to bundled `CrossEncoderRerankerAdapter`:
   - `reranker.py:259-319` HTTP error handling
   - 5xx, 4xx, connection refused, malformed JSON, missing-index payload paths
   - `test_http_sidecar_adapter.py:118-168` mock test cases
   Question: do all 5 listed failure modes actually trigger the fallback? Does the fallback record the right `reranker_fallback_reason` field?

4. **REQ-003 sigmoid passthrough** — verify scores from sidecar reach `QueryResult.reranker_score` unchanged:
   - `reranker.py:321-351` score handling
   - `test_http_sidecar_adapter.py:86-115` happy path
   Question: any silent normalization, type coercion, or precision loss?

5. **Test correctness** — review the 9 new tests:
   - `test_http_sidecar_adapter.py` lines 86-247
   Question: are the assertions actually meaningful? Are mocks realistic? Any test that would pass for the wrong reason? Any obvious case missed (e.g. timeout, partial response, retry-after)?

6. **REQ-006 PROMOTE wording vs decision D-004** — `spec.md:138-139` says "remove the bundled `CrossEncoder` load" on PROMOTE; `implementation-summary.md:87-89` (D-004) says keep the class as fallback. Is the shipped state consistent with one or both claims? Report whichever interpretation matches the code.

7. **Score precision in run_ab.py** — review `run_ab.py:69-180` for any subtle bug that could distort the A/B verdict (e.g. arm env override that doesn't actually flip dispatch, fixture mutation between arms, p95 calc using wrong sample, etc.). The decision rule rests on this benchmark.

Open the actual files via Read tool. Quote file:line evidence for every finding. New P0/P1 must include the full 7-field claim adjudication packet inline.

## OUTPUT CONTRACT

Produce THREE artifacts:

1. Iteration narrative at `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/iterations/iteration-002.md` with headings: Dimension Focus, Files Reviewed, Findings by Severity (P0/P1/P2 with claim-adjudication packets), Traceability Checks, Verdict, Next Dimension. Final line MUST be exactly one of: `Review verdict: PASS` | `Review verdict: CONDITIONAL` | `Review verdict: FAIL` | `Review verdict: PENDING`.

2. Append to `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deep-review-state.jsonl` exactly one canonical record with `"type":"iteration"`:

```json
{"type":"iteration","iteration":2,"mode":"review","run":"run-002","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["..."],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[{...}],"findingDetails":[...],"traceabilityChecks":{"summary":{"required":6,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[...]},"newFindingsRatio":<0..1>,"sessionId":"2026-05-20T20:30:00Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<ms>,"graphEvents":[...]}
```

3. Per-iteration delta file at `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deltas/iter-002.jsonl` with at least one `"type":"iteration"` record plus one `"type":"finding"` per new finding (one per line).

After the iteration completes:
- Update `<review-packet>/deep-review-strategy.md`: §6 COMPLETED DIMENSIONS (mark correctness if confident; otherwise leave open), §7 RUNNING FINDINGS, §8 WHAT WORKED, §11 RULED OUT, §12 NEXT FOCUS (security next), §14 CROSS-REFERENCE STATUS, §15 FILES UNDER REVIEW.
- Update `<review-packet>/deep-review-findings-registry.json`: refresh `dimensionCoverage` (correctness:true if complete), `findingsBySeverity`, `openFindingsCount`, `convergenceScore`.

## CONSTRAINTS

- LEAF agent, no sub-agent dispatch. Target 12 tool calls, soft max 18, hard max 24.
- Write ALL findings to files. Read-only against reviewed source/tests/docs/specs.
- BANNED: rm, mv, sed -i, git, any modification to reviewed paths.
- ALLOWED write targets: only paths inside the review packet directory `<review-packet>/`.
- newFindingsRatio: severity-weighted P0=10, P1=5, P2=1. If any new P0 → ratio = max(calc, 0.50). If 0 findings → 0.0.

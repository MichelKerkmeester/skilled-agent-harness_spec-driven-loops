---
title: "Research Synthesis: Deep Review Complexity"
description: "Synthesis of 15 deep-research iterations investigating why focused deep-research bug-finding can surface more bugs than deep-review and stress-testing implementation recommendations."
trigger_phrases:
  - "deep-review complexity research"
  - "deep-review search ledger"
  - "candidate generation review"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/001-complexity-research-synthesis"
    last_updated_at: "2026-05-22T08:35:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Synthesized 15 deep-research iterations"
    next_safe_action: "Plan follow-up searchLedger implementation packet"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/iterations/"
      - "research/deltas/"
    session_dedup:
      fingerprint: "sha256:7777777777777777777777777777777777777777777777777777777777777777"
      session_id: "116-deep-review-complexity-auto-research"
      parent_session_id: null
---
# Research Synthesis: Deep Review Complexity

<!-- ANCHOR:summary -->
## 1. Summary

The 15-iteration research loop supports a stable diagnosis: `deep-review` is not shallow because it lacks review rigor. It is shallow at times because its strongest rigor starts after a candidate finding exists. Focused `deep-research` finds more bugs because it preserves hypothesis search, unanswered questions, observations, edges, and ruled-out directions as first-class state.

The highest-leverage fix is still a versioned `searchLedger`, but the continuation refined it: the ledger must be paired with `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, validator warning support, reducer/dashboard/report persistence, explicit graphless fallback, and seeded tests before each implementation slice. A ledger field alone would become checkbox theater.

Primary evidence sources are `research/iterations/iteration-001.md` through `research/iterations/iteration-015.md`, `research/deltas/iter-001.jsonl` through `research/deltas/iter-015.jsonl`, and `research/deep-research-dashboard.md`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:iteration-coverage -->
## 2. Iteration Coverage

| Iteration | Focus | New Info Ratio | Key Contribution |
|-----------|-------|----------------|------------------|
| 001 | Surface inventory | 1.00 | Identified dimension rotation, earlier defaults, ceremony-heavy prompt structure, and validation-after-discovery. |
| 002 | Reducer and convergence | 0.74 | Showed machine checks enforce shape, severity, and stop gates more than semantic search depth. |
| 003 | Real artifact survey | 0.68 | Parsed 476 review JSONL files and found uneven rich-field emission. |
| 004 | Prompt and agent pressure | 0.72 | Confirmed candidate-generation matrices are not required before severity validation. |
| 005 | Transferable research mechanics | 0.66 | Proposed candidate-led review state, ruled-out records, and clean-path evidence enumeration. |
| 006 | Scope and targeting | 0.61 | Found broad scope discovery lacks ranked target-selection proof. |
| 007 | Output and synthesis | 0.57 | Found reports/dashboards can mask shallow null-search evidence. |
| 008 | Design options | 0.49 | Ranked `searchLedger` plus validator enforcement as highest leverage. |
| 009 | Verification strategy | 0.43 | Defined schema, reducer, graph, prompt-pack, and seeded behavior tests. |
| 010 | Convergence | 0.31 | Confirmed recommendation order and residual calibration risks. |
| 011 | Ledger/schema stress test | 0.37 | Tightened `searchLedger`, `targetSelection`, `reviewDepthApplicability`, and trivial/legacy exemptions. |
| 012 | Validator stress test | 0.34 | Split validation into hard errors, rollout warnings, and pass cases; found warnings need first-class return/advisory support. |
| 013 | Persistence stress test | 0.28 | Found reducer/dashboard/report persistence is required or ledger rows disappear from operator view. |
| 014 | Graph/convergence stress test | 0.25 | Found graph vocabulary must follow ledger semantics and graphless fallback must be explicit. |
| 015 | Final continuation convergence | 0.22 | Refined staged rollout, seeded-test gating, `searchCoverage` obligations, and acceptance criteria. |
<!-- /ANCHOR:iteration-coverage -->

<!-- ANCHOR:core-findings -->
## 3. Core Findings

### Finding 1: Deep-review validates findings better than it generates candidates

Deep-review has meaningful severity, evidence, claim-adjudication, blocked-stop, and graph-convergence machinery. The gap is earlier: the loop does not force bug-class hypotheses, invariant sweeps, producer/consumer tracing, negative-test searches, or adversarial matrix construction before a dimension counts as covered. Evidence: iteration 002 found post-dispatch validation checks presence and shallow top-level types but not semantic `findingDetails` depth; iteration 004 found P0/P1 counterevidence starts after a candidate exists.

### Finding 2: Dimension coverage can substitute for bug pursuit

Deep-review rotates through broad dimensions such as correctness, security, traceability, and maintainability. That helps release-readiness coverage, but it is not equivalent to a ranked bug search. Iteration 006 found broad scope enumeration is not converted into a ranked target-selection ledger before the 3-5 action budget begins.

### Finding 3: Real artifacts prove the rich fields are optional in practice

Iteration 003 surveyed 476 review JSONL files and 885 completed or legacy iteration records. Only 220 records had a `findingDetails` field, 186 had non-empty `findingDetails`, 40 had non-empty `graphEvents`, 142 of 537 finding details had `scopeProof`, 138 had `affectedSurfaceHints`, 20 had counterevidence-style fields, zero matched explicit bug-class fields, and only two mentioned invariants.

### Finding 4: `findingsNew` has schema drift

The state-format reference expects severity-count shape, while the prompt example and real artifacts tolerate arrays, numbers, and objects. This weakens convergence and reducer confidence because malformed-but-present state can pass current validation.

### Finding 5: Graph convergence is useful but not universal proof

Graph convergence can block empty or underconnected review graphs when graph data exists, but `graphEvents` are optional and the current review graph vocabulary is coarse: dimensions, findings, files, evidence, resolves, and hotspots. It does not model `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, or `TEST` nodes.

### Finding 6: Reports and dashboards can hide search debt

Deep-review surfaces active severity risk well, but null-search evidence and rejected hypotheses are late, optional, and mostly prose. A PASS or CONDITIONAL verdict can be correct for known active findings while still failing to prove likely bug classes were searched.

### Finding 7: The ledger itself can become checkbox theater

Iteration 011 found that a `searchLedger` array is not enough. It must prove a relationship: target selected, bug class or invariant hypothesized, search action performed, evidence cited, disposition assigned, and finding or ruled-out/deferred/blocked reason linked. Otherwise an agent can emit one plausible row and still leave the highest-risk class unsearched.

### Finding 8: Validator rollout needs warning support

Iteration 012 found the current post-dispatch validator is binary: pass or fail. That is too blunt for migration. The follow-up needs warnings or typed advisory events so legacy unversioned records remain readable while new v2 standard/complex records fail hard on shallow search proof.

### Finding 9: Reducer survivability is a separate requirement

Iteration 013 found that even valid ledger rows would currently be dropped or hidden because deep-review reducer and dashboard state are finding-centric and severity-centric. New fields must survive into registry state, dashboard risk posture, and final report sections.

### Finding 10: Graph expansion must be ledger-led

Iteration 014 found that proposed graph nodes such as `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` would be discarded or rejected by the current graph schema/workflow allow-list. Graph vocabulary should project ledger semantics after the ledger is stable, not replace the ledger.

### Finding 11: Graphless fallback is not currently explicit enough

The current live behavior can yield generic graph `CONTINUE` without accepted fallback proof or actionable blockers. A standard/complex graphless review needs `graphCoverageMode:"graphless_fallback"` plus cited direct reads, exact searches, semantic/code-graph status, producer/consumer traces, and negative-test checks.

### Finding 12: Seeded tests must gate every implementation slice

Iteration 015 found that seeded tests should not be a late final step. Each implementation slice needs a fixture that fails against today's shallow workflow and passes only after that slice is wired through its owner: validator, reducer/dashboard/report, convergence, or graph vocabulary.
<!-- /ANCHOR:core-findings -->

<!-- ANCHOR:recommendations -->
## 4. Recommendations

### R1: Add a versioned `searchLedger` to deep-review

Priority: P0.

Add `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger` to the review iteration schema. `searchLedger` should be the canonical name; use `candidateMatrix` only as a temporary alias if needed.

Minimal top-level fields:
- `reviewDepthSchemaVersion: 2`
- `reviewDepthApplicability: { scopeClass, enforcement, reason, evidenceRefs }`
- `targetSelection: { selectedTargets, selectionReason, discoveryMethods, omittedHighRiskTargets, graphStatus, semanticSearchStatus, evidenceRefs }`
- `searchCoverage: { requiredBugClasses, covered, ruledOut, deferred, blocked, graphCoverageMode }`
- `searchLedger[]`

Minimal row fields:
- `id`
- `dimension`
- `targetRefs`
- `bugClass`
- `hypothesis` or `invariant`
- `searchActions[]` with method, query/path, result, and evidence refs
- `disposition`: `finding`, `ruled_out`, `deferred`, `blocked`, or `not_applicable`
- `rationale`
- disposition-specific linkage: `linkedFindingId`, `ruledOutReason`, `deferredReason`, `blockedReason`, or `notApplicableReason`

### R2: Enforce the ledger in post-dispatch validation

Priority: P0.

Update `post-dispatch-validate.ts` so non-trivial versioned review iterations fail when `findingsNew` has the wrong shape, `findingDetails` lacks rich fields for active findings, or `searchLedger` rows are missing, uncited, unlinked, mismatched with `searchCoverage`, or have unsupported dispositions. Add a warning/advisory surface first so legacy packets can remain readable while explicit v2 records become strict.

### R3: Persist null-search evidence through reducer, dashboard, and report

Priority: P0.

Reducer output should track `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`. The dashboard and final review report should show search debt next to active severity debt. The review report should include a first-class Search Ledger section before the appendix.

### R4: Add target-selection proof before dimension review

Priority: P1.

For broad or non-trivial scopes, each iteration should record `targetSelection`: selected files, selection reason, discovery methods, omitted high-risk files, graph status, semantic search status, producer/consumer paths, invariant targets, and negative-test targets. If code graph or CocoIndex is unavailable, require an explicit fallback ledger based on direct reads and exact searches.

### R5: Expand review graph vocabulary after ledger semantics stabilize

Priority: P1.

Add graph node kinds or equivalent structured graph events for `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`. Do this after the text/JSON ledger is stable so graphless runs still have an auditable fallback.

### R6: Add candidate-saturation convergence gates

Priority: P1.

STOP should require candidate/search coverage for non-trivial targets. No-finding iterations should only count positively when they include clean-search rows with cited evidence. Blocked-stop events should name missing candidate classes, not only missing dimensions or unresolved findings.

### R7: Add graphless fallback mode

Priority: P1.

Add `searchCoverage.graphCoverageMode` with values such as `graph`, `graphless_fallback`, and `unavailable_blocked`. A graphless standard/complex review should stop only when direct text/JSON ledger evidence satisfies the same candidate obligations. Missing fallback proof should produce a named `candidateCoverageGate` or `graphlessFallbackGate` blocker.

### R8: Treat higher iteration defaults as a supporting change only

Priority: P2.

Deep-review defaults are smaller and looser than deep-research, but raising iteration count alone will not fix shallow search. Increase defaults only after candidate ledger and search-coverage gates define what deeper review means.
<!-- /ANCHOR:recommendations -->

<!-- ANCHOR:verification-plan -->
## 5. Verification Plan

Recommended test surfaces:

- `post-dispatch-validate.ts`: reject missing ledger rows, bad `findingsNew` shape, uncited candidate rows, invalid dispositions, broken finding links, state/delta mismatch, and shallow `findingDetails`.
- Prompt-pack tests: assert rendered deep-review prompts contain `searchLedger`, `targetSelection`, `bugClass`, `invariant`, `producer`, `consumer`, `negativeTestSearched`, `evidenceRefs`, and `linkedFindingId`.
- Deep-review reducer fixtures: add a `candidate-ledger-session` fixture and assert candidate coverage, search debt, ruled-out candidates, clean-search proof, and dashboard Search Ledger output.
- Coverage graph tests: add candidate node vocabulary, graphless fallback, and STOP_BLOCKED cases for missing candidate-class or invariant/test coverage.
- Manual playbooks: add seeded bug targets that pass only when candidates are emitted, linked or ruled out, and search coverage prevents a shallow PASS.

Success metrics:
- Invalid shallow review records fail validation.
- Valid rich records pass.
- Existing blocked-stop and graph blocker tests remain green.
- Clean dimensions include cited null-search evidence.
- Reports expose `searchCoverage` with verdicts.
- Graphless runs still produce a text/JSON fallback ledger with `graphCoverageMode:"graphless_fallback"`.
- Seeded bug-class scenarios are caught before PASS.
<!-- /ANCHOR:verification-plan -->

<!-- ANCHOR:implementation-order -->
## 6. Recommended Implementation Order

1. Add failing seeded fixtures for the first validator slice.
2. Add schema/docs/prompt support for `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger`.
3. Add validator warning/advisory support, then enforce `findingsNew`, rich `findingDetails`, state/delta consistency, and ledger/searchCoverage shape for explicit v2 records.
4. Add failing reducer/dashboard/report fixtures, then persist `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and Search Ledger output.
5. Add candidate-saturation and graphless-fallback STOP blockers using reducer-owned ledger state.
6. Add graph vocabulary for candidate coverage only after ledger semantics and gates are stable.
7. Add manual playbook scenarios and revisit iteration defaults/convergence thresholds after the schema proves useful.
<!-- /ANCHOR:implementation-order -->

<!-- ANCHOR:risks -->
## 7. Risks

- Overburdening low-risk reviews. Mitigation: lighter ledger requirements for trivial targets.
- Treating graph unavailability as a false blocker. Mitigation: require graphless fallback ledgers.
- Breaking legacy packet readability. Mitigation: versioned enforcement and warn-only handling for old records.
- Adding schema without operator visibility. Mitigation: ship reducer/dashboard/report changes with validator changes.
- Letting seeded tests arrive too late. Mitigation: write failing fixtures before each production slice.
- Adding graph vocabulary before the workflow can persist it. Mitigation: keep graph expansion ledger-led and gated by schema/upsert tests.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:continuation-refinements -->
## 8. Continuation Refinements

The five `xhigh` continuation iterations did not overturn the recommendation stack. They tightened it into an implementation-ready chain:

1. Prompt asks for candidate search.
2. Validator rejects fake, uncited, unlinked, or obligation-free rows.
3. Reducer preserves the rows and computes search debt.
4. Dashboard/report expose search debt next to severity debt.
5. Convergence blocks shallow STOP when required candidate coverage is unresolved.
6. Graph vocabulary mirrors the ledger only after the text/JSON ledger is stable.

The strongest acceptance sentence is: a standard or complex deep-review run may claim no findings only after it can show what risky targets were selected, which bug classes were searched, what evidence supports each clean or finding disposition, and what search debt remains.
<!-- /ANCHOR:continuation-refinements -->

<!-- ANCHOR:conclusion -->
## 9. Conclusion

Deep-review should not become deep-research. It should keep severity, findings-first review, release readiness, and stop-gate discipline. The missing piece is making absence-of-finding claims as auditable as active findings. A mandatory, versioned `searchLedger` gives deep-review the focused hypothesis persistence that makes bug-focused deep-research effective, while preserving deep-review's purpose as a review and quality gate.
<!-- /ANCHOR:conclusion -->
